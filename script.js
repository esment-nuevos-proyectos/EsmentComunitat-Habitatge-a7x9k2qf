// Slider para #reto integrado con la estructura existente
// No requiere cambios en el HTML ni en style.css
(function(){
  const section = document.querySelector('#reto');
  if(!section) return;

  const container = section.querySelector('.slider-container');
  const track = section.querySelector('.slider-track');
  const slides = Array.from(section.querySelectorAll('.slide'));
  const prevBtn = section.querySelector('.slider-nav.prev');
  const nextBtn = section.querySelector('.slider-nav.next');
  const dotsWrap = section.querySelector('.slider-dots');
  if(!container || !track || slides.length === 0) return;

  let perView = 1; // 1 móvil, 2 tablet, 3 desktop
  let index = 0;   // índice de "página" (no de slide)
  let pages = 1;

  function computePerView(){
    const w = container.clientWidth;
    if (w >= 1024) return 3; // desktop
    if (w >= 640) return 2;  // tablet
    return 1;                // móvil
  }

  function layout(){
    perView = computePerView();
    pages = Math.ceil(slides.length / perView);

    // Ancho de cada slide en % para que quepan perView elementos
    const slideWidth = 100 / perView;
    slides.forEach(s => { s.style.flex = `0 0 ${slideWidth}%`; });

    // Ancho del track = número de slides * ancho por slide
    track.style.display = 'flex';
    track.style.transition = 'transform 400ms ease';

    // Re-crear dots según páginas
    dotsWrap.innerHTML = '';
    for(let i=0;i<pages;i++){
      const b = document.createElement('button');
      b.className = 'dot';
      b.setAttribute('aria-label', `Ir a grupo ${i+1}`);
      b.addEventListener('click', ()=>go(i));
      dotsWrap.appendChild(b);
    }

    // Ajustar índice si se quedó fuera de rango
    if(index > pages-1) index = pages-1;
    update();
  }

  function update(){
    const x = -(index * 100);
    track.style.transform = `translateX(${x}%)`;
    const dots = dotsWrap.querySelectorAll('.dot');
    dots.forEach((d,i)=>d.classList.toggle('active', i===index));

    // Estado de botones
    prevBtn.disabled = (index === 0);
    nextBtn.disabled = (index >= pages-1);
  }

  function go(i){
    index = Math.max(0, Math.min(i, pages-1));
    update();
  }

  function next(){ go(index+1); }
  function prev(){ go(index-1); }

  // Drag/Swipe
  let startX=0, deltaX=0, dragging=false;
  const threshold = 40; // px
  track.addEventListener('pointerdown', (e)=>{ dragging=true; startX=e.clientX; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointermove', (e)=>{ if(!dragging) return; deltaX=e.clientX-startX; });
  track.addEventListener('pointerup', ()=>{ if(!dragging) return; if(Math.abs(deltaX)>threshold){ deltaX<0 ? next() : prev(); } dragging=false; deltaX=0; });

  // Controles
  if(prevBtn) prevBtn.addEventListener('click', prev);
  if(nextBtn) nextBtn.addEventListener('click', next);

  // Autoplay opcional (pausado al interactuar)
  let timer = setInterval(()=>{ if(index < pages-1) next(); else go(0); }, 7000);
  container.addEventListener('mouseenter', ()=>clearInterval(timer));
  container.addEventListener('mouseleave', ()=>{ timer = setInterval(()=>{ if(index < pages-1) next(); else go(0); }, 7000); });

  // Relayout en resize
  window.addEventListener('resize', ()=>layout());

  // Inicializar
  layout();
})();
