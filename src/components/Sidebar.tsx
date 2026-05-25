import React from "react";
import { Gauge, PenSquare, Network, Globe, Sparkles, BookOpen } from "lucide-react";

interface SidebarProps {
  activeTab: 'dashboard' | 'studio' | 'topical' | 'blogger';
  setActiveTab: (tab: 'dashboard' | 'studio' | 'topical' | 'blogger') => void;
  hasGeminiKey: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, hasGeminiKey }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Gauge, description: 'Statistik & Riwayat Kampanye' },
    { id: 'studio' as const, label: 'Editorial Studio', icon: PenSquare, description: 'Generator Artikel Premium' },
    { id: 'topical' as const, label: 'Topical Authority', icon: Network, description: 'Semantic Clustered Map' },
    { id: 'blogger' as const, label: 'Blogger Auto-Post', icon: Globe, description: 'Integrasi Blogspot & Jadwal' },
  ];

  return (
    <aside className="w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between h-screen sticky top-0" id="bf-sidebar">
      <div>
        {/* Logo/Brand Header */}
        <div className="p-6 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg border border-emerald-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                BlogForge <span className="text-emerald-400 text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">AI</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider mt-1">SEO ARTICLE ENGINE</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl text-left transition-all duration-250 group ${
                  isActive
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-white'
                    : 'bg-transparent border border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
                id={`sidebar-btn-${item.id}`}
              >
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 transition-transform duration-300 ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <div>
                  <div className={`text-sm font-medium ${isActive ? 'text-emerald-400' : 'text-zinc-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5 font-sans group-hover:text-zinc-400">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Status Indicator */}
      <div className="p-6 border-t border-zinc-900 space-y-4">
        <div className="bg-zinc-900/50 rounded-xl p-3.5 border border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
            <div className={`w-2.5 h-2.5 rounded-full ${hasGeminiKey ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span>Gemini API Status</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            {hasGeminiKey 
              ? 'Model: gemini-3.5-flash (Aktif & Amankan Server-Side)' 
              : 'Belum Terhubung. Silakan masukkan GEMINI_API_KEY di secrets.'}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>v1.2.0 PREMIUM</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-zinc-600" /> SEO Senior
          </span>
        </div>
      </div>
    </aside>
  );
}
