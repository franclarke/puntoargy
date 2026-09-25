// Utilidades compartidas: curvas de marca, azar con semilla y un motor
// mínimo de escenas atadas al scroll (sin dependencias).

export const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const puedeHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
/** Progreso local de t dentro del tramo [a, b]. */
export const tramo = (t, a, b) => clamp((t - a) / (b - a));

function bezier(x1, y1, x2, y2) {
  const A = (a, b) => 1 - 3 * b + 3 * a;
  const B = (a, b) => 3 * b - 6 * a;
  const C = (a) => 3 * a;
  const f = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const d = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = d(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t -= (f(t, x1, x2) - x) / s;
    }
    return f(t, y1, y2);
  };
}
/** Curva "decidida": arranque firme, frenado suave (sección 23). */
export const decidida = bezier(.65, 0, .15, 1);
/** Curva "llegada": solo para el punto. */
export const llegada = bezier(.34, 1.56, .64, 1);
export const salida = bezier(.2, .7, .15, 1);

/** Generador pseudoaleatorio con semilla (mulberry32): el enredo es siempre el mismo. */
export function azar(semilla = 1) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Animación por tiempo con requestAnimationFrame. Devuelve una promesa. */
export function tween(ms, fn, ease = decidida) {
  return new Promise((res) => {
    if (reduce) { fn(1); res(); return; }
    const t0 = performance.now();
    const paso = (now) => {
      const k = clamp((now - t0) / ms);
      fn(ease(k));
      if (k < 1) requestAnimationFrame(paso); else res();
    };
    requestAnimationFrame(paso);
  });
}
export const espera = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

/** Llama a `entra` / `sale` cuando el elemento aparece o deja la pantalla. */
export function alVer(el, entra, sale, opciones = {}) {
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) entra(e); else if (sale) sale(e);
    });
  }, { threshold: opciones.umbral ?? 0, rootMargin: opciones.margen ?? '0px' });
  io.observe(el);
  return io;
}

/* ── Motor de escenas ──
   Cada escena recibe su progreso (0 → 1) mientras la sección cruza la pantalla.
   - modo 'fija': 0 cuando el tope toca el tope de la ventana, 1 cuando el fondo toca el fondo
     (para secciones altas con un contenedor sticky adentro).
   - modo 'paso': 0 cuando el elemento asoma por abajo, 1 cuando termina de pasar el centro. */
const escenas = new Set();
let pendiente = false;

function calcular() {
  pendiente = false;
  const vh = window.innerHeight;
  escenas.forEach((s) => {
    if (!s.activa) return;
    const r = s.el.getBoundingClientRect();
    let p;
    if (s.modo === 'fija') p = clamp(-r.top / Math.max(1, r.height - vh));
    else p = clamp((vh - r.top) / (vh * (s.fin ?? .5) + r.height * (s.largo ?? .6)));
    if (p !== s.ultimo || s.forzar || s.siempre) { s.ultimo = p; s.forzar = false; s.fn(p, r); }
  });
}
export function pedirCalculo(forzar = false) {
  if (forzar) escenas.forEach((s) => { s.forzar = true; });
  if (!pendiente) { pendiente = true; requestAnimationFrame(calcular); }
}
export function escena(el, fn, opciones = {}) {
  const s = { el, fn, modo: opciones.modo || 'fija', fin: opciones.fin, largo: opciones.largo, siempre: !!opciones.siempre, activa: false, ultimo: -1, forzar: true };
  escenas.add(s);
  alVer(el, () => { s.activa = true; s.forzar = true; pedirCalculo(); }, () => {
    // Al salir, se deja la escena en su extremo más cercano para que no quede a medias.
    const r = el.getBoundingClientRect();
    const extremo = r.top > 0 ? 0 : 1;
    if (s.ultimo !== extremo) { s.ultimo = extremo; s.fn(extremo, r); }
    s.activa = false;
  }, { margen: '10% 0px 10% 0px' });
  return s;
}
window.addEventListener('scroll', () => pedirCalculo(), { passive: true });
window.addEventListener('resize', () => pedirCalculo(true));

/** Ejecuta `fn` al cambiar el tamaño, con un pequeño retardo. */
export function alRedimensionar(fn, ms = 150) {
  let t;
  let ancho = window.innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      // En móviles la barra de direcciones cambia el alto al hacer scroll: solo nos importa el ancho.
      if (window.innerWidth === ancho && !fn.alto) return;
      ancho = window.innerWidth;
      fn();
    }, ms);
  });
}

export const NS = 'http://www.w3.org/2000/svg';
