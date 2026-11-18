/* ID-card lanyard: damped pendulum + drag to swing. */
export function initLanyard() {
  const sw = document.getElementById('idc-swing');
  const card = document.getElementById('idc-card');
  const root = document.getElementById('idc');
  if (!sw || !card || !root) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = 14, DAMP = 0.9;           // pendulum stiffness / damping
  let th = reduce ? 0 : 0.34, w = 0;  // main angle + velocity
  let ph = 0, pw = 0;                 // card's own lag swing
  let drag = false, last = 0, lastT = 0, vel = 0;
  let visible = true, t0 = performance.now();

  function pivot() { const r = root.getBoundingClientRect(); return { x: r.left, y: r.top }; }
  card.addEventListener('pointerdown', (e) => {
    drag = true; last = th; lastT = performance.now(); vel = 0;
    card.setPointerCapture(e.pointerId); card.classList.add('grab'); e.preventDefault();
  });
  card.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const p = pivot(); const dx = e.clientX - p.x, dy = Math.max(e.clientY - p.y, 120);
    const na = Math.max(-0.8, Math.min(0.8, Math.atan2(dx, dy)));
    const now = performance.now(), dt = Math.max((now - lastT) / 1000, 0.001);
    vel = (na - last) / dt; last = na; lastT = now; th = na; w = 0;
  });
  const end = () => { if (!drag) return; drag = false; w = Math.max(-5, Math.min(5, vel)); card.classList.remove('grab'); };
  card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
  // gentle push when cursor sweeps across the card
  card.addEventListener('mousemove', (e) => { if (!drag && !reduce) w += Math.max(-40, Math.min(40, e.movementX)) * 0.012; });

  if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(root.parentElement || root);

  let prev = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    if (!visible) { prev = now; return; }
    const dt = Math.min((now - prev) / 1000, 0.033); prev = now;
    if (!drag) {
      const a = -G * Math.sin(th) - DAMP * w;
      w += a * dt; th += w * dt;
      if (Math.abs(th) < 0.0004 && Math.abs(w) < 0.003 && !reduce) { th = 0; w = 0; }
    }
    // card lags behind the strap (secondary pendulum)
    const drive = -w * 0.09;
    pw += ((drive - ph) * 60 - pw * 5) * dt; ph += pw * dt;
    sw.style.transform = 'rotate(' + th + 'rad)';
    card.style.transform = 'rotate(' + ph + 'rad)';
    // tiny idle sway so it never looks frozen
    if (!reduce && !drag && Math.abs(w) < 0.02) { const t = (now - t0) / 1000; sw.style.transform = 'rotate(' + (th + Math.sin(t * 0.9) * 0.012) + 'rad)'; }
  }
  requestAnimationFrame(tick);
}
