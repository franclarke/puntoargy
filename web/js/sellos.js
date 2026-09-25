// sellos.argy · el álbum de sellos. Cada compra estampa un sello; cada colección, un premio.

import { reduce, alVer } from './util.js';

export function iniciarSellos() {
  const album = document.getElementById('album');
  const boton = document.getElementById('sellos-boton');
  if (!album || !boton) return;
  const tarjetas = [...album.querySelectorAll('.album-card')].map((card) => ({
    card,
    total: Number(card.dataset.total),
    inicial: Number(card.dataset.sellos),
    n: 0,
    inicialNombre: card.querySelector('b').textContent.trim().charAt(0),
    slots: [],
    cuenta: card.querySelector('.ac-cuenta'),
    premio: card.querySelector('.ac-premio'),
    textoPremio: card.querySelector('.ac-premio').textContent,
  }));

  function estampar(t, animar) {
    const slot = t.slots[t.n];
    if (!slot) return;
    const s = document.createElement('span');
    s.className = 'sello-tinta' + (animar ? ' estampa' : '');
    s.style.setProperty('--rot', `${Math.round(-18 + ((t.n * 37) % 30))}deg`);
    s.innerHTML = `${t.inicialNombre}<i></i>`;
    slot.classList.add('lleno');
    slot.appendChild(s);
    t.n++;
    t.cuenta.textContent = `${t.n}/${t.total}`;
    if (t.n === t.total) {
      t.card.classList.add('completa');
      t.premio.textContent = t.textoPremio.startsWith('¡') ? t.textoPremio : `¡Completado! ${t.textoPremio.replace('Premio: ', '')}`;
    }
  }

  function armar() {
    tarjetas.forEach((t) => {
      const cont = t.card.querySelector('.ac-sellos');
      cont.innerHTML = '';
      t.slots = [];
      t.n = 0;
      t.card.classList.remove('completa');
      t.premio.textContent = t.textoPremio;
      for (let i = 0; i < t.total; i++) {
        const slot = document.createElement('span');
        slot.className = 'sello-slot';
        cont.appendChild(slot);
        t.slots.push(slot);
      }
      t.cuenta.textContent = `0/${t.total}`;
    });
  }

  armar();
  const llenarIniciales = (animar) => {
    let demora = 0;
    tarjetas.forEach((t) => {
      for (let i = 0; i < t.inicial; i++) {
        if (animar) { setTimeout(() => estampar(t, true), demora); demora += 140; } else estampar(t, false);
      }
    });
  };

  if (reduce) llenarIniciales(false);
  else {
    const io = alVer(album, () => { io.disconnect(); llenarIniciales(true); }, null, { umbral: .4 });
  }

  boton.addEventListener('click', () => {
    const t = tarjetas.find((x) => x.n < x.total);
    if (!t) {
      armar();
      llenarIniciales(!reduce);
      boton.firstChild.textContent = 'Simular una compra';
      return;
    }
    estampar(t, !reduce);
    t.card.classList.add('recien');
    setTimeout(() => t.card.classList.remove('recien'), 500);
    if (tarjetas.every((x) => x.n === x.total)) boton.firstChild.textContent = 'Empezar de nuevo';
  });
}
