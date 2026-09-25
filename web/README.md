# puntoargy.com — web v3 · "La mesa"

Sitio estático de una página. HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Verlo en local

```bash
node scripts/serve.mjs
```

Después abrir http://localhost:4321.

## La idea

La web cuenta la tesis de `.argy` como un recorrido, no como una landing de servicios:

| Capítulo | Qué pasa |
|---|---|
| Visión (hero) | "Estamos construyendo el software que les faltaba a las empresas de acá." La mesa de una pyme vista desde arriba: el hilo gris enreda las herramientas, sale la ruta celeste y el punto del titular llega último. El hilo responde al cursor. |
| 01 · El enredo | Tesis: "Los negocios de acá crecieron más rápido que su software." Escena fija: con el scroll aparece cada herramienta (WhatsApp, planilla, Mercado Pago, ARCA, libreta) y el hilo las enreda. Cierra con "No te faltan herramientas. Te falta que trabajen juntas." |
| 02 · El punto | "Del enredo al punto." La ruta atraviesa un pedido real: entra por WhatsApp, descuenta stock, registra el cobro, factura, actualiza el cliente, todo llega a un lugar y aparece un hallazgo. La cámara sigue a la señal, como en el film. |
| 03 · Productos | data.argy como protagonista, con una demo que responde preguntas (datos de ejemplo). sellos.argy (fidelización) y el índice de productos con su estado real. |
| 04 · Cómo nace un producto | Problema → solución a medida → patrón → producto. "Reutilizamos lo que aprendemos. Nunca tus datos." |
| 05 · Hoy | "Traenos un problema." Transformaciones de → a, cómo arrancamos y preguntas. |
| 06 · Hablemos | "¿Vamos al punto?" El formulario es un ticket que arma el mensaje para WhatsApp. |

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | La página completa. Los objetos de la mesa (celular, ticket, factura, planilla, QR, libreta…) son HTML y CSS: se pueden animar y no pesan |
| `css/styles.css` | Estilos. Tokens de marca al principio; después tipografía, el punto, componentes, objetos de la mesa y cada capítulo |
| `js/main.js` | Arranca cada módulo por separado: si uno falla, el resto sigue |
| `js/util.js` | Curvas de marca, azar con semilla y el motor de escenas atadas al scroll |
| `js/hilo.js` | Geometría del hilo: enredo orgánico, ruta geométrica, muestreo y medidas |
| `js/hero.js` · `enredo.js` · `flujo.js` · `modelo.js` · `cambios.js` | Cada escena del recorrido |
| `js/data-demo.js` | Demo de data.argy: preguntas, respuestas y gráficos de ejemplo |
| `js/sellos.js` | Álbum de sellos de sellos.argy |
| `js/contacto.js` | Formulario y número de WhatsApp |
| `js/revelar.js` · `cabecera.js` · `objetos.js` | Titulares, cabecera y detalles impresos (QR, códigos de barras) |
| `fonts/` | Bricolage Grotesque, Instrument Sans, Instrument Serif itálica y DM Mono (subconjunto latin, autoalojadas) |
| `assets/` | Logo, íconos, imagen para redes (`og.png`) e imágenes editoriales de la v2 (hoy no se usan) |

## Movimiento

- Todo lo que se mueve cuenta el enredo, la conexión o el producto. El punto llega último.
- Las escenas se atan al scroll sin secuestrarlo (sin scroll suave artificial).
- Los bucles de animación solo corren con la sección en pantalla.
- Debajo de 900 px el flujo pasa a vertical y no se fija; la escena del enredo muestra una línea por vez.
- Con `prefers-reduced-motion` todo queda en su estado final y las escenas fijas pasan a ser contenido normal.
- Si el JavaScript no corre, el titular y el contenido se muestran igual.

## Configurar el contacto

En `js/contacto.js`, al principio:

```js
export const CONFIG = {
  whatsapp: '5492915068196', // Formato internacional, solo números.
};
```

El formulario no envía datos a ningún servidor: abre WhatsApp con un mensaje armado con lo que escribió la persona. También permite copiar el mensaje. Los botones de productos ("Quiero probarlo") dejan el interés escrito en el ticket.

## Publicar

Cualquier hosting estático sirve: se sube la carpeta `web/` tal cual (la carpeta `scripts/` no hace falta en producción). Los módulos de JavaScript necesitan servirse por HTTP (no abrir el archivo con doble clic).

## Antes de publicar

- [ ] Confirmar que el número de WhatsApp publicado sea correcto.
- [ ] Revisar los estados de los productos (`En construcción`, `Explorando`, `Lo que viene`) cada vez que cambien.
- [ ] Revisar los datos de ejemplo de la demo de data.argy si se muestra a clientes reales.

## Reglas de marca

Todo el texto sigue la identidad verbal de `../brand/argy-brand-definition.md` (sección 24): voseo, titulares que terminan en punto, sin jerga, números reales o marcados como ejemplo, productos siempre con su estado real. Las decisiones de esta versión están registradas en la sección 25 (web v3).
