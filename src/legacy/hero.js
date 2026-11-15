export function initHero(){
/* ── WORD SCRAMBLE ── */
(function(){
  var WORDS=(window.__HERO_WORDS&&window.__HERO_WORDS.length)?window.__HERO_WORDS:['fast.'];
  var SCHARS='!<>-_\\/[]{}—=+*^?#';
  var wordEl=document.getElementById('hw');
  var wIdx=0;
  function scramble(target){
    if(!wordEl)return;
    var q=Array.from({length:Math.max(wordEl.textContent.length,target.length)},function(_,i){return{to:target[i]||'',start:Math.floor(Math.random()*7),end:7+Math.floor(Math.random()*9),ch:''};});
    var f=0;
    (function tick(){
      var out='',done=0;
      q.forEach(function(qi){
        if(f>=qi.end){out+=qi.to;done++;}
        else if(f>=qi.start){if(!qi.ch||Math.random()<.28)qi.ch=SCHARS[Math.floor(Math.random()*SCHARS.length)];out+='<span style="opacity:.35">'+qi.ch+'</span>';}
        else out+=qi.to||'';
      });
      wordEl.innerHTML=out;
      if(done<q.length){f++;requestAnimationFrame(tick);}
    })();
  }
  setInterval(function(){wIdx=(wIdx+1)%WORDS.length;scramble(WORDS[wIdx]);},3200);
})();
 
/* ── THREE.JS PARTICLE HERO ── */
window.initHero3D = function(){
  var mount=document.getElementById('hero3dMount');
  if(!mount)return;
  if(mount.children.length > 0) return;
  /* Skip entirely on touch/mobile devices */
  if('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  function initThree(){
    if(!mount)return;
 
  var W=mount.clientWidth||480;
  var H=mount.clientHeight||480;
 
  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(60,W/H,0.1,1000);
  camera.position.z=5;
 
  var renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0x000000,0);
  mount.appendChild(renderer.domElement);
 
  var mouse=new THREE.Vector2(0,0);
  var targetMouse=new THREE.Vector2(0,0); /* lerp target */
  var isOver=false;
  var clock=new THREE.Clock();
 
  function isDark(){return document.documentElement.dataset.theme!=='light';}
 
  var COUNT = window.innerWidth < 1200 ? 18000 : 32000;
  var pos=new Float32Array(COUNT*3);
  var orig=new Float32Array(COUNT*3);
  var col=new Float32Array(COUNT*3);
  var vel=new Float32Array(COUNT*3);
 
  var geo=new THREE.BufferGeometry();
  var knotGeo=new THREE.TorusKnotGeometry(1.4,0.45,180,28);
  var kp=knotGeo.attributes.position;
 
  for(var i=0;i<COUNT;i++){
    var vi=i%kp.count;
    var x=kp.getX(vi)+(Math.random()-.5)*0.05;
    var y=kp.getY(vi)+(Math.random()-.5)*0.05;
    var z=kp.getZ(vi)+(Math.random()-.5)*0.05;
    pos[i*3]=orig[i*3]=x;
    pos[i*3+1]=orig[i*3+1]=y;
    pos[i*3+2]=orig[i*3+2]=z;
  }
 
  function buildColors(){
    var dark=isDark();
    for(var i=0;i<COUNT;i++){
      var r=Math.random();
      if(dark){
        if(r<.55){var v=0.82+Math.random()*.18;col[i*3]=v;col[i*3+1]=v;col[i*3+2]=v;}
        else if(r<.8){var v=0.45+Math.random()*.2;col[i*3]=v;col[i*3+1]=v;col[i*3+2]=v;}
        else{col[i*3]=0.88+Math.random()*.12;col[i*3+1]=0.78+Math.random()*.1;col[i*3+2]=0.52+Math.random()*.15;}
      } else {
        if(r<.55){var v=0.06+Math.random()*.12;col[i*3]=v;col[i*3+1]=v;col[i*3+2]=v;}
        else if(r<.8){var v=0.28+Math.random()*.18;col[i*3]=v;col[i*3+1]=v;col[i*3+2]=v;}
        else{col[i*3]=0.3+Math.random()*.08;col[i*3+1]=0.24+Math.random()*.06;col[i*3+2]=0.1+Math.random()*.06;}
      }
    }
  }
  buildColors();
 
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
 
  function makeMat(){
    return new THREE.PointsMaterial({
      size:isDark()?0.022:0.018,
      vertexColors:true,
      blending:isDark()?THREE.AdditiveBlending:THREE.NormalBlending,
      transparent:true,
      opacity:isDark()?0.85:0.92,
      depthWrite:false
    });
  }
  var mat=makeMat();
  var points=new THREE.Points(geo,mat);
  scene.add(points);
 
  new MutationObserver(function(){
    buildColors();
    geo.attributes.color.needsUpdate=true;
    scene.remove(points);
    mat.dispose();
    mat=makeMat();
    points=new THREE.Points(geo,mat);
    scene.add(points);
  }).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 
  /* Mouse — lerp to zero when not hovering */
  function setMouse(cx,cy){
    var r=mount.getBoundingClientRect();
    targetMouse.x=((cx-r.left)/r.width)*2-1;
    targetMouse.y=-((cy-r.top)/r.height)*2+1;
  }
  mount.addEventListener('mousemove',function(e){isOver=true;setMouse(e.clientX,e.clientY);},{passive:true});
  mount.addEventListener('mouseleave',function(){isOver=false;targetMouse.set(0,0);});
  mount.addEventListener('touchmove',function(e){if(e.touches.length){isOver=true;setMouse(e.touches[0].clientX,e.touches[0].clientY);}},{passive:true});
  mount.addEventListener('touchend',function(){isOver=false;targetMouse.set(0,0);});
 
  var mw=new THREE.Vector3();
  var LERP=0.06; /* how fast mouse position lerps — lower = smoother return */
 
  function animate(){
    requestAnimationFrame(animate);
    var t=clock.getElapsedTime();
 
    /* Smoothly lerp mouse toward target (0,0 when cursor left) */
    mouse.x+=(targetMouse.x-mouse.x)*LERP;
    mouse.y+=(targetMouse.y-mouse.y)*LERP;
 
    mw.set(mouse.x*2.6,mouse.y*2.6,0);
 
    var p=geo.attributes.position.array;
    /* AFTER */
  var RAD=1.3,F=0.013,RET=0.0015,DAMP=0.93;
 
    for(var i=0;i<COUNT;i++){
      var ix=i*3,iy=i*3+1,iz=i*3+2;
      var dx=p[ix]-mw.x,dy=p[iy]-mw.y,dz=p[iz]-mw.z;
      var d=Math.sqrt(dx*dx+dy*dy+dz*dz);
      if(d<RAD){var f=(RAD-d)*F,il=1/Math.max(d,0.001);vel[ix]+=dx*il*f;vel[iy]+=dy*il*f;vel[iz]+=dz*il*f;}
      vel[ix]+=(orig[ix]-p[ix])*RET;
      vel[iy]+=(orig[iy]-p[iy])*RET;
      vel[iz]+=(orig[iz]-p[iz])*RET;
      vel[ix]*=DAMP;vel[iy]*=DAMP;vel[iz]*=DAMP;
      p[ix]+=vel[ix];p[iy]+=vel[iy];p[iz]+=vel[iz];
    }
 
    geo.attributes.position.needsUpdate=true;
    points.rotation.y=t*0.048;
    points.rotation.x=Math.sin(t*0.02)*0.14;
    renderer.render(scene,camera);
  }
  animate();
 
  /* AFTER */
  window.addEventListener('resize',function(){
    W=mount.clientWidth||480;H=mount.clientHeight||480;
    camera.aspect=W/H;camera.updateProjectionMatrix();
    renderer.setSize(W,H);
    renderer.domElement.style.width='100%';
    renderer.domElement.style.height='100%';
  },{passive:true});
 
 document.addEventListener('visibilitychange',function(){
      if(document.hidden)clock.stop();else clock.start();
    });
  }

  /* If THREE already loaded, init now. Otherwise wait for script to load. */
  if(typeof THREE !== 'undefined'){
    initThree();
  } else {
    var s=document.querySelector('script[src*="three.min.js"]');
    if(s){
      s.addEventListener('load', initThree);
    } else {
      /* Fallback: poll until THREE is available */
      var poll=setInterval(function(){
        if(typeof THREE!=='undefined'){clearInterval(poll);initThree();}
      },50);
      setTimeout(function(){clearInterval(poll);},5000);
    }
  }
};
window.initHero3D(); 
}
