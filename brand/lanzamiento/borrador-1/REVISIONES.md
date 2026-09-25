# La punta · revisiones

Cada borrador se renderizó completo y se revisó con hojas de contacto (un cuadro por segundo) y cuadros a resolución completa alrededor de cada transición, como si lo hubiera hecho otra persona. Acá queda qué estaba mal, por qué y qué se cambió.

---

## Prueba de motor (antes del borrador 1)

Primera pasada por las 20 posiciones clave del guion original.

| Problema | Causa | Cambio |
|---|---|---|
| El tirón dibujaba una «V» larga: el hilo tenso iba del enredo hasta la punta y volvía sobre sí mismo | La ruta avanzaba hacia la derecha mientras el enredo quedaba adelante del pivote | **Se rediseñó la mesa.** Las herramientas quedaron en fila sobre un primer tramo largo (como la imagen `conectado` de la web) y la punta se detiene en la esquina de la calculadora, al final de la fila. El enredo siempre queda detrás del pivote y el hilo tenso barre como un limpiaparabrisas |
| El logo quedaba a la altura de la calculadora y no se podía encuadrar limpio | La ruta en escalera terminaba al lado de la mesa | La ruta sube desde la esquina de la calculadora y entra al punto muy por encima de la mesa |
| El logo era enorme en el plano abierto | El radio del punto (56) fijaba un logotipo de más de 1100 unidades | Punto de radio 42 |
| Objetos cortados en el borde del primer cuadro | Encuadre de apertura muy cerca de la mesa | La apertura se corrió a la izquierda: solo hilo y mesa |
| Las herramientas se enderezaban cuando la punta pasaba por esquinas, sin relación con el enredo | Regla arbitraria | Cada herramienta se endereza cuando el frente pasa el primer hilo que la tocó: se liberan en orden inverso al enredo |

## Borrador 1 (46.0 s)

Hoja: `salida/b1s.hoja.png`.

| Problema | Gravedad | Causa | Cambio |
|---|---|---|---|
| Entre 6 y 23 s la imagen casi no cambia: quince segundos del mismo plano abierto | Alta: tiempo muerto en el centro del film | Cámara pasiva y un acto 2 con un viaje de más | Se sacó un viaje entero (caja grande, planilla, calculadora). El acto 2 pasó de 9.2 a 6.7 s y el enredo de 6 a 5.2 s. Duración total: 42.4 s |
| El chiste del copiar/pegar se veía diminuto | Alta: era el único momento de humor | La cámara estaba en el plano general | La cámara se acerca a 1.3 cuando suena el segundo zumbido y retrocede recién después del chiste |
| El enredo no agobiaba: una franja gris en medio de mucho Piedra | Media | Encuadre demasiado abierto (0.66) | El enredo se mira a 0.85 y llena el cuadro. Los rulos del acto 3 giran alrededor de cada herramienta para taparlas |
| La punta celeste del descubrimiento medía 7 px | Alta: el film gira alrededor de ese punto | Encuadre a 1.0 y radio 7 | Acercamiento a 1.35 y radio 12. La frase pasó a la mitad derecha, sobre mesa vacía, al lado de la punta |
| Durante el tirón, la punta salía por arriba del cuadro antes de que la cámara la alcanzara | Media | La cámara seguía a la punta con retraso mientras se abría | La cámara se abre en 2.2 s hasta el plano general y **se queda quieta**: el tirón pasa adentro del cuadro |
| El logo se revelaba pegado al borde superior y en el cierre colgaba la esquina de la ruta por la izquierda | Media | Plano general justo y último tramo corto | Plano general a 0.48; último tramo de 640 unidades: en el cierre la línea entra al punto desde el borde, como la estela canónica del logo |
| El sonido del tirón (−25 LUFS) era más bajo que el ruido del enredo (−19) | Alta: contradecía la idea «el problema es ruido, la solución es música» | Mezcla | Enredo −3 dB, cuerdas pulsadas +6.5 dB, cuerda tensa +5 dB; limitador con anticipación y `loudnorm` a −16 LUFS |
| «Tu empresa funciona.» casi tocaba el espiral del cuaderno | Baja | Línea de base en 206 px con la mesa a 0.9 | Línea de base en 158 px y mesa 30 unidades más abajo |

## Borrador 2 (42.4 s)

Hojas: `salida/b2s.hoja.png` (un cuadro por segundo) y `salida/b2t.hoja.png` (cada 3–6 cuadros en el tirón y el aterrizaje).

Lo que funciona: el ritmo cerca–lejos–cerca–lejos, el chiste legible, el descubrimiento, la mesa ordenada como imagen ganada, el cierre con la estela canónica.

| Problema | Gravedad | Causa | Cambio |
|---|---|---|---|
| **El aterrizaje no era un momento.** El punto llegaba a su lugar un segundo antes y esperaba, chico, mientras los últimos rulos se soltaban en la mesa. La convergencia existía en el guion, pero no se veía como un solo evento | Alta: es el remate del film | La punta frenaba suave (curva decidida) al final del recorrido, así que llegaba con velocidad cero y antes de tiempo | La punta se mueve en dos fases: sube decidida y frena al doblar la esquina de arriba; después **acelera** por el último tramo y llega en el cuadro exacto en que se acaba el hilo (31.78). Se pasa 54 unidades y el hilo la devuelve: el rebote ahora tiene causa física. El primer tramo se estira de un latigazo en ese mismo cuadro y las últimas tres herramientas se enderezan justo antes: tic, tic, tic, golpe |
| Los tickets aparecían con un fundido, encima de la calculadora | Media: un fundido sin causa es justo lo que el film evita | Se dibujaban arriba de los objetos con opacidad animada | Se dibujan debajo, opacos: salen de abajo de la calculadora |
| La cuerda tensa seguía sonando 0.6 s después de que el hilo quedaba tenso | Baja | La envolvente terminaba en el fin del tirón, no en el aterrizaje | La cuerda y las pulsadas terminan en el aterrizaje |

## Borrador 3 → versión final (`salida/la-punta.mp4`)

| Problema | Cambio |
|---|---|
| En el plano general, `argy` se revelaba a un 7 % del borde superior mientras abajo sobraba aire | Encuadre general 40 unidades más arriba: márgenes de 187 px arriba y 151 px abajo |

Verificado sobre el MP4 codificado (no sobre los PNG): 42.4 s, 1920×1080, 30 fps, H.264 + AAC, −15.9 LUFS integrados, pico −1.7 dBFS. Hoja final: `salida/la-punta-hoja.png`.

## Pasada adversarial: ¿se nota que lo hizo una máquina?

Buscando a propósito las señales típicas y decidiendo, en cada caso, si una persona con oficio lo habría elegido así.

| Señal buscada | Veredicto |
|---|---|
| Movimientos sin causa (flotar, aparecer, fundir) | Se encontró uno (los tickets con fundido) y se corrigió. Todo lo demás tiene causa: zumbido → punta, hilo → empujón, hilo suelto → enderezado, hilo tenso → aterrizaje |
| Cámara que se mueve «para que pase algo» | No: la cámara sigue, se acerca para el chiste, busca y llega. Se queda quieta en todos los eventos importantes y durante todo el tirón |
| Estética genérica de IA (partículas, brillos, neón, HUD, gradientes azul-violeta) | No hay. El único brillo es la señal de la coda, que es la conducta que la web ya define («una señal viaja hasta el punto») |
| Rebotes y resortes repetidos | Uno solo en 42 s, y con causa física |
| Texto que explica lo que la imagen ya dice | Tres frases. Ninguna describe la imagen: la primera la contradice, la segunda la anticipa, la tercera la nombra |
| Simetría o perfección sospechosa | Los rulos del enredo tienen ruido y cada viaje empeora; los objetos arrancan levemente torcidos. La primera vuelta al celular es una elipse limpia a propósito: el primer pedido todavía sale prolijo |
| Escenas lindas que no pertenecen al mismo film | No hay escenas: es un solo plano con un solo hilo, del primer cuadro al último |
| Logo pegado al final | El logo es el último estado del hilo: el punto es la punta y la línea que entra es la ruta |

Riesgos que quedan y por qué se aceptan:

- **La coda (señal que viaja sola) es el momento más «de producto».** Se deja porque es la única prueba visible del «después» y rima con el primer zumbido; dura un segundo y no tiene texto.
- **El sonido está sintetizado.** Es coherente con el film (todo hecho con código) y con la idea «ruido → música», pero una mezcla final con foley grabado (un celular real vibrando sobre madera, un lápiz) lo llevaría un escalón más arriba.
- **Bricolage Grotesque está de moda** (riesgo ya registrado en la marca). En el film aparece solo en tres frases cortas y en el logo.
