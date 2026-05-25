import React from "react";
import { CampaignHistoryItem } from "../types";
import { 
  FileText, Globe, CheckCircle2, AlertCircle, Clock, 
  Sparkles, TrendingUp, HelpCircle, ExternalLink, ArrowRight, Layers
} from "lucide-react";

interface DashboardProps {
  history: CampaignHistoryItem[];
  hasGeminiKey: boolean;
  onSelectCampaign: (item: CampaignHistoryItem) => void;
  onGoToStudio: () => void;
}

export default function Dashboard({ history, hasGeminiKey, onSelectCampaign, onGoToStudio }: DashboardProps) {
  // Compute basic stats
  const totalPosts = history.length;
  const publishedCount = history.filter(h => h.status === 'published').length;
  const scheduledCount = history.filter(h => h.status === 'scheduled').length;
  const draftCount = history.filter(h => h.status === 'draft').length;

  const averageSeoScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => {
        const passed = curr.result.seoScoreChecklist.filter(item => item.isPassed).length;
        const total = curr.result.seoScoreChecklist.length;
        const score = total > 0 ? (passed / total) * 100 : 0;
        return acc + score;
      }, 0) / history.length)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn" id="dashboard-tab">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-emerald-950/20 p-8 rounded-2xl border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Topical Authority Engine Active
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">BlogForge AI Editorial Panel</h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Tulis artikel premium SEO-friendly tanpa jejak pola generik AI. Targetkan search intent yang tinggi, perkuat topical authority, dan posting langsung ke Blogspot secara otomatis.
          </p>
        </div>
        <button
          onClick={onGoToStudio}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 font-medium text-sm text-zinc-950 rounded-xl transition-all duration-150 inline-flex items-center gap-2 shadow-lg shadow-emerald-500/10 shrink-0"
        >
          Buat Artikel Baru <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* API Warning if missing key */}
      {!hasGeminiKey && (
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-5 flex items-start gap-3 text-sm text-rose-300">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-400" />
          <div className="space-y-1">
            <h4 className="font-semibold text-rose-200">GEMINI_API_KEY Belum Terpasang</h4>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Meskipun interface premium dapat diuji, Anda akan membutuhkan API Key untuk memproses konten secara real-time. 
              Gunakan panel **Secrets** di sisi kanan Google AI Studio UI untuk menyetel kunci API aman.
            </p>
          </div>
        </div>
      )}

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Total Generated */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Total Artikel</span>
            <div className="bg-zinc-800 p-2.5 rounded-xl border border-zinc-700/50 text-zinc-300">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono tracking-tight text-white mb-1">{totalPosts}</div>
            <p className="text-xs text-zinc-500">Artikel premium tersimpan</p>
          </div>
        </div>

        {/* Stat 2: Published */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Terpublikasi</span>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono tracking-tight text-white mb-1">{publishedCount}</div>
            <p className="text-xs text-zinc-500">Auto-post aktif ke Blogger</p>
          </div>
        </div>

        {/* Stat 3: Scheduled / Draft */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Jadwal & Draft</span>
            <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono tracking-tight text-white mb-1">
              {scheduledCount} <span className="text-zinc-500 text-sm font-normal">berjadwal</span> / {draftCount} <span className="text-zinc-500 text-sm font-normal">draft</span>
            </div>
            <p className="text-xs text-zinc-500">Menunggu publikasi otomatis</p>
          </div>
        </div>

        {/* Stat 4: Average SEO Score */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Rata-rata Skor SEO</span>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono tracking-tight text-white mb-1">
              {averageSeoScore}%
            </div>
            <p className="text-xs text-zinc-500">Optimalisasi Helpful Content</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: History List (Takes 2 blocks) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Riwayat Kampanye Artikel</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Daftar artikel premium yang telah di-generate</p>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800/60 px-2 py-1 rounded border border-zinc-700/50">
              {history.length} Entri
            </span>
          </div>

          {history.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
              <div className="inline-flex bg-zinc-800/80 p-4 rounded-full text-zinc-500 border border-zinc-700/50">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-xs mx-auto space-y-1">
                <h4 className="text-sm font-bold text-zinc-300">Belum ada artikel</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Silakan buat artikel pertamamu di Editorial Studio untuk melihat di sini.
                </p>
              </div>
              <button
                onClick={onGoToStudio}
                className="mt-2 text-xs font-mono text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg transition-all"
              >
                Mulai Menulis
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {history.map((campaign) => {
                const passedCount = campaign.result.seoScoreChecklist.filter(item => item.isPassed).length;
                const totalCount = campaign.result.seoScoreChecklist.length;
                const seoScore = Math.round((passedCount / totalCount) * 100);

                return (
                  <div
                    key={campaign.id}
                    onClick={() => onSelectCampaign(campaign)}
                    className="bg-zinc-900 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/50 p-4 rounded-xl transition-all duration-150 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase tracking-wide">
                          {campaign.inputs.niche}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 leading-none ${
                          campaign.status === 'published' 
                            ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                            : campaign.status === 'scheduled'
                            ? 'bg-amber-500/5 text-amber-400 border-amber-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          {campaign.status === 'published' && <Globe className="w-3 h-3" />}
                          {campaign.status === 'scheduled' && <Clock className="w-3 h-3" />}
                          {campaign.status === 'draft' && <FileText className="w-3 h-3" />}
                          {campaign.status.toUpperCase()}
                        </span>
                        <span className="text-[10.5px] font-mono text-zinc-500">
                          {new Date(campaign.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-zinc-100 text-sm leading-snug group-hover:text-emerald-400 transition-colors truncate">
                        {campaign.result.title}
                      </h4>

                      <p className="text-xs text-zinc-400 truncate max-w-lg">
                        Slug: <span className="font-mono text-zinc-500">{campaign.result.slug}</span> | Kata: <span className="font-mono">{campaign.result.wordCount}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 border-zinc-800/60 pt-3 sm:pt-0">
                      {/* SEO Score Badge */}
                      <div className="text-right">
                        <div className="text-xs font-mono text-zinc-500">Skor SEO</div>
                        <div className={`text-sm font-bold font-mono ${
                          seoScore >= 90 ? 'text-emerald-400' : seoScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {seoScore}% ({passedCount}/{totalCount})
                        </div>
                      </div>

                      {/* Launch view button */}
                      <button className="p-2.5 bg-zinc-800 border border-zinc-700/60 text-zinc-400 rounded-xl hover:text-white hover:bg-zinc-700 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Helpful Guide Guidelines Checklist */}
        <div className="space-y-6">
          
          {/* Blogger quick parameters */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-emerald-400" />
              Aktifitas Search Intent
            </h3>
            
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Google sangat mengutamakan artikel dengan **Helpful Content** di tahun 2026 ini. 
              Berikut adalah metrik utama filter penulisan anti-AI spam kami:
            </p>

            <div className="space-y-2.5 pt-1 text-[11px] font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Intent Analysis</span>
                <span className="text-emerald-400">Otomatis Terdeteksi</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Anti-Spam Filter</span>
                <span className="text-emerald-400">100% Lolos Uji</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Tingkat Humanisasi</span>
                <span className="text-emerald-400">Variatif & Natural</span>
              </div>
            </div>
          </div>

          {/* Guidelines block */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
              Standard Kebijakan Anti-Spam
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2 text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-zinc-200">Anti-AI Openers:</strong> Filter memangkas seluruh pembukaan bertipe "Di era globalisasi", "tidak dapat dipungkiri", dll.
                </p>
              </div>

              <div className="flex items-start gap-2 text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-zinc-200">Search Indication:</strong> Struktur ditekankan langsung pada jawaban (Direct-to-benefit) untuk menekan bounce-rate.
                </p>
              </div>

              <div className="flex items-start gap-2 text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-zinc-200">EEAT Signals:</strong> Menambahkan subtopik mendalam, analogi, FAQ, serta CTA natural agar konten dihargai orisinalitasnya.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
