export function initMain(){
// ── LOADER + TETRIS ──────────────────────────────────────
(()=>{
  const fill=document.getElementById('ldf'),num=document.getElementById('ldn'),tagline=document.getElementById('ld-tagline');
  const TAGS=['Getting things ready…','Loading assets…','Almost there…','One moment…','Ready.'];
  let tagIdx=0;
  const tagTimer=setInterval(()=>{tagIdx=Math.min(tagIdx+1,TAGS.length-1);if(tagline)tagline.textContent=TAGS[tagIdx];},420);
  const t0=performance.now(),dur=1400,ease=t=>1-Math.pow(1-t,3);
  function tickProg(now){const p=Math.min((now-t0)/dur,1),v=Math.floor(ease(p)*100);if(fill)fill.style.width=v+'%';if(num)num.textContent=v+'%';if(p<1)requestAnimationFrame(tickProg);else{clearInterval(tagTimer);setTimeout(()=>document.getElementById('loader').classList.add('out'),200);}}
  requestAnimationFrame(tickProg);
  const cv=document.getElementById('tetris-canvas');if(!cv)return;
  const COLS=10,ROWS=18,CS=22;cv.width=COLS*CS;cv.height=ROWS*CS;
  const ctx=cv.getContext('2d');
  const PIECES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0],[1,0],[1,1]],[[0,1],[1,1],[1,0]],[[1,0],[1,1],[0,1]],[[0,1],[0,1],[1,1]]];
  let board=Array.from({length:ROWS},()=>Array(COLS).fill(0)),piece=null,px=0,py=0,lastT=0;const SPEED=18;
  function randPiece(){const s=PIECES[Math.floor(Math.random()*PIECES.length)];let sh=s;const rots=Math.floor(Math.random()*4);for(let i=0;i<rots;i++){const r=sh[0].length,c=sh.length;sh=Array.from({length:r},(_,ri)=>Array.from({length:c},(_,ci)=>sh[c-1-ci][ri]));}return sh;}
  function spawn(){piece=randPiece();px=Math.floor((COLS-piece[0].length)/2);py=-piece.length;}
  function fits(sh,x,y){for(let r=0;r<sh.length;r++)for(let c=0;c<sh[r].length;c++){if(!sh[r][c])continue;const nx=x+c,ny=y+r;if(nx<0||nx>=COLS||ny>=ROWS)return false;if(ny>=0&&board[ny][nx])return false;}return true;}
  function lock(){for(let r=0;r<piece.length;r++)for(let c=0;c<piece[r].length;c++){if(!piece[r][c])continue;const ny=py+r;if(ny>=0)board[ny][px+c]=1;}board=board.filter(row=>!row.every(v=>v));while(board.length<ROWS)board.unshift(Array(COLS).fill(0));const f=board.slice(0,3).reduce((a,r)=>a+r.filter(v=>v).length,0);if(f>COLS*1.5)board=Array.from({length:ROWS},()=>Array(COLS).fill(0));spawn();}
  function draw(){ctx.clearRect(0,0,cv.width,cv.height);ctx.strokeStyle='rgba(255,255,255,0.065)';ctx.lineWidth=0.55;for(let r=0;r<=ROWS;r++){ctx.beginPath();ctx.moveTo(0,r*CS);ctx.lineTo(COLS*CS,r*CS);ctx.stroke();}for(let c=0;c<=COLS;c++){ctx.beginPath();ctx.moveTo(c*CS,0);ctx.lineTo(c*CS,ROWS*CS);ctx.stroke();}for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){if(!board[r][c])continue;ctx.fillStyle='rgba(245,245,245,0.9)';ctx.fillRect(c*CS+1,r*CS+1,CS-2,CS-2);ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(c*CS+2,r*CS+2,CS-8,2);}if(piece){for(let r=0;r<piece.length;r++)for(let c=0;c<piece[r].length;c++){if(!piece[r][c])continue;const nx=px+c,ny=py+r;if(ny<0)continue;ctx.fillStyle='rgba(245,245,245,1)';ctx.fillRect(nx*CS+1,ny*CS+1,CS-2,CS-2);ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fillRect(nx*CS+2,ny*CS+2,CS-8,2);}}}
  spawn();
  let tetrisStopped=false;
  function loop(now){if(tetrisStopped)return;if(now-lastT>=SPEED){lastT=now;if(piece){if(fits(piece,px,py+1))py++;else lock();}else spawn();}draw();requestAnimationFrame(loop);}
  requestAnimationFrame(loop);
  setTimeout(()=>{tetrisStopped=true;if(cv)ctx.clearRect(0,0,cv.width,cv.height);},1600);

  
})();

// ── THEME ────────────────────────────────────────────────
const TKEY='kslabib-theme';
function applyTheme(t){document.documentElement.dataset.theme=t;document.getElementById('tmoon').style.display=t==='dark'?'block':'none';document.getElementById('tsun').style.display=t==='dark'?'none':'block';}
function toggleTheme(){const n=document.documentElement.dataset.theme==='dark'?'light':'dark';const flash=document.getElementById('theme-flash');const btn=document.getElementById('tbtn');if(flash){flash.classList.add('flash');setTimeout(()=>flash.classList.remove('flash'),260);}if(btn){btn.classList.add('toggling');setTimeout(()=>btn.classList.remove('toggling'),400);}applyTheme(n);localStorage.setItem(TKEY,n);showToast(n==='dark'?'Dark mode':'Light mode');}
const sv=localStorage.getItem(TKEY);if(sv)applyTheme(sv);

// ── SCROLL / NAV ─────────────────────────────────────────
window.addEventListener('scroll',()=>{
  const sh=document.body.scrollHeight-innerHeight,pct=sh>0?(window.scrollY/sh*100):0;
  const prog=document.getElementById('prog');prog.style.width=pct+'%';prog.setAttribute('aria-valuenow',Math.round(pct));
  document.getElementById('nav').classList.toggle('sc',window.scrollY>60);
  const btt=document.getElementById('btt');if(btt)btt.classList.toggle('visible',window.scrollY>600);
  const fab=document.getElementById('fab');if(fab)fab.classList.toggle('visible',window.scrollY>400);
  const al=document.getElementById('admin-link');if(al)al.classList.toggle('visible',window.scrollY>300);
},{passive:true});

// ── MOBILE NAV ───────────────────────────────────────────
function tmn(){const h=document.getElementById('hbg'),m=document.getElementById('mnav');const open=!m.classList.contains('o');h.classList.toggle('o');m.classList.toggle('o');m.setAttribute('aria-hidden',!open);h.setAttribute('aria-expanded',open);document.body.style.overflow=open?'hidden':'';}
function cmn(){const h=document.getElementById('hbg'),m=document.getElementById('mnav');h.classList.remove('o');m.classList.remove('o');m.setAttribute('aria-hidden','true');h.setAttribute('aria-expanded','false');document.body.style.overflow='';}

// ── REVEAL ───────────────────────────────────────────────
const ro=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target);}});},{threshold:.06,rootMargin:'0px 0px -16px 0px'});
window.ro = ro;
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// ── SVC LIST STAGGER ─────────────────────────────────────
document.querySelectorAll('.svc-list li').forEach((li,i)=>{
  li.style.transitionDelay=(i*60)+'ms';
  const obs=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){li.classList.add('in');obs.disconnect();}},{threshold:.2});
  obs.observe(li);
});

// ── RESIZE ───────────────────────────────────────────────
window.addEventListener('resize',()=>{if(innerWidth>960&&document.getElementById('mnav').classList.contains('o'))cmn();},{passive:true});

// ── WORD SCRAMBLE ─────────────────────────────────────────
/*const WORDS=['move.','feel.','flow.','land.','glow.'];
const SCHARS='!<>-_\\/[]{}—=+*^?#';
const wordEl=document.getElementById('hw');
let wIdx=0;
function scramble(target){if(!wordEl)return;const q=Array.from({length:Math.max(wordEl.textContent.length,target.length)},(_,i)=>({to:target[i]||'',start:Math.floor(Math.random()*7),end:7+Math.floor(Math.random()*9),ch:''}));let f=0;(function tick(){let out='',done=0;q.forEach(qi=>{if(f>=qi.end){out+=qi.to;done++;}else if(f>=qi.start){if(!qi.ch||Math.random()<.28)qi.ch=SCHARS[Math.floor(Math.random()*SCHARS.length)];out+=`<span style="opacity:.35">${qi.ch}</span>`;}else out+=qi.to||'';});wordEl.innerHTML=out;if(done<q.length){f++;requestAnimationFrame(tick);}})();}
setInterval(()=>{wIdx=(wIdx+1)%WORDS.length;scramble(WORDS[wIdx]);},3200);*/

// ── HERO COUNTER ─────────────────────────────────────────
(()=>{
  const hfc=document.getElementById('hfc1');if(!hfc)return;let done=false;
  const obs=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting||done)return;done=true;const t0=performance.now(),dur=1400;(function tick(now){const p=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-p,3);hfc.textContent=Math.round(ease*80)+'+';if(p<1)requestAnimationFrame(tick);})(performance.now());},{threshold:.5});
  obs.observe(hfc);
})();
// ── SERVICES SWITCHER ─────────────────────────────────
(()=>{
  const tabs = document.querySelectorAll('.svc-tab');
  const panels = document.querySelectorAll('.svc-panel');
  let current = (document.querySelector('.svc-tab.active')||{dataset:{}}).dataset.svc;

  function switchTo(id) {
    if (id === current) return;
    // hide current
    const old = document.querySelector('.svc-panel.active');
    const oldTab = document.querySelector('.svc-tab.active');
    if (old) { old.classList.remove('visible'); setTimeout(()=>{ old.classList.remove('active'); }, 80); }
    if (oldTab) { oldTab.classList.remove('active'); oldTab.setAttribute('aria-selected','false'); }
    // show new
    const next = document.getElementById('svc-panel-'+id);
    const nextTab = document.querySelector('[data-svc="'+id+'"]');
    if (next) {
      setTimeout(()=>{
        next.classList.add('active');
        // trigger reflow then animate in
        requestAnimationFrame(()=>{ requestAnimationFrame(()=>{ next.classList.add('visible'); }); });
      }, 90);
    }
    if (nextTab) { nextTab.classList.add('active'); nextTab.setAttribute('aria-selected','true'); }
    // re-run list item stagger
    if (next) {
      next.querySelectorAll('.svc-list li').forEach((li,i)=>{
        li.style.opacity='0';li.style.transform='translateX(-8px)';
        setTimeout(()=>{ li.style.transition='opacity .4s, transform .4s var(--sp)'; li.style.opacity='1'; li.style.transform='none'; }, 200 + i*60);
      });
    }
    current = id;
  }

  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>switchTo(tab.dataset.svc));
  });

  // init first panel visible
  const first = document.querySelector('.svc-panel.active');
  if (first) requestAnimationFrame(()=>requestAnimationFrame(()=>first.classList.add('visible')));
  // init first list items
  if (first) first.querySelectorAll('.svc-list li').forEach((li,i)=>{
    li.style.transitionDelay=(i*60)+'ms';
    li.style.opacity='1'; li.style.transform='none';
  });
})();

/* ── STATS COUNTER ── */
(()=>{
  const stats = document.querySelectorAll('.stat[data-target]');
  if (!stats.length) return;
  let fired = false;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || fired) return;
    fired = true;
    obs.disconnect();
    stats.forEach(stat => {
      const target  = parseFloat(stat.dataset.target);
      const isFloat = stat.dataset.decimal === 'true';
      const el      = stat.querySelector('.stat-num');
      if (!el) return;
      const dur = 1600, start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const v = ease(p) * target;
        el.textContent = isFloat ? v.toFixed(1) : Math.floor(v);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = isFloat ? target.toFixed(1) : target;
      })(start);
    });
  }, { threshold: 0.3 });
  const section = document.querySelector('.stats');
  if (section) obs.observe(section);
})();

/* ── SVC NUM PARALLAX ── */
const svcNums=Array.from(document.querySelectorAll('.svc-num'));
if(svcNums.length){let _pTick=false;window.addEventListener('scroll',()=>{if(_pTick)return;_pTick=true;requestAnimationFrame(()=>{svcNums.forEach(num=>{const rect=num.parentElement.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));num.style.transform=`translateY(${(p-.5)*42}px)`;});_pTick=false;});},{passive:true});}


// ── TESTIMONIAL PERF ─────────────────────────────────────
/*const tcWrap=document.querySelector('.tc-wrap');
if(tcWrap){new IntersectionObserver(entries=>{document.querySelectorAll('.tci').forEach(c=>{c.style.animationPlayState=entries[0].isIntersecting?'running':'paused';});},{threshold:0}).observe(tcWrap);}

/* Pause marquees when out of view */
document.querySelectorAll('.mq,.tech-mq').forEach(mq=>{
  new IntersectionObserver(entries=>{
    mq.querySelectorAll('.mq-t,.tech-mq-t').forEach(t=>{
      t.style.animationPlayState=entries[0].isIntersecting?'running':'paused';
    });
  },{threshold:0}).observe(mq);
});

/* Pause mockup animations when out of view */
document.querySelectorAll('.vid-vis,.ae-vis,.web-vis').forEach(vis=>{
  new IntersectionObserver(entries=>{
    const state=entries[0].isIntersecting?'running':'paused';
    vis.querySelectorAll('.vs-playhead,.vs-rec,.vs-scene-bg,.vs-bar,.vs-overlay-text,.ae-s1,.ae-s2,.ae-s3,.ae-w1,.ae-w2,.ae-l1,.ae-l2,.ae-playhead,.wb-progress,.ws-cursor,.ws-inspect,.ws-lh-bar,.ws-typed').forEach(el=>{
      el.style.animationPlayState=state;
    });
  },{threshold:0}).observe(vis);
});

// ── NAV SECTION HIGHLIGHT ─────────────────────────────────
const navLinks=document.querySelectorAll('.nav-links a');
(()=>{
  let _active=null;
  const sections=Array.from(document.querySelectorAll('section[id]'));
  function update(){
    const mid=window.scrollY+window.innerHeight*.38;
    let best=null,bestTop=-Infinity;
    sections.forEach(s=>{
      const t=s.getBoundingClientRect().top+window.scrollY;
      if(t<=mid&&t>bestTop){bestTop=t;best=s.id;}
    });
    if(best&&best!==_active){
      _active=best;
      navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+best));
    }
  }
  window.addEventListener('scroll',update,{passive:true});
  update();
})();


async function submitLead(e) {
  e.preventDefault();
  const btn   = document.getElementById('cf-submit');
  const lbl   = document.getElementById('cf-btn-label');
  const errEl = document.getElementById('cf-error');
  const ARROW = '<svg id="cf-btn-icon" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
  const showErr = (m) => { if (errEl) { errEl.textContent = m; errEl.style.display = 'block'; } };
  if (errEl) errEl.style.display = 'none';
  const name    = document.getElementById('cf-name').value.trim();
  const type    = document.getElementById('cf-type').value;
  const contact = document.getElementById('cf-contact').value.trim();
  const budget  = document.getElementById('cf-budget').value;
  const msg     = document.getElementById('cf-msg').value.trim();
  const consent = document.getElementById('cf-consent').checked;
  const hp      = (document.getElementById('cf-hp')||{}).value || '';
  if (!name || !type || !contact || !msg) {
    showErr('Please fill in your name, project type, contact details and message.');
    btn.style.transform = 'translateX(-4px)'; setTimeout(() => btn.style.transform = '', 300);
    return;
  }
  if (!consent) { showErr('Please tick the consent box so I can store your details and reply.'); return; }
  btn.disabled = true; lbl.textContent = 'Sending…';
  const iconEl = document.getElementById('cf-btn-icon');
  if (iconEl) iconEl.outerHTML = '<div class="cf-spinner" id="cf-btn-icon"></div>';
  let ok = false;
  try {
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, project_type: type, budget, contact, message: msg, hp }) });
    const json = await res.json().catch(() => ({}));
    ok = !!json.ok;
  } catch (err) { console.error('[contact]', err); }
  if (ok) {
    document.getElementById('cf-form-state').style.display = 'none';
    document.getElementById('cf-success').style.display = 'block';
  } else {
    btn.disabled = false; lbl.textContent = 'Send Message';
    const sp = document.getElementById('cf-btn-icon'); if (sp) sp.outerHTML = ARROW;
    showErr('Could not send your message. Please try again, or email me directly using the link below.');
  }
}
const cf = document.getElementById('cta-form'); if (cf) cf.addEventListener('submit', submitLead);

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    // open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

window.scrollToSection=id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});};
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1);if(!id)return;const t=document.getElementById(id);if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}});});

const toastEl=document.getElementById('toast');let toastTimer;
window.showToast=function(msg){if(!toastEl)return;toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2400);};

document.addEventListener('visibilitychange',()=>{
  const p=document.hidden;
  document.querySelectorAll('.tci,.mq-t,.tech-mq-t,.vs-playhead,.ae-playhead,.vs-rec,.ae-shape,.ae-word,.ae-line,.ws-cursor,.ws-inspect,.ws-lh-bar,.wb-progress').forEach(el=>{
    el.style.animationPlayState=p?'paused':'running';
  });
});
if(matchMedia('(prefers-reduced-motion:reduce)').matches){const s=document.createElement('style');s.textContent='*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;}';document.head.appendChild(s);}
const yr=document.getElementById('footer-yr');if(yr)yr.textContent=new Date().getFullYear();
document.querySelectorAll('img:not([loading])').forEach(img=>img.setAttribute('loading','lazy'));

/* ── PRICING TOGGLE ── */
function setBilling(type) {
  document.querySelectorAll('.pr-toggle-btn').forEach(b => b.classList.toggle('on', b.dataset.billing === type));
  const isRetainer = type === 'retainer';
  document.querySelectorAll('.pr-price').forEach(priceWrap => {
    const id = priceWrap.id.replace('price-', '');
    const priceEl = priceWrap.querySelector('span');
    const noteEl  = document.getElementById(`note-${id}`);
    if (!priceEl) return;
    const target = parseInt(priceEl.dataset[type]);
    const current = parseInt(priceEl.textContent.replace(/,/g,''));
    const dur = 500, start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      priceEl.textContent = Math.round(current + (target - current) * ease(p));
      if (p < 1) requestAnimationFrame(tick);
      else priceEl.textContent = target;
    })(start);
    if (noteEl) noteEl.textContent = isRetainer ? '// per month · cancel anytime' : '// starting price per project';
  });
}


/* ── CUSTOM CURSOR ── */
(()=>{
  if('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if(!dot || !ring) return;

  dot.style.display = 'block'; document.documentElement.classList.add('has-cursor');
  ring.style.display = 'block';

  let mx=0, my=0, rx=0, ry=0, raf;

  document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
}, { passive: true });

(function lerp() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(lerp);
})();

  document.addEventListener('mouseenter', () => document.body.classList.remove('cur-hidden'));
  document.addEventListener('mouseleave', () => document.body.classList.add('cur-hidden'));
  document.addEventListener('mousedown',  () => document.body.classList.add('cur-clicking'));
  document.addEventListener('mouseup',    () => document.body.classList.remove('cur-clicking'));

  const hoverEls = 'a, button, .proj-card, .tm-card, .stat, .pf, .pr-card, .faq-q, .svc-tab, .tcard, .iBtn, input, textarea, select, label';
  document.addEventListener('mouseover', e => {
    if(e.target.closest(hoverEls)) document.body.classList.add('cur-hovering');
  });
  document.addEventListener('mouseout', e => {
    if(e.target.closest(hoverEls)) document.body.classList.remove('cur-hovering');
  });
})();


/* ── PAGE TRANSITIONS ── */
(()=>{
  const trans = document.getElementById('page-trans');
  if(!trans) return;
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || a.target === '_blank' || href.startsWith('/admin') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if(href.startsWith('http') && !href.includes(location.hostname)) return;
    e.preventDefault();
    trans.classList.add('show');
    setTimeout(()=> window.location = href, 360);
  });
})();


/* ── FORCE LOADER ON BACK NAVIGATION ── */
window.addEventListener('pageshow', e => {
  if (e.persisted) {
    document.getElementById('loader').classList.remove('out');
    const fill = document.getElementById('ldf');
    const num  = document.getElementById('ldn');
    if (fill) fill.style.width = '0%';
    if (num)  num.textContent  = '0%';

    const t0 = performance.now(), dur = 1400, ease = t => 1 - Math.pow(1 - t, 3);
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1), v = Math.floor(ease(p) * 100);
      if (fill) fill.style.width = v + '%';
      if (num)  num.textContent  = v + '%';
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => document.getElementById('loader').classList.add('out'), 200);
    })(performance.now());
  }
});

/* ── WHATSAPP BTN ── */
const waBtn = document.getElementById('wa-btn');
window.addEventListener('scroll', ()=>{
  if(waBtn) waBtn.style.opacity = window.scrollY > 400 ? '1' : '0';
  if(waBtn) waBtn.style.transform = window.scrollY > 400 ? 'translateY(0)' : 'translateY(12px)';
},{passive:true});

/* ── PRICING TOGGLE BIND ── */
document.querySelectorAll('.pr-toggle-btn').forEach(b=>b.addEventListener('click',()=>setBilling(b.dataset.billing)));
/* ── PROJECT FILTERS ── */
document.querySelectorAll('.pf').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.pf').forEach(b=>{b.classList.remove('on');b.setAttribute('aria-pressed','false');});
    btn.classList.add('on');btn.setAttribute('aria-pressed','true');
    const f=btn.dataset.f;let shown=0;
    document.querySelectorAll('#pgrid .proj-card').forEach(c=>{const ok=f==='all'||c.dataset.type===f;c.style.display=ok?'':'none';if(ok)shown++;});
    const em=document.getElementById('pgrid-empty');if(em)em.style.display=shown?'none':'block';
  });
});
/* ── MOBILE NAV LINKS ── */
document.querySelectorAll('#mnav a').forEach(a=>a.addEventListener('click',cmn));
const _tb=document.getElementById('tbtn');if(_tb)_tb.addEventListener('click',toggleTheme);
const _hb=document.getElementById('hbg');if(_hb)_hb.addEventListener('click',tmn);
const _bt=document.getElementById('btt');if(_bt)_bt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
applyTheme(document.documentElement.dataset.theme||'dark');

}
