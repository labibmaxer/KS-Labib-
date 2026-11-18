/* Subtle 3D tilt + glare on the hero photo card (follows the cursor). */
export function initTilt() {
  const box = document.getElementById('pc');
  const el = document.getElementById('pc-tilt');
  if (!box || !el) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.getElementById('hero') || document.body;
  let rx = 0, ry = 0, tx = 0, ty = 0, raf = 0;
  function loop() {
    rx += (tx - rx) * 0.09; ry += (ty - ry) * 0.09;
    el.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    if (Math.abs(tx - rx) > 0.01 || Math.abs(ty - ry) > 0.01) raf = requestAnimationFrame(loop); else raf = 0;
  }
  hero.addEventListener('mousemove', (e) => {
    const r = box.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
    const py = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
    ry = ry; tx = Math.max(-1, Math.min(1, -py)) * 6; ty = Math.max(-1, Math.min(1, px)) * 8;
    const gx = ((e.clientX - r.left) / r.width) * 100, gy = ((e.clientY - r.top) / r.height) * 100;
    box.style.setProperty('--gx', gx + '%'); box.style.setProperty('--gy', gy + '%');
    if (!raf) raf = requestAnimationFrame(loop);
  });
  hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
}
