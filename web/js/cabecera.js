// Cabecera: fondo al hacer scroll, se esconde al bajar, cambia de tema sobre
// los capítulos oscuros y muestra el capítulo en curso.

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
    let oscuro = false;
    temas.forEach((v, el) => { if (v && el.dataset.tema === 'oscuro') oscuro = true; });
    cab.classList.toggle('tema-oscuro', oscuro);
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
