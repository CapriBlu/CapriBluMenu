// Browser history for the interactive menu; the original catalog renderer stays in charge.
const fields=['language','category','collection','item','variant','query'];
const snapshot=state=>Object.fromEntries(fields.map(key=>[key,state[key]]));
const marker='capriBluMenu';
export function createMenuHistory(state,restore){
 let current,restoring=false,scrollTimer;
 const read=()=>history.state?.[marker];
 const record=(value,depth,detailParent=false,scroll=[scrollX,scrollY])=>({value:snapshot(value),depth,detailParent,scroll});
 const write=(method,entry,url)=>history[method]({...history.state,[marker]:entry},'',url);
 const urlFor=(url,value)=>{const next=new URL(url);next.searchParams.set('lang',value.language);for(const key of ['category','collection','item','variant']){if(value[key])next.searchParams.set(key,value[key]);else next.searchParams.delete(key);}if(value.query)next.searchParams.set('q',value.query);else next.searchParams.delete('q');return next;};
 addEventListener('popstate',event=>{
  const entry=event.state?.[marker];if(!entry)return;
  clearTimeout(scrollTimer);restoring=true;
  const value={...entry.value,language:state.language};
  current={...entry,value};
  const url=new URL(location.href);url.searchParams.set('lang',value.language);write('replaceState',current,url);
  restore({...value});
  requestAnimationFrame(()=>{scrollTo(...entry.scroll);restoring=false;});
 });
 addEventListener('scroll',()=>{
  if(restoring||!current)return;
  current={...current,scroll:[scrollX,scrollY]};
  clearTimeout(scrollTimer);
  scrollTimer=setTimeout(()=>{if(!restoring&&current)write('replaceState',current,location.href);},150);
 },{passive:true});
 return {
  sync(url){
   if(restoring)return;
   const value=snapshot(state);
   if(!current){
    const existing=read();
    if(existing){current=record(value,existing.depth,existing.detailParent,existing.scroll);write('replaceState',current,url);return;}
    // A shared link to a dish still has an in-menu destination for Back.
    const root={...value,category:null,collection:null,item:null,variant:null,query:''};
    current=record(root,0,false,[0,0]);write('replaceState',current,urlFor(url,root));
    if(value.category||value.query){const category={...value,collection:null,item:null,variant:null};current=record(category,current.depth+1,false,[0,0]);write('pushState',current,urlFor(url,category));}
    if(value.collection){const collection={...value,item:null,variant:null};current=record(collection,current.depth+1,false,[0,0]);write('pushState',current,urlFor(url,collection));}
    if(value.item){current=record(value,current.depth+1,true);write('pushState',current,url);}
    return;
   }
   clearTimeout(scrollTimer);write('replaceState',current,location.href);
   const previous=current.value;
   const openingDetail=!previous.item&&!!value.item;
   const push=previous.category!==value.category||previous.collection!==value.collection||openingDetail||(!previous.query&&!!value.query);
   current=record(value,current.depth+(push?1:0),openingDetail||(!push&&!!value.item&&current.detailParent));
   write(push?'pushState':'replaceState',current,url);
  },
  closeDetail(){if(current?.detailParent){history.back();return true;}return false;},
  back(){if(current?.depth>0){history.back();return true;}return false;}
 };
}
