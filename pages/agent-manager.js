(()=>{
 'use strict';
 const P=window.AIOSPrompts,A=window.AIOSAgents,$=id=>document.getElementById(id),clone=P.clone;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ps=P.store(localStorage),db=A.store(localStorage,ps),moduleName=id=>P.modules.find(m=>m.id===id)?.name||id;
 const states={enabled:'启用',disabled:'停用',draft:'草稿'},results={pending:'未评估',passed:'通过',failed:'未通过'};
 const categories={basic:['基本配置',''],artifacts:['Artifact','Markdown 文档'],evaluations:['Evaluation','评估规则'],skills:['Skill','执行技能'],knowledge:['知识库','参考资料']};
 let editingDocument=null,documentBeforeEdit=null,editingDocumentKind=null;
 const documentSelectionKey='aios.agentDocumentSelection.v1';
 let documentSelections={};
 try{const stored=JSON.parse(localStorage.getItem(documentSelectionKey)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))documentSelections=stored;}catch{}
 const selectionKey=()=>current.id+':'+section;
 function rememberDocument(id){documentSelections[selectionKey()]=id;try{localStorage.setItem(documentSelectionKey,JSON.stringify(documentSelections));}catch{}}

 const visibleCategories=()=>current?.id==='agent-campaigns'?{basic:categories.basic,knowledge:['References','参考文档'],skills:categories.skills}:categories;
 const isDocumentSection=()=>section!=='basic'&&(section==='artifacts'||current?.id==='agent-products'||(current?.id==='agent-campaigns'&&['knowledge','skills'].includes(section))||current?.[section]?.some(r=>typeof r.markdown==='string'));
 let state,current=null,original=null,section='basic',activeTab='agents',modalMode=null,editId=null,modalSubmit=null,modalEpoch=0,toastTimer;
 const changed=()=>current&&JSON.stringify(current)!==JSON.stringify(original);
 function notify(message){$('status').textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('status').textContent='',4000);}
 function error(e){$('agent-error').textContent=e.message;notify(e.message);}
 const badge=(text,type='')=>`<span class="badge ${esc(type)}">${esc(text)}</span>`;
 const option=(value,label,selected)=>`<option value="${esc(value)}" ${value===selected?'selected':''}>${esc(label)}</option>`;
 const field=(id,label,value='',type='input',extra='')=>`<div class="field ${extra}"><label for="${id}">${label}</label>${type==='textarea'?`<textarea id="${id}" name="${id}" rows="4">${esc(value)}</textarea>`:`<input id="${id}" name="${id}" value="${esc(value)}" autocomplete="off">`}</div>`;
 const select=(id,label,values,value)=>`<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${id}">${values.map(([k,v])=>option(k,v,value)).join('')}</select></div>`;
 const date=v=>v?new Date(v).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'尚未更新';
 function commit(next){state=db.saveAgent(next,state.rev);current=clone(state.agents.find(a=>a.id===next.id));original=clone(current);$('agent-error').textContent='';window.dispatchEvent(new Event('agents-changed'));}
 function save(silent=false){if(!current)return true;try{if(editingDocument){const doc=current[editingDocumentKind].find(r=>r.id===editingDocument);if(!doc.markdown.trim())throw Error('文档正文不能为空');if(new Blob([doc.markdown]).size>1024*1024)throw Error('文档超过 1 MB，请缩小后保存');if(doc.markdown!==documentContent(documentBeforeEdit))doc.updatedAt=new Date().toISOString();if(editingDocumentKind==='knowledge')doc.content=doc.markdown;}if(changed())commit(current);editingDocument=documentBeforeEdit=editingDocumentKind=null;if(!silent)notify('Agent 配置已保存');return true;}catch(e){error(e);return false;}}
 function changeTab(tab){if(!window.PromptManager.beforeLeave(()=>changeTab(tab))||!save(true))return false;activeTab=tab;$('agent-view').hidden=tab!=='agents';$('prompt-view').hidden=tab!=='prompts';for(const k of ['agents','prompts']){$('tab-'+k).classList.toggle('selected',tab===k);$('tab-'+k).setAttribute('aria-selected',tab===k);}if(tab==='agents'&&!current)renderList();return true;}
 function renderList(){const list=state.agents.filter(a=>!a.archived);$('agent-count').textContent=list.length+' 个 Agent';$('agent-list').innerHTML=list.length?list.map(a=>`<article class="agent-row"><div class="agent-avatar ${a.module}">${esc(P.modules.find(m=>m.id===a.module)?.icon||'A')}</div><div><div class="agent-name">${esc(a.name)}</div><div class="agent-description">${esc(a.description)}</div></div><div class="module-cell"><div class="cell-label">所属模块</div><div class="cell-value">${esc(moduleName(a.module))}</div></div><div class="prompt-total"><div class="cell-label">提示词</div><div class="cell-value">${a.prompts.length} 条</div></div><div class="state-cell">${badge(states[a.status],a.status)}</div><button class="text-button configure" data-open="${esc(a.id)}" aria-label="配置 ${esc(a.name)}">配置 ›</button></article>`).join(''):'<div class="panel empty-state"><h3>暂无 Agent</h3></div>';}
 function openAgent(id){if(!window.PromptManager.beforeLeave(()=>openAgent(id))||!save(true))return;const found=state.agents.find(a=>a.id===id&&!a.archived);if(!found)return;current=clone(found);original=clone(found);section='basic';changeTab('agents');$('agent-list-view').hidden=true;$('agent-detail').hidden=false;renderDetail();}
 function renderHeading(){$('agent-title').textContent=current.name;$('agent-subtitle').textContent=moduleName(current.module)+' · 配置就绪后可接入业务执行';$('agent-state').className='badge '+current.status;$('agent-state').textContent=states[current.status];}
 function renderDetail(){if(!visibleCategories()[section])section='basic';renderHeading();$('agent-sections').innerHTML=Object.entries(visibleCategories()).map(([k,[name]])=>`<button role="tab" aria-selected="${section===k}" class="${section===k?'selected':''}" data-section="${k}">${name}${k==='basic'?'':`<small>${current[k].length}</small>`}</button>`).join('');if(section==='basic')renderBasic();else renderResources();}
 function renderBasic(){const definitions=P.catalog.filter(d=>d.module===current.module);$('agent-content').innerHTML=`<div class="form-grid">${field('a-name','Agent 名称',current.name)}<div class="field"><label>所属模块</label><input value="${esc(moduleName(current.module))}" readonly aria-label="所属模块（只读）"></div>${field('a-description','职责说明',current.description,'textarea','span-two')}${field('a-location','使用位置',current.location)}${field('a-output','输出位置',current.outputLocation)}</div><h3 class="section-label">输入数据</h3><div class="checks">${Object.entries(P.vars).map(([k,v])=>`<label class="check-chip"><input type="checkbox" data-input="${k}" ${current.inputs.includes(k)?'checked':''}>${v[0]}</label>`).join('')}</div><h3 class="section-label">关联提示词 <span class="muted">始终使用最新发布内容</span></h3><div class="binding-list">${definitions.map(d=>{const link=current.prompts.find(p=>p.id===d.id);return `<div class="binding"><label><input type="checkbox" data-binding="${d.id}" ${link?'checked':''}>${esc(d.name)}</label><button class="text-button" data-edit-prompt="${d.id}">编辑提示词 ›</button></div>`;}).join('')}</div><p class="field-hint">关联提示词时自动补齐所需输入。发布后自动使用最新内容。</p>`;}
 function resourceDescription(){return {artifacts:'文档正文直接展示，可随时新增和编辑。',evaluations:'维护评估标准，按实际输出记录人工评估结果。',skills:'定义能力和执行步骤，按列表顺序组织。',knowledge:'维护参考资料；当前仅保存文件与文本，尚未接入知识检索。'}[section];}
 function renderResources(){if(isDocumentSection()){$('agent-content').innerHTML='<div id="resource-list"></div>';renderDocuments();return;}const labels={artifacts:'新增',evaluations:'新增',skills:'新增',knowledge:'新增'};$('agent-content').innerHTML=`<div class="resource-toolbar"><div><h3>${categories[section][1]}</h3><p>${resourceDescription()}</p></div><button id="add-document" class="primary">${labels[section]}</button></div>${section==='artifacts'&&current.artifacts.length<2?'':'<input id="resource-search" class="resource-search" aria-label="搜索当前分类" placeholder="搜索名称或说明">'}<div id="resource-list"></div>`;renderRows();}
 function renderRows(){if(isDocumentSection())return renderDocuments();const q=($('resource-search')?.value||'').trim().toLowerCase(),list=current[section].filter(r=>!q||(r.name+' '+(r.description||'')).toLowerCase().includes(q));$('resource-list').innerHTML=list.length?list.map(r=>{const i=current[section].findIndex(x=>x.id===r.id),prompt=P.catalog.find(d=>d.id===r.promptId);let meta='';if(section==='artifacts')meta='Markdown · '+(r.updatedAt?'更新于 '+date(r.updatedAt):'已有内容');if(section==='evaluations')meta=badge(results[r.result],r.result)+(r.evaluatedAt?'人工记录 · '+date(r.evaluatedAt):'尚未记录结果');if(section==='skills')meta='顺序 '+(i+1)+' · '+esc(r.scope)+' · 待接入执行';if(section==='knowledge')meta=(r.source==='file'?'文件 · '+esc(r.filename)+' · '+Math.ceil((r.size||0)/1024)+' KB':'文本资料')+' · 待接入检索';return `<div class="resource-row"><div class="resource-info"><div class="resource-title-line">${section==='artifacts'?`<button class="document-name" data-document="${esc(r.id)}"><span class="md-icon">MD</span>${esc(documentName(r))} <span aria-hidden="true">›</span></button>`:`<strong>${esc(r.name)}</strong>`}${!r.enabled?badge(section==='knowledge'?'未关联':'停用'):''}</div><p>${esc(r.description||'暂无说明')}</p><div class="resource-meta">${meta}</div></div><div class="resource-actions">${section==='skills'?`<button class="icon-button" data-move="${r.id}" data-delta="-1" ${i===0?'disabled':''} aria-label="上移 ${esc(r.name)}">↑</button><button class="icon-button" data-move="${r.id}" data-delta="1" ${i===current.skills.length-1?'disabled':''} aria-label="下移 ${esc(r.name)}">↓</button>`:''}${section==='evaluations'?`<button class="text-button" data-result="${r.id}">${r.result==='pending'?'记录评估':'查看结果'}</button>`:''}${section==='knowledge'?`<button class="text-button" data-view="${r.id}">查看</button>`:''}<button class="text-button" data-edit="${r.id}">编辑</button>${section==='artifacts'?`<button class="text-button" data-download="${r.id}">下载</button>`:''}<button data-toggle="${r.id}">${section==='knowledge'?(r.enabled?'取消关联':'关联'):(r.enabled?'停用':'启用')}</button></div></div>`;}).join(''):`<div class="empty-state"><h3>${q?'没有匹配内容':'还没有'+categories[section][1]}</h3><p>${q?'试试其他关键词。':'点击右上角添加，逐步完善 Agent。'}</p></div>`;}
 function modal(title,description,html,submit,button='保存'){modalEpoch++;$('dialog-title').textContent=title;$('dialog-description').textContent=description;$('dialog-fields').innerHTML=html;$('dialog-error').textContent='';$('confirm-dialog').textContent=button;$('confirm-dialog').hidden=!submit;$('cancel-dialog').textContent=submit?'取消':'关闭';$('confirm-dialog').disabled=false;modalSubmit=submit;$('manage-dialog').showModal();}
 function closeModal(){modalEpoch++;$('manage-dialog').close();modalSubmit=null;modalMode=null;editId=null;}
 function promptSelect(value){return select('r-prompt','关联提示词',[['','不指定'],...current.prompts.map(p=>[p.id,P.catalog.find(d=>d.id===p.id).name])],value||'');}
 function openResource(id=null){if(!save(true))return;if(section==='artifacts')return editDocument(id);modalMode=section;editId=id;const r=current[section].find(x=>x.id===id)||{},kind=section;let html=field('r-name','名称',r.name)+field('r-description','说明',r.description,'textarea');if(kind==='evaluations')html+=promptSelect(r.promptId)+field('r-input','测试输入',r.input,'textarea')+field('r-criteria','检查项与判断规则',r.criteria,'textarea')+field('r-reference','参考结果',r.reference,'textarea');if(kind==='skills')html+=select('r-scope','操作范围',['只读分析','生成草稿','修改业务数据','发送消息'].map(x=>[x,x]),r.scope||'只读分析')+field('r-input','输入',r.input,'textarea')+field('r-steps','执行步骤',r.steps,'textarea')+field('r-output','输出',r.output,'textarea');if(kind==='knowledge')html+=`<div class="field"><label for="r-source">资料类型</label><select id="r-source">${option('text','文本资料',r.source||'text')}${option('file','上传文件',r.source)}</select></div><div id="text-source">${field('r-content','资料内容',r.content,'textarea')}</div><div id="file-source" class="upload-zone" hidden><label for="r-file">选择文件</label><p class="field-hint">支持 TXT、MD、PDF、DOCX，每份最多 1 MB。文件保存在本浏览器。</p><input id="r-file" type="file" accept=".txt,.md,.pdf,.docx"><p id="file-current" class="field-hint">${r.filename?'当前文件：'+esc(r.filename):'尚未选择文件'}</p></div>`;
  modal((id?'编辑':'新增')+categories[kind][1],kind==='skills'?'执行步骤为配置内容，尚未连接实际工具。':'',html,async()=>{
   const value=id=>$(id).value.trim(),next={...clone(r),id:r.id||A.uid(),name:value('r-name'),description:value('r-description'),enabled:r.enabled??true};if(!next.name)throw Error('请填写名称');
   if(kind==='evaluations'){Object.assign(next,{promptId:value('r-prompt'),input:value('r-input'),criteria:value('r-criteria'),reference:value('r-reference')});if(!next.input||!next.criteria)throw Error('请填写测试输入和判断规则');const updated=['promptId','input','criteria','reference'].some(k=>next[k]!==r[k]);if(!r.id||updated)Object.assign(next,{result:'pending',actual:'',reason:'',evaluatedAt:null});}
   if(kind==='skills'){Object.assign(next,{scope:value('r-scope'),input:value('r-input'),steps:value('r-steps'),output:value('r-output')});if(!next.steps)throw Error('请填写执行步骤');}
   if(kind==='knowledge'){next.source=value('r-source');next.updatedAt=new Date().toISOString();if(next.source==='text'){next.content=value('r-content');if(!next.content)throw Error('请填写资料内容');delete next.fileData;delete next.filename;delete next.size;}else{const file=$('r-file').files[0];if(file){if(!/\.(txt|md|pdf|docx)$/i.test(file.name))throw Error('请选择 TXT、MD、PDF 或 DOCX 文件');if(file.size>1024*1024)throw Error('文件超过 1 MB，请缩小后重试');next.filename=file.name;next.size=file.size;next.fileData=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('文件读取失败'));reader.readAsDataURL(file);});next.content=/\.(txt|md)$/i.test(file.name)?await file.text():'';}else if(!r.fileData)throw Error('请选择文件');}}
   return ()=>{const a=clone(current),idx=a[kind].findIndex(x=>x.id===next.id);if(idx<0)a[kind].push(next);else a[kind][idx]=next;commit(a);renderDetail();notify('已保存');};
  });if(kind==='knowledge'){const sync=()=>{$('text-source').hidden=$('r-source').value!=='text';$('file-source').hidden=$('r-source').value!=='file';};$('r-source').onchange=sync;sync();}
 }

 const documentName=r=>r.filename||(/\.md$/i.test(r.name)?r.name:r.name+'.md');
 const documentContent=r=>typeof r.markdown==='string'?r.markdown:'# '+r.name+'\n\n'+(r.description?r.description+'\n\n':'')+(r.content||r.structure||r.steps||[r.input&&'## 测试输入\n\n'+r.input,r.criteria&&'## 判断规则\n\n'+r.criteria,r.reference&&'## 参考结果\n\n'+r.reference].filter(Boolean).join('\n\n'));
 function markdownHTML(text){
  // Render a safe Markdown subset. Raw HTML and remote media remain inert text.
  const inline=t=>esc(t).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  let html='',code=null,list=null;
  text=text.replace(/\r\n?/g,'\n');const frontmatter=text.match(/^---\n[\s\S]*?\n---(?:\n|$)/);if(frontmatter){html='<pre class="md-frontmatter"><code>'+esc(frontmatter[0].trimEnd())+'</code></pre>';text=text.slice(frontmatter[0].length);}
  const closeList=()=>{if(list){html+='</'+list+'>';list=null;}};
  for(const line of text.replace(/\r\n?/g,'\n').split('\n')){
   if(/^\s*```/.test(line)){closeList();if(code!==null){html+='<pre><code>'+esc(code.join('\n'))+'</code></pre>';code=null;}else code=[];continue;}
   if(code!==null){code.push(line);continue;}
   const h=line.match(/^(#{1,6})\s+(.+)$/),li=line.match(/^\s*(?:([-+*])|\d+\.)\s+(.+)$/);
   if(li){const type=li[1]?'ul':'ol';if(list!==type){closeList();html+='<'+type+(type==='ol'?' start="'+Number(line.match(/^\s*(\d+)/)[1])+'"':'')+'>';list=type;}html+='<li>'+inline(li[2])+'</li>';continue;}
   closeList();if(h)html+=`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`;
   else if(/^>\s?/.test(line))html+='<blockquote>'+inline(line.replace(/^>\s?/,''))+'</blockquote>';
   else if(/^\s*([-*_])\1{2,}\s*$/.test(line))html+='<hr>';
   else if(line.trim())html+='<p>'+inline(line)+'</p>';
  }
  closeList();if(code!==null)html+='<pre><code>'+esc(code.join('\n'))+'</code></pre>';return html;
 }
 function renderDocuments(){
  const docs=current[section],multiple=docs.length>1;
  const r=docs.find(d=>d.id===documentSelections[selectionKey()])||docs[0];
  if(!r){$('resource-list').innerHTML='<div class="document-toolbar"><button id="add-document" class="primary">新增</button></div><div class="empty-state">暂无文档</div>';return;}
  rememberDocument(r.id);
  const directory=multiple?`<aside class="document-directory" aria-label="文档目录">${docs.length>5?'<input id="document-search" type="search" placeholder="搜索文档" aria-label="搜索文档">':''}<nav class="document-directory-items" aria-label="选择文档">${docs.map(d=>`<button class="document-choice ${d.id===r.id?'selected':''}" data-select-document="${esc(d.id)}" aria-current="${d.id===r.id?'page':'false'}" title="${esc(documentName(d))}">${esc(d.name||documentName(d))}</button>`).join('')}<p id="document-no-match" class="muted" hidden>没有匹配的文档</p></nav></aside><div class="document-mobile-picker"><select id="document-select" aria-label="选择文档">${docs.map(d=>option(d.id,d.name||documentName(d),r.id)).join('')}</select></div>`:'';
  $('resource-list').innerHTML=`<div class="${multiple?'document-workspace':'document-single'}">${directory}<section class="inline-document" aria-label="当前文档"><header class="inline-document-header"><div class="resource-actions"><button id="add-document" class="primary">新增</button>${r.id===editingDocument?'<button data-cancel-document>取消</button><button class="primary" data-save-document>保存修改</button>':`<button class="document-edit-button" data-edit="${esc(r.id)}">编辑</button>`}</div></header>${r.id===editingDocument?`<div class="inline-editor"><label for="inline-md-content">Markdown 正文</label><p class="field-hint">直接修改正文，保存后展示排版效果。</p><textarea id="inline-md-content" spellcheck="false">${esc(documentContent(r))}</textarea></div>`:`<article class="markdown-body inline-document-body">${markdownHTML(documentContent(r))}</article>`}</section></div>`;
 }
 function discardDocument(){if(!editingDocument)return;const idx=current[editingDocumentKind].findIndex(r=>r.id===editingDocument);current[editingDocumentKind][idx]=clone(documentBeforeEdit);editingDocument=documentBeforeEdit=editingDocumentKind=null;$('agent-error').textContent='';}
 function leaveDocument(next){
  const doc=editingDocument&&current[editingDocumentKind].find(r=>r.id===editingDocument);
  if(!doc||documentContent(doc)===documentContent(documentBeforeEdit)){if(save(true))next();return;}
  modal('保存文档修改？','当前文档有未保存的内容，请选择保存或放弃后切换。','<button type="button" id="discard-document-switch">放弃修改并切换</button>',()=>{if(!save(true))throw Error($('agent-error').textContent);return next;},'保存并切换');
  $('discard-document-switch').onclick=()=>{discardDocument();closeModal();next();};
 }
 function selectDocument(id){
  if(id===documentSelections[selectionKey()]||!current[section].some(d=>d.id===id))return;
  // Keep the current selection visible while the user decides what to do with edits.
  if($('document-select'))$('document-select').value=documentSelections[selectionKey()];
  leaveDocument(()=>{rememberDocument(id);renderDocuments();$('resource-list').scrollIntoView({block:'start'});});
 }
 function filterDocuments(query){const q=query.trim().toLowerCase();let count=0;for(const button of document.querySelectorAll('[data-select-document]')){const doc=current[section].find(d=>d.id===button.dataset.selectDocument);button.hidden=!(documentName(doc)+' '+doc.name).toLowerCase().includes(q);if(!button.hidden)count++;}$('document-no-match').hidden=count>0;}
 function editInlineDocument(id){if(!save(true))return;editingDocument=id;editingDocumentKind=section;const doc=current[section].find(r=>r.id===id);documentBeforeEdit=clone(doc);doc.markdown=documentContent(doc);renderDocuments();$('inline-md-content').focus();}
 function newDocument(){
  const kind=section;
  modal('新增文档',visibleCategories()[kind][0],field('new-document-name','文档名称')+field('new-document-content','Markdown 正文','','textarea','markdown-editor'),()=>{
   const entered=$('new-document-name').value.trim(),markdown=$('new-document-content').value;
   const name=entered.replace(/\.md$/i,'').trim();
   if(!name)throw Error('请填写文档名称');
   if(/[\\/]/.test(name))throw Error('文档名称不能包含路径');
   if(current[kind].some(r=>documentName(r).toLowerCase()===(name+'.md').toLowerCase()))throw Error('已有同名文档，请修改名称');
   if(!markdown.trim())throw Error('请填写 Markdown 正文');
   if(new Blob([markdown]).size>1024*1024)throw Error('文档超过 1 MB，请缩小后保存');
   const doc={id:A.uid(),name,filename:name+'.md',description:'',markdown,enabled:true,updatedAt:new Date().toISOString()};
   if(kind==='artifacts')doc.format='Markdown';
   if(kind==='evaluations')Object.assign(doc,{result:'pending',actual:'',reason:'',evaluatedAt:null});
   if(kind==='skills')doc.scope='只读分析';
   if(kind==='knowledge')Object.assign(doc,{source:'text',content:markdown});
   return ()=>{const next=clone(current);next[kind].push(doc);commit(next);rememberDocument(doc.id);renderDetail();notify('文档已新增');};
  },'保存文档');
  $('new-document-name').focus();
 }
 function viewDocument(id){const r=current.artifacts.find(x=>x.id===id),content=documentContent(r);
  modal(documentName(r),r.description||'Markdown 文档',`<div class="document-tabs"><button type="button" id="md-preview" aria-pressed="true">阅读</button><button type="button" id="md-source" aria-pressed="false">MD 原文</button></div><article id="md-reading" class="markdown-body">${markdownHTML(content)}</article><pre id="md-raw" class="read-content" hidden>${esc(content)}</pre>`,null);
  const mode=raw=>{$('md-reading').hidden=raw;$('md-raw').hidden=!raw;$('md-preview').setAttribute('aria-pressed',!raw);$('md-source').setAttribute('aria-pressed',raw);};
  $('md-preview').onclick=()=>mode(false);$('md-source').onclick=()=>mode(true);
 }
 function downloadDocument(id){const r=current.artifacts.find(x=>x.id===id),url=URL.createObjectURL(new Blob([documentContent(r)],{type:'text/markdown;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=documentName(r);a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function editDocument(id){const r=current.artifacts.find(x=>x.id===id)||{};
  modal(id?'编辑文档':'新增文档','上传 .md 文件，或直接填写文件名和正文。',`<div class="field"><label for="md-file">上传 MD 文件</label><input type="file" id="md-file" accept=".md,text/markdown"><p class="field-hint">最多 1 MB；读取后可继续编辑。</p></div>`+field('md-filename','文件名',id?documentName(r):'')+field('md-description','说明（选填）',r.description)+field('md-content','Markdown 正文',id?documentContent(r):'','textarea','markdown-editor'),()=>{
   let filename=$('md-filename').value.trim();const markdown=$('md-content').value;
   if(!filename)throw Error('请填写文件名');if(/[\\/]/.test(filename))throw Error('文件名不能包含路径');if(!/\.md$/i.test(filename))filename+='.md';
   if(!markdown.trim())throw Error('请填写 Markdown 正文');if(new Blob([markdown]).size>1024*1024)throw Error('文档超过 1 MB，请缩小后保存');
   if(current.artifacts.some(x=>x.id!==r.id&&documentName(x).toLowerCase()===filename.toLowerCase()))throw Error('已有同名文档，请修改文件名');
   const next={...clone(r),id:r.id||A.uid(),name:filename.replace(/\.md$/i,''),filename,description:$('md-description').value.trim(),markdown,format:'Markdown',enabled:r.enabled??true,updatedAt:new Date().toISOString()};
   return ()=>{const a=clone(current),idx=a.artifacts.findIndex(x=>x.id===next.id);if(idx<0)a.artifacts.push(next);else a.artifacts[idx]=next;commit(a);renderDetail();notify('文档已保存');};
  });
  let uploadSeq=0;const epoch=modalEpoch;
  $('md-file').onchange=async()=>{const seq=++uploadSeq,file=$('md-file').files[0];if(!file)return;$('dialog-error').textContent='';
   try{if(!/\.md$/i.test(file.name))throw Error('请选择 .md 文件');if(file.size>1024*1024)throw Error('文件超过 1 MB');$('confirm-dialog').disabled=true;const content=await file.text();if(epoch!==modalEpoch||seq!==uploadSeq)return;$('md-filename').value=file.name;$('md-content').value=content;}
   catch(e){if(epoch===modalEpoch&&seq===uploadSeq)$('dialog-error').textContent=e.message;}
   finally{if(epoch===modalEpoch&&seq===uploadSeq)$('confirm-dialog').disabled=false;}
  };
 }

 function recordResult(id){const r=current.evaluations.find(x=>x.id===id);modal('评估结果','人工记录实际输出与判断依据；系统不会自动生成通过结论。',`<div class="evaluation-result"><strong>${esc(r.name)}</strong><p class="review-note">${esc(r.criteria)}</p></div>`+field('result-actual','实际输出',r.actual,'textarea')+select('result-status','评估结论',Object.entries(results),r.result)+field('result-reason','判断原因',r.reason,'textarea'),()=>{const actual=$('result-actual').value.trim(),reason=$('result-reason').value.trim(),result=$('result-status').value;if(result!=='pending'&&(!actual||!reason))throw Error('请填写实际输出和判断原因');return ()=>{const a=clone(current),item=a.evaluations.find(x=>x.id===id);Object.assign(item,{actual,reason,result,evaluatedAt:result==='pending'?null:new Date().toISOString()});commit(a);renderDetail();notify('评估记录已保存');};});}
 function viewKnowledge(id){const r=current.knowledge.find(x=>x.id===id);let body=`<p class="review-note">${esc(r.description)}</p>`;if(r.source==='file'){body+=`<div class="evaluation-result"><strong>${esc(r.filename)}</strong><p class="muted">${Math.ceil(r.size/1024)} KB · 已上传，待接入检索</p>${typeof r.fileData==='string'&&r.fileData.startsWith('data:')?`<a class="file-link" href="${esc(r.fileData)}" download="${esc(r.filename)}">下载原文件 ↗</a>`:''}</div>`;}if(r.content)body+=`<pre class="read-content">${esc(r.content)}</pre>`;else body+='<p class="review-note">此格式暂不展示正文，可下载原文件查看。</p>';modal(r.name,'参考资料',body,null);}
 $('tab-agents').onclick=()=>changeTab('agents');$('tab-prompts').onclick=()=>changeTab('prompts');
 $('agent-list').onclick=e=>{const id=e.target.closest('[data-open]')?.dataset.open;if(id)openAgent(id);};
 $('back-agents').onclick=()=>{if(!save(true))return;current=original=null;$('agent-detail').hidden=true;$('agent-list-view').hidden=false;renderList();};
 $('agent-sections').onclick=e=>{const k=e.target.closest('[data-section]')?.dataset.section;if(k&&k!==section)leaveDocument(()=>{section=k;renderDetail();});};
 $('agent-content').addEventListener('input',e=>{const mapping={'a-name':'name','a-description':'description','a-location':'location','a-output':'outputLocation'};if(mapping[e.target.id]){current[mapping[e.target.id]]=e.target.value;}if(e.target.id==='inline-md-content'&&editingDocument){current[editingDocumentKind].find(r=>r.id===editingDocument).markdown=e.target.value;}if(e.target.id==='resource-search')renderRows();if(e.target.id==='document-search')filterDocuments(e.target.value);});
 $('agent-content').addEventListener('change',e=>{if(e.target.id==='document-select'){selectDocument(e.target.value);return;}if(e.target.dataset.input){const k=e.target.dataset.input;current.inputs=e.target.checked?[...new Set([...current.inputs,k])]:current.inputs.filter(x=>x!==k);}if(e.target.dataset.binding){const id=e.target.dataset.binding;if(e.target.checked){current.prompts.push({id});current.inputs=[...new Set([...current.inputs,...P.catalog.find(d=>d.id===id).variables])];}else{if([...current.artifacts,...current.evaluations].some(r=>r.promptId===id)){e.target.checked=true;notify('请先调整引用此提示词的输出模板或评估');return;}current.prompts=current.prompts.filter(p=>p.id!==id);}renderBasic();}});
 $('agent-content').onclick=e=>{const button=e.target.closest('button');if(!button)return;const d=button.dataset;
  if(d.selectDocument)return selectDocument(d.selectDocument);
  if(button.id==='add-document')return leaveDocument(newDocument);
  if(button.hasAttribute('data-cancel-document')){discardDocument();renderDocuments();return;}
  if(button.hasAttribute('data-save-document')){if(save(true)){renderDocuments();notify('文档修改已保存');}return;}
  if(editingDocument){if(!save(true))return;renderDocuments();}
  if(button.id==='add-resource')return openResource();if(d.edit)return isDocumentSection()?editInlineDocument(d.edit):openResource(d.edit);if(d.result)return recordResult(d.result);if(d.view)return viewKnowledge(d.view);if(d.document)return viewDocument(d.document);if(d.download)return downloadDocument(d.download);
  if(d.editPrompt){if(!save(true)||!changeTab('prompts'))return;window.PromptManager.open(d.editPrompt);return;}
  try{
   if(d.toggle){const a=clone(current),r=a[section].find(r=>r.id===d.toggle);r.enabled=!r.enabled;commit(a);renderDetail();}

   if(d.move){const a=clone(current),i=a.skills.findIndex(r=>r.id===d.move),j=i+Number(d.delta);if(j<0||j>=a.skills.length)return;[a.skills[i],a.skills[j]]=[a.skills[j],a.skills[i]];commit(a);renderDetail();}
  }catch(err){error(err);}
 };
 $('manage-form').onsubmit=async e=>{e.preventDefault();if(!modalSubmit)return;const epoch=modalEpoch;$('confirm-dialog').disabled=true;try{const finish=await modalSubmit();if(epoch!==modalEpoch)return;finish();if(epoch===modalEpoch)closeModal();}catch(err){if(epoch===modalEpoch)$('dialog-error').textContent=err.message;}finally{if(epoch===modalEpoch)$('confirm-dialog').disabled=false;}};
 $('close-dialog').onclick=closeModal;$('cancel-dialog').onclick=closeModal;$('manage-dialog').addEventListener('cancel',e=>{e.preventDefault();closeModal();});
 window.AgentManager={beforeLeave:()=>save(true),open:openAgent};
 window.addEventListener('beforeunload',e=>{if(changed()&&!save(true)){e.preventDefault();e.returnValue='';}});
 window.addEventListener('prompt-published',()=>{if(current&&section==='basic')renderBasic();});
 window.addEventListener('storage',e=>{if(e.key===A.key){if(changed()){error(Error('其他窗口更新了 Agent 配置。请保留当前编辑并刷新后重试。'));return;}try{state=db.read();if(current){current=clone(state.agents.find(a=>a.id===current.id));original=clone(current);renderDetail();}else renderList();window.dispatchEvent(new Event('agents-changed'));}catch(err){error(err);}}});
 try{state=db.initialize();renderList();window.dispatchEvent(new Event('agents-changed'));}catch(e){$('agent-list').innerHTML='<div class="panel empty-state">'+esc(e.message)+'</div>';}
})();
