# La punta · lenguaje de movimiento

Deriva de la sección 23 del documento de marca (DEFINIDO). Lo que sigue son las reglas del film: si algo se mueve y no cumple una, se corrige o se saca.

---

## 1 · Principios

1. **Todo movimiento tiene causa.** Algo se mueve porque algo lo empuja, lo tira o lo llama: el celular vibra y la punta sale; el hilo aprieta y la caja se corre; la ruta engancha y el objeto se endereza. No hay nada que flote ni que entre «porque sí».
2. **De lo complejo a lo simple.** La primera mitad acumula movimiento y la segunda lo resuelve. Después del tirón, cada cosa que se mueve termina quieta.
3. **Con dirección.** La solución avanza hacia la derecha y hacia arriba. El enredo no tiene dirección: gira.
4. **El punto llega último.** Nada importante pasa después del aterrizaje salvo el resultado: la señal y el logo.
5. **Decidido, no rebotón.** Un solo rebote en 46 segundos.

## 2 · Curvas

| Nombre | Valor | Uso |
|---|---|---|
| Decidida | `cubic-bezier(.65,0,.15,1)` | Todo: cámara, texto, objetos, la punta en el tirón |
| Llegada | `cubic-bezier(.34,1.56,.64,1)` | **Una sola vez:** el aterrizaje del punto (31.78). En el film la llegada es física: el punto se pasa porque viene rápido y el hilo, ya tenso, lo devuelve (620 ms). Es la misma curva de marca traducida a posición: sobrepaso de ~10 % y asentamiento sin segundo rebote |
| Gesto | Velocidad variable dentro de cada viaje de la punta (ver 5) | La punta mientras trabaja a mano |

Prohibidos: resortes, rebotes en objetos, `ease-in-out` genérico, movimientos lineales (salvo la señal, que viaja a velocidad constante porque es una señal).

## 3 · Tiempos

Tokens de marca aplicados al film:

| Token | Duración | En el film |
|---|---|---|
| Micro | 160 ms | Vibración del celular (ciclos), tecla que se hunde |
| Interfaz | 320 ms | Objeto que se endereza, ticket que asoma, URL |
| Trazo | 550–700 ms | Revelado de texto (550, igual al logo), punta que se vuelve celeste (300) |
| Relato | 1200–3400 ms | Movimientos de cámara, el tirón (6 s en total) |

Ritmo general: el film respira en 4 tiempos de quietud (P1, P3, P6, P11). Ningún tramo de movimiento dura más de 9 s sin una pausa de al menos 0.4 s.

## 4 · Cámara

- **Ortográfica y cenital.** La perspectiva 3/4 de los bodegones está en los objetos (cara superior + frente), no en la cámara. La cámara solo se traslada y cambia de escala.
- **Nunca rota, nunca tiembla, nunca hace zoom «por dinámica».**
- Tres motivos permitidos para moverse:
  1. **Seguir** a la punta (P2, P8). La cámara va detrás: la punta lidera y la cámara la alcanza con un retraso de 0.25–0.4 s (filtro crítico de segundo orden, sin rebote).
  2. **Revelar escala** cuando el hilo ocupa más lugar del que entra (P4, P5, P8).
  3. **Buscar** (P7) y **llegar** (P10): movimientos únicos, lentos, con curva decidida.
- La cámara se detiene antes que los eventos importantes para que el evento se vea quieto: se para en 19.8 (antes del silencio), en 25.2 (antes del punto celeste) y en 28.8, y se queda quieta durante todo el rebobinado, el aterrizaje (31.78) y la aparición del logo (hasta 35.1). El espectáculo del tirón pasa adentro del cuadro, no en la cámara.
- Escala: 1.6 (lo más cerca, P1) a 0.48 (la mesa entera con el espacio del logo, P9). No hay planos más abiertos: la historia es de una mesa.
- La única vez que la cámara se acerca por curiosidad es el copiar/pegar (1.3): el chiste tiene que verse.

## 5 · Física

- **La mesa tiene rozamiento alto.** El hilo flojo queda donde se apoya. Solo se mueve si la tensión llega hasta él.
- **El hilo se teje por la punta.** Durante el trabajo a mano, el hilo sale de fuera de cuadro y la punta lo va dejando sobre la mesa, como un marcador. El recorrido es el dibujo.
- **La punta trabaja como una mano con lápiz.** Acelera al salir, frena al llegar a un objeto, hace el gesto y sale. La velocidad sube de un viaje al siguiente (≈ 600 → 2400 unidades/s) y la precisión baja: los gestos se agrandan y se desordenan.
- **El tirón es un hilo real tirado desde la punta.** El tramo tenso es recto entre apoyos: va del frente del enredo a la esquina de la calculadora y de ahí sigue la ruta. El frente recorre el enredo al revés (último tejido, primero soltado) y barre la mesa como un limpiaparabrisas que pivota en la calculadora. El largo total del hilo se conserva: lo que la punta recorre más lo que se enrolla es exactamente lo que el enredo pierde (se resuelve por bisección en cada cuadro).
- **Esquinas con apoyo.** La esquina donde la ruta sube abraza la esquina redondeada de la calculadora. La esquina de llegada, arriba, es la curva de la estela del logo.
- **Las herramientas quedan libres en orden inverso.** Cada una se endereza (320 ms, curva decidida) en el cuadro en que el frente pasa el primer hilo que la tocó.
- **Altura = sombra.** El hilo flojo tiene sombra corta y dura; el hilo tenso, un poco levantado, tiene sombra más larga y difusa. La esfera, al aterrizar, junta su sombra.
- **Las rayas de torsión** del hilo celeste se mueven con el material, así se ve que el hilo corre por la ruta.
- **Luz fija** arriba a la izquierda. Nada del film la contradice.

## 6 · Transformaciones

Solo hay tres, y cada una tiene causa:

| Transformación | Causa | Cómo |
|---|---|---|
| Hilo gris fino → hilo celeste grueso | La tensión llega a ese tramo | El cambio recorre el hilo con el frente de tensión; zona de transición de 70 unidades |
| Herramienta torcida → derecha | El hilo la suelta | 320 ms, curva decidida, un clic |
| Punta → esfera | El sobrante se enrolla en ella | Radio proporcional a la raíz cúbica del hilo enrollado |
| Esfera → punto del logo | Aterriza y se vuelve signo | Pierde volumen (sombreado) durante la revelación de `argy`; el hilo pierde sus rayas y su brillo al mismo tiempo |

## 7 · Transiciones

- No hay cortes ni fundidos. El film es un plano.
- Las «transiciones» son de tres tipos: un sonido que motiva un movimiento (zumbido → paneo), un evento que motiva una pausa (silencio → quietud) y un elemento que se vuelve otro (punta → punto → logo).
- El texto entra y sale con el mismo gesto que el logo: se revela de izquierda a derecha y se va de izquierda a derecha, hacia adelante.

## 8 · Quietud

La quietud es un recurso, no un hueco:

| Cuándo | Cuánto | Para qué |
|---|---|---|
| P1 | 1.5 s | Presentar la punta antes de explicarla |
| P3 | 1.9 s | Que la frase se lea con la mesa todavía en orden |
| P6 | 1.4 s | Que el silencio pese |
| P7 → P8 | 1.5 s | Ver el primer celeste antes del tirón |
| P9 | 1.0 s | Ver la mesa ordenada |
| P11 | 3.1 s | Final |

## 9 · Motivos que evolucionan

| Motivo | Primera aparición | Evolución | Última aparición |
|---|---|---|---|
| La punta | Quieta, gris (P1) | Corre a mano (P2–P5) → se congela (P6) → se vuelve celeste (P7) → tira (P8) | Es el punto del logo (P10) |
| El zumbido | Llama a la punta (P2) | Cada vez más seguido hasta el ruido (P5) | Manda una señal que viaja sola (P9) |
| La vuelta | Leer el celular, cerrar la caja (P2) | Rulos que tapan la mesa (P5) | Barrida por el frente de tensión (P8) |
| El punto final | Tinta, en «funciona.» (P3) | Celeste, en «punta» (P7) | En el logo (P10) |
| La esquina redondeada | Esquinas de los objetos (P2) | Apoyo de la ruta (P8) | Esquinas de la ruta que entra al logo (P10) |
