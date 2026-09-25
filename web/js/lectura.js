// La capa de lectura: cómo mostramos que entendemos el mundo real.
// El resaltado marca lo que importa (CSS, dentro del objeto: gira con él),
// el punto lo confirma y la etiqueta dice qué es. La línea que los une es la de la marca:
// tramos rectos y esquinas redondeadas (sección 19.1).

import { NS, reduce, espera } from './util.js';
import { ruta } from './hilo.js';

const GAP = 22;      // distancia entre el objeto y la etiqueta
const SEP = 8;       // separación mínima entre etiquetas

function rel(r, base) {
  return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height, r: r.right - base.left, b: r.bottom - base.top };
}
function choca(a, b) {
  return a.x < b.x + b.w + SEP && b.x < a.x + a.w + SEP && a.y < b.y + b.h + SEP && b.y < a.y + a.h + SEP;
}

/**
 * Crea una capa de lectura sobre `capa` (un elemento .lectura, posicionado sobre la escena).
 * modo 'margen': la etiqueta va afuera del objeto, al costado (anotación al margen).
 * modo 'cerca': la etiqueta va al lado del punto, o arriba si no entra (para las láminas).
 */
export function crearLectura(capa, { modo = 'margen' } = {}) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  capa.appendChild(svg);
  const items = new Map(); // span → { etq, path, lado }

  // Dónde termina lo leído: la última línea del resaltado.
  function punto(span, base) {
    const rs = span.getClientRects();
    const r = rs[rs.length - 1] || span.getBoundingClientRect();
    return { x: r.right - base.left, y: r.top - base.top + r.height / 2, top: r.top - base.top, bottom: r.bottom - base.top, cx: r.left - base.left + r.width / 2 };
  }

  function ubicar(span, it) {
    const base = capa.getBoundingClientRect();
    const W = base.width;
    const H = base.height;
    const p = punto(span, base);
    const obj = span.closest('.obj, .papel, .ui') || span;
    const o = rel(obj.getBoundingClientRect(), base);
    // El punto se apoya en el borde de lo que contiene el texto (la burbuja, la celda, el papel): no tapa letras.
    const cont = rel((span.closest('.burbuja, td, th, .obj, .papel, .ui, p') || obj).getBoundingClientRect(), base);
    const w = it.etq.offsetWidth;
    const h = it.etq.offsetHeight;
    let x;
    let y;
    let lado = span.dataset.lado || obj.dataset.lado || 'der';
    if (modo === 'cerca') {
      // Al lado del punto si entra; si no, arriba.
      if (p.x + 22 + w <= W - 4) { lado = 'cerca'; x = p.x + 22; y = p.y - h / 2; }
      else { lado = 'arr'; x = Math.max(0, Math.min(W - w, p.cx - w / 2)); y = p.top - h - 20; }
    } else {
      const entraDer = o.r + GAP + w <= W - 4;
      const entraIzq = o.x - GAP - w >= 4;
      if (lado === 'der' && !entraDer) lado = entraIzq ? 'izq' : 'aba';
      if (lado === 'izq' && !entraIzq) lado = entraDer ? 'der' : 'aba';
      if (lado === 'aba' && o.b + GAP + h > H - 2) lado = 'arr';
      if (lado === 'der') x = o.r + GAP;
      else if (lado === 'izq') x = o.x - GAP - w;
      else x = Math.max(4, Math.min(W - w - 4, p.cx - w / 2));
      if (lado === 'arr') y = o.y - h - GAP;
      else if (lado === 'aba') y = o.b + GAP;
      else y = p.y - h / 2;
    }
    // Sin superponerse con las etiquetas ya ubicadas.
    const otras = [...items.values()].filter((o2) => o2 !== it && o2.caja);
    let caja = { x, y, w, h };
    for (let n = 0; n < 12 && otras.some((o2) => choca(caja, o2.caja)); n++) {
      const chocan = otras.filter((o2) => choca(caja, o2.caja)).map((o2) => o2.caja);
      const xDer = Math.max(...chocan.map((c) => c.x + c.w)) + SEP;
      if ((lado === 'arr' || lado === 'aba') && xDer + w <= W - 4) caja = { ...caja, x: xDer };
      else if (lado === 'arr') caja = { ...caja, y: Math.min(...chocan.map((c) => c.y)) - h - SEP };
      else caja = { ...caja, y: Math.max(...chocan.map((c) => c.y + c.h)) + SEP };
    }
    caja.y = Math.max(2, Math.min(H - h - 2, caja.y));
    it.caja = caja;
    it.etq.style.left = `${caja.x.toFixed(1)}px`;
    it.etq.style.top = `${caja.y.toFixed(1)}px`;
    // El punto y la línea: del borde del contenedor a la etiqueta, con tramos rectos.
    const cy = caja.y + h / 2;
    let m;
    let pts;
    if (lado === 'cerca') {
      m = [p.x + 5, p.y];
      pts = [m, [caja.x - 8, m[1]], [caja.x - 8, cy], [caja.x, cy]];
    } else if (lado === 'der') {
      m = [cont.r + 4, p.y];
      pts = [m, [caja.x - 12, m[1]], [caja.x - 12, cy], [caja.x, cy]];
    } else if (lado === 'izq') {
      m = [cont.x - 4, p.y];
      pts = [m, [caja.x + w + 12, m[1]], [caja.x + w + 12, cy], [caja.x + w, cy]];
    } else {
      const ax = caja.x + Math.min(w - 12, Math.max(12, p.cx - caja.x));
      if (lado === 'aba') {
        m = [p.cx, p.bottom + 4];
        pts = [m, [p.cx, caja.y - 10], [ax, caja.y - 10], [ax, caja.y]];
      } else {
        m = [p.cx, p.top - 4];
        pts = [m, [p.cx, caja.y + h + 10], [ax, caja.y + h + 10], [ax, caja.y + h]];
      }
    }
    // Dos lecturas en la misma línea: los puntos no se pisan.
    const usados = [...items.values()].filter((o2) => o2 !== it && o2.m).map((o2) => o2.m);
    for (let n = 0; n < 4 && usados.some((u) => Math.hypot(u[0] - m[0], u[1] - m[1]) < 9); n++) m[1] += 9;
    pts[0] = m;
    it.m = m;
    it.marca.setAttribute('cx', m[0].toFixed(1));
    it.marca.setAttribute('cy', m[1].toFixed(1));
    // Quita tramos de largo cero para que las esquinas no se deformen.
    pts = pts.filter((q, i) => i === 0 || Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) > .5);
    it.path.setAttribute('d', pts.length > 1 ? ruta(pts, 8) : '');
    it.lado = lado;
  }

  /** Lee un span: resaltado + punto, y después la etiqueta con su línea. */
  async function leer(span, { etiqueta = true } = {}) {
    span.classList.add('leido');
    if (!etiqueta || items.has(span)) return;
    const etq = document.createElement('span');
    etq.className = 'etq';
    etq.innerHTML = '<i></i>';
    etq.appendChild(document.createTextNode(span.dataset.etq || span.textContent));
    capa.appendChild(etq);
    const path = document.createElementNS(NS, 'path');
    svg.appendChild(path);
    const marca = document.createElementNS(NS, 'circle');
    marca.setAttribute('r', '3.8');
    marca.setAttribute('class', 'marca');
    svg.appendChild(marca);
    const it = { etq, path, marca };
    items.set(span, it);
    ubicar(span, it);
    const L = path.getTotalLength ? path.getTotalLength() : 0;
    if (reduce) { etq.classList.add('ve'); marca.classList.add('ve'); return; }
    path.style.strokeDasharray = `${L} ${L + 4}`;
    path.style.strokeDashoffset = L;
    await espera(380);
    marca.classList.add('ve');
    await espera(120);
    if (!items.has(span)) return;
    path.getBoundingClientRect();
    path.style.strokeDashoffset = 0;
    await espera(260);
    etq.classList.add('ve');
  }

  /** Lleva la etiqueta de `span` hasta `destino` y la hace desaparecer ahí: la información pasa a ser estructura. */
  function llevar(span, destino) {
    const it = items.get(span);
    if (!it || it.llevada) return;
    it.llevada = true;
    const base = capa.getBoundingClientRect();
    const d = rel(destino.getBoundingClientRect(), base);
    const dx = d.x + 6 - it.caja.x;
    const dy = d.y + d.h / 2 - it.etq.offsetHeight / 2 - it.caja.y;
    it.path.style.opacity = '0';
    it.marca.classList.remove('ve');
    it.etq.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    setTimeout(() => { if (it.llevada) it.etq.classList.add('se-va'); }, reduce ? 0 : 560);
  }

  /** Esconde etiquetas y líneas; el resaltado queda. */
  function ocultar() {
    items.forEach((it) => { it.etq.classList.add('se-va'); it.path.style.opacity = '0'; it.marca.classList.remove('ve'); it.oculta = true; });
  }

  function limpiar(spans) {
    const lista = spans || [...items.keys()];
    lista.forEach((span) => {
      span.classList.remove('leido');
      const it = items.get(span);
      if (!it) return;
      it.etq.remove();
      it.path.remove();
      it.marca.remove();
      items.delete(span);
    });
  }

  function recalcular() {
    items.forEach((it) => { if (!it.llevada) { it.caja = null; it.m = null; } });
    items.forEach((it, span) => { if (!it.llevada) ubicar(span, it); });
  }

  return { leer, llevar, ocultar, limpiar, recalcular, tiene: (s) => items.has(s) };
}
