import { ItemsDashboard } from "@/components/items-dashboard";

export const metadata = {
  title: "事项大盘 - Cloud-Native DevOps Platform",
  description: "查看所有事项的进度和依赖关系",
};

export default function ItemsPage() {
  return <ItemsDashboard />;
}
