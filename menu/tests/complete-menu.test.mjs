import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateMenu} from '../assets/js/model.js';
const read=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
const [catalog,config,editions]=await Promise.all(['data/catalog.json','data/config.json','data/editions.json'].map(read));
const locales=Object.fromEntries(await Promise.all(config.enabledLanguages.map(async l=>[l,await read('locales/'+l+'.json')])));

test('All 17 autumn departments are populated and every dish has a PDF source',()=>{
 assert.equal(catalog.categories.length,17);assert.equal(catalog.items.length,119);
 for(const c of catalog.categories)assert.ok(catalog.items.some(i=>i.categoryId===c.id),c.id);
 for(const i of catalog.items){assert.equal(i.source.pdf,'pdf/menu_autunno.pdf');assert.ok(i.source.page>=1&&i.source.page<=17);}
});
test('Key PDF prices and size options remain distinct',()=>{
 const item=id=>catalog.items.find(i=>i.id===id);
 assert.equal(item('linguine-astice').priceCents,2890);
 assert.equal(item('margherita').priceCents,750);assert.equal(item('ruota-margherita').priceCents,850);
 assert.equal(item('domenica-alle-tre').priceCents,1490);assert.equal(item('rutiello-domenica').priceCents,1590);
 assert.equal(item('patate-dippers').priceCents,800);assert.equal(item('patate-dippers').variants.find(v=>v.id==='maionese-lime').priceCents,890);
 assert.deepEqual(item('vino-locale').variants.map(v=>v.priceCents),[1500,2500]);
 assert.equal(item('birra-spina').variants[0].priceCents,650);
});
test('Library image paths are allowed without accepting traversal or arbitrary directories',()=>{
 const c=structuredClone(catalog),item=c.items[0];
 item.thumbnail='biblioteca/fritti/thumbnails/example.webp';item.image='biblioteca/fritti/full/example.webp';
 assert.deepEqual(validateMenu(config,c,editions,locales),[]);
 for(const path of ['biblioteca/../thumbnails/photo.webp','biblioteca/unknown/thumbnails/photo.webp','biblioteca/fritti/full/photo.webp','biblioteca/fritti/thumbnails/../../menu.js']){
  item.thumbnail=path;assert.ok(validateMenu(config,c,editions,locales).some(e=>e.includes('Invalid image path')),path);
 }
});
test('New content and navigation are translated in all four languages',()=>{
 assert.deepEqual(config.enabledLanguages,['it','en','es','pt']);
 for(const l of Object.values(locales))for(const i of catalog.items)assert.ok(l.items[i.id]?.description&&l.items[i.id]?.name,i.id);
 for(const l of ['en','es','pt'])assert.notEqual(locales[l].items['gnocchi-sorrentina'].description,locales.it.items['gnocchi-sorrentina'].description);
});

