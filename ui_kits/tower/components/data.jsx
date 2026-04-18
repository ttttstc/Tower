/* Tower UI Kit — shared tokens (data + helpers) */

const LAYER_ORDER = ["infrastructure","implementation","coordination","design","vision"];
const LAYER_LABELS = { infrastructure:"基础设施层", implementation:"实现层", coordination:"协同层", design:"设计层", vision:"愿景层" };

/* Status colors — harmonized with 红木/青瓦/朱墙 pagoda palette */
const STATUS_COLORS = {
  done:         "#5d7a4a",  /* 松绿 — pine green, softer than before */
  in_progress:  "#b8642e",  /* 赭红 — iron-oxide red-brown, matches wood */
  not_started:  "#9a8f7a",  /* 石灰 — limewash grey-beige */
  overdue:      "#c89a3a",  /* 藤黄 — gamboge yellow */
  blocked:      "#962f2a",  /* 朱砂 — cinnabar red */
};
const STATUS_LABELS = { done:"完成", in_progress:"进行中", not_started:"待启动", overdue:"延期", blocked:"阻塞" };

/* Chinese pagoda palette */
const PAGODA = {
  wood_dark:    "#6b3a22",  /* shadow side of wood */
  wood_mid:     "#8a4a2e",  /* wood body */
  wood_light:   "#a8633f",  /* sunlit wood */
  tile_dark:    "#3a3a3a",  /* roof tile shadow */
  tile_mid:     "#5a5a5a",  /* roof tile */
  tile_light:   "#8a8a88",  /* tile highlight */
  plaster:      "#e8dcc4",  /* cream plaster panels */
  plaster_dk:   "#c4b59a",
  bronze:       "#b08a3a",
  bronze_dk:    "#6e5020",
  red_wall:     "#9c3a26",  /* temple red base wall */
  stone:        "#8a7f6e",  /* foundation stone */
};

const MOCK = {
  name: "Cloud-Native DevOps Platform",
  goal: "打造覆盖全研发生命周期的云原生 DevOps 平台",
  acceptanceCriteria: "支持 500+ 团队接入，日均 50000+ 流水线执行",
  items: [
    { id:"v01", title:"平台愿景对齐", layer:"vision", status:"done", effort:3, deps:["d01"], assignee:"PM-A", risk:false, notes:"" },
    { id:"v02", title:"年度 OKR 拆解", layer:"vision", status:"done", effort:4, deps:["d01"], assignee:"PM-A", risk:false, notes:"" },
    { id:"v03", title:"验收标准定义", layer:"vision", status:"done", effort:2, deps:[], assignee:"PM-B", risk:false, notes:"" },
    { id:"v04", title:"里程碑规划", layer:"vision", status:"in_progress", effort:5, deps:[], assignee:"PM-A", risk:false, notes:"" },
    { id:"v05", title:"竞品分析报告", layer:"vision", status:"done", effort:3, deps:[], assignee:"PM-B", risk:false, notes:"" },
    { id:"v06", title:"用户调研总结", layer:"vision", status:"in_progress", effort:4, deps:[], assignee:"PM-C", risk:false, notes:"" },
    { id:"v07", title:"商业化路径", layer:"vision", status:"not_started", effort:3, deps:["v04"], assignee:"PM-A", risk:false, notes:"" },
    { id:"v10", title:"合规审查", layer:"vision", status:"blocked", effort:2, deps:[], assignee:"Legal", risk:true, notes:"等待法务审批" },
    { id:"v14", title:"技术路线图", layer:"vision", status:"in_progress", effort:5, deps:["d01"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"v15", title:"投入产出预估", layer:"vision", status:"overdue", effort:2, deps:["v04"], assignee:"PM-A", risk:false, notes:"" },

    { id:"d01", title:"工作流引擎架构", layer:"design", status:"done", effort:6, deps:["c01"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"d02", title:"触发链设计", layer:"design", status:"in_progress", effort:5, deps:["c02"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"d03", title:"多租户隔离方案", layer:"design", status:"in_progress", effort:4, deps:["c04"], assignee:"Arch-B", risk:false, notes:"" },
    { id:"d04", title:"安全扫描架构", layer:"design", status:"done", effort:3, deps:["c05"], assignee:"Sec", risk:false, notes:"" },
    { id:"d05", title:"插件市场设计", layer:"design", status:"blocked", effort:4, deps:[], assignee:"Arch-A", risk:true, notes:"依赖第三方SDK" },
    { id:"d07", title:"API 网关设计", layer:"design", status:"done", effort:5, deps:["c01"], assignee:"Arch-A", risk:false, notes:"" },
    { id:"d08", title:"存储层抽象", layer:"design", status:"in_progress", effort:4, deps:["i01"], assignee:"Arch-B", risk:false, notes:"" },
    { id:"d10", title:"前端微服务拆分", layer:"design", status:"in_progress", effort:5, deps:[], assignee:"FE-Lead", risk:false, notes:"" },
    { id:"d14", title:"数据库分片方案", layer:"design", status:"overdue", effort:5, deps:["i07"], assignee:"DBA", risk:false, notes:"" },
    { id:"d15", title:"缓存架构", layer:"design", status:"done", effort:3, deps:["i06"], assignee:"Arch-A", risk:false, notes:"" },

    { id:"c01", title:"前后端接口联调", layer:"coordination", status:"done", effort:4, deps:["i01","i02"], assignee:"Dev-B", risk:false, notes:"" },
    { id:"c02", title:"Webhook 对接", layer:"coordination", status:"in_progress", effort:5, deps:["i03"], assignee:"Dev-C", risk:false, notes:"" },
    { id:"c03", title:"权限模型协同", layer:"coordination", status:"blocked", effort:3, deps:["i03"], assignee:"Dev-A", risk:true, notes:"" },
    { id:"c04", title:"租户数据迁移", layer:"coordination", status:"in_progress", effort:4, deps:["i07"], assignee:"DBA", risk:false, notes:"" },
    { id:"c05", title:"安全扫描集成", layer:"coordination", status:"done", effort:3, deps:[], assignee:"Sec", risk:false, notes:"" },
    { id:"c07", title:"前端组件库同步", layer:"coordination", status:"in_progress", effort:4, deps:[], assignee:"FE-A", risk:false, notes:"" },
    { id:"c08", title:"实时通知联调", layer:"coordination", status:"done", effort:3, deps:["i03"], assignee:"Dev-C", risk:false, notes:"" },
    { id:"c11", title:"E2E 测试联调", layer:"coordination", status:"overdue", effort:4, deps:[], assignee:"QA-A", risk:false, notes:"" },
    { id:"c14", title:"监控大盘联调", layer:"coordination", status:"in_progress", effort:3, deps:[], assignee:"SRE-B", risk:false, notes:"" },

    { id:"i01", title:"YAML 解析器", layer:"implementation", status:"done", effort:6, deps:["f01"], assignee:"Dev-B", risk:false, notes:"" },
    { id:"i02", title:"Runner 调度器", layer:"implementation", status:"in_progress", effort:8, deps:["f02"], assignee:"Dev-C", risk:false, notes:"" },
    { id:"i03", title:"事件总线", layer:"implementation", status:"done", effort:5, deps:["f03"], assignee:"Dev-A", risk:false, notes:"" },
    { id:"i04", title:"漏洞扫描引擎", layer:"implementation", status:"done", effort:4, deps:["f01"], assignee:"Sec", risk:false, notes:"" },
    { id:"i06", title:"Redis 缓存层", layer:"implementation", status:"done", effort:3, deps:["f05"], assignee:"Dev-A", risk:false, notes:"" },
    { id:"i07", title:"数据库 Migration", layer:"implementation", status:"in_progress", effort:4, deps:["f05"], assignee:"DBA", risk:false, notes:"" },
    { id:"i09", title:"前端主框架", layer:"implementation", status:"in_progress", effort:7, deps:[], assignee:"FE-A", risk:false, notes:"" },
    { id:"i13", title:"制品仓库", layer:"implementation", status:"overdue", effort:5, deps:["f01"], assignee:"Dev-E", risk:false, notes:"" },
    { id:"i15", title:"通知服务", layer:"implementation", status:"in_progress", effort:4, deps:["f03"], assignee:"Dev-C", risk:false, notes:"" },
    { id:"i17", title:"限流熔断", layer:"implementation", status:"done", effort:3, deps:["f03"], assignee:"Dev-B", risk:false, notes:"" },

    { id:"f01", title:"K8s 集群部署", layer:"infrastructure", status:"done", effort:6, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f02", title:"CI 基础镜像", layer:"infrastructure", status:"done", effort:4, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f03", title:"监控告警", layer:"infrastructure", status:"done", effort:4, deps:[], assignee:"SRE-B", risk:false, notes:"" },
    { id:"f04", title:"日志采集 Infra", layer:"infrastructure", status:"done", effort:3, deps:[], assignee:"SRE-B", risk:false, notes:"" },
    { id:"f05", title:"数据库集群", layer:"infrastructure", status:"done", effort:5, deps:[], assignee:"DBA", risk:false, notes:"" },
    { id:"f06", title:"CDN 部署", layer:"infrastructure", status:"done", effort:2, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f09", title:"对象存储", layer:"infrastructure", status:"done", effort:3, deps:[], assignee:"SRE-B", risk:false, notes:"" },
    { id:"f10", title:"消息队列集群", layer:"infrastructure", status:"done", effort:4, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f13", title:"备份策略", layer:"infrastructure", status:"in_progress", effort:3, deps:[], assignee:"DBA", risk:false, notes:"" },
    { id:"f14", title:"容灾演练", layer:"infrastructure", status:"not_started", effort:4, deps:[], assignee:"SRE-A", risk:false, notes:"" },
    { id:"f16", title:"GPU 节点池", layer:"infrastructure", status:"not_started", effort:5, deps:[], assignee:"SRE-B", risk:false, notes:"" },
  ],
};

/* Squarified Treemap */
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

function getDepsSet(items,hid){
  if(!hid)return null;
  const s=new Set(),map=Object.fromEntries(items.map(it=>[it.id,it]));
  const dn=id=>{if(s.has(id))return;s.add(id);(map[id]?.deps||[]).forEach(dn);};
  const up=id=>{if(s.has(id))return;s.add(id);items.filter(x=>(x.deps||[]).includes(id)).forEach(x=>up(x.id));};
  dn(hid);up(hid);return s;
}

window.TowerData = { LAYER_ORDER, LAYER_LABELS, STATUS_COLORS, STATUS_LABELS, PAGODA, MOCK, squarify, getDepsSet };
