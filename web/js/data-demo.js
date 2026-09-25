// data.argy · "Preguntale a tu negocio."
// Demo con datos de ejemplo: la respuesta sale del punto (sección 19.1).
// Mientras piensa, el punto es un ovillo que gira; al responder, el punto llega.

import { reduce, espera, alVer } from './util.js';

const $ = (n) => '$ ' + n.toLocaleString('es-AR');

const RESPUESTAS = {
  plata: {
    fuentes: ['ventas', 'costos', 'cobros'],
    pasos: ['Leyendo las ventas de septiembre…', 'Cruzando con los costos de tus proveedores…', 'Revisando comisiones y envíos…'],
    texto: 'Encontré tres fugas este mes. Juntas suman <strong>$ 456.000</strong>. La más grande son los envíos: cobrás $ 3.500 fijo y te cuestan $ 5.200 en promedio.',
    barras: { titulo: ['Pérdida estimada', 'septiembre'], filas: [['Envíos cobrados de menos', 212000, true], ['Cuotas sin interés', 148000], ['Yerba 1 kg sin actualizar', 96000]] },
    acciones: ['Ajustar el costo de envío', 'Ver el detalle'],
  },
  rentables: {
    fuentes: ['costos', 'ventas', 'stock'],
    pasos: ['Comparando listas de precios de julio y septiembre…', 'Calculando el margen de cada producto…'],
    texto: 'Cuatro productos se siguen vendiendo bien, pero ya casi no te dejan margen. <strong>Tus proveedores subieron y tus precios no.</strong>',
    barras: { titulo: ['Margen actual', 'antes → ahora'], pct: true, filas: [['Galletitas surtidas', 4, true, '18 % → 4 %'], ['Aceite 1,5 L', 6, true, '22 % → 6 %'], ['Yerba 1 kg', 7, false, '19 % → 7 %'], ['Café molido 500 g', 9, false, '25 % → 9 %']] },
    acciones: ['Proponer precios nuevos', 'Ver proveedores'],
  },
  volver: {
    fuentes: ['clientes', 'ventas'],
    pasos: ['Mirando cada cuánto compra cada cliente…', 'Buscando a los que están por volver…'],
    texto: '<strong>12 clientes</strong> compran cada dos o tres semanas y están dentro de su ventana. Estos cuatro son los más probables esta semana:',
    lista: [['Marta G.', 'compra cada 15 días · última hace 13', $(38000)], ['Almacén Don Luis', 'cada 21 días · última hace 19', $(124000)], ['Julio R.', 'cada 14 días · última hace 12', $(21500)], ['Carla P.', 'cada 20 días · última hace 18', $(46800)]],
    acciones: ['Mandarles un mensaje', 'Ver los 12'],
  },
  stock: {
    fuentes: ['stock', 'ventas', 'costos'],
    pasos: ['Revisando la rotación de cada producto…', 'Valorizando lo que no se mueve…'],
    texto: 'Tenés <strong>$ 1,2 millones</strong> en 23 productos que no se venden hace más de 60 días. Casi la mitad está en dos categorías:',
    barras: { titulo: ['Stock sin rotación', 'por categoría'], filas: [['Conservas', 410000, true], ['Bebidas sin alcohol', 290000, true], ['Limpieza', 150000], ['Otras (20 productos)', 350000]] },
    acciones: ['Armar una promo de salida', 'Frenar esas compras'],
  },
  cambio: {
    fuentes: ['ventas', 'cobros', 'clientes'],
    pasos: ['Comparando septiembre con agosto…', 'Separando por canal de venta…'],
    texto: 'Vendiste <strong>8 % más</strong> que en agosto, pero el ticket promedio bajó 5 %: entran más pedidos, más chicos. Y WhatsApp ya es tu canal más grande.',
    linea: { titulo: ['Pedidos por semana', 'últimas 8'], series: [[42, 45, 44, 51, 55, 58, 66, 71], [60, 62, 57, 61, 59, 60, 57, 58]], nombres: ['WhatsApp', 'Tienda online'] },
    acciones: ['Ver por canal', 'Comparar con el año pasado'],
  },
  automatizar: {
    fuentes: ['ventas', 'facturas', 'cobros'],
    pasos: ['Buscando tareas que se repiten…', 'Estimando cuánto tiempo llevan…'],
    texto: 'Lo que más tiempo te lleva es pasar pedidos de WhatsApp al sistema: <strong>unos 180 por mes</strong>, a mano. Estas tres tareas pueden pasar solas:',
    lista: [['Cargar los pedidos de WhatsApp', 'hoy: copiar y pegar', '≈ 12 h/mes'], ['Facturar los cobros con QR', 'hoy: uno por uno', '≈ 5 h/mes'], ['Avisar cuando falta stock', 'hoy: mirar la planilla', '≈ 3 h/mes']],
    acciones: ['Ver cómo automatizarlo', 'Estimar el ahorro'],
  },
};

const OVILLO = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M14 5c6 0 9 4 8 8s-6 7-10 5-5-7-1-9 8 0 7 4-5 5-7 2"/></svg>';

function nodo(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function barras({ titulo, filas, pct }) {
  const max = Math.max(...filas.map((f) => f[1]));
  const escala = pct ? 30 : max;
  return `<div class="msg-grafico"><p class="msg-grafico-t"><span>${titulo[0]}</span><span>${titulo[1]}</span></p>${filas.map((f, i) => `
    <p class="barra-fila${f[2] ? ' clave' : ''}" style="--i:${i}"><span>${f[0]}</span><span class="barra-pista"><i style="--v:${Math.max(4, f[1] / escala * 100).toFixed(1)}%"></i></span><b>${f[3] || $(f[1])}</b></p>`).join('')}</div>`;
}

function linea({ titulo, series, nombres }) {
  const W = 640;
  const H = 120;
  const todos = series.flat();
  const min = Math.min(...todos) - 6;
  const max = Math.max(...todos) + 4;
  const x = (i) => (i / (series[0].length - 1)) * (W - 90);
  const y = (v) => H - ((v - min) / (max - min)) * H;
  const camino = (s) => s.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('');
  const [a, b] = series;
  const area = `${camino(a)}L${x(a.length - 1).toFixed(1)} ${H}L0 ${H}Z`;
  return `<div class="msg-grafico"><p class="msg-grafico-t"><span>${titulo[0]}</span><span>${titulo[1]}</span></p>
    <svg class="linea-graf" viewBox="0 -8 ${W} ${H + 16}" preserveAspectRatio="xMinYMid meet" role="img" aria-label="${nombres[0]} crece de ${a[0]} a ${a[a.length - 1]} pedidos por semana; ${nombres[1]} se mantiene cerca de ${b[b.length - 1]}.">
      <line x1="0" x2="${W - 90}" y1="${H}" y2="${H}"/>
      <path class="area" d="${area}"/>
      <path class="l" pathLength="1" d="${camino(b)}"/>
      <path class="l l2" pathLength="1" d="${camino(a)}"/>
      <circle r="4.5" cx="${x(a.length - 1)}" cy="${y(a[a.length - 1])}"/>
      <text x="${x(a.length - 1) + 12}" y="${y(a[a.length - 1]) + 4}">${nombres[0]} ${a[a.length - 1]}</text>
      <text x="${x(b.length - 1) + 12}" y="${y(b[b.length - 1]) + 4}">${nombres[1]} ${b[b.length - 1]}</text>
    </svg></div>`;
}

function lista(items) {
  return `<ul class="msg-lista">${items.map((f, i) => `<li style="--i:${i}"><span><strong>${f[0]}</strong> · ${f[1]}</span><b>${f[2]}</b></li>`).join('')}</ul>`;
}

/** Revela el texto palabra por palabra sin perder las negritas. */
async function escribir(el, html) {
  el.innerHTML = html;
  if (reduce) return;
  const palabras = [];
  const recorrer = (n) => {
    [...n.childNodes].forEach((c) => {
      if (c.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
          const s = document.createElement('span');
          s.textContent = t;
          s.style.opacity = '0';
          palabras.push(s);
          frag.appendChild(s);
        });
        c.replaceWith(frag);
      } else recorrer(c);
    });
  };
  recorrer(el);
  for (const s of palabras) {
    s.style.transition = 'opacity 240ms';
    s.style.opacity = '1';
    await espera(26);
  }
}

export function iniciarDemo() {
  const demo = document.getElementById('demo-data');
  if (!demo) return;
  const hilo = document.getElementById('demo-hilo');
  const botones = [...demo.querySelectorAll('.demo-preguntas button')];
  const fuentes = Object.fromEntries([...demo.querySelectorAll('[data-fuente]')].map((li) => [li.dataset.fuente, li]));
  let ocupado = false;

  hilo.appendChild(nodo(`<div class="msg-argy"><span class="msg-av">${OVILLO}</span><div class="msg-cuerpo"><p class="msg-texto">Hola. Tengo conectadas seis fuentes de tu negocio. Preguntame lo que quieras saber.</p></div></div>`));

  const bajar = () => hilo.scrollTo({ top: hilo.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });

  async function responder(clave, boton) {
    if (ocupado) return;
    ocupado = true;
    const r = RESPUESTAS[clave];
    hilo.setAttribute('aria-busy', 'true');
    botones.forEach((b) => { b.disabled = true; b.setAttribute('aria-pressed', String(b === boton)); });

    hilo.appendChild(nodo(`<p class="msg-yo">${boton.textContent}</p>`));
    bajar();
    await espera(380);

    const msg = nodo(`<div class="msg-argy"><span class="msg-av pensando">${OVILLO}</span><div class="msg-cuerpo"><p class="msg-estado"></p><p class="msg-texto"></p></div></div>`);
    hilo.appendChild(msg);
    const av = msg.querySelector('.msg-av');
    const estado = msg.querySelector('.msg-estado');
    const texto = msg.querySelector('.msg-texto');
    bajar();

    for (let i = 0; i < r.pasos.length; i++) {
      estado.textContent = r.pasos[i];
      Object.values(fuentes).forEach((li) => li.classList.remove('consultando'));
      r.fuentes.slice(0, i + 2).forEach((f) => fuentes[f] && fuentes[f].classList.add('consultando'));
      await espera(620);
    }
    Object.values(fuentes).forEach((li) => li.classList.remove('consultando'));
    av.classList.remove('pensando');
    estado.remove();

    await escribir(texto, r.texto);
    let extra = '';
    if (r.barras) extra += barras(r.barras);
    if (r.linea) extra += linea(r.linea);
    if (r.lista) extra += lista(r.lista);
    extra += `<p class="msg-acciones" aria-label="Acciones sugeridas">${r.acciones.map((a) => `<span>${a}</span>`).join('')}</p>`;
    msg.querySelector('.msg-cuerpo').insertAdjacentHTML('beforeend', extra);
    bajar();
    await espera(500);
    bajar();

    hilo.setAttribute('aria-busy', 'false');
    botones.forEach((b) => { b.disabled = false; });
    ocupado = false;
  }

  botones.forEach((b) => b.addEventListener('click', () => responder(b.dataset.q, b)));

  // La primera pregunta se hace sola cuando la demo aparece en pantalla.
  const io = alVer(demo, () => {
    io.disconnect();
    setTimeout(() => { if (!ocupado && hilo.querySelectorAll('.msg-yo').length === 0) responder('plata', botones[0]); }, reduce ? 0 : 700);
  }, null, { umbral: .45 });
}
