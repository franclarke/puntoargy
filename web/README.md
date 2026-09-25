# puntoargy.com — web v1

Sitio estático de una página. HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Verlo en local

```bash
node scripts/serve.mjs
```

Después abrir http://localhost:4321.

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | La página completa |
| `css/styles.css` | Estilos. Los tokens de marca (colores, tipografías, curvas de movimiento) están al principio |
| `js/main.js` | Animaciones, preguntas del agente de ejemplo y formulario de contacto |
| `assets/` | Logo, íconos de producto, símbolo e imagen para redes (`og.png`) |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `site.webmanifest` | Íconos |
| `robots.txt`, `sitemap.xml` | Buscadores |

## Dirección "El hilo" (v2)

- **Hero:** el enredo se dibuja en un `<canvas>` y responde al mouse. Las herramientas son botones: al tocarlas, una señal viaja hasta el punto y aparece un aviso de ejemplo.
- **La línea de la página:** un SVG (`#riel`) que `js/main.js` calcula a partir de las etiquetas de cada sección (`data-riel="inicio"` y `data-estacion`). Se dibuja con el scroll y termina en el punto del contacto. Se apaga en pantallas de menos de 1080 px.
- **"El enredo":** el hilo se ordena con el scroll y las imágenes `enredo` y `conectado` se funden.
- Todo respeta `prefers-reduced-motion`: sin animaciones, todo queda en su estado final.

La v1 quedó guardada en `../brand/exploraciones/web-v1/`.

## Imágenes

Van en `assets/img/` con los nombres de `../brand/imagenes/guia-de-imagenes.md` (`enredo.webp`, `conectado.webp`, `taller.webp`, `deposito.webp`, `construyendo.webp`). Mientras falten, la web muestra espacios reservados con el nombre del archivo. Antes de publicar, en `js/main.js` poner `IMAGENES_MAQUETA: false`: las que falten se ocultan solas.

## Configurar el contacto

En `js/main.js`, al principio:

```js
var CONFIG = {
  email: 'hola@puntoargy.com',
  whatsapp: '', // por ejemplo '5491122334455'; vacío oculta el botón
  IMAGENES_MAQUETA: true
};
```

El formulario no envía datos a ningún servidor: arma un email (o un mensaje de WhatsApp, si está configurado) con lo que escribió la persona. Los links de email de la página también toman la dirección de ahí.

## Publicar

Cualquier hosting estático sirve: Cloudflare Pages, Netlify, Vercel o GitHub Pages. Se sube la carpeta `web/` tal cual (la carpeta `scripts/` no hace falta en producción).

## Antes de publicar

- [ ] Comprar `puntoargy.com` (y `puntoargy.ar`, `puntoargy.com.ar` para redirigir).
- [ ] Crear la casilla `hola@puntoargy.com`.
- [ ] Confirmar el texto de "Un proyecto real".
- [ ] Cargar el número de WhatsApp en `js/main.js`, si se quiere usar.

## Reglas de marca

Todo el texto sigue la identidad verbal de `../brand/argy-brand-definition.md` (sección 24): voseo, titulares que terminan en punto, sin jerga, números reales o marcados como ejemplo, productos siempre con su estado real. Las animaciones siguen la sección 23: el punto llega último.
