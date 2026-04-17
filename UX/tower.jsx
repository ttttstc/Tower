import { useState, useCallback, useMemo, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   LARGE MOCK DATA — 80+ items, 15+ per layer
   ═══════════════════════════════════════════ */
const MOCK = {
  name: "Cloud-Native DevOps Platform",
  goal: "打造覆盖全研发生命周期的云原生 DevOps 平台",
  acceptanceCriteria: "支持 500+ 团队接入，日均 50000+ 流水线执行",
  items: [
    // ═══ 愿景层 (15 items) ═══
    { id:"v01", title:"平台愿景对齐", layer:"vision", status:"done", effort:3, deps:["d01"], assignee:"PM-A", risk:false, notes:"" },
    { id:"v02", title:"年度 OKR 拆解", layer:"vision", status:"done", effort:4, deps:["d01","d02"], assignee:"PM-A", risk:false, notes:"" },
    { id:"v03", title:"验收标准定义", layer:"vision", status:"done", effort:2, deps:["d02"], assignee:"PM-B", risk:false, notes:"" },
    { id:"v04", title:"里程碑规划", layer:"vision", status:"in_progress", effort:5, deps:["d03"], assignee:"PM-A", risk:false, notes:"" },
    { id:"v05", title:"竞品分析报告", layer:"vision", status:"done", effort:3, deps:[], assignee:"PM-B", risk:false, notes:"" },
    { id:"v06", title:"用户调研总结", layer:"vision", status:"in_progress", effort:4, deps:[], assignee:"PM-C", risk:false, notes:"" },
    { id:"v07", title:"商业化路径", layer:"vision", status:"not_started", effort:3, deps:["v04"], assignee:"PM-A", risk:false, notes:"" },
    { id:"v08", title:"开源策略", layer:"vision", status:"not_started", effort:2, deps:["v04"], assignee:"PM-B", risk:false, notes:"" },
    { id:"v09", title:"品牌定位", layer:"vision", status:"in_progress", effort:3, deps:[], assignee:"PM-C", risk:false, notes:"" },
    { id:"v10", title:"合规审查", layer:"vision", status:"blocked", effort:2, deps:[], assignee:"Legal", risk:true, notes:"等待法务审批" },
    { id:"v11", title:"安全基线", layer:"vision", status:"done", effort:3, deps:["d04"], assignee:"Sec", risk:false, notes:"" },
    { id:"v12", title:"SLA 目标", layer:"vision", status:"in_progress", effort:2, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"v13", title:"数据治理方案", layer:"vision", status:"not_started", effort:3, deps:[], assignee:"DBA", risk:false, notes:"" },
    { id:"v14", title:"技术路线图", layer:"vision", status:"in_progress", effort:5, deps:["d01","d05"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"v15", title:"投入产出预估", layer:"vision", status:"overdue", effort:2, deps:["v04"], assignee:"PM-A", risk:false, notes:"" },

    // ═══ 设计层 (17 items) ═══
    { id:"d01", title:"工作流引擎架构", layer:"design", status:"done", effort:6, deps:["c01","c02"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"d02", title:"触发链设计", layer:"design", status:"in_progress", effort:5, deps:["c02","c03"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"d03", title:"多租户隔离方案", layer:"design", status:"in_progress", effort:4, deps:["c04"], assignee:"Arch-B", risk:false, notes:"" },
    { id:"d04", title:"安全扫描架构", layer:"design", status:"done", effort:3, deps:["c05"], assignee:"Sec", risk:false, notes:"" },
    { id:"d05", title:"插件市场设计", layer:"design", status:"blocked", effort:4, deps:["c06"], assignee:"Arch-A", risk:true, notes:"依赖第三方SDK" },
    { id:"d06", title:"OAuth 认证方案", layer:"design", status:"blocked", effort:3, deps:["c03"], assignee:"Arch-B", risk:true, notes:"审批周期不确定" },
    { id:"d07", title:"API 网关设计", layer:"design", status:"done", effort:5, deps:["c01"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"d08", title:"存储层抽象", layer:"design", status:"in_progress", effort:4, deps:["i01"], assignee:"Arch-B", risk:false, notes:"" },
    { id:"d09", title:"消息队列选型", layer:"design", status:"done", effort:2, deps:["i03"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"d10", title:"前端微服务拆分", layer:"design", status:"in_progress", effort:5, deps:["c07"], assignee:"FE-Lead", risk:false, notes:"" },
    { id:"d11", title:"CLI 工具设计", layer:"design", status:"not_started", effort:3, deps:[], assignee:"Dev-E", risk:false, notes:"" },
    { id:"d12", title:"WebSocket 推送方案", layer:"design", status:"done", effort:3, deps:["c08"], assignee:"Arch-B", risk:false, notes:"" },
    { id:"d13", title:"灰度发布策略", layer:"design", status:"in_progress", effort:4, deps:["c09"], assignee:"SRE-A", risk:false, notes:"" },
    { id:"d14", title:"数据库分片方案", layer:"design", status:"overdue", effort:5, deps:["i07"], assignee:"DBA", risk:false, notes:"" },
    { id:"d15", title:"缓存架构", layer:"design", status:"done", effort:3, deps:["i06"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"d16", title:"日志架构", layer:"design", status:"in_progress", effort:3, deps:["f04"], assignee:"SRE-B", risk:false, notes:"" },
    { id:"d17", title:"配置中心设计", layer:"design", status:"not_started", effort:2, deps:["i08"], assignee:"Arch-B", risk:false, notes:"" },

    // ═══ 协同层 (16 items) ═══
    { id:"c01", title:"前后端接口联调", layer:"coordination", status:"done", effort:4, deps:["i01","i02"], assignee:"Dev-B", risk:false, notes:"" },
    { id:"c02", title:"Webhook 对接", layer:"coordination", status:"in_progress", effort:5, deps:["i02","i03"], assignee:"Dev-C", risk:false, notes:"" },
    { id:"c03", title:"权限模型协同", layer:"coordination", status:"blocked", effort:3, deps:["i03"], assignee:"Dev-A", risk:true, notes:"" },
    { id:"c04", title:"租户数据迁移", layer:"coordination", status:"in_progress", effort:4, deps:["i07"], assignee:"DBA", risk:false, notes:"" },
    { id:"c05", title:"安全扫描集成", layer:"coordination", status:"done", effort:3, deps:["i04"], assignee:"Sec", risk:false, notes:"" },
    { id:"c06", title:"插件SDK联调", layer:"coordination", status:"not_started", effort:3, deps:["i05"], assignee:"Dev-D", risk:false, notes:"" },
    { id:"c07", title:"前端组件库同步", layer:"coordination", status:"in_progress", effort:4, deps:["i09"], assignee:"FE-A", risk:false, notes:"" },
    { id:"c08", title:"实时通知联调", layer:"coordination", status:"done", effort:3, deps:["i03"], assignee:"Dev-C", risk:false, notes:"" },
    { id:"c09", title:"灰度标记透传", layer:"coordination", status:"in_progress", effort:2, deps:["i10"], assignee:"SRE-A", risk:false, notes:"" },
    { id:"c10", title:"文档站部署", layer:"coordination", status:"done", effort:2, deps:[], assignee:"FE-B", risk:false, notes:"" },
    { id:"c11", title:"E2E 测试联调", layer:"coordination", status:"overdue", effort:4, deps:["i09","i02"], assignee:"QA-A", risk:false, notes:"" },
    { id:"c12", title:"性能压测协同", layer:"coordination", status:"not_started", effort:3, deps:["i02"], assignee:"QA-B", risk:false, notes:"" },
    { id:"c13", title:"国际化资源同步", layer:"coordination", status:"not_started", effort:2, deps:[], assignee:"FE-A", risk:false, notes:"" },
    { id:"c14", title:"监控大盘联调", layer:"coordination", status:"in_progress", effort:3, deps:["f03"], assignee:"SRE-B", risk:false, notes:"" },
    { id:"c15", title:"数据报表联调", layer:"coordination", status:"not_started", effort:3, deps:["i07"], assignee:"Dev-D", risk:false, notes:"" },
    { id:"c16", title:"变更审批流", layer:"coordination", status:"blocked", effort:2, deps:[], assignee:"PM-B", risk:true, notes:"流程待定" },

    // ═══ 实现层 (18 items) ═══
    { id:"i01", title:"YAML 解析器", layer:"implementation", status:"done", effort:6, deps:["f01","f02"], assignee:"Dev-B", risk:false, notes:"" },
    { id:"i02", title:"Runner 调度器", layer:"implementation", status:"in_progress", effort:8, deps:["f02","f03"], assignee:"Dev-C", risk:false, notes:"" },
    { id:"i03", title:"事件总线", layer:"implementation", status:"done", effort:5, deps:["f03"], assignee:"Dev-A", risk:false, notes:"" },
    { id:"i04", title:"漏洞扫描引擎", layer:"implementation", status:"done", effort:4, deps:["f01"], assignee:"Sec", risk:false, notes:"" },
    { id:"i05", title:"插件沙箱", layer:"implementation", status:"not_started", effort:5, deps:["f02"], assignee:"Dev-D", risk:false, notes:"" },
    { id:"i06", title:"Redis 缓存层", layer:"implementation", status:"done", effort:3, deps:["f05"], assignee:"Dev-A", risk:false, notes:"" },
    { id:"i07", title:"数据库 Migration", layer:"implementation", status:"in_progress", effort:4, deps:["f05"], assignee:"DBA", risk:false, notes:"" },
    { id:"i08", title:"配置热加载", layer:"implementation", status:"not_started", effort:3, deps:["f05"], assignee:"Dev-E", risk:false, notes:"" },
    { id:"i09", title:"前端主框架", layer:"implementation", status:"in_progress", effort:7, deps:["f06"], assignee:"FE-A", risk:false, notes:"" },
    { id:"i10", title:"灰度路由中间件", layer:"implementation", status:"in_progress", effort:3, deps:["f03"], assignee:"SRE-A", risk:false, notes:"" },
    { id:"i11", title:"日志SDK", layer:"implementation", status:"done", effort:2, deps:["f04"], assignee:"Dev-D", risk:false, notes:"" },
    { id:"i12", title:"Metric 采集器", layer:"implementation", status:"in_progress", effort:3, deps:["f03"], assignee:"SRE-B", risk:false, notes:"" },
    { id:"i13", title:"制品仓库", layer:"implementation", status:"overdue", effort:5, deps:["f01"], assignee:"Dev-E", risk:false, notes:"" },
    { id:"i14", title:"密钥管理", layer:"implementation", status:"done", effort:3, deps:["f05"], assignee:"Sec", risk:false, notes:"" },
    { id:"i15", title:"通知服务", layer:"implementation", status:"in_progress", effort:4, deps:["f03"], assignee:"Dev-C", risk:false, notes:"" },
    { id:"i16", title:"审计日志", layer:"implementation", status:"not_started", effort:3, deps:["f04"], assignee:"Dev-A", risk:false, notes:"" },
    { id:"i17", title:"限流熔断", layer:"implementation", status:"done", effort:3, deps:["f03"], assignee:"Dev-B", risk:false, notes:"" },
    { id:"i18", title:"批量任务队列", layer:"implementation", status:"in_progress", effort:4, deps:["f05"], assignee:"Dev-D", risk:false, notes:"" },

    // ═══ 基础设施层 (16 items) ═══
    { id:"f01", title:"K8s 集群部署", layer:"infrastructure", status:"done", effort:6, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f02", title:"CI 基础镜像", layer:"infrastructure", status:"done", effort:4, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f03", title:"监控告警", layer:"infrastructure", status:"done", effort:4, deps:[], assignee:"SRE-B", risk:false, notes:"" },
    { id:"f04", title:"日志采集 Infra", layer:"infrastructure", status:"done", effort:3, deps:[], assignee:"SRE-B", risk:false, notes:"" },
    { id:"f05", title:"数据库集群", layer:"infrastructure", status:"done", effort:5, deps:[], assignee:"DBA", risk:false, notes:"" },
    { id:"f06", title:"CDN 部署", layer:"infrastructure", status:"done", effort:2, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f07", title:"DNS 配置", layer:"infrastructure", status:"done", effort:1, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f08", title:"VPN 通道", layer:"infrastructure", status:"done", effort:2, deps:[], assignee:"NetOps", risk:false, notes:"" },
    { id:"f09", title:"对象存储", layer:"infrastructure", status:"done", effort:3, deps:[], assignee:"SRE-B", risk:false, notes:"" },
    { id:"f10", title:"消息队列集群", layer:"infrastructure", status:"done", effort:4, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f11", title:"负载均衡", layer:"infrastructure", status:"done", effort:2, deps:[], assignee:"NetOps", risk:false, notes:"" },
    { id:"f12", title:"SSL 证书", layer:"infrastructure", status:"done", effort:1, deps:[], assignee:"Sec", risk:false, notes:"" },
    { id:"f13", title:"备份策略", layer:"infrastructure", status:"in_progress", effort:3, deps:[], assignee:"DBA", risk:false, notes:"" },
    { id:"f14", title:"容灾演练", layer:"infrastructure", status:"not_started", effort:4, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f15", title:"网络策略", layer:"infrastructure", status:"in_progress", effort:2, deps:[], assignee:"NetOps", risk:false, notes:"" },
    { id:"f16", title:"GPU 节点池", layer:"infrastructure", status:"not_started", effort:5, deps:[], assignee:"SRE-B", risk:false, notes:"" },
  ],
};

const LAYER_ORDER = ["infrastructure","implementation","coordination","design","vision"];
const LAYER_LABELS = { infrastructure:"基础设施层", implementation:"实现层", coordination:"协同层", design:"设计层", vision:"愿景层" };
const STATUS_COLORS = { done:"#6b7c4e", in_progress:"#c17832", not_started:"#a89f91", overdue:"#c9a832", blocked:"#b5453a" };
const STATUS_LABELS = { done:"完成", in_progress:"进行中", not_started:"待启动", overdue:"延期", blocked:"阻塞" };

/* ═══ SQUARIFIED TREEMAP ═══ */
function squarify(items, rect) {
  if (!items.length) return [];
  const total = items.reduce((s,it)=>s+it.effort,0);
  if (total===0) return items.map(it=>({...it,bx:rect.x,by:rect.y,bw:0,bh:0}));
  const sorted=[...items].sort((a,b)=>b.effort-a.effort);
  const result=[];
  let rem=[...sorted], area=rect.w*rect.h, remT=total;
  let cx=rect.x,cy=rect.y,cw=rect.w,ch=rect.h;
  while(rem.length){
    const hz=cw>=ch, side=hz?ch:cw;
    let row=[rem[0]];
    const worst=r=>{
      const rr=r.map(it=>(it.effort/remT)*area);
      const sum=rr.reduce((a,b)=>a+b,0), w=sum/side;
      let mx=0; for(const a of rr){const h=a/w;const ratio=Math.max(w/h,h/w);if(ratio>mx)mx=ratio;} return mx;
    };
    let i=1;
    while(i<rem.length){const test=[...row,rem[i]];if(worst(test)<=worst(row)){row=test;i++;}else break;}
    const rowE=row.reduce((s,it)=>s+it.effort,0);
    const rowFrac=rowE/remT, rowSize=hz?cw*rowFrac:ch*rowFrac;
    let off=0;
    for(const it of row){
      const frac=it.effort/rowE, len=side*frac;
      if(hz)result.push({...it,bx:cx,by:cy+off,bw:rowSize,bh:len});
      else result.push({...it,bx:cx+off,by:cy,bw:len,bh:rowSize});
      off+=len;
    }
    if(hz){cx+=rowSize;cw-=rowSize;}else{cy+=rowSize;ch-=rowSize;}
    area=cw*ch; rem=rem.slice(row.length); remT-=rowE;
  }
  return result;
}

/* ═══ HELPERS ═══ */
function getDepsSet(items,hid){
  if(!hid)return null;
  const s=new Set(),map=Object.fromEntries(items.map(it=>[it.id,it]));
  const dn=id=>{if(s.has(id))return;s.add(id);(map[id]?.deps||[]).forEach(dn);};
  const up=id=>{if(s.has(id))return;s.add(id);items.filter(x=>(x.deps||[]).includes(id)).forEach(x=>up(x.id));};
  dn(hid);up(hid);return s;
}

/* ═══ COMPONENTS ═══ */
function Eave({label,width}){
  const ew=width+44;
  return(
    <div style={{position:"relative",height:26,display:"flex",justifyContent:"center",zIndex:2}}>
      <svg width={ew} height={26} viewBox={`0 0 ${ew} 26`}>
        <path d={`M0 26 Q${ew*.06} 3,${ew*.14} 5 L${ew*.86} 5 Q${ew*.94} 3,${ew} 26`} fill="#d4c8b0" stroke="#b5a88e" strokeWidth="0.8"/>
        <line x1={ew*.1} y1={25} x2={ew*.9} y2={25} stroke="#b5a88e" strokeWidth="0.4"/>
        <text x={ew/2} y={17} textAnchor="middle" fontSize="8" fontWeight="700" fill="#7a6e5d" letterSpacing="0.1em" fontFamily="'Fraunces',Georgia,serif">{label}</text>
      </svg>
    </div>
  );
}

function Spire({width}){
  const w=width*.35,cx=w/2;
  return(
    <div style={{display:"flex",justifyContent:"center",marginBottom:-2}}>
      <svg width={w} height={55} viewBox={`0 0 ${w} 55`}>
        <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c9a832"/><stop offset="100%" stopColor="#8a7a45"/></linearGradient></defs>
        <line x1={cx} y1={4} x2={cx} y2={42} stroke="url(#sg)" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx={cx} cy={7} r={3.5} fill="#c9a832"/>
        <ellipse cx={cx} cy={45} rx={10} ry={3.5} fill="#b5a88e"/>
        {[18,27,35].map(y=><line key={y} x1={cx-5} y1={y} x2={cx+5} y2={y} stroke="#b5a88e" strokeWidth="1.2" strokeLinecap="round"/>)}
      </svg>
    </div>
  );
}

function Foundation({width}){
  return(
    <div style={{display:"flex",justifyContent:"center"}}>
      <div style={{width:width+50,height:14,position:"relative"}}>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:10,background:"repeating-linear-gradient(90deg,#c4b99e 0px,#c4b99e 18px,#d4c8b0 18px,#d4c8b0 20px)",borderRadius:"0 0 2px 2px"}}/>
        <div style={{position:"absolute",bottom:-3,left:-8,right:-8,height:3,background:"#b5a88e",borderRadius:1}}/>
      </div>
    </div>
  );
}

function Floor({layer,items,towerWidth,hoveredId,hlSet,assigneeFilter,gold,onEnter,onLeave,onClick}){
  // DESIGN 2.2 & 2.5: hover / 责任人筛选 均不触发 Layout Engine 重算
  // 布局只依赖 items / towerWidth / h；hover 仅改 outline + opacity；filter 仅改 opacity
  const totalE=items.reduce((s,it)=>s+it.effort,0);
  const h=Math.max(55,totalE*4.5);

  const laid=useMemo(()=>squarify(items,{x:0,y:0,w:towerWidth,h}),[items,towerWidth,h]);
  const bMap=Object.fromEntries(laid.map(b=>[b.id,b]));
  const G=1;

  return(
    <div style={{position:"relative",width:towerWidth,height:h,
      background:gold?"linear-gradient(180deg,rgba(107,124,78,0.18),rgba(107,124,78,0.08))":"rgba(244,238,228,0.5)",
      borderLeft:"2px solid #c4b99e",borderRight:"2px solid #c4b99e",overflow:"hidden"}}>
      {items.map(item=>{
        const b=bMap[item.id];if(!b)return null;
        const sc=STATUS_COLORS[item.status];
        const hov=hoveredId===item.id;
        const hl=hlSet&&hlSet.has(item.id);
        // DESIGN 2.5: 相关的亮 (opacity=1), 无关的暗 (opacity≈0.25)
        const dimByAssignee=assigneeFilter&&!assigneeFilter.has(item.assignee);
        const dimByHover=hlSet&&!hlSet.has(item.id);
        const opacity=dimByAssignee?0.25:dimByHover?0.12:1;
        const gld=gold&&item.status==="done";
        return(
          <div key={item.id} data-brick={item.id}
            onMouseEnter={()=>onEnter(item.id)} onMouseLeave={onLeave}
            onClick={()=>onClick(item)}
            style={{
              position:"absolute",left:b.bx+G,top:b.by+G,
              width:Math.max(0,b.bw-G*2),height:Math.max(0,b.bh-G*2),
              background:gld?"linear-gradient(135deg,#8a9a5e,#6b7c4e)":sc,
              borderRadius:2,cursor:"pointer",
              // DESIGN 2.2: 严禁任何 translate / scale / width / height 变化
              // 仅允许 outline / opacity 过渡
              transition:"opacity .18s ease, box-shadow .18s ease",
              opacity,
              zIndex:hov?5:1,
              display:"flex",alignItems:"center",justifyContent:"center",
              padding:"2px 3px",overflow:"hidden",
              boxShadow:hov?`0 0 0 1.5px ${sc}, 0 2px 8px ${sc}30`:"none",
            }}>
            {b.bw>30&&b.bh>14&&(
              <span style={{
                fontSize:Math.min(9.5,Math.min(b.bh*.35,b.bw*.12)),
                fontWeight:600,color:"rgba(255,255,255,0.88)",
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                textShadow:"0 1px 2px rgba(0,0,0,0.25)",lineHeight:1,maxWidth:"100%",
              }}>
                {b.bw>60?item.title:item.title.slice(0,2)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
  return(<svg style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:10}}>{lines.map((l,i)=><line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#b5a88e" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.55"/>)}</svg>);
}

function Drawer({item,onClose,onUpdate,onCreate,items,assignees}){
  const[form,setForm]=useState(item);
  const[depSearch,setDepSearch]=useState("");
  const[err,setErr]=useState("");
  const[depsOpen,setDepsOpen]=useState(false);
  useEffect(()=>{setForm(item);setDepSearch("");setErr("");setDepsOpen(false);},[item]);
  if(!item)return null;
  const isNew=!!item._isNew;

  // 环路检测：若 candidate 的依赖链中出现 form.id，则形成循环
  const wouldCycle=(candidateId)=>{
    if(candidateId===form.id)return true;
    const map=Object.fromEntries(items.map(x=>[x.id,x]));
    const seen=new Set();
    const walk=id=>{
      if(seen.has(id))return false;
      seen.add(id);
      const it=map[id];if(!it)return false;
      for(const d of (it.deps||[])){
        if(d===form.id)return true;
        if(walk(d))return true;
      }
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
  const depCandidates=items
    .filter(x=>x.id!==form.id&&(q===""||x.title.toLowerCase().includes(q)));
  const depsByLayer={};
  LAYER_ORDER.forEach(L=>{depsByLayer[L]=depCandidates.filter(x=>x.layer===L);});

  const label=(t)=><div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".06em",textTransform:"uppercase",marginBottom:5}}>{t}</div>;
  const inputSt={width:"100%",padding:"6px 8px",borderRadius:3,border:"1px solid #d4c8b0",background:"#fff",fontSize:11,color:"#3d3528",fontFamily:"inherit",outline:"none"};

  return(<>
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.1)",zIndex:99}} onClick={onClose}/>
    <div style={{position:"fixed",top:0,right:0,width:360,height:"100vh",background:"#f8f4ec",borderLeft:"1px solid #d4c8b0",zIndex:100,display:"flex",flexDirection:"column",animation:"drawerIn .24s cubic-bezier(.16,1,.3,1)"}}>
      {/* Header */}
      <div style={{padding:"20px 18px 12px",borderBottom:"1px solid #e4ddd0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,marginRight:8}}>
            <div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{isNew?"新增事项":LAYER_LABELS[form.layer]}</div>
            <input
              value={form.title||""}
              onChange={e=>setForm({...form,title:e.target.value})}
              placeholder="请输入标题…"
              style={{width:"100%",fontSize:15,fontWeight:700,color:"#3d3528",lineHeight:1.3,fontFamily:"'Fraunces',Georgia,serif",border:"none",background:"transparent",outline:"none",borderBottom:"1px dashed #d4c8b0",paddingBottom:2}}
            />
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,color:"#b5a88e",cursor:"pointer",lineHeight:1}}>×</button>
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflow:"auto",padding:"14px 18px",display:"flex",flexDirection:"column",gap:14}}>
        {/* 楼段 */}
        <div>
          {label("所属楼段")}
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
            {LAYER_ORDER.map(L=>(
              <button key={L} onClick={()=>setForm({...form,layer:L})} style={{
                padding:"3px 8px",borderRadius:3,fontSize:9.5,fontWeight:600,cursor:"pointer",
                border:form.layer===L?"2px solid #6b7c4e":"1px solid #d4c8b0",
                background:form.layer===L?"#6b7c4e22":"#fff",
                color:form.layer===L?"#6b7c4e":"#9a8e7a",
              }}>{LAYER_LABELS[L]}</button>
            ))}
          </div>
        </div>

        {/* 状态 */}
        <div>
          {label("状态")}
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
            {Object.entries(STATUS_LABELS).map(([k,lb])=>(
              <button key={k} onClick={()=>setForm({...form,status:k})} style={{
                padding:"3px 9px",borderRadius:3,fontSize:9.5,fontWeight:600,cursor:"pointer",
                border:form.status===k?`2px solid ${STATUS_COLORS[k]}`:"1px solid #d4c8b0",
                background:form.status===k?STATUS_COLORS[k]+"22":"#fff",
                color:form.status===k?STATUS_COLORS[k]:"#9a8e7a",
              }}>{lb}</button>
            ))}
          </div>
        </div>

        {/* 工作量 / 负责人 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div>
            {label("工作量 (人天)")}
            <div style={{display:"flex",alignItems:"center",gap:4,background:"#fff",border:"1px solid #d4c8b0",borderRadius:3,padding:"3px 4px"}}>
              <button onClick={()=>bumpEffort(-1)} style={{width:20,height:20,border:"1px solid #d4c8b0",background:"#f8f4ec",color:"#5a5040",borderRadius:2,cursor:"pointer",fontSize:12,lineHeight:1}}>−</button>
              <input type="number" min={1} max={20} value={form.effort||1}
                onChange={e=>{const v=parseInt(e.target.value)||1;setForm({...form,effort:Math.max(1,Math.min(20,v))});}}
                style={{flex:1,textAlign:"center",border:"none",background:"transparent",fontSize:13,fontWeight:700,color:"#3d3528",outline:"none",fontFamily:"Georgia,serif"}}/>
              <button onClick={()=>bumpEffort(1)} style={{width:20,height:20,border:"1px solid #d4c8b0",background:"#f8f4ec",color:"#5a5040",borderRadius:2,cursor:"pointer",fontSize:12,lineHeight:1}}>+</button>
            </div>
          </div>
          <div>
            {label("负责人")}
            <input list="assignee-list" value={form.assignee||""}
              onChange={e=>setForm({...form,assignee:e.target.value})}
              placeholder="姓名 / 团队" style={inputSt}/>
            <datalist id="assignee-list">
              {assignees.map(a=><option key={a} value={a}/>)}
            </datalist>
          </div>
        </div>

        {/* 依赖编辑 */}
        <div>
          {label(`依赖 (${(form.deps||[]).length})`)}
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>
            {selectedDepItems.length===0&&<span style={{fontSize:9.5,color:"#b5a88e",fontStyle:"italic"}}>暂无依赖</span>}
            {selectedDepItems.map(d=>(
              <span key={d.id} onClick={()=>toggleDep(d.id)} style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 6px",background:"#fff",border:"1px solid "+STATUS_COLORS[d.status]+"55",borderRadius:3,fontSize:9,color:"#5a5040",cursor:"pointer"}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:STATUS_COLORS[d.status]}}/>
                {d.title}
                <span style={{color:"#b5a88e",marginLeft:2}}>×</span>
              </span>
            ))}
          </div>
          <button onClick={()=>setDepsOpen(v=>!v)} style={{width:"100%",padding:"4px 8px",background:"#fff",border:"1px dashed #d4c8b0",borderRadius:3,fontSize:9.5,color:"#7a6e5d",cursor:"pointer",textAlign:"left"}}>
            {depsOpen?"▼ 收起选择器":"▶ 添加 / 编辑依赖…"}
          </button>
          {depsOpen&&<div style={{marginTop:6,background:"#fff",border:"1px solid #d4c8b0",borderRadius:4,padding:8}}>
            <input value={depSearch} onChange={e=>setDepSearch(e.target.value)} placeholder="搜索事项…" style={{...inputSt,marginBottom:6,fontSize:10}}/>
            <div style={{maxHeight:180,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
              {LAYER_ORDER.map(L=>{
                const arr=depsByLayer[L];if(!arr||!arr.length)return null;
                return(<div key={L}>
                  <div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".06em",marginBottom:2,textTransform:"uppercase"}}>{LAYER_LABELS[L]}</div>
                  {arr.map(c=>{
                    const sel=(form.deps||[]).includes(c.id);
                    const cyc=!sel&&wouldCycle(c.id);
                    return(<div key={c.id} onClick={()=>!cyc&&toggleDep(c.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 5px",borderRadius:2,cursor:cyc?"not-allowed":"pointer",opacity:cyc?0.4:1,background:sel?"rgba(107,124,78,0.12)":"transparent"}}>
                      <div style={{width:10,height:10,borderRadius:1.5,border:"1.5px solid "+(sel?"#6b7c4e":"#d4c8b0"),background:sel?"#6b7c4e":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {sel&&<span style={{color:"#fff",fontSize:7,lineHeight:1}}>✓</span>}
                      </div>
                      <span style={{width:5,height:5,borderRadius:"50%",background:STATUS_COLORS[c.status]}}/>
                      <span style={{fontSize:9.5,color:"#5a5040",flex:1}}>{c.title}</span>
                      {cyc&&<span style={{fontSize:7,color:"#b5453a"}}>循环</span>}
                    </div>);
                  })}
                </div>);
              })}
              {depCandidates.length===0&&<div style={{fontSize:9.5,color:"#b5a88e",textAlign:"center",padding:8}}>无匹配事项</div>}
            </div>
          </div>}
        </div>

        {/* 被依赖（仅查看） */}
        {depOf.length>0&&<div>
          {label(`被依赖 ↑ (${depOf.length})`)}
          {depOf.map(d=>(
            <div key={d.id} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 7px",background:"#fff",borderRadius:3,marginBottom:2,border:"1px solid #e4ddd0"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:STATUS_COLORS[d.status]}}/>
              <span style={{fontSize:9.5,color:"#5a5040",flex:1}}>{d.title}</span>
              <span style={{fontSize:8,color:"#9a8e7a"}}>{LAYER_LABELS[d.layer]}</span>
            </div>
          ))}
        </div>}

        {/* 风险 */}
        <div>
          {label("风险")}
          <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
            <input type="checkbox" checked={!!form.risk} onChange={e=>setForm({...form,risk:e.target.checked})} style={{accentColor:"#b5453a"}}/>
            <span style={{fontSize:10,color:form.risk?"#b5453a":"#9a8e7a",fontWeight:form.risk?700:500}}>
              {form.risk?"⚠ 标记为风险":"无风险"}
            </span>
          </label>
        </div>

        {/* 备注 */}
        <div>
          {label("备注")}
          <textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})}
            placeholder="补充说明（可选）"
            style={{...inputSt,minHeight:60,resize:"vertical",fontSize:10,lineHeight:1.4}}/>
        </div>

        {err&&<div style={{fontSize:9.5,color:"#b5453a",background:"#b5453a12",border:"1px solid #b5453a30",borderRadius:3,padding:"5px 8px"}}>{err}</div>}
      </div>

      {/* Footer actions */}
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
  const fmt=arr=>arr.map(it=>`  · ${it.title} [${LAYER_LABELS[it.layer]}] @${it.assignee}`).join("\n");
  const report=`📋 项目日报 — ${today}\n\n✅ 完成 (${grp("done").length})\n${fmt(grp("done"))}\n\n🟠 进行中 (${grp("in_progress").length})\n${fmt(grp("in_progress"))}\n\n⬜ 待启动 (${grp("not_started").length})\n${fmt(grp("not_started"))}\n\n🟡 延期 (${grp("overdue").length})\n${fmt(grp("overdue"))}\n\n🔴 阻塞 (${grp("blocked").length})\n${fmt(grp("blocked"))}\n\n整体: ${Math.round((grp("done").length/items.length)*100)}%`;
  const[copied,setCopied]=useState(false);
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

/* ═══ MAIN ═══ */
export default function Tower(){
  const[project,setProject]=useState(MOCK);
  const[hovered,setHovered]=useState(null);
  const[selected,setSelected]=useState(null);
  const[showReport,setShowReport]=useState(false);
  const[zoom,setZoom]=useState(0.72);
  const[assigneeFilter,setAssigneeFilter]=useState(null);
  const towerRef=useRef(null);

  const hlSet=useMemo(()=>getDepsSet(project.items,hovered),[project.items,hovered]);
  const assignees=useMemo(()=>[...new Set(project.items.map(it=>it.assignee))].sort(),[project.items]);

  const toggleAssignee=name=>{
    setAssigneeFilter(prev=>{
      if(!prev){const s=new Set(assignees);s.delete(name);return s.size===0?null:s;}
      const s=new Set(prev);if(s.has(name))s.delete(name);else s.add(name);
      return s.size===assignees.length?null:s.size===0?new Set():s;
    });
  };

  const onUpdate=u=>{setProject(p=>({...p,items:p.items.map(it=>it.id===u.id?u:it)}));setSelected(u);};
  const onCreate=u=>{
    const id=u.id||("n"+Date.now().toString(36));
    const fresh={...u,id,_isNew:undefined};
    setProject(p=>({...p,items:[...p.items,fresh]}));
    setSelected(null);
  };
  const openNewItem=()=>{
    setSelected({
      _isNew:true,
      id:"n"+Date.now().toString(36),
      title:"",
      layer:"implementation",
      status:"not_started",
      effort:1,
      deps:[],
      assignee:"",
      risk:false,
      notes:"",
    });
  };

  const totalDone=project.items.filter(it=>it.status==="done").length;
  const pct=Math.round((totalDone/project.items.length)*100);

  const BASE_W=420;
  const layerWidths={infrastructure:BASE_W,implementation:BASE_W-16,coordination:BASE_W-40,design:BASE_W-64,vision:BASE_W-92};
  const isGold=layer=>{const li=project.items.filter(it=>it.layer===layer);return li.length>0&&li.every(it=>it.status==="done");};

  return(
    <div style={{minHeight:"100vh",background:"#f0ebe0",backgroundImage:"radial-gradient(ellipse at 50% 20%,#f8f4ec 0%,#e8e0d0 100%)",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap');
        @keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.08);border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{padding:"16px 20px 8px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:7.5,fontWeight:800,letterSpacing:".22em",color:"#b5a88e",textTransform:"uppercase",marginBottom:3}}>Tower</div>
          <h1 style={{fontSize:18,fontWeight:700,color:"#3d3528",lineHeight:1.2,fontFamily:"'Fraunces',Georgia,serif"}}>{project.name}</h1>
          <p style={{fontSize:9.5,color:"#9a8e7a",marginTop:2}}>{project.goal}</p>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:750,color:pct===100?"#6b7c4e":"#5a5040",fontFamily:"Georgia,serif"}}>{pct}%</span>
          <button onClick={()=>setShowReport(true)} style={{padding:"4px 10px",borderRadius:3,border:"1px solid #d4c8b0",background:"#fff",color:"#7a6e5d",fontSize:9.5,fontWeight:600,cursor:"pointer"}}>今日日报</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{padding:"0 20px 8px",display:"flex",gap:10,flexWrap:"wrap"}}>
        {Object.entries(STATUS_LABELS).map(([k,lb])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:3}}>
            <div style={{width:7,height:7,borderRadius:1.5,background:STATUS_COLORS[k]}}/>
            <span style={{fontSize:8.5,color:"#9a8e7a"}}>{lb} {project.items.filter(it=>it.status===k).length}</span>
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Tower viewport */}
        <div style={{flex:1,display:"flex",justifyContent:"center",alignItems:"flex-start",overflow:"auto",padding:"8px 16px 40px"}}
          onWheel={e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();setZoom(z=>Math.min(2,Math.max(0.3,z+(e.deltaY>0?-0.08:0.08))));}}}
        >
          <div style={{transform:`scale(${zoom})`,transformOrigin:"top center",transition:"transform .25s ease"}}>
            <div ref={towerRef} style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center"}}>
              <Spire width={layerWidths.vision}/>
              {LAYER_ORDER.slice().reverse().map((layer,i)=>{
                const w=layerWidths[layer];
                const li=project.items.filter(it=>it.layer===layer);
                const gold=isGold(layer);
                return(
                  <div key={layer} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <Eave label={LAYER_LABELS[layer]} width={i>0?layerWidths[LAYER_ORDER[LAYER_ORDER.length-i]]:w}/>
                    <Floor layer={layer} items={li} towerWidth={w} hoveredId={hovered} hlSet={hlSet}
                      assigneeFilter={assigneeFilter} gold={gold}
                      onEnter={setHovered} onLeave={()=>setHovered(null)} onClick={setSelected}/>
                  </div>
                );
              })}
              <Foundation width={layerWidths.infrastructure}/>
              <DepLines items={project.items} hoveredId={hovered} towerRef={towerRef}/>
            </div>
          </div>
        </div>

        {/* Side panel: 新增事项 + 责任人 */}
        <div style={{width:160,flexShrink:0,borderLeft:"1px solid #d4c8b0",background:"#f8f4ec",padding:"14px 10px",overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
          {/* DESIGN 2.8: + 新增事项 按钮置于右栏顶部 */}
          <button onClick={openNewItem} style={{
            width:"100%",height:32,borderRadius:4,border:"none",
            background:"#6b7c4e",color:"#fff",
            fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:".04em",
            display:"flex",alignItems:"center",justifyContent:"center",gap:5,
            boxShadow:"0 1px 2px rgba(107,124,78,0.25)",
          }}>
            <span style={{fontSize:14,lineHeight:1,fontWeight:400}}>+</span>
            新增事项
          </button>

          <div>
          <div style={{fontSize:8,fontWeight:700,color:"#9a8e7a",letterSpacing:".08em",marginBottom:5,textTransform:"uppercase"}}>责任人</div>
          <div style={{display:"flex",gap:3,marginBottom:6}}>
            <button onClick={()=>setAssigneeFilter(null)} style={{flex:1,padding:"2px 0",borderRadius:2,border:"1px solid #d4c8b0",background:!assigneeFilter?"#6b7c4e":"#fff",color:!assigneeFilter?"#fff":"#9a8e7a",fontSize:8,fontWeight:600,cursor:"pointer"}}>全选</button>
            <button onClick={()=>setAssigneeFilter(new Set())} style={{flex:1,padding:"2px 0",borderRadius:2,border:"1px solid #d4c8b0",background:assigneeFilter?.size===0?"#b5453a":"#fff",color:assigneeFilter?.size===0?"#fff":"#9a8e7a",fontSize:8,fontWeight:600,cursor:"pointer"}}>清空</button>
          </div>
          {assignees.map(name=>{
            const active=!assigneeFilter||assigneeFilter.has(name);
            const cnt=project.items.filter(it=>it.assignee===name).length;
            return(
              <div key={name} onClick={()=>toggleAssignee(name)} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 6px",borderRadius:3,cursor:"pointer",background:active?"rgba(107,124,78,0.06)":"transparent",border:active?"1px solid rgba(107,124,78,0.15)":"1px solid transparent",marginBottom:1,transition:"all .12s"}}>
                <div style={{width:10,height:10,borderRadius:1.5,border:`1.5px solid ${active?"#6b7c4e":"#d4c8b0"}`,background:active?"#6b7c4e":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {active&&<span style={{color:"#fff",fontSize:7,lineHeight:1}}>✓</span>}
                </div>
                <span style={{fontSize:9.5,fontWeight:500,color:active?"#3d3528":"#b5a88e",flex:1}}>{name}</span>
                <span style={{fontSize:8,color:"#b5a88e"}}>{cnt}</span>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div style={{position:"fixed",bottom:16,left:16,display:"flex",flexDirection:"column",gap:3,zIndex:50}}>
        {[{label:"+",fn:()=>setZoom(z=>Math.min(2,z+.12))},{label:"−",fn:()=>setZoom(z=>Math.max(.3,z-.12))},{label:"⌂",fn:()=>setZoom(.72)}].map((b,i)=>(
          <button key={i} onClick={b.fn} style={{width:28,height:28,borderRadius:5,border:"1px solid #d4c8b0",background:"#fff",color:"#5a5040",fontSize:b.label==="⌂"?12:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{b.label}</button>
        ))}
      </div>

      {selected&&<Drawer item={selected} onClose={()=>setSelected(null)} onUpdate={onUpdate} onCreate={onCreate} items={project.items} assignees={assignees}/>}
      {showReport&&<Report items={project.items} onClose={()=>setShowReport(false)}/>}
    </div>
  );
}
