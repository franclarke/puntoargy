// La punta · guion ejecutable.
// Todo lo que pasa en el film es función del tiempo (segundos). Sin DOM: lo usan la imagen y el audio.

import { clamp, lerp, invLerp, dist, decidida, llegada, tramo, azar, ruido1, catmull, Linea, rutaRedondeada, rot } from './util.js';

export const FPS = 30, DURACION = 42.4, CUADROS = FPS * DURACION, ANCHO = 1920, ALTO = 1080;

export const COLOR = {
  piedra: '#F2F1ED', superficie: '#FAF9F6', linea: '#E1DED7', hilo: '#A8A39A', texto2: '#625E57',
  tinta: '#1C1B19', celeste: '#74ACDF', profundo: '#2A6599', sol: '#F6B40E', sombra: '#5A4D3C'
};

// ---------- Tiempos clave (ver TIMELINE.md) ----------
export const T = {
  zumbido1: 1.5, parte: 1.72, texto1: [7.0, 7.55], zumbido2: 8.9, texto1Sale: [9.0, 9.4],
  silencio: 20.8, busca: [22.2, 25.2], texto2: [23.6, 24.15], punto: 24.9, texto2Sale: [26.1, 26.5],
  tiron: [26.4, 32.4], aterriza: 31.78, zumbidoFinal: 33.4, senal: [33.5, 34.5],
  logo: [34.5, 35.05], camLogo: [35.1, 37.6], tagline: [37.5, 38.05], url: [39.0, 39.32], fin: 42.4
};

// ---------- Grosores ----------
export const G_HILO = 8, G_LINEA = 18, R_PUNTA = 12, R_PUNTO = 42;

// ---------- Ruta final (tramos rectos, esquinas redondeadas) ----------
// Una fila de herramientas sobre un primer tramo largo; la ruta sube desde la esquina de la calculadora hasta el punto.
export const Q0 = [-3100, 500];            // el hilo viene de fuera de cuadro
export const D = [640, -520];              // donde aterriza el punto
const VERTICES = [Q0, [0, 500], [0, -520], D];
export const RUTA = rutaRedondeada(VERTICES, 80, 4);
const C = RUTA.esquinas;
export const U_T0 = C[0].sEntrada;          // la punta se detiene justo en la esquina de la calculadora
export const T0 = RUTA.linea.en(U_T0);

// ---------- Objetos ----------
// Pose final (alineada). x,y = esquina de la cara superior; h = alto de la cara superior; d = frente.
const HW = G_LINEA / 2, GAP = 16;
function arribaIzq(esq, w, h, d) { return { x: esq.vertice[0] - HW - GAP - w, y: esq.vertice[1] - HW - GAP - d - h }; }
function abajoDer(esq) { return { x: esq.vertice[0] + HW + GAP, y: esq.vertice[1] + HW + GAP }; }

export const OBJETOS = [
  // arriba del primer tramo (base del frente a GAP de la línea)
  { id: 'cuaderno', tipo: 'cuaderno', w: 320, h: 420, d: 34, r: 16, x: -1760, y: 500 - HW - GAP - 34 - 420, ini: { dx: -14, dy: 10, rot: -3.5 } },
  { id: 'planilla', tipo: 'planilla', w: 400, h: 300, d: 5, r: 6, x: -1330, y: 500 - HW - GAP - 5 - 300, ini: { dx: 4, dy: -10, rot: 2.5 } },
  { id: 'celular', tipo: 'celular', w: 190, h: 370, d: 26, r: 38, x: -800, y: 500 - HW - GAP - 26 - 370, ini: { dx: 14, dy: -4, rot: 6 } },
  { id: 'calculadora', tipo: 'calculadora', w: 230, h: 320, d: 48, r: 30, ...arribaIzq(C[0], 230, 320, 48), ini: { dx: -10, dy: 12, rot: -5 } },
  // abajo
  { id: 'caja', tipo: 'caja', w: 330, h: 230, d: 80, r: 12, x: -1080, y: 500 + HW + GAP, ini: { dx: 8, dy: 6, rot: -4 } }
];
export const OBJ = Object.fromEntries(OBJETOS.map(o => [o.id, o]));
OBJETOS.forEach(o => { o.cx = o.x + o.w / 2; o.cy = o.y + o.h / 2; });
// Centro de la cara superior en la pose inicial
function centroIni(o) { return [o.cx + o.ini.dx, o.cy + o.ini.dy]; }

// Tickets: asoman de la calculadora y terminan apilados en la esquina 4
const PILA = { x: -470, y: 500 + HW + GAP + 4 };
export const TICKETS = [
  { t: 12.05, a: [-330, 650], rotA: 18, b: [PILA.x, PILA.y + 8], rotB: 0 },
  { t: 14.2, a: [-590, 780], rotA: -24, b: [PILA.x + 6, PILA.y + 2], rotB: 0 },
  { t: 16.6, a: [-60, 740], rotA: 11, b: [PILA.x + 2, PILA.y - 4], rotB: 0 }
].map(k => ({ ...k, w: 150, h: 110 }));

// ---------- La punta trabaja a mano (actos 1–3) ----------
// Puntos de control + estaciones (tiempo, índice). La geometría es una Catmull-Rom por todos los puntos;
// el avance en el tiempo es una interpolación monótona (PCHIP) por las estaciones.
const cp = [], est = [], eventos = [];
const r = azar(11), rn = ruido1(5);
const P = (x, y) => { cp.push([x, y]); return cp.length - 1; };
const marca = t => est.push({ i: cp.length - 1, t });
const evento = (t, tipo, extra = {}) => eventos.push({ t, tipo, ...extra });

function jit(p, k) { return [p[0] + (r() - .5) * 2 * k, p[1] + (r() - .5) * 2 * k]; }
function vuelta(c, rx, ry, a0, giro, n, desorden = 0) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + giro * i / n, w = 1 + desorden * .18 * rn(i * .7 + c[0] * .01);
    out.push(jit([c[0] + Math.cos(a) * rx * w, c[1] + Math.sin(a) * ry * w], desorden * 10));
  }
  return out;
}
// Viaje libre entre dos puntos, con curva de mano (control lateral)
function viajeA(dest, curva = .22, desorden = 0) {
  const a = cp[cp.length - 1], d = dist(a, dest);
  const m = [(a[0] + dest[0]) / 2, (a[1] + dest[1]) / 2], n = [-(dest[1] - a[1]) / (d || 1), (dest[0] - a[0]) / (d || 1)];
  const k = curva * d * (r() > .5 ? 1 : -1);
  P(...jit([m[0] + n[0] * k, m[1] + n[1] * k], desorden * 20));
  P(...dest);
}
const ultimo = () => cp[cp.length - 1];

// --- Estado inicial: el hilo ya está sobre la mesa ---
P(...Q0); P(-2800, 470); P(-2480, 525); P(-2150, 468);
marca(0); marca(T.parte);

// --- Acto 1 · el primer pedido ---
const cel = centroIni(OBJ.celular), cua = centroIni(OBJ.cuaderno), pla = centroIni(OBJ.planilla), cal = centroIni(OBJ.calculadora), caj = centroIni(OBJ.caja);
evento(T.zumbido1, 'zumbido', { obj: 'celular' });
// corre al celular
P(-1900, 390); P(-1450, 170); P(-1000, 140);
P(cel[0] - 150, cel[1] - 70); marca(2.42);
// lo rodea: leer
vuelta(cel, 150, 232, Math.PI * 1.08, Math.PI * 2 * 1.02, 12).slice(1).forEach(p => P(...p)); marca(2.98);
evento(2.45, 'roce');
// al cuaderno: anotar
P(cel[0] - 420, cel[1] - 250); P(cua[0] + 60, cua[1] - 150); marca(3.36);
const zz = [[-100, -120], [80, -104], [-96, -66], [84, -48], [-90, -10], [60, 12]];
zz.forEach(([dx, dy]) => P(cua[0] + dx, cua[1] + dy)); marca(3.94);
evento(3.36, 'lapiz', { dur: .58 });
// a la planilla: copiar fila por fila
P(pla[0] - 60, pla[1] + 190); P(pla[0] - 160, pla[1] - 90); marca(4.24);
const fil = [[140, -80], [146, -26], [-140, -20], [-136, 34], [120, 40]];
fil.forEach(([dx, dy]) => P(pla[0] + dx, pla[1] + dy)); marca(4.84);
[4.24, 4.44, 4.64, 4.82].forEach(t => evento(t, 'papel'));
// a la calculadora: tres teclas
P(pla[0] + 420, pla[1] - 250); P(cal[0] - 60, cal[1] - 40); marca(5.3);
const teclas = [[-44, 0], [18, 40], [66, 104]];
teclas.forEach(([dx, dy], k) => {
  vuelta([cal[0] + dx, cal[1] + dy], 16, 14, Math.PI * .9, Math.PI * 2, 7).forEach(p => P(...p));
  evento(5.34 + k * .16, 'tecla', { amarilla: k === 2, k: [0, 1, 15][k] });
});
marca(5.78);
// a la caja: atarla
P(cal[0] - 180, cal[1] + 330); P(caj[0] + 240, caj[1] - 60); marca(6.36);
vuelta([caj[0], caj[1] + 20], 210, 175, -Math.PI * .1, Math.PI * 2 * 1.05, 14).slice(1).forEach(p => P(...p)); marca(6.9);
evento(6.4, 'carton');
// descansa
P(caj[0] - 250, caj[1] - 120); P(-1380, 470); marca(7.2);
marca(T.zumbido2 + .12);

// --- Acto 2 · a mano (8.9 → 13.1) ---
evento(T.zumbido2, 'zumbido', { obj: 'celular' });
const desorden2 = .6;
viajeA([cel[0] - 140, cel[1] + 40], .15, desorden2); marca(9.5);
vuelta(cel, 140, 220, Math.PI * .95, Math.PI * 2 * .9, 10, desorden2).slice(1).forEach(p => P(...p)); marca(9.92);
// copiar / pegar: celular ↔ planilla, cuatro veces a tempo
const tiempoCP = [10.1, 10.325, 10.55, 10.775];
tiempoCP.forEach((t, k) => {
  const haciaPla = k % 2 === 0;
  const p = haciaPla ? [pla[0] + 90 - k * 8, pla[1] - 70 + k * 30] : [cel[0] - 40, cel[1] - 60 + k * 30];
  P(...jit([(ultimo()[0] + p[0]) / 2, (ultimo()[1] + p[1]) / 2 + (haciaPla ? -40 : 40)], 6)); P(...p); marca(t);
  evento(t, 'papel', { fuerte: true });
});
// cuaderno, más rápido y peor
viajeA([cua[0] + 110, cua[1] - 110], .2, desorden2); marca(11.22);
[[-110, -70], [100, -30], [-116, 10], [96, 50], [-80, 90]].forEach(([dx, dy]) => P(...jit([cua[0] + dx, cua[1] + dy], 12))); marca(11.55);
evento(11.22, 'lapiz', { dur: .33 });
// calculadora y primer ticket
viajeA([cal[0] - 40, cal[1] + 10], .18, desorden2); marca(11.8);
[[-30, 20], [60, 90]].forEach(([dx, dy], k) => { vuelta([cal[0] + dx, cal[1] + dy], 20, 17, 1, Math.PI * 2, 7, .3).forEach(p => P(...p)); evento(11.84 + k * .14, 'tecla', { k: [4, 14][k] }); });
marca(12.08);
evento(TICKETS[0].t, 'ticket');
// iba a la caja… y el celular la interrumpe
P(cal[0] - 160, cal[1] + 420); marca(12.3);
evento(12.22, 'zumbido', { obj: 'celular' });
P(cal[0] - 330, cal[1] + 560); marca(12.42); // frenazo
P(cel[0] + 120, cel[1] + 130); marca(12.7);
vuelta(cel, 165, 245, Math.PI * .3, Math.PI * 2 * 1.1, 12, .8).slice(1).forEach(p => P(...p)); marca(13.12);

// Tramos cuya duración sale de la velocidad: después se reescalan a una ventana fija.
// Los eventos de sonido quedan atados a su estación y se resuelven al final.
const pendientes = [];
const eventoEn = (estacion, off, tipo, extra = {}) => pendientes.push({ estacion, off, tipo, extra });
function reescalar(i0, tB) { // estira las estaciones desde i0 para que la última caiga en tB
  const a = est[i0 - 1].t, b = est[est.length - 1].t;
  for (let k = i0; k < est.length; k++) est[k].t = lerp(a, tB, invLerp(a, b, est[k].t));
}
function lazoCon(lazo, vel, tipo) {
  const d0 = dist(ultimo(), lazo[0]);
  P(...lazo[0]); marca(est[est.length - 1].t + d0 / vel);
  const e0 = est[est.length - 1];
  let largo = 0; for (let j = 1; j < lazo.length; j++) largo += dist(lazo[j - 1], lazo[j]);
  lazo.slice(1).forEach(p => P(...p)); marca(e0.t + largo / vel);
  if (tipo) eventoEn(e0, .02, tipo, { dur: .3 });
}

// --- Acto 2→3 · viajes que se pisan (13.1 → 15.6) ---
[13.8, 14.5, 15.0, 15.45].forEach(z => evento(z, 'zumbido', { obj: 'celular' }));
evento(TICKETS[1].t, 'ticket');
const mapa = { cel, cua, pla, cal, caj };
const radios = { cel: [170, 250], cua: [210, 260], pla: [240, 190], cal: [160, 210], caj: [240, 200] };
const sonidoDe = { cel: 'roce', cua: 'lapiz', pla: 'papel', cal: 'tecla', caj: 'carton' };
{
  const i0 = est.length;
  let vel = 1500, desorden = 1.0;
  ['cel', 'caj', 'cua', 'cal'].forEach((k, i) => {
    const c = mapa[k], [rx, ry] = radios[k], g = 1 + .12 * i;
    const lazo = vuelta(c, rx * g * .85, ry * g * .85, r() * Math.PI * 2, (r() > .5 ? 1 : -1) * Math.PI * 2 * (.85 + r() * .25), 12, desorden);
    lazoCon(lazo, vel, sonidoDe[k]);
    vel *= 1.12; desorden = Math.min(1.8, desorden + .12);
  });
  reescalar(i0, 15.6);
}
evento(TICKETS[2].t, 'ticket');

// --- Acto 3 · el enredo: rulos grandes que cruzan la mesa (15.6 → 20.8) ---
const zona = { x0: -1860, x1: -140, y0: -70, y1: 900 };
const prohibido = () => false;
{
  let tz = 15.85;
  while (tz < 20.35) { evento(tz, 'zumbido', { obj: 'celular', suave: true }); tz += lerp(.42, .3, invLerp(15.85, 20.3, tz)); }
  evento(15.4, 'masa');
  const i0 = est.length;
  let vel = 2000;
  const centros = [cel, pla, caj, cua, cal, pla, cel, caj, cua, pla];
  for (let i = 0; i < centros.length; i++) {
    const c = jit(centros[i], 160);
    const rx = lerp(190, 330, r()), ry = rx * lerp(.62, .95, r());
    const a0 = Math.atan2(ultimo()[1] - c[1], ultimo()[0] - c[0]);
    const lazo = vuelta(c, rx, ry, a0 + (r() - .5) * .6, (r() > .5 ? 1 : -1) * Math.PI * 2 * lerp(.8, 1.15, r()), 14, 1.7)
      .map(p => [clamp(p[0], zona.x0, zona.x1), clamp(p[1], zona.y0, zona.y1)])
      .map(p => prohibido(p) ? [Math.max(p[0], -1050), Math.max(p[1], 180)] : p);
    lazoCon(lazo, vel, null);
    vel = Math.min(3000, vel * 1.06);
  }
  // última carrera hasta T0 y frenazo seco
  P(-760, 660); P(-360, 560); P(...T0);
  marca(est[est.length - 1].t + dist([-760, 660], T0) / vel);
  reescalar(i0, T.silencio);
}
pendientes.forEach(p => evento(p.estacion.t + p.off, p.tipo, p.extra));

// ---------- Geometría del hilo tejido ----------
const denso = catmull(cp, 10);
// índice de cada punto de control dentro de la curva densa (buscando hacia adelante)
const sDeCp = [];
{
  let j = 0;
  const lin0 = new Linea(denso);
  cp.forEach((p, i) => { while (j < denso.length - 1 && dist(denso[j], p) > 1e-3) j++; sDeCp[i] = lin0.s[j]; });
}
export const TEJIDO = new Linea(denso);
export const L = TEJIDO.largo;

// PCHIP sobre estaciones (t, s)
const ET = est.map(e => e.t), ES = est.map(e => sDeCp[e.i]);
const pend = (() => {
  const n = ET.length, h = [], dl = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) { h[i] = ET[i + 1] - ET[i]; dl[i] = h[i] > 0 ? (ES[i + 1] - ES[i]) / h[i] : 0; }
  for (let i = 1; i < n - 1; i++) {
    if (dl[i - 1] * dl[i] <= 0) m[i] = 0;
    else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / dl[i - 1] + w2 / dl[i]); }
  }
  m[0] = 0; m[n - 1] = dl[n - 2] || 0; // frenazo seco al final
  return m;
})();
export function sPunta(t) {
  if (t <= ET[0]) return ES[0];
  if (t >= ET[ET.length - 1]) return ES[ES.length - 1];
  let i = 0; while (ET[i + 1] < t) i++;
  const h = ET[i + 1] - ET[i]; if (h <= 0) return ES[i + 1];
  const u = (t - ET[i]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * ES[i] + (u3 - 2 * u2 + u) * h * pend[i] + (-2 * u3 + 3 * u2) * ES[i + 1] + (u3 - u2) * h * pend[i + 1];
}
export const velPunta = t => (sPunta(t + 1 / 240) - sPunta(t - 1 / 240)) * 120;

// ---------- El tirón ----------
const UD = RUTA.linea.largo;
export const W_FINAL = L - UD;
// La punta en dos fases:
//  A · sube decidida hasta salir de la esquina de arriba (frena al doblar);
//  B · acelera por el último tramo, llega a su lugar justo cuando se acaba el hilo (T.aterriza),
//      se pasa un poco (el único rebote del film) y el hilo la devuelve.
const U_ESQ = RUTA.esquinas[1].sSalida, T_ESQ = 30.2;
const KA = (T.aterriza - T_ESQ) / (T.tiron[1] - T_ESQ), POT = 1.6;
const SOBRE = POT * (1 - KA) / (Math.PI * KA); // continuidad de velocidad al llegar
export function uPunta(t) {
  if (t <= T_ESQ) return lerp(U_T0, U_ESQ, decidida(invLerp(T.tiron[0], T_ESQ, t)));
  const k = invLerp(T_ESQ, T.tiron[1], t);
  let p;
  if (k < KA) p = Math.pow(k / KA, POT);
  else { const s = (k - KA) / (1 - KA); p = 1 + SOBRE * Math.sin(Math.PI * s) * Math.pow(1 - s, 1.4); }
  return lerp(U_ESQ, UD, p);
}
// El enrollado lleva un perfil más parejo que la punta y termina en el instante del aterrizaje
function enrolladoTiron(t) {
  const u = invLerp(T.tiron[0], T.aterriza, t);
  return .55 * decidida(u) + .45 * (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
}
export function enrollado(t) { return W_FINAL * enrolladoTiron(t); }
export function posPunta(u) { return u <= UD ? RUTA.linea.en(u) : [D[0] + (u - UD), D[1]]; }
const fFrente = a => a + dist(TEJIDO.en(a), T0);
export function frente(t) {
  if (t <= T.tiron[0]) return L;
  if (t >= T.aterriza) return 0;
  const objetivo = L - enrollado(t) - (uPunta(t) - U_T0);
  let lo = 0, hi = L;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (fFrente(m) < objetivo) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
export function radioPunto(t) {
  const w = enrollado(t) / W_FINAL;
  return Math.cbrt(R_PUNTA ** 3 + (R_PUNTO ** 3 - R_PUNTA ** 3) * clamp(w));
}

// Estado del hilo en t: tramo gris (quieto) + tramo tenso (celeste)
export function hilo(t) {
  if (t < T.tiron[0]) {
    const s = sPunta(t);
    return { gris: TEJIDO.tramo(0, s), tenso: null, punta: TEJIDO.en(s), dirPunta: TEJIDO.dir(s), a: s, material0: 0 };
  }
  const a = frente(t), u = uPunta(t);
  const tensoRuta = RUTA.linea.tramo(U_T0, Math.min(u, UD));
  if (u > UD) tensoRuta.push(posPunta(u));
  const F = TEJIDO.en(a);
  return {
    gris: TEJIDO.tramo(0, a), tenso: [F, ...tensoRuta], punta: posPunta(u), dirPunta: RUTA.linea.dir(Math.min(u, UD)),
    a, material0: a, enrollado: enrollado(t)
  };
}

// ---------- Objetos en el tiempo ----------
// Empujones durante el enredo (acumulados) y enderezado cuando la ruta los engancha
const empujones = {
  celular: [[9.6, 6, -4, 2], [13.3, -10, 8, 3], [16.5, 12, 6, -4], [19.5, -8, -10, 5], [21.8, 10, 4, -3]],
  cuaderno: [[3.5, -4, 3, -1.5], [10.9, 8, -6, 3], [17.2, -10, 8, -4], [20.4, 12, 6, 4]],
  planilla: [[4.5, 5, 4, 1.5], [11.9, -8, 6, -3], [14.9, 10, -4, 4], [22.3, -6, 10, -3]],
  calculadora: [[5.6, -3, 4, -2], [12.5, 6, -4, 3], [18.9, -8, 10, -4], [22.9, 10, -6, 4]],
  caja: [[6.7, 10, 4, -2.5], [14.2, -12, 10, 4], [20.9, 12, -6, -4]]
};
// Cada herramienta se endereza cuando queda libre: cuando el frente pasa el primer hilo que la tocó
// (el hilo se suelta en orden inverso al que se tejió). La calculadora sostiene la esquina: se endereza al arrancar.
function primerContacto(o) {
  const x0 = o.x + o.ini.dx - 10, x1 = o.x + o.w + o.ini.dx + 10, y0 = o.y + o.ini.dy - 10, y1 = o.y + o.h + o.d + o.ini.dy + 10;
  for (let i = 0; i < TEJIDO.p.length; i++) { const [x, y] = TEJIDO.p[i]; if (x > x0 && x < x1 && y > y0 && y < y1) return TEJIDO.s[i]; }
  return 0;
}
function tiempoDeFrente(sig) { // frente(t) decrece: primer t en que frente < sig
  let lo = T.tiron[0], hi = T.tiron[1];
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (frente(m) > sig) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
export const ENGANCHES = Object.fromEntries(OBJETOS.map(o => [o.id, o.id === 'calculadora' ? T.tiron[0] + .12 : tiempoDeFrente(primerContacto(o))]));
export const ENGANCHE_PILA = T.tiron[0] + .5;
Object.entries(ENGANCHES).forEach(([k, tt]) => eventos.push({ t: tt, tipo: 'enganche', obj: k }));
eventos.push({ t: ENGANCHE_PILA, tipo: 'pila' });

const escalaEmpujon = t => t < 9 ? t : t < 13.7 ? t - .5 : lerp(13.2, 20.6, invLerp(13.7, 24, t));
export function poseObjeto(o, t) {
  let dx = o.ini.dx, dy = o.ini.dy, rr = o.ini.rot;
  for (const [te0, ex, ey, er] of empujones[o.id] || []) {
    const te = escalaEmpujon(te0);
    const k = decidida(invLerp(te, te + .28, t)); dx += ex * k; dy += ey * k; rr += er * k;
  }
  const te = ENGANCHES[o.id];
  const k = decidida(invLerp(te, te + .32, t));
  dx = lerp(dx, 0, k); dy = lerp(dy, 0, k); rr = lerp(rr, 0, k);
  // vibración del celular
  let vib = 0;
  if (o.id === 'celular') for (const e of eventos) if (e.tipo === 'zumbido' && t >= e.t && t < e.t + .82) {
    const u = t - e.t, on = (u < .36 || (u > .46 && u < .82)) ? 1 : 0;
    vib = Math.max(vib, on * (e.suave ? .6 : 1));
  }
  return { dx, dy, rot: rr * Math.PI / 180, vib };
}
export function poseTicket(k, t) {
  const tk = TICKETS[k];
  const sale = decidida(invLerp(tk.t, tk.t + .34, t));
  const origen = [OBJ.calculadora.cx + 40, OBJ.calculadora.cy + 60];
  let p = [lerp(origen[0], tk.a[0], sale), lerp(origen[1], tk.a[1], sale)], ro = lerp(0, tk.rotA, sale);
  const junta = decidida(invLerp(ENGANCHE_PILA + k * .07, ENGANCHE_PILA + k * .07 + .32, t));
  p = [lerp(p[0], tk.b[0], junta), lerp(p[1], tk.b[1], junta)]; ro = lerp(ro, tk.rotB, junta);
  return { visible: t >= tk.t, x: p[0], y: p[1], rot: ro * Math.PI / 180, alfa: sale };
}
export function teclaApretada(t) {
  for (const e of eventos) if (e.tipo === 'tecla' && t >= e.t && t < e.t + .12) return e.k ?? 0;
  return -1;
}

// ---------- La punta como punto ----------
export function estadoPunto(t) {
  const celeste = decidida(invLerp(T.punto, T.punto + .3, t));
  const rr = t < T.tiron[0] ? R_PUNTA * celeste : radioPunto(t);
  // levantado durante el tirón; aterriza con la curva de llegada
  const alto = t < T.tiron[0] ? 0 : t < T.aterriza - .04 ? tramo(t, T.tiron[0], T.tiron[0] + 1.2, 0, .1) : lerp(.1, 0, llegada(invLerp(T.aterriza - .04, T.aterriza + .52, t)));
  const plano = decidida(invLerp(T.logo[0], T.logo[1] + .4, t)); // pierde volumen al volverse logo
  return { celeste, r: rr, alto, plano };
}

// Señal que viaja sola por la ruta (coda)
export function senal(t) {
  if (t < T.senal[0] || t > T.senal[1] + .2) return null;
  const u0 = OBJ.celular.cx - Q0[0]; // a la altura del celular
  const k = invLerp(T.senal[0], T.senal[1], t);
  return { u: lerp(u0, UD - R_PUNTO, k), fuerza: Math.min(1, (t - T.senal[0]) / .12) * (1 - invLerp(T.senal[1], T.senal[1] + .2, t)) };
}
eventos.push({ t: T.zumbidoFinal, tipo: 'zumbido', obj: 'celular', final: true });

// ---------- Cámara ----------
// Estados de encuadre: centro del mundo en pantalla y escala (1 = 1 unidad por píxel)
const ENC = {
  apertura: { c: [-2380, 470], z: 1.6 },
  mesa: { c: [-990, 380], z: .9 },
  cerca: { c: [-900, 300], z: 1.3 },
  enredo: { c: [-990, 420], z: .85 },
  buscar: { c: [T0[0] + 300 / 1.35, T0[1] - 160 / 1.35], z: 1.35 },
  final: { c: [-189, 30], z: .48 },
  logo: { c: [1040, -470], z: 1.0 }
};
export { ENC };
function mezclaEnc(a, b, k) {
  // interpolar la escala en logaritmo para que el movimiento se sienta parejo
  const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), k));
  return { c: [lerp(a.c[0], b.c[0], k), lerp(a.c[1], b.c[1], k)], z };
}
// Seguimiento: resorte críticamente amortiguado sobre la punta (precalculado, determinista)
const seg = (() => {
  const out = new Float64Array(CUADROS * 2 + 4);
  let x = ENC.apertura.c[0], y = ENC.apertura.c[1], vx = 0, vy = 0;
  const w = 4.2, sub = 8, dt = 1 / FPS / sub;
  for (let f = 0; f < CUADROS; f++) {
    for (let s = 0; s < sub; s++) {
      const tt = f / FPS + s * dt;
      let obj;
      if (tt < T.tiron[0]) obj = TEJIDO.en(sPunta(tt)); else obj = RUTA.linea.en(uPunta(tt));
      const ax = w * w * (obj[0] - x) - 2 * w * vx, ay = w * w * (obj[1] - y) - 2 * w * vy;
      vx += ax * dt; vy += ay * dt; x += vx * dt; y += vy * dt;
    }
    out[f * 2] = x; out[f * 2 + 1] = y;
  }
  return out;
})();
function seguido(t) { const f = clamp(Math.round(t * FPS), 0, CUADROS - 1); return [seg[f * 2], seg[f * 2 + 1]]; }

export function camara(t) {
  let e;
  if (t < T.parte) e = ENC.apertura;
  else if (t < 8.9) {
    // sigue a la punta y se abre hacia la mesa
    const s = seguido(t), z = Math.exp(lerp(Math.log(1.6), Math.log(ENC.mesa.z), decidida(invLerp(1.9, 6.2, t))));
    const sigue = { c: s, z };
    const k = decidida(invLerp(3.4, 6.8, t));
    e = mezclaEnc(sigue, { c: ENC.mesa.c, z }, k);
    const k0 = decidida(invLerp(T.parte, T.parte + .9, t));
    e = mezclaEnc(ENC.apertura, e, k0);
  }
  else if (t < T.silencio) {
    // de cerca en el copiar/pegar; después se abre con el enredo
    const cerca = mezclaEnc(ENC.mesa, ENC.cerca, decidida(invLerp(8.9, 9.9, t)));
    e = mezclaEnc(cerca, ENC.enredo, decidida(invLerp(11.3, 19.8, t)));
  }
  else if (t < T.tiron[0]) e = mezclaEnc(ENC.enredo, ENC.buscar, decidida(invLerp(T.busca[0], T.busca[1], t)));
  else if (t < T.camLogo[0]) {
    e = mezclaEnc(ENC.buscar, ENC.final, decidida(invLerp(T.tiron[0] + .2, T.tiron[0] + 2.4, t)));
  }
  else e = mezclaEnc(ENC.final, ENC.logo, decidida(invLerp(T.camLogo[0], T.camLogo[1], t)));
  return e;
}

// ---------- Texto (en pantalla) ----------
export const TEXTOS = [
  { id: 'funciona', texto: 'Tu empresa funciona.', entra: T.texto1, sale: T.texto1Sale, x: 150, y: 158 },
  { id: 'punta', texto: 'Todo enredo tiene una punta', puntoCeleste: T.punto, entra: T.texto2, sale: T.texto2Sale, x: 930, y: 400 }
];

// ---------- Eventos para el audio ----------
eventos.push({ t: T.silencio, tipo: 'silencio' }, { t: T.punto, tipo: 'nota' }, { t: T.tiron[0], tipo: 'tiron' },
  { t: T.aterriza, tipo: 'aterriza' }, { t: T.senal[0], tipo: 'senal' }, { t: T.logo[0], tipo: 'logo' });
eventos.sort((a, b) => a.t - b.t);
export const EVENTOS = eventos;

export const INFO = { L, W_FINAL, UD, estaciones: est.length, puntosControl: cp.length, enganches: ENGANCHES, pila: ENGANCHE_PILA };
