// Hero: el titular sube palabra por palabra, la operación aparece sobre la mesa
// y la capa de lectura entiende el pedido de Marta. El punto del titular llega último.

import { reduce, puedeHover, espera, alRedimensionar } from './util.js';
import { partirPalabras, llegaPunto } from './revelar.js';
import { crearLectura } from './lectura.js';

export function iniciarHero() {
  const hero = document.getElementById('inicio');
  if (!hero) return;
  const titulo = hero.querySelector('.hero-titulo');
  const pto = document.getElementById('hero-punto');
  const mesa = document.getElementById('hero-mesa');
  const pedido = mesa.querySelector('.hm-pedido');
  const spans = [...mesa.querySelectorAll('.hm-celu .leer')];
  const lectura = crearLectura(document.getElementById('lectura-hero'));

  partirPalabras(titulo);
  hero.classList.add('iniciado');

  if (reduce) {
    titulo.classList.add('visto');
    mesa.classList.add('en-mesa');
    pedido.classList.add('ve');
    spans.forEach((s) => lectura.leer(s));
  } else {
    pto.classList.add('espera');
    (async () => {
      await espera(60);
      titulo.classList.add('visto');
      await espera(380);
      mesa.classList.add('en-mesa');
      await espera(1100);
      for (const s of spans) {
        lectura.leer(s);
        await espera(520);
      }
      await espera(520);
      pedido.classList.add('ve');
      await espera(700);
      llegaPunto(pto);
    })();
  }

  alRedimensionar(() => lectura.recalcular());

  // Profundidad: la mesa responde al puntero, apenas.
  if (puedeHover && !reduce) {
    const objetos = [...mesa.querySelectorAll('[data-prof]')];
    let raf = 0;
    let mx = 0;
    let my = 0;
    hero.addEventListener('pointermove', (e) => {
      mx = e.clientX / window.innerWidth - .5;
      my = e.clientY / window.innerHeight - .5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        objetos.forEach((o) => {
          const k = Number(o.dataset.prof) * 10;
          o.style.setProperty('--px', `${(-mx * k).toFixed(1)}px`);
          o.style.setProperty('--py', `${(-my * k).toFixed(1)}px`);
        });
      });
    });
  }
}
