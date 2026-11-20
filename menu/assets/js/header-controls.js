function flagIcon(language){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 30 20');svg.setAttribute('preserveAspectRatio','xMidYMid slice');svg.setAttribute('aria-hidden','true');
 const shape=(tag,attributes)=>{const node=document.createElementNS(svg.namespaceURI,tag);for(const [key,value] of Object.entries(attributes))node.setAttribute(key,String(value));svg.append(node);};
 const rect=(x,y,width,height,fill)=>shape('rect',{x,y,width,height,fill});
 if(language==='it'||language==='fr'){rect(0,0,10,20,language==='it'?'#009246':'#0055a4');rect(10,0,10,20,'#fff');rect(20,0,10,20,language==='it'?'#ce2b37':'#ef4135');}
 else if(language==='en'){rect(0,0,30,20,'#012169');shape('path',{d:'M0 0 30 20M30 0 0 20',stroke:'#fff','stroke-width':5});shape('path',{d:'M0 0 30 20M30 0 0 20',stroke:'#c8102e','stroke-width':2});rect(12,0,6,20,'#fff');rect(0,7,30,6,'#fff');rect(13,0,4,20,'#c8102e');rect(0,8,30,4,'#c8102e');}
 else if(language==='es'){rect(0,0,30,20,'#aa151b');rect(0,5,30,10,'#f1bf00');rect(7,8,3,5,'#aa151b');}
 else if(language==='pt'){rect(0,0,30,20,'#f00');rect(0,0,12,20,'#006600');shape('circle',{cx:12,cy:10,r:4,fill:'#ffdc00'});rect(10,7,4,6,'#fff');rect(11,8,2,4,'#ce1126');}
 else if(language==='pl'){rect(0,0,30,10,'#fff');rect(0,10,30,10,'#dc143c');}
 else if(language==='de'){rect(0,0,30,7,'#151515');rect(0,7,30,7,'#d00');rect(0,14,30,6,'#ffce00');}
 else if(language==='vi'){rect(0,0,30,20,'#da251d');shape('path',{d:'m15 3 1.8 5.3h5.6l-4.5 3.3 1.7 5.3-4.6-3.2-4.6 3.2 1.7-5.3-4.5-3.3h5.6Z',fill:'#ff0'});}
 return svg;
}

export function refreshHeaderControls(language,homeLabel){
 const select=document.getElementById('language'),control=select.closest('.language-control');
 control.classList.add('flag-language');
 let flag=control.querySelector('.nav-flag');
 if(!flag){flag=document.createElement('span');flag.className='nav-flag';flag.setAttribute('aria-hidden','true');control.append(flag);}
 if(flag.dataset.language!==language){flag.replaceChildren(flagIcon(language));flag.dataset.language=language;}
 select.title=select.selectedOptions[0]?.textContent||language;
 const home=document.getElementById('navigation-home');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
 for(const d of ['M3 11 12 3l9 8','M5 10v11h5v-7h4v7h5V10']){const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',d);svg.append(path);}
 home.replaceChildren(svg);home.setAttribute('aria-label',homeLabel);home.title=homeLabel;
}
