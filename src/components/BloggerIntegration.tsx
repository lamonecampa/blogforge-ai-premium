import React, { useState } from "react";
import { BloggerAccount, CampaignHistoryItem } from "../types";
import { Globe, Lock, Key, HelpCircle, AlertCircle, CheckCircle2, Clock, Calendar, ExternalLink, RefreshCw } from "lucide-react";

interface BloggerIntegrationProps {
  bloggerAccount: BloggerAccount;
  onUpdateBloggerAccount: (account: BloggerAccount) => void;
  campaigns: CampaignHistoryItem[];
  onTriggerPublish: (campaignId: string) => Promise<void>;
}

export default function BloggerIntegration({ bloggerAccount, onUpdateBloggerAccount, campaigns, onTriggerPublish }: BloggerIntegrationProps) {
  // Inputs state
  const [useSandbox, setUseSandbox] = useState(bloggerAccount.useSandbox);
  const [accessToken, setAccessToken] = useState(bloggerAccount.accessToken || "");
  const [blogId, setBlogId] = useState(bloggerAccount.blogId || "");
  const [blogUrl, setBlogUrl] = useState(bloggerAccount.blogUrl || "premiumdemo.blogspot.com");
  const [blogName, setBlogName] = useState(bloggerAccount.blogName || "Premium Demo Blog");
  
  // Checking/Saving status
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [checkingInfo, setCheckingInfo] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const saveConfiguration = (sandboxVal: boolean) => {
    setSaving(true);
    setSavedSuccess(false);
    setErrorInfo(null);

    setTimeout(() => {
      onUpdateBloggerAccount({
        connected: sandboxVal ? true : (!!accessToken && !!blogId),
        blogName: sandboxVal ? "Premium Demo Blog" : blogName,
        blogUrl: sandboxVal ? "https://premiumdemo.blogspot.com" : blogUrl,
        blogId: sandboxVal ? "999888777" : blogId,
        accessToken: sandboxVal ? undefined : accessToken,
        useSandbox: sandboxVal,
      });
      setSaving(false);
      setSavedSuccess(true);
    }, 800);
  };

  const verifyOAuthCredentials = async () => {
    if (!accessToken) {
      setErrorInfo("Silakan ketik Access Token Google OAuth terlebih dahulu.");
      return;
    }
    
    setCheckingInfo(true);
    setErrorInfo(null);
    setSavedSuccess(false);

    try {
      const response = await fetch(`/api/blogger/userInfo?accessToken=${accessToken}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mencocokkan OAuth token.");
      }

      const info = await response.json();
      // If we got blogs
      if (info.items && info.items.length > 0) {
        const primaryBlog = info.items[0];
        setBlogId(primaryBlog.id);
        setBlogName(primaryBlog.name);
        setBlogUrl(primaryBlog.url);
        
        onUpdateBloggerAccount({
          connected: true,
          blogName: primaryBlog.name,
          blogUrl: primaryBlog.url,
          blogId: primaryBlog.id,
          accessToken: accessToken,
          useSandbox: false,
        });

        setSavedSuccess(true);
      } else {
        throw new Error("Token autentikasi valid namun tidak terhubung dengan Blogspot manapun.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorInfo(err.message || "OAuth gagal diverifikasi. Pastikan token belum kedaluwarsa.");
    } finally {
      setCheckingInfo(false);
    }
  };

  const scheduleAndDraftCampaigns = campaigns.filter(c => c.status !== "published");

  return (
    <div className="space-y-8 animate-fadeIn" id="blogger-integration-view">
      
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Google Blogger Auto-Post & API Panel</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Atur sambungan OAuth tepercaya ke Blogspot, jalankan sandbox simulasi, atau pantau berkas antrian jadwal terbit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Connection Setup Configuration Panel - 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-zinc-100">Blogger API Authentication</h3>
              </div>
              
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                bloggerAccount.connected 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {bloggerAccount.connected ? 'TERHUBUNG' : 'BUTUH KONEKSI'}
              </span>
            </div>

            {/* Sandbox switch or real switch */}
            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-sans space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200">Metode Akses Publikasi</span>
                  <div className="flex gap-2 font-mono text-[10px]">
                    <button
                      onClick={() => {
                        setUseSandbox(true);
                        saveConfiguration(true);
                      }}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        useSandbox 
                          ? 'bg-emerald-500 text-zinc-950 font-bold' 
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-850'
                      }`}
                    >
                      Sandbox Mode (Recommended)
                    </button>
                    <button
                      onClick={() => {
                        setUseSandbox(false);
                        saveConfiguration(false);
                      }}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        !useSandbox 
                          ? 'bg-emerald-500 text-zinc-950 font-bold' 
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-850'
                      }`}
                    >
                      Real API Custom
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  {useSandbox 
                    ? 'Sandbox Mode memungkinkan Anda menghasilkan artikel lengkap, melihat log audit SEO, memicu scheduler, dan mensimulasikan URL final Blogspot premium secara instan tanpa perlu mendaftarkan izin OAuth Google Console.'
                    : 'Gunakan OAuth access token kustom Anda untuk memposting konten premium orisinal secara otomatis ke domain Blogspot/Blogger milik Anda.'}
                </p>
              </div>

              {/* Conditional parameters when sandbox is deactivated */}
              {!useSandbox && (
                <div className="space-y-4 animate-fadeIn bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                  <div className="space-y-1.5 text-xs">
                    <label className="text-zinc-400 font-mono tracking-wide flex items-center gap-1">
                      Google OAuth Access Token <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="w-full bg-zinc-900 border border-emerald-500/20 text-zinc-200 p-2.5 rounded font-mono outline-none text-xs focus:border-emerald-500 cursor-text"
                      placeholder="ya29.a0AfB_bY4..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 font-mono tracking-wide">ID Blogspot (Blogger ID)</label>
                      <input
                        type="text"
                        value={blogId}
                        onChange={(e) => setBlogId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 p-2 text-xs font-mono outline-none focus:border-emerald-500"
                        placeholder="e.g. 542918451"
                      />
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 font-mono tracking-wide">Nama Blog Terdeteksi</label>
                      <input
                        type="text"
                        value={blogName}
                        onChange={(e) => setBlogName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 p-2 text-xs outline-none focus:border-emerald-500"
                        placeholder="Nama Blog"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-zinc-400 font-mono tracking-wide">Alamat Domain URL Blogspot</label>
                    <input
                      type="text"
                      value={blogUrl}
                      onChange={(e) => setBlogUrl(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 p-2 text-xs font-mono outline-none focus:border-emerald-500"
                      placeholder="e.g. coreseo.blogspot.com"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={verifyOAuthCredentials}
                      disabled={checkingInfo || saving}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold font-mono text-[11px] rounded transition-colors"
                    >
                      {checkingInfo ? "Sedang Memverifikasi Token..." : "Simpan & Verifikasi Token"}
                    </button>
                  </div>
                </div>
              )}

              {/* Success, Saving, Error indications */}
              {savedSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-lg flex items-center gap-2 animate-fadeIn text-[11.5px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Koneksi ke Blogspot berhasil dikonfigurasi! Dashboard siap digunakan.</span>
                </div>
              )}

              {errorInfo && (
                <div className="bg-rose-500/5 border border-rose-500/20 text-rose-300 p-3.5 rounded-lg flex items-start gap-2 animate-fadeIn text-[11.5px]">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                  <span>{errorInfo}</span>
                </div>
              )}

            </div>
          </div>

          {/* Blogger setup guide */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-emerald-400" />
              Panduan Menghubungkan Blogger API Secara Kustom
            </h3>
            
            <div className="text-xs text-zinc-400 leading-relaxed space-y-3 font-sans">
              <p>
                Jika Anda ingin menerbitkan secara real ke domain blogspot Anda tanpa sandbox:
              </p>
              <div className="space-y-2 font-mono text-[10.5px] bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                <div>1. Buka Google Cloud Console API Dashboard.</div>
                <div>2. Aktifkan **Blogger API v3** untuk project Anda.</div>
                <div>3. Buat OAuth Client ID Web Application.</div>
                <div>4. Atur Authorized redirect URI ke:</div>
                <div className="bg-zinc-900 p-2 rounded border border-zinc-800 mt-1 select-all text-emerald-400">
                  https://ais-dev-grsjbrldm3mtde76fgzfc7-406845663857.asia-southeast1.run.app/auth/callback
                </div>
                <div className="mt-2 text-zinc-500">
                  *Gunakan OAuth flow token penukar untuk mengambil Access Token jangka pendek ("ya29.xxxx") lalu paste di form tepercaya di atas.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled / Draft campaigns scheduler status check - 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800">
              <Clock className="w-4.5 h-4.5 text-emerald-400" />
              <h3 className="font-bold text-xs text-zinc-300 uppercase tracking-widest font-mono">Antrian Auto-Scheduler</h3>
            </div>

            {scheduleAndDraftCampaigns.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">Tidak ada jadwal posting atau draf yang tertunda dalam antrian saat ini.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {scheduleAndDraftCampaigns.map((camp) => {
                  return (
                    <div key={camp.id} className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 border border-zinc-800 rounded uppercase text-[10px]">
                          {camp.status}
                        </span>
                        {camp.inputs.scheduleTime && (
                          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" /> {new Date(camp.inputs.scheduleTime).toLocaleDateString("id-ID", {month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-zinc-200 line-clamp-1">{camp.result.title}</h4>

                      <div className="flex items-center justify-between border-t border-zinc-850 pt-2.5">
                        <span className="text-[10.5px] text-zinc-500 font-mono">Niche: {camp.inputs.niche}</span>
                        <button
                          onClick={() => onTriggerPublish(camp.id)}
                          className="px-2.5 py-1 text-[10px] uppercase font-mono text-zinc-950 bg-emerald-500 hover:bg-emerald-400 transition-colors rounded leading-none font-bold"
                        >
                          Trigger Sched post
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick status details wrapper */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-xs text-zinc-300 uppercase tracking-widest font-mono">Status Terhubung:</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-zinc-950 border border-zinc-850/80">
                <span className="text-zinc-500">Nama Ruang:</span>
                <span className="text-zinc-200 select-all font-bold">{bloggerAccount.blogName || "Premium Sandbox Blogspot"}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-zinc-950 border border-zinc-850/80">
                <span className="text-zinc-500">Domain blogspot:</span>
                <span className="text-zinc-200 select-all font-bold">{bloggerAccount.blogUrl || "premiumdemo.blogspot.com"}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-zinc-950 border border-zinc-850/80">
                <span className="text-zinc-500">Mode Sandbox:</span>
                <span className="text-emerald-400 font-bold">{bloggerAccount.useSandbox ? "AKTIF" : "NONAKTIF"}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
