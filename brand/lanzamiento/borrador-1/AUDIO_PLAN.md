# La punta · plan de sonido

El sonido cuenta la misma historia que la imagen: **el problema es ruido; la solución es música.** El hilo flojo suena a roce; el hilo tenso suena a cuerda.

Todo el audio se sintetiza con código (`herramientas/audio.mjs`), a partir de los mismos eventos que mueven la imagen (`film/guion.js`). No hay bancos de sonido ni música de stock. Estéreo, 48 kHz, 24 bits.

---

## Estructura musical

| Tramo | Tiempo | Qué suena | Carácter |
|---|---|---|---|
| Diegético | 0–20.8 | Solo sonidos de la mesa. Sin música. | Documental, cercano |
| Ritmo accidental | 8.9–15.6 | Los sonidos del trabajo arman un pulso: zumbido, golpecito, golpecito, tecla. | Casi un groove, sin querer |
| Masa | 15.4–20.8 | Los pulsos se pisan y se vuelven textura; debajo, ruido filtrado que sube. | Agobio |
| Silencio | 20.8–22.2 | Medio segundo de silencio digital; después, aire de habitación. | Vacío |
| Una nota | 24.9 | La 5 (880 Hz), seno con un armónico suave y cola larga. | Descubrimiento |
| Cuerdas | 26.4–31.78 | Una cuerda pulsada (Karplus-Strong) por cada rulo que se suelta, en pentatónica de Re mayor, ascendente. Debajo, una cuerda frotada cuya afinación sube con la tensión. | Satisfacción física |
| Resolución | 31.78 | Acorde de Re mayor con novena (Re2 La2 Re3 Fa#3 Mi4 La4). | Llegada |
| Coda | 33.4–40.9 | El acorde sostiene; zumbido final, pulso de la señal, soplido del logo. | Calma |
| Fin | 40.9–42.4 | Silencio. | — |

Tonalidad: Re mayor. La nota del descubrimiento (La) es la quinta del acorde final: la promesa y la resolución están en la misma armonía.

## Ritmo

- **0–15.6 s:** el pulso lo marcan los zumbidos del celular. Del zumbido 2 al 7 el intervalo baja de 3.3 s a 0.45 s.
- **Copiar/pegar (10.1–10.8):** cuatro golpecitos a 0.225 s, el único momento con tempo exacto antes del tirón. Es el chiste.
- **15.6–20.8 s:** sin tempo; densidad creciente.
- **26.4–32.4 s:** las cuerdas siguen al frente de tensión, así que el ritmo sale de la física. Aceleran hasta 29.5 s y frenan con la punta.

## Ambiente

- **Aire de habitación:** ruido rosa con paso bajo en 900 Hz, −46 dBFS. Presente de 0 a 20.8 y de 21.3 a 40.9. Sube 2 dB durante el enredo y baja 4 dB cuando la mesa se ordena: la sala «se calma».
- **Sin ruido urbano, sin pájaros, sin reloj.** Cualquiera de esos sería un cliché.
- **Espacio:** reverb corta de habitación (≈ 0.4 s) para lo diegético; más larga (≈ 2.2 s) para las notas.

## Efectos

| Efecto | Síntesis | Dónde |
|---|---|---|
| Zumbido de celular | Motor: seno de 170 Hz modulado + armónicos de traqueteo; ráfagas de 2 × 380 ms | Cada llamado; paneado según la posición del celular en pantalla |
| Roce del hilo | Ruido pasabanda (1.2–3 kHz) con volumen según la velocidad de la punta | Mientras la punta teje (0–24) |
| Lápiz | Ruido agudo con envolvente en diente de sierra, 14 Hz | Zigzag en el cuaderno |
| Golpecito de papel | Clic grave filtrado, 25 ms | Filas de la planilla, copiar/pegar |
| Tecla | Clic de plástico: ruido de 4 ms + resonancia de 2.4 kHz | Calculadora |
| Cartón | Ruido con paso bajo y fricción irregular | Vuelta a la caja |
| Ticket | Barrido de papel, 300 ms | Tickets que asoman y se apilan |
| Masa del enredo | Ruido marrón con filtro que se abre de 200 a 2400 Hz | 15.4–20.8 |
| Cuerda tensa | Diente de sierra filtrado, afinación de Re2 a La2 según la tensión | 26.4–31.78 |
| Cuerda pulsada | Karplus-Strong, 3.5 s de caída | Cada rulo que se suelta |
| Enganche | Clic de madera + la cuerda que cambia de nota un instante | Cada objeto que se endereza |
| Aterrizaje | Seno de 90 → 55 Hz, 180 ms, más un golpe blando | 32.4 |
| Señal | Seno que sube una octava en 1 s, con paneo de izquierda a derecha | 33.5–34.5 |
| Logo | Soplido de ruido rosa, 550 ms | 34.5 |

## Silencios

1. **20.8–21.3: silencio digital.** Todo se corta en el mismo cuadro en que se congela la punta, sin cola de reverb. Es el sonido más fuerte del film.
2. **23.6–24.9: casi nada** mientras aparece la frase, para que la nota llegue sola.
3. **40.9–42.4:** el film termina en silencio, con la imagen quieta.

## Sincronías que no se pueden mover

| Tiempo | Imagen | Sonido |
|---|---|---|
| 1.50 | (el celular está fuera de cuadro) | Primer zumbido: el sonido llega antes que la imagen |
| 5.30 | Tecla amarilla | Clic más agudo |
| 20.80 | La punta se congela | Silencio digital |
| 24.90 | Punto celeste en la frase y en la punta | La 5 |
| 26.40 | La punta arranca | Ataque de la cuerda tensa |
| Cada enganche | El objeto se endereza | Clic |
| 31.78 | Aterrizaje y último rulo | Golpe + acorde |
| 34.50 | `argy` empieza a aparecer | Soplido |

## Mezcla

- Pico máximo −1.5 dBTP. Sonoridad integrada −16 LUFS (web y redes): limitador con anticipación de 5 ms en la síntesis y `loudnorm` lineal en dos pasadas al codificar.
- El enredo (18–24) queda 3 dB por debajo del aterrizaje: la música gana.
- Paneo moderado (±40 %) según la posición en pantalla: el sonido va donde va la imagen.
- Sin compresión de bus agresiva: el silencio tiene que ser silencio.
