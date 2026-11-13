(() => {
  const trigger=document.getElementById('discover-menu'),panel=document.getElementById('language-panel'),label=document.getElementById('discover-menu-label');
  if(!trigger||!panel)return;
  const copy={
    it:{menu:'Scopri il nostro menu',book:'Prenota con TheFork',review:'Recensioni Google',slider:"L'anima di Capri Blu",phrases:['Sorrento','Pizzeria & Trattoria Napoletana','Sapori Autentici','Cucina Mediterranea',"Un Agrumeto Tutto l'Anno"]},
    en:{menu:'Discover our menu',book:'Book with TheFork',review:'Google reviews',slider:'The soul of Capri Blu',phrases:['Sorrento','Neapolitan Pizzeria & Trattoria','Authentic Flavours','Mediterranean Cuisine','A Citrus Grove All Year Round']},
    es:{menu:'Descubre nuestro menú',book:'Reserva con TheFork',review:'Reseñas de Google',slider:'El alma de Capri Blu',phrases:['Sorrento','Pizzería y Trattoria Napolitana','Sabores auténticos','Cocina mediterránea','Un jardín de cítricos todo el año']},
    pt:{menu:'Descubra o nosso menu',book:'Reserve com TheFork',review:'Avaliações Google',slider:'A alma de Capri Blu',phrases:['Sorrento','Pizzaria e Trattoria Napolitana','Sabores autênticos','Cozinha mediterrânica','Um jardim de citrinos todo o ano']},
    pl:{"menu": "Odkryj nasze menu", "book": "Zarezerwuj przez TheFork", "review": "Opinie Google", "choose": "Wybierz język menu", "slider": "Dusza Capri Blu", "phrases": ["Sorrento", "Pizzeria i trattoria neapolitańska", "Autentyczne smaki", "Kuchnia śródziemnomorska", "Ogród cytrusowy przez cały rok"]},
    de:{"menu": "Unsere Speisekarte", "book": "Mit TheFork reservieren", "review": "Google-Bewertungen", "choose": "Sprache der Speisekarte wählen", "slider": "Die Seele von Capri Blu", "phrases": ["Sorrento", "Neapolitanische Pizzeria & Trattoria", "Authentische Aromen", "Mediterrane Küche", "Ein Zitrusgarten das ganze Jahr"]},
    fr:{"menu": "Découvrez notre menu", "book": "Réserver avec TheFork", "review": "Avis Google", "choose": "Choisir la langue du menu", "slider": "L’âme de Capri Blu", "phrases": ["Sorrento", "Pizzeria et trattoria napolitaine", "Saveurs authentiques", "Cuisine méditerranéenne", "Un jardin d’agrumes toute l’année"]},
    vi:{"menu": "Khám phá thực đơn", "book": "Đặt bàn qua TheFork", "review": "Đánh giá Google", "choose": "Chọn ngôn ngữ thực đơn", "slider": "Tinh thần Capri Blu", "phrases": ["Sorrento", "Pizzeria & Trattoria kiểu Napoli", "Hương vị đích thực", "Ẩm thực Địa Trung Hải", "Vườn cam chanh quanh năm"]}
  };
  const languages=Object.keys(copy),motion=matchMedia('(prefers-reduced-motion: reduce)');
  let saved;try{saved=localStorage.getItem('capriblu-menu-language');}catch{}
  let language=[new URL(location.href).searchParams.get('lang'),saved,'it'].find(value=>languages.includes(value)),index=languages.indexOf(language),timer,fade,hovered=false;
  function render(){
    const text=copy[language];document.documentElement.lang=language;label.textContent=text.menu;label.lang=language;if(text.choose){trigger.setAttribute('aria-label',text.choose);panel.setAttribute('aria-label',text.choose);}else{trigger.setAttribute('aria-label',text.menu);panel.setAttribute('aria-label',text.menu);}
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

// Keep both invitation widths reserved so switching language never shifts the line.
(() => {
  const link=document.getElementById('boutique-link');
  if(!link)return;
  const labels=link.querySelectorAll('.boutique-copy>span');
  const bird=link.querySelector('.boutique-bird'),facing=link.querySelector('.bird-facing');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let english=document.documentElement.lang!=='it',timer,hopping=false,journey,parts=[];
  function render(){labels.forEach(label=>{label.hidden=(label.lang==='en')!==english;});}
  function sync(){
    clearInterval(timer);
    if(hopping||motion.matches||document.hidden||link.matches(':hover, :focus-within'))return;
    timer=setInterval(()=>{english=!english;render();},5000);
  }
  link.addEventListener('mouseenter',sync);link.addEventListener('mouseleave',sync);
  link.addEventListener('focus',sync);link.addEventListener('blur',sync);
  function rest(){
    if(journey){journey.cancel();journey=null;}
    parts.forEach(animation=>animation.cancel());parts=[];
    link.classList.remove('is-bird-hopping');hopping=false;
    if(facing)facing.style.transform='';
    sync();
  }
  async function hopAlongPhrase(){
    if(!bird||!bird.animate||motion.matches)return;
    hopping=true;sync();
    try{
      if(document.fonts)await document.fonts.ready;
      if(motion.matches){rest();return;}
      // Measure after fonts load. Both labels reserve space even when hidden.
      const distance=link.querySelector('.boutique-stage').clientWidth-bird.clientWidth;
      // Sample actual arcs: anticipation, ballistic flight and a soft landing.
      // Unequal strides and pauses keep the courier from moving like a metronome.
      const segments=[];let clock=.55,last=0,floor=0;
      const add=(to,ground,flight,height,pause=0)=>{
        const duration=.12+flight+.19+pause;
        segments.push({start:clock,end:clock+duration,from:last,to:to*distance,floor,ground,flight,height});
        clock+=duration;last=to*distance;floor=ground;
      };
      add(.22,-24,.46,21);add(.4,-24,.36,13,.09);add(.66,-24,.48,19);
      add(.83,-24,.34,12,.13);add(1,-24,.4,16);
      const turnStart=clock;clock+=1.05;
      add(.76,-24,.4,15);add(.47,-24,.46,19,.08);add(.2,-24,.41,16);
      add(0,0,.5,23);clock+=.95;
      const frames=[],bagFrames=[],wingFrames=[],feetFrames=[];
      const detailFrames=Object.fromEntries(['bird-head','bird-beak','bird-eye','bird-far-eye','bird-front-beak','bird-body','bird-chest','bird-tail','bird-far-wing'].map(key=>[key,[]]));
      let bagAngle=0,bagVelocity=0;
      const smooth=t=>t*t*(3-2*t),mix=(a,b,t)=>a+(b-a)*t;
      const count=Math.ceil(clock*60),dt=clock/count;
      for(let i=0;i<=count;i++){
        const time=i*dt,offset=i/count;
        let x=0,y=0,angle=0,sx=1,sy=1,wing=0,feet=0,bagTarget=0;
        const segment=segments.find(step=>time>=step.start&&time<step.end);
        const previous=segments.filter(step=>step.end<=time).at(-1);
        if(previous){x=previous.to;y=previous.ground;}
        if(segment){
          const s=segment,t=time-s.start,direction=Math.sign(s.to-s.from);
          x=s.from;y=s.floor;
          if(t<.12){
            const p=smooth(t/.12);sx=1+.09*p;sy=1-.14*p;y+=2*p;angle=-3*direction*p;
          }else if(t<.12+s.flight){
            const p=(t-.12)/s.flight,arc=Math.sin(Math.PI*p);
            x=mix(s.from,s.to,p);y=mix(s.floor,s.ground,smooth(p))-4*s.height*p*(1-p);
            sx=1-.055*arc;sy=1+.075*arc;angle=direction*(-7+12*p)*arc;
            wing=-24*arc;feet=18*arc;bagTarget=-direction*21*Math.sin(Math.PI*p*1.35);
          }else{
            const p=Math.min((t-.12-s.flight)/.19,1),settle=Math.sin(Math.PI*p)*Math.exp(-2*p);
            x=s.to;y=s.ground+3*settle;sx=1+.16*settle;sy=1-.2*settle;
            angle=direction*3*settle;bagTarget=direction*12*settle;
          }
        }
        const clamp=v=>Math.max(0,Math.min(v,1));
        let turn=smooth(clamp((time-turnStart)/1.05));
        if(time>clock-.9)turn=1-smooth(clamp((time-clock+.9)/.9));
        const yaw=turn*Math.PI,face=Math.cos(yaw),front=Math.sin(yaw);
        // Turn separate volumes through a front pose; the body never flattens.
        const headTurn=time<turnStart+1.05?smooth(clamp((time-turnStart+.1)/.9)):turn;
        const headX=-14*headTurn,headNod=-3*front;
        if(front>.01){y-=5*front;angle+=4*front;sx*=1+.05*front;sy*=1-.035*front;feet+=8*Math.sin(turn*4*Math.PI)*front;}
        bagTarget+=front*16;
        // A damped spring lets the shopping bag lag behind each hop and turn.
        bagVelocity+=((bagTarget-bagAngle)*125-bagVelocity*12)*dt;
        bagAngle+=bagVelocity*dt;
        detailFrames['bird-head'].push({offset,transform:`translate(${headX}px, ${headNod}px) rotate(${-5*front}deg)`});
        detailFrames['bird-beak'].push({offset,transform:`scaleX(${face})`,opacity:1-.45*front});
        detailFrames['bird-front-beak'].push({offset,opacity:front**5});
        detailFrames['bird-eye'].push({offset,transform:`translate(${-5.2*turn}px,0)`});
        detailFrames['bird-far-eye'].push({offset,opacity:front**3});
        detailFrames['bird-body'].push({offset,transform:`scale(${1-.14*front}, ${1+.035*front})`});
        detailFrames['bird-chest'].push({offset,opacity:.8*front});
        detailFrames['bird-tail'].push({offset,transform:`scaleX(${face}) rotate(${-10*front}deg)`,opacity:1-.6*front});
        detailFrames['bird-far-wing'].push({offset,opacity:front,transform:`translate(${-2*front}px, ${-3*front}px) rotate(${-12*front}deg)`});
        frames.push({offset,transform:`translate(${x}px, ${y}px) rotate(${angle}deg) scale(${sx}, ${sy})`});
        bagFrames.push({offset,transform:`translate(${headX+11*(face-1)}px, ${headNod+2*front}px) rotate(${bagAngle+12*front}deg) scale(${1-.2*front},1)`});
        wingFrames.push({offset,transform:`translate(${5*front}px, ${-2*front}px) rotate(${wing+25*front}deg) scaleX(${1-.35*front})`});
        feetFrames.push({offset,transform:`rotate(${feet}deg) scaleY(${1-Math.abs(feet)/80})`});
      }
      link.classList.add('is-bird-hopping');
      const timing={duration:clock*1000,easing:'linear',fill:'none'};
      journey=bird.animate(frames,timing);
      for(const [element,keyframes] of [[link.querySelector('.bird-bag'),bagFrames],[link.querySelector('.bird-wing'),wingFrames],[link.querySelector('.bird-feet'),feetFrames],...Object.entries(detailFrames).map(([name,keyframes])=>[link.querySelector('.'+name),keyframes])]){
        parts.push(element.animate(keyframes,timing));
      }
      await journey.finished;
    }catch{/* A cancelled animation leaves the static icon in its resting place. */}
    finally{rest();}
  }
  motion.addEventListener('change',()=>{if(motion.matches)rest();else sync();});
  document.addEventListener('visibilitychange',()=>{
    if(journey){if(document.hidden)rest();}
    sync();
  });
  render();sync();hopAlongPhrase();
})();
