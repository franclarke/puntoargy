# .argy — Brand Definition

**Versión:** v1.1 · 2026-09-24
**Cambios:** ver [Registro de cambios](#31-registro-de-cambios) al final.

---

## 1. Propósito del documento

Este documento define el estado actual de la marca `.argy`.

No pretende cerrar prematuramente todas las decisiones de negocio, posicionamiento o identidad visual. Su objetivo es:

- registrar las decisiones que ya pueden considerarse parte de la marca;
- distinguirlas de las hipótesis y direcciones todavía en exploración;
- evitar que conceptos surgidos en exploraciones visuales anteriores se conviertan accidentalmente en reglas de marca;
- servir como contexto base para diseñadores, desarrolladores y agentes de IA que trabajen sobre `.argy`;
- mantener visible todo aquello que todavía requiere investigación, experimentación o decisión.

Se utilizarán tres estados:

- **DEFINIDO** — Decisión aceptada como parte de la marca.
- **ENCAMINADO** — Existe una dirección clara, pero todavía puede evolucionar.
- **ABIERTO** — No debe asumirse ninguna solución. Requiere trabajo posterior.

---

## 2. Nombre

**Estado: DEFINIDO**

La marca se llama `.argy`. El punto forma parte integral del nombre.

`.argy` debe tratarse como la denominación principal de la empresa y no como una abreviación de otro nombre.

El nombre combina una estética propia del mundo digital con una referencia inmediatamente reconocible a Argentina. La argentinidad ya se encuentra fuertemente presente en el naming, por lo que el resto de la identidad no necesita recurrir constantemente a símbolos nacionales explícitos.

**Observaciones (v0.2, no son decisiones):**
- Con el punto inicial, `.argy` se lee como una extensión de dominio (`.com`, `.ar`, `.io`): un *lugar* o una *categoría*. Es un insumo para símbolo y territorio.
- En inglés británico, "Argie" es un apodo coloquial con carga despectiva hacia argentinos, y "argy-bargy" significa "discusión, pelea". No afecta el canon, pero sugiere que en inglés el nombre se use siempre completo (`.argy`) y no "Argy" suelto. A retomar al definir pronunciación.

**Escritura y pronunciación (DEFINIDO, v1.0):**
- Se escribe `.argy`: siempre en minúscula y siempre con el punto, también al comienzo de una oración.
- Se dice **"punto argy"**. Los productos se dicen "stock punto argy".
- No se usa "Argy" suelto ni "Punto Argy" con mayúsculas en comunicación pública.
- Dominio: `puntoargy.com` (ver 26). Handles sugeridos: `@puntoargy` (falta verificar disponibilidad).

**Pendiente:** nombres definitivos de productos (ver 26).

---

## 3. Naturaleza de la empresa

**Estado: ENCAMINADO**

`.argy` es una empresa de desarrollo de software orientada a crear tecnología útil para empresas argentinas.

Su actividad puede incluir, entre otras cosas: desarrollo de sitios web; e-commerce; aplicaciones internas; software a medida; automatización de procesos; integraciones; herramientas digitales específicas; productos de software reutilizables; eventualmente soluciones que incorporen inteligencia artificial.

La empresa no debe quedar definida exclusivamente como: agencia web; software factory; consultora de IA; empresa de automatización; SaaS; product studio.

El modelo debe conservar suficiente flexibilidad para evolucionar. `.argy` podrá construir soluciones específicas para clientes y, al mismo tiempo, desarrollar productos propios que luego puedan comercializarse bajo la misma marca.

**Contexto actual (hecho, v0.2):**
- Hoy `.argy` es una sola persona (fundador y desarrollador).
- Una razón central de la marca es presentar el trabajo detrás de una marca profesional en lugar de como desarrollador independiente.
- Puede incorporar más personas en el futuro; la marca debe funcionar con una persona y escalar sin rebranding.

**Replanteo del fundador (v0.6) — ENCAMINADO:**

`.argy` no es solamente una empresa de desarrollo a medida. La visión es construir una **compañía de productos tecnológicos para empresas argentinas**: empieza resolviendo sus problemas directamente y transforma progresivamente esas soluciones en una familia de herramientas simples, conectadas e inteligentes.

- **Hoy:** desarrollo de soluciones para empresas: aplicaciones internas, automatizaciones, sistemas de gestión, integraciones, herramientas de IA y agentes, dashboards.
- **El desarrollo a medida es también un mecanismo de descubrimiento de producto:** se observan los problemas que se repiten entre empresas y se generalizan las soluciones que lo permiten (ver 4).
- **Largo plazo:** una familia de productos propios (SaaS) bajo `.argy`, que comparten infraestructura y datos, con una capa central de IA (ver 13 y 26).

La lista "no debe quedar definida exclusivamente como" sigue vigente: hoy `.argy` no es solo SaaS ni solo servicios; es la transición entre ambos.

**Punto de partida real (hecho, v0.7):** todavía no hay clientes bajo la marca. Como freelance, el fundador desarrolló para una pyme una tienda online con un sistema aparte para ver pedidos en kanban y manejar stock. Es el primer candidato a caso y a componentes reutilizables (pedidos, stock). `data.argy` es el candidato más fuerte a primer producto, sin decidir.

**Pendiente de definir:** categoría exacta con la que `.argy` se presenta públicamente (el fundador duda de que "agencia" sea la palabra correcta); descriptor de categoría; peso relativo entre servicios y productos; rol futuro de productos propios; rol de IA dentro de la oferta; si `.argy` se presenta como empresa, estudio, product studio u otra categoría; arquitectura futura entre marca corporativa y productos.

---

## 4. Modelo de negocio

**Estado: ENCAMINADO (v0.6)**

**Ciclo del modelo:**

> Problema real de una empresa → solución a medida → aprendizaje → patrón repetible → producto `.argy` → SaaS.

- Los servicios permiten descubrir y financiar los productos.
- Los productos permiten escalar más allá de los servicios.
- Evolución esperada: al principio, la mayor parte de los ingresos viene del desarrollo a medida; después conviven servicios y SaaS; eventualmente, los productos propios pueden ser el principal activo y fuente de ingresos.
- Cada producto surge de problemas reales detectados trabajando con empresas. No se construye una plataforma monolítica desde el comienzo ni todos los productos a la vez: el portfolio crece a medida que aparecen patrones claros.

**Datos y componentes (DEFINIDO, v0.7):**
- Los datos de clientes de servicios **nunca** se usan para construir ni entrenar productos.
- Lo que se reutiliza son **componentes** desarrollados por `.argy`, despersonalizados: sin la personalización ni los datos de la empresa para la que se hicieron. Ejemplo: de una tienda online con sistema de pedidos se puede extraer el sistema genérico para ofrecerlo a otros clientes o convertirlo en producto.
- Este principio puede comunicarse públicamente: es un argumento de confianza.

**Pendiente (v0.7):** cláusula contractual que reserve a `.argy` los derechos sobre componentes genéricos (sin ella, el código entregado puede pertenecer por completo al cliente; revisar con un abogado, también para el proyecto freelance ya entregado); pricing de servicios y de productos; programa de empresas piloto.

**Abierto a propósito (v0.7):** el criterio para convertir un patrón en producto. El fundador lo considera parte de la visión y no necesita definirse todavía.

**Contexto previo (v0.1):** No existía todavía un modelo de negocio definitivo. Durante la etapa inicial pueden coexistir diferentes fuentes de ingresos: clientes directos; agencias que tercericen desarrollo; proyectos web; e-commerce; software interno; aplicaciones a medida; mantenimiento y evolución de sistemas; automatización; productos propios; herramientas destinadas a problemas recurrentes de PyMEs.

No debe construirse la identidad de `.argy` alrededor de un modelo demasiado específico que pueda limitar esta exploración.

**Temas a trabajar:** servicios prioritarios; productos propios; pricing; proyectos cerrados vs. retainers; mantenimiento; suscripciones; licenciamiento; white-label para agencias; relación servicios/productos; posibilidad de convertir soluciones repetidas en productos.

---

## 5. Misión

**Estado: ENCAMINADO**

La misión de `.argy` gira alrededor de utilizar software y tecnología para ayudar a empresas argentinas a trabajar mejor.

Formulación conceptual provisional:

> Crear tecnología útil que ayude a empresas argentinas a mejorar cómo trabajan, venden, operan y crecen.

La redacción definitiva todavía no está cerrada.

La misión debe priorizar: utilidad real; impacto sobre empresas; tecnología aplicada; implementación; mejora concreta de operaciones; creación de valor. Debe evitar una narrativa centrada exclusivamente en la innovación tecnológica.

**Pendiente:** desarrollar y seleccionar una formulación definitiva de misión.

---

## 6. Visión

**Estado: ENCAMINADO (v0.6)**

Formulación del fundador (la redacción final se trabaja en la etapa verbal):

> Construir una compañía de productos tecnológicos para empresas argentinas, que empieza resolviendo sus problemas directamente y transforma progresivamente esas soluciones en una familia de herramientas simples, conectadas e inteligentes, para que las empresas operen mejor, entiendan mejor su negocio y crezcan.

Respuestas a las preguntas originales: sí a construir una empresa de productos; el camino es una combinación de productos y desarrollo; el foco son pymes, emprendedores y empresas argentinas; la operación internacional sigue sin descartarse (ver 8).

**Contexto previo (v0.1):** la visión no estaba definida y no debía inventarse una artificial. Esta formulación viene del fundador, no de un agente.

**Preguntas originales:**
- ¿Qué debería representar `.argy` dentro de diez años?
- ¿Queremos construir una empresa de productos?
- ¿Una compañía de software relevante para el mercado argentino?
- ¿Un ecosistema de tecnología para PyMEs?
- ¿Una empresa capaz de operar internacionalmente?
- ¿Una compañía especializada en determinados sectores?
- ¿Una combinación de productos y desarrollo?

---

## 7. Propósito

**Estado: ENCAMINADO**

Dirección conceptual: usar software y tecnología para contribuir a que las empresas argentinas sean mejores, más capaces y más competitivas.

El desarrollo tecnológico no es el fin en sí mismo. El foco está en las personas y organizaciones que utilizan la tecnología.

La marca puede expresar cierto optimismo acerca de construir mejores empresas en Argentina, pero debe evitar convertirse en una narrativa patriótica explícita.

**Principio central:** Tecnología al servicio de empresas y personas reales.

**Pendiente:** redactar una versión definitiva; establecer cuánto de este propósito aparece públicamente; decidir si existe una narrativa más amplia vinculada al desarrollo productivo argentino.

---

## 8. Mercado geográfico

**Estado: DEFINIDO**

Argentina es el mercado de origen de `.argy` y forma parte de la identidad de la marca. En la primera etapa, la empresa estará principalmente orientada al mercado argentino.

Esto no implica una limitación permanente. `.argy` debe poder trabajar con clientes internacionales en el futuro sin necesidad de realizar un rebranding.

**Principio:** Local por origen, no limitado geográficamente.

---

## 9. Público objetivo inicial

**Estado: ENCAMINADO**

El público inicial más probable son pequeñas y medianas empresas argentinas y emprendedores (v0.6).

**Contexto real de ese público (v0.6):** `.argy` debe entender cómo trabajan realmente las pymes del país: WhatsApp, Excel, sistemas contables, Mercado Pago, bancos, e-commerce, PDFs, procesos manuales y herramientas desconectadas. La oportunidad está en conectar y simplificar ese ecosistema con software moderno. También existe un segundo canal relevante: agencias o empresas de servicios que necesiten delegar o tercerizar desarrollo de software.

Los primeros proyectos pueden incluir: páginas web; e-commerce; herramientas internas; aplicaciones específicas; integraciones; automatizaciones; soluciones digitales personalizadas.

No se pretende definir todavía un ICP extremadamente específico.

**Pendiente de investigar:** tamaño ideal de empresa; ticket viable; responsables de compra; sectores con mayor necesidad; problemas recurrentes; necesidades tecnológicas de PyMEs; agencias como canal comercial; oportunidades de white-label development; problemas potencialmente convertibles en productos.

---

## 10. Público objetivo futuro

**Estado: ABIERTO**

No se define por ahora. `.argy` podría evolucionar hacia: PyMEs; empresas medianas; empresas grandes; industria; agro; servicios; retail; logística; clientes internacionales; agencias; sectores verticales específicos.

La marca debe conservar suficiente amplitud para permitir cualquiera de estas evoluciones.

---

## 11. Verticalización

**Estado: ABIERTO**

No existe todavía una industria prioritaria. No debe presentarse `.argy` como una empresa exclusivamente industrial, agropecuaria, comercial o tecnológica. Las referencias a industria o producción pueden utilizarse únicamente cuando tengan sentido dentro de una aplicación concreta.

**Trabajo futuro:** investigar qué verticales presentan problemas repetibles; mayor willingness to pay; baja digitalización; alto costo operativo; oportunidades de automatización; productos replicables.

---

## 12. Posicionamiento

**Estado: ENCAMINADO**

Dirección general: `.argy` construye tecnología destinada a resolver problemas empresariales reales.

**Dos horizontes (v0.6, ENCAMINADO):**

| Horizonte | Qué comunica | Regla |
|---|---|---|
| **Hoy** | `.argy` desarrolla software, automatizaciones y soluciones inteligentes para empresas argentinas. | Es lo que se puede contratar hoy. Permite vender proyectos sin tener una suite. |
| **Visión** | `.argy` está construyendo herramientas propias para simplificar la operación y mejorar las decisiones de las empresas. | Visible, pero sin fingir que la suite ya existe. Cada producto aparece con su estado real. |

- `.argy` no se presenta con el lenguaje típico de una software agency ("contanos tu idea y desarrollamos tu app"), sino como una empresa tecnológica que trabaja con empresas para resolver problemas y usa ese conocimiento para crear mejores productos.
- Oportunidad central: conectar y simplificar el ecosistema real de la pyme argentina (ver 9).

**Estrategia de producto: conectar primero (DEFINIDO, v0.7).** La familia de productos empieza como una capa que conecta y entiende lo que la empresa ya usa (sistemas de gestión, Mercado Pago, Excel, WhatsApp, e-commerce). Cuando `.argy` esté mejor parada, podrá reemplazar las piezas que falten para completar el stack y sumar fuentes de datos.

**Pendiente:** posicionamiento frente a ERPs y software de gestión locales.

La marca debe distanciarse de la innovación vacía, las demos tecnológicas sin implementación y el discurso excesivamente centrado en herramientas.

No se vende tecnología por tecnología. Se construyen cosas que deben funcionar.

**Conceptos compatibles:** utilidad; implementación; resultados; software; producto; resolución de problemas; simplicidad; mejora de operaciones; experiencia de usuario; tecnología aplicada.

**Todavía abierto:** propuesta de valor definitiva; diferenciación; promesa principal; categoría; mensaje comercial; argumentos frente a competidores; posicionamiento respecto de agencias, software factories, freelancers y SaaS existentes.

---

## 13. Inteligencia artificial

**Estado: ENCAMINADO**

La inteligencia artificial puede formar parte de las soluciones de `.argy`, pero no debe convertirse automáticamente en el centro de la marca. La tecnología elegida debe depender del problema.

`.argy` puede utilizar: IA; automatización; software tradicional; integraciones; datos; sistemas web; infraestructura.

La identidad debe resistir incluso si el mercado deja de utilizar "AI" como principal narrativa tecnológica.

**Principio:** El problema primero. La tecnología después.

**Capa de IA a largo plazo (v0.6, ENCAMINADO):** sobre los productos puede existir un asistente o agente `.argy` capaz de interactuar con todo el negocio: responder preguntas ("¿Cómo vienen las ventas este mes?", "¿Qué clientes dejaron de comprar?", "¿Quién me debe dinero?") y ejecutar acciones ("Generame un presupuesto para este cliente con los precios actuales"), usando los distintos productos y fuentes de datos.

- La IA y los agentes son una parte importante de la propuesta tecnológica, pero siguen siendo un medio: `.argy` no es una "agencia de IA".
- La comunicación habla de las preguntas del dueño, no de la tecnología que las responde.

**Pendiente:** definir cuánto protagonismo tendrá IA en homepage, descriptor, oferta, comunicación, marketing y productos.

---

## 14. Personalidad de marca

### 14.0 Carácter base

**Estado: DEFINIDO (v0.2)**

El carácter de `.argy` combina dos direcciones exploradas en la etapa 1:

- **Optimismo constructor (dominante):** energía, juventud, ambición, ganas de hacer. "Hagamos cosas."
- **Oficio:** cuidado, trabajo bien terminado, calidad sin alardear. **Premium honesto.**

Ambas comparten una misma raíz: **la cultura del hacer y del ingenio.** La energía de `.argy` es la energía de construir; el oficio es la prueba de que lo construido funciona.

La marca tiene una dosis alta de diseño y expresividad, pero debe leerse siempre como una empresa que construye software, no como una agencia de diseño.

#### Idea central: Ingenio

**Estado: DEFINIDO (v0.3)**

`.argy` encuentra la vuelta inteligente: resuelve problemas reales con soluciones simples y bien pensadas. La energía viene de la ocurrencia; el oficio, de terminarla bien.

- **Ingenio bien terminado**, nunca improvisación ni "atado con alambre". El oficio no es opcional.
- El ingenio es inteligencia humana; la IA es una herramienta más de ese ingenio, no su centro (coherente con 13).
- Argentina aparece a través del ingenio como rasgo cultural, sin símbolos (coherente con 14.3).

#### Rasgos de personalidad

**Estado: DEFINIDO (v0.3)**

| Rasgo | Es | No es |
|---|---|---|
| **Enérgica** | Ganas, ritmo, iniciativa. Propone antes de que le pidan. | Acelerada, ruidosa, hype. |
| **Ingeniosa** | Encuentra la solución simple, la vuelta que nadie vio. | Improvisada, atada con alambre, rebuscada para lucirse. |
| **Hacedora** | Termina lo que empieza. Cuida los detalles que nadie ve. | Perfeccionista que nunca entrega. Artesanal y lenta. |
| **Optimista** | Cree que las cosas se pueden hacer mejor, y lo demuestra. | Patriótica, ingenua, "vamos que se puede". |
| **Honesta** | Dice qué se puede y qué no. No promete magia, tampoco con IA. | Humo, jerga, "transformación digital". |

#### Balance según contexto

**Estado: DEFINIDO (v0.3)**

Más energía hacia afuera, más oficio hacia adentro. Misma marca, distinto volumen.

- Web, landing pages, social: más optimismo constructor.
- Propuestas, producto, documentación, portales: más oficio.

#### Reglas para no parecer agencia

**Estado: ENCAMINADO (v0.3)**

Una agencia vende creatividad; `.argy` vende cosas que funcionan. El diseño es *cómo* está hecho, no *lo que* se vende.

1. El protagonista es siempre lo construido: interfaces, sistemas, resultados. Nunca el diseño como fin en sí mismo.
2. La energía está en la estructura (ritmo, escala, color, movimiento), no en la decoración.
3. **El espectáculo es la idea de `.argy`, no el lucimiento del estudio** (reformulada en v1.1 al elegir la dirección "El hilo" para la web). Sí: hero interactivo, relato con scroll e interfaces vivas, siempre que cuenten el enredo, la conexión o el producto. No: cursores personalizados, scroll que le quita el control al usuario, efectos que no cuentan nada, autodefiniciones como "colectivo creativo".
4. Cada pieza expresiva lleva al menos una prueba concreta: un número real, una pantalla, un antes/después.

#### Honestidad de escala

**Estado: ENCAMINADO (v0.3)**

La marca profesionaliza la presentación; no aparenta una estructura que no existe.

- "Nosotros" como voz de marca es válido.
- No afirmar tamaño, equipo, oficinas ni volumen de proyectos que no existan.
- El profesionalismo se demuestra con proceso y consistencia: propuestas, documentación, onboarding, cumplimiento de plazos.

#### Referencia de tono (no es copy aprobado)

El siguiente texto fue validado como referencia de tono. No es tagline ni copy final.

> Nos gusta hacer cosas.
> Cosas que funcionan el lunes a la mañana, cuando entra el primer pedido.
> En cada empresa hay algo que se puede hacer mejor, y casi siempre la solución es más simple de lo que parece. Hace falta ingenio para encontrarla y oficio para terminarla bien.
> Usamos la tecnología que el problema pida: a veces inteligencia artificial, a veces una integración bien hecha, a veces una web que por fin vende.
> Somos optimistas. No de palabra: de obra.

### 14.1 Institucional vs. creativa

**Estado: ENCAMINADO**

`.argy` no debe sentirse excesivamente institucional. La marca debe transmitir creatividad, iniciativa y capacidad de construir. Debe parecer una compañía tecnológica moderna y relativamente joven.

**Evitar:** consultora tradicional; estética bancaria; comunicación burocrática; formalidad excesiva; lenguaje corporativo genérico.

### 14.2 Corporativa vs. startup

**Estado: ENCAMINADO**

La dirección es claramente más cercana al universo startup/product company que al de una corporación tradicional.

Debe sentirse: ágil; moderna; curiosa; flexible; emprendedora; capaz de construir rápido.

Sin embargo, debe conservar suficiente credibilidad para vender proyectos relevantes a empresas.

**Objetivo:** Startup energy + confianza profesional.

### 14.3 Argentina explícita vs. Argentina sutil

**Estado: DEFINIDO (modificado por el fundador en v0.6)**

La referencia argentina debe ser sutil. Los dos principales elementos ya cumplen gran parte de esta función: el nombre `.argy` y la utilización de un celeste inspirado en la identidad argentina.

No se busca construir una marca basada visualmente en: banderas; mapas; escarapelas; soles; símbolos patrios; clichés culturales argentinos.

Podrán existir referencias ocasionales cuando tengan sentido, pero deben utilizarse con moderación.

**Principio:** Argentina se siente; no necesita explicarse constantemente.

**Modificación del fundador (v0.6):** se incorporan el amarillo del sol de la bandera como color de acento y un sol propio como elemento ocasional. Esto amplía la excepción de "referencias ocasionales" y se regula para que la referencia siga siendo sutil:
- **El sol firma, no presenta:** aparece una vez por página, en el cierre (footer), nunca en el logotipo ni junto a él.
- El sol es un dibujo propio construido con la gramática de `.argy` (ver 19.1), no el Sol de Mayo oficial.
- El amarillo es un detalle (hasta 3% de la superficie), nunca sobre celeste y nunca en franjas que reproduzcan la bandera.

El principio se mantiene.

### 14.4 Industrial vs. digital

**Estado: ABIERTO**

La marca no debe asumir todavía una estética industrial porque el mercado inicial probablemente sea mucho más amplio. El sistema visual debería poder funcionar tanto para un e-commerce, una PyME de servicios, una aplicación interna, un producto propio o una empresa industrial.

### 14.5 Premium vs. accesible

**Estado: ENCAMINADO**

`.argy` debería inclinarse hacia una percepción premium. Premium no significa lujo. Debe significar: atención al detalle; buen diseño; buen producto; profesionalismo; calidad; claridad; confianza; cuidado.

La marca debe poder trabajar inicialmente con clientes de distintos tamaños sin parecer inaccesible.

**Objetivo:** Calidad premium sin elitismo. Un **premium honesto** (v0.2).

### 14.6 Técnica vs. humana

**Estado: ENCAMINADO**

La dirección deseada es más humana que técnica. `.argy` desarrolla tecnología, pero la comunicación no debe girar permanentemente alrededor de código, terminales, infraestructura, arquitectura, modelos o APIs.

La tecnología existe para ayudar a personas, equipos, empresas, clientes y negocios. La identidad puede contener señales tecnológicas, pero el protagonista final debe ser el impacto humano y empresarial.

**Principio:** Software hecho para personas que hacen cosas reales.

### 14.7 Sobria vs. expresiva

**Estado: ENCAMINADO**

La marca debe ser más expresiva que sobria. Con el carácter definido en 14.0, el nivel de expresividad es alto: energía, color y diseño con presencia.

Sin embargo, no debe convertirse en una marca centrada en diseño experimental. `.argy` sigue siendo una empresa de desarrollo de software.

La expresión visual debe aportar personalidad, diferenciación, memorabilidad y energía, pero nunca comprometer claridad, profesionalismo, usabilidad ni confianza.

**Objetivo:** un punto intermedio entre producto tecnológico serio y marca creativa con personalidad propia.

### 14.8 Local vs. internacional

**Estado: ENCAMINADO**

La identidad inicial será local y argentina. Debe sentirse naturalmente nacida en Argentina. Al mismo tiempo, el sistema visual y verbal debe tener suficiente nivel para funcionar internacionalmente. No debe depender de referencias culturales que imposibiliten esa expansión.

**Principio:** Argentino por origen, global por calidad.

---

## 15. Paleta de color

### Color principal

**Estado: DEFINIDO**

El celeste constituye el principal territorio cromático de `.argy`.

**Argy Blue — `#74ACDF`**

Este color conecta de manera suficientemente sutil con Argentina y aporta personalidad a la marca. Podrá ajustarse técnicamente si pruebas de contraste, impresión o reproducción lo requieren, pero esta tonalidad representa actualmente la dirección aprobada.

**Nota técnica (v0.2, no es decisión):** `#74ACDF` tiene contraste 2,4:1 contra blanco y 8,7:1 contra negro. No es apto como color de texto sobre blanco ni como fondo de texto blanco. Funciona como **superficie** (planos, bloques, fondos) con tinta oscura encima, y requiere un color de tinta oscuro compañero.

### Base clara u oscura

**Estado: DEFINIDO (v0.6)**

- **Base: Piedra (claro cálido).** Neutros con un grado de temperatura y tinta casi negra cálida. Es la base de todo el sistema: web, propuestas, documentación y producto.
- **Campo celeste (ENCAMINADO):** el celeste como fondo dominante queda disponible para momentos de marca (portadas, redes, piezas de lanzamiento), según la regla "más energía hacia afuera".
- **Noche (oscuro):** descartado como base. Solo podría existir como modo oscuro de algún producto.
- Direcciones evaluadas: Aire (claro frío), Piedra, Noche y Campo. Exploración: `brand/exploraciones/etapa-3-paleta-tipografia.html`.

**Contexto previo (v0.1):** no se consideraba definida una identidad predominantemente oscura; la identidad oscura explorada antes de v0.1 fue solo un experimento.

### Paleta

**Estado: DEFINIDO (v0.6)**

| Nombre | Hex | Rol |
|---|---|---|
| Piedra | `#F2F1ED` | Fondo base |
| Superficie | `#FAF9F6` | Tarjetas y paneles sobre Piedra (el blanco `#FFFFFF` se admite en superficies elevadas de producto) |
| Línea | `#E1DED7` | Bordes y divisores |
| Hilo | `#A8A39A` | El enredo (trazo fino) |
| Texto secundario | `#625E57` | Texto de apoyo |
| Tinta | `#1C1B19` | Texto principal, botones, footer |
| Argy Blue | `#74ACDF` | Color principal: superficies, la línea, el punto |
| Celeste profundo | `#2A6599` | Links, texto destacado, foco. Existe porque Argy Blue no sirve como texto |
| Sol | `#F6B40E` | Acento y detalle: el sol, resaltados |

**Proporción orientativa:** Piedra y superficies ~72%, Tinta ~14%, Argy Blue ~11%, Sol hasta 3%.

**Contrastes (WCAG):** Tinta sobre Piedra 15,2:1 · Texto secundario sobre Piedra 5,7:1 · Celeste profundo sobre Piedra 5,4:1 · Tinta sobre Argy Blue 7,1:1 · Tinta sobre Sol 9,1:1 · Sol sobre Tinta 9,1:1 · Sol sobre Piedra 1,7:1 (solo decorativo) · Argy Blue sobre Piedra 2,1:1 (no apto para texto ni para indicadores de UI que deban leerse solos).

**Reglas del amarillo (Sol):**
- Usos: el sol (ver 19.1) y el resaltado de una palabra o cifra por pieza, como un marcador, con tinta encima.
- Nunca como texto ni como línea fina sobre fondos claros; nunca sobre celeste; nunca en franjas celeste–blanco–celeste.
- En producto, su uso se define en el design system, cuidando que no se confunda con el color de advertencia.

**Acento evaluado y descartado:** coral `#FF6B4A`. El fundador eligió el amarillo del sol por coherencia con `.argy`.

**Todavía abierto:** colores funcionales (éxito, advertencia, error, información), paleta de datos y gradientes. Se definen en el design system.

---

## 16. Logotipo

**Estado: DEFINIDO (v0.8)** · exploración: `brand/exploraciones/etapa-6-logo-simbolo.html` · referencia: `brand/identidad-visual.html`

Logotipo tipográfico con **punto redondo**, que funciona como sistema de nombres.

| Elemento | Especificación |
|---|---|
| Tipografía | Bricolage Grotesque 800, tamaño óptico máximo, minúsculas |
| Espaciado | −0.045em entre letras |
| Punto | Círculo perfecto de 0,20 del cuerpo, apoyado en la línea de base. Es el mismo punto de la línea de Trayecto |
| Separación del punto | 0,04 del cuerpo a cada lado |
| Color | Letras en Tinta (fondos claros) o Piedra (fondos oscuros). Punto siempre Argy Blue; sobre Argy Blue, punto blanco; en versión de una tinta, todo del mismo color |
| Área de respeto | La altura de la "a" alrededor de todo el logotipo |
| Tamaño mínimo | 72 px de ancho en pantalla, 18 mm impreso. Más chico: usar el símbolo |

**Productos (`[producto].argy`):** el producto manda. Nombre del producto en Tinta, punto en Argy Blue, `argy` en Texto secundario (`#625E57`; sobre fondos oscuros, `#A8A39A`). Mismas letras y mismo peso: cambia solo el color.

**Alternativas evaluadas:** punto tipográfico (poco propio), punto destino (deja de leerse como punto), versión sobria en Instrument Sans (pierde personalidad), jerarquía igual y jerarquía por peso. Descartada antes de dibujar: una línea que subraya el nombre (choca con la *g* y la *y*).

**Archivos (v0.9):** `brand/logo/`, con letras convertidas a trazos: logotipo en cinco versiones, los ocho productos, íconos de producto, símbolo, favicon y PNG para íconos de app. Ver `brand/logo/README.md`. En los íconos, el punto sube a 0,24 del cuerpo como compensación óptica para tamaños chicos.

**Contexto previo:** no existía un logotipo aprobado y el tratamiento `.argy` de exploraciones anteriores no era definitivo.

**Preferencia registrada (v0.4):** al fundador le gusta la dirección de un logotipo puramente tipográfico (wordmark `.argy` con el punto en celeste), como el placeholder usado en la etapa 2. No está aprobado: debe explorarse en la etapa de logo junto con alternativas.

**Condición nueva (v0.6):** el logotipo debe diseñarse como un sistema de namespace: `.argy` sola y `[producto].argy` (por ejemplo `stock.argy`). En esa construcción, el punto pasa a ser la unión entre el producto y la empresa. Por eso el logo se diseña después de la arquitectura de marca (26). El sol no forma parte del logotipo.

**Debe explorarse:** wordmark; tipografía; custom lettering; geometría; peso; proporciones; espaciado; tratamiento del punto inicial; color del punto; relación entre punto y letras; versiones horizontales; versiones compactas; tamaños mínimos; versiones light/dark; comportamiento responsive.

---

## 17. Símbolo

**Estado: DEFINIDO (v0.8)**

**Símbolo "punto y a":** las dos primeras letras del logotipo, en un cuadrado redondeado (radio 22%) de fondo Tinta, con la *a* en Piedra y el punto en Argy Blue. Se usa en favicon, ícono de app y avatar. Funciona desde 16 px.

**Regla de íconos de producto:** el punto y las primeras letras del producto, como una extensión de dominio. Mismo fondo, mismos colores, sin un color propio por producto. Ver códigos en 26.

**Alternativas evaluadas:** el punto solo (genérico) y la ruta con punto (la más propia, pero abstracta y difícil de extender a productos).

**Contexto previo:** no existía un símbolo aprobado; el círculo azul de exploraciones anteriores no formaba parte de la marca.

El punto inicial de `.argy` constituye una oportunidad conceptual importante, pero todavía no se ha decidido cómo explotarla.

**Territorios a explorar:** punto; nodo; origen; conexión; posición; cursor; construcción; sistema; módulo; transformación; coordenada; combinación de caracteres; símbolo abstracto propio.

El símbolo debería ser: simple; memorable; reconocible; reproducible; funcional como favicon; funcional como app icon; visualmente propietario.

**Hipótesis (v0.6, no es decisión):** con el namespace, el punto tiene una función concreta: es la unión entre cada producto y `.argy`. Con la capa de IA, el punto puede ser también el lugar donde aparece la respuesta. Ambas lecturas pueden resolver el "punto grande como destino" (19.1), que hoy se siente forzado.

---

## 18. Tipografía

**Estado: DEFINIDO (v0.6)**

Combinación **Carácter**, elegida entre cuatro (Carácter, Precisión, Voz editorial, Expansiva):

- **Display:** Bricolage Grotesque. Grotesca con rarezas que se acentúan en tamaños grandes (eje óptico) y se calman en tamaños chicos. El ingenio queda en los detalles.
- **Texto e interfaz:** Instrument Sans.
- **Acento de voz:** Instrument Serif itálica, una vez por pieza.
- **Números:** cifras tabulares en interfaz y tablas.
- **Monoespaciada:** no forma parte de la voz de marca; solo en documentación técnica.
- Todas son de Google Fonts, gratuitas para uso comercial. Más adelante puede evaluarse una familia paga o un lettering propio para el logotipo.

**Escala (web, base 16px):**

| Token | Familia y peso | Tamaño / interlineado | Tracking |
|---|---|---|---|
| Display XL | Bricolage Grotesque 700 | 72 / 0.95 (móvil 44) | −0.04em |
| Display L | Bricolage Grotesque 700 | 56 / 1.0 (móvil 36) | −0.035em |
| Título 1 | Bricolage Grotesque 700 | 40 / 1.05 | −0.03em |
| Título 2 | Bricolage Grotesque 600 | 28 / 1.15 | −0.02em |
| Título 3 | Instrument Sans 600 | 20 / 1.3 | −0.01em |
| Texto grande | Instrument Sans 400 | 18 / 1.55 | 0 |
| Texto | Instrument Sans 400 | 16 / 1.55 | 0 |
| Chico | Instrument Sans 400–500 | 14 / 1.5 | 0 |
| Etiqueta | Instrument Sans 600, mayúsculas | 12 / 1.4 | +0.1em |
| Acento de voz | Instrument Serif itálica 400 | tamaño del contexto × 1.08 | −0.01em |

**Riesgo registrado:** Bricolage Grotesque está de moda en startups desde 2024. Se compensa con disciplina de uso: display solo en titulares, nunca en párrafos.

Exploración: `brand/exploraciones/etapa-3-paleta-tipografia.html`.

---

## 19. Dirección visual

### 19.1 Territorio creativo: Trayecto

**Estado: DEFINIDO (v0.6)** · referencia visual: `brand/identidad-visual.html`

La etapa 2 exploró cuatro territorios para expresar la idea de Ingenio: La vuelta, Taller, Encastre y Trayecto. El fundador eligió **Trayecto**, incorporando la limpieza de **La vuelta**.

- **Idea:** el ingenio como el camino corto. Algo enredado (el problema como está hoy) se convierte en una línea limpia (la solución) que termina en un punto (el resultado).
- **Tomado de La vuelta:** tipografía display grande y segura, mucho aire, un solo gesto por pieza, el punto grande como destino.
- **Riesgos a cuidar:** la línea no puede volverse ornamento; la energía no debe quedar en un nivel medio (el carácter dominante es la energía); la serif itálica puede empujar hacia lo editorial o hacia una consultora.
- **Síntesis visual:** *del enredo al punto*. El hilo gris es el problema como está hoy, la línea celeste es la solución y el punto es el resultado.
- **Contenido concreto (v0.6):** con el replanteo, el enredo tiene nombre: las herramientas sueltas de la pyme (WhatsApp, Excel, PDFs, Mercado Pago, bancos, sistemas desconectados). La línea es `.argy` conectándolas. El punto es donde aparece la respuesta.

#### Carácter del trazo: híbrido

**Estado: DEFINIDO (v0.5)**

El problema es orgánico y la solución es geométrica. El enredo es gestual (curvas irregulares, trazo fino, gris "hilo"). La solución es una ruta precisa (tramos rectos, esquinas redondeadas, trazo grueso celeste).
- En marketing se muestra la transformación completa (enredo → ruta).
- En producto e interfaz aparece solo la ruta geométrica.

Alternativas descartadas: gestual (demasiado ilustrativo, difícil de llevar a UI) y geométrico puro (pierde el relato del antes).

#### Comportamientos de la línea

**Estado: DEFINIDO (v0.6)**

| Comportamiento | Uso |
|---|---|
| Desenredar | El antes y el después. Heros, casos, portadas. |
| Conectar | Une partes que antes no hablaban. Integraciones, procesos, diagramas. |
| Subrayar | Marca la palabra que importa. Una vez por pieza. |
| Avanzar | Progreso. Estados, onboarding, etapas de proyecto. |
| Llegar | El resultado. El punto grande es un destino, nunca un decorado. |

**Regla madre:** la línea siempre representa un proceso real. Si no hay proceso, no hay línea. Cada pieza usa uno de estos comportamientos, rara vez dos.

#### El punto grande como destino

**Estado: DEFINIDO (v0.8)**

El punto de destino es el mismo punto del logotipo, a escala. La línea llega al punto y la respuesta aparece desde él, firmada por `.argy`. Sirve para heros, casos y, a futuro, para el agente.

**Contexto previo (v0.5):** la idea gustaba, pero la ejecución anterior (un disco grande que contenía una tarjeta) se sentía algo forzada. Debe re-imaginarse junto con la etapa de símbolo (17), ya que el punto de destino y el punto del nombre deberían ser el mismo elemento conceptual.

#### Elementos tomados de La vuelta

Tipografía display grande y segura; mucho aire; un solo gesto por pieza. La serif itálica se limita a un acento de voz, una vez por pieza, hasta la etapa de tipografía.

#### El sol: firma de origen

**Estado: ENCAMINADO (v0.6)** · el dibujo final se hace en la etapa de logo y símbolo.

- **Construcción:** el centro es el punto (círculo lleno). Alrededor, 16 rayos alternados: rectos, con el trazo de la línea (más grueso), y ondulados, con el trazo del hilo (más fino). Reinterpreta la alternancia de rayos rectos y flamígeros del Sol de Mayo con la gramática propia, sin cara y sin copiar el dibujo oficial.
- **Uso:** firma en el footer, centrado, una vez por página. También puede cerrar propuestas y presentaciones (contratapa). Nunca en el header, nunca en el logotipo.
- **Tratamiento recomendado:** sello, con el texto circular "Hecho en Argentina". Alternativas evaluadas: sol solo y "amanecer" (sol cortado por el borde). A confirmar.
- **Color:** completo en Sol sobre Tinta. Sobre fondos claros, rayos en Tinta y centro en Sol. Nunca sobre celeste.
- **Nota legal (no es asesoramiento):** el Sol de Mayo es un símbolo nacional y la Ley de Marcas (22.362) no permite registrar como marca los símbolos que usa la Nación. Por eso el sol de `.argy` es un dibujo propio y queda fuera del logotipo. Confirmarlo con un agente de la propiedad industrial antes de registrar la marca.

- **Exploraciones:** `brand/exploraciones/etapa-2-territorios.html`, `brand/exploraciones/etapa-2b-trayecto.html`, `brand/exploraciones/etapa-3-paleta-tipografia.html`. Referencia consolidada: `brand/identidad-visual.html`.

Territorios no adoptados como principales: Taller (candidato al registro "hacia adentro"), Encastre (recomendado por su escalabilidad a UI, no elegido), La vuelta (sus elementos se integran a Trayecto).

### 19.2 Contexto previo

Actualmente no existe una dirección visual suficientemente diferenciada para considerarse propia de `.argy`. La combinación dark + minimal + tech + blue debe considerarse demasiado genérica como para ser la identidad final.

**Objetivo del próximo trabajo visual:** encontrar una gramática que permita reconocer una pieza de `.argy` incluso cuando el logotipo no esté presente.

**Variables por explorar:** composición; geometría; contraste; escala; whitespace; grillas; formas; texturas; bordes; radios; líneas; bloques; profundidad; superposición; tratamiento de imágenes; relación entre tipografía e imagen; uso propietario del celeste; patrones; módulos; ritmo.

---

## 20. Fotografía / imagery

**Estado: ABIERTO**

No existe todavía una dirección fotográfica. Debido a la orientación humana deseada, la imagen puede convertirse en una herramienta importante.

**Recursos disponibles (hecho, v0.2):** no hay producción fotográfica propia por el momento. El fundador tiene fuerte habilidad en generación de imágenes con IA, que será el principal recurso de imagery en la etapa inicial.

**Dirección de arte: bodegones del hilo (ENCAMINADO, v1.1).** Imágenes generadas con IA, en 3D mate tipo arcilla: objetos cotidianos de una pyme (celular, planilla impresa, cuaderno, cajas, calculadora) sobre fondo Piedra, con un **hilo celeste físico** como único color saturado. En las imágenes del problema, el hilo enreda los objetos; en las de la solución, los une en una ruta de tramos rectos y esquinas redondeadas que termina en una esfera celeste (el punto). Sin personas, sin texto, sin logos. Así las imágenes continúan la trama de la web en lugar de decorarla. Guía completa, prompts y lugares en la web: `brand/imagenes/guia-de-imagenes.md`.

**Principio de imagery generada (ENCAMINADO, v0.3):** la imagen generada con IA no debe simular fotografía documental de personas o negocios reales que no existen (contradice el premium honesto y conduce a estética de "startup de IA genérica"). Debe tender a un estilo propio y reconocible donde se note la decisión de dirección de arte (objetos, escenas construidas, collage, 3D, ilustración u otros). A resolver en la etapa de imagery.

**Territorios a explorar:** personas trabajando; dueños de PyMEs; equipos; comercios; producción; operaciones; oficinas; talleres; industria; negocios reales argentinos; detalles cotidianos; fotografía documental; fotografía editorial.

**Principio posible:** Mostrar el mundo que el software ayuda a mejorar, no solamente el software.

---

## 21. Ilustración y gráficos

**Estado: ABIERTO**

Debe evaluarse si `.argy` necesita un sistema propio de: ilustración; diagramas; gráficos; patrones; data visualization; composiciones generativas; elementos editoriales.

Estos recursos podrían aportar la expresividad buscada sin convertir la marca en una marca de diseño.

---

## 22. Iconografía

**Estado: ABIERTO**

No existe sistema aprobado. Debe decidirse: outline vs. solid; geometría; grosor; radio; tamaño; complejidad; uso del color; integración con otros elementos visuales.

---

## 23. Motion

**Estado: DEFINIDO (v0.6)** · principios y tokens. Los temas listados como "todavía abierto" siguen abiertos.

El desenredo es la animación de marca: el enredo se dibuja, se ordena en una ruta y el punto llega al final.

**Principios:**
1. **De lo complejo a lo simple.** Todo movimiento resuelve algo; nunca agrega ruido.
2. **Con dirección.** Hacia adelante, hacia la derecha o hacia arriba: hacia el objetivo.
3. **El punto llega último.** Es la confirmación. Después del punto solo aparece el resultado.
4. **Decidido, no rebotón.** Arranque firme, frenado suave. Un solo rebote permitido: la llegada del punto.

**Tokens:**

| Token | Valor | Uso |
|---|---|---|
| Micro | 160ms | Hover, foco, color |
| Interfaz | 320ms | Menús, estados, transiciones entre pantallas |
| Trazo | 700ms | Líneas que se dibujan, progreso |
| Relato | 1200–1600ms | Desenredar en heros, casos y posts |
| Curva "decidida" | `cubic-bezier(.65,0,.15,1)` | Todo lo que se mueve |
| Curva "llegada" | `cubic-bezier(.34,1.56,.64,1)` | Solo el punto al llegar |

**Patrones validados como dirección:** la flecha de marca es una línea que termina en un punto (botones, links); la carga es un hilo que da vueltas y se desenreda al terminar; el progreso usa el comportamiento "avanzar"; la transición entre pantallas es una línea que cruza y trae la pantalla siguiente.

**Animación del logo (DEFINIDO, v0.8):** una línea corta trae el punto (0–800 ms, curva decidida), el punto aterriza con el rebote de llegada (desde 750 ms, 560 ms) y `argy` aparece de izquierda a derecha (desde 1200 ms, 550 ms). En productos, el nombre del producto ya está visible: solo llegan el punto y `argy`. Con `prefers-reduced-motion`, el logo aparece quieto.

**Animación del hero (DEFINIDO, v0.8):** se dibuja el enredo, aparecen las herramientas, sale la ruta, llega el punto y aparece la respuesta con el resaltado. El enredo no desaparece: `.argy` conecta lo que la empresa ya usa, no lo reemplaza.

**Todavía abierto:** loaders definitivos, motion aplicado a producto en detalle, respeto de `prefers-reduced-motion` como regla formal.

**Lista original de temas a explorar:** velocidad; easing; transiciones; microinteracciones; loaders; hover; aparición de contenido; animación del logo; posible comportamiento del punto; motion aplicado a producto y marketing.

---

## 24. Identidad verbal

**Estado: DEFINIDO (v1.0)** · definida por delegación del fundador; revisar después de los primeros meses de uso. Aplicada en `web/index.html`.

### Descriptor

> **Software para empresas argentinas.**

Dice qué es `.argy` hoy y sigue siendo cierto cuando existan los productos. No menciona IA ni se encierra en "agencia", "estudio" o "SaaS".

Alternativas evaluadas: "Software a medida y productos propios para pymes" (preciso pero largo), "Tecnología para pymes" (vago), "Estudio de software" (suena a agencia).

### Tagline

> **Del enredo al punto.**

Es la síntesis visual de Trayecto convertida en frase. Nombra lo que hace `.argy` (ordenar lo enredado) y termina en el punto, que es la marca. En la web y en piezas de marca, "al punto." puede llevar la itálica de acento.

**Expresión de cierre:** "¿Vamos al punto?". Se usa para invitar a contactar. Suma el sentido de "sin vueltas", que es el tono de la marca.

Alternativas evaluadas: "Vamos al punto." (quedó como expresión de cierre), "Hagamos que funcione." (genérica), "Tu negocio, conectado." (genérica), "Ingenio bien terminado." (autorreferencial: sirve adentro, no afuera).

### Tono de voz

| Rasgo | Así sí | Así no |
|---|---|---|
| **Directa** | "Conectamos lo que tu empresa ya usa." | "Brindamos soluciones tecnológicas integrales." |
| **Concreta** | "Los pedidos entran por WhatsApp y alguien los pasa a una planilla." | "Optimizamos tus procesos de negocio." |
| **Cálida, con humor seco** | "Un analista de negocio que no se toma vacaciones." | Chistes forzados, tono canchero, exclamaciones. |
| **Honesta** | "Todavía no están listos, y preferimos decirlo." | "La plataforma que revoluciona tu pyme." |
| **Optimista de obra** | "Nada de eso está mal. Solo que se puede conectar." | "Tu negocio está perdiendo plata cada día." |

### Reglas de escritura

- **Voseo siempre:** "contanos", "tenés", "sabés". Nunca tuteo ni "usted", tampoco en propuestas.
- **Informalidad media:** coloquial sin lunfardo. Sí: "presu", "planilla", "sin humo", "a mano". No: "posta", "re", "che", "copado".
- **Titulares en tipo oración** (solo la primera mayúscula). **Los titulares afirmativos terminan en punto:** el punto llega último, también en el texto.
- Frases cortas. Primero el problema, después la solución.
- **Números:** solo reales. Si un número es un ejemplo, se marca como ejemplo.
- **Tecnicismos:** evitarlos en comunicación pública (API, stack, SaaS, cloud, LLM). Se habla de lo que pasa: "se conecta", "se actualiza solo", "te avisa".
- "pyme" y "pymes" en minúscula. Los productos se escriben `stock.argy`.
- "Nosotros" es la voz de la marca. Nunca "nuestro equipo de expertos" ni afirmaciones de tamaño (ver 14.0).

### Vocabulario

| Preferimos | Evitamos |
|---|---|
| conectar, ordenar, resolver, funcionar, construir, simple, a medida, avisar, responder | potenciar, disruptivo, innovador, soluciones integrales, transformación digital, sinergia, revolucionar |
| tu empresa, tu negocio, tu equipo, pedidos, stock, cobros, planilla, presu | "llevar tu negocio al siguiente nivel", "partner estratégico", "IA de última generación" |
| todo conectado, funcionando junto | ecosistema (solo uso interno), plataforma omnicanal |

### Cómo hablamos de…

- **Software:** por lo que pasa en la empresa ("el pedido entra solo", "el stock se actualiza"), no por cómo está hecho.
- **Inteligencia artificial:** por lo que hace ("lee PDFs", "responde consultas", "te avisa qué reponer"). Se nombra sin adornos y se aclara que se usa cuando conviene. Nunca "potenciado por IA".
- **Argentina:** a través del contexto real (WhatsApp, Mercado Pago, ARCA, el contador, pesos), nunca con consignas patrióticas. "Hecho en Argentina" vive solo en el sello del sol.
- **Los productos:** siempre con su estado real ("en exploración", "en desarrollo", "disponible"). Nunca se muestran capturas de algo que no existe.
- **Los datos:** "Nunca usamos los datos de un cliente para construir nuestros productos." Se dice en público: es un argumento de confianza.

### Mensajes clave

1. **Conectamos lo que ya usás.** No hace falta tirar lo que funciona.
2. **Construimos lo que falta.** A medida y bien terminado.
3. **Hablamos claro.** Qué conviene, cuánto cuesta y cuánto tarda, antes de empezar.
4. **Tus datos son tuyos.**
5. **Estamos construyendo productos propios**, a partir de problemas reales.

### Pitch

**En una frase:** `.argy` hace software para empresas argentinas: conectamos lo que tu empresa ya usa y construimos lo que falta para que todo funcione junto.

**En 30 segundos (ENCAMINADO):** "`.argy` hace software para empresas argentinas. Hoy desarrollamos soluciones a medida: conectamos las herramientas que una pyme ya usa (WhatsApp, Excel, Mercado Pago, su sistema de gestión) y construimos lo que falta para que todo funcione junto. Con lo que aprendemos en cada proyecto estamos armando productos propios, simples y conectados, para que muchas empresas resuelvan lo mismo sin empezar de cero. Del enredo al punto."

### Narrativa (ENCAMINADO)

> Las pymes argentinas funcionan con lo que tienen a mano: WhatsApp, Excel, Mercado Pago, un sistema de gestión, PDFs y mucha memoria. Funciona, pero cuesta.
> `.argy` existe para conectar eso. Hoy lo hacemos a medida, empresa por empresa. Y con lo que aprendemos armamos herramientas propias, para que muchas empresas resuelvan lo mismo sin empezar de cero.
> Del enredo al punto.

### Llamados a la acción

| Uso | Texto |
|---|---|
| Principal | "Contanos qué problema tenés" |
| Secundario | "Cómo trabajamos" |
| Navegación | "Hablemos" |
| Productos | "Quiero enterarme" |
| Cierre | "¿Vamos al punto?" |

Regla: el llamado dice qué pasa y empieza por el problema del cliente. Evitar "Contanos tu idea", "Solicitá una demo", "Empezá ahora".

**Contexto previo (v0.1):** las frases generadas antes de v0.1 eran exploraciones y no canon. Entre ellas:

- "Tecnología que entra en producción."
- "Tecnología real para un país real."
- "Menos teoría. Más producción."
- "Software e Inteligencia Artificial aplicada a la matriz productiva argentina."

---

## 25. Experiencia digital

**Estado: ENCAMINADO (v1.0)**

### Web v2: dirección "El hilo" (ENCAMINADO, v1.1)

A partir del análisis de ganadores recientes de Awwwards (paletas de 1 o 2 colores usadas a lo grande, un momento propio en el hero, relato con scroll, detalles cuidados), el fundador eligió la dirección **El hilo**:

- **Hero interactivo:** el enredo es un hilo vivo que responde al mouse. Cada herramienta (WhatsApp, Mercado Pago, etc.) es un botón: al tocarla, una señal viaja por el enredo y la ruta hasta el punto, y aparece el aviso correspondiente. El enredo no desaparece: `.argy` conecta lo que ya existe.
- **Una sola línea recorre la página:** entra como hilo gris en "El enredo", se vuelve ruta celeste justo en "Solo que se puede conectar", pasa por cada sección como una estación y termina en el punto del contacto. Se dibuja con el scroll, sin secuestrarlo. Sobre Campo celeste, la línea va en blanco.
- **Contenido nuevo:** calculadora "¿Cuánto tiempo se lleva el enredo?", servicios con demostraciones vivas, números honestos, tablero de pedidos en vivo, asistente que escribe solo, preguntas frecuentes, cinta con las herramientas que conectamos.
- **Imágenes** de la dirección "bodegones del hilo" (ver 20).
- **Token nuevo:** Display hero, 96 px (móvil 52), solo para el titular principal.

Versión anterior guardada en `brand/exploraciones/web-v1/`.

### Web v1

Sitio estático de una página en `web/` (HTML, CSS y JS, sin paso de compilación). Se publica en `puntoargy.com`.

**Estructura:**

| Sección | Horizonte | Contenido |
|---|---|---|
| Hero | — | Descriptor, tagline, qué hacemos y animación del desenredo |
| El enredo | — | Cómo funciona hoy una pyme: herramientas que no se hablan |
| Hoy | Hoy | Seis servicios a medida |
| Cómo trabajamos | Hoy | Cuatro pasos, con el comportamiento "avanzar" |
| Un proyecto real | Hoy | Tienda online con sistema de pedidos y stock (sin datos del cliente) |
| Construyendo | Visión | Ciclo del modelo, tres productos en exploración, adelanto del agente con ejemplos marcados como tales. Fondo Campo celeste |
| Cuatro cosas que no negociamos | — | Principios: el problema primero, conectar antes que reemplazar, tus datos son tuyos, hablar claro |
| Contacto y footer | — | "¿Vamos al punto?", formulario que arma un email, sello del sol |

**Pendiente:** comprar el dominio y crear el email `hola@puntoargy.com`; confirmar con el fundador el texto del proyecto real; analítica; política de privacidad si el sitio empieza a guardar datos.

Al tratarse de una empresa tecnológica, la experiencia digital será una expresión central de la marca. Debe definirse un sistema que funcione para: website; landing pages; aplicaciones; productos; dashboards; documentación; propuestas; portales internos.

**Pendiente:** design system; spacing; grid; buttons; cards; inputs; navegación; estados; charts; responsive; motion; accesibilidad; design tokens.

---

## 26. Arquitectura de marca

**Estado: ENCAMINADO (v0.6)**

**Modelo: branded house con namespace.** `.argy` funciona como un namespace para la familia de productos: `[producto].argy`. El punto inicial del nombre ya estaba construido como un sufijo, y ahora esa construcción se vuelve la arquitectura.

Nombres de ejemplo (provisorios, no aprobados):

| Nombre | Área |
|---|---|
| `data.argy` | Inteligencia y análisis del negocio |
| `stock.argy` | Inventario y reposición |
| `ventas.argy` | Seguimiento comercial y CRM |
| `presu.argy` | Presupuestos y cotizaciones |
| `caja.argy` | Flujo de fondos y situación financiera |
| `cobros.argy` | Seguimiento de cobranzas |
| `pedidos.argy` | Gestión de pedidos |
| `clientes.argy` | Conocimiento y seguimiento de clientes |

- Debe existir un elemento común inmediatamente reconocible que haga evidente la pertenencia a la familia. Ese elemento es el sufijo `.argy` con su punto (16) y, en íconos, el punto con el código del producto (17).

**Códigos de íconos (ENCAMINADO, v0.8; siguen a los nombres provisorios):** `.da` data · `.st` stock · `.ve` ventas · `.pr` presu · `.ca` caja · `.co` cobros · `.pe` pedidos · `.cl` clientes.
- A largo plazo, los productos pueden compartir infraestructura y datos: quien usa varios no debería sentir que usa aplicaciones separadas, sino módulos de un mismo ecosistema.
- Sobre ellos puede existir un asistente o agente `.argy` (ver 13).

**Dominio (DEFINIDO, v1.0):** `puntoargy.com` es el dominio principal (también para el email: `hola@puntoargy.com`). `puntoargy.ar` y `puntoargy.com.ar` se registran para redirigir. Los productos no tienen subdominio propio: sus páginas viven en `puntoargy.com/[producto]` y, cuando existan, la aplicación será una sola (por ejemplo `app.puntoargy.com`) con los productos como módulos.

**Contexto de la decisión (v0.9):** `argy.ar`, `argy.com`, `argy.app`, `argy.com.ar` y `argy.dev` están ocupados. Según consultas RDAP del 24/09/2026, no figuran registrados `puntoargy.com`, `puntoargy.ar`, `puntoargy.com.ar`, `argy.tech`, `argy.lat`, `argy.co` y `argy.io` (a confirmar al comprar).

- `puntoargy` escribe el nombre tal como se dice, así que resuelve cómo se tipea `.argy` por teléfono o WhatsApp. `argy.tech` se descartó porque `.tech` contradice "más humana que técnica".
- **Principio:** `[producto].argy` es un nombre de marca, no una URL. Los productos no necesitan subdominio propio: páginas en `puntoargy.com/stock` y una sola aplicación (por ejemplo `app.puntoargy.com`) con los productos como módulos, coherente con el ecosistema de 26.

*(v0.7, superado)* Se había propuesto `argy.ar` con subdominios por producto (`stock.argy.ar`); `argy.ar` resultó ocupado.

**Nombres (ENCAMINADO, v0.7):** se admiten palabras coloquiales del habla de la pyme argentina (`presu`). La regla completa de nombres sigue pendiente.

**Pendiente:** regla completa de nombres (anglicismos como "data"); nombre o forma del agente; handles; pronunciación ("stock punto argy"); protección marcaria (las palabras genéricas no se registran solas: la protección está en `.argy`).

**Modelos evaluados en v0.1 (contexto previo):**
- **Branded house:** `.argy` como marca visible detrás de todos los productos.
- **Endorsed brands:** productos con nombres propios acompañados por `.argy`.
- **Independent products:** productos independientes creados por `.argy`.

Este tema deberá resolverse cuando exista el primer producto con entidad suficiente.

---

## 27. Principios actualmente aprobados

1. El nombre es `.argy`.
2. Argentina es parte del origen y de la identidad.
3. La referencia argentina debe ser sutil.
4. El celeste es el principal territorio cromático.
5. `.argy` construye software para resolver problemas reales de empresas.
6. Las PyMEs argentinas constituyen el mercado inicial más probable.
7. Las agencias pueden funcionar como un canal relevante de clientes.
8. El modelo de negocio debe permanecer flexible.
9. Servicios y productos propios pueden coexistir.
10. La tecnología debe estar al servicio del problema.
11. IA puede utilizarse, pero no necesariamente define la empresa.
12. La marca debe sentirse más startup que corporativa.
13. Debe evitar una identidad excesivamente institucional.
14. Debe apuntar a una percepción premium sin resultar elitista.
15. Debe priorizar una perspectiva humana sobre una puramente técnica.
16. Debe tener mayor expresividad que una empresa de software tradicional.
17. La expresividad no debe hacer que parezca una agencia de diseño.
18. La identidad inicial será local, pero debe ser capaz de operar internacionalmente.
19. Una base visual clara debe explorarse seriamente. *(Resuelto en v0.6: base Piedra.)*
20. El logotipo y el símbolo continúan abiertos. *(El sistema gráfico se definió en v0.6.)*
21. *(v0.2)* El carácter combina optimismo constructor (energía, juventud, ambición) como rasgo dominante con oficio (premium honesto), unidos por la cultura del hacer y del ingenio.
22. *(v0.3)* La idea central de la marca es **Ingenio**: ingenio bien terminado.
23. *(v0.3)* Rasgos: enérgica, ingeniosa, hacedora, optimista, honesta.
24. *(v0.3)* Más energía hacia afuera, más oficio hacia adentro.
25. *(v0.3)* La marca profesionaliza, no aparenta: nunca afirma una escala que no existe.
26. *(v0.6)* `.argy` es una compañía de productos tecnológicos en construcción: hoy desarrolla soluciones a medida, y los servicios descubren y financian los productos.
27. *(v0.6)* La comunicación distingue lo que se puede contratar hoy de lo que se está construyendo, sin fingir que la suite existe.
28. *(v0.6)* Los productos forman un ecosistema reconocible bajo `.argy`, con la forma `[producto].argy`.
29. *(v0.6)* Identidad visual: territorio Trayecto con trazo híbrido, base Piedra, Argy Blue con el Sol como acento, tipografía Bricolage Grotesque + Instrument Sans.
30. *(v0.6)* El sol firma, no presenta: una vez por página, nunca en el logotipo.
31. *(v0.8)* Una sola regla de marca para todo: el punto y las primeras letras. `.argy` y su símbolo ".a"; cada producto, `[producto].argy` y su ícono ".st", ".da"…
32. *(v0.8)* El punto llega último: en el logo, en el hero y en cada respuesta.

---

## 28. Backlog explícito de Brand Work

Los siguientes temas constituyen trabajo pendiente y no deben ser asumidos por ningún agente sin exploración previa.

- **Estrategia:** visión; categoría; modelo de negocio; propuesta de valor; diferenciación; promesa; ICP; verticales; arquitectura de productos; rol definitivo de IA.
- **Verbal:** misión definitiva; propósito definitivo; descriptor; tagline; elevator pitch; homepage messaging; tono de voz; vocabulario; CTAs; narrativa comercial.
- **Identidad visual:** logo; símbolo; wordmark (como sistema de namespace); dibujo final del sol; resolución del punto como destino; dirección de arte de imágenes; ilustración; patrones; iconografía. *(Tipografía, base, paleta, sistema gráfico y motion se definieron en v0.6.)*
- **Producto digital:** website; design system; componentes UI; design tokens; data visualization; responsive system; accesibilidad; motion UI.
- **Marca aplicada:** social; propuestas comerciales; presentación corporativa; documentación; avatar; favicon; app icon; email; GitHub; OpenGraph; tarjetas; firmas; templates.

---

## 29. Regla para futuros agentes

Cuando un agente trabaje sobre `.argy`, debe distinguir entre:

- **Canon** — Decisiones marcadas como DEFINIDO. No deben modificarse salvo instrucción explícita.
- **Dirección** — Decisiones marcadas como ENCAMINADO. Pueden utilizarse como punto de partida, pero deben cuestionarse y refinarse.
- **Espacio de diseño** — Decisiones marcadas como ABIERTO. No deben inventarse como si fueran reglas existentes.

El trabajo del agente deberá explorar alternativas, comparar trade-offs y proponer decisiones antes de incorporarlas al sistema de marca.

Las **observaciones** y **notas técnicas** marcadas como "no es decisión" son información de contexto, no reglas.

---

## 30. Próximo objetivo

### Desde v1.0

La marca tiene identidad visual, logo, identidad verbal y una web v1. Lo siguiente:

1. **Salir:** comprar `puntoargy.com` (y las versiones `.ar`), crear `hola@puntoargy.com`, publicar la web y reservar `@puntoargy` en redes.
2. **Legal:** cláusula de componentes reutilizables en los contratos; confirmar que el sol propio no traiga problemas al registrar la marca.
3. **Estrategia de producto:** elegir el primer producto (candidato: `data.argy`) y cerrar la regla de nombres.
4. **Marca aplicada:** dirección de arte de imágenes con IA, plantilla de propuesta comercial, perfiles en redes, íconos de interfaz y design system.

### Desde v0.6

La identidad visual está definida, salvo el logo y el símbolo. El replanteo del fundador cambia la base estratégica: `.argy` pasa de "empresa de desarrollo" a "compañía de productos que empieza con servicios". El orden de trabajo es:

| Etapa | Qué define | Por qué va en este orden |
|---|---|---|
| 4 · Estrategia | Categoría, propuesta de valor en dos horizontes, posicionamiento frente a alternativas, criterio de productización, conectar vs. reemplazar | Todo lo demás depende de esto |
| 5 · Arquitectura y nombres | Reglas del namespace, primeros nombres, el agente, dominio y handles | El logo tiene que funcionar como sistema de nombres |
| 6 · Logo y símbolo | `.argy` y `[producto].argy`, favicon, íconos de app, dibujo final del sol, el punto como destino | Necesita la arquitectura resuelta |
| 7 · Identidad verbal | Descriptor, tagline, tono, mensajes de la home | Necesita estrategia y nombres |
| 8 · Web v1 | Estructura "hoy / construyendo" y construcción | Es la primera herramienta de venta |

Después: dirección de arte de imágenes (con IA, según 20), iconografía, design system y aplicaciones.

### Objetivo anterior (v0.1–v0.5, cumplido)

La prioridad inmediata no es producir más assets.

La siguiente fase consiste en definir una dirección creativa de marca que traduzca la personalidad ya establecida en un sistema visual reconocible.

Debe explorarse especialmente cómo combinar: startup; premium; humana; expresiva; tecnológica; argentina de forma sutil; limpia; capaz de transmitir confianza empresarial.

Sin caer en: corporativo genérico; startup AI genérica; agencia de diseño; branding patriótico; estética excesivamente técnica.

Ese es el problema de diseño central de `.argy` en la próxima etapa.

---

## 31. Registro de cambios

### v1.1 — 2026-09-24
- **14.0** Regla anti-agencia 3 reformulada: "el espectáculo es la idea, no el estudio".
- **20** Dirección de arte de imágenes: bodegones del hilo (ENCAMINADO). Guía en `brand/imagenes/guia-de-imagenes.md`.
- **25** Web v2 con la dirección "El hilo" (ENCAMINADO).

### v1.0 — 2026-09-24
- **24 Identidad verbal** → DEFINIDO: descriptor "Software para empresas argentinas.", tagline "Del enredo al punto.", tono, reglas de escritura, vocabulario, mensajes clave, pitch, narrativa y llamados a la acción.
- **2** Escritura y pronunciación → DEFINIDO: se dice "punto argy".
- **26** Dominio → DEFINIDO: `puntoargy.com`, productos como rutas o módulos.
- **25** Web v1: estructura y sitio en `web/`.
- **30** Nuevo orden de trabajo.

### v0.9 — 2026-09-24
- **16** Archivos finales del logo generados en `brand/logo/`.
- **26** Dominio vuelve a ABIERTO: `argy.ar`, `argy.com`, `argy.app`, `argy.com.ar` y `argy.dev` están ocupados. En evaluación: `puntoargy.com` / `puntoargy.ar`, con productos como rutas o módulos en lugar de subdominios.

### v0.8 — 2026-09-24
- **16 Logotipo** → DEFINIDO: punto redondo, especificación, jerarquía "el producto manda".
- **17 Símbolo** → DEFINIDO: "punto y a"; regla de íconos de producto con códigos.
- **19.1** El punto como destino → DEFINIDO: es el punto del logo y la respuesta sale de él.
- **23** Animación del logo y del hero → DEFINIDO.
- **26** Códigos de íconos de producto → ENCAMINADO. **27** agrega principios 31–32.
- La referencia `brand/identidad-visual.html` incorpora el logo, el símbolo, los íconos y las animaciones.

### v0.7 — 2026-09-24
- **12** Estrategia de producto "conectar primero, reemplazar después" → DEFINIDO.
- **4** Principio de datos y componentes → DEFINIDO: nunca se usan datos de clientes; solo componentes despersonalizados. Criterio de productización queda abierto a propósito. Pendiente: cláusula contractual de componentes.
- **26** Dominio `argy.ar` con subdominios por producto y nombres coloquiales → ENCAMINADO.
- **3** Punto de partida real: primer proyecto freelance (tienda online + pedidos + stock); `data.argy` como candidato fuerte a primer producto.
- Se inicia la etapa 6 (logo y símbolo, adelantada a pedido del fundador): `brand/exploraciones/etapa-6-logo-simbolo.html`.

### v0.6 — 2026-09-24
- **Cierre de la identidad visual** (salvo logo y símbolo). Pasan a DEFINIDO: base Piedra, paleta completa con Sol como acento (15), tipografía Carácter con escala (18), territorio Trayecto y comportamientos de la línea (19.1), motion (23). Pasan a ENCAMINADO: Campo celeste para momentos de marca, el sol como firma de origen (19.1).
- **14.3 modificado por el fundador:** se incorporan el amarillo del sol y un sol propio como elemento ocasional, con reglas para mantener la referencia sutil.
- **Replanteo estratégico del fundador:** 3 (naturaleza), 4 (modelo → ENCAMINADO), 6 (visión → ENCAMINADO), 9 (público y su contexto real), 12 (dos horizontes), 13 (capa de IA), 26 (arquitectura: namespace → ENCAMINADO).
- **16** y **17**: el logo debe diseñarse como sistema de namespace; hipótesis del punto como unión y como respuesta.
- **27** agrega principios 26–30. **30** redefine el orden de trabajo.
- Referencia visual consolidada: `brand/identidad-visual.html`.

### v0.5 — 2026-09-24
- **19.1** Carácter del trazo **híbrido** → DEFINIDO. Comportamientos de la línea → ENCAMINADO. Punto grande como destino → ENCAMINADO con reservas (a re-imaginar junto con el símbolo).
- **23 Motion** → ENCAMINADO: principios, tokens y patrones validados en la etapa 2b.
- Se inicia la etapa 3: base clara/oscura, paleta y tipografía (`brand/exploraciones/etapa-3-paleta-tipografia.html`).
- El fundador anticipó un replanteo de la dirección general después de esta etapa.

### v0.4 — 2026-09-24
- **19.1** Territorio creativo **Trayecto** → ENCAMINADO, con elementos de La vuelta. Exploración: `brand/exploraciones/etapa-2-territorios.html`.
- **16** registra la preferencia por un wordmark tipográfico (no aprobado).
- Se inicia el desarrollo de Trayecto: `brand/exploraciones/etapa-2b-trayecto.html`.

### v0.3 — 2026-09-24
- **14.0** cierra la etapa 1 (personalidad). Pasan a DEFINIDO: idea central **Ingenio**, cinco rasgos con "es / no es", balance según contexto. Pasan a ENCAMINADO: reglas para no parecer agencia, honestidad de escala. Se agrega el manifiesto como referencia de tono (no copy aprobado).
- Ideas centrales evaluadas y no adoptadas: "Manos a la obra" (riesgo de leerse apurado/barato), "Hecho con ganas" (poco distintiva).
- **20** incorpora principio encaminado para imagery generada con IA.
- **27** agrega principios 22–25.
- Se inicia la etapa 2: territorio creativo y dirección visual.

### v0.2 — 2026-09-24
- **14.0 Carácter base → DEFINIDO.** Etapa 1 exploró cinco direcciones (Oficio, El punto, Mundo real, Socio directo, Optimismo constructor). El fundador eligió Optimismo constructor como dominante combinado con Oficio.
- **14.5** incorpora "premium honesto" al objetivo.
- **14.7** registra un nivel de expresividad alto, consecuencia de 14.0.
- **3** incorpora contexto actual: empresa unipersonal; la marca busca profesionalizar la presentación.
- **20** incorpora recurso disponible: generación de imágenes con IA, sin producción fotográfica propia.
- **2** y **15** incorporan observaciones y notas técnicas (no decisiones): lectura del nombre como dominio, "Argie"/"argy-bargy" en inglés británico, contraste de `#74ACDF`.
- **27** agrega el principio 21.
- Direcciones exploradas y no adoptadas como dominantes: El punto (candidata a gramática visual), Mundo real (candidata a capa de contenido), Socio directo (candidata a tono de voz). Quedan como insumo para etapas siguientes, no como decisiones.

### v0.1
- Documento inicial.
