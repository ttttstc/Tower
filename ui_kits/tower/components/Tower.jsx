const { useState: useS, useMemo: useM, useRef: useR } = React;
const { LAYER_ORDER: LO2, LAYER_LABELS: LL2, STATUS_COLORS: SC2, STATUS_LABELS: SL2, PAGODA: PG, MOCK, getDepsSet } = window.TowerData;
const { Eave, Spire, Foundation, Floor, DepLines, Balcony } = window.TowerPagoda;
const Drawer = window.TowerDrawer;
const Report = window.TowerReport;

function SidePanel({items,assigneeFilter,setAssigneeFilter,onNew}){
  const assignees=[...new Set(items.map(i=>i.assignee).filter(Boolean))].sort();
  return(
    <div style={{width:200,padding:"20px 14px",background:"rgba(248,244,236,0.5)",borderRight:"1px solid #e4ddd0",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>
      <button onClick={onNew} style={{padding:"8px 10px",borderRadius:4,border:"1.5px dashed #6b7c4e",background:"rgba(107,124,78,0.08)",color:"#6b7c4e",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ 新增事项</button>
      <div>
        <div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".08em",textTransform:"uppercase",marginBottom:6}}>按负责人过滤</div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          {assignees.map(a=>{
            const sel=assigneeFilter.has(a);
            const count=items.filter(i=>i.assignee===a).length;
            return(<div key={a} onClick={()=>{const ns=new Set(assigneeFilter);if(sel)ns.delete(a);else ns.add(a);setAssigneeFilter(ns);}} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 5px",borderRadius:2,cursor:"pointer",background:sel?"rgba(107,124,78,0.15)":"transparent"}}>
              <div style={{width:9,height:9,borderRadius:1.5,border:"1.5px solid "+(sel?"#6b7c4e":"#d4c8b0"),background:sel?"#6b7c4e":"transparent"}}/>
              <span style={{fontSize:9.5,color:"#5a5040",flex:1}}>{a}</span>
              <span style={{fontSize:8,color:"#9a8e7a"}}>{count}</span>
            </div>);
          })}
        </div>
        {assigneeFilter.size>0&&<button onClick={()=>setAssigneeFilter(new Set())} style={{marginTop:6,fontSize:8.5,color:"#7a6e5d",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>清除过滤</button>}
      </div>
      <div>
        <div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".08em",textTransform:"uppercase",marginBottom:6}}>图例</div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          {Object.entries(SL2).map(([k,v])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:10,height:10,borderRadius:1.5,background:SC2[k]}}/>
            <span style={{fontSize:9.5,color:"#5a5040"}}>{v}</span>
          </div>))}
        </div>
      </div>
    </div>
  );
}

function TowerApp(){
  const[items,setItems]=useS(MOCK.items);
  const[selected,setSelected]=useS(null);
  const[hovered,setHovered]=useS(null);
  const[assigneeFilter,setAssigneeFilter]=useS(new Set());
  const[showReport,setShowReport]=useS(false);
  const towerRef=useR(null);
  const LO=LO2;

  const byLayer=useM(()=>{const m={};LO.forEach(L=>m[L]=items.filter(i=>i.layer===L));return m;},[items]);
  const hlSet=useM(()=>hovered?getDepsSet(items,hovered):null,[hovered,items]);
  const allDone=items.every(i=>i.status==="done");
  const assignees=[...new Set(items.map(i=>i.assignee).filter(Boolean))].sort();

  /* Width steps are subtle — real pagoda floors are nearly uniform, only slight widening near base */
  const widths={vision:260,design:278,coordination:296,implementation:316,infrastructure:340};
  const doneCt=items.filter(i=>i.status==="done").length;
  const pct=Math.round((doneCt/items.length)*100);

  const handleNew=()=>setSelected({_isNew:true,id:"new_"+Date.now(),title:"",layer:"implementation",status:"not_started",effort:3,deps:[],assignee:"",risk:false,notes:""});
  const handleUpdate=(it)=>{setItems(items.map(x=>x.id===it.id?it:x));setSelected(null);};
  const handleCreate=(it)=>{const{_isNew,...clean}=it;setItems([...items,clean]);setSelected(null);};

  return(
    <div style={{width:"100vw",height:"100vh",display:"flex",
      background:`radial-gradient(ellipse at 50% 10%, #f0e6d0 0%, #d9cbb0 60%, #b8a88a 100%)`,
      fontFamily:"'Inter',-apple-system,sans-serif",overflow:"hidden"}}>
      <style>{`@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
      .sideLabel{font-family:'Fraunces','Noto Serif SC',Georgia,serif;writing-mode:vertical-rl;text-orientation:upright;letter-spacing:.2em}`}</style>
      <SidePanel items={items} assigneeFilter={assigneeFilter} setAssigneeFilter={setAssigneeFilter} onNew={handleNew}/>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"14px 20px 10px",borderBottom:"1px solid #e4ddd0",display:"flex",justifyContent:"space-between",alignItems:"flex-end",background:"rgba(248,244,236,0.6)"}}>
          <div>
            <div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".15em",textTransform:"uppercase",marginBottom:3}}>项目塔</div>
            <h1 style={{fontSize:18,fontWeight:700,color:"#3d3528",margin:0,fontFamily:"'Fraunces',Georgia,serif"}}>{MOCK.name}</h1>
            <div style={{fontSize:9.5,color:"#7a6e5d",marginTop:2,maxWidth:560}}>{MOCK.goal}</div>
          </div>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:18,fontWeight:700,color:"#6b7c4e",fontFamily:"Georgia,serif",lineHeight:1}}>{pct}%</div>
              <div style={{fontSize:8,color:"#9a8e7a",letterSpacing:".06em"}}>{doneCt}/{items.length} 完成</div>
            </div>
            <button onClick={()=>setShowReport(true)} style={{padding:"6px 12px",borderRadius:3,border:"1px solid #d4c8b0",background:"#fff",color:"#5a5040",fontSize:10,fontWeight:600,cursor:"pointer"}}>📋 日报</button>
          </div>
        </div>

        <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 20px 40px"}}>
          <div ref={towerRef} style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center"}}>
            <Spire width={widths.vision}/>
            {[...LO].reverse().map((L,idx)=>{
              const w=widths[L];
              const isTop=idx===0;
              return(<div key={L} style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center"}}>
                {/* side label (plaque-style) — to the right of each floor */}
                <div style={{position:"absolute",right:-130,top:18,display:"flex",alignItems:"center",gap:8,zIndex:4,pointerEvents:"none"}}>
                  <svg width="22" height="38" viewBox="0 0 22 38">
                    <path d="M2 6 Q11 0 20 6 L20 32 Q11 38 2 32 Z" fill={PG.bronze} stroke={PG.bronze_dk} strokeWidth=".6"/>
                    <path d="M4 8 Q11 3 18 8 L18 30 Q11 35 4 30 Z" fill="none" stroke={PG.bronze_dk} strokeWidth=".5"/>
                  </svg>
                  <div style={{fontFamily:"'Fraunces','Noto Serif SC',Georgia,serif",fontSize:11,fontWeight:700,color:PG.wood_dark,letterSpacing:".08em",whiteSpace:"nowrap"}}>
                    {LL2[L]}
                    <div style={{fontSize:7.5,color:PG.bronze_dk,letterSpacing:".15em",fontWeight:500,textTransform:"uppercase",marginTop:1}}>{L}</div>
                  </div>
                </div>
                {/* side tick/line to anchor */}
                <div style={{position:"absolute",right:-20,top:28,width:18,height:1,background:PG.bronze_dk,opacity:.5,zIndex:3}}/>

                <Eave width={w} small={isTop}/>
                <Balcony width={w}/>
                <Floor items={byLayer[L]} towerWidth={w} hoveredId={hovered} hlSet={hlSet} assigneeFilter={assigneeFilter.size?assigneeFilter:null} gold={allDone}
                  onEnter={setHovered} onLeave={()=>setHovered(null)} onClick={setSelected} floorIndex={idx}/>
              </div>);
            })}
            {/* final bottom eave over foundation */}
            <Eave width={widths.infrastructure+16}/>
            <Foundation width={widths.infrastructure}/>
            <DepLines items={items} hoveredId={hovered} towerRef={towerRef}/>
          </div>

          <div style={{marginTop:20,fontSize:10,color:PG.wood_dark,letterSpacing:".2em",fontStyle:"italic",fontFamily:"'Fraunces',Georgia,serif",opacity:.7}}>应 县 木 塔 · 悬 停 查 看 依 赖 · 点 击 编 辑</div>
        </div>
      </div>

      {selected&&<Drawer item={selected} items={items} assignees={assignees} onClose={()=>setSelected(null)} onUpdate={handleUpdate} onCreate={handleCreate}/>}
      {showReport&&<Report items={items} onClose={()=>setShowReport(false)}/>}
    </div>
  );
}

window.TowerApp = TowerApp;
