// Film completo: cuadros + sonido + codificación.
//   node herramientas/film.mjs [nombre] [--sin-cuadros]   →   salida/<nombre>.mp4 (por defecto la-punta)
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nombre = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'la-punta';
const correr = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit', cwd: RAIZ });

if (!process.argv.includes('--sin-cuadros')) {
  fs.rmSync(path.join(RAIZ, 'salida/cuadros'), { recursive: true, force: true });
  correr('node', ['herramientas/render.mjs', '--dir', 'salida/cuadros']);
}
correr('node', ['herramientas/audio.mjs']);

// Sonoridad: loudnorm en dos pasadas (modo lineal) a -16 LUFS, pico -1.5 dBTP
const objetivo = 'I=-16:TP=-1.5:LRA=20';
const pasada = spawnSync('ffmpeg', ['-hide_banner', '-i', 'salida/audio.wav', '-af', `loudnorm=${objetivo}:print_format=json`, '-f', 'null', '-'], { cwd: RAIZ, encoding: 'utf8' });
const m = JSON.parse(pasada.stderr.slice(pasada.stderr.lastIndexOf('{'), pasada.stderr.lastIndexOf('}') + 1));
const filtro = `loudnorm=${objetivo}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
console.log(`sonoridad medida ${m.input_i} LUFS, pico ${m.input_tp} dBTP`);

correr('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', '30', '-i', 'salida/cuadros/%05d.png', '-i', 'salida/audio.wav',
  '-af', filtro + ',aresample=48000,aformat=channel_layouts=stereo',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-tune', 'animation', '-movflags', '+faststart',
  '-c:a', 'aac', '-b:a', '256k', '-shortest', `salida/${nombre}.mp4`]);
console.log(`salida/${nombre}.mp4`);
