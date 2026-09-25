// Detalles impresos de los objetos de la mesa: códigos QR y de barras.
// Son decorativos: se generan con una semilla para que siempre salgan iguales.

import { NS, azar } from './util.js';

function qr(semilla) {
  const n = 21;
  const rand = azar(semilla);
  const m = [];
  for (let y = 0; y < n; y++) {
    m.push([]);
    for (let x = 0; x < n; x++) m[y].push(rand() < .48);
  }
  // Patrones de posición en tres esquinas.
  const ojo = (ox, oy) => {
    for (let y = -1; y < 8; y++) {
      for (let x = -1; x < 8; x++) {
        const X = ox + x;
        const Y = oy + y;
        if (X < 0 || Y < 0 || X >= n || Y >= n) continue;
        const borde = x === 0 || x === 6 || y === 0 || y === 6;
        const centro = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        m[Y][X] = x >= 0 && x <= 6 && y >= 0 && y <= 6 && (borde || centro);
      }
    }
  };
  ojo(0, 0); ojo(n - 7, 0); ojo(0, n - 7);
  let d = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) if (m[y][x]) d += `M${x} ${y}h1v1h-1z`;
  }
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `-1 -1 ${n + 2} ${n + 2}`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', d);
  p.setAttribute('fill', 'currentColor');
  svg.appendChild(p);
  return svg;
}

function barras(cantidad, semilla) {
  const rand = azar(semilla);
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('barras');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  let x = 0;
  let d = '';
  for (let i = 0; i < cantidad; i++) {
    const w = rand() < .3 ? 2 : 1;
    d += `M${x} 0h${w}v10h-${w}z`;
    x += w + (rand() < .5 ? 1 : 2);
  }
  svg.setAttribute('viewBox', `0 0 ${x} 10`);
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', d);
  p.setAttribute('fill', 'currentColor');
  svg.appendChild(p);
  return svg;
}

export function iniciarObjetos() {
  document.querySelectorAll('[data-qr]').forEach((el) => el.appendChild(qr(Number(el.dataset.qr) || 1)));
  document.querySelectorAll('[data-barras]').forEach((el, i) => el.appendChild(barras(Number(el.dataset.barras) || 40, 11 + i)));
}
