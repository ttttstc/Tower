const { useState: useStateD, useEffect: useEffectD } = React;
const { LAYER_ORDER: LO, LAYER_LABELS: LL, STATUS_COLORS: SC, STATUS_LABELS: SL } = window.TowerData;

function Drawer({item,onClose,onUpdate,onCreate,items,assignees}){
  const[form,setForm]=useStateD(item);
  const[depSearch,setDepSearch]=useStateD("");
  const[err,setErr]=useStateD("");
  const[depsOpen,setDepsOpen]=useStateD(false);
  useEffectD(()=>{setForm(item);setDepSearch("");setErr("");setDepsOpen(false);},[item]);
  if(!item)return null;
  const isNew=!!item._isNew;

  const wouldCycle=(candidateId)=>{
    if(candidateId===form.id)return true;
    const map=Object.fromEntries(items.map(x=>[x.id,x]));
    const seen=new Set();
    const walk=id=>{
      if(seen.has(id))return false;
      seen.add(id);
      const it=map[id];if(!it)return false;
      for(const d of (it.deps||[])){if(d===form.id)return true;if(walk(d))return true;}
      return false;
    };
    return walk(candidateId);
  };
  const toggleDep=(id)=>{
    const cur=form.deps||[];
    if(cur.includes(id)){setForm({...form,deps:cur.filter(x=>x!==id)});setErr("");}
    else if(wouldCycle(id)){setErr("添加该依赖会形成循环");}
    else{setForm({...form,deps:[...cur,id]});setErr("");}
  };
  const bumpEffort=(delta)=>{
    const v=Math.max(1,Math.min(20,(form.effort||1)+delta));
    setForm({...form,effort:v});
  };
  const save=()=>{
    if(!form.title||!form.title.trim()){setErr("请填写标题");return;}
    if(!form.layer){setErr("请选择楼段");return;}
    if(isNew){onCreate({...form,title:form.title.trim()});}
    else{onUpdate({...form,title:form.title.trim()});}
  };
  const selectedDepItems=(form.deps||[]).map(d=>items.find(x=>x.id===d)).filter(Boolean);
  const depOf=!isNew?items.filter(x=>(x.deps||[]).includes(form.id)):[];
  const q=depSearch.toLowerCase().trim();
  const depCandidates=items.filter(x=>x.id!==form.id&&(q===""||x.title.toLowerCase().includes(q)));
  const depsByLayer={};
  LO.forEach(L=>{depsByLayer[L]=depCandidates.filter(x=>x.layer===L);});

  const label=(t)=><div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".06em",textTransform:"uppercase",marginBottom:5}}>{t}</div>;
  const inputSt={width:"100%",padding:"6px 8px",borderRadius:3,border:"1px solid #d4c8b0",background:"#fff",fontSize:11,color:"#3d3528",fontFamily:"inherit",outline:"none",boxSizing:"border-box"};

  return(<>
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.1)",zIndex:99}} onClick={onClose}/>
    <div style={{position:"fixed",top:0,right:0,width:360,height:"100vh",background:"#f8f4ec",borderLeft:"1px solid #d4c8b0",zIndex:100,display:"flex",flexDirection:"column",animation:"drawerIn .24s cubic-bezier(.16,1,.3,1)"}}>
      <div style={{padding:"20px 18px 12px",borderBottom:"1px solid #e4ddd0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,marginRight:8}}>
            <div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{isNew?"新增事项":LL[form.layer]}</div>
            <input value={form.title||""} onChange={e=>setForm({...form,title:e.target.value})} placeholder="请输入标题…"
              style={{width:"100%",fontSize:15,fontWeight:700,color:"#3d3528",lineHeight:1.3,fontFamily:"'Fraunces',Georgia,serif",border:"none",background:"transparent",outline:"none",borderBottom:"1px dashed #d4c8b0",paddingBottom:2,boxSizing:"border-box"}}/>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,color:"#b5a88e",cursor:"pointer",lineHeight:1}}>×</button>
        </div>
      </div>

      <div style={{flex:1,overflow:"auto",padding:"14px 18px",display:"flex",flexDirection:"column",gap:14}}>
        <div>{label("所属楼段")}
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
            {LO.map(L=>(<button key={L} onClick={()=>setForm({...form,layer:L})} style={{padding:"3px 8px",borderRadius:3,fontSize:9.5,fontWeight:600,cursor:"pointer",border:form.layer===L?"2px solid #6b7c4e":"1px solid #d4c8b0",background:form.layer===L?"#6b7c4e22":"#fff",color:form.layer===L?"#6b7c4e":"#9a8e7a"}}>{LL[L]}</button>))}
          </div>
        </div>

        <div>{label("状态")}
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
            {Object.entries(SL).map(([k,lb])=>(<button key={k} onClick={()=>setForm({...form,status:k})} style={{padding:"3px 9px",borderRadius:3,fontSize:9.5,fontWeight:600,cursor:"pointer",border:form.status===k?`2px solid ${SC[k]}`:"1px solid #d4c8b0",background:form.status===k?SC[k]+"22":"#fff",color:form.status===k?SC[k]:"#9a8e7a"}}>{lb}</button>))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div>{label("工作量 (人天)")}
            <div style={{display:"flex",alignItems:"center",gap:4,background:"#fff",border:"1px solid #d4c8b0",borderRadius:3,padding:"3px 4px"}}>
              <button onClick={()=>bumpEffort(-1)} style={{width:20,height:20,border:"1px solid #d4c8b0",background:"#f8f4ec",color:"#5a5040",borderRadius:2,cursor:"pointer",fontSize:12,lineHeight:1}}>−</button>
              <input type="number" min={1} max={20} value={form.effort||1} onChange={e=>{const v=parseInt(e.target.value)||1;setForm({...form,effort:Math.max(1,Math.min(20,v))});}} style={{flex:1,textAlign:"center",border:"none",background:"transparent",fontSize:13,fontWeight:700,color:"#3d3528",outline:"none",fontFamily:"Georgia,serif",width:"100%"}}/>
              <button onClick={()=>bumpEffort(1)} style={{width:20,height:20,border:"1px solid #d4c8b0",background:"#f8f4ec",color:"#5a5040",borderRadius:2,cursor:"pointer",fontSize:12,lineHeight:1}}>+</button>
            </div>
          </div>
          <div>{label("负责人")}
            <input list="assignee-list" value={form.assignee||""} onChange={e=>setForm({...form,assignee:e.target.value})} placeholder="姓名 / 团队" style={inputSt}/>
            <datalist id="assignee-list">{assignees.map(a=><option key={a} value={a}/>)}</datalist>
          </div>
        </div>

        <div>{label(`依赖 (${(form.deps||[]).length})`)}
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>
            {selectedDepItems.length===0&&<span style={{fontSize:9.5,color:"#b5a88e",fontStyle:"italic"}}>暂无依赖</span>}
            {selectedDepItems.map(d=>(<span key={d.id} onClick={()=>toggleDep(d.id)} style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 6px",background:"#fff",border:"1px solid "+SC[d.status]+"55",borderRadius:3,fontSize:9,color:"#5a5040",cursor:"pointer"}}><span style={{width:5,height:5,borderRadius:"50%",background:SC[d.status]}}/>{d.title}<span style={{color:"#b5a88e",marginLeft:2}}>×</span></span>))}
          </div>
          <button onClick={()=>setDepsOpen(v=>!v)} style={{width:"100%",padding:"4px 8px",background:"#fff",border:"1px dashed #d4c8b0",borderRadius:3,fontSize:9.5,color:"#7a6e5d",cursor:"pointer",textAlign:"left"}}>{depsOpen?"▼ 收起选择器":"▶ 添加 / 编辑依赖…"}</button>
          {depsOpen&&<div style={{marginTop:6,background:"#fff",border:"1px solid #d4c8b0",borderRadius:4,padding:8}}>
            <input value={depSearch} onChange={e=>setDepSearch(e.target.value)} placeholder="搜索事项…" style={{...inputSt,marginBottom:6,fontSize:10}}/>
            <div style={{maxHeight:180,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
              {LO.map(L=>{const arr=depsByLayer[L];if(!arr||!arr.length)return null;return(<div key={L}>
                <div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".06em",marginBottom:2,textTransform:"uppercase"}}>{LL[L]}</div>
                {arr.map(c=>{const sel=(form.deps||[]).includes(c.id);const cyc=!sel&&wouldCycle(c.id);return(<div key={c.id} onClick={()=>!cyc&&toggleDep(c.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 5px",borderRadius:2,cursor:cyc?"not-allowed":"pointer",opacity:cyc?0.4:1,background:sel?"rgba(107,124,78,0.12)":"transparent"}}>
                  <div style={{width:10,height:10,borderRadius:1.5,border:"1.5px solid "+(sel?"#6b7c4e":"#d4c8b0"),background:sel?"#6b7c4e":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>{sel&&<span style={{color:"#fff",fontSize:7,lineHeight:1}}>✓</span>}</div>
                  <span style={{width:5,height:5,borderRadius:"50%",background:SC[c.status]}}/>
                  <span style={{fontSize:9.5,color:"#5a5040",flex:1}}>{c.title}</span>
                  {cyc&&<span style={{fontSize:7,color:"#b5453a"}}>循环</span>}
                </div>);})}
              </div>);})}
              {depCandidates.length===0&&<div style={{fontSize:9.5,color:"#b5a88e",textAlign:"center",padding:8}}>无匹配事项</div>}
            </div>
          </div>}
        </div>

        {depOf.length>0&&<div>{label(`被依赖 ↑ (${depOf.length})`)}{depOf.map(d=>(<div key={d.id} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 7px",background:"#fff",borderRadius:3,marginBottom:2,border:"1px solid #e4ddd0"}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:SC[d.status]}}/>
          <span style={{fontSize:9.5,color:"#5a5040",flex:1}}>{d.title}</span>
          <span style={{fontSize:8,color:"#9a8e7a"}}>{LL[d.layer]}</span>
        </div>))}</div>}

        <div>{label("风险")}
          <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
            <input type="checkbox" checked={!!form.risk} onChange={e=>setForm({...form,risk:e.target.checked})} style={{accentColor:"#b5453a"}}/>
            <span style={{fontSize:10,color:form.risk?"#b5453a":"#9a8e7a",fontWeight:form.risk?700:500}}>{form.risk?"⚠ 标记为风险":"无风险"}</span>
          </label>
        </div>

        <div>{label("备注")}
          <textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="补充说明（可选）" style={{...inputSt,minHeight:60,resize:"vertical",fontSize:10,lineHeight:1.4}}/>
        </div>

        {err&&<div style={{fontSize:9.5,color:"#b5453a",background:"#b5453a12",border:"1px solid #b5453a30",borderRadius:3,padding:"5px 8px"}}>{err}</div>}
      </div>

      <div style={{padding:"10px 18px 14px",borderTop:"1px solid #e4ddd0",display:"flex",gap:8,background:"#f8f4ec"}}>
        <button onClick={onClose} style={{flex:1,padding:"7px 0",borderRadius:3,border:"1px solid #d4c8b0",background:"#fff",color:"#7a6e5d",fontSize:10,fontWeight:600,cursor:"pointer"}}>取消</button>
        <button onClick={save} style={{flex:2,padding:"7px 0",borderRadius:3,border:"none",background:"#6b7c4e",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:".04em"}}>{isNew?"创建事项":"保存修改"}</button>
      </div>
    </div>
  </>);
}

function Report({items,onClose}){
  const today=new Date().toLocaleDateString("zh-CN");
  const grp=s=>items.filter(it=>it.status===s);
  const fmt=arr=>arr.map(it=>`  · ${it.title} [${LL[it.layer]}] @${it.assignee}`).join("\n");
  const report=`📋 项目日报 — ${today}\n\n✅ 完成 (${grp("done").length})\n${fmt(grp("done"))}\n\n🟠 进行中 (${grp("in_progress").length})\n${fmt(grp("in_progress"))}\n\n⬜ 待启动 (${grp("not_started").length})\n${fmt(grp("not_started"))}\n\n🟡 延期 (${grp("overdue").length})\n${fmt(grp("overdue"))}\n\n🔴 阻塞 (${grp("blocked").length})\n${fmt(grp("blocked"))}\n\n整体: ${Math.round((grp("done").length/items.length)*100)}%`;
  const[copied,setCopied]=useStateD(false);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.2)",backdropFilter:"blur(4px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#f8f4ec",borderRadius:10,border:"1px solid #d4c8b0",width:"90%",maxWidth:480,maxHeight:"80vh",overflow:"auto",padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <h3 style={{fontSize:14,fontWeight:700,color:"#3d3528",margin:0,fontFamily:"'Fraunces',Georgia,serif"}}>进展日报</h3>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:14,color:"#b5a88e",cursor:"pointer"}}>×</button>
        </div>
        <pre style={{fontSize:9.5,lineHeight:1.7,color:"#5a5040",whiteSpace:"pre-wrap",fontFamily:"Georgia,serif",background:"#fff",padding:14,borderRadius:6,border:"1px solid #e4ddd0",margin:0}}>{report}</pre>
        <button onClick={()=>{navigator.clipboard?.writeText(report);setCopied(true);setTimeout(()=>setCopied(false),1200);}} style={{marginTop:8,width:"100%",padding:"6px 0",borderRadius:4,border:"1px solid #d4c8b0",background:copied?"#6b7c4e":"#fff",color:copied?"#fff":"#5a5040",fontSize:10,fontWeight:600,cursor:"pointer"}}>{copied?"已复制 ✓":"复制到剪贴板"}</button>
      </div>
    </div>
  );
}

window.TowerDrawer = Drawer;
window.TowerReport = Report;
