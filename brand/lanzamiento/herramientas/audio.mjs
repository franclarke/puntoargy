// La punta · sonido. Todo sintetizado a partir de film/guion.js (los mismos eventos que mueven la imagen).
//   node herramientas/audio.mjs  →  salida/audio.wav (48 kHz, estéreo, 16 bits)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const G = await import(pathToFileURL(path.join(RAIZ, 'film/guion.js')).href);

const SR = 48000, N = Math.ceil(G.DURACION * SR);
const bus = () => [new Float32Array(N), new Float32Array(N)];
const diegetico = bus(), musica = bus(), envioSala = bus(), envioHall = bus();

// ---------- utilidades ----------
let semilla = 7;
const rnd = () => { semilla = (semilla * 16807) % 2147483647; return semilla / 2147483647; };
const blanco = () => rnd() * 2 - 1;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dB = x => Math.pow(10, x / 20);
const hz = nota => 440 * Math.pow(2, (nota - 69) / 12);
function paneo(p) { p = clamp(p, -1, 1); const a = (p + 1) * Math.PI / 4; return [Math.cos(a), Math.sin(a)]; }
function sumar(b, i, v, p = 0, envio = null, cantEnvio = 0) {
  if (i < 0 || i >= N) return;
  const [l, r] = paneo(p); b[0][i] += v * l; b[1][i] += v * r;
  if (envio) { envio[0][i] += v * l * cantEnvio; envio[1][i] += v * r * cantEnvio; }
}
// biquad (RBJ)
function biquad(tipo, f, q = .707) {
  const w = 2 * Math.PI * f / SR, c = Math.cos(w), s = Math.sin(w), al = s / (2 * q);
  let b0, b1, b2, a0, a1, a2;
  if (tipo === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
  else if (tipo === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
  else { b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; } // bp
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const f_ = x => { const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
  f_.set = nf => { const o = biquad(tipo, nf, q); Object.assign(f_, { _o: o }); };
  return f_;
}
// posición en pantalla → paneo
function panMundo(p, t) { const c = G.camara(t); const sx = (p[0] - c.c[0]) * c.z + 960; return clamp((sx / 1920) * 2 - 1, -1, 1) * .45; }
const posObj = id => { const o = G.OBJ[id]; return [o.cx, o.cy]; };

// ---------- aire de habitación ----------
{
  const lp = biquad('lp', 900), lp2 = biquad('lp', 2400);
  let rosa = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    rosa = rosa * .97 + blanco() * .03;
    let g = t < G.T.silencio ? 1 : t < G.T.silencio + .5 ? 0 : clamp((t - G.T.silencio - .5) / 1.2, 0, 1) * .8;
    g *= 1 + .26 * clamp((t - G.T.zumbido2) / (G.T.silencio - G.T.zumbido2), 0, 1) * (t < G.T.silencio ? 1 : 0);
    g *= t > G.T.aterriza ? Math.max(.6, 1 - (t - G.T.aterriza) / 2 * .4) : 1;
    g *= t > G.T.fin - 3 ? clamp((G.T.fin - 1.5 - t) / 1.5, 0, 1) : 1;
    const v = lp(lp2(rosa * 6)) * dB(-38) * g;
    diegetico[0][i] += v; diegetico[1][i] += v * .97 + lp(blanco()) * 0;
  }
}

// ---------- roce del hilo mientras la punta teje ----------
{
  const bp = biquad('bp', 1900, .8), bp2 = biquad('bp', 3100, 1.2);
  for (let i = 0; i < Math.floor(G.T.silencio * SR); i++) {
    const t = i / SR;
    const v = Math.abs(G.velPunta(t)), k = clamp(v / 2600, 0, 1.2);
    if (k < .01) { bp(0); bp2(0); continue; }
    const s = (bp(blanco()) * .7 + bp2(blanco()) * .4) * k * dB(-24);
    const p = G.hilo(Math.floor(t * 120) / 120).punta;
    sumar(diegetico, i, s, panMundo(p, t), envioSala, .25);
  }
}

// ---------- efectos puntuales ----------
function zumbido(t0, fuerza, pan) {
  const lp = biquad('lp', 1400);
  for (let i = 0; i < .82 * SR; i++) {
    const u = i / SR, on = (u < .36 || (u > .46 && u < .82)) ? 1 : 0;
    const a = on * Math.min(1, (u % .46) / .01) * Math.min(1, ((u < .36 ? .36 : .82) - u) / .02);
    const f = 172 + 4 * Math.sin(u * 60);
    const motor = Math.sin(2 * Math.PI * f * u) * .6 + Math.sign(Math.sin(2 * Math.PI * f * u)) * .25 + Math.sin(2 * Math.PI * 34 * u) * .15;
    const traq = blanco() * (.5 + .5 * Math.sin(2 * Math.PI * 34 * u));
    const v = lp(motor * .7 + traq * .25) * a * fuerza * dB(-17);
    sumar(diegetico, Math.floor((t0 + u) * SR), v, pan, envioSala, .3);
  }
}
function lapiz(t0, dur, pan) {
  const hp = biquad('hp', 2600), bp = biquad('bp', 4200, 1.5);
  for (let i = 0; i < dur * SR; i++) {
    const u = i / SR, saw = (u * 13) % 1, env = Math.pow(1 - saw, 2) * Math.min(1, u / .02) * Math.min(1, (dur - u) / .05);
    const v = (hp(blanco()) * .6 + bp(blanco()) * .5) * env * dB(-20);
    sumar(diegetico, Math.floor((t0 + u) * SR), v, pan, envioSala, .2);
  }
}
function papel(t0, fuerte, pan) {
  const bp = biquad('bp', 520, 1.1), hp = biquad('hp', 3000);
  for (let i = 0; i < .07 * SR; i++) {
    const u = i / SR, env = Math.exp(-u / .012);
    const v = (bp(blanco()) * 1.6 + hp(blanco()) * .3 * Math.exp(-u / .004)) * env * dB(fuerte ? -10 : -15);
    sumar(diegetico, Math.floor((t0 + u) * SR), v, pan, envioSala, .3);
  }
}
function tecla(t0, amarilla, pan) {
  const f = amarilla ? 3100 : 2400;
  for (let i = 0; i < .06 * SR; i++) {
    const u = i / SR;
    const v = (blanco() * Math.exp(-u / .0015) * .6 + Math.sin(2 * Math.PI * f * u) * Math.exp(-u / .012) * .5 + Math.sin(2 * Math.PI * 180 * u) * Math.exp(-u / .01) * .4) * dB(-14);
    sumar(diegetico, Math.floor((t0 + u) * SR), v, pan, envioSala, .3);
  }
}
function carton(t0, dur, pan) {
  const lp = biquad('lp', 700), bp = biquad('bp', 1500, .9);
  let fr = 0;
  for (let i = 0; i < dur * SR; i++) {
    const u = i / SR; if (rnd() < .004) fr = 1; fr *= .9993;
    const env = Math.min(1, u / .05) * Math.min(1, (dur - u) / .1);
    const v = (lp(blanco()) * 1.2 + bp(blanco()) * .4 * fr) * env * dB(-18);
    sumar(diegetico, Math.floor((t0 + u) * SR), v, pan, envioSala, .2);
  }
}
function ticket(t0, pan) {
  const bp = biquad('bp', 3400, .7);
  for (let i = 0; i < .32 * SR; i++) {
    const u = i / SR, env = Math.sin(Math.PI * u / .32) ** 2;
    sumar(diegetico, Math.floor((t0 + u) * SR), bp(blanco()) * env * dB(-19), pan, envioSala, .3);
  }
}
function enganche(t0, pan, fuerza = 1) {
  const bp = biquad('bp', 1700, 3);
  for (let i = 0; i < .16 * SR; i++) {
    const u = i / SR;
    const v = (bp(blanco()) * Math.exp(-u / .01) * 1.4 + Math.sin(2 * Math.PI * 140 * u) * Math.exp(-u / .03) * .7) * dB(-10) * fuerza;
    sumar(musica, Math.floor((t0 + u) * SR), v, pan, envioSala, .5);
  }
}

// ---------- música ----------
function karplus(t0, f, gan, pan, dur = 3.5) {
  const n = Math.round(SR / f), buf = new Float32Array(n);
  for (let k = 0; k < n; k++) buf[k] = blanco();
  let idx = 0, prev = 0;
  const decae = Math.pow(.001, 1 / (dur * f));
  for (let i = 0; i < dur * SR; i++) {
    const v = buf[idx], nv = (v + prev) * .5 * decae; prev = v; buf[idx] = nv; idx = (idx + 1) % n;
    sumar(musica, Math.floor(t0 * SR) + i, v * gan, pan, envioHall, .45);
  }
}
function nota(t0, f, gan, dur, pan = 0, ataque = .005, envio = .6) {
  for (let i = 0; i < dur * SR; i++) {
    const u = i / SR, env = Math.min(1, u / ataque) * Math.exp(-u / (dur / 4));
    const v = (Math.sin(2 * Math.PI * f * u) + .18 * Math.sin(4 * Math.PI * f * u) + .05 * Math.sin(6 * Math.PI * f * u)) * env * gan;
    sumar(musica, Math.floor((t0 + u) * SR) , v, pan, envioHall, envio);
  }
}
function acorde(t0, notas, gan, dur) {
  notas.forEach((m, k) => {
    const f = hz(m), lp = biquad('lp', 1800);
    for (let i = 0; i < dur * SR; i++) {
      const u = i / SR, env = Math.min(1, u / .04) * Math.exp(-u / (dur / 3.2));
      let v = 0;
      for (const det of [-.0025, 0, .0025]) { const ph = (f * (1 + det) * u) % 1; v += (ph * 2 - 1) * .3 + Math.sin(2 * Math.PI * f * (1 + det) * u) * .5; }
      sumar(musica, Math.floor((t0 + u) * SR), lp(v) * env * gan / notas.length, (k / (notas.length - 1) - .5) * .5, envioHall, .5);
    }
  });
}

// ---------- programar eventos ----------
for (const e of G.EVENTOS) {
  const panObj = e.obj ? panMundo(posObj(e.obj), e.t) : 0;
  if (e.tipo === 'zumbido') zumbido(e.t, e.suave ? .55 : e.final ? .8 : 1, panMundo(posObj('celular'), e.t));
  if (e.tipo === 'lapiz') lapiz(e.t, e.dur || .4, panMundo(posObj('cuaderno'), e.t));
  if (e.tipo === 'papel') papel(e.t, e.fuerte, panMundo(posObj('planilla'), e.t));
  if (e.tipo === 'tecla') tecla(e.t, e.amarilla, panMundo(posObj('calculadora'), e.t));
  if (e.tipo === 'carton') carton(e.t, .45, panMundo(posObj('caja'), e.t));
  if (e.tipo === 'roce') carton(e.t, .25, panMundo(posObj('celular'), e.t));
  if (e.tipo === 'ticket') ticket(e.t, panMundo(posObj('calculadora'), e.t));
  if (e.tipo === 'enganche') enganche(e.t, panObj, 1);
  if (e.tipo === 'pila') ticket(e.t, panMundo([-400, 600], e.t));
}

// Masa del enredo (18 → 24.0): ruido marrón que se abre
{
  let marron = 0;
  const lp = biquad('lp', 200);
  const m0 = G.T.silencio - 6.4;
  for (let i = Math.floor(m0 * SR); i < G.T.silencio * SR; i++) {
    const t = i / SR, k = clamp((t - m0) / (G.T.silencio - m0), 0, 1);
    marron = (marron + blanco() * .02) * .998;
    const f = 200 + 2200 * k * k;
    if (i % 64 === 0) Object.assign(lp, {}); // (filtro fijo; el brillo lo da la mezcla con ruido blanco)
    const v = (lp(marron * 8) * (1 - k * .5) + blanco() * .05 * k * k) * k * k * dB(-13) * (f / 2400 + .3);
    sumar(diegetico, i, v, Math.sin(t * 1.3) * .2, envioSala, .2);
  }
}

// Silencio digital: todo lo diegético se corta en seco en 24.0 (sin colas)
for (let i = Math.floor(G.T.silencio * SR); i < Math.floor((G.T.silencio + .5) * SR); i++) { diegetico[0][i] = diegetico[1][i] = 0; envioSala[0][i] = envioSala[1][i] = 0; }

// La nota del descubrimiento
nota(G.T.punto, hz(81), dB(-16), 4.5, -.1, .004, .7);

// El tirón: cuerda tensa que sube con la tensión + una cuerda pulsada por cada rulo que se suelta
{
  const t0 = G.T.tiron[0], t1 = G.T.aterriza; // la cuerda deja de sonar cuando el hilo queda tenso
  const lp = biquad('lp', 600);
  let fase = 0;
  for (let i = Math.floor(t0 * SR); i < Math.floor((t1 + .05) * SR); i++) {
    const t = i / SR, u = (t - t0) / (t1 - t0);
    const f = hz(38) * Math.pow(2, (7 / 12) * u);
    fase += f / SR;
    const saw = (fase % 1) * 2 - 1;
    const env = Math.min(1, (t - t0) / .08) * (.55 + .45 * Math.sin(Math.PI * u)) * Math.min(1, (t1 + .05 - t) / .05);
    const v = lp(saw) * env * dB(-14);
    sumar(musica, i, v, 0, envioHall, .25);
  }
  // cuerdas pulsadas siguiendo al frente
  const escala = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86];
  const L = G.L, paso = L / 30;
  let ultimo = L, k = 0;
  for (let t = t0; t < t1; t += 1 / 480) {
    const a = G.frente(t);
    while (ultimo - a >= paso) {
      ultimo -= paso;
      const prog = 1 - ultimo / L;
      const m = escala[Math.min(escala.length - 1, Math.floor(prog * escala.length))];
      const p = G.TEJIDO.en(ultimo);
      karplus(t, hz(m), dB(-10.5) * (.7 + .3 * rnd()), panMundo(p, t), 3.2);
      k++;
    }
  }
  console.log('cuerdas pulsadas:', k);
}

// Aterrizaje: golpe + acorde
{
  const t0 = G.T.aterriza;
  for (let i = 0; i < .22 * SR; i++) {
    const u = i / SR, f = 90 - 35 * (u / .22);
    const v = Math.sin(2 * Math.PI * f * u) * Math.exp(-u / .07) * dB(-8) + blanco() * Math.exp(-u / .01) * dB(-24);
    sumar(musica, Math.floor((t0 + u) * SR), v, .1, envioHall, .2);
  }
  karplus(t0, hz(45), dB(-12), .1, 4);
  acorde(t0, [38, 45, 50, 54, 64, 69], dB(-7), 8.5);
}

// Señal que viaja sola
{
  const [a, b] = G.T.senal;
  let fase = 0;
  for (let i = Math.floor(a * SR); i < Math.floor((b + .25) * SR); i++) {
    const t = i / SR, u = clamp((t - a) / (b - a), 0, 1);
    const f = hz(69) * Math.pow(2, u);
    fase += f / SR;
    const env = Math.min(1, (t - a) / .05) * (t > b ? Math.exp(-(t - b) / .06) : 1) * (.5 + .5 * u);
    const s = G.senal(Math.min(t, b));
    const p = s ? G.RUTA.linea.en(s.u) : G.D;
    sumar(musica, i, Math.sin(2 * Math.PI * fase) * env * dB(-24), panMundo(p, t), envioHall, .5);
  }
  nota(b, hz(74), dB(-20), 2.5, .2, .01, .6);
}

// Soplido del logo
{
  const bp = biquad('bp', 2000, .6);
  const [a, b] = G.T.logo;
  for (let i = Math.floor(a * SR); i < Math.floor((b + .2) * SR); i++) {
    const t = i / SR, u = clamp((t - a) / (b - a + .2), 0, 1);
    sumar(musica, i, bp(blanco()) * Math.sin(Math.PI * u) * dB(-24), -.2 + .5 * u, envioHall, .3);
  }
}

// ---------- reverbs (Freeverb simplificado) ----------
function reverb(entrada, tamaño, amort, mezcla) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map(n => Math.round(n * tamaño * SR / 44100));
  const alls = [556, 441, 341, 225].map(n => Math.round(n * SR / 44100));
  const out = bus();
  [0, 1].forEach(ch => {
    const sp = ch ? 23 : 0;
    const cb = combs.map(n => ({ b: new Float32Array(n + sp), i: 0, f: 0 }));
    const ab = alls.map(n => ({ b: new Float32Array(n + sp), i: 0 }));
    const fb = .84;
    for (let i = 0; i < N; i++) {
      const x = entrada[ch][i] * .015;
      let y = 0;
      for (const c of cb) { const o = c.b[c.i]; c.f = o * (1 - amort) + c.f * amort; c.b[c.i] = x + c.f * fb; c.i = (c.i + 1) % c.b.length; y += o; }
      for (const a of ab) { const o = a.b[a.i]; const v = -y + o; a.b[a.i] = y + o * .5; a.i = (a.i + 1) % a.b.length; y = v; }
      out[ch][i] = y * mezcla;
    }
  });
  return out;
}
const sala = reverb(envioSala, .45, .45, 1.1);
const hall = reverb(envioHall, 1.25, .3, 1.4);

// ---------- mezcla ----------
const mix = bus();
for (let ch = 0; ch < 2; ch++) for (let i = 0; i < N; i++) {
  const t = i / SR;
  let v = diegetico[ch][i] + musica[ch][i] + sala[ch][i] + hall[ch][i];
  if (t >= G.T.silencio && t < G.T.silencio + .5) v = musica[ch][i] + hall[ch][i]; // (vacío: no hay música todavía)
  if (t > G.T.fin - 1.5) v *= Math.max(0, 1 - (t - (G.T.fin - 1.5)) / .9);
  mix[ch][i] = v;
}
// Limitador con anticipación (5 ms) y liberación de 120 ms: los golpes no deciden el volumen de todo el film
let pico = 0; for (let ch = 0; ch < 2; ch++) for (let i = 0; i < N; i++) pico = Math.max(pico, Math.abs(mix[ch][i]));
const pre = dB(-1.5) / pico * dB(+6), techo = dB(-1.5);
{
  const ant = Math.round(.005 * SR), rel = Math.exp(-1 / (.12 * SR));
  const nec = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = Math.max(Math.abs(mix[0][i]), Math.abs(mix[1][i])) * pre; nec[i] = a > techo ? techo / a : 1; }
  const minv = new Float32Array(N); // mínimo en la ventana [i, i + ant]
  const dq = []; let cabeza = 0;
  for (let i = N - 1; i >= 0; i--) {
    while (dq.length > cabeza && nec[dq[dq.length - 1]] >= nec[i]) dq.pop();
    dq.push(i);
    while (dq[cabeza] > i + ant) cabeza++;
    minv[i] = nec[dq[cabeza]];
  }
  let gr = 1;
  for (let i = 0; i < N; i++) { const obj = minv[i]; gr = obj < gr ? obj : obj + (gr - obj) * rel; mix[0][i] *= pre * gr; mix[1][i] *= pre * gr; }
}
const g = 1;
console.log('pico', pico.toFixed(3), '→ ganancia', g.toFixed(2));

// WAV 16 bits
const datos = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) for (let ch = 0; ch < 2; ch++) {
  const v = clamp(mix[ch][i] * g + (rnd() - rnd()) / 65536, -1, 1);
  datos.writeInt16LE(Math.round(v * 32767), i * 4 + ch * 2);
}
const cab = Buffer.alloc(44);
cab.write('RIFF', 0); cab.writeUInt32LE(36 + datos.length, 4); cab.write('WAVE', 8); cab.write('fmt ', 12);
cab.writeUInt32LE(16, 16); cab.writeUInt16LE(1, 20); cab.writeUInt16LE(2, 22); cab.writeUInt32LE(SR, 24); cab.writeUInt32LE(SR * 4, 28);
cab.writeUInt16LE(4, 32); cab.writeUInt16LE(16, 34); cab.write('data', 36); cab.writeUInt32LE(datos.length, 40);
fs.mkdirSync(path.join(RAIZ, 'salida'), { recursive: true });
fs.writeFileSync(path.join(RAIZ, 'salida/audio.wav'), Buffer.concat([cab, datos]));
console.log('salida/audio.wav');
