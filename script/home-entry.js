(() => {
  const trigger=document.getElementById('discover-menu'),panel=document.getElementById('language-panel'),label=document.getElementById('discover-menu-label');
  if(!trigger||!panel)return;
  const copy={
    it:{menu:'Scopri il nostro menu',book:'Prenota con TheFork',review:'Recensioni Google',slider:"L'anima di Capri Blu",phrases:['Sorrento','Pizzeria & Trattoria Napoletana','Sapori Autentici','Cucina Mediterranea',"Un Agrumeto Tutto l'Anno"]},
    en:{menu:'Discover our menu',book:'Book with TheFork',review:'Google reviews',slider:'The soul of Capri Blu',phrases:['Sorrento','Neapolitan Pizzeria & Trattoria','Authentic Flavours','Mediterranean Cuisine','A Citrus Grove All Year Round']},
    es:{menu:'Descubre nuestro menú',book:'Reserva con TheFork',review:'Reseñas de Google',slider:'El alma de Capri Blu',phrases:['Sorrento','Pizzería y Trattoria Napolitana','Sabores auténticos','Cocina mediterránea','Un jardín de cítricos todo el año']},
    pt:{menu:'Descubra o nosso menu',book:'Reserve com TheFork',review:'Avaliações Google',slider:'A alma de Capri Blu',phrases:['Sorrento','Pizzaria e Trattoria Napolitana','Sabores autênticos','Cozinha mediterrânica','Um jardim de citrinos todo o ano']}
  };
  const languages=Object.keys(copy),motion=matchMedia('(prefers-reduced-motion: reduce)');
  let saved;try{saved=localStorage.getItem('capriblu-menu-language');}catch{}
  let language=[new URL(location.href).searchParams.get('lang'),saved,'it'].find(value=>languages.includes(value)),index=languages.indexOf(language),timer,fade,hovered=false;
  function render(){
    const text=copy[language];document.documentElement.lang=language;label.textContent=text.menu;label.lang=language;
    const slider=document.querySelector('.brand-slider');
    if(slider){slider.lang=language;slider.setAttribute('aria-label',text.slider);slider.querySelectorAll('.brand-slider-phrase').forEach((el,i)=>el.textContent=text.phrases[i]);slider.querySelectorAll('.brand-slider-description li').forEach((el,i)=>el.textContent=text.phrases[i]);}
    document.getElementById('book-label').textContent=text.book;document.getElementById('review-label').textContent=text.review;
  }
  function stop(){clearInterval(timer);clearTimeout(fade);label.classList.remove('is-changing');}
  function sync(){
    stop();
    if(motion.matches||!panel.hidden||document.hidden||hovered||document.activeElement===trigger)return;
    timer=setInterval(()=>{label.classList.add('is-changing');fade=setTimeout(()=>{index=(index+1)%languages.length;label.textContent=copy[languages[index]].menu;label.lang=languages[index];label.classList.remove('is-changing');},300);},3200);
  }
  function open(value,focus=false){panel.hidden=!value;trigger.setAttribute('aria-expanded',String(value));sync();if(value&&focus)panel.querySelector('a').focus();}
  trigger.addEventListener('click',()=>open(panel.hidden));
  trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();open(true,true);}});
  document.addEventListener('click',event=>{if(!panel.hidden&&!panel.contains(event.target)&&!trigger.contains(event.target))open(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){open(false);trigger.focus();}});
  panel.addEventListener('click',event=>{const link=event.target.closest('a[data-language]');if(!link)return;language=link.dataset.language;try{localStorage.setItem('capriblu-menu-language',language);}catch{}render();});
  trigger.addEventListener('mouseenter',()=>{hovered=true;sync();});trigger.addEventListener('mouseleave',()=>{hovered=false;sync();});trigger.addEventListener('focus',sync);trigger.addEventListener('blur',sync);
  motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);render();sync();
})();
