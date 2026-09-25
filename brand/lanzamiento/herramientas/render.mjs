// Renderiza cuadros del film con Chrome sin cabeza. Determinista: cada cuadro es función de su tiempo.
//
//   node herramientas/render.mjs                    → todos los cuadros a salida/cuadros/
//   node herramientas/render.mjs --desde 900 --hasta 1080
//   node herramientas/render.mjs --tiempos 0,2.4,7.5 --dir salida/revision   → cuadros sueltos (PNG)
//   node herramientas/render.mjs --paso 15 --dir salida/hoja                  → uno cada 15 cuadros
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { servir } from './servir.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const CHROME = arg('chrome', ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(p => fs.existsSync(p)));
const dir = path.resolve(RAIZ, arg('dir', 'salida/cuadros'));
fs.mkdirSync(dir, { recursive: true });

const puerto = 4331 + Math.floor(Math.random() * 400);
const srv = await servir(puerto);
const hilos = Math.max(1, Math.min(+arg('hilos', Math.max(1, Math.floor(os.cpus().length / 3))), 8));

async function pagina(navegador) {
  const p = await navegador.newPage();
  await p.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('Error en la página:', e.message));
  await p.goto(`http://localhost:${puerto}/film/?render`, { waitUntil: 'load' });
  await p.waitForFunction('window.filmListo === true', { timeout: 60000 });
  return p;
}
async function cuadroPNG(p, t) {
  const b64 = await p.evaluate(tt => { window.dibujarTiempo(tt); return document.getElementById('film').toDataURL('image/png').split(',')[1]; }, t);
  return Buffer.from(b64, 'base64');
}

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--disable-gpu', '--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars'] });
const t0 = Date.now();
try {
  const info = await (await pagina(navegador)).evaluate(() => window.filmInfo);
  let trabajos = [];
  if (arg('tiempos')) trabajos = arg('tiempos').split(',').map(Number).map(t => ({ t, nombre: `t${t.toFixed(2).padStart(6, '0')}.png` }));
  else {
    const desde = +arg('desde', 0), hasta = +arg('hasta', info.cuadros - 1), paso = +arg('paso', 1);
    for (let f = desde; f <= hasta; f += paso) trabajos.push({ t: f / info.fps, nombre: `${String(f).padStart(5, '0')}.png` });
  }
  const paginas = await Promise.all(Array.from({ length: Math.min(hilos, trabajos.length) }, () => pagina(navegador)));
  let hechos = 0;
  await Promise.all(paginas.map(async (p, k) => {
    for (let i = k; i < trabajos.length; i += paginas.length) {
      fs.writeFileSync(path.join(dir, trabajos[i].nombre), await cuadroPNG(p, trabajos[i].t));
      hechos++;
      if (hechos % 30 === 0 || hechos === trabajos.length) process.stdout.write(`\r${hechos}/${trabajos.length} cuadros · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
  }));
  console.log(`\nListo en ${path.relative(RAIZ, dir)}`);
} finally {
  await navegador.close(); srv.close();
}
