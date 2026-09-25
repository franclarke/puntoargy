// 04 · Lo que nos preguntamos: los bocetos se dibujan al entrar, como un plano que se traza.

import { reduce, alVer } from './util.js';

export function iniciarPlanos() {
  document.querySelectorAll('.plano').forEach((plano) => {
    plano.querySelectorAll('.pd-trazo, .pd-guia, .pd-cajas rect, .pd-caja').forEach((el) => {
      const L = el.getTotalLength ? Math.ceil(el.getTotalLength()) : 400;
      el.style.setProperty('--l', L);
    });
    if (reduce) { plano.classList.add('ve'); return; }
    const io = alVer(plano, () => { io.disconnect(); plano.classList.add('ve'); }, null, { margen: '0px 0px -20% 0px' });
  });
}
