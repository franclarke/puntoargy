// 02 · Qué construimos. Una escena fija: el scroll avanza tres casos, cuatro pasos cada uno.
// Cada paso es un estado (data-paso) y el CSS anima el cambio. Lo que necesita medir
// (la lectura y el enredo del caso 2) se hace acá.

import { reduce, clamp, azar, espera, escena, alRedimensionar } from './util.js';
import { enredo, suave, ruta, preparar, posicion } from './hilo.js';
import { crearLectura } from './lectura.js';

const PASOS = 4;

/** El hilo flojo no va recto: entre puntos lejanos se agregan ondulaciones. */
function aflojar(pts, rand, amplitud) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const d = Math.hypot(bx - ax, by - ay);
    const n = Math.floor(d / 70);
    for (let k = 1; k <= n; k++) {
      const t = k / (n + 1);
      const off = (rand() - .5) * amplitud * Math.min(1, d / 260);
      out.push([ax + (bx - ax) * t - (by - ay) / d * off, ay + (by - ay) * t + (bx - ax) / d * off]);
    }
    out.push(pts[i]);
  }
  return out;
}

export function iniciarObra() {
  const obra = document.getElementById('obra');
  if (!obra) return;
  const casos = [...obra.querySelectorAll('.caso')];
  const N = casos.length * PASOS;
  const piezas = [...obra.querySelectorAll('.piezas-lista li')];
  const barras = [...obra.querySelectorAll('.obra-progreso i')];

  /* ── Caso 1: la lectura del audio y sus etiquetas, que pasan al pedido ── */
  const c1 = casos[0];
  const lec1 = crearLectura(c1.querySelector('.lectura'));
  const sp1 = [...c1.querySelectorAll('.c1-transcripcion .leer')];
  const destinos1 = [...c1.querySelectorAll('.c1-pedido .ui-lineas li'), c1.querySelector('.c1-pedido .ui-sub')];
  let est1 = -1;
  let tok1 = 0;
  async function caso1(paso) {
    if (paso === est1) return;
    const previo = est1;
    est1 = paso;
    const tok = ++tok1;
    if (paso === 0) { lec1.limpiar(); return; }
    if (paso === 1) {
      if (previo >= 2) lec1.limpiar();
      for (const s of sp1) {
        if (tok !== tok1) return;
        if (!lec1.tiene(s)) { lec1.leer(s); await espera(420); }
      }
      return;
    }
    if (previo >= 2) return;
    for (const s of sp1) if (!lec1.tiene(s)) { lec1.leer(s); await espera(160); }
    await espera(previo === 1 ? 200 : 900);
    if (tok !== tok1) return;
    sp1.forEach((s, i) => lec1.llevar(s, destinos1[i]));
  }

  /* ── Caso 3: la planilla se lee por columnas ── */
  const c3 = casos[2];
  const lec3 = crearLectura(c3.querySelector('.lectura'));
  const sp3 = [...c3.querySelectorAll('.c3-planilla .leer')];
  let est3 = -1;
  let tok3 = 0;
  async function caso3(paso) {
    if (paso === est3) return;
    const previo = est3;
    est3 = paso;
    const tok = ++tok3;
    if (paso === 0) { lec3.limpiar(); return; }
    if (paso === 1) {
      if (previo >= 2) lec3.limpiar();
      for (const s of sp3) {
        if (tok !== tok3) return;
        if (!lec3.tiene(s)) { lec3.leer(s); await espera(360); }
      }
      return;
    }
    sp3.forEach((s) => s.classList.add('leido'));
    lec3.ocultar();
  }

  /* ── Caso 2: el enredo (la única escena que lo usa) ── */
  const c2 = casos[1];
  const vista2 = c2.querySelector('.caso-vista');
  const svg2 = vista2.querySelector('.c2-svg');
  const [sombra, trazo] = svg2.querySelectorAll(':scope > path');
  const gRutas = svg2.querySelector('.c2-rutas');
  let Lh = 0;
  let rutas = [];
  let centro = null;
  function geometria2() {
    const W = vista2.clientWidth;
    const H = vista2.clientHeight;
    if (!W || !H) return;
    svg2.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const fuentes = [...vista2.querySelectorAll('.fuente')].map((f) => {
      const p = posicion(f, vista2);
      return { x: p.x + p.w / 2, y: p.y + p.h / 2, rx: p.w * .42, ry: p.h * .55 };
    });
    // El hilo visita cada fuente y vuelve a algunas: así se ve cruzar datos a mano.
    const rand = azar(31);
    const orden = [0, 3, 1, 4, 2, 0, 4, 1, 3].map((i) => fuentes[i]);
    const { pts } = enredo(orden, rand, { inicio: [-20, H * .46], fin: [W * .5, H * .5], vueltas: [.7, 1.4], rulos: 2, rulo: Math.max(14, W * .028) });
    const d = suave(aflojar(pts, rand, Math.max(24, W * .06)));
    Lh = preparar(trazo, d);
    preparar(sombra, d);
    // Las rutas: cada fuente se conecta una vez y todo llega al centro.
    gRutas.textContent = '';
    const cx = W * .5;
    const cy = H * .5;
    rutas = fuentes.map((f) => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      gRutas.appendChild(p);
      const L = preparar(p, ruta([[f.x, f.y], [f.x, cy], [cx, cy]], 22));
      return { p, L };
    });
    centro = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centro.setAttribute('cx', cx);
    centro.setAttribute('cy', cy);
    centro.setAttribute('r', 0);
    gRutas.appendChild(centro);
  }
  function caso2(x) {
    // x: posición en pasos (0 a N). El caso 2 ocupa de 4 a 8.
    const tEnredo = clamp((x - 4.55) / 1.25);
    const tRutas = clamp((x - 6.05) / 1.1);
    const fuera = clamp((x - 6) / .7);
    trazo.style.strokeDashoffset = Lh * (1 - tEnredo);
    sombra.style.strokeDashoffset = Lh * (1 - tEnredo);
    trazo.style.opacity = sombra.style.opacity = String(1 - fuera);
    rutas.forEach(({ p, L }) => { p.style.strokeDashoffset = L * (1 - tRutas); });
    if (centro) centro.setAttribute('r', (tRutas >= 1 ? 9 : 0).toString());
  }

  /* ── Estado general ── */
  let idxPrevio = -1;
  function pintar(p) {
    const x = p * N;
    const idx = Math.min(N - 1, Math.floor(x));
    const c = Math.floor(idx / PASOS);
    const paso = idx % PASOS;
    if (idx !== idxPrevio) {
      idxPrevio = idx;
      casos.forEach((caso, i) => {
        caso.classList.toggle('activo', i === c);
        caso.dataset.paso = String(i < c ? 3 : i > c ? 0 : paso);
      });
      piezas.forEach((li) => li.classList.toggle('hay', idx >= Number(li.dataset.desde)));
      const reuso = piezas.find((li) => li.dataset.pieza === 'pedidos');
      if (reuso) reuso.classList.toggle('reuso', idx >= 10);
      caso1(Number(c1.dataset.paso));
      caso3(c === 2 ? paso : (c < 2 ? 0 : 3));
    }
    barras.forEach((b, k) => b.style.setProperty('--p', clamp(p * casos.length - k).toFixed(3)));
    caso2(x);
  }

  geometria2();

  if (reduce) {
    obra.classList.add('sin-escena');
    casos.forEach((caso) => { caso.classList.add('activo'); caso.dataset.paso = '3'; });
    [...sp1, ...sp3].forEach((s) => s.classList.add('leido'));
    requestAnimationFrame(() => { geometria2(); caso2(N); });
    return;
  }

  escena(obra, pintar);
  alRedimensionar(() => {
    geometria2();
    lec1.recalcular();
    lec3.recalcular();
    idxPrevio = -1;
  });
}
