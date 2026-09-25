// Hoja de contactos: junta los PNG de una carpeta en una grilla con su tiempo.
//   node herramientas/hoja.mjs salida/rev1 [columnas] [ancho-celda]  → salida/rev1.hoja.png
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const dir = path.resolve(process.argv[2]);
const cols = +(process.argv[3] || 4), anchoCelda = +(process.argv[4] || 640);
const pngs = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
const lista = path.join(dir, '_lista.txt');
fs.writeFileSync(lista, pngs.map(f => `file '${path.join(dir, f).replace(/\\/g, '/')}'\nduration 1`).join('\n') + '\n');
const filas = Math.ceil(pngs.length / cols);
const fuente = ['C:/Windows/Fonts/arial.ttf', '/System/Library/Fonts/Helvetica.ttc', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'].find(f => fs.existsSync(f));
const etiqueta = fuente ? `,drawtext=fontfile='${fuente.replace(':', '\\:')}':text='%{metadata\\:etiqueta}':x=10:y=10:fontsize=22:fontcolor=white:box=1:boxcolor=0x1C1B19@0.7:boxborderw=6` : '';
// la etiqueta se pasa como metadato por cuadro usando el nombre del archivo
const salida = dir + '.hoja.png';
const filtros = pngs.map((f, i) => `[${i}:v]scale=${anchoCelda}:-1,drawtext=fontfile='${fuente.replace(':', '\\:')}':text='${f.replace('.png', '').replace(/^t0*/, '').replace(/^0+(?=\d)/, '')}':x=10:y=10:fontsize=22:fontcolor=white:box=1:boxcolor=0x1C1B19@0.7:boxborderw=6[v${i}]`).join(';');
const pad = Array.from({ length: filas * cols - pngs.length }, (_, k) => `color=c=0x1C1B19:s=${anchoCelda}x${Math.round(anchoCelda * 9 / 16)}:d=1[p${k}]`).join(';');
const entradas = pngs.map((_, i) => `[v${i}]`).join('') + Array.from({ length: filas * cols - pngs.length }, (_, k) => `[p${k}]`).join('');
const xstack = `${entradas}xstack=inputs=${filas * cols}:layout=${Array.from({ length: filas * cols }, (_, i) => `${(i % cols) ? Array.from({ length: i % cols }, () => 'w0').join('+') : '0'}_${Math.floor(i / cols) ? Array.from({ length: Math.floor(i / cols) }, () => 'h0').join('+') : '0'}`).join('|')}`;
const args = ['-loglevel', 'error', '-y', ...pngs.flatMap(f => ['-i', path.join(dir, f)]), '-filter_complex', [filtros, pad, xstack].filter(Boolean).join(';'), '-frames:v', '1', salida];
execFileSync('ffmpeg', args, { stdio: 'inherit' });
fs.unlinkSync(lista);
console.log(path.relative(process.cwd(), salida));
