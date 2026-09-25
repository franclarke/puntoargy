// Geometría del hilo (sección 19.1: trazo híbrido).
// El problema es orgánico: curvas irregulares que dan vueltas alrededor de las herramientas.
// La solución es geométrica: tramos rectos con esquinas redondeadas.

import { NS, lerp } from './util.js';

/**
 * Puntos de un enredo que pasa por cada ancla dando vueltas a su alrededor.
 * anclas: [{ x, y, rx, ry }] en coordenadas del lienzo.
 * Devuelve { pts, marcas } donde marcas[i] es el índice del último punto de la vuelta i.
 */
export function enredo(anclas, rand, { inicio, fin, vueltas = [.7, 1.5], rulos = 1, rulo = 26 } = {}) {
  const pts = [inicio];
  const marcas = [];
  let prev = inicio;
  anclas.forEach((a) => {
    // Rulos sueltos en el camino: el hilo flojo se enrosca solo.
    for (let k = 0; k < rulos; k++) {
      if (rand() < .35) continue;
      const t = (k + 1) / (rulos + 1);
      const cx = lerp(prev[0], a.x, t) + (rand() - .5) * a.rx * .9;
      const cy = lerp(prev[1], a.y, t) + (rand() - .5) * a.ry * .9;
      const r = rulo * (.6 + rand() * .8);
      const ang0 = Math.atan2(prev[1] - cy, prev[0] - cx);
      const dir = rand() < .5 ? 1 : -1;
      for (let j = 0; j <= 11; j++) {
        const ang = ang0 + dir * (j / 11) * Math.PI * 2.1;
        pts.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * .85]);
      }
    }
    // La vuelta alrededor de la herramienta.
    const ang0 = Math.atan2(prev[1] - a.y, prev[0] - a.x);
    const dir = rand() < .5 ? 1 : -1;
    const giro = lerp(vueltas[0], vueltas[1], rand());
    const n = Math.ceil(13 * giro) + 4;
    for (let k = 0; k <= n; k++) {
      const ang = ang0 + dir * (k / n) * giro * Math.PI * 2;
      const rr = 1 + (rand() - .5) * .28;
      pts.push([a.x + Math.cos(ang) * a.rx * rr, a.y + Math.sin(ang) * a.ry * rr]);
    }
    marcas.push(pts.length - 1);
    prev = pts[pts.length - 1];
  });
  if (fin) { pts.push(fin); marcas.push(pts.length - 1); }
  return { pts, marcas };
}

/** Tramos Bézier cúbicos (Catmull-Rom) que pasan por todos los puntos: [p1, c1, c2, p2]. */
function tramos(pts, tension = 1) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * tension, p1[1] + (p2[1] - p0[1]) / 6 * tension];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * tension, p2[1] - (p3[1] - p1[1]) / 6 * tension];
    out.push([p1, c1, c2, p2]);
  }
  return out;
}

/** Curva suave (Catmull-Rom → Bézier cúbica) que pasa por todos los puntos. */
export function suave(pts, tension = 1) {
  if (pts.length < 2) return '';
  const f = (n) => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  tramos(pts, tension).forEach(([, c1, c2, p2]) => {
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  });
  return d;
}

/** Puntos cada `paso` px a lo largo de la curva suave. Se calcula en JS:
    getPointAtLength recorre todo el trazado en cada llamada y en hilos largos tarda segundos. */
export function muestrearCurva(pts, paso = 5) {
  const denso = [pts[0]];
  tramos(pts).forEach(([a, b, c, d]) => {
    const n = Math.max(4, Math.ceil(Math.hypot(d[0] - a[0], d[1] - a[1]) / 2) + Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4) + Math.ceil(Math.hypot(d[0] - c[0], d[1] - c[1]) / 4));
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      const u = 1 - t;
      denso.push([
        u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
        u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
      ]);
    }
  });
  // Remuestreo a distancia constante.
  const out = [denso[0]];
  let resto = paso;
  for (let i = 1; i < denso.length; i++) {
    let [x0, y0] = denso[i - 1];
    const [x1, y1] = denso[i];
    let seg = Math.hypot(x1 - x0, y1 - y0);
    while (seg >= resto) {
      const t = resto / seg;
      x0 += (x1 - x0) * t;
      y0 += (y1 - y0) * t;
      out.push([x0, y0]);
      seg -= resto;
      resto = paso;
    }
    resto -= seg;
  }
  out.push(denso[denso.length - 1]);
  return out;
}

/** Ruta geométrica: tramos rectos unidos por esquinas redondeadas de radio R. */
export function ruta(pts, R = 28) {
  const f = (n) => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const [cx, cy] = pts[i + 1];
    const l1 = Math.hypot(bx - ax, by - ay);
    const l2 = Math.hypot(cx - bx, cy - by);
    const r = Math.min(R, l1 / 2, l2 / 2);
    const p = [bx - (bx - ax) / l1 * r, by - (by - ay) / l1 * r];
    const q = [bx + (cx - bx) / l2 * r, by + (cy - by) / l2 * r];
    d += `L${f(p[0])} ${f(p[1])}Q${f(bx)} ${f(by)} ${f(q[0])} ${f(q[1])}`;
  }
  const u = pts[pts.length - 1];
  d += `L${f(u[0])} ${f(u[1])}`;
  return d;
}

// Un único <svg> oculto para medir trazados.
let medidor;
function lienzo() {
  if (!medidor) {
    medidor = document.createElementNS(NS, 'svg');
    medidor.setAttribute('aria-hidden', 'true');
    medidor.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none';
    document.body.appendChild(medidor);
  }
  return medidor;
}
export function medir(d) {
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', d);
  lienzo().appendChild(p);
  const L = p.getTotalLength();
  p.remove();
  return L;
}
export function polilinea(pts) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) d += `L${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  return d;
}

/** Posición de un elemento relativa a un ancestro, ignorando transformaciones (usa el layout). */
export function posicion(el, ancestro) {
  let x = 0;
  let y = 0;
  let n = el;
  while (n && n !== ancestro) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
    if (n && n !== ancestro && !ancestro.contains(n)) break;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/** Prepara un trazo para dibujarse con stroke-dashoffset. Devuelve su largo. */
export function preparar(path, d) {
  path.setAttribute('d', d);
  const L = path.getTotalLength();
  path.style.strokeDasharray = `${L} ${L + 2}`;
  path.style.strokeDashoffset = L;
  return L;
}
