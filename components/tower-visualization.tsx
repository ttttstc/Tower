"use client";

import Image from "next/image";

export function TowerVisualization() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background mountains and landscape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1200 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f5f0e5" />
              <stop offset="100%" stopColor="#e8dcc8" />
            </linearGradient>
            <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d8ccb8" />
              <stop offset="100%" stopColor="#c4b8a0" />
            </linearGradient>
          </defs>
          
          {/* Background fill */}
          <rect width="100%" height="100%" fill="url(#skyGrad)" />
          
          {/* Distant mountains - left */}
          <path
            d="M-50 600 Q50 400 150 500 Q200 450 280 520 Q350 420 450 550 L450 800 L-50 800 Z"
            fill="#d4c8b4"
            opacity="0.5"
          />
          
          {/* Distant mountains - right */}
          <path
            d="M750 600 Q850 380 950 480 Q1020 400 1100 520 Q1150 450 1250 550 L1250 800 L750 800 Z"
            fill="#d4c8b4"
            opacity="0.5"
          />
          
          {/* Mid-ground hills */}
          <path
            d="M-50 700 Q100 620 250 680 Q400 600 550 700 Q700 620 850 680 Q1000 600 1150 700 L1250 800 L-50 800 Z"
            fill="#c8bca8"
            opacity="0.4"
          />
          
          {/* Flying birds */}
          <g fill="none" stroke="#8a7a60" strokeWidth="1.5" opacity="0.35">
            <path d="M280 180 Q288 168 296 180 Q304 168 312 180" />
            <path d="M320 210 Q326 200 332 210 Q338 200 344 210" />
            <path d="M250 240 Q256 232 262 240 Q268 232 274 240" />
            <path d="M920 160 Q928 148 936 160 Q944 148 952 160" />
            <path d="M880 200 Q886 190 892 200 Q898 190 904 200" />
          </g>
          
          {/* Trees silhouettes at bottom */}
          <g fill="#a89880" opacity="0.3">
            <ellipse cx="80" cy="780" rx="60" ry="40" />
            <ellipse cx="180" cy="790" rx="50" ry="30" />
            <ellipse cx="1020" cy="785" rx="55" ry="35" />
            <ellipse cx="1120" cy="790" rx="45" ry="28" />
          </g>
        </svg>
      </div>
      
      {/* Radial vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(232,224,208,0.6) 100%)",
        }}
      />
      
      {/* Tower Image - centered with proper sizing */}
      <div className="relative z-10 h-[90%] max-h-[800px] aspect-[3/4] flex items-center justify-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E4%B8%BB%E9%A1%B5-S9j5pyQwuq9rWnc1fChLKXjB1UGm0r.png"
          alt="Cloud-Native DevOps Platform - Pagoda Tower Visualization"
          width={800}
          height={1000}
          className="h-full w-auto object-contain drop-shadow-lg"
          style={{
            filter: "drop-shadow(0 8px 24px rgba(60,50,40,0.15))",
          }}
          priority
        />
      </div>
      
      {/* Bottom decorative text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-3 text-muted-foreground/50">
          <div className="h-px w-16 bg-current" />
          <span className="font-serif text-xs tracking-[0.4em] uppercase">悬停查看依赖 · 点击编辑</span>
          <div className="h-px w-16 bg-current" />
        </div>
      </div>
    </div>
  );
}
