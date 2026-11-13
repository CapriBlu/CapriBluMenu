import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {visibleItems,groupDepartmentItems,drinkCollections} from '../assets/js/model.js';
const catalog=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
test('Two collections replace nine drink cards without losing or duplicating any product',()=>{
  const items=visibleItems(catalog,'autunno-2026','drinks-beverage'),entries=groupDepartmentItems(items);
  assert.equal(entries.length,5);
  assert.deepEqual(entries.filter(e=>e.type==='collection').map(e=>[e.collection.id,e.members.length]),[['soft-drink',5],['bottled-beers',4]]);
  assert.deepEqual(entries.filter(e=>e.type==='item').map(e=>e.item.id),['acqua','birra-spina','vino-locale']);
  const flattened=entries.flatMap(e=>e.type==='collection'?e.members:[e.item]);
  assert.deepEqual(flattened.map(i=>i.id).sort(),items.map(i=>i.id).sort());
  for(const item of flattened)assert.equal(item.priceCents,items.find(i=>i.id===item.id).priceCents);
});
test('Collections do not absorb pizza or unrelated search matches',()=>{
  const pizza=visibleItems(catalog,'autunno-2026','pizze-tradizione');
  assert.ok(groupDepartmentItems(pizza).every(e=>e.type==='item'));
  assert.ok(!drinkCollections.find(g=>g.id==='bottled-beers').itemIds.includes('birra-spina'));
});
