# Guía de imágenes · bodegones del hilo

Estado: ENCAMINADO (documento de marca v1.1, sección 20).

## La idea

La web de `.argy` tiene una sola línea que la recorre: empieza enredada y termina en un punto. Las imágenes continúan esa trama en el mundo físico. Son bodegones de objetos cotidianos de una pyme atravesados por un **hilo celeste real**:

- **Imágenes del problema:** el hilo enreda los objetos.
- **Imágenes de la solución:** el hilo los une en una ruta prolija (tramos rectos, esquinas redondeadas) que termina en una **esfera celeste**: el punto.

No son fotos "reales" ni lo intentan: se nota que es una decisión de dirección de arte. Eso cumple el principio de no simular fotos documentales de negocios que no existen.

## Estilo

| Aspecto | Regla |
|---|---|
| Técnica | 3D mate, material tipo arcilla o goma suave. Nada brillante ni plástico |
| Fondo | Liso, sin horizonte, Piedra `#F2F1ED`. Excepción: imágenes para secciones celestes, fondo Argy Blue `#74ACDF` |
| Luz | Suave y difusa desde arriba a la izquierda, sombras largas y suaves |
| Color | Objetos en tonos piedra, arena y gris cálido, con acentos casi negros (`#1C1B19`). El hilo es el único color saturado: celeste `#74ACDF`. Sobre fondo celeste, el hilo y la esfera van en blanco |
| Amarillo | Como mucho un detalle chico por imagen (un resaltador, un post-it), en `#F6B40E` |
| Cámara | Vista 3/4 desde arriba (unos 35°), lente normal, sin distorsión |
| Composición | Aire generoso de un lado para que respire el texto. Pocos objetos, bien separados |
| Nunca | Personas, manos, caras, texto legible, logos o marcas (tampoco el de WhatsApp o Mercado Pago), pantallas con contenido, banderas, soles, fondos recargados |

## Las cinco imágenes de la web

Se guardan en `web/assets/img/` con estos nombres exactos. Mientras falten, la web muestra un espacio reservado con el nombre del archivo.

| Archivo | Proporción | Dónde va | Qué muestra |
|---|---|---|---|
| `enredo.webp` | 4:5 | "El enredo": panel fijo, estado inicial | Objetos de escritorio enredados por el hilo |
| `conectado.webp` | 4:5 | "El enredo": panel fijo, estado final (se funde con el scroll) | Los mismos objetos ordenados, unidos por el hilo en una ruta que termina en la esfera |
| `taller.webp` | 16:9 | Franja entre "Hoy" y los números | Mesa de trabajo con el hilo como ruta prolija |
| `deposito.webp` | 4:5 | "Un proyecto real", detrás del tablero de pedidos | Estante de depósito con cajas unidas por el hilo |
| `construyendo.webp` | 1:1 | "Construyendo", junto al título. Fondo celeste | Piezas modulares en construcción con hilo y esfera blancos |

`enredo` y `conectado` tienen que ser **la misma escena**: mismos objetos, mismo encuadre y misma luz. Una se funde en la otra cuando la persona hace scroll.

## Prompts

Están en inglés porque la mayoría de los generadores responde mejor. Cada prompt es el **bloque de estilo** más la **escena**.

### Bloque de estilo (va en todos)

```
soft matte 3D render, clay-like material, minimalist studio still life, seamless warm off-white background (#F2F1ED), soft diffused light from the top left, long soft shadows, muted warm stone, sand and greige tones with near-black accents, a single pale sky-blue cord (#74ACDF) as the only saturated color, calm and precise composition, 35-degree top-down view, no text, no logos, no people, no hands, blank screens
```

**Negativo** (si el generador lo acepta):

```
text, letters, numbers, logos, brand marks, watermark, people, hands, faces, glossy plastic, neon, flags, sun symbols, cluttered background, dramatic lighting, fisheye
```

### 1 · `enredo.webp` (4:5)

```
[bloque de estilo], a small business desk still life: a smartphone lying face up with a blank screen, a printed spreadsheet with empty rows, a spiral notebook, a calculator, a few paper receipts and a small cardboard parcel, all chaotically wrapped and tangled in one long pale sky-blue cord with loops and knots, objects slightly scattered, empty space in the upper third
```

### 2 · `conectado.webp` (4:5)

Generar después de la 1, usándola como referencia de imagen o con la misma semilla.

```
[bloque de estilo], the exact same objects and camera as the reference image, now neatly arranged, the pale sky-blue cord runs in a clean path with straight segments and rounded 90-degree turns, touching each object once, and ends in a matte pale sky-blue sphere on the right, orderly, calm, empty space in the upper third
```

### 3 · `taller.webp` (16:9)

```
[bloque de estilo], wide workbench still life: a closed laptop, a stack of cardboard boxes, a small label printer, a notebook and a pencil, arranged along the right two thirds of the frame, one pale sky-blue cord runs across the scene as a clean route with straight segments and rounded corners, passing by every object and ending in a pale sky-blue sphere, large empty area on the left third
```

### 4 · `deposito.webp` (4:5)

```
[bloque de estilo], a small stockroom shelf with cardboard boxes of different sizes, kraft paper bags and a clipboard with a blank order slip, a pale sky-blue cord threads through the boxes as a tidy route with rounded corners, ending in a small pale sky-blue sphere on the top shelf, the lower half of the image quieter and emptier
```

### 5 · `construyendo.webp` (1:1)

Reemplazar el fondo y el color del hilo del bloque de estilo:

```
soft matte 3D render, clay-like material, minimalist studio still life, seamless pale sky-blue background (#74ACDF), soft diffused light from the top left, soft shadows in a slightly darker blue, warm off-white modular blocks and simple geometric pieces being assembled on a low plinth, like building a small structure, a white cord routes cleanly between the pieces and ends in a white sphere on top, no text, no logos, no people, no hands
```

### Extra · 404 (1:1, opcional)

```
[bloque de estilo], a single tangled ball of pale sky-blue cord resting on the surface, one loose end trailing away, lots of empty space
```

## Consistencia

- Generá la serie en una misma sesión y usá la primera imagen aprobada como **referencia de estilo** para las demás (en Midjourney: `--sref`; en otros generadores, "image reference" o "style reference").
- Parámetros sugeridos en Midjourney: `--ar 4:5 --style raw --stylize 100` (cambiar `--ar` según la imagen).
- Si el hilo sale de otro celeste, corregí el tono en edición: el hilo tiene que acercarse a `#74ACDF`.
- Ajustá el fondo para que quede en `#F2F1ED` (o `#74ACDF` en `construyendo`), así la imagen se funde con la sección.

## Exportación

- Formato **WebP**, lado largo 1600 px (2400 px para `taller`), calidad 80.
- Peso objetivo: menos de 250 KB por imagen.
- Cuando estén las cinco, en `web/js/main.js` pasar `IMAGENES_MAQUETA` a `false` antes de publicar.

## Checklist por imagen

- [ ] Sin texto legible, logos, personas ni manos.
- [ ] El hilo es el único color saturado y se lee como celeste de marca.
- [ ] En imágenes de solución, el hilo hace tramos rectos con esquinas redondeadas y termina en la esfera.
- [ ] Fondo liso que se funde con la sección.
- [ ] Hay aire para el texto.
- [ ] `enredo` y `conectado` comparten objetos y encuadre.
