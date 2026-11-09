import {readFile, access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {validateMenu} from '../assets/js/model.js';
const base=new URL('../',import.meta.url);
const json=async path=>JSON.parse(await readFile(new URL(path,base),'utf8'));
try {
  const config=await json('data/config.json');
  const [catalog,editions,locales]=await Promise.all([
    json(config.catalog),json(config.editions),
    Promise.all(config.enabledLanguages.map(async language=>[language,await json(config.localesBasePath+language+'.json')])).then(Object.fromEntries)
  ]);
  const errors=validateMenu(config,catalog,editions,locales);
  const resources=new Set([config.sourcePdf,...editions.editions.map(edition=>edition.sourcePdf)]);
  for (const item of catalog.items) {
    if(item.thumbnail)resources.add(config.imagesBasePath+item.thumbnail);
    if(item.image)resources.add(config.imagesBasePath+item.image);
    resources.add('../'+item.source.pdf);
    for(const variant of item.variants)resources.add('../'+variant.source.pdf);
  }
  for (const path of resources) {try{await access(new URL(path,base));}catch{errors.push('Missing file: '+path);}}
  for(const language of config.enabledLanguages){
    const names=new Set();
    for(const item of catalog.items){const name=locales[language]?.items[item.id]?.name;if(name&&names.has(name))console.warn(`Repeated display name in ${language}: ${name}`);names.add(name);}
  }
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
  else {
    const variants=catalog.items.reduce((sum,item)=>sum+item.variants.length,0);
    console.log(`Valid menu: ${catalog.items.length} dishes, ${variants} variants, ${config.enabledLanguages.join(', ')}.`);
    console.log(`Source root: ${fileURLToPath(base)}`);
    console.log(`Allergen information pending review for ${catalog.items.filter(item=>item.allergenStatus!=='verified').length} dishes.`);
  }
}catch(error){console.error('Menu validation failed: '+error.message);process.exitCode=1;}
