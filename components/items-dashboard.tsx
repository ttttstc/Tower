"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { LAYERS, LAYER_ITEMS, type Item } from "@/lib/data";

function getProgressColor(progress: number): string {
  if (progress >= 75) return "bg-[#8a9a6a]"; // Green - completed
  if (progress >= 50) return "bg-[#9a8a4a]"; // Olive - in progress
  if (progress >= 25) return "bg-[#aa6a3a]"; // Orange - slow progress  
  if (progress > 0) return "bg-[#8a4a3a]"; // Red - behind
  return "bg-[#6a6a6a]"; // Gray - not started
}

function getBookColor(progress: number): string {
  if (progress >= 75) return "from-[#9aaa7a] to-[#7a8a5a]";
  if (progress >= 50) return "from-[#aaa06a] to-[#8a8040]";
  if (progress >= 25) return "from-[#aa7a4a] to-[#8a5a3a]";
  if (progress > 0) return "from-[#8a5a4a] to-[#6a3a2a]";
  return "from-[#7a7a7a] to-[#5a5a5a]";
}

interface ItemCardProps {
  item: Item;
  onHover: (item: Item | null) => void;
  isHovered: boolean;
}

function ItemCard({ item, onHover, isHovered }: ItemCardProps) {
  return (
    <Link
      href={`/items/${item.id}`}
      className="relative group"
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
    >
      <div 
        className={`
          relative w-20 h-28 rounded-sm overflow-hidden transition-all duration-200
          bg-gradient-to-b ${getBookColor(item.progress)}
          ${isHovered ? "ring-2 ring-amber-400 scale-105 z-10" : "hover:scale-102"}
          shadow-md
        `}
      >
        {/* Book spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/20" />
        
        {/* Book content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-1.5 text-center">
          <span className="text-[10px] text-white/90 font-medium leading-tight line-clamp-3 writing-vertical">
            {item.name}
          </span>
        </div>
        
        {/* Progress badge */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-bold text-white/90 bg-black/30 px-1.5 py-0.5 rounded">
            {item.progress}%
          </span>
        </div>
        
        {/* Lock icon for not started items */}
        {item.status === "not-started" && (
          <div className="absolute top-1.5 right-1.5">
            <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
}

interface LayerRowProps {
  layer: typeof LAYERS[0];
  items: Item[];
  hoveredItem: Item | null;
  onHover: (item: Item | null) => void;
}

function LayerRow({ layer, items, hoveredItem, onHover }: LayerRowProps) {
  return (
    <div className="flex items-stretch gap-4">
      {/* Layer label */}
      <div 
        className="w-28 shrink-0 flex flex-col items-center justify-center p-3 rounded-lg border-2 bg-[#f5f0e5]/80"
        style={{ borderColor: layer.color }}
      >
        <span className="font-serif font-bold text-foreground text-base">{layer.name}</span>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{layer.nameEn}</span>
        <span className="text-xl font-bold mt-1" style={{ color: layer.color }}>{layer.progress}%</span>
      </div>
      
      {/* Items shelf */}
      <div className="flex-1 relative">
        {/* Shelf background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B7355] to-[#6B5344] rounded-lg shadow-inner" />
        
        {/* Shelf boards */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-[#A08060] to-[#7B6145] rounded-b-lg" />
        
        {/* Items container */}
        <div className="relative flex items-end gap-1.5 p-3 pb-4 overflow-x-auto">
          {items.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onHover={onHover}
              isHovered={hoveredItem?.id === item.id}
            />
          ))}
        </div>
      </div>
      
      {/* Scroll arrow */}
      <button className="w-8 shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

function ProgressLegend() {
  const legends = [
    { label: "已完成 (75%以上)", color: "bg-[#8a9a6a]" },
    { label: "进行中 (50%-75%)", color: "bg-[#9a8a4a]" },
    { label: "进行中 (25%-50%)", color: "bg-[#aa6a3a]" },
    { label: "进度较慢 (<25%)", color: "bg-[#8a4a3a]" },
    { label: "未开始 (0%)", color: "bg-[#6a6a6a]" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-border p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-3">进度图例</h3>
      <div className="space-y-2">
        {legends.map((legend) => (
          <div key={legend.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${legend.color}`} />
            <span className="text-xs text-muted-foreground">{legend.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ItemTooltipProps {
  item: Item;
}

function ItemTooltip({ item }: ItemTooltipProps) {
  const layer = LAYERS.find(l => l.id === item.layerId);
  
  return (
    <div className="bg-[#2a2520] text-white rounded-lg p-4 shadow-xl min-w-[240px]">
      <h4 className="font-semibold text-amber-400 mb-2">{item.name}</h4>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">进度:</span>
          <span>{item.progress}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">状态:</span>
          <span>{item.status === "completed" ? "已完成" : item.status === "in-progress" ? "进行中" : "未开始"}</span>
        </div>
        {item.dependencies.filter(d => d.type === "upstream").length > 0 && (
          <div>
            <span className="text-gray-400">上游依赖:</span>
            <div className="ml-2 text-xs">
              {item.dependencies.filter(d => d.type === "upstream").map(d => (
                <div key={d.id}>{d.name} ({d.progress}%)</div>
              ))}
            </div>
          </div>
        )}
        {item.dependencies.filter(d => d.type === "downstream").length > 0 && (
          <div>
            <span className="text-gray-400">下游依赖:</span>
            <div className="ml-2 text-xs">
              {item.dependencies.filter(d => d.type === "downstream").map(d => (
                <div key={d.id}>{d.name} ({d.progress}%)</div>
              ))}
            </div>
          </div>
        )}
        <div className="pt-2 border-t border-gray-600 text-xs text-gray-400">
          共 {item.dependencies.filter(d => d.type === "upstream").length} 个上游, {item.dependencies.filter(d => d.type === "downstream").length} 个下游
        </div>
      </div>
    </div>
  );
}

export function ItemsDashboard() {
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  
  // Calculate overall progress
  const overallProgress = Math.round(
    LAYERS.reduce((sum, layer) => sum + layer.progress, 0) / LAYERS.length
  );

  return (
    <div className="min-h-screen bg-[#e8e0d0] relative">
      {/* Background with wooden frame effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(90,70,50,0.3) 0%, transparent 5%, transparent 95%, rgba(90,70,50,0.3) 100%),
            linear-gradient(to bottom, rgba(90,70,50,0.2) 0%, transparent 10%, transparent 90%, rgba(90,70,50,0.2) 100%)
          `,
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/30">
        <Link 
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white/80 border border-border/50 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回项目首页</span>
        </Link>
        
        <h1 className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="text-muted-foreground/50">☁</span>
          事项大盘
          <span className="text-muted-foreground/50">☁</span>
        </h1>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">整体进度</span>
          <span className="text-2xl font-bold text-primary font-serif">{overallProgress}%</span>
        </div>
      </header>
      
      {/* Main content */}
      <div className="relative z-10 flex gap-6 p-6">
        {/* Bookshelf grid */}
        <div className="flex-1 space-y-4">
          {LAYERS.map((layer) => (
            <LayerRow
              key={layer.id}
              layer={layer}
              items={LAYER_ITEMS[layer.id] || []}
              hoveredItem={hoveredItem}
              onHover={setHoveredItem}
            />
          ))}
          
          {/* Navigation hint */}
          <div className="flex items-center justify-center gap-8 mt-6 text-sm text-muted-foreground">
            <span>← 滚轮向左</span>
            <span>滚轮向右 →</span>
          </div>
        </div>
        
        {/* Right sidebar */}
        <div className="w-64 shrink-0 space-y-4">
          <ProgressLegend />
          
          {/* Tooltip for hovered item */}
          {hoveredItem && (
            <ItemTooltip item={hoveredItem} />
          )}
        </div>
      </div>
    </div>
  );
}
