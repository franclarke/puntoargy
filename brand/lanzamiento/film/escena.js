// La punta · imagen. Dibuja un cuadro cualquiera en un canvas 2D a partir de guion.js.
// Vocabulario visual portado de brand/imagenes/generador/ilustraciones.js (bodegones del hilo).

import * as G from './guion.js';
import { clamp, lerp, invLerp, decidida, azar, dist, Linea } from './util.js';
import { LOGO_LETRAS, LOGO_PUNTO } from './logo.js';

// ---------- Color ----------
const hex2rgb = h => [0, 2, 4].map(i => parseInt(h.replace('#', '').substr(i, 2), 16));
const rgb2hex = c => '#' + c.map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => v + (B[i] - v) * t)); };
const claro = (c, t) => mix(c, '#FFFFFF', t), oscuro = (c, t) => mix(c, '#2A2118', t);
const rgba = (h, a) => { const [r, g, b] = hex2rgb(h); return `rgba(${r},${g},${b},${a})`; };
const TONO = { tinta: '#2A2927', piedra: '#E7E1D6', arena: '#D8CCB6', papel: '#FAF8F2', gris: '#C9C2B6', kraft: '#C8A57A', sol: '#F6B40E' };
const SOMBRA = G.COLOR.sombra;

// ---------- Sprites de objetos (se dibujan una vez) ----------
const S = 2;          // píxeles por unidad de mundo en el sprite
const PAD = 90;       // margen para sombras (unidades)

function lienzo(w, h) { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); }
function gradDiag(ctx, x, y, w, h, c) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, claro(c, .16)); g.addColorStop(.55, c); g.addColorStop(1, oscuro(c, .07)); return g;
}
function gradV(ctx, x, y, h, c) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, claro(c, .16)); g.addColorStop(.55, c); g.addColorStop(1, oscuro(c, .07)); return g;
}
// sombra doble de un bloque: ambiente (larga, suave) + contacto (corta)
function sombraBloque(ctx, x, y, w, h, r, fuerza = 1) {
  ctx.save();
  ctx.filter = 'blur(30px)'; ctx.fillStyle = rgba(SOMBRA, .15 * fuerza); rr(ctx, x + 26, y + 38, w, h, r); ctx.fill();
  ctx.filter = 'blur(6px)'; ctx.fillStyle = rgba(SOMBRA, .24 * fuerza); rr(ctx, x + 7, y + 12, w, h, r); ctx.fill();
  ctx.restore();
}
function bloque(ctx, { x, y, w, h, d, r, color, sombra = 1 }, detalle) {
  if (sombra) sombraBloque(ctx, x, y, w, h + d, r, sombra);
  const frente = oscuro(color, .2);
  ctx.fillStyle = gradV(ctx, x, y + d * .2, h + d * .8, frente); rr(ctx, x, y + d * .2, w, h + d * .8, r); ctx.fill();
  ctx.fillStyle = gradDiag(ctx, x, y, w, h, color); rr(ctx, x, y, w, h, r); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 3; rr(ctx, x + 2, y + 2, w - 4, h - 4, r - 2); ctx.stroke();
  if (detalle) detalle(ctx);
}
const DETALLES = {
  celular(ctx, x, y, w, h) {
    ctx.fillStyle = '#3C3B38'; rr(ctx, x + 14, y + 14, w - 28, h - 28, 26); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.05)'; rr(ctx, x + 14, y + 14, w - 28, (h - 28) * .45, 26); ctx.fill();
    ctx.fillStyle = '#1E1D1B'; rr(ctx, x + w / 2 - 28, y + 26, 56, 12, 6); ctx.fill();
  },
  planilla(ctx, x, y, w, h) {
    const filas = 9, cols = 4;
    ctx.fillStyle = '#E9E5DB'; ctx.fillRect(x + 30, y + 40, w - 60, (h - 70) / filas);
    ctx.lineWidth = 2;
    for (let i = 1; i < filas; i++) { ctx.strokeStyle = '#D9D4C8'; ctx.beginPath(); ctx.moveTo(x + 30, y + 40 + i * (h - 70) / filas); ctx.lineTo(x + w - 30, y + 40 + i * (h - 70) / filas); ctx.stroke(); }
    for (let j = 1; j < cols; j++) { ctx.strokeStyle = '#E2DDD2'; ctx.beginPath(); ctx.moveTo(x + 30 + j * (w - 60) / cols, y + 40); ctx.lineTo(x + 30 + j * (w - 60) / cols, y + h - 30); ctx.stroke(); }
  },
  cuaderno(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(59,57,54,.9)'; ctx.fillRect(x + w - 64, y, 20, h);
    ctx.fillStyle = '#4A4744';
    for (let i = 0; i < 10; i++) { rr(ctx, x + 30 + i * (w - 60) / 9 - 6, y - 11, 12, 30, 6); ctx.fill(); }
  },
  calculadora(ctx, x, y, w, h) {
    ctx.fillStyle = '#5F6B66'; rr(ctx, x + 26, y + 26, w - 52, 74, 14); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.08)'; rr(ctx, x + 26, y + 26, w - 52, 28, 14); ctx.fill();
    for (const k of teclasCalc(x, y, w, h)) {
      ctx.fillStyle = k.sol ? '#C98F06' : '#A89F92'; rr(ctx, k.x, k.y + 5, k.w, k.h, 11); ctx.fill();
      ctx.fillStyle = k.sol ? TONO.sol : '#EFEAE1'; rr(ctx, k.x, k.y, k.w, k.h, 11); ctx.fill();
    }
  },
  caja(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(224,199,159,.85)'; ctx.fillRect(x + w / 2 - 30, y, 60, h);
    ctx.strokeStyle = 'rgba(169,133,86,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 16, y + h / 2); ctx.lineTo(x + w - 16, y + h / 2); ctx.stroke();
  },
  ticket(ctx, x, y, w, h) {
    ctx.strokeStyle = '#DCD6CA'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < Math.floor((h - 30) / 24); i++) { ctx.beginPath(); ctx.moveTo(x + 16, y + 26 + i * 24); ctx.lineTo(x + w - (i % 2 ? 36 : 16), y + 26 + i * 24); ctx.stroke(); }
  }
};
function teclasCalc(x, y, w, h) {
  const cols = 4, filas = 4, bw = (w - 52 - (cols - 1) * 12) / cols, bh = (h - 140 - (filas - 1) * 12) / filas, out = [];
  for (let i = 0; i < filas; i++) for (let j = 0; j < cols; j++) out.push({ x: x + 26 + j * (bw + 12), y: y + 118 + i * (bh + 12), w: bw, h: bh, sol: i === 3 && j === 3 });
  return out;
}
const COLOR_OBJ = { celular: TONO.tinta, planilla: TONO.papel, cuaderno: TONO.arena, calculadora: TONO.gris, caja: TONO.kraft, ticket: TONO.papel };
const SOMBRA_OBJ = { planilla: .7, ticket: .55 };

function spriteObjeto(o) {
  const c = lienzo((o.w + PAD * 2) * S, (o.h + o.d + PAD * 2) * S), ctx = c.getContext('2d');
  ctx.scale(S, S); ctx.translate(PAD, PAD);
  bloque(ctx, { x: 0, y: 0, w: o.w, h: o.h, d: o.d, r: o.r, color: COLOR_OBJ[o.tipo], sombra: SOMBRA_OBJ[o.tipo] ?? 1 },
    k => DETALLES[o.tipo](k, 0, 0, o.w, o.h));
  return c;
}
const TICKET = { w: 150, h: 110, d: 3, r: 4, tipo: 'ticket' };

// ---------- Textura de la mesa (en el mundo) ----------
function texturaMesa() {
  const n = 256, c = lienzo(n, n), ctx = c.getContext('2d'), img = ctx.createImageData(n, n), r = azar(3);
  for (let i = 0; i < n * n; i++) { const v = r(); img.data[i * 4] = 90; img.data[i * 4 + 1] = 77; img.data[i * 4 + 2] = 60; img.data[i * 4 + 3] = Math.round(v * v * 26); }
  ctx.putImageData(img, 0, 0); return c;
}

// ---------- Fuentes ----------
export const FUENTES = [
  ['BG700', 'fuentes/bricolage-700.woff2', { weight: '700' }],
  ['BG800', 'fuentes/bricolage-800.woff2', { weight: '800' }],
  ['IS500', 'fuentes/instrument-sans-500.woff2', { weight: '500' }],
  ['ISerif', 'fuentes/instrument-serif-italic.woff2', { style: 'italic' }]
];

export function crearEscena(canvas) {
  const W = G.ANCHO, H = G.ALTO;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const sprites = Object.fromEntries(G.OBJETOS.map(o => [o.id, spriteObjeto(o)]));
  const spriteTicket = spriteObjeto(TICKET);
  const capaSombra = lienzo(W, H), cs = capaSombra.getContext('2d');
  const patron = ctx.createPattern(texturaMesa(), 'repeat');
  const letras = new Path2D(LOGO_LETRAS);

  let cam = { c: [0, 0], z: 1 };
  const aPantalla = p => [(p[0] - cam.c[0]) * cam.z + W / 2, (p[1] - cam.c[1]) * cam.z + H / 2];
  function mundo(k) { k.setTransform(cam.z, 0, 0, cam.z, W / 2 - cam.c[0] * cam.z, H / 2 - cam.c[1] * cam.z); }

  // ---------- Mesa ----------
  function mesa() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = G.COLOR.piedra; ctx.fillRect(0, 0, W, H);
    mundo(ctx);
    // luz de la ventana, arriba a la izquierda (fija en el mundo)
    const g = ctx.createRadialGradient(-1900, -1100, 0, -1900, -1100, 3600);
    g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.6, 'rgba(255,255,255,0)');
    const x0 = cam.c[0] - W / 2 / cam.z, y0 = cam.c[1] - H / 2 / cam.z, ww = W / cam.z, hh = H / cam.z;
    ctx.fillStyle = g; ctx.fillRect(x0, y0, ww, hh);
    ctx.save(); ctx.scale(1.4, 1.4); ctx.fillStyle = patron; ctx.globalAlpha = .55; ctx.fillRect(x0 / 1.4, y0 / 1.4, ww / 1.4, hh / 1.4); ctx.restore();
  }

  // ---------- Objetos ----------
  function objeto(o, t) {
    const pose = G.poseObjeto(o, t);
    let jx = 0, jy = 0;
    if (pose.vib) { jx = Math.sin(t * 2 * Math.PI * 43) * 2.6 * pose.vib; jy = Math.cos(t * 2 * Math.PI * 37) * 1.8 * pose.vib; }
    const cx = o.cx + pose.dx + jx, cy = o.cy + pose.dy + jy;
    mundo(ctx);
    ctx.translate(cx, cy); ctx.rotate(pose.rot); ctx.translate(-o.w / 2, -o.h / 2);
    ctx.drawImage(sprites[o.id], -PAD, -PAD, sprites[o.id].width / S, sprites[o.id].height / S);
    if (o.tipo === 'calculadora') {
      const k = G.teclaApretada(t);
      if (k >= 0) {
        const tk = teclasCalc(0, 0, o.w, o.h)[k];
        ctx.fillStyle = tk.sol ? '#C98F06' : '#A89F92'; rr(ctx, tk.x - 1, tk.y - 1, tk.w + 2, tk.h + 7, 11); ctx.fill();
        ctx.fillStyle = tk.sol ? '#E0A40C' : '#E2DCD1'; rr(ctx, tk.x, tk.y + 4, tk.w, tk.h, 11); ctx.fill();
      }
    }
  }
  function tickets(t) {
    G.TICKETS.forEach((tk, k) => {
      const p = G.poseTicket(k, t);
      if (!p.visible) return;
      mundo(ctx);
      ctx.translate(p.x + tk.w / 2, p.y + tk.h / 2); ctx.rotate(p.rot); ctx.translate(-tk.w / 2, -tk.h / 2);
      ctx.drawImage(spriteTicket, -PAD, -PAD, spriteTicket.width / S, spriteTicket.height / S);
    });
  }

  // ---------- Hilo ----------
  function trazar(k, pts, dx = 0, dy = 0) {
    k.beginPath(); k.moveTo(pts[0][0] + dx, pts[0][1] + dy);
    for (let i = 1; i < pts.length; i++) k.lineTo(pts[i][0] + dx, pts[i][1] + dy);
  }
  // cordón con volumen (contorno, cuerpo desplazado hacia la luz, brillo)
  function cordon(pts, w, base, alfa = 1, plano = 0) {
    if (pts.length < 2) return;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = alfa;
    ctx.strokeStyle = mix(oscuro(base, .22), base, plano); ctx.lineWidth = w; trazar(ctx, pts); ctx.stroke();
    ctx.strokeStyle = base; ctx.lineWidth = w * .74; trazar(ctx, pts, -w * .08, -w * .1); ctx.stroke();
    ctx.strokeStyle = rgba(claro(base, .45), .85 * (1 - plano)); ctx.lineWidth = w * .2; trazar(ctx, pts, -w * .2, -w * .24); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function sombraCordon(pts, w, dx, dy, alfa) {
    if (pts.length < 2) return;
    mundo(cs); cs.lineCap = 'round'; cs.lineJoin = 'round';
    cs.strokeStyle = rgba(SOMBRA, alfa); cs.lineWidth = w + 3; trazar(cs, pts, dx, dy); cs.stroke();
  }
  function volcarSombra(blurPx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = `blur(${blurPx.toFixed(2)}px)`; ctx.drawImage(capaSombra, 0, 0); ctx.filter = 'none';
    cs.setTransform(1, 0, 0, 1, 0, 0); cs.clearRect(0, 0, W, H);
  }

  // Rayas de torsión sobre el hilo tenso: se mueven con el material
  function rayas(pts, material0, w, alfa = 1) {
    if (alfa <= 0) return;
    const lin = new Linea(pts), paso = 26;
    const primera = Math.ceil(material0 / paso) * paso;
    ctx.strokeStyle = rgba(oscuro(G.COLOR.celeste, .35), .32 * alfa); ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    for (let m = primera; m - material0 < lin.largo; m += paso) {
      const s = m - material0; if (s < 30) continue;
      const p = lin.en(s), d = lin.dir(s), n = [-d[1], d[0]];
      const a = w * .42;
      ctx.beginPath(); ctx.moveTo(p[0] - n[0] * a - d[0] * 5, p[1] - n[1] * a - d[1] * 5); ctx.lineTo(p[0] + n[0] * a + d[0] * 5, p[1] + n[1] * a + d[1] * 5); ctx.stroke();
    }
  }

  function hiloGris(pts) {
    sombraCordon(pts, G.G_HILO, 3, 5, .30);
    volcarSombra(2.2 * cam.z + .6);
    mundo(ctx); cordon(pts, G.G_HILO, G.COLOR.hilo);
  }

  function hiloTenso(h, t) {
    const pts = h.tenso;
    // transición gris → celeste en los primeros 70 unidades desde el frente
    const lin = new Linea(pts);
    const zona = Math.min(70, lin.largo);
    // sombra (hilo levantado: más lejos, más difusa)
    const plano = G.estadoPunto(t).plano;
    sombraCordon(pts, G.G_LINEA, 9 * (1 - plano) + 2, 15 * (1 - plano) + 3, .26 * (1 - .6 * plano));
    volcarSombra(5 * cam.z + 1);
    mundo(ctx);
    // barrido con desenfoque de movimiento del tramo frente→T0
    const sub = 9, dt = 1 / G.FPS;
    for (let i = 0; i < sub; i++) {
      const ti = t - dt * .5 + dt * i / (sub - 1);
      const F = G.TEJIDO.en(G.frente(ti));
      ctx.globalAlpha = 1 / sub * 1.8;
      ctx.strokeStyle = G.COLOR.celeste; ctx.lineWidth = G.G_LINEA * .8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(F[0], F[1]); ctx.lineTo(G.T0[0], G.T0[1]); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // cordón nítido desde T0 (con el frente actual)
    cordon(pts, G.G_LINEA, G.COLOR.celeste, 1, plano);
    // punta de transición gris en el frente
    const trans = lin.tramo(0, zona);
    cordon(trans, lerp(G.G_HILO, G.G_LINEA, .5), mix(G.COLOR.hilo, G.COLOR.celeste, .45));
    rayas(pts, h.material0, G.G_LINEA, 1 - plano);
  }

  // ---------- Punta y punto ----------
  function punto(pos, t, h) {
    const e = G.estadoPunto(t);
    mundo(ctx);
    if (e.r < .2) return;
    const r = e.r * (1 + e.alto * .6);
    const col = G.COLOR.celeste;
    // sombras: se separan con la altura
    const sep = 1 + e.alto * 6;
    ctx.save();
    ctx.filter = `blur(${(10 + e.alto * 60) * cam.z}px)`; ctx.fillStyle = rgba(SOMBRA, .26 * (1 - e.plano * .5));
    ctx.beginPath(); ctx.ellipse(pos[0] + e.r * .35 * sep, pos[1] + e.r * .9 * sep, e.r * 1.05, e.r * .42, 0, 0, Math.PI * 2); ctx.fill();
    ctx.filter = `blur(${4 * cam.z}px)`; ctx.fillStyle = rgba(SOMBRA, .32 * (1 - e.alto * 4) * (1 - e.plano * .4));
    ctx.beginPath(); ctx.ellipse(pos[0] + e.r * .12, pos[1] + e.r * .8, e.r * .72, e.r * .2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    mundo(ctx);
    // cuerpo: esfera mate → punto plano del logo
    const g = ctx.createRadialGradient(pos[0] - r * .34, pos[1] - r * .34, 0, pos[0] - r * .34, pos[1] - r * .34, r * 1.75);
    g.addColorStop(0, mix(claro(col, .5), col, e.plano)); g.addColorStop(.45, col); g.addColorStop(1, mix(oscuro(col, .25), col, e.plano));
    ctx.fillStyle = e.celeste < 1 ? mix(G.COLOR.hilo, col, e.celeste) : g;
    ctx.beginPath(); ctx.arc(pos[0], pos[1], r, 0, Math.PI * 2); ctx.fill();
    if (e.plano < 1 && r > 12) {
      ctx.save(); ctx.filter = `blur(${r * .12 * cam.z}px)`; ctx.fillStyle = `rgba(255,255,255,${.4 * (1 - e.plano)})`;
      ctx.beginPath(); ctx.ellipse(pos[0] - r * .32, pos[1] - r * .38, r * .22, r * .14, -.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }

  // ---------- Señal ----------
  function senal(t) {
    const s = G.senal(t); if (!s) return;
    mundo(ctx);
    const L = G.RUTA.linea, largo = 240;
    // un engrosamiento claro que recorre la ruta: la información viaja sola
    ctx.save(); ctx.filter = `blur(${(6 * cam.z).toFixed(1)}px)`;
    for (let i = 0; i < 24; i++) {
      const k = i / 23, u = s.u - largo * (1 - k), bump = Math.pow(Math.sin(Math.PI * k * .5 + Math.PI * .5 * k), 2) * k;
      const p = L.en(u);
      ctx.fillStyle = rgba('#FFFFFF', .35 * bump * s.fuerza);
      ctx.beginPath(); ctx.arc(p[0], p[1], G.G_LINEA * (.9 + .6 * bump), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    for (let i = 0; i < 24; i++) {
      const k = i / 23, u = s.u - largo * (1 - k), bump = k * k;
      const p = L.en(u);
      ctx.fillStyle = rgba(claro(G.COLOR.celeste, .6), .8 * bump * s.fuerza);
      ctx.beginPath(); ctx.arc(p[0] - 1.5, p[1] - 2, G.G_LINEA * (.5 + .28 * bump), 0, Math.PI * 2); ctx.fill();
    }
  }

  // ---------- Logo ----------
  function logo(t) {
    const k = decidida(invLerp(G.T.logo[0], G.T.logo[1], t));
    if (k <= 0) return;
    const esc = G.R_PUNTO / LOGO_PUNTO.r;
    mundo(ctx);
    ctx.translate(G.D[0] - LOGO_PUNTO.cx * esc, G.D[1] - LOGO_PUNTO.cy * esc); ctx.scale(esc, esc);
    const x0 = 22, x1 = 212;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -80, (x1 - x0) * k, 120); ctx.clip();
    ctx.fillStyle = G.COLOR.tinta; ctx.fill(letras); ctx.restore();
  }

  // ---------- Texto en pantalla ----------
  function textoPantalla(tx, t) {
    const entra = decidida(invLerp(tx.entra[0], tx.entra[1], t)), sale = decidida(invLerp(tx.sale[0], tx.sale[1], t));
    if (entra <= 0 || sale >= 1) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const px = 76, x = tx.x, y = tx.y;
    ctx.font = `700 ${px}px BG700`; ctx.letterSpacing = `${(-.035 * px).toFixed(2)}px`; ctx.textBaseline = 'alphabetic';
    const ancho = ctx.measureText(tx.texto).width;
    const rPunto = px * .1, xPunto = x + ancho + px * .04 + rPunto;
    const total = (tx.puntoCeleste ? xPunto + rPunto : x + ancho) - x + 8;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 10 + total * sale, 0, total * (entra - sale) + 20, H); ctx.clip();
    ctx.fillStyle = G.COLOR.tinta; ctx.fillText(tx.texto, x, y);
    if (tx.puntoCeleste && t >= tx.puntoCeleste) {
      const k = decidida(invLerp(tx.puntoCeleste, tx.puntoCeleste + .3, t));
      ctx.fillStyle = G.COLOR.celeste; ctx.beginPath(); ctx.arc(xPunto, y - rPunto, rPunto * k, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function cierre(t) {
    const kt = decidida(invLerp(G.T.tagline[0], G.T.tagline[1], t));
    const ku = decidida(invLerp(G.T.url[0], G.T.url[1], t));
    if (kt <= 0) return;
    // alineado con la «a» del logo, debajo del descendente
    const esc = G.R_PUNTO / LOGO_PUNTO.r;
    const aIzq = aPantalla([G.D[0] + (25.7 - LOGO_PUNTO.cx) * esc, G.D[1] - LOGO_PUNTO.cy * esc + 16 * esc]);
    const px = 62, x = aIzq[0], y = aIzq[1] + 112;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.textBaseline = 'alphabetic';
    ctx.font = `700 ${px}px BG700`; ctx.letterSpacing = `${(-.03 * px).toFixed(2)}px`;
    const a = 'Del enredo ', wa = ctx.measureText(a).width;
    ctx.font = `400 ${px * 1.08}px ISerif`; ctx.letterSpacing = `${(-.01 * px).toFixed(2)}px`;
    const b = 'al punto.', wb = ctx.measureText(b).width;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 10, 0, (wa + wb + 20) * kt, H); ctx.clip();
    ctx.fillStyle = G.COLOR.tinta;
    ctx.font = `700 ${px}px BG700`; ctx.letterSpacing = `${(-.03 * px).toFixed(2)}px`; ctx.fillText(a, x, y);
    ctx.font = `400 ${px * 1.08}px ISerif`; ctx.letterSpacing = `${(-.01 * px).toFixed(2)}px`; ctx.fillText(b, x + wa, y);
    ctx.restore();
    if (ku > 0) {
      ctx.globalAlpha = ku; ctx.fillStyle = G.COLOR.texto2; ctx.font = `500 28px IS500`; ctx.letterSpacing = '0px';
      ctx.fillText('puntoargy.com', x, H - 110 + (1 - ku) * 6); ctx.globalAlpha = 1;
    }
  }

  function vineta(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const enredo = clamp(invLerp(G.T.zumbido2, G.T.silencio, t)) * (1 - decidida(invLerp(G.T.tiron[0] + 1, G.T.aterriza, t)));
    const g = ctx.createRadialGradient(W / 2, H * .45, H * .35, W / 2, H * .45, W * .75);
    g.addColorStop(0, 'rgba(90,77,60,0)'); g.addColorStop(1, `rgba(90,77,60,${.10 + .07 * enredo})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  // ---------- Cuadro ----------
  function dibujar(t) {
    cam = G.camara(t);
    mesa();
    tickets(t); // debajo: salen de abajo de la calculadora
    G.OBJETOS.forEach(o => objeto(o, t));
    const h = G.hilo(t);
    if (h.gris.length > 1) hiloGris(h.gris);
    if (h.tenso) hiloTenso(h, t);
    punto(h.punta, t, h);
    senal(t);
    logo(t);
    vineta(t);
    G.TEXTOS.forEach(tx => textoPantalla(tx, t));
    cierre(t);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  return { dibujar, aPantalla: p => aPantalla(p) };
}
