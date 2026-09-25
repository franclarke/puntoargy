# puntoargy.com — web v4 · "La lectura"

Sitio estático de una página. HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Verlo en local

```bash
node scripts/serve.mjs
```

Después abrir http://localhost:4321.

## La idea

La web vende el presente, explica el método e insinúa la visión, en ese orden (documento de marca v1.3, secciones 3, 12 y 25).

- **Presente:** `.argy` desarrolla software a medida para empresas. Se entiende en la primera pantalla.
- **Método:** el problema primero; construimos alrededor de cómo trabaja la empresa y cada proyecto nos deja algo.
- **Visión:** pocas preguntas, dibujadas como bocetos. Nada que parezca un producto.

### Dirección visual: la lectura

El mundo real de una empresa (el WhatsApp, la lista de precios, la planilla, la factura, la libreta) es la materia prima. Sobre él aparece una **capa de lectura** celeste: el resaltado marca lo que importa, el punto lo confirma y una etiqueta dice qué es. De ahí sale el software (interfaz con datos concretos, marcada como ejemplo). Es la forma visual de "primero entendemos cómo trabajás; después construimos".

Tres registros, siempre distinguibles:

| Registro | Cómo se ve | Qué dice |
|---|---|---|
| Mundo real | Objetos con materia: papel, ticket térmico, cartón, celular. Escritura a mano. Sombra con luz arriba a la izquierda | Cómo se trabaja hoy |
| Lectura | Resaltado celeste, punto, etiqueta negra en DM Mono, línea de tramos rectos | Lo que entendemos |
| Software | Interfaz blanca con datos reales del ejemplo y la etiqueta `ejemplo` | Lo que construimos |
| Boceto | Líneas blancas punteadas sobre campo celeste con grilla | Lo que nos preguntamos (no existe) |

Un hilo narrativo discreto atraviesa la página: el pedido #1048 de Marta, un almacén que le compra a una distribuidora. Aparece en el hero, en las figuras (la factura, la libreta), en los tres casos y en "Software que no solo anota". Es un ejemplo: no es un cliente.

## Recorrido

| Sección | Qué pasa |
|---|---|
| Hero | "Construimos el software que tu empresa todavía hace *a mano*." Llegan los objetos, la lectura entiende el pedido de Marta, aparece el pedido armado y el punto del titular llega último. Llamados: "Traenos un problema" y WhatsApp |
| 01 · Así se trabaja acá | La tesis como observación: "Los negocios de acá crecieron más rápido que su software." Siete láminas ("Fig. 01–07") con objetos recortados por el marco; cada una se lee al entrar. En el celular, las láminas se deslizan de costado |
| 02 · Qué construimos | "Ahí es donde construimos." Escena fija: el scroll avanza tres casos, cuatro pasos cada uno. De un audio a un pedido (con IA, dicho una sola vez) · de cinco pantallas a una respuesta (la única escena con el enredo) · de una planilla a una app de depósito. Abajo, "lo que queda de cada proyecto" junta las piezas; "Pedidos" se marca como reutilizada |
| 03 · Cómo pensamos | "El problema primero. La tecnología, después." Seis principios, "Software que no solo anota" (registra → entiende → actúa, con aprobación) y "Cada proyecto nos deja algo" (el estante de piezas y lo que es tuyo) |
| 04 · Lo que nos preguntamos | Tres bocetos sobre campo celeste. Explorando: no son productos ni promesas. Cada uno invita a contar un problema parecido |
| 05 · Cómo empezamos | "Traenos un problema." La orden de trabajo (tres pasos), la honestidad de etapa y las preguntas frecuentes |
| Contacto | "¿Vamos al punto?" El formulario es un ticket que arma el mensaje para WhatsApp, con temas y vista previa |

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | La página completa. Los objetos, las interfaces y los bocetos son HTML, CSS y SVG: se animan, se leen y no pesan |
| `css/styles.css` | Tokens al principio; después tipografía, el punto, componentes, objetos, la capa de lectura, la interfaz, cada capítulo, responsive y movimiento reducido |
| `js/main.js` | Arranca cada módulo por separado: si uno falla, el resto sigue |
| `js/util.js` | Azar con semilla, observadores y el motor de escenas atadas al scroll |
| `js/lectura.js` | La capa de lectura: punto al final del resaltado, etiqueta al margen (o cerca) sin superponerse, línea de marca. Puede llevar una etiqueta hasta la interfaz (`llevar`) |
| `js/hilo.js` | Geometría de la línea: el enredo orgánico y la ruta de tramos rectos |
| `js/hero.js` | Coreografía del hero y profundidad con el puntero |
| `js/figuras.js` | Lectura de las láminas de la tesis |
| `js/obra.js` | La escena de los casos: estados por paso, lectura, enredo y piezas |
| `js/pensamos.js` · `planos.js` | Entradas de "Cómo pensamos", el botón de aprobar y el trazado de los bocetos |
| `js/revelar.js` · `cabecera.js` · `objetos.js` · `contacto.js` | Titulares, cabecera y llamado flotante, detalles impresos (barras, ondas de audio) y formulario |
| `fonts/` | Bricolage Grotesque, Instrument Sans, Instrument Serif itálica, DM Mono y Nanum Pen Script (subconjunto latin, autoalojadas) |
| `assets/` | Logo, símbolo, íconos e imagen para redes (`og.png`) |
| `scripts/` | Servidor local y generador de `og.png` (`node scripts/og.mjs`, necesita Playwright) |

## Sistema

**Color.** Piedra de base, tinta, Argy Blue para el punto y la lectura, celeste profundo para texto destacado, Sol solo en el sello. Campo celeste solo para los bocetos. Los objetos tienen su propio material (papel, cartón, post-it, chat) y no son color de marca. Sobre celeste, el punto va en blanco.

**Tipografía.** Bricolage Grotesque para titulares; Instrument Sans para texto e interfaz; Instrument Serif itálica como acento de voz (una vez por sección); DM Mono para lo impreso, los datos y las etiquetas de lectura; Nanum Pen Script para lo escrito a mano en los objetos (libreta, post-it, notas), nunca en titulares ni en texto.

**El punto.** Cierra cada titular afirmativo y llega último. En la lectura marca lo que se entendió. En los pasos de los casos indica el estado (celeste: ahora; tinta: hecho; anillo: falta). En la flecha de los botones termina la línea.

**Movimiento.** Todo lo que se mueve explica algo: los objetos llegan, la lectura entiende, las etiquetas pasan a la interfaz, el enredo se ordena, el ticket se imprime, los bocetos se trazan. Entre escena y escena hay pausas. Las escenas se atan al scroll sin secuestrarlo.

**Grano.** Una sola textura de papel (SVG) cubre el sitio, fija y muy suave.

## Responsive

- Debajo de 1100 px el menú pasa a un panel; debajo de 900 px la mesa del hero se apila bajo el texto y los casos ponen el texto arriba, la escena en el medio y el paso activo abajo.
- Debajo de 720 px las láminas se deslizan de costado, el llamado del encabezado se reemplaza por uno flotante (se esconde en la escena de casos y cerca del contacto) y la vista previa del mensaje no se muestra.
- Las escenas escalan con `em`: cada una define su escala (unidades de contenedor en los casos y en las láminas; alto disponible en el hero).

## Movimiento reducido y sin JavaScript

- Con `prefers-reduced-motion`, todo queda en su estado final: los casos dejan de ser una escena fija y se leen uno debajo del otro.
- Si el JavaScript no corre, el titular, los objetos, los casos y el formulario se ven igual (el formulario necesita JS para abrir WhatsApp; el enlace directo funciona siempre).

## Configurar el contacto

En `js/contacto.js`, al principio:

```js
export const CONFIG = {
  whatsapp: '5492915068196', // Formato internacional, solo números.
};
```

El formulario no envía datos a ningún servidor: abre WhatsApp con un mensaje armado con lo que escribió la persona. También permite copiarlo. Los bocetos ("¿Te pasa algo parecido? Contanos") dejan el tema escrito en el ticket.

## Publicar

Cualquier hosting estático sirve: se sube la carpeta `web/` tal cual (la carpeta `scripts/` no hace falta en producción). Los módulos de JavaScript necesitan servirse por HTTP.

## Cómo seguir el sistema

- **Un caso nuevo:** un `article.caso` con cuatro pasos (entra, entiende, arma, resuelve), objetos del mundo real, lo que se lee (`<span class="leer" data-etq="…">`) y la interfaz que resulta, con la etiqueta `ejemplo`. Si se agrega un cuarto caso, sumar pasos a `--pasos` en `.obra` y a `N` en `obra.js`.
- **Casos reales:** cuando existan proyectos de `.argy` que se puedan mostrar, van con datos reales y sin la etiqueta `ejemplo`. Hasta entonces no hay sección de casos.
- **Exploraciones:** como mucho tres, como preguntas y bocetos. Sin estados, fechas ni pantallas que parezcan funcionar.
- **Objetos:** con datos concretos de acá (ARCA, Mercado Pago, remitos, cuentas corrientes), su propio material y la misma luz. Sin logos de terceros.

## Antes de publicar

- [ ] Confirmar que el número de WhatsApp publicado sea correcto.
- [ ] Revisar los montos y fechas de los ejemplos si pasa mucho tiempo (son ilustrativos).

## Reglas de marca

Todo sigue el documento de marca `../brand/argy-brand-definition.md` v1.3 y siguientes: presente, método y visión separados (3); identidad verbal (24); criterios de la web y decisiones de esta versión (25).
