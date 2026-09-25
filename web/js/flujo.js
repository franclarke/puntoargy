// Capítulo 02 · Del enredo al punto.
// El hilo sale enredado y se vuelve ruta. Una señal viaja con el scroll y, en cada estación,
// algo que antes se hacía a mano pasa solo. La cámara sigue a la señal, como en el film.
// En pantallas chicas el recorrido es vertical y no se fija.

import { reduce, azar, clamp, tramo, escena, alRedimensionar } from './util.js';
import { enredo, suave, posicion, preparar } from './hilo.js';

export function iniciarFlujo() {
  const sec = document.getElementById('escena-flujo');
  if (!sec) return;
  const pista = document.getElementById('flujo-pista');
  const svg = document.getElementById('flujo-svg');
  const [hSombra, hTrazo, base, rSombra, rTrazo] = svg.querySelectorAll('path');
  const senal = svg.querySelector('.senal');
  const estaciones = [...pista.querySelectorAll('.estacion')];
  const nodos = estaciones.map((e) => e.querySelector('.est-nodo'));
  const vertical = window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)');

  let g = null;

  function geometria() {
    pista.style.transform = '';
    const W = pista.scrollWidth;
    const H = vertical.matches ? pista.scrollHeight : pista.clientHeight;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const centros = nodos.map((n) => {
      const p = posicion(n, pista);
      return [p.x + p.w / 2, p.y + p.h / 2];
    });
    const rand = azar(41);
    let S;
    let fin;
    let anclas;
    if (!vertical.matches) {
      const y = centros[0][1];
      const padL = centros[0][0];
      S = [padL - Math.min(150, padL * .35), y];
      fin = centros[centros.length - 1];
      anclas = [
        { x: padL * .2, y: y - 50, rx: 60, ry: 46 },
        { x: padL * .46, y: y + 34, rx: 70, ry: 52 },
        { x: padL * .32, y: y - 8, rx: 46, ry: 60 },
        { x: padL * .56, y: y - 30, rx: 40, ry: 34 },
      ];
    } else {
      const x = centros[0][0];
      S = [x, centros[0][1] - 50];
      fin = centros[centros.length - 1];
      anclas = [{ x: x + 34, y: S[1] - 80, rx: 28, ry: 20 }, { x: x + 4, y: S[1] - 44, rx: 22, ry: 16 }];
    }
    const inicio = vertical.matches ? [S[0] + 80, S[1] - 115] : [-80, S[1] - 90];
    const { pts } = enredo(anclas, rand, { inicio, fin: S, vueltas: [.8, 1.4], rulos: 1, rulo: vertical.matches ? 12 : 24 });
    const dh = suave(pts);
    preparar(hTrazo, dh);
    preparar(hSombra, dh);
    [hTrazo, hSombra].forEach((p) => { p.style.strokeDasharray = 'none'; p.style.strokeDashoffset = 0; });

    const dr = `M${S[0].toFixed(1)} ${S[1].toFixed(1)}L${fin[0].toFixed(1)} ${fin[1].toFixed(1)}`;
    base.setAttribute('d', dr);
    const Lr = preparar(rTrazo, dr);
    preparar(rSombra, dr);
    const eje = vertical.matches ? 1 : 0;
    const largos = centros.map((c) => Math.abs(c[eje] - S[eje]));
    g = { S, fin, Lr, largos, eje, W };
  }

  function pintar(p) {
    if (!g) return;
    let d;
    if (vertical.matches) {
      const r = pista.getBoundingClientRect();
      d = clamp(window.innerHeight * .62 - r.top - g.S[1], 0, g.Lr);
    } else {
      d = g.Lr * tramo(p, .04, .9);
      const vw = window.innerWidth;
      const tx = clamp(vw * .42 - (g.S[0] + d), Math.min(0, vw - g.W - 24), 0);
      pista.style.transform = `translate3d(${tx.toFixed(1)}px,0,0)`;
    }
    const v = g.Lr - d;
    rTrazo.style.strokeDashoffset = v;
    rSombra.style.strokeDashoffset = v;
    const x = g.eje === 0 ? g.S[0] + d : g.S[0];
    const y = g.eje === 1 ? g.S[1] + d : g.S[1];
    senal.setAttribute('cx', x.toFixed(1));
    senal.setAttribute('cy', y.toFixed(1));
    const alFinal = d >= g.Lr - 2;
    senal.style.opacity = alFinal ? 0 : 1;
    estaciones.forEach((e, i) => e.classList.toggle('activa', d >= g.largos[i] - 4));
  }

  geometria();
  if (reduce) {
    rTrazo.style.strokeDashoffset = 0;
    rSombra.style.strokeDashoffset = 0;
    senal.style.opacity = 0;
    estaciones.forEach((e) => e.classList.add('activa'));
    return;
  }
  let ultimo = 0;
  escena(sec, (p) => { ultimo = p; pintar(p); }, { siempre: true });
  alRedimensionar(() => { geometria(); pintar(ultimo); });
  vertical.addEventListener('change', () => { geometria(); pintar(ultimo); });
}
