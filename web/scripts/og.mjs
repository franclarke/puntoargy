// Genera assets/og.png (1200×630) a partir del hero, con la lectura ya terminada.
// Uso: con el servidor local corriendo (node scripts/serve.mjs), `node scripts/og.mjs`.
// Necesita Playwright con Chromium (npx playwright install chromium).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const salida = fileURLToPath(new URL('../assets/og.png', import.meta.url));
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1200, height: 630 } })).newPage();
await p.goto(process.argv[2] || 'http://localhost:4321/', { waitUntil: 'load' });
// Composición para redes: titular, celular leído y logo. Sin cabecera, bajada ni botones.
await p.addStyleTag({ content: '.cabecera{display:none!important} .hero{padding-top:118px!important} .hero-titulo{font-size:80px!important;max-width:8.4em!important} .hero-pie{display:none!important} .hero-mesa{width:600px!important;--alto:620px!important;right:0!important} .hm-pedido{display:none!important} .hm-celu{left:26%!important} .cta-flotante{display:none!important}' });
await p.evaluate(() => {
  const svg = document.querySelector('.marca svg').cloneNode(true);
  svg.querySelector('path').removeAttribute('id');
  svg.setAttribute('width', '112');
  svg.setAttribute('height', '38');
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;left:60px;bottom:52px;z-index:99;color:#1C1B19';
  d.appendChild(svg);
  document.body.appendChild(d);
});
await p.waitForTimeout(6500);
await p.screenshot({ path: salida });
await b.close();
console.log('assets/og.png listo');
