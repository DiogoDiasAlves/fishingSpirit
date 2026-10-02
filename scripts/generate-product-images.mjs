// Gera as imagens ilustrativas (fictícias) dos produtos em assets/img/products.
// Uso: node scripts/generate-product-images.mjs
// Quando tiver as fotos reais, basta trocar o campo `image` em js/products.js.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "img", "products");
mkdirSync(OUT, { recursive: true });

let uid = 0;
const id = (p) => `${p}${++uid}`;

const frame = (body, defs = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
<defs>
  <radialGradient id="bg" cx="50%" cy="42%" r="70%">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e6efff"/><stop offset="1" stop-color="#c9dcfb"/>
  </radialGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="drop" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#0a2a66" flood-opacity=".22"/></filter>
  <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f7fb"/><stop offset=".5" stop-color="#9aa6b8"/><stop offset="1" stop-color="#5d6878"/></linearGradient>
  ${defs}
</defs>
<rect width="600" height="600" fill="url(#bg)"/>
<g opacity=".35" fill="none" stroke="#9cc0ff" stroke-width="2">
  <path d="M0 520 Q75 505 150 520 T300 520 T450 520 T600 520"/>
  <path d="M0 548 Q75 533 150 548 T300 548 T450 548 T600 548"/>
</g>
<ellipse cx="300" cy="480" rx="190" ry="16" fill="#0a2a66" opacity=".16" filter="url(#soft)"/>
<g filter="url(#drop)">${body}</g>
</svg>`;

const treble = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke-linecap="round">
  <circle cx="0" cy="0" r="7" stroke="#6b7686" stroke-width="3"/>
  <path d="M0 7 V48" stroke="#4b5563" stroke-width="4"/>
  <path d="M0 46 C0 66 -26 66 -26 44 l7 7 M0 46 C0 66 26 66 26 44 l-7 7" stroke="#4b5563" stroke-width="4"/>
  <path d="M0 46 C0 64 4 70 6 58" stroke="#8a94a3" stroke-width="3"/>
</g>`;

const eye = (x, y, r = 13) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f5c518" stroke="#1b1b1b" stroke-width="3"/>
<circle cx="${x + 2}" cy="${y}" r="${r * 0.45}" fill="#111"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.22}" fill="#fff"/>`;

const bodyGrad = (g, back, mid, belly) => `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${back}"/><stop offset=".45" stop-color="${mid}"/><stop offset=".62" stop-color="${belly}"/><stop offset="1" stop-color="#ffffff"/></linearGradient>`;

const scales = (p) => `<pattern id="${p}" width="18" height="12" patternUnits="userSpaceOnUse">
  <path d="M0 12 Q9 0 18 12" fill="none" stroke="#ffffff" stroke-opacity=".28" stroke-width="1.5"/></pattern>`;

const gloss = (d) => `<path d="${d}" fill="#fff" opacity=".35"/>`;

function minnow({ back, mid, belly = "#e9f1ff", stripes = true }) {
  const g = id("g"), p = id("p");
  const body = "M110 300 C135 236 380 226 468 276 C492 290 492 314 468 326 C380 368 150 362 110 300 Z";
  return frame(`
  <path d="M476 306 L552 352 C556 362 548 370 538 366 L466 322 Z" fill="#bfe0ff" fill-opacity=".75" stroke="#7fb3ec" stroke-width="2"/>
  ${treble(215, 350)}${treble(355, 354)}
  <path d="${body}" fill="url(#${g})" stroke="#0b1530" stroke-width="4"/>
  <path d="${body}" fill="url(#${p})"/>
  ${stripes ? `<path d="M170 262 l14 30 M215 252 l14 34 M262 247 l14 36 M310 246 l14 36 M358 250 l12 32" stroke="#0b1530" stroke-opacity=".35" stroke-width="7" stroke-linecap="round"/>` : ""}
  <path d="M120 300 L60 270 L72 300 L60 330 Z" fill="#0b1530" opacity=".0"/>
  ${gloss("M150 278 C220 250 340 246 430 268 C350 258 230 262 150 290 Z")}
  ${eye(440, 290)}
  <path d="M112 300 h-18" stroke="#6b7686" stroke-width="4"/><circle cx="86" cy="300" r="8" fill="none" stroke="#6b7686" stroke-width="3"/>`,
    bodyGrad(g, back, mid, belly) + scales(p));
}

function zara({ back, mid }) {
  const g = id("g"), p = id("p");
  const body = "M80 300 C110 262 400 250 500 284 C526 294 526 310 500 318 C400 350 110 340 80 300 Z";
  return frame(`
  ${treble(220, 336)}${treble(390, 334)}
  <path d="${body}" fill="url(#${g})" stroke="#0b1530" stroke-width="4"/>
  <path d="${body}" fill="url(#${p})"/>
  <path d="M440 266 C470 270 500 280 508 292" stroke="#d81e3a" stroke-width="10" fill="none" stroke-linecap="round" opacity=".85"/>
  ${gloss("M120 290 C220 266 360 260 470 276 C360 268 230 274 120 298 Z")}
  ${eye(470, 292, 11)}
  <circle cx="524" cy="300" r="8" fill="none" stroke="#6b7686" stroke-width="3"/>
  <path d="M82 300 h-16" stroke="#6b7686" stroke-width="4"/>`,
    bodyGrad(g, back, mid, "#f2f6ff") + scales(p));
}

function popper({ back, mid }) {
  const g = id("g"), p = id("p");
  const body = "M170 300 C190 224 400 214 460 252 L470 348 C400 386 190 376 170 300 Z";
  return frame(`
  ${treble(260, 362)}${treble(160, 306, .9)}
  <path d="${body}" fill="url(#${g})" stroke="#0b1530" stroke-width="4"/>
  <path d="${body}" fill="url(#${p})"/>
  <ellipse cx="466" cy="300" rx="26" ry="50" fill="#0b1530"/>
  <ellipse cx="470" cy="300" rx="16" ry="36" fill="#d81e3a"/>
  ${gloss("M200 270 C260 238 360 230 440 250 C360 246 270 252 200 284 Z")}
  ${eye(405, 278, 14)}
  <path d="M168 306 h-6" stroke="#6b7686" stroke-width="4"/>
  <path d="M120 290 C100 270 92 300 104 316 C90 330 110 346 128 320" fill="#e8f0ff" stroke="#9fb3d1" stroke-width="2" opacity=".9"/>`,
    bodyGrad(g, back, mid, "#f2f6ff") + scales(p));
}

function crank({ back, mid }) {
  const g = id("g"), p = id("p");
  const body = "M150 300 C160 200 400 190 450 270 C470 300 460 330 440 340 C380 400 170 390 150 300 Z";
  return frame(`
  <path d="M440 310 L560 380 C566 400 548 412 532 404 L430 336 Z" fill="#bfe0ff" fill-opacity=".8" stroke="#7fb3ec" stroke-width="2"/>
  ${treble(250, 372)}${treble(152, 304, .9)}
  <path d="${body}" fill="url(#${g})" stroke="#0b1530" stroke-width="4"/>
  <path d="${body}" fill="url(#${p})"/>
  <path d="M220 240 l20 40 M280 228 l20 46 M340 228 l18 44" stroke="#0b1530" stroke-opacity=".35" stroke-width="10" stroke-linecap="round"/>
  ${gloss("M190 260 C240 220 350 212 420 250 C340 230 260 236 190 272 Z")}
  ${eye(405, 274, 15)}`,
    bodyGrad(g, back, mid, "#fff3c4") + scales(p));
}

function shad({ color, head = "#1a6dff" }) {
  const g = id("g");
  return frame(`
  <path d="M120 300 C150 262 300 250 380 266 L380 334 C300 350 150 338 120 300 Z" fill="url(#${g})" stroke="#0b1530" stroke-width="4"/>
  <path d="M126 300 C110 286 90 262 70 250 C60 290 60 312 70 350 C90 338 110 314 126 300 Z" fill="${color}" stroke="#0b1530" stroke-width="4"/>
  <path d="M160 282 C230 268 300 264 370 272" stroke="#fff" stroke-opacity=".5" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M200 270 v60 M240 266 v68 M280 264 v72 M320 264 v72" stroke="#0b1530" stroke-opacity=".18" stroke-width="3"/>
  <path d="M376 250 C450 236 500 270 500 300 C500 330 450 364 376 350 Z" fill="${head}" stroke="#0b1530" stroke-width="4"/>
  <path d="M396 262 C440 254 474 270 484 288" stroke="#fff" stroke-opacity=".5" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${eye(452, 292, 14)}
  <path d="M420 350 C420 410 330 420 320 360 l14 10" fill="none" stroke="#4b5563" stroke-width="6" stroke-linecap="round"/>
  <circle cx="500" cy="300" r="9" fill="none" stroke="#6b7686" stroke-width="4"/>`,
    `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#ffffff"/></linearGradient>`);
}

function spoon({ c1 = "#f4f7fb", c2 = "#8f9bb0", accent = "#1a6dff" }) {
  const g = id("g");
  return frame(`
  <g transform="rotate(-28 300 300)">
    <path d="M300 130 C380 150 400 300 360 400 C340 450 260 450 240 400 C200 300 220 150 300 130 Z" fill="url(#${g})" stroke="#3b4656" stroke-width="4"/>
    <path d="M300 160 C350 180 360 280 335 360" stroke="#fff" stroke-width="12" fill="none" opacity=".7" stroke-linecap="round"/>
    <path d="M270 260 C280 300 300 330 330 340" stroke="${accent}" stroke-width="16" fill="none" stroke-linecap="round" opacity=".85"/>
    <circle cx="300" cy="148" r="12" fill="none" stroke="#6b7686" stroke-width="4"/>
    <circle cx="300" cy="118" r="14" fill="none" stroke="#6b7686" stroke-width="4"/>
    ${treble(300, 450, 1.2)}
  </g>`,
    `<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`);
}

function jig({ skirt = "#1a6dff", skirt2 = "#0b1530", head = "#f5c518" }) {
  let strands = "";
  for (let i = 0; i < 22; i++) {
    const y = 250 + i * 5;
    const c = i % 3 === 0 ? skirt2 : skirt;
    strands += `<path d="M330 ${y} C260 ${y + (i - 11) * 3} 200 ${y + (i - 11) * 8} 120 ${y + (i - 11) * 12}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  }
  return frame(`
  ${strands}
  <rect x="318" y="262" width="34" height="76" rx="8" fill="${skirt2}"/>
  <path d="M340 240 C420 220 470 260 470 300 C470 340 420 380 340 360 Z" fill="${head}" stroke="#0b1530" stroke-width="4"/>
  <path d="M360 252 C410 244 446 262 456 284" stroke="#fff" stroke-opacity=".55" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${eye(430, 292, 14)}
  <path d="M470 300 L520 300" stroke="#4b5563" stroke-width="6"/><circle cx="530" cy="300" r="10" fill="none" stroke="#6b7686" stroke-width="4"/>
  <path d="M360 360 C360 440 270 450 250 380 l16 12" fill="none" stroke="#4b5563" stroke-width="7" stroke-linecap="round"/>`);
}

function frog({ color = "#3fae5a", belly = "#f4f0c8" }) {
  return frame(`
  <path d="M190 300 C130 250 70 260 60 230 M190 320 C130 370 70 360 60 390" stroke="${color}" stroke-width="20" fill="none" stroke-linecap="round"/>
  <path d="M60 230 l-30 -10 M60 390 l-30 10" stroke="#d81e3a" stroke-width="10" stroke-linecap="round"/>
  <path d="M180 310 C180 220 420 200 470 280 C490 320 470 380 420 390 C320 420 180 400 180 310 Z" fill="${color}" stroke="#0b1530" stroke-width="4"/>
  <path d="M200 340 C260 390 390 400 450 360 C420 400 260 410 200 340 Z" fill="${belly}"/>
  <circle cx="260" cy="270" r="10" fill="#0b1530" opacity=".3"/><circle cx="320" cy="250" r="14" fill="#0b1530" opacity=".3"/><circle cx="300" cy="300" r="8" fill="#0b1530" opacity=".3"/>
  ${eye(410, 262, 20)}${eye(450, 286, 15)}
  <path d="M200 300 C220 230 330 220 380 300" stroke="#4b5563" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M200 300 C220 370 330 380 380 300" stroke="#4b5563" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="486" cy="306" r="9" fill="none" stroke="#6b7686" stroke-width="4"/>`);
}

function rod({ blank = "#0b1530", accent = "#1a6dff", handle = "#1d1f24", tele = false }) {
  const g = id("g");
  const guides = [0.42, 0.55, 0.66, 0.76, 0.85, 0.93].map((t) => {
    const x = 90 + (540 - 90) * t, y = 520 - (520 - 70) * t;
    return `<g transform="translate(${x} ${y}) rotate(-45)"><path d="M0 0 v14" stroke="#6b7686" stroke-width="3"/><circle cx="0" cy="${14 + 6 - t * 4}" r="${7 - t * 4}" fill="none" stroke="#6b7686" stroke-width="3"/></g>`;
  }).join("");
  return frame(`
  <line x1="90" y1="520" x2="540" y2="70" stroke="url(#${g})" stroke-width="9" stroke-linecap="round"/>
  ${tele ? [0.45, 0.62, 0.78].map((t) => `<circle cx="${90 + 450 * t}" cy="${520 - 450 * t}" r="7" fill="${accent}"/>`).join("") : ""}
  <line x1="80" y1="530" x2="185" y2="425" stroke="${handle}" stroke-width="22" stroke-linecap="round"/>
  <line x1="200" y1="410" x2="245" y2="365" stroke="#9aa6b8" stroke-width="20"/>
  <line x1="208" y1="402" x2="236" y2="374" stroke="${accent}" stroke-width="22"/>
  <line x1="250" y1="360" x2="290" y2="320" stroke="${handle}" stroke-width="16" stroke-linecap="round"/>
  <line x1="290" y1="320" x2="300" y2="310" stroke="${accent}" stroke-width="12"/>
  ${guides}
  <text x="355" y="232" transform="rotate(-45 355 232)" font-family="Arial Black,Arial" font-size="13" font-weight="900" fill="${accent}" letter-spacing="2">FISHING SPIRIT</text>`,
    `<linearGradient id="${g}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${blank}"/><stop offset=".6" stop-color="${accent}"/><stop offset="1" stop-color="${blank}"/></linearGradient>`);
}

function spinning({ body = "#0b1530", accent = "#1a6dff" }) {
  const g = id("g");
  let wraps = "";
  for (let i = 0; i < 9; i++) wraps += `<line x1="${186 + i * 8}" y1="292" x2="${186 + i * 8}" y2="378" stroke="#7dd3fc" stroke-width="3" opacity=".75"/>`;
  return frame(`
  <rect x="80" y="150" width="440" height="16" rx="8" fill="#1d1f24"/>
  <path d="M250 166 h110 l-20 18 h-70 Z" fill="#9aa6b8"/>
  <path d="M290 184 C290 230 300 250 320 270" stroke="${body}" stroke-width="26" fill="none" stroke-linecap="round"/>
  <path d="M260 260 C300 230 380 240 400 300 C420 360 380 410 320 410 C270 410 250 380 250 340 Z" fill="url(#${g})" stroke="#0b1530" stroke-width="4"/>
  <path d="M240 290 L270 270 L270 400 L240 380 Z" fill="${accent}" stroke="#0b1530" stroke-width="4"/>
  <rect x="176" y="282" width="70" height="106" rx="10" fill="#e9eef6" stroke="#0b1530" stroke-width="4"/>
  ${wraps}
  <rect x="170" y="276" width="14" height="118" rx="5" fill="${accent}" stroke="#0b1530" stroke-width="3"/>
  <circle cx="160" cy="335" r="20" fill="#9aa6b8" stroke="#0b1530" stroke-width="4"/>
  <circle cx="160" cy="335" r="8" fill="${accent}"/>
  <circle cx="335" cy="330" r="34" fill="${body}" stroke="${accent}" stroke-width="5"/>
  <path d="M335 330 L460 400" stroke="#9aa6b8" stroke-width="12" stroke-linecap="round"/>
  <rect x="448" y="384" width="30" height="58" rx="14" fill="#1d1f24" transform="rotate(-20 463 413)"/>
  <text x="300" y="370" font-family="Arial Black,Arial" font-size="18" font-weight="900" fill="#fff">3000</text>`,
    `<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a4558"/><stop offset=".5" stop-color="${body}"/><stop offset="1" stop-color="#000"/></linearGradient>`);
}

function baitcaster({ body = "#0b1530", accent = "#1a6dff" }) {
  const g = id("g");
  return frame(`
  <rect x="60" y="370" width="480" height="16" rx="8" fill="#1d1f24"/>
  <path d="M170 370 C150 280 210 220 300 220 C390 220 450 280 430 370 Z" fill="url(#${g})" stroke="#0b1530" stroke-width="4"/>
  <ellipse cx="300" cy="300" rx="96" ry="66" fill="${accent}" opacity=".9" stroke="#0b1530" stroke-width="4"/>
  <ellipse cx="300" cy="300" rx="70" ry="46" fill="${body}"/>
  <text x="300" y="308" text-anchor="middle" font-family="Arial Black,Arial" font-size="20" font-weight="900" fill="#fff" letter-spacing="1">STORM</text>
  <g transform="translate(400 250)">
    <path d="M0 0 l14 -8 l2 14 l14 2 l-8 12 l8 12 l-14 2 l-2 14 l-14 -8 l-14 8 l-2 -14 l-14 -2 l8 -12 l-8 -12 l14 -2 l2 -14 Z" fill="#9aa6b8" stroke="#0b1530" stroke-width="3"/>
  </g>
  <path d="M400 262 L470 210 M400 262 L340 160" stroke="#9aa6b8" stroke-width="12" stroke-linecap="round"/>
  <ellipse cx="478" cy="204" rx="26" ry="14" fill="#1d1f24" transform="rotate(-35 478 204)"/>
  <ellipse cx="334" cy="150" rx="26" ry="14" fill="#1d1f24" transform="rotate(60 334 150)"/>
  ${gloss("M200 300 C210 250 260 232 300 232 C250 245 220 270 210 320 Z")}`,
    `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4558"/><stop offset="1" stop-color="${body}"/></linearGradient>`);
}

function line({ color = "#1a6dff", label = "8X", spec = "0,23mm" }) {
  let rings = "";
  for (let r = 70; r <= 150; r += 6) rings += `<circle cx="300" cy="290" r="${r}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>`;
  return frame(`
  <circle cx="300" cy="290" r="178" fill="#0b1530"/>
  <circle cx="300" cy="290" r="166" fill="#1d2840"/>
  <circle cx="300" cy="290" r="152" fill="${color}"/>
  ${rings}
  <circle cx="300" cy="290" r="64" fill="#0b1530" stroke="#9aa6b8" stroke-width="4"/>
  <text x="300" y="286" text-anchor="middle" font-family="Arial Black,Arial" font-size="${label.length > 4 ? 20 : 30}" font-weight="900" fill="#fff">${label}</text>
  <text x="300" y="314" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700" fill="#7dd3fc">${spec}</text>
  <circle cx="300" cy="290" r="14" fill="none" stroke="#3a4558" stroke-width="0"/>
  ${gloss("M180 200 C220 150 290 130 350 140 C280 150 220 180 190 230 Z")}`);
}

function pliers({ accent = "#1a6dff" }) {
  return frame(`
  <path d="M300 300 L500 120" stroke="#9aa6b8" stroke-width="18" stroke-linecap="round"/>
  <path d="M300 300 L520 150" stroke="#c7d0dd" stroke-width="14" stroke-linecap="round"/>
  <path d="M300 300 C240 360 200 420 140 480" stroke="${accent}" stroke-width="30" stroke-linecap="round" fill="none"/>
  <path d="M300 300 C260 380 230 430 200 510" stroke="#0b1530" stroke-width="30" stroke-linecap="round" fill="none"/>
  <circle cx="300" cy="300" r="20" fill="#9aa6b8" stroke="#0b1530" stroke-width="4"/>
  <circle cx="300" cy="300" r="6" fill="#0b1530"/>
  <path d="M236 380 C260 400 250 430 226 440" stroke="#7dd3fc" stroke-width="4" fill="none"/>`);
}

function tacklebox() {
  const lures = ["#1a6dff", "#f5c518", "#d81e3a", "#3fae5a", "#0b1530", "#7dd3fc"];
  let cells = "";
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
    const x = 130 + c * 116, y = 250 + r * 96, col = lures[r * 3 + c];
    cells += `<rect x="${x}" y="${y}" width="108" height="88" rx="6" fill="#ffffff" fill-opacity=".35" stroke="#0b1530" stroke-opacity=".35" stroke-width="3"/>
    <path d="M${x + 18} ${y + 44} C${x + 30} ${y + 24} ${x + 80} ${y + 24} ${x + 92} ${y + 44} C${x + 80} ${y + 64} ${x + 30} ${y + 64} ${x + 18} ${y + 44} Z" fill="${col}" stroke="#0b1530" stroke-width="2"/>
    <circle cx="${x + 78}" cy="${y + 40}" r="4" fill="#f5c518" stroke="#000" stroke-width="1"/>`;
  }
  return frame(`
  <rect x="110" y="200" width="380" height="260" rx="22" fill="#cfe3ff" fill-opacity=".85" stroke="#0b1530" stroke-width="5"/>
  <rect x="110" y="200" width="380" height="36" rx="18" fill="#1a6dff" stroke="#0b1530" stroke-width="5"/>
  ${cells}
  <rect x="250" y="170" width="100" height="34" rx="12" fill="none" stroke="#0b1530" stroke-width="10"/>
  <rect x="270" y="210" width="60" height="18" rx="6" fill="#0b1530"/>
  ${gloss("M130 260 C200 240 300 236 470 246 L470 256 C300 250 200 256 130 276 Z")}`);
}

function hooks() {
  let hs = "";
  for (let i = 0; i < 5; i++) {
    const x = 190 + i * 55;
    hs += `<path d="M${x} 200 V330 C${x} 380 ${x + 40} 380 ${x + 40} 330 l-10 12" fill="none" stroke="#3b4656" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="194" r="8" fill="none" stroke="#3b4656" stroke-width="4"/>`;
  }
  return frame(`
  <rect x="140" y="130" width="320" height="340" rx="18" fill="#0b1530"/>
  <rect x="140" y="130" width="320" height="56" rx="18" fill="#1a6dff"/>
  <circle cx="300" cy="152" r="10" fill="#c9dcfb"/>
  <rect x="160" y="190" width="280" height="210" rx="10" fill="#e9f1ff"/>
  ${hs}
  <text x="300" y="440" text-anchor="middle" font-family="Arial Black,Arial" font-size="26" font-weight="900" fill="#fff">WIDE GAP · 50</text>`);
}

function cap() {
  return frame(`
  <path d="M150 360 C140 230 230 160 320 160 C420 160 470 240 470 330 Z" fill="#0b1530" stroke="#000" stroke-width="4"/>
  <path d="M310 162 C300 230 300 300 310 350" stroke="#1d2840" stroke-width="4" fill="none"/>
  <path d="M150 360 C230 330 380 320 470 330 C520 336 560 360 540 390 C470 380 300 380 150 380 Z" fill="#1a6dff" stroke="#000" stroke-width="4"/>
  <circle cx="318" cy="166" r="10" fill="#1a6dff"/>
  <g transform="translate(250 230) skewX(-10)">
    <text x="0" y="40" font-family="Arial Black,Arial" font-size="44" font-weight="900" fill="#3d8bff">FS</text>
  </g>
  <path d="M250 300 h120" stroke="#3d8bff" stroke-width="4"/>
  ${gloss("M190 280 C200 220 250 186 300 180 C250 200 220 240 210 300 Z")}`);
}

function kit() {
  // três iscas em leque
  const mini = (tx, ty, rot, back, mid) => {
    const g = id("g");
    return {
      defs: bodyGrad(g, back, mid, "#f2f6ff"),
      body: `<g transform="translate(${tx} ${ty}) rotate(${rot}) scale(.62)">
        <path d="M-180 0 C-150 -60 90 -66 170 -20 C194 -6 194 18 170 30 C90 70 -150 64 -180 0 Z" fill="url(#${g})" stroke="#0b1530" stroke-width="6"/>
        <path d="M178 6 L240 46 C244 56 236 62 228 58 L168 24 Z" fill="#bfe0ff" stroke="#7fb3ec" stroke-width="2"/>
        <circle cx="140" cy="-6" r="16" fill="#f5c518" stroke="#000" stroke-width="3"/><circle cx="142" cy="-6" r="7" fill="#000"/>
      </g>`,
    };
  };
  const a = mini(300, 210, -12, "#0b3d91", "#3d8bff");
  const b = mini(300, 310, 0, "#14532d", "#f5c518");
  const c = mini(300, 410, 12, "#7f1d1d", "#f97316");
  return frame(`${a.body}${b.body}${c.body}
  <rect x="380" y="440" width="150" height="46" rx="23" fill="#0b1530"/>
  <text x="455" y="470" text-anchor="middle" font-family="Arial Black,Arial" font-size="20" font-weight="900" fill="#fff">KIT x3</text>`,
    a.defs + b.defs + c.defs);
}

const images = {
  "stick-spirit-90": minnow({ back: "#0b3d91", mid: "#3d8bff" }),
  "minnow-ghost-110": minnow({ back: "#4b5563", mid: "#cbd5e1", stripes: false }),
  "zara-walk-110": zara({ back: "#0b1530", mid: "#1a6dff" }),
  "popper-explosao-70": popper({ back: "#1a6dff", mid: "#7dd3fc" }),
  "crank-deep-60": crank({ back: "#166534", mid: "#f5c518" }),
  "shad-soft-4": shad({ color: "#7dd3fc", head: "#1a6dff" }),
  "colher-prata-15g": spoon({}),
  "jig-skirt-10g": jig({}),
  "sapinho-soft-frog": frog({}),
  "vara-spirit-carbon": rod({}),
  "vara-telescopica": rod({ accent: "#3d8bff", blank: "#1d1f24", tele: true }),
  "molinete-spirit-3000": spinning({}),
  "carretilha-storm-lp": baitcaster({}),
  "linha-multi-8x": line({ color: "#1a6dff", label: "8X", spec: "0,23mm · 150m" }),
  "linha-fluoro-leader": line({ color: "#9fd8ff", label: "FLUORO", spec: "0,40mm · 50m" }),
  "alicate-contencao": pliers({}),
  "caixa-organizadora": tacklebox(),
  "anzol-wide-gap": hooks(),
  "bone-fishing-spirit": cap(),
  "kit-tucunare": kit(),
};

for (const [name, svg] of Object.entries(images)) {
  writeFileSync(join(OUT, `${name}.svg`), svg.replace(/\n\s*\n/g, "\n"));
}
console.log(`${Object.keys(images).length} imagens geradas em ${OUT}`);
