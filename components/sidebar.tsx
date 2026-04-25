"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Rocket, Shield, Cpu, Users } from "lucide-react";
import { PROJECT_DATA, GOALS, SIDEBAR_SECTIONS } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  shield: Shield,
  cpu: Cpu,
  users: Users,
};

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-secondary/50 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function GoalItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  const Icon = iconMap[icon] || Rocket;
  
  return (
    <div className="flex gap-3 py-2">
      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground leading-tight">{title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-72 bg-background/60 backdrop-blur-sm border-r border-border flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="font-serif text-lg font-bold text-foreground leading-tight">
          {PROJECT_DATA.name}
        </h1>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {PROJECT_DATA.subtitle}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* 项目介绍 */}
        <CollapsibleSection title="项目介绍" defaultOpen={true}>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {PROJECT_DATA.description}
          </p>
        </CollapsibleSection>

        {/* 目标 */}
        <CollapsibleSection title="目标" defaultOpen={true}>
          <div className="space-y-1">
            {GOALS.map((goal) => (
              <GoalItem
                key={goal.id}
                icon={goal.icon}
                title={goal.title}
                description={goal.description}
              />
            ))}
          </div>
        </CollapsibleSection>

        {/* 范围 */}
        <CollapsibleSection title="范围" defaultOpen={false}>
          <p className="text-xs text-muted-foreground leading-relaxed">
            覆盖 CI/CD、容器编排、监控告警、日志分析、安全扫描等核心能力模块。
          </p>
        </CollapsibleSection>

        {/* 里程碑 */}
        <CollapsibleSection title="里程碑" defaultOpen={false}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-status-done" />
              <span className="text-xs text-muted-foreground">Q1 - 基础设施搭建</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-status-progress" />
              <span className="text-xs text-muted-foreground">Q2 - 核心功能开发</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-status-pending" />
              <span className="text-xs text-muted-foreground">Q3 - 平台集成测试</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-status-pending" />
              <span className="text-xs text-muted-foreground">Q4 - 全面推广上线</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* 相关文档 */}
        <CollapsibleSection title="相关文档" defaultOpen={false}>
          <div className="space-y-1.5">
            <a href="#" className="block text-xs text-primary hover:underline">
              技术架构文档
            </a>
            <a href="#" className="block text-xs text-primary hover:underline">
              API 设计规范
            </a>
            <a href="#" className="block text-xs text-primary hover:underline">
              部署运维手册
            </a>
          </div>
        </CollapsibleSection>
      </div>
    </aside>
  );
}
