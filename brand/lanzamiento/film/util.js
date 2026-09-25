// Utilidades puras (sin DOM): curvas, polilíneas, azar determinista.

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => clamp((v - a) / (b - a));
export const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

// cubic-bezier como en CSS
export function bezier(x1, y1, x2, y2) {
  const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, C = a => 3 * a;
  const f = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const s = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 12; i++) { const d = s(t, x1, x2); if (Math.abs(d) < 1e-7) break; t -= (f(t, x1, x2) - x) / d; t = clamp(t); }
    return f(t, y1, y2);
  };
}
export const decidida = bezier(.65, 0, .15, 1);   // brand: todo lo que se mueve
export const llegada = bezier(.34, 1.56, .64, 1); // brand: solo el punto al llegar
export const suave = x => { x = clamp(x); return x * x * (3 - 2 * x); };

// Tramo animado: valor de a→b entre t0 y t1 con curva
export function tramo(t, t0, t1, a = 0, b = 1, curva = decidida) { return lerp(a, b, curva(invLerp(t0, t1, t))); }

// Azar determinista
export function azar(semilla = 1) {
  let s = semilla >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
// Ruido 1D suave (valor) determinista
export function ruido1(semilla = 1) {
  const r = azar(semilla), v = Array.from({ length: 512 }, r);
  return x => { const i = Math.floor(x), f = x - i, a = v[((i % 512) + 512) % 512], b = v[(((i + 1) % 512) + 512) % 512]; return lerp(a, b, suave(f)) * 2 - 1; };
}

// Catmull-Rom centrípeta muestreada: pasa por todos los puntos
export function catmull(pts, porTramo = 16) {
  const out = [];
  const n = pts.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    const d = dist(p1, p2);
    const k = Math.max(2, Math.ceil(porTramo * Math.min(4, d / 60 + .3)));
    for (let j = 0; j < k; j++) out.push(crPunto(p0, p1, p2, p3, j / k));
  }
  out.push(pts[n - 1].slice(0, 2));
  return out;
}
function crPunto(p0, p1, p2, p3, u) {
  const al = .5;
  const tj = (a, b) => Math.pow(Math.max(1e-6, dist(a, b)), al);
  const t0 = 0, t1 = t0 + tj(p0, p1), t2 = t1 + tj(p1, p2), t3 = t2 + tj(p2, p3);
  const t = lerp(t1, t2, u);
  const L = (a, b, ta, tb) => { const w = tb - ta < 1e-9 ? 0 : (t - ta) / (tb - ta); return [lerp(a[0], b[0], w), lerp(a[1], b[1], w)]; };
  const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3);
  const B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3);
  return L(B1, B2, t1, t2);
}

// Polilínea con largo acumulado
export class Linea {
  constructor(pts) {
    this.p = pts; this.s = new Float64Array(pts.length);
    for (let i = 1; i < pts.length; i++) this.s[i] = this.s[i - 1] + dist(pts[i - 1], pts[i]);
    this.largo = this.s[pts.length - 1] || 0;
  }
  indice(s) { // último i con this.s[i] <= s
    let lo = 0, hi = this.p.length - 1;
    if (s <= 0) return 0; if (s >= this.largo) return hi - 1 < 0 ? 0 : hi - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (this.s[m] <= s) lo = m; else hi = m; }
    return lo;
  }
  en(s) {
    const n = this.p.length; if (n === 1) return this.p[0];
    s = clamp(s, 0, this.largo); const i = this.indice(s), j = Math.min(n - 1, i + 1);
    const ds = this.s[j] - this.s[i], f = ds > 0 ? (s - this.s[i]) / ds : 0;
    return [lerp(this.p[i][0], this.p[j][0], f), lerp(this.p[i][1], this.p[j][1], f)];
  }
  dir(s) {
    const a = this.en(s - 2), b = this.en(s + 2), l = dist(a, b) || 1;
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
  }
  // puntos entre s0 y s1 (incluye extremos interpolados)
  tramo(s0, s1) {
    s0 = clamp(s0, 0, this.largo); s1 = clamp(s1, 0, this.largo);
    if (s1 <= s0) return [this.en(s0)];
    const out = [this.en(s0)];
    const i0 = this.indice(s0) + 1, i1 = this.indice(s1);
    for (let i = i0; i <= i1; i++) out.push(this.p[i]);
    out.push(this.en(s1));
    return out;
  }
}

// Ruta ortogonal con esquinas redondeadas → puntos densos + marcas de esquina
export function rutaRedondeada(vertices, r, paso = 6) {
  const pts = [], esquinas = [];
  const push = p => { const u = pts[pts.length - 1]; if (!u || dist(u, p) > 1e-6) pts.push(p); };
  push(vertices[0]);
  for (let i = 1; i < vertices.length - 1; i++) {
    const a = vertices[i - 1], b = vertices[i], c = vertices[i + 1];
    const l1 = dist(a, b), l2 = dist(b, c);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const d1 = [(b[0] - a[0]) / l1, (b[1] - a[1]) / l1], d2 = [(c[0] - b[0]) / l2, (c[1] - b[1]) / l2];
    const p1 = [b[0] - d1[0] * rr, b[1] - d1[1] * rr], p2 = [b[0] + d2[0] * rr, b[1] + d2[1] * rr];
    lineaDensa(pts[pts.length - 1], p1, paso, push);
    // arco: centro en p1 + normal hacia adentro
    const cruz = d1[0] * d2[1] - d1[1] * d2[0];
    const n = cruz > 0 ? [-d1[1], d1[0]] : [d1[1], -d1[0]];
    const cen = [p1[0] + n[0] * rr, p1[1] + n[1] * rr];
    const a0 = Math.atan2(p1[1] - cen[1], p1[0] - cen[0]), a1 = Math.atan2(p2[1] - cen[1], p2[0] - cen[0]);
    let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    const k = Math.max(6, Math.ceil(Math.abs(da) * rr / paso));
    const iEntrada = pts.length - 1;
    for (let j = 1; j <= k; j++) push([cen[0] + Math.cos(a0 + da * j / k) * rr, cen[1] + Math.sin(a0 + da * j / k) * rr]);
    esquinas.push({ vertice: b, centro: cen, radio: rr, iEntrada, iSalida: pts.length - 1, dEntrada: d1, dSalida: d2 });
  }
  lineaDensa(pts[pts.length - 1], vertices[vertices.length - 1], paso, push);
  const linea = new Linea(pts);
  esquinas.forEach(e => { e.sEntrada = linea.s[e.iEntrada]; e.sSalida = linea.s[e.iSalida]; });
  return { linea, esquinas };
}
function lineaDensa(a, b, paso, push) {
  const n = Math.max(1, Math.ceil(dist(a, b) / paso));
  for (let i = 1; i <= n; i++) push([lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n)]);
}

export function rot(p, c, ang) {
  const s = Math.sin(ang), k = Math.cos(ang), x = p[0] - c[0], y = p[1] - c[1];
  return [c[0] + x * k - y * s, c[1] + x * s + y * k];
}
