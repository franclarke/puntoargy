// 03 · Cómo pensamos: principios que entran de a uno, el software que actúa y el estante de piezas.

import { reduce, alVer } from './util.js';

function alEntrar(el, fn, margen = '0px 0px -15% 0px') {
  if (reduce) { fn(); return; }
  const io = alVer(el, () => { io.disconnect(); fn(); }, null, { margen });
}

export function iniciarPensamos() {
  document.querySelectorAll('.principios li').forEach((li) => alEntrar(li, () => li.classList.add('ve')));
  const actua = document.getElementById('actua');
  if (actua) alEntrar(actua, () => actua.classList.add('ve'), '0px 0px -25% 0px');
  const estante = document.querySelector('.estante');
  if (estante) {
    [...estante.querySelectorAll('span')].forEach((s, i) => { s.style.transitionDelay = `${i * 70}ms`; });
    alEntrar(estante, () => estante.classList.add('ve'), '0px 0px -20% 0px');
  }
  // Elementos que solo necesitan saber cuándo entran (por ejemplo, el ticket de "Cómo empezamos").
  document.querySelectorAll('[data-ve]').forEach((el) => alEntrar(el, () => el.classList.add('ve'), '0px 0px -20% 0px'));

  // El botón del ejemplo: vos decidís si se envía.
  const boton = document.getElementById('ap-boton');
  if (boton) boton.addEventListener('click', () => {
    const hecho = boton.classList.toggle('hecho');
    boton.setAttribute('aria-pressed', String(hecho));
  });
}
