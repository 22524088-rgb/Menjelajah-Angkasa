/*
  UCAPAN ULANG TAHUN — V2
  FIREWORKS → TEXT PARTICLES → WARP → PARTICLE PLANET → HEART ORBIT → PHOTOS → MESSAGES
*/

const CONFIG = {
  title: "Selamat Ulang Tahun Sayanggggkuu ❤️",
  subtitle: "Di antara miliaran bintang di semesta, ada satu orang yang ingin selalu aku lihat bersinar. Hari ini adalah tentang kamu.",
  messages: [
    { title: "Untuk Kamu ♡", text: "Selamat ulang tahun, sayanggggkuu. Semoga semua hal baik yang kamu semogakan perlahan datang kepadamu. Semoga kamu selalu dikelilingi kebahagiaan, kesehatan, ketenangan, dan orang-orang yang benar-benar menyayangimu." },
    { title: "Terima Kasih", text: "Terima kasih sudah hadir dan menjadi bagian dari perjalanan hidupku. Terima kasih untuk setiap cerita, tawa, perhatian, dan momen-momen kecil yang mungkin sederhana tetapi selalu berarti buatku." },
    { title: "Kalau Kita Adalah Semesta", text: "Kalau hidup ini adalah sebuah galaksi, mungkin kita hanya dua titik kecil di antara miliaran bintang. Tapi aku tetap bersyukur karena semesta mempertemukan kita di tempat dan waktu yang sama." },
    { title: "Untuk Semua Mimpi Kamu", text: "Semoga satu per satu mimpi kamu menemukan jalannya. Jangan takut berjalan pelan. Tidak semua bintang harus bersinar paling terang untuk menjadi indah." },
    { title: "Dan Untuk Kita", text: "Semoga akan ada lebih banyak cerita setelah hari ini. Lebih banyak foto, lebih banyak perjalanan, lebih banyak tawa, dan lebih banyak alasan untuk berkata: ternyata kita sudah sejauh ini." }
  ],
  finalTitle: "Selamat ulang tahun, sayanggggkuu. ♡",
  finalText: "Aku mungkin tidak bisa memberikan seluruh alam semesta kepadamu. Tapi kalau aku bisa, aku akan memberimu satu galaksi penuh dengan semua hal baik yang kamu pantas dapatkan. Tetaplah menjadi kamu. Terima kasih sudah menjadi bagian dari semestaku.",
  photos: ["foto/FOTO1.jpg","foto/FOTO2.jpg","foto/FOTO3.jpg","foto/FOTO4.jpg","foto/FOTO5 (1).jpg","foto/FOTO6 (2).jpg","foto/FOTO7.jpg","foto/FOTO8.jpg","foto/FOTO9.jpg"],
  music: "music/about-you.mp3"
};

const intro = document.getElementById('intro');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const universe = document.getElementById('universe');
const warp = document.getElementById('warp');
const introHint = document.getElementById('introHint');
const audio = new Audio(CONFIG.music);
audio.loop = true; audio.volume = .55;

let W=0,H=0,dpr=1,started=false,finished=false,startTime=0,stage=-1;
let rockets=[], fireworks=[], textParticles=[];
let spaceCanvas, spaceCtx, spaceW=0,spaceH=0, spaceStars=[], rockDust=[], heartParticles=[];
let spaceStarted=false, spaceTime=0, photoAngle=0;

function resize(){
  dpr=Math.min(window.devicePixelRatio||1,1.35); W=innerWidth; H=innerHeight;
  canvas.width=Math.floor(W*dpr); canvas.height=Math.floor(H*dpr);
  canvas.style.width=W+'px'; canvas.style.height=H+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  if(spaceCanvas){
    spaceW=spaceCanvas.clientWidth; spaceH=spaceCanvas.clientHeight;
    spaceCanvas.width=Math.floor(spaceW*dpr); spaceCanvas.height=Math.floor(spaceH*dpr);
    spaceCtx.setTransform(dpr,0,0,dpr,0,0);
  }
}
addEventListener('resize',resize); resize();
const rnd=(a,b)=>Math.random()*(b-a)+a;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=t=>1-Math.pow(1-t,3);
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');

// Lightweight fireworks: fewer objects + capped pixel ratio prevents the opening from lagging.
function rocket(){
  if(rockets.length>5)return;
  rockets.push({x:rnd(W*.12,W*.88),y:H+18,target:rnd(H*.13,H*.58),speed:rnd(7,10),h:rnd(300,355)});
}
function explode(x,y,h,count=75){
  for(let i=0;i<count;i++){
    const a=rnd(0,Math.PI*2),s=rnd(1,4.8);
    fireworks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:rnd(.012,.025),g:.025,h:h+rnd(-18,18),r:rnd(.7,1.6)});
  }
}
function drawFireworks(){
  ctx.fillStyle='rgba(2,0,10,.25)'; ctx.fillRect(0,0,W,H);
  if(Math.random()<.065)rocket();
  for(let i=rockets.length-1;i>=0;i--){
    const r=rockets[i]; r.y-=r.speed; r.speed*=.997;
    ctx.beginPath();ctx.arc(r.x,r.y,1.6,0,Math.PI*2);
    ctx.fillStyle=`hsla(${r.h},100%,82%,.9)`;ctx.fill();
    if(r.y<r.target){explode(r.x,r.y,r.h);rockets.splice(i,1);}
  }
  for(let i=fireworks.length-1;i>=0;i--){
    const p=fireworks[i];p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy=p.vy*.985+p.g;p.life-=p.decay;
    if(p.life<=0){fireworks.splice(i,1);continue;}
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`hsla(${p.h},100%,${70+p.life*25}%,${p.life*.85})`;ctx.fill();
  }
}

function makeTextParticles(text){
  const b=document.createElement('canvas'), c=b.getContext('2d');
  const bw=Math.min(W*.9,1000), bh=Math.min(H*.28,220);
  b.width=Math.floor(bw); b.height=Math.floor(bh);
  let fs=Math.min(H*.13,Math.max(42,bw/(text.length*.62)));
  if(text==='SAYANGGGGKU') fs=Math.min(fs,H*.105);
  c.font=`900 ${Math.floor(fs)}px Arial Black, Arial, sans-serif`;
  c.textAlign='center'; c.textBaseline='middle'; c.fillStyle='#fff'; c.fillText(text,bw/2,bh/2);
  const data=c.getImageData(0,0,b.width,b.height).data;
  const step=Math.max(5,Math.round(Math.min(W,H)/155));
  const targets=[];
  for(let y=0;y<b.height;y+=step){
    for(let x=0;x<b.width;x+=step){
      if(data[(y*b.width+x)*4+3]>180) targets.push({x:x+(W-bw)/2,y:y+H*.43});
    }
  }
  // Keep a predictable particle count for smooth animation.
  const max=650;
  if(targets.length>max){
    const reduced=[]; const stride=targets.length/max;
    for(let i=0;i<max;i++) reduced.push(targets[Math.floor(i*stride)]);
    targets.length=0; targets.push(...reduced);
  }
  textParticles=targets.map((t,i)=>({
    x:rnd(W*.15,W*.85), y:rnd(H*.18,H*.78), tx:t.x, ty:t.y,
    p:rnd(0,.22), delay:i/targets.length*.18, size:rnd(1.15,2.1),
    color:i%3
  }));
}
function drawTextParticles(elapsed){
  const colors=['255,255,255','255,135,220','198,135,255'];
  for(const p of textParticles){
    p.p=Math.min(1,p.p+.045);
    const q=clamp((p.p-p.delay)/(1-p.delay),0,1), e=ease(q);
    const x=p.x+(p.tx-p.x)*e, y=p.y+(p.ty-p.y)*e;
    const alpha=.25+.75*q;
    ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);
    ctx.fillStyle=`rgba(${colors[p.color]},${alpha})`;
    ctx.fill();
  }
}

function clearIntro(){
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle='#020008';ctx.fillRect(0,0,W,H);
}

function introLoop(t){
  if(!started||finished)return;
  if(!startTime)startTime=t;
  const e=t-startTime;
  clearIntro();

  if(e<2500) drawFireworks();

  if(e>=1900 && stage<0){ stage=0; makeTextParticles('SELAMAT'); }
  if(e>=1900 && e<4000) drawTextParticles(e);

  if(e>=4000 && stage<1){ stage=1; makeTextParticles('ULANG TAHUN'); }
  if(e>=4000 && e<6200) drawTextParticles(e);

  if(e>=6200 && stage<2){ stage=2; makeTextParticles('SAYANGGGGKU'); }
  if(e>=6200 && e<9000) drawTextParticles(e);

  // Clean camera/warp: text particles expand toward the viewer instead of stacking with new text.
  if(e>=8400 && e<10500){
    const k=1+clamp((e-8400)/2100,0,1)*5;
    ctx.save();
    ctx.translate(W/2,H*.47); ctx.scale(k,k); ctx.translate(-W/2,-H*.47);
    drawTextParticles(e); ctx.restore();
    const a=clamp((e-9000)/1500,0,1);
    const g=ctx.createRadialGradient(W/2,H*.47,20,W/2,H*.47,Math.max(W,H)*.75);
    g.addColorStop(0,`rgba(255,255,255,${a*.95})`);g.addColorStop(1,`rgba(130,20,180,${a*.35})`);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  }
  if(e>=10300)finishIntro();
  requestAnimationFrame(introLoop);
}

function finishIntro(){
  if(finished)return; finished=true; introHint.textContent='welcome to our universe ♡'; warp.classList.add('active'); universe.classList.add('visible');
  setTimeout(()=>intro.classList.add('fly-away'),250);
  setTimeout(()=>startSpace(),900);
}

function setupSpaceCanvas(){
  if(spaceCanvas)return; spaceCanvas=document.createElement('canvas'); spaceCanvas.id='spaceParticles'; document.querySelector('.hero-space').prepend(spaceCanvas); spaceCtx=spaceCanvas.getContext('2d'); resize();
  spaceStars=Array.from({length:170},()=>({x:rnd(0,spaceW),y:rnd(0,spaceH),r:rnd(.3,1.6),a:rnd(.2,1)}));
  rockDust=Array.from({length:260},()=>({a:rnd(0,Math.PI*2),r:rnd(250,430),z:rnd(.4,1.5),s:rnd(.001,.006),size:rnd(.5,2.4),phase:rnd(0,Math.PI*2)}));
  heartParticles=[]; const n=360; for(let i=0;i<n;i++){let t=Math.PI*2*i/n,x=16*Math.pow(Math.sin(t),3),y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));heartParticles.push({x:x*5.1,y:y*5.1,phase:rnd(0,Math.PI*2),size:rnd(.7,2)});}
}
function spaceLoop(){
  if(!spaceStarted)return; spaceTime+=16; spaceCtx.clearRect(0,0,spaceW,spaceH);
  // stars
  for(const s of spaceStars){s.a+=Math.sin(spaceTime*.001+s.x)*.002;spaceCtx.beginPath();spaceCtx.arc(s.x,s.y,s.r,0,Math.PI*2);spaceCtx.fillStyle=`rgba(255,220,250,${clamp(s.a,.15,1)})`;spaceCtx.fill();}
  const cx=spaceW*.5,cy=spaceH*.43, planetR=Math.min(spaceW,spaceH)*.18;
  // orbiting rock/debris belt
  for(const p of rockDust){p.a+=p.s;let rx=p.r, ry=p.r*.34;let x=cx+Math.cos(p.a)*rx,y=cy+Math.sin(p.a)*ry;let d=(Math.sin(p.a)+1)/2;spaceCtx.beginPath();spaceCtx.arc(x,y,p.size*(.5+d),0,Math.PI*2);spaceCtx.fillStyle=`rgba(255,150,225,${.15+d*.65})`;spaceCtx.fill();}
  // particle planet sphere
  for(let i=0;i<420;i++){let u=(i+.5)/420, theta=Math.acos(1-2*u), phi=i*2.399963;let x=Math.sin(theta)*Math.cos(phi),y=Math.sin(theta)*Math.sin(phi),z=Math.cos(theta);let rot=spaceTime*.00035;let xr=x*Math.cos(rot)-z*Math.sin(rot),zr=x*Math.sin(rot)+z*Math.cos(rot);if(zr<-.08)continue;let px=cx+xr*planetR,py=cy+y*planetR*.88;let rr=rnd(.45,1.7);spaceCtx.beginPath();spaceCtx.arc(px,py,rr,0,Math.PI*2);spaceCtx.fillStyle=`hsla(${315+z*25},${70+z*20}%,${55+z*35}%,${.25+z*.55})`;spaceCtx.fill();}
  // heart formation/orbit
  const heartStart=2.5; let phase=clamp((spaceTime/1000-heartStart)/2.5,0,1); let orbitA=spaceTime*.00065; let hx=cx+Math.cos(orbitA)*planetR*2.2, hy=cy+Math.sin(orbitA)*planetR*.85-40; let spread=phase<1?1+phase*1.8:1.0; let pulse=1+Math.sin(spaceTime*.006)*.08;
  if(phase>0){for(const p of heartParticles){let px=hx+p.x*spread*pulse,py=hy+p.y*spread*pulse;spaceCtx.beginPath();spaceCtx.arc(px,py,p.size,0,Math.PI*2);spaceCtx.fillStyle=`rgba(255,95,190,${.35+phase*.6})`;spaceCtx.fill();}}
  requestAnimationFrame(spaceLoop);
}
function startSpace(){setupSpaceCanvas();spaceStarted=true;requestAnimationFrame(spaceLoop);startOrbit();}

function populate(){
  mainTitle.textContent=CONFIG.title;heroSubtitle.textContent=CONFIG.subtitle;finalTitle.textContent=CONFIG.finalTitle;finalText.textContent=CONFIG.finalText;
  journeyMessages.innerHTML=CONFIG.messages.map((m,i)=>`<article class="journey-message"><div class="message-card"><div class="number">JOURNEY ${String(i+1).padStart(2,'0')}</div><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p></div></article>`).join('');
  gallery.innerHTML=CONFIG.photos.map((src,i)=>`<figure class="gallery-card"><img src="${esc(src)}" alt="Kenangan ${i+1}" loading="lazy" onerror="this.parentElement.style.display='none'"></figure>`).join('');
  createOrbitPhotos();initObservers();
}
function createOrbitPhotos(){photoOrbit.innerHTML='';CONFIG.photos.forEach((src,i)=>{let el=document.createElement('div');el.className='orbit-photo';let img=document.createElement('img');img.src=src;img.alt='Foto kenangan '+(i+1);img.onerror=()=>el.remove();el.appendChild(img);photoOrbit.appendChild(el);});}
function startOrbit(){let angle=0;function loop(){angle+=.0028;photoAngle=angle;let sys=document.querySelector('.planet-system');if(sys){let w=sys.clientWidth,h=sys.clientHeight;document.querySelectorAll('.orbit-photo').forEach((p,i)=>{let n=CONFIG.photos.length,a=angle+i*Math.PI*2/n;let x=w/2+Math.cos(a)*w*.39,y=h*.5+Math.sin(a)*h*.22,depth=(Math.sin(a)+1)/2;p.style.left=x+'px';p.style.top=y+'px';p.style.transform=`translate(-50%,-50%) scale(${.68+depth*.38})`;p.style.zIndex=Math.round(depth*30);});}requestAnimationFrame(loop);}requestAnimationFrame(loop);}

function initObservers(){document.querySelectorAll('.journey-message').forEach(x=>observer.observe(x));document.querySelectorAll('.gallery-card').forEach(x=>galleryObserver.observe(x));}
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('active')}),{threshold:.3});
const galleryObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});

document.getElementById('exploreButton').onclick=()=>document.getElementById('journey').scrollIntoView({behavior:'smooth'});
document.getElementById('replayButton').onclick=()=>location.reload();

document.getElementById('skipIntro').onclick=()=>{if(!started)started=true;try{audio.play()}catch(e){}finished=true;universe.classList.add('visible');intro.classList.add('fly-away');setupSpaceCanvas();startSpace();};
document.addEventListener('pointerdown',()=>{if(started)return;started=true;audio.play().catch(()=>{});introHint.textContent='perjalanan dimulai...';requestAnimationFrame(introLoop)},{once:true});

document.getElementById('musicButton').onclick=async()=>{if(audio.paused){try{await audio.play();musicButton.textContent='♫';}catch(e){alert('Masukkan file music/about-you.mp3 terlebih dahulu.')}}else{audio.pause();musicButton.textContent='▶'}};

populate();
