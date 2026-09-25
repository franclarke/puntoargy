// 01 · Así se trabaja acá. Cada figura entra y se "lee": el punto marca el detalle que importa.

import { reduce, alVer, alRedimensionar } from './util.js';
import { crearLectura } from './lectura.js';

export function iniciarFiguras() {
  const figuras = [...document.querySelectorAll('.figura')];
  const lecturas = [];
  figuras.forEach((fig) => {
    const obj = fig.querySelector('.fig-obj');
    const capa = document.createElement('div');
    capa.className = 'lectura';
    obj.appendChild(capa);
    const lec = crearLectura(capa, { modo: 'cerca' });
    lecturas.push(lec);
    const spans = [...obj.querySelectorAll('.leer')];
    if (reduce) {
      fig.classList.add('ve');
      spans.forEach((s) => lec.leer(s));
      return;
    }
    const io = alVer(fig, () => {
      io.disconnect();
      fig.classList.add('ve');
      setTimeout(() => spans.forEach((s) => lec.leer(s)), 900);
    }, null, { margen: '0px 0px -18% 0px' });
  });
  alRedimensionar(() => lecturas.forEach((l) => l.recalcular()));
}
