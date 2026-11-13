import {visibleItems, selectedOffer, translatedItem, validateMenu, resolveLegacySelection, drinkCollections, groupDepartmentItems} from './model.js?v=beer-cutouts-20261113-1';
import {initialLanguages, createLocaleStore} from './locale-store.js?v=eight-languages-20261112-1';
const base = new URL('../../',import.meta.url);
const $ = id => document.getElementById(id);
const state = {language:'it',category:null,collection:null,item:null,variant:null,query:''};
let config,catalog,editions,locales;
const dialog = $('detail');
const categoryPicker = $('category-picker');
const mobileNavigation = matchMedia('(max-width: 600px)');
function updateCompactNavigation() {
  $('compact-categories').hidden = !locales || !mobileNavigation.matches;
}
mobileNavigation.addEventListener('change', () => {
  if (categoryPicker.open) categoryPicker.close();
  updateCompactNavigation();
});
const create = (tag, className, text) => {const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;};
const getJSON = async path => {const resource=new URL(path,base);resource.searchParams.set('v',new URL(import.meta.url).searchParams.get('v')||'1');const response=await fetch(resource);if(!response.ok)throw new Error(`Menu resource: ${response.status}`);return response.json();};
const getLocale=createLocaleStore(language=>getJSON(config.localesBasePath+language+'.json'));
const ui = () => ({...locales[config.fallbackLanguage].ui,...locales[state.language].ui});
const locale = () => locales[state.language];
const money = cents => new Intl.NumberFormat(({it:'it-IT',en:'en-IE',es:'es-ES',pt:'pt-PT',pl:'pl-PL',de:'de-DE',fr:'fr-FR',vi:'vi-VN'})[state.language]||'it-IT',{style:'currency',currency:catalog.currency}).format(cents/100);
function syncURL(){
  const url=new URL(location.href);url.searchParams.set('lang',state.language);if(state.category)url.searchParams.set('category',state.category);else url.searchParams.delete('category');if(state.query)url.searchParams.set('q',state.query);else url.searchParams.delete('q');
  for(const key of ['item','variant','collection']){if(state[key])url.searchParams.set(key,state[key]);else url.searchParams.delete(key);}
  history.replaceState(null,'',url);
}
function itemText(id){return translatedItem(locales,state.language,config.fallbackLanguage,id);}
function categoryText(id){return locale().categories[id]||locales[config.fallbackLanguage].categories[id];}
const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d');
function countLabel(count){const text=ui();return count===1?text.itemSingular:state.language==='pl'&&new Intl.PluralRules('pl').select(count)==='few'?text.itemFew:text.itemCount;}
function activeCollection(){return state.category==='drinks-beverage'?drinkCollections.find(collection=>collection.id===state.collection):null;}
function currentItems(){const collection=activeCollection();return visibleItems(catalog,config.activeEdition,state.category).filter(item=>{if(collection&&!collection.itemIds.includes(item.id))return false;if(!state.query)return true;const content=itemText(item.id);return normalize(content.name+' '+content.description).includes(normalize(state.query.trim()));});}
function chooseCategory(id){state.category=id||null;state.collection=null;state.item=null;state.variant=null;state.query='';render();const heading=$(id?'category-title':'overview-title');heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'});}
function chooseCollection(id){state.collection=id||null;state.item=null;state.variant=null;state.query='';render();$('category-title').focus({preventScroll:true});$('category-title').scrollIntoView({block:'start'});}
function collectionCard(entry){
  const {collection,members}=entry,text=ui(),card=create('article','pizza-card collection-card'),button=create('button','collection-open');
  button.type='button';button.dataset.collection=collection.id;button.setAttribute('aria-label',text[collection.labelKey]);
  const visual=create('span','collection-visual');visual.setAttribute('aria-hidden','true');
  if(collection.previewIds){for(const id of collection.previewIds){const member=members.find(item=>item.id===id);if(member?.thumbnail)visual.append(imageElement(member.thumbnail,'thumbnail',''));}}
  else{
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 180 150');svg.setAttribute('fill','none');
    for(const [x,y,scale] of [[26,28,.78],[66,10,1],[113,28,.78]]){
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M14 4h14v30c0 9 12 15 12 25v60c0 5-4 8-8 8H10c-5 0-8-3-8-8V59c0-10 12-16 12-25V4Zm0 0h14M3 68h36M3 98h36');path.setAttribute('transform',`translate(${x} ${y}) scale(${scale})`);path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','2');path.setAttribute('stroke-linejoin','round');svg.append(path);
    }visual.append(svg);
  }
  const caption=create('span','collection-caption'),title=create('h3','',text[collection.labelKey]);
  caption.append(title,create('span','collection-count',members.length+' '+countLabel(members.length)),create('span','collection-arrow','→'));
  button.append(visual,caption);card.append(button);return card;
}

function imageElement(filename,kind,alt){
  const image=create('img');image.src=new URL(config.imagesBasePath+filename,base);image.alt=alt;image.loading=kind==='thumbnail'?'lazy':'eager';image.decoding='async';image.width=640;image.height=480;
  image.addEventListener('error',()=>image.remove(),{once:true});return image;
}
function render(){
  const text=ui();document.documentElement.lang=state.language;document.title=text.menu+' | Capri Blu Sorrento';
  const brand=document.querySelector('.brand-slider');brand.lang=state.language;brand.setAttribute('aria-label',text.brandSlider);
  const phrases=locale().brandPhrases||locales[config.fallbackLanguage].brandPhrases;
  brand.querySelectorAll('.brand-slider-phrase').forEach((el,i)=>el.textContent=phrases[i]);
  brand.querySelectorAll('.brand-slider-description li').forEach((el,i)=>el.textContent=phrases[i]);
  $('language').value=$('detail-language').value=state.language;
  $('language-label').textContent=$('detail-language-label').textContent=text.language;
  $('heading').textContent=text.menu;
  $('pdf-link').textContent=text.downloadPdf+' ↓';$('pdf-link').href=new URL(config.sourcePdf,base);
  $('wine-link').textContent=text.wineList;
  document.querySelector('.topbar .home').href=$('back-link').href=new URL('../index.html?lang='+state.language,base);
  document.querySelector('.menu-actions').setAttribute('aria-label',text.menu);
  $('toggle-search').setAttribute('aria-label',text.search);
  if(state.query)setSearchOpen(true);
  $('search-label').textContent=text.search;$('menu-search').placeholder=text.searchPlaceholder;
  if($('menu-search').value!==state.query)$('menu-search').value=state.query;
  $('clear-search').hidden=!state.query;$('clear-search').setAttribute('aria-label',text.clearSearch);
  $('overview-title').textContent=text.overviewTitle;$('overview-subtitle').textContent=text.chooseCategory;
  $('all-categories').textContent='← '+text.categoryBack;$('all-categories').setAttribute('aria-pressed',String(!state.category&&!state.query));$('navigation-home').textContent=text.homeLabel+' ↗';$('navigation-home').href=new URL('../index.html?lang='+state.language,base);
  $('categories').setAttribute('aria-label',text.chooseCategory);$('category-hub').setAttribute('aria-label',text.chooseCategory);
  const categories=catalog.categories.filter(c=>visibleItems(catalog,config.activeEdition,c.id).length).sort((a,b)=>a.order-b.order);
  const primary=['drinks-beverage','pizze-tradizione','fritti','antipasti','primi'];
  const categoryButton=category=>{const button=create('button','category-shortcut',category.id==='drinks-beverage'?text.drinksShortcut:categoryText(category.id));button.type='button';button.dataset.category=category.id;button.setAttribute('aria-pressed',String(state.category===category.id));return button;};
  const currentCategory=state.category?categoryText(state.category):state.query?text.results:'';
  $('compact-category-label').textContent=text.categoryBack+(currentCategory?' · '+currentCategory:'');
  $('compact-categories').setAttribute('aria-label',text.chooseCategory+(currentCategory?': '+currentCategory:''));
  $('category-picker-title').textContent=text.chooseCategory;
  $('close-category-picker').setAttribute('aria-label',text.close);
  const overviewButton=create('button','category-shortcut',text.overviewTitle);
  overviewButton.type='button';overviewButton.dataset.category='';overviewButton.setAttribute('aria-pressed',String(!state.category&&!state.query));
  $('category-picker-options').replaceChildren(overviewButton,...categories.map(categoryButton));
  updateCompactNavigation();
  $('quick-categories').replaceChildren(...primary.map(id=>categories.find(c=>c.id===id)).filter(Boolean).map(categoryButton));
  $('more-options').replaceChildren(...categories.filter(c=>!primary.includes(c.id)).map(categoryButton));
  $('more-label').textContent=state.category&&!primary.includes(state.category)?categoryText(state.category):text.moreCategories;
  $('more-categories').open=false;
  const overview=!state.category&&!state.query.trim();
  $('category-hub').replaceChildren(...(overview?['bevande','pizzeria','cucina'].map(group=>{
    const section=create('section','category-group');section.append(create('h3','',text[{pizzeria:'groupPizzeria',cucina:'groupCucina',bevande:'groupBevande'}[group]]));
    const grid=create('div','category-grid');
    for(const category of categories.filter(c=>c.group===group)){
      const count=visibleItems(catalog,config.activeEdition,category.id).length,link=create('a','category-tile');
      const url=new URL(location.href);url.searchParams.set('category',category.id);for(const key of ['q','item','variant'])url.searchParams.delete(key);
      link.href=url.href;link.dataset.category=category.id;
      if(category.cover){const img=imageElement(category.cover,'thumbnail','');img.className='category-cover';link.append(img);}else{const decoration=create('span','category-decoration','CB');decoration.setAttribute('aria-hidden','true');link.append(decoration);}
      const caption=create('span','category-caption');caption.append(create('span','category-name',categoryText(category.id)),create('span','category-count',count+' '+countLabel(count)));link.append(caption);grid.append(link);
    }
    section.append(grid);return section;
  }):[]));
  $('category-overview').hidden=!overview;$('menu-listing').hidden=overview;
  const collection=activeCollection();
  $('category-title').textContent=collection?text[collection.labelKey]:state.category?categoryText(state.category):text.results;
  $('collection-back').hidden=!collection;$('collection-back').textContent='← '+categoryText('drinks-beverage');
  const items=overview?[]:currentItems();$('count').textContent=items.length+' '+countLabel(items.length);
  $('no-results').textContent=text.noResults;$('no-results').hidden=overview||items.length>0;
  const entries=state.category==='drinks-beverage'&&!collection&&!state.query.trim()?groupDepartmentItems(items):items.map(item=>({type:'item',item}));
  $('items').replaceChildren(...entries.map(entry=>{
    if(entry.type==='collection')return collectionCard(entry);
    const {item}=entry;
    const content=itemText(item.id),category=catalog.categories.find(c=>c.id===item.categoryId);
    const card=create('article','pizza-card'+(!item.available?' unavailable':'')+(!item.thumbnail?' no-photo':'')+(item.imageStyle==='cutout'?' product-cutout':''));card.dataset.item=item.id;card.dataset.group=category.group;
    card.classList.toggle('soft-drink',drinkCollections.find(collection=>collection.id==='soft-drink').itemIds.includes(item.id));
    const visual=create('div','card-visual'),photoButton=create('button','photo-button');photoButton.type='button';photoButton.dataset.item=item.id;photoButton.setAttribute('aria-label',text.details+': '+content.name);
    if(item.thumbnail)photoButton.append(imageElement(item.thumbnail,'thumbnail',content.name));else{const placeholder=create('div','photo-placeholder','CB');placeholder.setAttribute('aria-hidden','true');photoButton.append(placeholder);}
    visual.append(photoButton);
    const body=create('div','card-body'),row=create('div','card-title-row'),title=create('h3','',content.name);title.id='name-'+item.id;card.setAttribute('aria-labelledby',title.id);
    row.append(title,create('span','price',money(item.priceCents)));if(!state.category)body.append(create('span','result-category',categoryText(item.categoryId)));body.append(row,create('p','card-description',content.description));if(!item.available)body.append(create('p','',text.unavailable));visual.append(body);
    const bottom=create('div','card-bottom'),open=create('button','detail-button',text.details);open.type='button';open.dataset.item=item.id;open.setAttribute('aria-label',text.details+': '+content.name);bottom.append(open);card.append(visual,bottom);return card;
  }));
  const edition=editions.editions.find(e=>e.id===config.activeEdition);$('cover-charge').textContent=text.coverCharge+' '+money(edition.coverChargeCents)+' '+text.perPerson;
  $('frozen-note').textContent=text.frozen;$('back-link').textContent=text.back;$('retry').textContent=text.retry;
  $('status').hidden=true;$('retry').hidden=true;if(state.item)renderDetail();syncURL();
}
function renderDetail(){
  const item=currentItems().find(item=>item.id===state.item);if(!item){state.item=null;state.variant=null;return;}
  const text=ui(),content=itemText(item.id),offer=selectedOffer(item,state.variant);
  $('detail-image').classList.toggle('product-cutout',item.imageStyle==='cutout');
  $('detail-category').textContent=categoryText(item.categoryId);$('detail-title').textContent=content.name;$('detail-description').textContent=content.description;
  $('close-detail').setAttribute('aria-label',text.close);$('formats-label').textContent=text.formats;
  const image=$('detail-image').firstElementChild;
  const photo=['ruota-di-carro','ruotiello'].includes(state.variant)?null:item.image;
  if(photo && image?.dataset.item!==item.id){const next=imageElement(photo,'fullImage',content.name);next.dataset.item=item.id;$('detail-image').replaceChildren(next);}
  else if(!photo)$('detail-image').replaceChildren();else image.alt=content.name;
  $('formats').hidden=item.variants.length===0;
  $('format-options').replaceChildren(...[{id:'',label:content.standardLabel||text.standard},...item.variants.map(variant=>{
    let label=locale().variants[variant.id]||locales[config.fallbackLanguage].variants[variant.id];
    if(['ruota-di-carro','ruotiello'].includes(variant.id)&&variant.priceCents>item.priceCents)label+=' +'+money(variant.priceCents-item.priceCents);
    return {id:variant.id,label};
  })].map(format=>{
    const button=create('button','',format.label);button.type='button';button.dataset.variant=format.id;button.setAttribute('aria-pressed',String((state.variant||'')===format.id));return button;
  }));
  $('detail-price').textContent=money(offer.priceCents);
  $('detail-availability').textContent=!item.available||!offer.available?text.unavailable:'';
  $('allergen-note').textContent=text.allergensPending;
  const items=currentItems(),index=items.findIndex(entry=>entry.id===item.id);
  $('previous-item-label').textContent=text.previousItem;
  $('next-item-label').textContent=text.nextItem;
  $('previous-item').setAttribute('aria-label',text.previousItem+': '+itemText(items[(index-1+items.length)%items.length].id).name);
  $('next-item').setAttribute('aria-label',text.nextItem+': '+itemText(items[(index+1)%items.length].id).name);
  document.querySelector('.detail-navigation').setAttribute('aria-label',text.browseItems);
  $('detail-position').textContent=(index+1)+' / '+items.length;$('detail-position').setAttribute('aria-label',content.name+' · '+(index+1)+' / '+items.length);
  $('previous-item').disabled=$('next-item').disabled=items.length<2;
}
function navigateItem(direction){
  const items=currentItems(),index=items.findIndex(item=>item.id===state.item);
  if(!dialog.open||index<0||items.length<2)return;
  state.item=items[(index+direction+items.length)%items.length].id;
  state.variant=null;
  renderDetail();dialog.scrollTop=0;syncURL();
}
function closeDetail(){if(dialog.open)dialog.close();state.item=null;state.variant=null;syncURL();}
async function boot(){
  $('status').hidden=false;$('retry').hidden=true;
  try{
    config=await getJSON('./data/config.json');
    const params=new URL(location.href).searchParams;let saved;try{saved=localStorage.getItem('capriblu-menu-language');}catch{}
    state.language=[params.get('lang'),saved,config.defaultLanguage].find(language=>config.enabledLanguages.includes(language));
    const languages=initialLanguages(config,state.language);
    [catalog,editions,locales]=await Promise.all([getJSON(config.catalog),getJSON(config.editions),Promise.all(languages.map(async language=>[language,await getLocale(language)])).then(Object.fromEntries)]);
    const errors=validateMenu({...config,enabledLanguages:languages},catalog,editions,locales);if(errors.length)throw new Error(errors.join('\n'));
    const selection=resolveLegacySelection(catalog,params.get('item'),params.get('category'),params.get('variant'));
    state.category=catalog.categories.some(category=>category.id===selection.category&&visibleItems(catalog,config.activeEdition,category.id).length)?selection.category:null;
    state.collection=state.category==='drinks-beverage'&&drinkCollections.some(collection=>collection.id===params.get('collection'))?params.get('collection'):null;
    state.query=(params.get('q')||'').slice(0,120);
    const item=currentItems().find(item=>item.id===selection.item);
    state.item=item?.id||null;state.variant=item?.variants.some(variant=>variant.id===selection.variant)?selection.variant:null;
    render();if(state.item)dialog.showModal();
    document.documentElement.dataset.menuReady='true';document.dispatchEvent(new Event('menu-ready'));
  }catch(error){
    console.error(error);$('status').textContent='Non è stato possibile caricare il menu. Apri il PDF completo. / The menu could not be loaded. Open the full PDF.';$('status').hidden=false;$('retry').hidden=false;
  }
}
$('items').addEventListener('click',event=>{const collection=event.target.closest('button[data-collection]');if(collection){chooseCollection(collection.dataset.collection);return;}const button=event.target.closest('button[data-item]');if(!button)return;state.item=button.dataset.item;state.variant=null;renderDetail();dialog.showModal();syncURL();});
$('collection-back').addEventListener('click',()=>chooseCollection(null));
$('categories').addEventListener('click',event=>{const button=event.target.closest('button[data-category]');if(button)chooseCategory(button.dataset.category);});
document.addEventListener('click',event=>{if(!event.target.closest('#more-categories'))$('more-categories').open=false;});
$('more-categories').addEventListener('keydown',event=>{if(event.key==='Escape'){$('more-categories').open=false;$('more-label').focus();}});

$('category-hub').addEventListener('click',event=>{const link=event.target.closest('a[data-category]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();chooseCategory(link.dataset.category);});
$('all-categories').addEventListener('click',()=>chooseCategory(null));
$('compact-categories').addEventListener('click',()=>{categoryPicker.showModal();categoryPicker.scrollTop=0;});
$('close-category-picker').addEventListener('click',()=>categoryPicker.close());
$('category-picker-options').addEventListener('click',event=>{
  const button=event.target.closest('button[data-category]');if(!button)return;
  categoryPicker.close();chooseCategory(button.dataset.category);
});
categoryPicker.addEventListener('click',event=>{
  if(event.target!==categoryPicker)return;
  const rect=categoryPicker.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)categoryPicker.close();
});
function setSearchOpen(open) {
  document.querySelector('.topbar').classList.toggle('search-open',open);
  $('toggle-search').setAttribute('aria-expanded',String(open));
}
$('toggle-search').addEventListener('click',()=>{
  const open=$('toggle-search').getAttribute('aria-expanded')!=='true';
  setSearchOpen(open);
  if(open)$('menu-search').focus();
});
$('menu-search').addEventListener('keydown',event=>{
  if(event.key==='Escape') {setSearchOpen(false);$('toggle-search').focus();}
});
$('menu-search').addEventListener('input',event=>{if(!locales)return;state.query=event.target.value.slice(0,120);state.collection=null;state.item=null;state.variant=null;render();});
$('clear-search').addEventListener('click',()=>{state.query='';render();$('menu-search').focus();});
$('format-options').addEventListener('click',event=>{const button=event.target.closest('button[data-variant]');if(!button)return;state.variant=button.dataset.variant||null;renderDetail();syncURL();});
for (const id of ['language','detail-language']) $(id).addEventListener('change',async event=>{
  if(!locales)return;
  const language=event.target.value;
  if(!config.enabledLanguages.includes(language))return;
  $('language').disabled=$('detail-language').disabled=true;
  try{
    const next=await getLocale(language),available={...locales,[language]:next};
    const errors=validateMenu({...config,enabledLanguages:initialLanguages(config,language)},catalog,editions,available);
    if(errors.length)throw new Error(errors.join('\n'));
    locales=available;
    if(state.item){state.category=catalog.items.find(item=>item.id===state.item).categoryId;state.query='';}
    state.language=language;try{localStorage.setItem('capriblu-menu-language',language);}catch{}render();
  }catch(error){
    console.error(error);$('language').value=$('detail-language').value=state.language;
    $('status').textContent=ui().languageError;$('status').hidden=false;
  }finally{$('language').disabled=$('detail-language').disabled=false;}
});
$('close-detail').addEventListener('click',closeDetail);
$('previous-item').addEventListener('click',()=>navigateItem(-1));
$('next-item').addEventListener('click',()=>navigateItem(1));
dialog.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.target.closest('select,input,textarea,[contenteditable]'))return;
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();navigateItem(event.key==='ArrowLeft'?-1:1);}
});
dialog.addEventListener('cancel',()=>{state.item=null;state.variant=null;syncURL();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDetail();}});
$('retry').addEventListener('click',boot);
boot();
