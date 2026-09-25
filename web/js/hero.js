// Hero: la animación de marca (sección 23).
// Se dibuja el enredo entre las herramientas, sale la ruta y el punto del titular llega último.
// Después, el hilo responde al cursor: se corre y vuelve a su lugar.

import { reduce, puedeHover, azar, tween, espera, alVer, alRedimensionar } from './util.js';
import { enredo, suave, ruta, muestrearCurva, polilinea, posicion, preparar } from './hilo.js';
import { partirPalabras, llegaPunto } from './revelar.js';

// Orden en que el hilo recorre las herramientas (por clase de objeto).
const RECORRIDO = ['obj-celu', 'obj-qr', 'obj-ticket', 'obj-postit', 'obj-caja'];

export function iniciarHero() {
  const hero = document.getElementById('inicio');
  const mesa = document.getElementById('mesa-hero');
  const svg = document.getElementById('hilo-hero');
  const [hSombra, hTrazo, rSombra, rTrazo] = svg.querySelectorAll('path');
  const punto = document.getElementById('hero-punto');
  const titulo = hero.querySelector('.hero-titulo');
  const objetos = [...mesa.querySelectorAll('.obj')];

  let base = [];
  let off = [];
  let vel = [];
  let vivo = false;       // el hilo ya responde al cursor
  let puntero = null;
  let corriendo = false;
  let raf = 0;
  let enPantalla = true;

  const pie = hero.querySelector('.hero-pie');
  // La ruta sube hasta el punto solo si no cruza el texto de abajo.
  const conRuta = () => {
    if (window.innerWidth <= 720) return false;
    const pp = posicion(punto, hero);
    const bordes = [...pie.children].map((c) => { const q = posicion(c, hero); return q.x + q.w; });
    return pp.x > Math.max(...bordes) + 48;
  };

  function geometria() {
    const W = mesa.clientWidth;
    const H = mesa.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const origen = posicion(mesa, hero);
    const visibles = objetos.filter((o) => o.hasAttribute('data-ancla') && o.offsetParent !== null);
    visibles.sort((a, b) => RECORRIDO.findIndex((c) => a.classList.contains(c)) - RECORRIDO.findIndex((c) => b.classList.contains(c)));
    const base0 = visibles.map((o) => ({
      x: o.offsetLeft + o.offsetWidth / 2,
      y: o.offsetTop + o.offsetHeight / 2,
      rx: Math.min(o.offsetWidth * .46, 150),
      ry: Math.min(o.offsetHeight * .34, 130),
    }));
    // Segundas vueltas: el hilo vuelve sobre herramientas que ya pasó, como en el film.
    const achicar = (a, k) => a && ({ ...a, rx: a.rx * k, ry: a.ry * k, x: a.x + a.rx * .15, y: a.y - a.ry * .2 });
    const anclas = base0.length >= 5
      ? [base0[0], base0[1], base0[2], achicar(base0[0], .6), base0[3], achicar(base0[2], .7), base0[4]]
      : base0.flatMap((a, i) => (i === 1 ? [a, achicar(base0[0], .6)] : [a]));

    // El punto del titular, en coordenadas de la mesa.
    const pp = posicion(punto, hero);
    const pc = [pp.x - origen.x + pp.w / 2, pp.y - origen.y + pp.h / 2];

    const rand = azar(7);
    let fin;
    let tramos = null;
    const ruteada = conRuta();
    if (ruteada) {
      // El hilo termina abajo y a la izquierda del punto; desde ahí sale la ruta: derecha y arriba.
      const T = [pc[0] - Math.min(160, W * .1), Math.max(pc[1] + 150, H * .9)];
      fin = T;
      tramos = [T, [pc[0], T[1]], pc];
    } else if (window.innerWidth > 720) {
      // Sin ruta: el hilo se queda en la zona de los objetos (derecha y abajo) y no cruza el texto.
      fin = [W * .6, H + 40];
    } else {
      fin = [W + 40, H * .7];
    }
    const inicio = window.innerWidth > 720 ? [W + 40, H * .4] : [-30, H * .55];
    const { pts } = enredo(anclas, rand, { inicio, fin, vueltas: [1, 1.9], rulos: 2, rulo: W > 900 ? 30 : 18 });
    const d = suave(pts);
    // Un punto cada ~5 px: con menos, los rulos chicos se ven como polígonos.
    base = muestrearCurva(pts, 5);
    off = base.map(() => [0, 0]);
    vel = base.map(() => [0, 0]);

    const Lh = preparar(hTrazo, d);
    preparar(hSombra, d);
    let Lr = 0;
    if (tramos) {
      const dr = ruta(tramos, 34);
      Lr = preparar(rTrazo, dr);
      preparar(rSombra, dr);
      rTrazo.style.display = rSombra.style.display = '';
    } else {
      rTrazo.style.display = rSombra.style.display = 'none';
    }
    return { Lh, Lr };
  }

  function dibujarHilo(t, L) {
    const v = L * (1 - t);
    hTrazo.style.strokeDashoffset = v;
    hSombra.style.strokeDashoffset = v;
  }
  function dibujarRuta(t, L) {
    const v = L * (1 - t);
    rTrazo.style.strokeDashoffset = v;
    rSombra.style.strokeDashoffset = v;
  }
  function quieto() {
    // Estado final: todo dibujado, sin guiones.
    [hTrazo, hSombra, rTrazo, rSombra].forEach((p) => { p.style.strokeDasharray = 'none'; p.style.strokeDashoffset = 0; });
  }

  // ── El hilo vivo ──
  function paso() {
    let quietoTodo = true;
    const R = 150;
    for (let i = 0; i < base.length; i++) {
      let tx = 0;
      let ty = 0;
      if (puntero) {
        const dx = base[i][0] + off[i][0] - puntero[0];
        const dy = base[i][1] + off[i][1] - puntero[1];
        const dist = Math.hypot(dx, dy);
        if (dist < R && dist > .01) {
          const f = (1 - dist / R) ** 2 * 46;
          tx = dx / dist * f;
          ty = dy / dist * f;
        }
      }
      vel[i][0] = (vel[i][0] + (tx - off[i][0]) * .1) * .8;
      vel[i][1] = (vel[i][1] + (ty - off[i][1]) * .1) * .8;
      off[i][0] += vel[i][0];
      off[i][1] += vel[i][1];
      if (Math.abs(vel[i][0]) + Math.abs(vel[i][1]) > .02 || Math.abs(off[i][0]) + Math.abs(off[i][1]) > .1) quietoTodo = false;
    }
    const d = polilinea(base.map((p, i) => [p[0] + off[i][0], p[1] + off[i][1]]));
    hTrazo.setAttribute('d', d);
    hSombra.setAttribute('d', d);
    return quietoTodo;
  }
  function bucle() {
    const listo = paso();
    if (listo && !puntero) { corriendo = false; return; }
    raf = requestAnimationFrame(bucle);
  }
  function arrancar() {
    if (corriendo || !vivo || !enPantalla) return;
    corriendo = true;
    raf = requestAnimationFrame(bucle);
  }

  // Parallax suave de los objetos según su profundidad.
  let px = 0;
  let py = 0;
  function parallax() {
    objetos.forEach((o) => {
      const k = Number(o.dataset.prof || 1);
      o.style.translate = `${(px * 10 * k).toFixed(1)}px ${(py * 8 * k).toFixed(1)}px`;
    });
  }

  if (puedeHover && !reduce) {
    hero.addEventListener('pointermove', (e) => {
      const r = mesa.getBoundingClientRect();
      puntero = [e.clientX - r.left, e.clientY - r.top];
      px = (e.clientX / window.innerWidth - .5) * 2;
      py = (e.clientY / window.innerHeight - .5) * 2;
      parallax();
      arrancar();
    });
    hero.addEventListener('pointerleave', () => { puntero = null; px = py = 0; parallax(); });
  }
  alVer(hero, () => { enPantalla = true; }, () => { enPantalla = false; cancelAnimationFrame(raf); corriendo = false; });

  // La mesa se queda un poco atrás al hacer scroll: da profundidad sin mover el hilo respecto de los objetos.
  if (!reduce) {
    let pendiente = false;
    window.addEventListener('scroll', () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) mesa.style.transform = `translate3d(0, ${(y * .16).toFixed(1)}px, 0)`;
      });
    }, { passive: true });
  }

  alRedimensionar(() => {
    geometria();
    quieto();
    if (vivo) { off = base.map(() => [0, 0]); vel = base.map(() => [0, 0]); paso(); }
  });

  // ── Entrada ──
  async function entrada() {
    const fuentes = document.fonts ? Promise.race([document.fonts.ready, espera(900)]) : Promise.resolve();
    await fuentes;
    partirPalabras(titulo);
    const { Lh, Lr } = geometria();

    if (reduce) {
      objetos.forEach((o) => o.classList.add('en-mesa'));
      hero.classList.add('listo');
      titulo.classList.add('visto');
      quieto();
      return;
    }

    punto.classList.add('espera');
    // Un cuadro para que el estado inicial se pinte antes de la transición.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    hero.classList.add('listo');
    titulo.classList.add('visto');
    objetos.forEach((o, i) => setTimeout(() => o.classList.add('en-mesa'), 180 + i * 110));

    await espera(420);
    await tween(1500, (t) => dibujarHilo(t, Lh));
    if (Lr) await tween(640, (t) => dibujarRuta(t, Lr));
    llegaPunto(punto, 0);
    await espera(560);
    quieto();
    vivo = true;
    paso();
  }
  entrada();
}
