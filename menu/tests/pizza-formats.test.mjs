import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {visibleItems,selectedOffer,resolveLegacySelection} from '../assets/js/model.js';
const catalog=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
const edition='autunno-2026';

test('Ruota recipes remain archived but never appear as duplicate dishes or a department',()=>{
  assert.equal(visibleItems(catalog,edition,'ruota-di-carro').length,0);
  assert.ok(!visibleItems(catalog,edition).some(item=>item.categoryId==='ruota-di-carro'));
  const departments=catalog.categories.filter(c=>visibleItems(catalog,edition,c.id).length).sort((a,b)=>a.order-b.order);
  assert.equal(departments[0].id,'drinks-beverage');
  assert.ok(!departments.some(c=>c.id==='ruota-di-carro'));
});

test('Every traditional and signature pizza offers both formats at exactly two euros extra',()=>{
  for(const item of catalog.items.filter(i=>['pizze-tradizione','firmate-capri-blu'].includes(i.categoryId))){
    for(const id of ['ruotiello','ruota-di-carro']){
      const offer=selectedOffer(item,id);
      assert.equal(offer.priceCents,item.priceCents+200,item.id+'/'+id);
      assert.equal(offer.source.type,'owner-confirmed');
    }
    assert.equal(selectedOffer(item,null).priceCents,item.priceCents,item.id);
  }
  assert.ok(catalog.items.filter(i=>['drinks-beverage','fritti','primi'].includes(i.categoryId)).every(i=>!i.variants.some(v=>v.id==='ruotiello')));
});

test('Old Ruota links resolve to the original pizza with its format selected',()=>{
  for(const archived of catalog.items.filter(i=>i.categoryId==='ruota-di-carro')){
    const selection=resolveLegacySelection(catalog,archived.id,'ruota-di-carro',null);
    assert.equal(selection.item,archived.baseItemId);
    assert.equal(selection.variant,'ruota-di-carro');
    assert.notEqual(selection.category,'ruota-di-carro');
    assert.ok(visibleItems(catalog,edition,selection.category).some(i=>i.id===selection.item));
  }
  assert.equal(resolveLegacySelection(catalog,null,'ruota-di-carro',null).category,null);
});
