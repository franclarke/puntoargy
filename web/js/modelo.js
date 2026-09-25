// Capítulo 04 · Cómo nace un producto. La ruta avanza con el scroll: problema → a medida → patrón → producto.

import { reduce, clamp, escena, alRedimensionar } from './util.js';
import { posicion, preparar } from './hilo.js';

export function iniciarModelo() {
  const rec = document.getElementById('modelo-recorrido');
  if (!rec) return;
  const svg = rec.querySelector('.modelo-svg');
  const [base, trazo] = svg.querySelectorAll('path');
  const senal = svg.querySelector('.senal');
  const pasos = [...rec.querySelectorAll('.mp')];
  const nodos = pasos.map((p) => p.querySelector('.mp-nodo'));
  let g = null;

  function geometria() {
    const W = rec.clientWidth;
    const H = rec.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const c = nodos.map((n) => { const p = posicion(n, rec); return [p.x + p.w / 2, p.y + p.h / 2]; });
    const vertical = Math.abs(c[c.length - 1][0] - c[0][0]) < 4;
    const d = `M${c[0][0].toFixed(1)} ${c[0][1].toFixed(1)}L${c[c.length - 1][0].toFixed(1)} ${c[c.length - 1][1].toFixed(1)}`;
    base.setAttribute('d', d);
    const L = preparar(trazo, d);
    const eje = vertical ? 1 : 0;
    // En la grilla de 2 columnas los nodos no quedan alineados: se dibuja solo la base.
    const alineados = vertical || c.every((q) => Math.abs(q[1] - c[0][1]) < 4);
    svg.style.display = alineados ? '' : 'none';
    g = { c, L, eje, largos: c.map((q) => Math.abs(q[eje] - c[0][eje])), alineados };
  }

  function pintar() {
    if (!g) return;
    const r = rec.getBoundingClientRect();
    const vh = window.innerHeight;
    let d;
    if (g.eje === 1) d = clamp(vh * .6 - r.top - g.c[0][1], 0, g.L);
    else d = g.L * clamp((vh * .78 - r.top) / (vh * .55));
    trazo.style.strokeDashoffset = g.L - d;
    const x = g.eje === 0 ? g.c[0][0] + d : g.c[0][0];
    const y = g.eje === 1 ? g.c[0][1] + d : g.c[0][1];
    senal.setAttribute('cx', x.toFixed(1));
    senal.setAttribute('cy', y.toFixed(1));
    senal.style.opacity = d > g.L - 2 ? 0 : 1;
    pasos.forEach((p, i) => p.classList.toggle('activo', !g.alineados ? r.top < vh * .7 : d >= g.largos[i] - 3));
  }

  geometria();
  if (reduce) {
    trazo.style.strokeDashoffset = 0;
    senal.style.opacity = 0;
    pasos.forEach((p) => p.classList.add('activo'));
    return;
  }
  escena(rec, pintar, { siempre: true });
  alRedimensionar(() => { geometria(); pintar(); });
}
