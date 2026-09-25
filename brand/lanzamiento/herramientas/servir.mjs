// Servidor estático mínimo para ver y renderizar el film (las fuentes no cargan desde file://).
// Uso: node herramientas/servir.mjs [puerto]   →   http://localhost:4330/film/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.mp4': 'video/mp4', '.wav': 'audio/wav' };

export function servir(puerto = 4330) {
  const srv = http.createServer((req, res) => {
    let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (ruta.endsWith('/')) ruta += 'index.html';
    const archivo = path.join(RAIZ, ruta);
    if (!archivo.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
    fs.readFile(archivo, (err, datos) => {
      if (err) { res.writeHead(404).end('no encontrado'); return; }
      res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(datos);
    });
  });
  return new Promise(ok => srv.listen(puerto, () => ok(srv)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const puerto = +(process.argv[2] || 4330);
  servir(puerto).then(() => console.log(`La punta → http://localhost:${puerto}/film/`));
}
