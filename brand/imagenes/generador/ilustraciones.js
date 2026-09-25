// Ilustraciones "bodegones del hilo" hechas con código (SVG → PNG → WebP).
// Estilo: 3D mate tipo arcilla, luz arriba a la izquierda, fondo Piedra, hilo celeste.
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

const OUT = process.argv[2];
const PREVIEW = process.argv[3]; // carpeta para PNG de revisión
fs.mkdirSync(OUT, { recursive: true });
if (PREVIEW) fs.mkdirSync(PREVIEW, { recursive: true });

// ---------- Color ----------
function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function rgb2hex(c) { return '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => v + (B[i] - v) * t)); }
const claro = (c, t) => mix(c, '#FFFFFF', t);
const oscuro = (c, t) => mix(c, '#2A2118', t);

// ---------- Escena ----------
function Escena(W, H, { fondo = '#F2F1ED', sombra = '#5A4D3C', seed = 1 } = {}) {
  let defs = [], cuerpo = [], gid = 0;
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const grad = (c, ang = 'diag') => {
    const id = 'g' + (gid++);
    const [x1, y1, x2, y2] = ang === 'v' ? [0, 0, 0, 1] : [0, 0, 1, 1];
    defs.push(`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${claro(c, .16)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${oscuro(c, .07)}"/></linearGradient>`);
    return `url(#${id})`;
  };
  const radial = (c1, c2, c3, fx = .34, fy = .3) => {
    const id = 'r' + (gid++);
    defs.push(`<radialGradient id="${id}" cx="${fx}" cy="${fy}" r=".85" fx="${fx}" fy="${fy}"><stop offset="0" stop-color="${c1}"/><stop offset=".45" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></radialGradient>`);
    return `url(#${id})`;
  };
  defs.push(`<filter id="bS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>`);
  defs.push(`<filter id="bM" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>`);
  defs.push(`<filter id="bL" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="38"/></filter>`);
  defs.push(`<filter id="grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.26  0 0 0 0 0.2  0 0 0 0.11 0"/></filter>`);
  defs.push(`<radialGradient id="luz" cx=".18" cy=".1" r=".95"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset=".6" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>`);
  defs.push(`<radialGradient id="vineta" cx=".5" cy=".45" r=".8"><stop offset=".65" stop-color="${sombra}" stop-opacity="0"/><stop offset="1" stop-color="${sombra}" stop-opacity=".10"/></radialGradient>`);

  const add = str => cuerpo.push(str);

  // Sombras: contacto (corta, oscura) + ambiente (larga, suave)
  function sombraRect(x, y, w, h, r, rot, cx, cy, fuerza = 1) {
    add(`<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${x + 30}" y="${y + 44}" width="${w}" height="${h}" rx="${r}" fill="${sombra}" opacity="${(.16 * fuerza).toFixed(3)}" filter="url(#bL)"/><rect x="${x + 8}" y="${y + 14}" width="${w}" height="${h}" rx="${r}" fill="${sombra}" opacity="${(.24 * fuerza).toFixed(3)}" filter="url(#bS)"/></g>`);
  }
  // Bloque redondeado visto 3/4 desde arriba: cara superior + frente
  function bloque({ x, y, w, h, d = 40, rot = 0, color, r = 22, sombra: sb = 1, detalle = '' }) {
    const cx = x + w / 2, cy = y + (h + d) / 2;
    if (sb) sombraRect(x, y, w, h + d, r, rot, cx, cy, sb);
    const frente = oscuro(color, .2);
    add(`<g transform="rotate(${rot} ${cx} ${cy})">` +
      `<rect x="${x}" y="${y + d * .2}" width="${w}" height="${h + d * .8}" rx="${r}" fill="${grad(frente, 'v')}"/>` +
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${grad(color)}"/>` +
      `<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="${r - 2}" fill="none" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="3"/>` +
      detalle + `</g>`);
  }
  // Cordón con volumen
  function cordon(d, { w = 34, base = '#74ACDF', sombraC = '#3A5878', sinSombra = false } = {}) {
    const osc = oscuro(base, .22), luz = claro(base, .45);
    if (!sinSombra) add(`<path d="${d}" fill="none" stroke="${sombraC}" stroke-opacity=".22" stroke-width="${w + 8}" stroke-linecap="round" stroke-linejoin="round" transform="translate(14 22)" filter="url(#bS)"/>`);
    add(`<path d="${d}" fill="none" stroke="${osc}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);
    add(`<path d="${d}" fill="none" stroke="${base}" stroke-width="${w * .74}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${-w * .08} ${-w * .1})"/>`);
    add(`<path d="${d}" fill="none" stroke="${luz}" stroke-opacity=".85" stroke-width="${w * .2}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${-w * .2} ${-w * .24})"/>`);
  }
  function esfera(cx, cy, r, { c = '#74ACDF', sb = 1 } = {}) {
    add(`<ellipse cx="${cx + r * .35}" cy="${cy + r * .95}" rx="${r * 1.05}" ry="${r * .38}" fill="${sombra}" opacity="${.3 * sb}" filter="url(#bM)"/>`);
    add(`<ellipse cx="${cx + r * .1}" cy="${cy + r * .92}" rx="${r * .7}" ry="${r * .18}" fill="${sombra}" opacity="${.35 * sb}" filter="url(#bS)"/>`);
    add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${radial(claro(c, .5), c, oscuro(c, .25))}"/>`);
    add(`<ellipse cx="${cx - r * .32}" cy="${cy - r * .38}" rx="${r * .22}" ry="${r * .14}" fill="#FFFFFF" opacity=".45" transform="rotate(-30 ${cx - r * .32} ${cy - r * .38})" filter="url(#bS)"/>`);
  }
  function svg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join('')}</defs>` +
      `<rect width="${W}" height="${H}" fill="${fondo}"/>` + cuerpo.join('') +
      `<rect width="${W}" height="${H}" fill="url(#luz)"/><rect width="${W}" height="${H}" fill="url(#vineta)"/><rect width="${W}" height="${H}" filter="url(#grano)"/></svg>`;
  }
  return { W, H, add, bloque, cordon, esfera, sombraRect, grad, radial, rnd, svg };
}

// Curva suave que pasa por puntos (Catmull-Rom → Bézier)
function spline(pts, t = .5) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t / 3, p1[1] + (p2[1] - p0[1]) * t / 3];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t / 3, p2[1] - (p3[1] - p1[1]) * t / 3];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
// Ruta ortogonal con esquinas redondeadas
function ruta(pts, r = 70) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], [cx, cy] = pts[i + 1];
    const l1 = Math.hypot(bx - ax, by - ay), l2 = Math.hypot(cx - bx, cy - by);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const p1 = [bx - (bx - ax) / l1 * rr, by - (by - ay) / l1 * rr];
    const p2 = [bx + (cx - bx) / l2 * rr, by + (cy - by) / l2 * rr];
    d += ` L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Q${bx} ${by} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  const u = pts[pts.length - 1];
  return d + ` L${u[0]} ${u[1]}`;
}
// Enredo: bucles alrededor de centros
function enredo(centros, rnd, inicio, fin) {
  const pts = [inicio];
  centros.forEach(([cx, cy, r, vueltas = 1.3]) => {
    const a0 = rnd() * Math.PI * 2, n = Math.round(7 * vueltas), dir = rnd() > .5 ? 1 : -1;
    for (let k = 0; k <= n; k++) {
      const a = a0 + dir * (k / n) * Math.PI * 2 * vueltas;
      const rr = r * (.75 + rnd() * .5);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .8]);
    }
  });
  pts.push(fin);
  return spline(pts);
}

// ---------- Objetos ----------
const T = { tinta: '#2A2927', piedra: '#E7E1D6', arena: '#D8CCB6', papel: '#FAF8F2', gris: '#C9C2B6', kraft: '#C8A57A', sol: '#F6B40E', celeste: '#74ACDF' };

function telefono(E, x, y, rot, w = 210, h = 410) {
  const pant = `<rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${h - 28}" rx="26" fill="#3C3B38"/><rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${(h - 28) * .45}" rx="26" fill="#FFFFFF" opacity=".05"/><rect x="${x + w / 2 - 28}" y="${y + 26}" width="56" height="12" rx="6" fill="#1E1D1B"/>`;
  E.bloque({ x, y, w, h, d: 26, rot, color: T.tinta, r: 38, detalle: pant });
}
function planilla(E, x, y, rot, w = 480, h = 360) {
  let lineas = '';
  const filas = 9, cols = 4;
  for (let i = 1; i < filas; i++) lineas += `<line x1="${x + 30}" y1="${y + 40 + i * (h - 70) / filas}" x2="${x + w - 30}" y2="${y + 40 + i * (h - 70) / filas}" stroke="#D9D4C8" stroke-width="2"/>`;
  for (let j = 1; j < cols; j++) lineas += `<line x1="${x + 30 + j * (w - 60) / cols}" y1="${y + 40}" x2="${x + 30 + j * (w - 60) / cols}" y2="${y + h - 30}" stroke="#E2DDD2" stroke-width="2"/>`;
  lineas += `<rect x="${x + 30}" y="${y + 40}" width="${w - 60}" height="${(h - 70) / filas}" fill="#E9E5DB"/>`;
  E.bloque({ x, y, w, h, d: 5, rot, color: T.papel, r: 6, sombra: .7, detalle: lineas });
}
function cuaderno(E, x, y, rot, w = 380, h = 480) {
  let espiral = '';
  for (let i = 0; i < 11; i++) espiral += `<rect x="${x + 34 + i * (w - 68) / 10 - 7}" y="${y - 12}" width="14" height="34" rx="7" fill="#4A4744"/>`;
  const banda = `<rect x="${x + w - 70}" y="${y}" width="22" height="${h}" fill="#3B3936" opacity=".9"/>` + espiral;
  E.bloque({ x, y, w, h, d: 34, rot, color: T.arena, r: 16, detalle: banda });
}
function calculadora(E, x, y, rot, w = 290, h = 400) {
  let det = `<rect x="${x + 28}" y="${y + 28}" width="${w - 56}" height="80" rx="14" fill="#5F6B66"/><rect x="${x + 28}" y="${y + 28}" width="${w - 56}" height="30" rx="14" fill="#FFFFFF" opacity=".08"/>`;
  const cols = 4, filas = 4, bw = (w - 56 - (cols - 1) * 14) / cols, bh = (h - 150 - (filas - 1) * 14) / filas;
  for (let i = 0; i < filas; i++) for (let j = 0; j < cols; j++) {
    const esSol = i === 3 && j === 3;
    const bx = x + 28 + j * (bw + 14), by = y + 128 + i * (bh + 14);
    det += `<rect x="${bx}" y="${by + 5}" width="${bw}" height="${bh}" rx="12" fill="${esSol ? '#C98F06' : '#A89F92'}"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="12" fill="${esSol ? T.sol : '#EFEAE1'}"/>`;
  }
  E.bloque({ x, y, w, h, d: 48, rot, color: T.gris, r: 30, detalle: det });
}
function ticket(E, x, y, rot, w = 110, h = 240) {
  let l = '';
  for (let i = 0; i < Math.floor((h - 40) / 30); i++) l += `<line x1="${x + 18}" y1="${y + 34 + i * 30}" x2="${x + w - (i % 2 ? 40 : 18)}" y2="${y + 34 + i * 30}" stroke="#DCD6CA" stroke-width="5" stroke-linecap="round"/>`;
  E.bloque({ x, y, w, h, d: 3, rot, color: T.papel, r: 4, sombra: .55, detalle: l });
}
function caja(E, x, y, rot, w = 360, h = 280, d = 90) {
  const cinta = `<rect x="${x + w / 2 - 34}" y="${y}" width="68" height="${h}" fill="#E0C79F" opacity=".85"/><line x1="${x + 16}" y1="${y + h / 2}" x2="${x + w - 16}" y2="${y + h / 2}" stroke="#A98556" stroke-width="3" opacity=".5"/>`;
  E.bloque({ x, y, w, h, d, rot, color: T.kraft, r: 12, detalle: cinta });
}

// ---------- 1 · Enredo / 2 · Conectado (4:5) ----------
function escenaEscritorio(modo) {
  const E = Escena(1600, 2000, { seed: 7 });
  if (modo === 'enredo') {
    cuaderno(E, 190, 880, 11);
    caja(E, 1010, 900, -9);
    ticket(E, 700, 870, 24);
    planilla(E, 360, 1400, 5);
    telefono(E, 760, 1180, -17);
    ticket(E, 1330, 1320, -30, 100, 210);
    // Primera parte del hilo, por debajo de la calculadora
    const d1 = enredo([[520, 1150, 170], [880, 1120, 150, 1.5], [1180, 1250, 170], [980, 1520, 190, 1.4]], E.rnd, [80, 1300], [1060, 1480]);
    E.cordon(d1);
    calculadora(E, 1090, 1420, 13);
    ticket(E, 880, 1760, 8, 120, 190);
    const d2 = enredo([[1180, 1640, 150, 1.2], [760, 1650, 170, 1.4], [460, 1500, 150], [300, 1180, 160, 1.2]], E.rnd, [1060, 1480], [520, 1880]);
    E.cordon(d2);
  } else {
    cuaderno(E, 150, 1060, 0, 340, 440);
    planilla(E, 560, 1150, 0, 400, 300);
    telefono(E, 1020, 1100, 0, 190, 370);
    calculadora(E, 1270, 1160, 0, 230, 320);
    caja(E, 520, 1640, 0, 330, 220, 80);
    ticket(E, 1010, 1690, 0, 180, 130);
    ticket(E, 1030, 1670, 0, 180, 130);
    E.cordon(ruta([[-40, 1600], [990, 1600], [990, 1010], [1480, 1010], [1480, 880]], 80));
    E.esfera(1480, 790, 92);
  }
  return E.svg();
}

// ---------- 3 · Taller (16:9) ----------
function escenaTaller() {
  const E = Escena(2400, 1350, { seed: 21 });
  // Laptop cerrada
  const tapa = `<rect x="880" y="900" width="620" height="30" rx="14" fill="#A9A296" opacity=".55"/><rect x="1110" y="912" width="160" height="8" rx="4" fill="#8E877B" opacity=".6"/>`;
  E.bloque({ x: 880, y: 500, w: 620, h: 430, d: 36, color: '#BDB6AA', r: 28, detalle: tapa });
  // Pila de cajas
  caja(E, 1660, 470, 0, 380, 270, 120);
  caja(E, 1720, 300, -4, 280, 200, 100);
  // Impresora de etiquetas
  const ranura = `<rect x="1640" y="930" width="190" height="16" rx="8" fill="#161514"/><rect x="1680" y="900" width="110" height="60" rx="6" fill="${T.papel}"/>`;
  E.bloque({ x: 1610, y: 880, w: 250, h: 190, d: 100, color: '#3A3835', r: 30, detalle: ranura });
  // Cuaderno y lápiz
  cuaderno(E, 2090, 760, 6, 230, 310);
  const lx = 1990, ly = 1150;
  E.add(`<g transform="rotate(-28 ${lx} ${ly})"><rect x="${lx + 20}" y="${ly + 20}" width="330" height="30" rx="15" fill="#5A4D3C" opacity=".22" filter="url(#bS)"/><rect x="${lx}" y="${ly}" width="300" height="30" rx="6" fill="${T.sol}"/><rect x="${lx}" y="${ly}" width="300" height="11" rx="5" fill="#FFFFFF" opacity=".25"/><path d="M${lx + 300} ${ly} L${lx + 350} ${ly + 15} L${lx + 300} ${ly + 30} Z" fill="#E8D7B5"/><path d="M${lx + 336} ${ly + 11} L${lx + 350} ${ly + 15} L${lx + 336} ${ly + 19} Z" fill="#3A3835"/><rect x="${lx - 28}" y="${ly}" width="30" height="30" rx="6" fill="#CFC4B2"/></g>`);
  E.cordon(ruta([[-40, 1200], [1540, 1200], [1540, 800], [2230, 800], [2230, 640]], 80), { w: 40 });
  E.esfera(2230, 555, 90);
  return E.svg();
}

// ---------- 4 · Depósito (4:5) ----------
function escenaDeposito() {
  const E = Escena(1600, 2000, { seed: 33 });
  const madera = '#D9D0C1';
  // Postes
  [150, 1400].forEach(x => E.bloque({ x, y: 260, w: 60, h: 1640, d: 20, color: '#BFB5A5', r: 14, sombra: .6 }));
  const estante = y => E.bloque({ x: 110, y, w: 1400, h: 70, d: 34, color: madera, r: 12, sombra: .8 });
  // Estante superior
  estante(700);
  caja(E, 270, 450, 0, 290, 230, 70);
  caja(E, 600, 540, 0, 200, 150, 60);
  const bolsa = (x, y, w, h) => E.bloque({ x, y, w, h, d: 50, color: '#CDA877', r: 10, detalle: `<path d="M${x + 10} ${y + 40} L${x + w / 2} ${y + 10} L${x + w - 10} ${y + 40}" fill="none" stroke="#A98556" stroke-width="4" stroke-linejoin="round"/>` });
  bolsa(870, 420, 170, 270);
  // Estante del medio
  estante(1170);
  caja(E, 260, 870, 0, 360, 290, 70);
  const clip = `<rect x="795" y="815" width="170" height="250" rx="6" fill="${T.papel}"/><rect x="835" y="800" width="90" height="36" rx="10" fill="#6E6A64"/>` +
    [0, 1, 2, 3, 4].map(i => `<line x1="815" y1="${870 + i * 36}" x2="${i % 2 ? 900 : 940}" y2="${870 + i * 36}" stroke="#DCD6CA" stroke-width="7" stroke-linecap="round"/>`).join('');
  E.bloque({ x: 770, y: 790, w: 220, h: 300, d: 16, rot: -4, color: '#B89A72', r: 14, detalle: clip });
  caja(E, 1070, 950, 0, 290, 210, 60);
  // Estante inferior, más tranquilo
  estante(1640);
  caja(E, 300, 1440, 0, 520, 190, 60);
  bolsa(1090, 1400, 150, 230);
  // Hilo: sube en zigzag por el frente de los estantes y termina en el estante de arriba
  E.cordon(ruta([[-40, 1590], [990, 1590], [990, 1120], [320, 1120], [320, 650], [1250, 650], [1250, 610]], 70), { w: 32 });
  E.esfera(1250, 548, 64);
  return E.svg();
}

// ---------- 5 · Construyendo (1:1, fondo celeste) ----------
function escenaConstruyendo() {
  const E = Escena(1600, 1600, { fondo: '#74ACDF', sombra: '#2E5F8F', seed: 45 });
  const blanco = '#F4F1EA';
  // Plinto
  E.bloque({ x: 300, y: 1040, w: 1000, h: 220, d: 110, color: '#E9E4DA', r: 30 });
  // Piezas
  E.bloque({ x: 400, y: 800, w: 260, h: 220, d: 150, color: blanco, r: 22 });
  E.bloque({ x: 450, y: 610, w: 170, h: 150, d: 110, color: blanco, r: 20 });
  // Cilindro
  const cx = 820, cyTop = 700, rx = 110, ry = 50, alto = 250;
  E.add(`<ellipse cx="${cx + 40}" cy="${cyTop + alto + 70}" rx="${rx * 1.2}" ry="${ry * 1.1}" fill="#2E5F8F" opacity=".25" filter="url(#bM)"/>`);
  E.add(`<path d="M${cx - rx} ${cyTop} L${cx - rx} ${cyTop + alto} A${rx} ${ry} 0 0 0 ${cx + rx} ${cyTop + alto} L${cx + rx} ${cyTop} Z" fill="${E.grad('#DAD4C8', 'diag')}"/>`);
  E.add(`<ellipse cx="${cx}" cy="${cyTop}" rx="${rx}" ry="${ry}" fill="${E.grad(blanco)}"/>`);
  // Escalón
  E.bloque({ x: 1000, y: 860, w: 150, h: 170, d: 150, color: blanco, r: 20 });
  E.bloque({ x: 1150, y: 930, w: 150, h: 100, d: 90, color: blanco, r: 20 });
  // Pieza en el aire, por colocarse
  E.add(`<ellipse cx="1150" cy="760" rx="120" ry="30" fill="#2E5F8F" opacity=".22" filter="url(#bM)"/>`);
  E.bloque({ x: 1020, y: 470, w: 230, h: 110, d: 70, rot: -6, color: blanco, r: 18, sombra: 0 });
  // Hilo blanco entre las piezas, termina en la esfera blanca arriba
  E.cordon(ruta([[-40, 1420], [740, 1420], [740, 990], [940, 990], [940, 560], [535, 560], [535, 430]], 60), { w: 30, base: '#FFFFFF', sombraC: '#2E5F8F' });
  E.esfera(535, 360, 70, { c: '#FFFFFF', sb: .8 });
  return E.svg();
}

// ---------- Render ----------
async function guardar(nombre, svg, ancho) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: ancho } }).render().asPng();
  if (PREVIEW) fs.writeFileSync(path.join(PREVIEW, nombre + '.png'), await sharp(png).resize({ width: 800 }).png().toBuffer());
  const webp = await sharp(png).webp({ quality: 82 }).toBuffer();
  fs.writeFileSync(path.join(OUT, nombre + '.webp'), webp);
  return webp.length;
}
(async () => {
  const lista = [
    ['enredo', escenaEscritorio('enredo'), 1600],
    ['conectado', escenaEscritorio('conectado'), 1600],
    ['taller', escenaTaller(), 2400],
    ['deposito', escenaDeposito(), 1600],
    ['construyendo', escenaConstruyendo(), 1600]
  ];
  const solo = process.argv[4];
  for (const [n, s, w] of lista) {
    if (solo && solo !== n) continue;
    const kb = await guardar(n, s, w);
    console.log(n, Math.round(kb / 1024) + ' KB');
  }
})();
