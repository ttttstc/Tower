import { Sidebar } from "@/components/sidebar";
import { TowerVisualization } from "@/components/tower-visualization";
import { ProgressPanel } from "@/components/progress-panel";

export default function HomePage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Center - Tower Visualization */}
      <div className="flex-1 relative overflow-hidden">
        <TowerVisualization />
      </div>
      
      {/* Right - Progress Panel */}
      <ProgressPanel />
    </main>
  );
}
