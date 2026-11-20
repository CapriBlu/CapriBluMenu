import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../assets/js/history.js',import.meta.url),'utf8').replace('export function createMenuHistory','function createMenuHistory');
function fixture(initial={}){
 const state={language:'it',category:null,collection:null,item:null,variant:null,query:'',...initial};
 const entries=[{url:'https://example.test/menu/',state:null}],listeners={};let index=0;
 const world={URL,scrollX:0,scrollY:0,setTimeout,clearTimeout,requestAnimationFrame:fn=>fn(),addEventListener:(name,fn)=>listeners[name]=fn,scrollTo:(x,y)=>{world.scrollX=x;world.scrollY=y;}};
 world.location={get href(){return entries[index].url}};
 const move=delta=>{const target=index+delta;if(target<0||target>=entries.length)return;index=target;listeners.popstate({state:entries[index].state});};
 world.history={get state(){return entries[index].state},replaceState:(value,_,url)=>entries[index]={state:value,url:String(url)},pushState:(value,_,url)=>{entries.splice(index+1);entries.push({state:value,url:String(url)});index++;},back:()=>move(-1)};
 vm.createContext(world);vm.runInContext(source,world);
 const history=world.createMenuHistory(state,value=>Object.assign(state,value));
 const save=()=>{const url=new URL(world.location.href);url.searchParams.set('lang',state.language);for(const key of ['category','collection','item','variant']){if(state[key])url.searchParams.set(key,state[key]);else url.searchParams.delete(key);}if(state.query)url.searchParams.set('q',state.query);else url.searchParams.delete('q');history.sync(url);};
 save();return {state,history,save,entries,back:()=>move(-1),forward:()=>move(1)};
}
test('Back and Forward restore the category and dish without losing the selected language',()=>{
 const f=fixture({language:'fr'});f.state.category='pizze-tradizione';f.save();f.state.item='tricolore';f.save();f.state.language='en';f.save();
 f.back();assert.equal(f.state.category,'pizze-tradizione');assert.equal(f.state.item,null);assert.equal(f.state.language,'en');
 f.forward();assert.equal(f.state.item,'tricolore');assert.equal(f.history.closeDetail(),true);assert.equal(f.state.item,null);
 f.back();assert.equal(f.state.category,null);
});
test('Typing, variants and browsing dishes do not create redundant Back steps',()=>{
 const f=fixture();f.state.category='pizze-tradizione';f.save();f.state.query='m';f.save();const count=f.entries.length;
 f.state.query='margherita';f.save();assert.equal(f.entries.length,count);f.back();assert.equal(f.state.query,'');
 f.state.item='margherita';f.save();const detailCount=f.entries.length;f.state.variant='ruotiello';f.save();f.state.item='tricolore';f.save();assert.equal(f.entries.length,detailCount);f.back();assert.equal(f.state.item,null);
});
test('Direct dish links have a category and overview to return to',()=>{
 const f=fixture({category:'pizze-tradizione',item:'tricolore',variant:'ruotiello'});
 f.back();assert.equal(f.state.item,null);assert.equal(f.state.variant,null);assert.equal(f.state.category,'pizze-tradizione');f.back();assert.equal(f.state.category,null);
});
test('Drink collections remain a separate step between department and dish',()=>{
 const f=fixture();f.state.category='drinks-beverage';f.save();f.state.collection='soft-drink';f.save();f.state.item='coca-cola';f.save();
 f.back();assert.equal(f.state.collection,'soft-drink');assert.equal(f.state.item,null);f.back();assert.equal(f.state.category,'drinks-beverage');assert.equal(f.state.collection,null);
});
