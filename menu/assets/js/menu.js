import {visibleItems, selectedOffer, translatedItem, validateMenu} from './model.js';
const base = new URL('../../',import.meta.url);
const $ = id => document.getElementById(id);
const state = {language:'it',category:null,item:null,variant:null};
let config,catalog,editions,locales;
const dialog = $('detail');
const create = (tag, className, text) => {const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;};
const getJSON = async path => {const response=await fetch(new URL(path,base));if(!response.ok)throw new Error(`Menu resource: ${response.status}`);return response.json();};
const ui = () => ({...locales[config.fallbackLanguage].ui,...locales[state.language].ui});
const locale = () => locales[state.language];
const money = cents => new Intl.NumberFormat(state.language === 'en' ? 'en-IE' : 'it-IT',{style:'currency',currency:catalog.currency}).format(cents/100);
function syncURL(){
  const url=new URL(location.href);url.searchParams.set('lang',state.language);url.searchParams.set('category',state.category);
  for(const key of ['item','variant']){if(state[key])url.searchParams.set(key,state[key]);else url.searchParams.delete(key);}
  history.replaceState(null,'',url);
}
function itemText(id){return translatedItem(locales,state.language,config.fallbackLanguage,id);}
function categoryText(id){return locale().categories[id]||locales[config.fallbackLanguage].categories[id];}
function currentItems(){return visibleItems(catalog,config.activeEdition,state.category);}
function imageElement(filename,kind,alt){
  const image=create('img');image.src=new URL(config.imagesBasePath+filename,base);image.alt=alt;image.loading=kind==='thumbnail'?'lazy':'eager';image.decoding='async';image.width=640;image.height=480;
  image.addEventListener('error',()=>image.remove(),{once:true});return image;
}
function render(){
  const text=ui();document.documentElement.lang=state.language;document.title=`${text.menu} | Capri Blu Sorrento`;
  $('language').value=state.language;$('language-label').textContent=text.language;
  $('detail-language').value=state.language;$('detail-language-label').textContent=text.language;
  $('photo-caption').textContent=state.language==='en'?'MADE WITH PASSION · SORRENTO':'FATTA CON PASSIONE · SORRENTO';
  $('edition').textContent=locale().editions[config.activeEdition]||locales[config.fallbackLanguage].editions[config.activeEdition];
  $('heading').textContent=text.intro;$('intro').textContent=text.previewNote;$('preview-label').textContent=text.preview;
  $('pdf-link').textContent=text.pdf+' ↗';$('pdf-link').href=new URL(config.sourcePdf,base);
  $('category-title').textContent=categoryText(state.category);
  $('categories').setAttribute('aria-label',text.menu);
  $('categories').replaceChildren(...catalog.categories.filter(category=>visibleItems(catalog,config.activeEdition,category.id).length).sort((a,b)=>a.order-b.order).map(category=>{
    const button=create('button','',categoryText(category.id));button.type='button';button.dataset.category=category.id;button.setAttribute('aria-pressed',String(category.id===state.category));return button;
  }));
  const items=currentItems();$('count').textContent=`${items.length} ${text.itemCount}`;
  $('items').replaceChildren(...items.map(item=>{
    const content=itemText(item.id);const card=create('article','pizza-card'+(!item.available?' unavailable':''));card.dataset.item=item.id;
    const visual=create('div','card-visual');
    const photoButton=create('button','photo-button');photoButton.type='button';photoButton.dataset.item=item.id;photoButton.setAttribute('aria-label',`${text.details}: ${content.name}`);
    if(item.thumbnail)photoButton.append(imageElement(item.thumbnail,'thumbnail',content.name));
    else {const placeholder=create('div','photo-placeholder','CB');placeholder.setAttribute('aria-hidden','true');photoButton.append(placeholder);}
    visual.append(photoButton);
    const body=create('div','card-body');const titleRow=create('div','card-title-row');
    const title=create('h3','',content.name);title.id=`name-${item.id}`;card.setAttribute('aria-labelledby',title.id);
    titleRow.append(title,create('span','price',money(item.priceCents)));
    body.append(titleRow,create('p','card-description',content.description));if(!item.available)body.append(create('p','',text.unavailable));visual.append(body);
    const bottom=create('div','card-bottom');const open=create('button','detail-button',text.details);open.type='button';open.dataset.item=item.id;open.setAttribute('aria-label',`${text.details}: ${content.name}`);bottom.append(open);
    card.append(visual,bottom);return card;
  }));
  const edition=editions.editions.find(edition=>edition.id===config.activeEdition);
  $('cover-charge').textContent=`${text.coverCharge} ${money(edition.coverChargeCents)} ${text.perPerson}`;
  $('frozen-note').textContent=text.frozen;$('back-link').textContent=text.back;$('retry').textContent=text.retry;
  $('status').hidden=true;$('retry').hidden=true;
  if(state.item)renderDetail();syncURL();
}
function renderDetail(){
  const item=currentItems().find(item=>item.id===state.item);if(!item){state.item=null;state.variant=null;return;}
  const text=ui(),content=itemText(item.id),offer=selectedOffer(item,state.variant);
  $('detail-title').textContent=content.name;$('detail-description').textContent=content.description;
  $('close-detail').setAttribute('aria-label',text.close);$('formats-label').textContent=text.formats;
  const image=$('detail-image').firstElementChild;
  const photo=state.variant?null:item.image;
  if(photo && image?.dataset.item!==item.id){const next=imageElement(photo,'fullImage',content.name);next.dataset.item=item.id;$('detail-image').replaceChildren(next);}
  else if(!photo)$('detail-image').replaceChildren();else image.alt=content.name;
  $('formats').hidden=item.variants.length===0;
  $('format-options').replaceChildren(...[{id:'',label:text.standard},...item.variants.map(variant=>({id:variant.id,label:locale().variants[variant.id]||locales[config.fallbackLanguage].variants[variant.id]}))].map(format=>{
    const button=create('button','',format.label);button.type='button';button.dataset.variant=format.id;button.setAttribute('aria-pressed',String((state.variant||'')===format.id));return button;
  }));
  $('detail-price').textContent=money(offer.priceCents);
  $('detail-availability').textContent=!item.available||!offer.available?text.unavailable:'';
  $('allergen-note').textContent=text.allergensPending;
}
function closeDetail(){if(dialog.open)dialog.close();state.item=null;state.variant=null;syncURL();}
async function boot(){
  $('status').hidden=false;$('retry').hidden=true;
  try{
    config=await getJSON('./data/config.json');
    [catalog,editions,locales]=await Promise.all([getJSON(config.catalog),getJSON(config.editions),Promise.all(config.enabledLanguages.map(async language=>[language,await getJSON(config.localesBasePath+language+'.json')])).then(Object.fromEntries)]);
    const errors=validateMenu(config,catalog,editions,locales);if(errors.length)throw new Error(errors.join('\n'));
    const params=new URL(location.href).searchParams;let saved;try{saved=localStorage.getItem('capriblu-menu-language');}catch{}
    state.language=[params.get('lang'),saved,config.defaultLanguage].find(language=>config.enabledLanguages.includes(language));
    const first=catalog.categories.find(category=>visibleItems(catalog,config.activeEdition,category.id).length);
    state.category=catalog.categories.some(category=>category.id===params.get('category')&&visibleItems(catalog,config.activeEdition,category.id).length)?params.get('category'):first.id;
    const item=currentItems().find(item=>item.id===params.get('item'));
    state.item=item?.id||null;state.variant=item?.variants.some(variant=>variant.id===params.get('variant'))?params.get('variant'):null;
    render();if(state.item)dialog.showModal();
  }catch(error){
    console.error(error);$('status').textContent='Non è stato possibile caricare il menu. Apri il PDF completo. / The menu could not be loaded. Open the full PDF.';$('status').hidden=false;$('retry').hidden=false;
  }
}
$('items').addEventListener('click',event=>{const button=event.target.closest('button[data-item]');if(!button)return;state.item=button.dataset.item;state.variant=null;renderDetail();dialog.showModal();syncURL();});
$('categories').addEventListener('click',event=>{const button=event.target.closest('button[data-category]');if(!button)return;state.category=button.dataset.category;state.item=null;state.variant=null;render();});
$('format-options').addEventListener('click',event=>{const button=event.target.closest('button[data-variant]');if(!button)return;state.variant=button.dataset.variant||null;renderDetail();syncURL();});
for (const id of ['language','detail-language']) $(id).addEventListener('change',event=>{if(!locales)return;state.language=event.target.value;try{localStorage.setItem('capriblu-menu-language',state.language);}catch{}render();});
$('close-detail').addEventListener('click',closeDetail);
dialog.addEventListener('cancel',()=>{state.item=null;state.variant=null;syncURL();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDetail();}});
$('retry').addEventListener('click',boot);
boot();
