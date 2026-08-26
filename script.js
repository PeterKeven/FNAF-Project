// ===== Ano no rodapé =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Respeita "prefers-reduced-motion" =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Relógio do feed (estética, não é hora real) =====
(function feedClock(){
  const el = document.getElementById('feedTime');
  if(!el) return;
  let h = 1, m = 14;
  setInterval(() => {
    m += 1;
    if(m >= 60){ m = 0; h = (h % 5) + 1; }
    el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} AM`;
  }, 4000);
})();

// ===== Ruído de fundo estilo TV analógica =====
(function staticNoise(){
  const canvas = document.getElementById('staticCanvas');
  if(!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function draw(){
    const imageData = ctx.createImageData(w, h);
    const buffer = new Uint32Array(imageData.data.buffer);
    for(let i = 0; i < buffer.length; i++){
      const shade = (Math.random() * 255) | 0;
      buffer[i] = (255 << 24) | (shade << 16) | (shade << 8) | shade;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== Ruído nos slots de câmera (placeholders da galeria) =====
(function camNoise(){
  const canvases = document.querySelectorAll('.cam-slot__noise');
  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    function resize(){
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    if(reduceMotion){
      // frame estático único
      const id = ctx.createImageData(canvas.width, canvas.height);
      const buf = new Uint32Array(id.data.buffer);
      for(let i=0;i<buf.length;i++){
        const s = (Math.random()*60)|0;
        buf[i] = (255<<24)|(s<<16)|(s<<8)|s;
      }
      ctx.putImageData(id,0,0);
      return;
    }

    function draw(){
      const id = ctx.createImageData(canvas.width, canvas.height);
      const buf = new Uint32Array(id.data.buffer);
      for(let i=0;i<buf.length;i++){
        const s = (Math.random()*70)|0;
        buf[i] = (255<<24)|(s<<16)|(s<<8)|s;
      }
      ctx.putImageData(id,0,0);
      setTimeout(() => requestAnimationFrame(draw), 90);
    }
    draw();
  });
})();

// ===== HUD de energia: drena conforme o scroll (elemento-assinatura) =====
(function powerHud(){
  const fill = document.getElementById('powerFill');
  const pct = document.getElementById('powerPct');
  const blackout = document.getElementById('blackout');
  if(!fill || !pct) return;

  function update(){
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    const power = Math.max(0, Math.round(100 - ratio * 100));

    fill.style.width = power + '%';
    pct.textContent = power + '%';

    if(power <= 15){
      fill.style.background = 'var(--alarm)';
      pct.style.color = 'var(--alarm)';
    } else {
      fill.style.background = 'var(--amber)';
      pct.style.color = 'var(--amber)';
    }

    if(blackout){
      // breve blackout perto do fim, antes da seção de download
      const flashZone = ratio > 0.94 && ratio < 0.97;
      blackout.style.transition = flashZone ? 'opacity 0.05s linear' : 'opacity 0.4s ease';
      blackout.style.opacity = flashZone && !reduceMotion ? '1' : '0';
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ===== Revelação suave das seções ao rolar =====
(function revealOnScroll(){
  const targets = document.querySelectorAll('.proto-card, .cam-slot, .req-col, .log__line');
  if(!targets.length) return;

  targets.forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(14px)';
    t.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(t => io.observe(t));

  if(reduceMotion){
    targets.forEach(t => { t.style.opacity = '1'; t.style.transform = 'none'; t.style.transition = 'none'; });
  }
})();

// ===== Botões de download (Windows / Linux) =====
// Troque o href de cada link pelo arquivo real (.exe/.zip pra Windows, .zip/.AppImage pra Linux)
// ou pela página da loja (Steam/itch.io), antes de publicar o site.
document.querySelectorAll('#downloadWin, #downloadLinux').forEach(btn => {

});
