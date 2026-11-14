import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectedOffer} from '../assets/js/model.js';
const catalog=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
test('Glass and carafe formats use their matching images and original prices',()=>{
 const wine=catalog.items.find(i=>i.id==='vino-locale');
 assert.match(selectedOffer(wine,null).image,/vino-calice-cutout/);assert.equal(wine.priceCents,600);
 for(const [id,price]of [['mezzo-litro',1500],['un-litro',2500]]){
  const offer=selectedOffer(wine,id);assert.match(offer.image,/vino-locale-cutout/);assert.equal(offer.priceCents,price);
 }
});
