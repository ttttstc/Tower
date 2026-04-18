const { useState, useMemo, useRef, useEffect } = React;
const { LAYER_ORDER, LAYER_LABELS, STATUS_COLORS, STATUS_LABELS, PAGODA, squarify } = window.TowerData;

/* ═══════════════════════════════════════════════════════════
   SPIRE — bronze finial with stacked rings + flame-point top
   ═══════════════════════════════════════════════════════════ */
function Spire({width}){
  const w=Math.max(64,width*.42), cx=w/2;
  return(
    <div style={{display:"flex",justifyContent:"center",marginBottom:-4,position:"relative",zIndex:3}}>
      <svg width={w} height={72} viewBox={`0 0 ${w} 72`} style={{overflow:"visible"}}>
        <defs>
          <linearGradient id="brz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a64a"/><stop offset="55%" stopColor={PAGODA.bronze}/><stop offset="100%" stopColor={PAGODA.bronze_dk}/>
          </linearGradient>
        </defs>
        {/* flame point */}
        <path d={`M${cx} 0 L${cx-2.5} 10 L${cx+2.5} 10 Z`} fill="url(#brz)"/>
        {/* stem */}
        <rect x={cx-1} y={10} width="2" height="20" fill="url(#brz)"/>
        {/* stacked rings (baoding - 宝顶) */}
        {[0,1,2,3].map(i=>{
          const y=30+i*5, rw=4.5+i*1.4;
          return <ellipse key={i} cx={cx} cy={y} rx={rw} ry={1.8} fill="url(#brz)" stroke={PAGODA.bronze_dk} strokeWidth=".4"/>;
        })}
        {/* bulb */}
        <ellipse cx={cx} cy={55} rx="9" ry="6" fill="url(#brz)" stroke={PAGODA.bronze_dk} strokeWidth=".6"/>
        {/* base plate */}
        <rect x={cx-14} y={63} width="28" height="3" fill={PAGODA.tile_mid} stroke={PAGODA.tile_dark} strokeWidth=".3"/>
        <rect x={cx-16} y={66} width="32" height="3" fill={PAGODA.tile_dark}/>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EAVE — curved grey-tile roof with upturned corners (飞檐)
   No text on eave (moved to side labels)
   ═══════════════════════════════════════════════════════════ */
function Eave({width, small=false}){
  const overhang=small?18:30;
  const ew=width+overhang*2;
  const h=small?24:32;
  const curveUp=small?4:6;
  return(
    <div style={{position:"relative",height:h,display:"flex",justifyContent:"center",zIndex:2,marginTop:-2,marginBottom:-2}}>
      <svg width={ew+24} height={h+8} viewBox={`0 0 ${ew+24} ${h+8}`} style={{overflow:"visible"}}>
        <defs>
          <linearGradient id={`tile-g-${width}-${small?1:0}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PAGODA.tile_light}/>
            <stop offset="45%" stopColor={PAGODA.tile_mid}/>
            <stop offset="100%" stopColor={PAGODA.tile_dark}/>
          </linearGradient>
        </defs>
        {/* roof body — a swooping shape with flared corners */}
        <path
          d={`M12 ${h+4}
              Q14 ${h-curveUp} 24 ${h-curveUp-2}
              L${overhang*0.8} 8
              Q${overhang} 2, ${overhang+18} 4
              L${ew-overhang-18} 4
              Q${ew-overhang} 2, ${ew-overhang*0.8} 8
              L${ew+12-24} ${h-curveUp-2}
              Q${ew+12-14} ${h-curveUp} ${ew+12} ${h+4}
              Z`}
          fill={`url(#tile-g-${width}-${small?1:0})`}
          stroke={PAGODA.tile_dark} strokeWidth=".6"/>
        {/* tile ridges — horizontal lines */}
        {[0.35,0.55,0.78].map((f,i)=>(
          <path key={i} d={`M${overhang*0.9} ${4+(h-4)*f} L${ew+12-overhang*0.9} ${4+(h-4)*f}`}
            stroke={PAGODA.tile_dark} strokeWidth=".3" opacity=".5"/>
        ))}
        {/* ridge cap on top */}
        <rect x={overhang+20} y="2" width={ew-overhang*2-40} height="3" fill={PAGODA.tile_dark} rx="1"/>
        {/* 斗栱 bracket indication — small dark rectangles under the eave */}
        {Array.from({length: Math.max(6, Math.floor(width/45))}).map((_,i,arr)=>{
          const step=(width-20)/arr.length;
          const x=overhang+12+10+i*step;
          return <rect key={i} x={x} y={h-3} width="3" height="4" fill={PAGODA.wood_dark} opacity=".75"/>;
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WOOD BALCONY — thin railing strip under eave / above body
   ═══════════════════════════════════════════════════════════ */
function Balcony({width}){
  const ew=width+18;
  return(
    <div style={{display:"flex",justifyContent:"center",position:"relative",zIndex:1,marginTop:-4}}>
      <svg width={ew} height={10} viewBox={`0 0 ${ew} 10`}>
        <rect x="0" y="0" width={ew} height="3" fill={PAGODA.wood_dark}/>
        <rect x="0" y="3" width={ew} height="4" fill={PAGODA.wood_mid}/>
        {/* balusters */}
        {Array.from({length: Math.floor(ew/12)}).map((_,i)=>(
          <rect key={i} x={4+i*12} y="3" width="1.5" height="4" fill={PAGODA.wood_dark} opacity=".6"/>
        ))}
        <rect x="0" y="7" width={ew} height="2" fill={PAGODA.wood_dark}/>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FLOOR — wood body with cream plaster panels, bricks inside
   Height auto-grows to fit effort total
   ═══════════════════════════════════════════════════════════ */
function Floor({items,towerWidth,hoveredId,hlSet,assigneeFilter,gold,onEnter,onLeave,onClick,floorIndex}){
  const totalE=items.reduce((s,it)=>s+it.effort,0);
  /* Height: scales with total effort so bricks aren't cramped.
     Min 72, each effort unit ~= 4.2px, capped to keep tower balanced. */
  const h=Math.max(66, Math.min(totalE*3.4, 130));
  /* Inner content area — insets for the wood frame */
  const framePadX=10, framePadY=8;
  const contentW=towerWidth-framePadX*2;
  const contentH=h-framePadY*2;
  const laid=useMemo(()=>squarify(items,{x:0,y:0,w:contentW,h:contentH}),[items,contentW,contentH]);
  const bMap=Object.fromEntries(laid.map(b=>[b.id,b]));
  const G=1;
  return(
    <div style={{position:"relative",width:towerWidth,height:h,display:"flex",justifyContent:"center",zIndex:1}}>
      {/* wood frame/wall backdrop */}
      <div style={{position:"absolute",inset:0,
        background:`linear-gradient(180deg, ${PAGODA.wood_light} 0%, ${PAGODA.wood_mid} 45%, ${PAGODA.wood_dark} 100%)`,
        borderLeft:`2px solid ${PAGODA.wood_dark}`,
        borderRight:`2px solid ${PAGODA.wood_dark}`,
      }}/>
      {/* vertical wooden posts */}
      <div style={{position:"absolute",left:framePadX-2,top:0,bottom:0,width:3,background:PAGODA.wood_dark,opacity:.7}}/>
      <div style={{position:"absolute",right:framePadX-2,top:0,bottom:0,width:3,background:PAGODA.wood_dark,opacity:.7}}/>
      {/* top & bottom wood beams */}
      <div style={{position:"absolute",left:0,right:0,top:0,height:3,background:PAGODA.wood_dark}}/>
      <div style={{position:"absolute",left:0,right:0,bottom:0,height:3,background:PAGODA.wood_dark}}/>

      {/* brick panel — cream plaster inset holding the bricks */}
      <div style={{
        position:"absolute",
        left:framePadX,top:framePadY,
        width:contentW,height:contentH,
        background: gold
          ? `linear-gradient(180deg, ${STATUS_COLORS.done}22, ${STATUS_COLORS.done}0c)`
          : `linear-gradient(180deg, ${PAGODA.plaster} 0%, ${PAGODA.plaster_dk} 100%)`,
        boxShadow:"inset 0 1px 3px rgba(60,40,20,0.25), inset 0 -1px 1px rgba(255,255,255,0.15)",
      }}/>

      {/* BRICKS */}
      <div style={{position:"absolute",left:framePadX,top:framePadY,width:contentW,height:contentH}}>
        {items.map(item=>{
          const b=bMap[item.id];if(!b)return null;
          const sc=STATUS_COLORS[item.status];
          const hov=hoveredId===item.id;
          const dimByAssignee=assigneeFilter&&!assigneeFilter.has(item.assignee);
          const dimByHover=hlSet&&!hlSet.has(item.id);
          const opacity=dimByAssignee?0.2:dimByHover?0.14:1;
          const gld=gold&&item.status==="done";
          return(
            <div key={item.id} data-brick={item.id}
              onMouseEnter={()=>onEnter(item.id)} onMouseLeave={onLeave}
              onClick={()=>onClick(item)}
              style={{
                position:"absolute",left:b.bx+G,top:b.by+G,
                width:Math.max(0,b.bw-G*2),height:Math.max(0,b.bh-G*2),
                background:gld?`linear-gradient(135deg,${STATUS_COLORS.done},${STATUS_COLORS.done}cc)`:sc,
                borderRadius:2,cursor:"pointer",
                transition:"opacity .18s ease, box-shadow .18s ease",
                opacity, zIndex:hov?5:1,
                display:"flex",alignItems:"center",justifyContent:"center",
                padding:"2px 3px",overflow:"hidden",
                boxShadow:hov?`0 0 0 1.5px ${sc}, 0 2px 8px ${sc}40`:`inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.18)`,
              }}>
              {b.bw>30&&b.bh>14&&(
                <span style={{
                  fontSize:Math.min(10,Math.min(b.bh*.36,b.bw*.13)),
                  fontWeight:600,color:"rgba(255,255,255,0.92)",
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                  textShadow:"0 1px 2px rgba(0,0,0,0.35)",lineHeight:1,maxWidth:"100%",
                }}>
                  {b.bw>60?item.title:item.title.slice(0,2)}
                </span>
              )}
              {item.risk && b.bw>22 && b.bh>18 && (
                <span style={{position:"absolute",top:1,right:2,fontSize:7,color:"#ffd966"}}>⚠</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOUNDATION — stone base + red temple wall
   ═══════════════════════════════════════════════════════════ */
function Foundation({width}){
  const w=width+80;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginTop:-2}}>
      {/* temple red wall strip */}
      <div style={{width:w-10,height:22,background:`linear-gradient(180deg, ${PAGODA.red_wall}, #7a2a1c)`,
        borderTop:`2px solid ${PAGODA.wood_dark}`,
        position:"relative",
        boxShadow:"inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.25)"}}>
        {/* door arch suggestion */}
        <div style={{position:"absolute",left:"50%",top:4,transform:"translateX(-50%)",width:28,height:18,
          background:`linear-gradient(180deg,#3a1a10,#1a0a06)`,
          borderRadius:"14px 14px 0 0",
          border:`1px solid ${PAGODA.bronze_dk}`}}/>
      </div>
      {/* stone platform */}
      <div style={{width:w,height:9,background:`repeating-linear-gradient(90deg, ${PAGODA.stone} 0 22px, #9e947f 22px 24px)`,borderTop:`1px solid ${PAGODA.tile_dark}`,borderBottom:`1px solid #6e6252`}}/>
      <div style={{width:w+16,height:5,background:PAGODA.stone,borderTop:`1px solid #6e6252`}}/>
      <div style={{width:w+22,height:3,background:"#6e6252"}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEP LINES — dashed overlay connecting hovered brick to deps
   ═══════════════════════════════════════════════════════════ */
function DepLines({items,hoveredId,towerRef}){
  const[lines,setLines]=useState([]);
  useEffect(()=>{
    if(!hoveredId||!towerRef.current){setLines([]);return;}
    const item=items.find(it=>it.id===hoveredId);if(!item){setLines([]);return;}
    const tR=towerRef.current.getBoundingClientRect();
    const gc=id=>{const el=towerRef.current.querySelector(`[data-brick="${id}"]`);if(!el)return null;const r=el.getBoundingClientRect();return{x:r.left+r.width/2-tR.left,y:r.top+r.height/2-tR.top};};
    const hc=gc(hoveredId);if(!hc){setLines([]);return;}
    const nl=[];
    (item.deps||[]).forEach(d=>{const dc=gc(d);if(dc)nl.push({x1:hc.x,y1:hc.y,x2:dc.x,y2:dc.y});});
    items.filter(it=>(it.deps||[]).includes(hoveredId)).forEach(it=>{const dc=gc(it.id);if(dc)nl.push({x1:hc.x,y1:hc.y,x2:dc.x,y2:dc.y});});
    setLines(nl);
  },[hoveredId,items]);
  if(!lines.length)return null;
  return(<svg style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:10,width:"100%",height:"100%"}}>
    {lines.map((l,i)=><line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={PAGODA.bronze} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.65"/>)}
  </svg>);
}

window.TowerPagoda = { Eave, Spire, Foundation, Floor, DepLines, Balcony };
