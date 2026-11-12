import test from 'node:test';
import assert from 'node:assert/strict';
import {initialLanguages,createLocaleStore} from '../assets/js/locale-store.js';
test('Boot requests only the chosen language and fallback',()=>{
 const config={fallbackLanguage:'it',enabledLanguages:['it','en','es','pt','pl','de','fr','vi']};
 assert.deepEqual(initialLanguages(config,'vi'),['it','vi']);
 assert.deepEqual(initialLanguages(config,'it'),['it']);
});
test('Concurrent switches reuse a request and successful translations remain cached',async()=>{
 let calls=0;const get=createLocaleStore(async language=>{calls++;return {language};});
 const [a,b]=await Promise.all([get('pl'),get('pl')]);
 assert.equal(a,b);assert.equal(calls,1);await get('pl');assert.equal(calls,1);
 assert.deepEqual(await get('de'),{language:'de'});assert.equal(calls,2);
});
test('A failed language request can be retried',async()=>{
 let calls=0;const get=createLocaleStore(async language=>{if(++calls===1)throw new Error('Offline');return {language};});
 await assert.rejects(get('fr'),/Offline/);assert.deepEqual(await get('fr'),{language:'fr'});assert.equal(calls,2);
});
