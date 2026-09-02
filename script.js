// CS180 Proj 0 · Desk at Dusk
// 1. Time of day follows scroll: sky, stars, sun, moon, clouds, skyline, board dim, lamp.
// 2. Dolly zoom loops through the 7 frames; hovering the film strip scrubs to a frame.

const $ = (id) => document.getElementById(id);

// ---------- day → night on scroll ----------
const lerp = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * t));
function col(stops, t) {
  const n = stops.length - 1, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i;
  return 'rgb(' + lerp(stops[i], stops[i + 1], u).join(',') + ')';
}
const SKY_TOP = [[168,214,245],[240,170,140],[70,60,120],[8,12,36]];
const SKY_BOT = [[236,240,232],[255,205,150],[210,120,120],[22,26,60]];
const SKYLINE = [[122,160,190],[150,90,110],[40,32,70],[8,10,26]];
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? clamp01(window.scrollY / max) : 0;
  const e = clamp01((p - 0.15) / 0.7);          // eased "time of day" 0 = noon, 1 = midnight

  $('sky').style.background = `linear-gradient(to bottom, ${col(SKY_TOP, e)}, ${col(SKY_BOT, e)})`;
  $('stars').style.opacity = Math.max(0, (e - 0.45) / 0.55);
  $('sun').style.top = (8 + e * 95) + 'vh';
  $('sun').style.opacity = e < 0.75 ? 1 : 0;
  $('moon').style.top = (110 - e * 92) + 'vh';
  $('moon').style.opacity = e > 0.4 ? clamp01((e - 0.4) / 0.3) : 0;
  $('clouds').style.opacity = Math.max(0, 0.95 - e * 1.3);
  $('skyline').style.color = col(SKYLINE, e);
  $('skyline').style.setProperty('--win', Math.max(0, (e - 0.35) / 0.4));
  $('dim').style.opacity = e * 0.5;
  $('lampGlow').style.opacity = Math.max(0, (e - 0.6) / 0.4);
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

// ---------- dolly zoom ----------
const MM = [24, 36, 48, 72, 96, 132, 168]; // 1x = 24mm, then 1.5x, 2x, 3x, 4x, 5.5x, 7x
const FRAME_MS = 480;
const big = Array.from($('dolly').querySelectorAll('img'));
const thumbs = Array.from($('frames').querySelectorAll('.frame'));
let frame = 0, hold = false;

function show(i) {
  frame = i;
  big.forEach((img, k) => img.classList.toggle('on', k === i));
  thumbs.forEach((t, k) => t.classList.toggle('on', k === i));
  $('readout').textContent = `≈${MM[i]}mm · frame ${i + 1}/7`;
}
thumbs.forEach((t, i) => {
  t.addEventListener('mouseenter', () => { hold = true; show(i); });
  t.addEventListener('mouseleave', () => { hold = false; });
});
setInterval(() => { if (!hold) show((frame + 1) % 7); }, FRAME_MS);
show(0);
