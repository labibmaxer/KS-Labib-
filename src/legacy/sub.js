export function initSub() {
  const TKEY = 'kslabib-theme';
  const html = document.documentElement;
  const applyTheme = (t) => {
    html.dataset.theme = t;
    const m = document.getElementById('tmoon'), s = document.getElementById('tsun');
    if (m) m.style.display = t === 'dark' ? 'block' : 'none';
    if (s) s.style.display = t === 'dark' ? 'none' : 'block';
  };
  let saved = null; try { saved = localStorage.getItem(TKEY); } catch (e) {}
  applyTheme(saved || html.dataset.theme || 'dark');
  const tb = document.getElementById('tbtn');
  if (tb) tb.addEventListener('click', () => { const n = html.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(n); try { localStorage.setItem(TKEY, n); } catch (e) {} });
  window.addEventListener('scroll', () => {
    const sh = document.body.scrollHeight - innerHeight, pct = sh > 0 ? (window.scrollY / sh * 100) : 0;
    const p = document.getElementById('prog'); if (p) p.style.width = pct + '%';
    const n = document.getElementById('nav'); if (n) n.classList.toggle('sc', window.scrollY > 60);
  }, { passive: true });
  const ro = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: .06 });
  document.querySelectorAll('.reveal').forEach((el) => ro.observe(el));
  const trans = document.getElementById('page-trans');
  if (trans) {
    trans.classList.add('show'); setTimeout(() => trans.classList.remove('show'), 80);
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a'); if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || a.target === '_blank' || href.startsWith('/admin') || /^(mailto|tel):/.test(href)) return;
      if (href.startsWith('http') && !href.includes(location.hostname)) return;
      e.preventDefault(); trans.classList.add('show'); setTimeout(() => { window.location = href; }, 360);
    });
  }
  window.addEventListener('pageshow', (e) => { if (e.persisted && trans) trans.classList.remove('show'); });
  document.querySelectorAll('.pf').forEach((btn) => btn.addEventListener('click', () => {
    document.querySelectorAll('.pf').forEach((b) => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('on'); btn.setAttribute('aria-pressed', 'true');
    const f = btn.dataset.f; let shown = 0;
    document.querySelectorAll('#pgrid .proj-card').forEach((c) => { const ok = f === 'all' || c.dataset.type === f; c.style.display = ok ? '' : 'none'; if (ok) shown++; });
    const cnt = document.getElementById('total-count'); if (cnt) cnt.textContent = shown;
  }));
}
