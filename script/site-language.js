(()=>{
 const names={it:'Italiano',en:'English',es:'Español',pt:'Português',pl:'Polski',de:'Deutsch',fr:'Français',vi:'Tiếng Việt'};
 let saved;try{saved=localStorage.getItem('capriblu-menu-language');}catch{}
 const requested=new URL(location.href).searchParams.get('lang'),language=names[requested]?requested:names[saved]?saved:'it';
 document.documentElement.lang=language;
 const select=document.createElement('select');select.className='site-language';select.setAttribute('aria-label','Language');
 for(const [code,name]of Object.entries(names)){const option=document.createElement('option');option.value=code;option.textContent=name;select.append(option);}select.value=language;
 const header=document.querySelector('.wine-header');if(header)header.insertBefore(select,header.lastElementChild);else{const back=document.querySelector('.back-button'),bar=document.createElement('div');bar.className='site-language-bar';back.before(bar);bar.append(back,select);}
 select.addEventListener('change',()=>{try{localStorage.setItem('capriblu-menu-language',select.value);}catch{}const url=new URL(location.href);url.searchParams.set('lang',select.value);location.href=url.href;});
 document.querySelectorAll('a[href]').forEach(a=>{const u=new URL(a.href);if(u.origin===location.origin&&(/\.html$/.test(u.pathname)||u.pathname.endsWith('/menu/'))){u.searchParams.set('lang',language);a.href=u.href;}});
 if(language==='it')return;
 fetch('./site-locales/'+language+'.json?v=20261115-1').then(r=>{if(!r.ok)throw Error('Language unavailable');return r.json();}).then(copy=>{
  function translated(text){const trimmed=text.trim();if(copy[trimmed])return text.replace(trimmed,copy[trimmed]);const count=trimmed.match(/^ETICHETTA (\d+) DI (\d+)$/);if(count)return copy.counter.replace('{n}',count[1]).replace('{total}',count[2]);for(const [prefix,key]of [['Mostra ','show'],['Seleziona ','choose']])if(trimmed.startsWith(prefix))return copy[key]+' '+translated(trimmed.slice(prefix.length));return text;}
  function apply(){const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(node.parentElement.closest('script,style,select'))continue;const next=translated(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;}document.querySelectorAll('[aria-label],[alt]').forEach(el=>{for(const attr of ['aria-label','alt']){if(!el.hasAttribute(attr))continue;const text=el.getAttribute(attr),next=translated(text);if(next!==text)el.setAttribute(attr,next);}});}
  apply();new MutationObserver(()=>apply()).observe(document.body,{childList:true,characterData:true,subtree:true});
 }).catch(()=>{document.documentElement.lang='it';select.value='it';});
})();
