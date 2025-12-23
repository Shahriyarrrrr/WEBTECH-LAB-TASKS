const page = document.getElementById('page');
const toggle = document.getElementById('themeToggle');
const canvas = document.getElementById('particleCanvas');
let ctx = canvas.getContext('2d');
let isDark = false;
let particles = [];
let raf;
let lastThemeTime = localStorage.getItem('ultra_last_time') || 0;
let prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resizeCanvas();
addEventListener('resize', resizeCanvas);

function random(min, max){ return Math.random() * (max - min) + min; }

function createParticles(count, theme){
  particles = [];
  for(let i=0;i<count;i++){
    particles.push({
      x: random(0, canvas.width),
      y: random(0, canvas.height),
      vx: random(-0.2, 0.6) * (theme === 'dark' ? 1.2 : 1),
      vy: random(-0.1, 0.1),
      r: random(0.8, 3.6),
      life: random(60, 240),
      hue: theme === 'dark' ? random(180,260) : random(25,50),
      alpha: random(0.08,0.35)
    });
  }
}

function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let p of particles){
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if(p.x > canvas.width + 50) p.x = -50;
    if(p.x < -50) p.x = canvas.width + 50;
    if(p.y > canvas.height + 50) p.y = -50;
    if(p.y < -50) p.y = canvas.height + 50;
    if(p.life < 0){
      p.x = random(0, canvas.width);
      p.y = random(0, canvas.height);
      p.life = random(60,240);
    }
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue},70%,60%,${p.alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  }
  if(!prefersReduced) raf = requestAnimationFrame(render);
}

function startParticles(theme){
  cancelAnimationFrame(raf);
  createParticles(theme === 'dark' ? 140 : 90, theme);
  if(!prefersReduced){
    raf = requestAnimationFrame(render);
    canvas.style.opacity = theme === 'dark' ? '0.95' : '0.85';
  } else {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    createParticles(30, theme);
    for(let p of particles){
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue},70%,60%,${p.alpha})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    }
    canvas.style.opacity = '0.6';
  }
}

/* transition animation memory: store timestamp and theme */
function setTheme(dark, animated=true){
  isDark = dark;
  if(animated){
    page.classList.add('transitioning');
    setTimeout(()=> page.classList.remove('transitioning'), 900);
  }
  if(isDark){
    page.classList.add('dark-mode');
    toggle.setAttribute('aria-pressed', 'true');
    localStorage.setItem('ultra_theme', 'dark');
  } else {
    page.classList.remove('dark-mode');
    toggle.setAttribute('aria-pressed', 'false');
    localStorage.setItem('ultra_theme', 'light');
  }
  localStorage.setItem('ultra_last_time', Date.now());
  lastThemeTime = Date.now();
  startParticles(isDark ? 'dark' : 'light');
}

/* init from storage */
if(localStorage.getItem('ultra_theme') === 'dark'){
  setTheme(true, false);
} else {
  setTheme(false, false);
}

/* toggle handler */
toggle.addEventListener('click', ()=> setTheme(!isDark, true));
toggle.addEventListener('keydown', (e)=> { if(e.key==='Enter' || e.key===' ') { e.preventDefault(); setTheme(!isDark,true); } });

/* gentle parallax for particles on mousemove */
if(!prefersReduced){
  addEventListener('mousemove', (e)=>{
    let tx = (e.clientX / innerWidth - 0.5) * 30;
    let ty = (e.clientY / innerHeight - 0.5) * 30;
    canvas.style.transform = `translate(${tx}px, ${ty}px)`;
  });
}

/* initial render */
startParticles(isDark ? 'dark' : 'light');
