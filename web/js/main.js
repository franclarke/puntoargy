/* .argy — web v3 · "La mesa"
   Cada módulo arma una parte del recorrido. Si uno falla, el resto sigue funcionando. */

import { iniciarObjetos } from './objetos.js';
import { iniciarCabecera } from './cabecera.js';
import { iniciarRevelados } from './revelar.js';
import { iniciarHero } from './hero.js';
import { iniciarEnredo } from './enredo.js';
import { iniciarFlujo } from './flujo.js';
import { iniciarDemo } from './data-demo.js';
import { iniciarSellos } from './sellos.js';
import { iniciarModelo } from './modelo.js';
import { iniciarCambios } from './cambios.js';
import { iniciarContacto } from './contacto.js';
import { pedirCalculo } from './util.js';

const modulos = [iniciarObjetos, iniciarContacto, iniciarCabecera, iniciarRevelados, iniciarHero, iniciarEnredo, iniciarFlujo, iniciarDemo, iniciarSellos, iniciarModelo, iniciarCambios];

function arrancar() {
  modulos.forEach((m) => {
    try { m(); } catch (e) { console.error(`[.argy] ${m.name}`, e); }
  });
  pedirCalculo(true);
}

// Las escenas miden el layout: esperamos a las fuentes (con un límite) antes de medir.
const fuentes = document.fonts ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]) : Promise.resolve();
fuentes.then(arrancar);
