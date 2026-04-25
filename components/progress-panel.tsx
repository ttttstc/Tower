"use client";

import { useState } from "react";
import { MousePointer2 } from "lucide-react";
import { LAYERS, OVERALL_PROGRESS } from "@/lib/data";

interface LayerIndicatorProps {
  name: string;
  nameEn: string;
  progress: number;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
}

function LayerIndicator({ name, nameEn, progress, color, isActive, onClick }: LayerIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Connector line */}
      <div className="w-8 h-px bg-border/60 hidden lg:block" />
      
      {/* Color bar indicator */}
      <div 
        className="w-1.5 h-9 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      
      {/* Content card */}
      <button
        onClick={onClick}
        className={`
          flex items-center justify-between gap-3 px-3 py-2 rounded-lg border transition-all duration-200 min-w-[130px]
          ${isActive 
            ? "bg-white shadow-sm border-primary/30" 
            : "bg-white/80 border-border/40 hover:bg-white hover:border-border"
          }
        `}
      >
        <div className="text-left">
          <div className="font-serif text-sm font-semibold text-foreground leading-tight">{name}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">{nameEn}</div>
        </div>
        <div className="font-serif text-lg font-bold" style={{ color }}>
          {progress}%
        </div>
      </button>
      
      {/* Action button for active layer */}
      {isActive && (
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-white text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors whitespace-nowrap shadow-sm">
          <MousePointer2 className="w-3 h-3" />
          <span>进入事项清单</span>
        </button>
      )}
    </div>
  );
}

function OverallProgressCard() {
  return (
    <div className="bg-white/90 rounded-lg border border-border/60 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div className="text-xs text-muted-foreground font-medium">整体进度</div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-3xl font-bold text-primary font-serif">
          {OVERALL_PROGRESS.percentage}%
        </span>
        <span className="text-xs text-muted-foreground">
          {OVERALL_PROGRESS.completed}/{OVERALL_PROGRESS.total} 完成
        </span>
      </div>
      {/* Progress bar */}
      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${OVERALL_PROGRESS.percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressPanel() {
  const [activeLayer, setActiveLayer] = useState("design");

  return (
    <aside className="flex flex-col items-end gap-4 p-6 h-screen overflow-y-auto shrink-0">
      {/* Top section - Overall progress */}
      <div className="flex flex-col items-end gap-3">
        <OverallProgressCard />
        
        <button className="px-3 py-1.5 rounded-md border border-border bg-white text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
          查看详情
        </button>
      </div>
      
      {/* Spacer to push layers to vertical center area */}
      <div className="flex-1 min-h-8" />
      
      {/* Layer Progress Indicators - vertically spaced to align with tower floors */}
      <div className="flex flex-col gap-5">
        {LAYERS.map((layer) => (
          <LayerIndicator
            key={layer.id}
            name={layer.name}
            nameEn={layer.nameEn}
            progress={layer.progress}
            color={layer.color}
            isActive={activeLayer === layer.id}
            onClick={() => setActiveLayer(layer.id)}
          />
        ))}
      </div>
      
      {/* Bottom spacer */}
      <div className="flex-1 min-h-8" />
    </aside>
  );
}
