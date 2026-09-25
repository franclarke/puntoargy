// "Traenos un problema": cada fila pasa del enredo a la ruta cuando llega a la pantalla.
// Al pasar el mouse, se vuelve a enredar y se endereza otra vez.

import { reduce, puedeHover, azar, lerp, tween, alVer } from './util.js';
import { polilinea } from './hilo.js';

const N = 44;

function puntosEnredo(semilla) {
  const rand = azar(semilla);
  const pts = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const giro = t * Math.PI * (5 + rand() * 2);
    const r = Math.sin(t * Math.PI) * (9 + rand() * 5);
    pts.push([6 + t * 100 + Math.cos(giro) * r * 1.4, 20 + Math.sin(giro) * r]);
  }
  return pts;
}
function puntosRecto() {
  const pts = [];
  for (let i = 0; i < N; i++) pts.push([6 + (i / (N - 1)) * 106, 20]);
  return pts;
}

export function iniciarCambios() {
  const filas = [...document.querySelectorAll('.cambio')];
  const recto = puntosRecto();
  filas.forEach((fila, k) => {
    const path = fila.querySelector('.cb-hilo path');
    const enr = puntosEnredo(101 + k * 7);
    let t = 0;
    let anim = 0;
    const pintar = (v) => { t = v; path.setAttribute('d', polilinea(enr.map((p, i) => [lerp(p[0], recto[i][0], v), lerp(p[1], recto[i][1], v)]))); };
    const hacia = (dest, ms) => {
      const id = ++anim;
      const desde = t;
      fila.classList.toggle('derecho', dest === 1);
      return tween(ms, (e) => { if (id === anim) pintar(lerp(desde, dest, e)); });
    };
    if (reduce) { pintar(1); fila.classList.add('derecho'); return; }
    pintar(0);
    const io = alVer(fila, () => { io.disconnect(); setTimeout(() => hacia(1, 900), 120); }, null, { margen: '0px 0px -22% 0px' });
    if (puedeHover) {
      fila.addEventListener('pointerenter', () => { if (t > .99) hacia(0, 260).then(() => hacia(1, 800)); });
    }
  });
}
