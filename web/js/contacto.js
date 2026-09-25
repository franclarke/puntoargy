// Contacto: el formulario no envía datos a ningún servidor. Arma un mensaje y abre WhatsApp,
// o lo copia para enviarlo desde otro lado.

export const CONFIG = {
  whatsapp: '5492915068196', // Formato internacional, solo números.
};

export function iniciarContacto() {
  document.querySelectorAll('[data-whatsapp]').forEach((a) => { a.href = 'https://wa.me/' + CONFIG.whatsapp; });

  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
  const fecha = document.getElementById('tf-fecha');
  if (fecha) fecha.textContent = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const form = document.getElementById('form-contacto');
  if (!form) return;
  const estado = document.getElementById('form-estado');
  const problema = document.getElementById('f-problema');

  // Los botones de productos traen un interés y lo dejan escrito en el ticket.
  document.querySelectorAll('[data-interes]').forEach((a) => {
    a.addEventListener('click', () => {
      if (!problema.value.trim()) problema.value = a.dataset.interes + ' ';
    });
  });

  const leer = () => {
    const f = new FormData(form);
    const v = (k) => String(f.get(k) || '').trim();
    return { nombre: v('nombre'), empresa: v('empresa'), problema: v('problema'), contacto: v('contacto') };
  };
  const campos = [['f-nombre', 'nombre', 'error-nombre'], ['f-problema', 'problema', 'error-problema']];
  const validar = (d) => {
    let primero = null;
    campos.forEach(([id, k, err]) => {
      const ok = !!d[k];
      document.getElementById(id).setAttribute('aria-invalid', ok ? 'false' : 'true');
      document.getElementById(err).hidden = ok;
      if (!ok && !primero) primero = id;
    });
    estado.textContent = primero ? 'Falta completar tu nombre y qué te gustaría resolver.' : '';
    if (primero) document.getElementById(primero).focus();
    return !primero;
  };
  const mensaje = (d) => [
    `Hola, soy ${d.nombre}${d.empresa ? `, de ${d.empresa}` : ''}.`,
    '',
    'Me gustaría resolver esto:',
    d.problema,
    d.contacto ? `\nMe pueden contactar por: ${d.contacto}` : '',
  ].join('\n').trim();

  campos.forEach(([id, , err]) => {
    document.getElementById(id).addEventListener('input', (e) => {
      if (e.target.value.trim()) { e.target.setAttribute('aria-invalid', 'false'); document.getElementById(err).hidden = true; }
    });
  });

  document.getElementById('btn-copiar').addEventListener('click', async () => {
    const d = leer();
    if (!validar(d)) return;
    try {
      await navigator.clipboard.writeText(mensaje(d));
      estado.textContent = 'Mensaje copiado. Pegalo en WhatsApp o en un mail para enviarlo.';
    } catch {
      estado.textContent = 'No pudimos copiar el mensaje. Podés enviarlo directo por WhatsApp.';
    }
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const d = leer();
    if (!validar(d)) return;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje(d))}`, '_blank', 'noopener');
    estado.textContent = 'Abrimos WhatsApp con tu mensaje listo. Solo falta enviarlo.';
  });
}
