// Titulares: las palabras suben y el punto de .argy llega último (sección 23).

import { reduce, alVer } from './util.js';

const UNIDADES = new Set(['EM', 'STRONG', 'B', 'I', 'MARK']);

/** Envuelve cada palabra en .w > .wi. Los elementos cortos (acentos, subrayados) cuentan como una palabra.
    El punto (.pto) queda pegado a la palabra anterior para que nunca salte solo de línea. */
export function partirPalabras(raiz) {
  if (raiz.dataset.partido) return raiz.querySelectorAll('.wi').length;
  raiz.dataset.partido = '1';
  raiz.classList.add('palabras');
  let i = 0;
  const envolver = (nodo) => {
    const w = document.createElement('span');
    w.className = 'w';
    const wi = document.createElement('span');
    wi.className = 'wi';
    wi.style.setProperty('--i', i++);
    w.appendChild(wi);
    nodo.parentNode.insertBefore(w, nodo);
    wi.appendChild(nodo);
    return wi;
  };
  let ultima = null;
  const recorrer = (padre) => {
    [...padre.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        const partes = n.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        partes.forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); ultima = null; return; }
          const tn = document.createTextNode(t);
          frag.appendChild(tn);
        });
        const nodos = [...frag.childNodes];
        padre.replaceChild(frag, n);
        nodos.forEach((tn) => {
          if (tn.textContent === ' ') return;
          ultima = envolver(tn);
        });
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        if (n.classList.contains('pto')) {
          if (ultima) ultima.appendChild(n); else envolver(n);
        } else if (UNIDADES.has(n.tagName) || n.classList.contains('subraya') || n.classList.contains('marca-txt')) {
          ultima = envolver(n);
        } else {
          recorrer(n);
        }
      }
    });
  };
  recorrer(raiz);
  return i;
}

/** Hace aterrizar el punto de un titular. */
export function llegaPunto(pto, demora = 0) {
  if (!pto) return;
  if (reduce) { pto.classList.remove('espera'); return; }
  setTimeout(() => {
    pto.classList.remove('espera');
    pto.classList.add('llega');
  }, demora);
}

export function iniciarRevelados() {
  document.querySelectorAll('[data-palabras]').forEach((el) => {
    const n = partirPalabras(el);
    const pto = el.querySelector('.pto');
    if (reduce) { el.classList.add('visto'); return; }
    if (pto) pto.classList.add('espera');
    const io = alVer(el, () => {
      el.classList.add('visto');
      llegaPunto(pto, Math.min(n * 45, 540) + 640);
      io.disconnect();
    }, null, { umbral: .35 });
  });
}
