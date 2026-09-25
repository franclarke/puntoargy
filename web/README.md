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
| `js/main.js` | Animaciones, demos interactivas de los servicios y formulario de contacto |
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

Van en `assets/img/` y siguen la guía `../brand/imagenes/guia-de-imagenes.md`. La portada usa `enredo.webp` y `conectado.webp` en la sección que explica el problema actual. Los assets editoriales de proyectos y productos futuros siguen preservados en la carpeta, pero ya no forman parte del recorrido principal. Las imágenes bajo el primer pliegue se cargan de forma diferida. Si se reemplazan, conservá las rutas del HTML o actualizalas junto con este inventario.

## Configurar el contacto

En `js/main.js`, al principio:

```js
var CONFIG = {
  whatsapp: '5492915068196', // Formato internacional, solo números
  IMAGENES_MAQUETA: false
};
```

El formulario no envía datos a ningún servidor: abre WhatsApp con un mensaje armado con lo que escribió la persona. También permite copiar ese mensaje para enviarlo desde otro programa.

## Publicar

Cualquier hosting estático sirve: Cloudflare Pages, Netlify, Vercel o GitHub Pages. Se sube la carpeta `web/` tal cual (la carpeta `scripts/` no hace falta en producción).

## Antes de publicar

- [ ] Comprar `puntoargy.com` (y `puntoargy.ar`, `puntoargy.com.ar` para redirigir).
- [ ] Confirmar que el número de WhatsApp publicado sea correcto.
- [ ] Revisar el texto final de servicios, preguntas y contacto antes de publicar.

## Reglas de marca

Todo el texto sigue la identidad verbal de `../brand/argy-brand-definition.md` (sección 24): voseo, titulares que terminan en punto, sin jerga, números reales o marcados como ejemplo, productos siempre con su estado real. Las animaciones siguen la sección 23: el punto llega último.
