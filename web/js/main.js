/* .argy — web v2 · dirección "El hilo" */
(function () {
  'use strict';

  var CONFIG = {
    email: 'hola@puntoargy.com',
    whatsapp: '', // Formato internacional, solo números. Ejemplo: 5491122334455. Vacío = sin botón.
    // Mientras falten las imágenes de brand/imagenes/guia-de-imagenes.md, muestra espacios reservados.
    // Pasar a false antes de publicar: las imágenes que falten se ocultan.
    IMAGENES_MAQUETA: true
  };

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var puedeHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  var DECIDIDA = 'cubic-bezier(.65,0,.15,1)';
  var LLEGADA = 'cubic-bezier(.34,1.56,.64,1)';
  var C = { hilo: [168, 163, 154], celeste: [116, 172, 223], tinta: '#1C1B19', piedra: '#F2F1ED' };

  /* ---------- Utilidades ---------- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function bezier(x1, y1, x2, y2) {
    function A(a, b) { return 1 - 3 * b + 3 * a; }
    function B(a, b) { return 3 * b - 6 * a; }
    function Cc(a) { return 3 * a; }
    function f(t, a, b) { return ((A(a, b) * t + B(a, b)) * t + Cc(a)) * t; }
    function s(t, a, b) { return 3 * A(a, b) * t * t + 2 * B(a, b) * t + Cc(a); }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var t = x;
      for (var i = 0; i < 8; i++) { var d = s(t, x1, x2); if (Math.abs(d) < 1e-6) break; t -= (f(t, x1, x2) - x) / d; }
      return f(t, y1, y2);
    };
  }
  var decidida = bezier(.65, 0, .15, 1);
  var llegada = bezier(.34, 1.56, .64, 1);
  function color(a, b, t) { return 'rgb(' + Math.round(lerp(a[0], b[0], t)) + ',' + Math.round(lerp(a[1], b[1], t)) + ',' + Math.round(lerp(a[2], b[2], t)) + ')'; }
  function anima(el, frames, opts) {
    if (!el || !el.animate || reduce) return Promise.resolve();
    var o = { fill: 'both', easing: DECIDIDA };
    for (var k in opts) o[k] = opts[k];
    return el.animate(frames, o).finished.catch(function () {});
  }
  function tween(ms, fn, ease) {
    return new Promise(function (res) {
      if (reduce) { fn(1); res(); return; }
      var t0 = performance.now(); ease = ease || decidida;
      (function paso(now) {
        var k = clamp((now - t0) / ms, 0, 1);
        fn(ease(k));
        if (k < 1) requestAnimationFrame(paso); else res();
      })(t0);
    });
  }

  // Muestreo de trazados SVG
  var NS = 'http://www.w3.org/2000/svg';
  var svgMuestras = document.createElementNS(NS, 'svg');
  svgMuestras.setAttribute('aria-hidden', 'true');
  svgMuestras.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden';
  document.body.appendChild(svgMuestras);
  function muestrear(d, n) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    svgMuestras.appendChild(p);
    var pts = muestrearElemento(p, n);
    svgMuestras.removeChild(p);
    return pts;
  }
  function muestrearElemento(p, n) {
    var L = p.getTotalLength(), out = [];
    for (var i = 0; i < n; i++) { var q = p.getPointAtLength(L * i / (n - 1)); out.push([q.x, q.y]); }
    return out;
  }
  function aD(pts) {
    var s = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length; i++) s += ' L' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1);
    return s;
  }
  function mezclar(A, B, t) { return A.map(function (p, i) { return [lerp(p[0], B[i][0], t), lerp(p[1], B[i][1], t)]; }); }

  // Visibilidad: ejecuta callbacks al entrar y salir de pantalla
  function enPantalla(el, entra, sale, umbral) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { entra(); return; }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) entra(); else if (sale) sale(); });
    }, { threshold: umbral || 0.2 }).observe(el);
  }

  /* ---------- Básicos ---------- */
  document.querySelectorAll('[data-email]').forEach(function (a) {
    var asunto = a.getAttribute('data-asunto');
    a.href = 'mailto:' + CONFIG.email + (asunto ? '?subject=' + encodeURIComponent(asunto) : '');
    if (a.getAttribute('data-email') === 'texto') a.textContent = CONFIG.email;
  });
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
  var cabecera = document.getElementById('cabecera');
  window.addEventListener('scroll', function () { cabecera.classList.toggle('con-scroll', window.scrollY > 50); }, { passive: true });

  /* ---------- Imágenes ---------- */
  function revisarFotos() {
    document.querySelectorAll('.foto').forEach(function (fig) {
      var imgs = [].slice.call(fig.querySelectorAll('img'));
      // Las imágenes se cargan solo si existen (así no hay pedidos rotos mientras faltan)
      Promise.all(imgs.map(function (img) {
        var src = img.getAttribute('data-src');
        if (!src) return Promise.resolve(true);
        if (!window.fetch || location.protocol === 'file:') { img.src = src; return Promise.resolve(true); }
        return fetch(src, { method: 'HEAD' }).then(function (r) { if (r.ok) img.src = src; return r.ok; }).catch(function () { return false; });
      })).then(function (res) {
        var todas = res.every(Boolean);
        if (!todas) fig.classList.add(CONFIG.IMAGENES_MAQUETA ? 'vacia' : 'oculta');
        var muestra = todas || CONFIG.IMAGENES_MAQUETA;
        if (fig.classList.contains('foto-desenredo') && todas) document.getElementById('desenredo-fijo').classList.add('con-fotos');
        if (fig.classList.contains('foto-deposito') && muestra) fig.parentNode.classList.add('con-foto');
        if (fig.classList.contains('foto-taller') && !muestra) fig.closest('.franja').hidden = true;
        if (fig.classList.contains('foto-construyendo') && !muestra) fig.parentNode.classList.add('sin-foto');
      });
    });
  }
  revisarFotos();

  /* ---------- Aparición ---------- */
  var revelables = document.querySelectorAll('[data-revela]');
  if ('IntersectionObserver' in window && !reduce) {
    var ioRevela = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('revelado'); ioRevela.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revelables.forEach(function (el) { ioRevela.observe(el); });
  } else {
    revelables.forEach(function (el) { el.classList.add('revelado'); });
  }
  var animables = document.querySelectorAll('[data-anim], .pie-sello');
  if ('IntersectionObserver' in window && !reduce) {
    var ioAnim = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); ioAnim.unobserve(e.target); } });
    }, { threshold: 0.35 });
    animables.forEach(function (el) { ioAnim.observe(el); });
  } else {
    animables.forEach(function (el) { el.classList.add('visto'); });
  }

  /* ---------- Hero: el hilo vivo ---------- */
  (function escena() {
    var el = document.getElementById('escena');
    if (!el) return;
    var canvas = el.querySelector('.lienzo');
    var ctx = canvas.getContext('2d');
    var N = 200;
    var base = muestrearElemento(el.querySelector('.g-enredo'), N);
    var ruta = muestrearElemento(el.querySelector('.g-ruta'), 32);
    var PUNTO = { x: 470, y: 296, r: 26 };
    var dx = new Float32Array(N), dy = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
    var escala = 1, dpr = 1;
    var lista = document.getElementById('feed-lista');
    var botones = [].slice.call(el.querySelectorAll('.herramienta'));
    var pistaEl = document.getElementById('escena-pista');

    function medir() {
      var w = el.clientWidth;
      escala = w / 640; dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(w * dpr);
      if (!corriendo) dibujar(performance.now());
    }

    var puntero = null, ultimaInteraccion = -1e9, ultimoEnvio = 0, siguiente = 0;
    function aVista(e) { var r = el.getBoundingClientRect(); return { x: (e.clientX - r.left) / escala, y: (e.clientY - r.top) / escala }; }
    function usada() { ultimaInteraccion = performance.now(); if (pistaEl) pistaEl.classList.add('usada'); }
    el.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch' && !e.buttons) return; puntero = aVista(e); if (e.target === canvas) usada(); });
    el.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') puntero = aVista(e); });
    el.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch') puntero = null; });
    el.addEventListener('pointerleave', function () { puntero = null; });

    var estado = { enredo: reduce ? 1 : 0, ruta: reduce ? 1 : 0, punto: reduce ? 1 : 0 };
    var senales = [], pulsos = [], inicio = 0, introLista = reduce;

    // Eventos de ejemplo por herramienta
    var pedido = 1047;
    var montos = ['18.900', '46.200', '84.500', '127.300', '9.800', '63.150'];
    var EVENTOS = {
      'WhatsApp': [function () { return 'Pedido #' + (pedido++) + ' cargado en el sistema'; }, function () { return 'Consulta respondida: ¿hacen envíos a Rosario?'; }],
      'Tiendanube': [function () { return 'Venta en la tienda · stock actualizado'; }, function () { return 'Pedido #' + (pedido++) + ' listo para preparar'; }],
      'Mercado Pago': [function () { return 'Cobro de $ ' + montos[Math.floor(Math.random() * montos.length)] + ' · factura emitida'; }],
      'Excel': [function () { return 'Lista de precios actualizada en la tienda'; }],
      'PDFs': [function () { return 'Factura de proveedor leída · vence el 15/10'; }]
    };
    var giro = {};
    function textoEvento(origen) {
      var l = EVENTOS[origen] || EVENTOS.WhatsApp;
      var i = (giro[origen] || 0) % l.length; giro[origen] = i + 1;
      return l[i]();
    }
    function agregarEvento(origen) {
      var li = document.createElement('li');
      li.className = 'evento nuevo';
      var o = document.createElement('span'); o.className = 'evento-o'; o.textContent = origen;
      var t = document.createElement('span'); t.className = 'evento-t'; t.textContent = textoEvento(origen);
      li.appendChild(o); li.appendChild(t);
      lista.querySelectorAll('.nuevo').forEach(function (x) { x.classList.remove('nuevo'); });
      lista.insertBefore(li, lista.firstChild);
      while (lista.children.length > 3) lista.removeChild(lista.lastElementChild);
      anima(li, [{ opacity: 0, transform: 'translateY(-10px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
    }

    function posicion(i, t) {
      var fijo = clamp((N - 1 - i) / 10, 0, 1); // el final del enredo queda fijo, pegado a la ruta
      var w = reduce ? 0 : fijo * 1.4;
      return [base[i][0] + dx[i] + Math.sin(t * 0.0011 + i * 0.21) * w, base[i][1] + dy[i] + Math.cos(t * 0.0009 + i * 0.17) * w];
    }

    function enviar(boton, manual) {
      var r = boton.getBoundingClientRect(), er = el.getBoundingClientRect();
      var cx = (r.left + r.width / 2 - er.left) / escala, cy = (r.top + r.height / 2 - er.top) / escala;
      var k = 0, mejor = 1e9;
      for (var i = 0; i < N - 12; i++) { var d = Math.hypot(base[i][0] - cx, base[i][1] - cy); if (d < mejor) { mejor = d; k = i; } }
      boton.classList.add('enviando');
      setTimeout(function () { boton.classList.remove('enviando'); }, 700);
      ultimoEnvio = performance.now();
      if (reduce) { agregarEvento(boton.getAttribute('data-h')); return; }
      senales.push({ desde: k, t0: performance.now(), dur: 700 + 1300 * (N - k) / N, origen: boton.getAttribute('data-h'), entrada: [cx, cy] });
      if (manual) usada();
    }
    botones.forEach(function (b) {
      b.setAttribute('aria-label', 'Mandar un ejemplo desde ' + b.textContent);
      b.addEventListener('click', function () { enviar(b, true); });
    });

    function recorrido(s, t) {
      var pts = [s.entrada];
      for (var i = s.desde; i < N; i++) pts.push(posicion(i, t));
      for (var j = 1; j < ruta.length; j++) pts.push(ruta[j]);
      return pts;
    }
    function enRecorrido(pts, p) {
      var tot = 0, seg = [];
      for (var i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
      var obj = tot * p;
      for (var k = 0; k < seg.length; k++) {
        if (obj <= seg[k]) { var f = seg[k] ? obj / seg[k] : 0; return [lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)]; }
        obj -= seg[k];
      }
      return pts[pts.length - 1];
    }

    function fisica() {
      for (var i = 0; i < N; i++) {
        var fijo = clamp((N - 1 - i) / 10, 0, 1);
        var ax = -0.05 * dx[i], ay = -0.05 * dy[i];
        if (puntero && fijo > 0) {
          var px = base[i][0] + dx[i] - puntero.x, py = base[i][1] + dy[i] - puntero.y;
          var d = Math.hypot(px, py);
          if (d < 90 && d > 0.01) { var f = Math.pow(1 - d / 90, 2) * 2.4 * fijo; ax += px / d * f; ay += py / d * f; }
        }
        vx[i] = (vx[i] + ax) * 0.86; vy[i] = (vy[i] + ay) * 0.86;
        dx[i] += vx[i]; dy[i] += vy[i];
      }
    }

    function dibujar(t) {
      ctx.setTransform(dpr * escala, 0, 0, dpr * escala, 0, 0);
      ctx.clearRect(0, 0, 640, 640);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // Enredo
      var cuenta = Math.max(2, Math.floor(estado.enredo * N));
      var p0 = posicion(0, t);
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]);
      for (var i = 1; i < cuenta - 1; i++) {
        var a = posicion(i, t), b = posicion(i + 1, t);
        ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      }
      var ult = posicion(cuenta - 1, t); ctx.lineTo(ult[0], ult[1]);
      ctx.strokeStyle = '#A8A39A'; ctx.lineWidth = 3; ctx.stroke();
      // Ruta
      if (estado.ruta > 0) {
        var cr = Math.max(2, Math.ceil(estado.ruta * ruta.length));
        ctx.beginPath(); ctx.moveTo(ruta[0][0], ruta[0][1]);
        for (var j = 1; j < cr; j++) ctx.lineTo(ruta[j][0], ruta[j][1]);
        ctx.strokeStyle = '#74ACDF'; ctx.lineWidth = 11; ctx.stroke();
      }
      // Pulsos al llegar
      pulsos = pulsos.filter(function (p) { return t - p < 800; });
      pulsos.forEach(function (p) {
        var k = (t - p) / 800;
        ctx.beginPath(); ctx.arc(PUNTO.x, PUNTO.y, PUNTO.r + 26 * decidida(k), 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(116,172,223,' + (0.6 * (1 - k)).toFixed(3) + ')'; ctx.lineWidth = 3; ctx.stroke();
      });
      // Punto
      if (estado.punto > 0) {
        ctx.beginPath(); ctx.arc(PUNTO.x, PUNTO.y, PUNTO.r * Math.max(0, estado.punto), 0, Math.PI * 2);
        ctx.fillStyle = '#74ACDF'; ctx.fill();
      }
      // Señales viajando
      senales = senales.filter(function (s) {
        var p = (t - s.t0) / s.dur;
        if (p >= 1) { pulsos.push(t); agregarEvento(s.origen); return false; }
        var pos = enRecorrido(recorrido(s, t), decidida(clamp(p, 0, 1)));
        ctx.beginPath(); ctx.arc(pos[0], pos[1], 7, 0, Math.PI * 2);
        ctx.fillStyle = '#1C1B19'; ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = '#F2F1ED'; ctx.stroke();
        return true;
      });
    }

    var corriendo = false, visible = false, raf = 0;
    function cuadro(t) {
      if (!inicio) inicio = t;
      var e = t - inicio;
      if (!introLista) {
        estado.enredo = decidida(clamp((e - 150) / 1400, 0, 1));
        if (e > 650) el.classList.add('lista');
        estado.ruta = decidida(clamp((e - 1550) / 600, 0, 1));
        estado.punto = llegada(clamp((e - 2150) / 560, 0, 1));
        if (e > 2550) el.classList.add('con-feed');
        if (e > 2800) { introLista = true; ultimoEnvio = t; }
      } else if (t - ultimoEnvio > 3400 && t - ultimaInteraccion > 6000 && !senales.length) {
        enviar(botones[siguiente++ % botones.length], false);
      }
      fisica();
      dibujar(t);
      if (corriendo) raf = requestAnimationFrame(cuadro);
    }
    function arrancar() { if (corriendo || reduce) return; corriendo = true; raf = requestAnimationFrame(cuadro); }
    function parar() { corriendo = false; cancelAnimationFrame(raf); }

    medir();
    if (window.ResizeObserver) new ResizeObserver(medir).observe(el);
    if (reduce) {
      el.classList.add('lista'); el.classList.add('con-feed');
      dibujar(0);
    } else {
      enPantalla(el, function () { visible = true; if (!document.hidden) arrancar(); }, function () { visible = false; parar(); }, 0.05);
      document.addEventListener('visibilitychange', function () { if (document.hidden) parar(); else if (visible) arrancar(); });
    }
  })();

  /* ---------- La línea que recorre la página ---------- */
  (function riel() {
    var svg = document.getElementById('riel');
    var main = document.getElementById('contenido');
    var inicioEl = document.querySelector('[data-riel="inicio"]');
    var remateEl = document.getElementById('remate');
    var finEl = document.getElementById('contacto-punto');
    if (!svg || !main || !inicioEl || !remateEl || !finEl) return;
    var hilo = svg.querySelector('.riel-hilo');
    var rutas = [].slice.call(svg.querySelectorAll('.riel-ruta'));
    var grupos = [].slice.call(svg.querySelectorAll('.riel-estaciones'));
    var cabeza = svg.querySelector('.riel-cabeza');
    var estaciones = [].slice.call(document.querySelectorAll('[data-estacion]'));
    var oscuros = [].slice.call(document.querySelectorAll('main .oscuro'));
    var geo = null;

    function azar(semilla) { return function () { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; }; }
    function puntoDeEtiqueta(el, ox, oy) {
      var r = el.getBoundingClientRect();
      var pad = el.classList.contains('etiqueta-horizonte') ? 11 : 0;
      return { x: r.left - ox + pad + 4, y: r.top - oy + r.height / 2 };
    }
    function muestrasY(p, largo) {
      var m = [], maxY = -1e9;
      for (var l = 0; l <= largo; l += 6) { var q = p.getPointAtLength(l); maxY = Math.max(maxY, q.y); m.push([l, maxY]); }
      m.push([largo, Math.max(maxY, p.getPointAtLength(largo).y)]);
      return m;
    }
    function largoEn(m, y) {
      if (y <= m[0][1]) return 0;
      var lo = 0, hi = m.length - 1;
      if (y >= m[hi][1]) return m[hi][0];
      while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (m[mid][1] < y) lo = mid; else hi = mid; }
      var f = (y - m[lo][1]) / ((m[hi][1] - m[lo][1]) || 1);
      return lerp(m[lo][0], m[hi][0], f);
    }

    function construir() {
      var mr = main.getBoundingClientRect(), ox = mr.left, oy = mr.top;
      var W = main.clientWidth, H = main.scrollHeight;
      var a = puntoDeEtiqueta(inicioEl, ox, oy);
      var railX = a.x - 4 - 46;
      if (railX < 26 || window.innerWidth < 1080) { svg.classList.add('apagado'); geo = null; finFallback(); return; }
      svg.classList.remove('apagado');
      svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

      // Hilo: de la etiqueta "El enredo" hasta el remate, gris y enredado
      var rr = remateEl.getBoundingClientRect();
      var yR = rr.top - oy + 26;
      var rnd = azar(11), lado = 1, y = a.y + 20;
      var d = 'M' + (a.x - 6) + ' ' + a.y + ' C' + (a.x - 30) + ' ' + (a.y - 18) + ', ' + (railX + 14) + ' ' + (a.y - 26) + ', ' + railX + ' ' + y;
      while (y < yR - 70) {
        var paso = 54 + rnd() * 40, amp = 12 + rnd() * 16, ny = Math.min(yR - 30, y + paso);
        d += ' C' + (railX + amp * lado).toFixed(1) + ' ' + (y + paso * 0.95).toFixed(1) + ', ' + (railX - amp * lado * 1.3).toFixed(1) + ' ' + (y + paso * 0.05).toFixed(1) + ', ' + railX + ' ' + ny.toFixed(1);
        y = ny; lado *= -1;
      }
      d += ' L' + railX + ' ' + yR;
      hilo.setAttribute('d', d);

      // Ruta: del remate al punto del contacto, celeste (blanca sobre campos celestes)
      var f = finEl.getBoundingClientRect();
      var fy = f.top - oy + f.height / 2, fxIzq = f.left - ox, radio = 32;
      var dR = 'M' + railX + ' ' + yR + ' L' + railX + ' ' + (fy - radio) + ' Q' + railX + ' ' + fy + ' ' + (railX + radio) + ' ' + fy + ' L' + (fxIzq - 2) + ' ' + fy;
      rutas.forEach(function (p) { p.setAttribute('d', dR); });

      // Estaciones: cada sección se conecta a la línea
      var html = '<g class="estacion" data-y="' + yR + '"><circle class="estacion-nodo" cx="' + railX + '" cy="' + yR + '" r="9"/></g>';
      var ys = [yR];
      estaciones.forEach(function (el) {
        var p = puntoDeEtiqueta(el, ox, oy);
        if (p.y <= yR) return;
        ys.push(p.y);
        html += '<g class="estacion"><path class="estacion-tramo" pathLength="1" d="M' + railX + ' ' + p.y + ' L' + (p.x - 9) + ' ' + p.y + '"/><circle class="estacion-nodo" cx="' + railX + '" cy="' + p.y + '" r="6"/></g>';
      });
      grupos.forEach(function (g) { g.innerHTML = html; });

      // Máscaras para los campos celestes
      svg.querySelectorAll('.riel-fondo').forEach(function (r) { r.setAttribute('x', 0); r.setAttribute('y', 0); r.setAttribute('width', W); r.setAttribute('height', H); });
      var campos = [].slice.call(document.querySelectorAll('main .campo')).map(function (s) { var r = s.getBoundingClientRect(); return [r.top - oy, r.height]; });
      var camposHtml = campos.map(function (c) { return '<rect x="0" y="' + c[0] + '" width="' + W + '" height="' + c[1] + '"/>'; }).join('');
      svg.querySelectorAll('.riel-campos').forEach(function (g) { g.innerHTML = camposHtml; });
      var zonasOscuras = oscuros.map(function (s) { var r = s.getBoundingClientRect(); return [r.top - oy, r.top - oy + r.height]; });

      var lh = hilo.getTotalLength(), lr = rutas[0].getTotalLength();
      hilo.style.strokeDasharray = lh + ' ' + lh;
      rutas.forEach(function (p) { p.style.strokeDasharray = lr + ' ' + lr; });
      geo = {
        lh: lh, lr: lr, mh: muestrasY(hilo, lh), mr: muestrasY(rutas[0], lr),
        inicioY: a.y, yR: yR, fy: fy, ys: ys, campos: campos, oscuros: zonasOscuras
      };
      actualizar();
    }

    function finFallback() {
      enPantalla(finEl, function () { finEl.classList.add('llego'); }, null, 0.6);
    }

    function actualizar() {
      if (!geo) return;
      var mr = main.getBoundingClientRect();
      var punta = (reduce ? 1e9 : window.innerHeight * 0.62 - mr.top);
      var lh = largoEn(geo.mh, punta);
      var lr = punta >= geo.fy ? geo.lr : (punta > geo.yR ? largoEn(geo.mr, punta) : 0);
      hilo.style.strokeDashoffset = geo.lh - lh;
      rutas.forEach(function (p) { p.style.strokeDashoffset = geo.lr - lr; });
      grupos.forEach(function (g) {
        [].slice.call(g.children).forEach(function (e, i) { e.classList.toggle('on', punta >= geo.ys[i]); });
      });
      if (punta >= geo.fy) finEl.classList.add('llego');
      // Cabeza de la línea
      var activa = punta > geo.inicioY && punta < geo.fy;
      cabeza.classList.toggle('oculta', !activa || reduce);
      if (activa) {
        var enRuta = punta > geo.yR;
        var q = enRuta ? rutas[0].getPointAtLength(lr) : hilo.getPointAtLength(lh);
        cabeza.setAttribute('cx', q.x.toFixed(1)); cabeza.setAttribute('cy', q.y.toFixed(1));
        cabeza.classList.toggle('en-hilo', !enRuta);
        cabeza.classList.toggle('en-campo', geo.campos.some(function (c) { return q.y >= c[0] && q.y <= c[0] + c[1]; }));
        cabeza.classList.toggle('en-oscuro', geo.oscuros.some(function (o) { return q.y >= o[0] && q.y <= o[1]; }));
      }
    }

    var pendiente = false;
    window.addEventListener('scroll', function () {
      if (pendiente) return; pendiente = true;
      requestAnimationFrame(function () { pendiente = false; actualizar(); });
    }, { passive: true });
    var tReconstruir = 0;
    function programar() { clearTimeout(tReconstruir); tReconstruir = setTimeout(construir, 160); }
    window.addEventListener('resize', programar);
    if (window.ResizeObserver) new ResizeObserver(programar).observe(main);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(programar);
    window.addEventListener('load', programar);
    construir();
  })();

  /* ---------- El enredo: se desenreda con el scroll ---------- */
  (function desenredo() {
    var cont = document.getElementById('desenredo');
    var fijo = document.getElementById('desenredo-fijo');
    if (!cont || !fijo) return;
    var camino = fijo.querySelector('.morph');
    var punto = fijo.querySelector('.morph-punto');
    var fotoB = fijo.querySelector('.foto-b');
    var sintomas = [].slice.call(cont.querySelectorAll('.sintoma'));
    var A = muestrear(camino.getAttribute('d'), 180);
    var B = muestrear('M60 330 L300 330 Q340 330 340 290 L340 150 Q340 110 380 110 L520 110', 180);
    var escritorio = window.matchMedia('(min-width: 901px)');

    function pintar(p) {
      var e = decidida(clamp((p - 0.08) / 0.78, 0, 1));
      camino.setAttribute('d', aD(mezclar(A, B, e)));
      camino.style.stroke = color(C.hilo, C.celeste, e);
      camino.style.strokeWidth = (3 + 7 * e).toFixed(2);
      punto.style.transform = 'scale(' + Math.max(0, llegada(clamp((p - 0.84) / 0.14, 0, 1))).toFixed(3) + ')';
      if (fotoB) fotoB.style.opacity = e.toFixed(3);
      fijo.classList.toggle('final', p > 0.9);
      if (escritorio.matches) {
        var idx = Math.min(3, Math.floor(p * 4.4));
        sintomas.forEach(function (s, i) {
          s.classList.toggle('activo', i === idx && p < 0.96);
          s.classList.toggle('resuelto', i < idx || p >= 0.96);
        });
      } else {
        sintomas.forEach(function (s) { s.classList.remove('activo'); s.classList.toggle('resuelto', p >= 0.96); });
      }
    }
    if (reduce) { pintar(1); return; }
    var ultimo = -1;
    function porScroll() {
      if (!escritorio.matches) return;
      var r = cont.getBoundingClientRect();
      var p = clamp((window.innerHeight * 0.55 - r.top) / Math.max(1, r.height - window.innerHeight * 0.35), 0, 1);
      if (Math.abs(p - ultimo) > 0.001) { ultimo = p; pintar(p); }
    }
    window.addEventListener('scroll', function () { requestAnimationFrame(porScroll); }, { passive: true });
    porScroll();
    pintar(escritorio.matches ? Math.max(0, ultimo) : 0);
    var hecho = false;
    enPantalla(fijo, function () {
      if (escritorio.matches || hecho) return;
      hecho = true;
      tween(2400, pintar, function (k) { return k; });
    }, null, 0.5);
  })();

  /* ---------- Calculadora ---------- */
  (function calculadora() {
    var f = document.getElementById('calc');
    if (!f) return;
    var ids = ['pedidos', 'minutos', 'dias'];
    var rH = document.getElementById('r-horas'), rJ = document.getElementById('r-jornadas');
    var actual = 29;
    function jornadas(h) {
      var j = h / 8;
      if (j < 1) return 'Menos de una jornada de 8 horas.';
      if (Math.abs(j - Math.round(j)) < 0.05) return Math.round(j) + (Math.round(j) === 1 ? ' jornada' : ' jornadas') + ' de 8 horas.';
      if (j % 1 >= 0.5) return 'Casi ' + Math.ceil(j) + ' jornadas de 8 horas.';
      return 'Más de ' + Math.floor(j) + (Math.floor(j) === 1 ? ' jornada' : ' jornadas') + ' de 8 horas.';
    }
    function calcular() {
      var v = {};
      ids.forEach(function (id) {
        var input = document.getElementById('c-' + id);
        v[id] = Number(input.value);
        document.getElementById('o-' + id).textContent = input.value;
        input.style.setProperty('--pct', ((input.value - input.min) / (input.max - input.min) * 100) + '%');
      });
      var horas = Math.round(v.pedidos * v.minutos * v.dias / 60);
      var desde = actual;
      actual = horas;
      rJ.textContent = jornadas(v.pedidos * v.minutos * v.dias / 60);
      tween(380, function (k) { rH.textContent = Math.round(lerp(desde, horas, k)).toLocaleString('es-AR'); });
    }
    ids.forEach(function (id) { document.getElementById('c-' + id).addEventListener('input', calcular); });
    calcular();
  })();

  /* ---------- Demostraciones de los servicios ---------- */
  function demo(nombre, iniciar) {
    var el = document.querySelector('[data-demo="' + nombre + '"]');
    if (!el) return;
    var ctl = iniciar(el);
    if (reduce) { if (ctl.quieto) ctl.quieto(); return; }
    enPantalla(el, function () { if (!document.hidden) ctl.iniciar(); }, function () { ctl.detener(); }, 0.3);
  }

  function recorrerCamino(circulo, camino, ms, inverso) {
    return new Promise(function (res) {
      var L = camino.getTotalLength(), t0 = performance.now();
      (function paso(now) {
        var k = clamp((now - t0) / ms, 0, 1), e = decidida(k);
        var q = camino.getPointAtLength((inverso ? 1 - e : e) * L);
        circulo.setAttribute('cx', q.x); circulo.setAttribute('cy', q.y);
        if (k < 1) requestAnimationFrame(paso); else res();
      })(t0);
    });
  }

  demo('conectar', function (el) {
    var lineas = [].slice.call(el.querySelectorAll('.c-linea'));
    var chips = [].slice.call(el.querySelectorAll('.c-chip'));
    var senal = el.querySelector('.c-senal'), anillo = el.querySelector('.c-anillo');
    var activo = false, n = 0;
    var pares = [[0, 2], [1, 3], [3, 0], [2, 1], [0, 3], [1, 2]];
    function ciclo() {
      if (!activo) return;
      var par = pares[n++ % pares.length], a = par[0], b = par[1];
      chips[a].classList.add('activo');
      recorrerCamino(senal, lineas[a], 700)
        .then(function () {
          anima(anillo, [{ opacity: .9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(2.2)' }], { duration: 700, fill: 'none' });
          chips[a].classList.remove('activo');
          return recorrerCamino(senal, lineas[b], 700, true);
        })
        .then(function () {
          chips[b].classList.add('activo');
          senal.setAttribute('cx', -40);
          setTimeout(function () { chips[b].classList.remove('activo'); if (activo) ciclo(); }, 900);
        });
    }
    return { iniciar: function () { if (activo) return; activo = true; ciclo(); }, detener: function () { activo = false; } };
  });

  demo('automatizar', function (el) {
    var tareas = [].slice.call(el.querySelectorAll('.tareas li'));
    var titulo = el.querySelector('.tareas-top strong');
    var activo = false, timer = 0, num = 1047, i = 0;
    function paso() {
      if (!activo) return;
      if (i < tareas.length) { tareas[i++].classList.add('hecha'); timer = setTimeout(paso, 620); }
      else {
        timer = setTimeout(function () {
          tareas.forEach(function (t) { t.classList.remove('hecha'); });
          i = 0; titulo.textContent = 'Pedido #' + (++num);
          timer = setTimeout(paso, 700);
        }, 1600);
      }
    }
    return {
      iniciar: function () { if (activo) return; activo = true; timer = setTimeout(paso, 500); },
      detener: function () { activo = false; clearTimeout(timer); },
      quieto: function () { tareas.forEach(function (t) { t.classList.add('hecha'); }); }
    };
  });

  demo('sistemas', function (el) {
    var nums = [].slice.call(el.querySelectorAll('[data-cuenta]'));
    var activo = false, timer = 0, primera = true;
    function contar(nodo, hasta) {
      var desde = Number(nodo.textContent) || 0;
      tween(900, function (k) { nodo.textContent = Math.round(lerp(desde, hasta, k)); });
    }
    function latido() {
      if (!activo) return;
      var n = nums[0];
      n.textContent = Number(n.textContent) + 1;
      n.classList.add('cambio'); setTimeout(function () { n.classList.remove('cambio'); }, 600);
      timer = setTimeout(latido, 3200);
    }
    return {
      iniciar: function () {
        if (activo) return; activo = true;
        el.classList.add('activo');
        if (primera) { primera = false; nums.forEach(function (n) { var v = Number(n.getAttribute('data-cuenta')); n.textContent = '0'; contar(n, v); }); }
        timer = setTimeout(latido, 2600);
      },
      detener: function () { activo = false; clearTimeout(timer); },
      quieto: function () { el.classList.add('activo'); }
    };
  });

  demo('tienda', function (el) {
    var boton = el.querySelector('.pm-boton'), carrito = el.querySelector('.pm-carrito'), stock = el.querySelector('.pm-stock');
    var activo = false, timer = 0, c = 0, s = 12;
    function destello(n) { n.classList.add('cambio'); setTimeout(function () { n.classList.remove('cambio'); }, 650); }
    function comprar() {
      if (!activo) return;
      boton.classList.add('apretado');
      setTimeout(function () { boton.classList.remove('apretado'); }, 220);
      setTimeout(function () {
        c++; s--; carrito.textContent = c; stock.textContent = s; destello(carrito); destello(stock);
        if (s <= 7) { timer = setTimeout(function () { c = 0; s = 12; carrito.textContent = c; stock.textContent = s; destello(stock); timer = setTimeout(comprar, 1400); }, 1800); }
        else timer = setTimeout(comprar, 1500);
      }, 260);
    }
    return { iniciar: function () { if (activo) return; activo = true; timer = setTimeout(comprar, 600); }, detener: function () { activo = false; clearTimeout(timer); } };
  });

  demo('ia', function (el) {
    var scan = el.querySelector('.pdf-scan');
    var activo = false, timer = 0;
    function leer() {
      if (!activo) return;
      el.classList.remove('leido');
      scan.classList.remove('escaneando'); void scan.offsetWidth; scan.classList.add('escaneando');
      timer = setTimeout(function () { el.classList.add('leido'); timer = setTimeout(leer, 3200); }, 1250);
    }
    return {
      iniciar: function () { if (activo) return; activo = true; timer = setTimeout(leer, 400); },
      detener: function () { activo = false; clearTimeout(timer); },
      quieto: function () { el.classList.add('leido'); }
    };
  });

  demo('ordenar', function (el) {
    var vis = el.querySelector('.vis-ordenar');
    var camino = vis.querySelector('.o-morph');
    var A = muestrear(camino.getAttribute('d'), 150);
    var B = muestrear('M30 110 L200 110 Q230 110 230 80 L230 70 Q230 50 250 50 L400 50 Q430 50 430 80 L490 80', 150);
    var estadoActual = 0, objetivo = 0, anim = null, activo = false, timer = 0;
    function pintar(e) {
      camino.setAttribute('d', aD(mezclar(A, B, e)));
      camino.style.stroke = color(C.hilo, C.celeste, e);
      camino.style.strokeWidth = (3 + 5 * e).toFixed(2);
    }
    function ir(meta) {
      objetivo = meta;
      var desde = estadoActual, id = {};
      anim = id;
      vis.classList.toggle('ordenado', meta === 1);
      tween(650, function (k) { if (anim !== id) return; estadoActual = lerp(desde, meta, k); pintar(estadoActual); });
    }
    vis.addEventListener('mouseenter', function () { ir(1); });
    vis.addEventListener('mouseleave', function () { ir(0); });
    vis.addEventListener('focus', function () { ir(1); });
    vis.addEventListener('blur', function () { ir(0); });
    function alternar() { if (!activo) return; ir(objetivo ? 0 : 1); timer = setTimeout(alternar, 2600); }
    return {
      iniciar: function () { if (puedeHover || activo) return; activo = true; timer = setTimeout(alternar, 600); },
      detener: function () { activo = false; clearTimeout(timer); },
      quieto: function () { pintar(1); vis.classList.add('ordenado'); }
    };
  });

  /* ---------- Tablero de pedidos en vivo ---------- */
  (function tablero() {
    var el = document.getElementById('tablero');
    if (!el || reduce) return;
    var cols = [].slice.call(el.querySelectorAll('.col'));
    var total = document.getElementById('tablero-total');
    var activo = false, timer = 0, paso = 0, numero = 1047, cuenta = 8;
    var origenes = ['WhatsApp', 'Tienda', 'Tienda', 'WhatsApp'];
    function actualizarCuentas() {
      cols.forEach(function (c) { c.querySelector('.col-t span').textContent = c.querySelectorAll('.tarjeta').length; });
      total.textContent = cuenta;
    }
    function resaltar(t) { t.classList.add('movida'); setTimeout(function () { t.classList.remove('movida'); }, 1500); }
    function mover(t, destino) {
      var antes = t.getBoundingClientRect();
      destino.insertBefore(t, destino.firstChild);
      var despues = t.getBoundingClientRect();
      t.animate([{ transform: 'translate(' + (antes.left - despues.left) + 'px,' + (antes.top - despues.top) + 'px)' }, { transform: 'none' }], { duration: 700, easing: DECIDIDA });
      resaltar(t);
    }
    function avanzar() {
      if (!activo) return;
      var k = paso++ % 4;
      if (k === 0) {
        var t = document.createElement('div');
        t.className = 'tarjeta';
        var n = 1 + Math.floor(Math.random() * 6);
        t.innerHTML = '<b>#' + (numero++) + '</b><span>' + n + (n === 1 ? ' producto' : ' productos') + '</span><span class="origen">' + origenes[numero % 4] + '</span>';
        cols[0].querySelector('.col-tarjetas').insertBefore(t, cols[0].querySelector('.tarjeta'));
        t.animate([{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: DECIDIDA });
        resaltar(t); cuenta++;
      } else {
        var desde = cols[k - 1].querySelectorAll('.tarjeta');
        if (desde.length) mover(desde[desde.length - 1], cols[k].querySelector('.col-tarjetas'));
        if (k === 3) {
          var entregados = cols[3].querySelectorAll('.tarjeta');
          if (entregados.length > 3) {
            var viejo = entregados[entregados.length - 1];
            viejo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).finished.then(function () { viejo.remove(); actualizarCuentas(); });
          }
        }
      }
      actualizarCuentas();
      timer = setTimeout(avanzar, 2400);
    }
    enPantalla(el, function () { if (activo) return; activo = true; timer = setTimeout(avanzar, 900); }, function () { activo = false; clearTimeout(timer); }, 0.35);
  })();

  /* ---------- Asistente: preguntas de ejemplo ---------- */
  (function agente() {
    var cont = document.getElementById('agente');
    if (!cont) return;
    var RESPUESTAS = [
      'Vendiste 12% más que en agosto, pero el margen bajó: el aceite subió y todavía no actualizaste el precio.',
      'Yerba, aceite y azúcar. Con lo que venís vendiendo, se terminan antes del viernes.',
      'Tres clientes, $ 1.240.000 en total. El más atrasado es Almacén Rivas, con 45 días. ¿Les mando un recordatorio?'
    ];
    var botones = [].slice.call(cont.querySelectorAll('.pregunta'));
    var pregunta = document.getElementById('chat-pregunta'), texto = document.getElementById('chat-texto');
    var burbuja = cont.querySelector('.burbuja'), puntoChat = cont.querySelector('.chat-punto');
    var actual = 0, tocado = false, timer = 0, visible = false;
    function mostrar(i) {
      actual = i;
      botones.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      pregunta.textContent = botones[i].textContent;
      texto.textContent = RESPUESTAS[i];
      if (reduce) return;
      anima(pregunta, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320 });
      burbuja.classList.add('escribe');
      anima(puntoChat, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 560, delay: 200, easing: LLEGADA });
      setTimeout(function () {
        burbuja.classList.remove('escribe');
        anima(texto, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 360 });
      }, 1000);
    }
    botones.forEach(function (b, i) { b.addEventListener('click', function () { tocado = true; clearTimeout(timer); mostrar(i); }); });
    function auto() { if (tocado || !visible) return; mostrar((actual + 1) % botones.length); timer = setTimeout(auto, 6500); }
    if (!reduce) enPantalla(cont, function () { if (visible) return; visible = true; timer = setTimeout(auto, 3500); }, function () { visible = false; clearTimeout(timer); }, 0.4);
  })();

  /* ---------- Franja: parallax suave de la imagen ---------- */
  (function franja() {
    var fig = document.querySelector('.foto-taller');
    if (!fig || reduce) return;
    function mover() {
      var r = fig.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      fig.style.setProperty('--py', (p * -36).toFixed(1) + 'px');
    }
    window.addEventListener('scroll', function () { requestAnimationFrame(mover); }, { passive: true });
    mover();
  })();

  /* ---------- Formulario ---------- */
  (function formulario() {
    var form = document.getElementById('form-contacto');
    if (!form) return;
    var estado = document.getElementById('form-estado');
    var botonWhatsapp = document.getElementById('btn-whatsapp');
    if (CONFIG.whatsapp) botonWhatsapp.hidden = false;
    function leer() {
      var f = new FormData(form);
      var v = function (k) { return String(f.get(k) || '').trim(); };
      return { nombre: v('nombre'), empresa: v('empresa'), problema: v('problema'), contacto: v('contacto') };
    }
    function validar(d) {
      var faltan = false;
      [['f-nombre', d.nombre], ['f-problema', d.problema]].forEach(function (c) {
        var campo = document.getElementById(c[0]);
        campo.setAttribute('aria-invalid', c[1] ? 'false' : 'true');
        if (!c[1]) faltan = true;
      });
      estado.classList.toggle('error', faltan);
      estado.textContent = faltan ? 'Contanos al menos tu nombre y qué te gustaría resolver.' : '';
      if (faltan) document.getElementById(d.nombre ? 'f-problema' : 'f-nombre').focus();
      return !faltan;
    }
    function mensaje(d) {
      return ['Hola, soy ' + d.nombre + (d.empresa ? ', de ' + d.empresa : '') + '.', '', 'Me gustaría resolver esto:', d.problema, d.contacto ? '\nMe pueden contactar por: ' + d.contacto : ''].join('\n').trim();
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = leer();
      if (!validar(d)) return;
      var asunto = 'Consulta desde puntoargy.com' + (d.empresa ? ' · ' + d.empresa : '');
      window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(mensaje(d));
      estado.textContent = 'Intentamos abrir tu programa de email con el mensaje listo. Si no se abrió, escribinos a ' + CONFIG.email + '.';
    });
    botonWhatsapp.addEventListener('click', function () {
      var d = leer();
      if (!validar(d)) return;
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(mensaje(d)), '_blank', 'noopener');
    });
  })();
})();
