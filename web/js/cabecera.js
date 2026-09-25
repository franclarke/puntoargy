// Cabecera: fondo al hacer scroll, se esconde al bajar, cambia de tema según el capítulo
// (claro, oscuro o celeste) y muestra el capítulo en curso.

export function iniciarCabecera() {
  const cab = document.getElementById('cabecera');
  const boton = document.getElementById('menu-boton');
  const nav = document.getElementById('nav-principal');
  const indicador = cab.querySelector('.cabecera-capitulo');
  const num = document.getElementById('cc-num');
  const nombre = document.getElementById('cc-nombre');

  let ultimoY = window.scrollY;
  let menuAbierto = false;
  const alScroll = () => {
    const y = window.scrollY;
    cab.classList.toggle('con-fondo', y > 8);
    const bajando = y > ultimoY + 2;
    const subiendo = y < ultimoY - 2;
    if (!menuAbierto) {
      if (bajando && y > window.innerHeight * .8) cab.classList.add('escondida');
      else if (subiendo || y < 80) cab.classList.remove('escondida');
    }
    ultimoY = y;
  };
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();
  // Al recibir foco por teclado, la cabecera siempre se muestra.
  cab.addEventListener('focusin', () => cab.classList.remove('escondida'));

  // Tema según la sección que pasa por debajo de la cabecera.
  const temas = new Map();
  const ioTema = new IntersectionObserver((es) => {
    es.forEach((e) => temas.set(e.target, e.isIntersecting));
    let tema = 'claro';
    temas.forEach((v, el) => { if (v) tema = el.dataset.tema; });
    cab.classList.toggle('tema-oscuro', tema === 'oscuro');
    cab.classList.toggle('tema-celeste', tema === 'celeste');
  }, { rootMargin: '-3% 0px -96% 0px' }); // una franja fina a la altura de la cabecera; en % sigue valiendo al redimensionar
  document.querySelectorAll('[data-tema]').forEach((s) => ioTema.observe(s));
  // El pie también es oscuro.
  const pie = document.querySelector('.pie');
  if (pie) { pie.dataset.tema = 'oscuro'; ioTema.observe(pie); }

  // Capítulo en curso.
  let actual = null;
  const ioCap = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting || e.target === actual) return;
      actual = e.target;
      const [n, t] = (e.target.dataset.capitulo || '').split('|');
      num.textContent = n || '';
      nombre.textContent = t || '';
      indicador.classList.remove('cambia');
      void indicador.offsetWidth;
      indicador.classList.add('cambia');
    });
  }, { rootMargin: '-48% 0px -51% 0px' });
  document.querySelectorAll('[data-capitulo]').forEach((s) => ioCap.observe(s));

  // Llamado flotante (pantallas chicas): aparece después del hero y se va cerca del contacto.
  const flotante = document.getElementById('cta-flotante');
  const hero = document.getElementById('inicio');
  if (flotante && hero) {
    let pasoHero = false;
    let cerca = false;
    const actualizar = () => flotante.classList.toggle('ve', pasoHero && !cerca);
    new IntersectionObserver(([e]) => { pasoHero = !e.isIntersecting && e.boundingClientRect.top < 0; actualizar(); }).observe(hero);
    const cierre = new Map();
    const ioCierre = new IntersectionObserver((es) => {
      es.forEach((e) => cierre.set(e.target, e.isIntersecting));
      cerca = [...cierre.values()].some(Boolean);
      actualizar();
    });
    ['obra', 'empezar', 'contacto'].forEach((id) => { const el = document.getElementById(id); if (el) ioCierre.observe(el); });
    const pie = document.querySelector('.pie');
    if (pie) ioCierre.observe(pie);
  }

  // Menú en pantallas chicas.
  const cerrar = () => {
    menuAbierto = false;
    boton.setAttribute('aria-expanded', 'false');
    boton.querySelector('.sr').textContent = 'Abrir menú';
    nav.classList.remove('abierta');
  };
  boton.addEventListener('click', () => {
    menuAbierto = !menuAbierto;
    boton.setAttribute('aria-expanded', String(menuAbierto));
    boton.querySelector('.sr').textContent = menuAbierto ? 'Cerrar menú' : 'Abrir menú';
    nav.classList.toggle('abierta', menuAbierto);
    if (menuAbierto) { cab.classList.remove('escondida'); nav.querySelector('a').focus(); }
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', cerrar));
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && menuAbierto) { cerrar(); boton.focus(); }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 1100 && menuAbierto) cerrar(); });
}
