# La punta · film de lanzamiento de `.argy`

42.4 segundos, 1920×1080, 30 fps. Un solo plano, un solo hilo: el trabajo a mano de una pyme se enreda sobre la mesa hasta que la cámara encuentra la punta. Un tirón convierte el mismo hilo en la ruta que conecta todo, y lo que sobra se enrolla en el punto de `.argy`.

Hecho enteramente con código: Canvas 2D en Chrome sin cabeza para la imagen y síntesis en Node para el sonido. No hay video generado con IA, ni bancos de imágenes, ni música de stock.

## Documentos

| Archivo | Qué define |
|---|---|
| [CREATIVE_DIRECTION.md](CREATIVE_DIRECTION.md) | De qué trata, el concepto, por qué es de `.argy`, reglas de la metáfora |
| [STORY.md](STORY.md) | El film contado de principio a fin |
| [STORYBOARD.md](STORYBOARD.md) | Plano por plano: propósito, composición, cámara, movimiento, tipografía, sonido, transición |
| [MOTION_LANGUAGE.md](MOTION_LANGUAGE.md) | Curvas, tiempos, cámara, física, transformaciones, quietud, motivos |
| [TIMELINE.md](TIMELINE.md) | Estructura, grilla de eventos cuadro por cuadro, cámara |
| [AUDIO_PLAN.md](AUDIO_PLAN.md) | Estructura musical, ritmo, efectos, silencios, sincronías, mezcla |
| [REVISIONES.md](REVISIONES.md) | Qué se criticó en cada borrador y qué se cambió |

## Código

| Archivo | Qué hace |
|---|---|
| `film/guion.js` | **El guion ejecutable.** Tiempos, mesa, coreografía de la punta, modelo físico del tirón, cámara, eventos. Sin DOM: lo usan la imagen y el sonido |
| `film/escena.js` | Dibuja cualquier cuadro en un canvas (vocabulario de `brand/imagenes/generador/ilustraciones.js`) |
| `film/util.js` | Curvas de marca, Catmull-Rom, polilíneas, azar determinista |
| `film/logo.js` | Trazos del logotipo oficial (`brand/logo/logotipo/argy-color.svg`) |
| `film/index.html` | Reproductor con barra de tiempo; también es la página que se renderiza |
| `film/fuentes/` | Bricolage Grotesque, Instrument Sans e Instrument Serif (Google Fonts, SIL OFL) |
| `herramientas/servir.mjs` | Servidor local (las fuentes no cargan desde `file://`) |
| `herramientas/render.mjs` | Cuadros PNG con Chrome sin cabeza, en paralelo |
| `herramientas/audio.mjs` | Todo el sonido, sintetizado desde los eventos del guion |
| `herramientas/film.mjs` | Cuadros + sonido + codificación H.264/AAC |
| `herramientas/hoja.mjs` | Hojas de contacto para revisar |

Todo es determinista: cada cuadro es una función de su tiempo, así que cualquier cuadro se puede volver a generar y revisar por separado.

## Usar

Requiere Node 20+, Google Chrome y ffmpeg.

```bash
npm install
```

Ver el film en el navegador (espacio para reproducir; flechas para ir cuadro a cuadro; `#24.9` en la URL para saltar a un tiempo):

```bash
node herramientas/servir.mjs
```

y abrir http://localhost:4330/film/

Renderizar el film completo en `salida/la-punta.mp4` (unos 5 minutos):

```bash
node herramientas/film.mjs
```

Revisar momentos sueltos:

```bash
node herramientas/render.mjs --tiempos 24.9,32.4 --dir salida/revision
```

## Decisiones que extienden la marca

Están explicadas en `CREATIVE_DIRECTION.md` y quedan como propuesta hasta que se aprueben: el hilo gris que se vuelve celeste en el mundo 3D de los bodegones, y la frase «Todo enredo tiene una punta.».
