import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloud-Native DevOps Platform",
  description: "打造覆盖全研发生命周期的云原生 DevOps 平台",
};

export const viewport: Viewport = {
  themeColor: "#f8f4ec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="bg-background">
      <body className="antialiased">{children}</body>
    </html>
  );
}
