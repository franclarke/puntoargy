// Utilidades compartidas: azar con semilla, esperas, observadores y un motor
// mínimo de escenas atadas al scroll (sin dependencias). Las curvas de marca viven en el CSS.

export const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const puedeHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
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
