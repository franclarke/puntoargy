/* .argy — web v4 · "La lectura"
   Cada módulo arma una parte del recorrido. Si uno falla, el resto sigue funcionando. */

import { iniciarObjetos } from './objetos.js';
import { iniciarContacto } from './contacto.js';
import { iniciarCabecera } from './cabecera.js';
import { iniciarRevelados } from './revelar.js';
import { iniciarHero } from './hero.js';
import { iniciarFiguras } from './figuras.js';
import { iniciarObra } from './obra.js';
import { iniciarPensamos } from './pensamos.js';
import { iniciarPlanos } from './planos.js';
import { pedirCalculo } from './util.js';

const modulos = [iniciarObjetos, iniciarContacto, iniciarCabecera, iniciarRevelados, iniciarHero, iniciarFiguras, iniciarObra, iniciarPensamos, iniciarPlanos];

function arrancar() {
  modulos.forEach((m) => {
    try { m(); } catch (e) { console.error(`[.argy] ${m.name}`, e); }
  });
  pedirCalculo(true);
}

// Las escenas miden el layout: esperamos a las fuentes (con un límite) antes de medir.
const fuentes = document.fonts ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]) : Promise.resolve();
fuentes.then(arrancar);
