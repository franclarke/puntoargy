/* .argy — web v1 */
(function () {
  'use strict';

  // Contacto: cambiar acá cuando estén listos el email y el WhatsApp.
  var CONTACTO = {
    email: 'hola@puntoargy.com',
    whatsapp: '' // Formato internacional, solo números. Ejemplo: 5491122334455. Vacío = sin botón de WhatsApp.
  };

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DECIDIDA = 'cubic-bezier(.65,0,.15,1)';
  var LLEGADA = 'cubic-bezier(.34,1.56,.64,1)';

  function espera(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function anima(el, frames, opts) {
    if (!el || !el.animate) return Promise.resolve();
    var o = { fill: 'both', easing: DECIDIDA };
    for (var k in opts) o[k] = opts[k];
    return el.animate(frames, o).finished.catch(function () {});
  }

  // Links de email: todos salen de CONTACTO.email
  document.querySelectorAll('[data-email]').forEach(function (a) {
    var asunto = a.getAttribute('data-asunto');
    a.href = 'mailto:' + CONTACTO.email + (asunto ? '?subject=' + encodeURIComponent(asunto) : '');
    if (a.getAttribute('data-email') === 'texto') a.textContent = CONTACTO.email;
  });

  // Año del pie
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  // Cabecera: borde al hacer scroll
  var cabecera = document.getElementById('cabecera');
  function alScroll() { cabecera.classList.toggle('con-scroll', window.scrollY > 8); }
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

  // Hero: se dibuja el enredo, aparecen las herramientas, sale la ruta,
  // llega el punto y aparece la respuesta. El enredo no desaparece:
  // .argy conecta lo que la empresa ya usa.
  var ilus = document.getElementById('hero-ilus');
  function heroListo() { if (ilus) ilus.classList.add('ok'); }
  function heroAnimar() {
    if (!ilus) return;
    if (reduce || !ilus.animate) { heroListo(); return; }
    var hilo = ilus.querySelector('.hilo');
    var ruta = ilus.querySelector('.ruta');
    var punto = ilus.querySelector('.punto');
    var respuesta = ilus.querySelector('.respuesta');
    var trazo = function (el, ms, delay) {
      return anima(el, [{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }], { duration: ms, delay: delay || 0 });
    };
    ilus.querySelectorAll('.herramienta').forEach(function (h, i) {
      anima(h, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: 650 + i * 160 });
    });
    trazo(hilo, 1000, 250)
      .then(function () { return trazo(ruta, 700, 150); })
      .then(function () { return anima(punto, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 560, easing: LLEGADA }); })
      .then(function () { return anima(respuesta, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420 }); })
      .then(function () { return espera(200); })
      .then(heroListo);
  }
  heroAnimar();

  // Elementos que se animan al entrar en pantalla
  var observados = document.querySelectorAll('[data-anim]');
  function visto(el) {
    el.classList.add('visto');
    if (el.id === 'tablero') moverPedido();
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        visto(e.target);
      });
    }, { threshold: 0.35 });
    observados.forEach(function (el) { io.observe(el); });
  } else {
    observados.forEach(function (el) { el.classList.add('visto'); });
  }

  // Tablero: un pedido avanza de "Preparando" a "En camino"
  function moverPedido() {
    var tarjeta = document.getElementById('pedido-1043');
    var destino = document.querySelector('[data-col="camino"] .col-tarjetas');
    if (!tarjeta || !destino || !tarjeta.animate) return;
    setTimeout(function () {
      var antes = tarjeta.getBoundingClientRect();
      destino.insertBefore(tarjeta, destino.firstChild);
      var despues = tarjeta.getBoundingClientRect();
      tarjeta.classList.add('movida');
      tarjeta.animate(
        [{ transform: 'translate(' + (antes.left - despues.left) + 'px,' + (antes.top - despues.top) + 'px)' }, { transform: 'none' }],
        { duration: 700, easing: DECIDIDA }
      );
      document.querySelectorAll('.col').forEach(function (col) {
        var n = col.querySelector('.col-t span');
        if (n) n.textContent = String(col.querySelectorAll('.tarjeta').length);
      });
    }, 800);
  }

  // Agente: preguntas de ejemplo (ilustrativas)
  var RESPUESTAS = [
    'Vendiste 12% más que en agosto, pero el margen bajó: el aceite subió y todavía no actualizaste el precio.',
    'Yerba, aceite y azúcar. Con lo que venís vendiendo, se terminan antes del viernes.',
    'Tres clientes, $ 1.240.000 en total. El más atrasado es Almacén Rivas, con 45 días. ¿Les mando un recordatorio?'
  ];
  var preguntas = document.querySelectorAll('.pregunta');
  var chatPregunta = document.getElementById('chat-pregunta');
  var chatTexto = document.getElementById('chat-texto');
  var chatPunto = document.querySelector('.chat-punto');
  var burbuja = document.querySelector('.burbuja');
  preguntas.forEach(function (boton, i) {
    boton.addEventListener('click', function () {
      if (boton.getAttribute('aria-pressed') === 'true') return;
      preguntas.forEach(function (b) { b.setAttribute('aria-pressed', b === boton ? 'true' : 'false'); });
      chatPregunta.textContent = boton.textContent;
      chatTexto.textContent = RESPUESTAS[i];
      if (reduce) return;
      anima(chatPregunta, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320 });
      anima(chatPunto, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 560, delay: 260, easing: LLEGADA });
      anima(burbuja, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 620 });
    });
  });

  // Formulario: arma un email (o un WhatsApp) con lo que escribió la persona.
  // No guarda ni envía datos a ningún servidor.
  var form = document.getElementById('form-contacto');
  if (form) {
    var estado = document.getElementById('form-estado');
    var botonWhatsapp = document.getElementById('btn-whatsapp');
    if (CONTACTO.whatsapp) botonWhatsapp.hidden = false;

    var leer = function () {
      var f = new FormData(form);
      var v = function (k) { return String(f.get(k) || '').trim(); };
      return { nombre: v('nombre'), empresa: v('empresa'), problema: v('problema'), contacto: v('contacto') };
    };
    var validar = function (d) {
      var faltan = false;
      [['f-nombre', d.nombre], ['f-problema', d.problema]].forEach(function (c) {
        var campo = document.getElementById(c[0]);
        campo.setAttribute('aria-invalid', c[1] ? 'false' : 'true');
        if (!c[1]) faltan = true;
      });
      estado.classList.toggle('error', faltan);
      estado.textContent = faltan ? 'Contanos al menos tu nombre y qué te gustaría resolver.' : '';
      if (faltan) (d.nombre ? document.getElementById('f-problema') : document.getElementById('f-nombre')).focus();
      return !faltan;
    };
    var mensaje = function (d) {
      return [
        'Hola, soy ' + d.nombre + (d.empresa ? ', de ' + d.empresa : '') + '.',
        '',
        'Me gustaría resolver esto:',
        d.problema,
        d.contacto ? '\nMe pueden contactar por: ' + d.contacto : ''
      ].join('\n').trim();
    };

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = leer();
      if (!validar(d)) return;
      var asunto = 'Consulta desde puntoargy.com' + (d.empresa ? ' · ' + d.empresa : '');
      window.location.href = 'mailto:' + CONTACTO.email + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(mensaje(d));
      estado.textContent = 'Intentamos abrir tu programa de email con el mensaje listo. Si no se abrió, escribinos a ' + CONTACTO.email + '.';
    });

    botonWhatsapp.addEventListener('click', function () {
      var d = leer();
      if (!validar(d)) return;
      window.open('https://wa.me/' + CONTACTO.whatsapp + '?text=' + encodeURIComponent(mensaje(d)), '_blank', 'noopener');
    });
  }
})();
