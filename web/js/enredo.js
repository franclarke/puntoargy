// Capítulo 01 · El enredo.
// Escena fija: con el scroll aparece cada herramienta sobre la mesa y el hilo gris
// la enreda con las anteriores. El ruido sube: pestañas, chats, versiones del Excel.

import { reduce, azar, clamp, tramo, decidida, escena, alRedimensionar } from './util.js';
import { enredo, suave, medir, preparar } from './hilo.js';

const PASOS = 6;

export function iniciarEnredo() {
  const sec = document.getElementById('escena-enredo');
  if (!sec) return;
  const mesa = document.getElementById('mesa-enredo');
  const svg = mesa.querySelector('.hilo-svg');
  const [sombra, trazo] = svg.querySelectorAll('path');
  const lineas = [...document.querySelectorAll('#enredo-lineas li')];
  const objetos = [...mesa.querySelectorAll('.obj')];
  const contadores = [...document.querySelectorAll('.contadores dd')].map((dd) => ({ dd, v: dd.dataset.c.split(',') }));

  let marcas = [];
  let L = 0;
  let pasoActual = -1;

  function geometria() {
    const W = mesa.clientWidth;
    const H = mesa.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const porPaso = [];
    for (let k = 0; k < PASOS; k++) porPaso.push([]);
    objetos.forEach((o) => {
      if (!o.hasAttribute('data-ancla')) return;
      porPaso[Number(o.dataset.paso)].push({
        x: o.offsetLeft + o.offsetWidth / 2,
        y: o.offsetTop + o.offsetHeight / 2,
        rx: Math.min(o.offsetWidth * .5, 120),
        ry: Math.min(o.offsetHeight * .4, 110),
      });
    });
    // Cada paso visita su herramienta nueva y vuelve a alguna anterior: el enredo se cierra sobre sí mismo.
    const rand = azar(23);
    const visitas = [];
    const cortes = [];
    const vistas = [];
    porPaso.forEach((anclas) => {
      anclas.forEach((a) => { visitas.push(a); vistas.push(a); });
      if (vistas.length > 1) {
        const extra = Math.min(2, vistas.length - 1);
        for (let e = 0; e < extra; e++) visitas.push(vistas[Math.floor(rand() * (vistas.length - 1))]);
      }
      cortes.push(visitas.length);
    });
    const { pts, marcas: m } = enredo(visitas, rand, { inicio: [-40, H * .35], vueltas: [.6, 1.3], rulos: 1, rulo: Math.max(14, W * .03) });
    const d = suave(pts);
    L = preparar(trazo, d);
    preparar(sombra, d);
    // Largo acumulado al terminar cada paso.
    marcas = cortes.map((c) => medir(suave(pts.slice(0, m[c - 1] + 1))));
  }

  function mostrarPaso(k) {
    if (k === pasoActual) return;
    pasoActual = k;
    lineas.forEach((li, i) => {
      li.classList.toggle('visible', i <= k);
      li.classList.toggle('activa', i === k);
    });
    objetos.forEach((o) => o.classList.toggle('en-mesa', Number(o.dataset.paso) <= k));
    contadores.forEach(({ dd, v }) => {
      const nuevo = v[clamp(k, 0, v.length - 1)];
      if (dd.textContent !== nuevo) {
        dd.textContent = nuevo;
        dd.classList.add('sube');
        setTimeout(() => dd.classList.remove('sube'), 500);
      }
    });
  }

  function largoEn(p) {
    // El hilo crece durante el primer 70 % de cada paso y el último paso se sostiene.
    const x = p * (PASOS + .6);
    const k = Math.min(PASOS - 1, Math.floor(x));
    const local = decidida(tramo(x - k, 0, .7));
    const desde = k === 0 ? 0 : marcas[k - 1];
    return { k, largo: desde + (marcas[k] - desde) * local };
  }

  function pintar(p) {
    const { k, largo } = largoEn(p);
    mostrarPaso(k);
    const v = Math.max(0, L - largo);
    trazo.style.strokeDashoffset = v;
    sombra.style.strokeDashoffset = v;
  }

  geometria();
  if (reduce) {
    mostrarPaso(PASOS - 1);
    trazo.style.strokeDashoffset = 0;
    sombra.style.strokeDashoffset = 0;
    return;
  }
  let ultimo = 0;
  escena(sec, (p) => { ultimo = p; pintar(p); });
  alRedimensionar(() => { geometria(); pasoActual = -1; pintar(ultimo); });
}
