/* Prompt management: edit in memory and publish the current configuration. */
(()=>{
 'use strict';
 const P=window.AIOSPrompts,$=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const db=P.store(localStorage);let moduleId='products',id=P.catalog[0].id,entry,config,dirty=false,messageTimer,selectedScene=null;
 const def=()=>P.catalog.find(x=>x.id===id);
 function notify(message){$('status').textContent=message;clearTimeout(messageTimer);messageTimer=setTimeout(()=>$('status').textContent='',4500);}
 function fail(e){$('errors').textContent=e.message;notify(e.message);}
 const routes=[['dash','Dashboard','1-Dashboard'],['tasks','My Tasks','2-My-Tasks'],['products','Products','3-Products'],['campaigns','Campaigns','4-Campaigns'],['strategy','Strategy Studio','5-Strategy-Studio'],['brief','Brief Studio','6-Brief-Studio'],['creators','Influencer CRM','7-Influencer-CRM'],['samples','Sample Mgt','8-Sample-Mgt'],['assets','Asset Library','9-Asset-Library'],['finance','Budget Mgt','10-Budget-Mgt'],['reports','Reports','11-Reports'],['contracts','Contract Mgt','12-Contract-Mgt'],['prompts','prompt管理','15-Prompt-Mgt'],['settings','Settings','13-Settings']];
 let prefs={};try{prefs=JSON.parse(localStorage.getItem('aios.settingsOrg')||'{}')||{};}catch(_){}
 const order=Array.isArray(prefs.navOrder)?prefs.navOrder:routes.map(x=>x[0]);
 const sorted=[...new Set([...order,...routes.map(x=>x[0])])];if(!order.includes('prompts')){sorted.splice(sorted.indexOf('prompts'),1);sorted.splice(Math.max(0,sorted.indexOf('settings')),0,'prompts');}
 $('navigation').innerHTML=sorted.map(k=>routes.find(r=>r[0]===k)).filter(Boolean).filter(r=>['prompts','settings'].includes(r[0])||!(prefs.navHidden||[]).includes(r[0])).map(r=>`<a href="${r[2]}.html" ${r[0]==='prompts'?'class="active" aria-current="page"':''}>${esc(prefs.navLabels?.[r[0]]||r[1])}</a>`).join('');
 $('navigation').addEventListener('click',e=>{const link=e.target.closest('a');if(!link)return;const go=()=>{window.location.href=link.href;};if(!beforeLeave(go))e.preventDefault();});
 function renderModules(){$('modules').innerHTML=P.modules.map(m=>`<button class="module ${moduleId===m.id?'active':''}" data-module="${m.id}" aria-pressed="${moduleId===m.id}"><b>${m.icon}</b><span>${m.name}<small>${m.label} · ${P.catalog.filter(x=>x.module===m.id).length} 个场景</small></span></button>`).join('');}
 function renderList(){const rows=P.catalog.filter(x=>x.module===moduleId);$('count').textContent=rows.length+' 项';$('list').innerHTML=rows.length?rows.map(x=>{return `<button class="item ${(selectedScene||id)===x.id?'selected':''}" data-id="${x.id}" aria-pressed="${(selectedScene||id)===x.id}">${esc(x.name)}${db.resolve(x.id).shared?'<i class="shared-tag">通用</i>':''}<small>${esc(x.type)}</small></button>`;}).join(''):'<div class="empty">没有匹配的配置</div>';}
 function status(){$('save-state').textContent=dirty?'有未发布修改':'已发布';}
 function load(next){selectedScene=next;id=db.resolve(next).sourceId;entry=db.get(id);const recovered=db.takeUnpublished(id);config=P.normalize(recovered||entry.config);dirty=JSON.stringify(config)!==JSON.stringify(P.normalize(entry.config));const d=def();$('name').textContent=d.name;$('location').textContent=d.location;P.fields.forEach(k=>$(k).value=config[k]);status();renderList();validate();renderBindings();}
 function changed(){dirty=JSON.stringify(config)!==JSON.stringify(P.normalize(entry.config));status();validate();}
 function renderBindings(){
   const common=def().module==='common',scene=P.catalog.find(d=>d.id===selectedScene);
   $('common-bindings').hidden=!common;
   $('shared-source').hidden=!(common&&selectedScene!==id);
   $('shared-source').textContent=common&&selectedScene!==id?`${scene.location} · 使用「${def().name}」。在此修改的是共用配置，发布后同步到所有关联场景。`:'';
   if(!common)return;
   config.bindings??=[];
   $('binding-count').textContent=`已选 ${config.bindings.length} 个 · 已发布 ${entry.config.bindings?.length||0} 个`;
   $('binding-groups').innerHTML=P.modules.filter(m=>m.id!=='common').map(m=>{
     const scenes=P.catalog.filter(d=>d.module===m.id);
     return `<fieldset class="binding-group"><legend>${esc(m.name)}</legend><label class="binding-option binding-all"><input type="checkbox" data-bind-module="${m.id}" ${scenes.every(d=>config.bindings.includes(d.id))?'checked':''}>全选 ${esc(m.name)}</label><div class="binding-options">${scenes.map(d=>`<label class="binding-option"><input type="checkbox" data-bind-scene="${d.id}" ${config.bindings.includes(d.id)?'checked':''}><span>${esc(d.name)}<small>${esc(d.location)}</small></span></label>`).join('')}</div></fieldset>`;
   }).join('');
   for(const box of $('binding-groups').querySelectorAll('[data-bind-module]')){const scenes=P.catalog.filter(d=>d.module===box.dataset.bindModule),count=scenes.filter(d=>config.bindings.includes(d.id)).length;box.indeterminate=count>0&&count<scenes.length;}
 }
 $('binding-groups').addEventListener('change',e=>{
   const scene=e.target.dataset.bindScene,module=e.target.dataset.bindModule;if(!scene&&!module)return;
   const ids=scene?[scene]:P.catalog.filter(d=>d.module===module).map(d=>d.id);
   config.bindings=e.target.checked?[...new Set([...config.bindings,...ids])]:config.bindings.filter(id=>!ids.includes(id));
   changed();renderBindings();
 });
 let pendingLeave=null;
 function beforeLeave(next){
   if(!dirty)return true;
   pendingLeave=next||null;$('unpublished-dialog').showModal();return false;
 }
 function keepEditing(){pendingLeave=null;$('unpublished-dialog').close();}
 $('keep-editing').onclick=keepEditing;
 $('unpublished-dialog').addEventListener('cancel',e=>{e.preventDefault();keepEditing();});
 $('discard-unpublished').onclick=()=>{const next=pendingLeave;pendingLeave=null;load(selectedScene||id);$('unpublished-dialog').close();next?.();};
 P.fields.forEach(k=>{$(k).addEventListener('input',()=>{config[k]=$(k).value;dirty=JSON.stringify(config)!==JSON.stringify(P.normalize(entry.config));status();validate();});});
 $('modules').onclick=e=>{const next=e.target.closest('[data-module]')?.dataset.module;if(!next)return;const go=()=>{moduleId=next;renderModules();load(P.catalog.find(x=>x.module===next).id);};if(beforeLeave(go))go();};
 $('list').onclick=e=>{const next=e.target.closest('[data-id]')?.dataset.id;if(next&&beforeLeave(()=>load(next)))load(next);};

 $('publish').onclick=()=>{try{entry=db.publish(id,config,entry.rev);dirty=false;status();renderList();validate();window.dispatchEvent(new Event('prompt-published'));const shared=def().module==='common';notify(shared?'通用配置已发布，已关联 '+(config.bindings?.length||0)+' 个功能场景':'已发布，关联场景将使用最新内容');load(selectedScene||id);}catch(e){fail(e);}};
 function validate(){const errors=P.validate(def(),config);$('errors').textContent=errors.join('\n');$('publish').disabled=errors.length>0;}
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
 window.addEventListener('storage',e=>{if(e.key===P.key)notify('配置已在其他窗口更新，请刷新页面后继续。');});
 window.PromptManager={beforeLeave,open(next){if(!beforeLeave(()=>window.PromptManager.open(next)))return false;const d=P.catalog.find(x=>x.id===next);if(!d)return false;moduleId=d.module;renderModules();load(next);return true;}};
 try{renderModules();load(id);}catch(e){fail(e);}
})();
