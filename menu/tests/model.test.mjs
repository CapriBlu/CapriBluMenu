import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateMenu,visibleItems,selectedOffer,translatedItem} from '../assets/js/model.js';
const read=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
const config=await read('data/config.json');
const catalog=await read('data/catalog.json');
const editions=await read('data/editions.json');
const locales=Object.fromEntries(await Promise.all(config.enabledLanguages.map(async language=>[language,await read('locales/'+language+'.json')])));
test('The transcribed catalog validates',()=>assert.deepEqual(validateMenu(config,catalog,editions,locales),[]));
test('Rejects invalid prices, duplicate identifiers, unknown supplements, and missing translations',()=>{
  const bad=structuredClone(catalog),texts=structuredClone(locales);
  bad.items[0].priceCents=11.9;bad.items[1].id=bad.items[0].id;bad.items[0].supplementIds=['invented'];
  delete texts.en.items.margherita;
  const errors=validateMenu(config,bad,editions,texts).join('\n');
  for(const expected of ['Invalid price','Duplicate item','Unknown supplement','Missing item translation: en/margherita'])assert.ok(errors.includes(expected),expected);
});
test('Unreviewed allergen codes cannot be presented as verified',()=>{
  const bad=structuredClone(catalog);bad.items[0].allergenStatus='verified';
  assert.ok(validateMenu(config,bad,editions,locales).some(error=>error.includes('verified legend')));
});
test('Season selection excludes items from other editions and keeps unavailable items visible',()=>{
  const changed=structuredClone(catalog);changed.items[0].available=false;changed.items[1].editionIds=['future'];
  const visible=visibleItems(changed,'autunno-2026','pizze-tradizione');
  assert.ok(visible.some(item=>item.id===changed.items[0].id));assert.ok(!visible.some(item=>item.id===changed.items[1].id));
});
test('Variant selection changes price and preserves missing allergen information',()=>{
  const item=catalog.items.find(item=>item.id==='margherita');
  assert.equal(selectedOffer(item,null).priceCents,750);
  const variant=selectedOffer(item,'ruota-di-carro');assert.equal(variant.priceCents,850);assert.equal(variant.allergenCodes,null);
  assert.equal(selectedOffer(item,'unknown').priceCents,750);
});
test('Missing language fields fall back to Italian',()=>{
  const texts=structuredClone(locales);delete texts.en.items.margherita.description;
  assert.equal(translatedItem(texts,'en','it','margherita').description,texts.it.items.margherita.description);
});
test('Image paths support department folders and reject traversal, wrong size folders and unknown departments',()=>{
  const changed=structuredClone(catalog),item=changed.items.find(item=>item.id==='margherita');
  item.thumbnail='pizze-tradizione/thumbnails/margherita.webp';
  item.image='pizze-tradizione/full/margherita.webp';
  assert.deepEqual(validateMenu(config,changed,editions,locales),[]);
  for(const bad of ['../full/margherita.webp','pizze-tradizione/../margherita.webp','unknown/thumbnails/margherita.webp','pizze-tradizione/full/margherita.webp','pizze-tradizione/thumbnails/../../menu.js']){
    item.thumbnail=bad;
    assert.ok(validateMenu(config,changed,editions,locales).some(error=>error.includes('Invalid image path')),bad);
  }
});
