import React, { useState } from "react";
import { GeneralInputs, BlogForgeResult, CampaignHistoryItem } from "../types";
import { 
  Sparkles, PenSquare, FileText, Globe, BookOpen, Clock, 
  HelpCircle, ArrowRight, Loader2, CheckCircle2, AlertCircle, 
  ChevronDown, MessageSquare, Info, Star, Bookmark, Share2
} from "lucide-react";

interface EditorialStudioProps {
  onArticleGenerated: (inputs: GeneralInputs, result: BlogForgeResult) => void;
  hasGeminiKey: boolean;
  onPostToBlogger: (result: BlogForgeResult, inputs: GeneralInputs) => Promise<any>;
}

const LANGUAGES = [
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'en', name: 'English (US/UK)' },
  { code: 'es', name: 'Español' },
  { code: 'ms', name: 'Bahasa Melayu' },
];

const WRITING_STYLES = [
  { value: 'conversational', label: 'Conversational Natural', desc: 'Santai, ramah, mengalir lancar seperti obrolan kedai kopi.' },
  { value: 'analytical', label: 'Gaya Analitis', desc: 'Sistematik, berbasis data, logika jernih, membandingkan secara kritis.' },
  { value: 'kredibel', label: 'Ahli Kredibel (E-E-A-T)', desc: 'Sangat hati-hati, berbobot tinggi, menggunakan nada otoritas tepercaya.' },
  { value: 'step-by-step', label: 'Tutorial Kolaboratif', desc: 'Panduan step-by-step yang hangat, ramah pemula, kaya analogi.' },
  { value: 'strategis', label: 'Strategis Bisnis', desc: 'Berorientasi taktis, visioner, fokus pada ROI dan solusi pragmatis.' },
  { value: 'edukatif', label: 'Edukasi Sederhana', desc: 'Menjelaskan konsep rumit dengan ringkas, tajam, dan mudah dicerna.' },
];

const LENGTHS = [
  { value: 'short', label: 'Ringkas (800 Kata)', desc: 'Padat informasi, langsung memecahkan search intent primer.' },
  { value: 'medium', label: 'Menengah (1500 Kata)', desc: 'Struktur komprehensif, ulasan mendalam dengan contoh nyata.' },
  { value: 'long', label: 'Otoritatif (2500+ Kata)', desc: 'Diferensiasi tinggi, kupas tuntas seluruh klaster subtopik.' },
];

export default function EditorialStudio({ onArticleGenerated, hasGeminiKey, onPostToBlogger }: EditorialStudioProps) {
  // Inputs state
  const [inputs, setInputs] = useState<GeneralInputs>({
    niche: "Teknologi & Artificial Intelligence",
    primaryKeyword: "cara belajar prompt engineering untuk pemula",
    secondaryKeywords: "tips menulis prompt gemini, panduan prompt engineering, contoh prompt terbaik",
    blogspotUrl: "https://premiumdemo.blogspot.com",
    category: "AI & Machine Learning",
    label: "Prompt Engineering, Tutorial, AI",
    language: "id",
    articleLength: "medium",
    writingStyle: "conversational",
    targetCountry: "Indonesia",
    targetAudience: "Mahasiswa, Fresh Graduate, dan Profesional Muda",
    postingMode: "draft",
    scheduleTime: "",
    humanizeStrength: 85,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] = useState<BlogForgeResult | null>(null);
  
  // Posting state
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccessData, setPostSuccessData] = useState<{ url: string; isSandbox: boolean } | null>(null);

  const steps = [
    "Menganalisis Search Intent Pengguna...",
    "Memetakan Struktur Topical Authority...",
    "Melakukan Ekspansi Semantic Keyword Clustering...",
    "Merancang Outline Editorial Premium (H3/H2)...",
    "Menulis Konten Menggunakan Humanizer Layer (Anti-Spam AI)...",
    "Melakukan Audit & Checklist Skor SEO Modern...",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, humanizeStrength: parseInt(e.target.value) }));
  };

  const executeGeneration = async () => {
    setLoading(true);
    setGenerationResult(null);
    setPostSuccessData(null);
    setError(null);
    setLoadingStep(0);

    // Progressive step presentation for simulated loading
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal memproses pembuatan artikel");
      }

      const data: BlogForgeResult = await response.json();
      setGenerationResult(data);
      onArticleGenerated(inputs, data);
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setError(err.message || "Terjadi kesalahan internal koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  const sendToBlogspot = async () => {
    if (!generationResult) return;
    setIsPosting(true);
    setError(null);
    setPostSuccessData(null);

    try {
      const res = await onPostToBlogger(generationResult, inputs);
      if (res && res.success) {
        setPostSuccessData({
          url: res.url,
          isSandbox: res.isSandbox
        });
      }
    } catch (err: any) {
      setError(err.message || "Gagal memposting artikel ke Blogger API.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="studio-tab-view">
      
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Editorial Studio Premium</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Formula generator artikel mutakhir berorientasi Google Helpful Content, bebas dari gaya klise robotik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Input Form Panels -- 5 Cols */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2 pb-3 border-b border-zinc-800">
            <div className="bg-emerald-500/10 p-1.5 rounded text-emerald-400">
              <PenSquare className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-zinc-100 tracking-wide">Parameter Konsep Niche</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Niche & Blogspot Url */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono tracking-wider flex items-center gap-1">
                  Niche Blog <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="niche"
                  value={inputs.niche}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-200 outline-none transition-colors"
                  placeholder="Misalnya: Kuliner Sehat, Crypto, Tutorial Web"
                  id="input-niche"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono tracking-wider flex items-center gap-1">
                  URL Blogspot <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="blogspotUrl"
                  value={inputs.blogspotUrl}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-200 font-mono outline-none transition-colors"
                  placeholder="https://xyz.blogspot.com"
                  id="input-blogspotUrl"
                />
              </div>
            </div>

            {/* Primary Keyword */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono tracking-wider flex items-center justify-between">
                <span>Keyword Utama (Focus Topic) <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-zinc-500 italic">Hindari Clickbait Ekstrim</span>
              </label>
              <input
                type="text"
                name="primaryKeyword"
                value={inputs.primaryKeyword}
                onChange={handleInputChange}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-200 font-bold outline-none transition-colors"
                placeholder="cth: cara mematangkan pisang dengan cepat"
                id="input-primaryKeyword"
              />
            </div>

            {/* Secondary/Semantic Keywords */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono tracking-wider">
                Keyword Turunan / Semantis (Pisahkan dengan Koma)
              </label>
              <textarea
                name="secondaryKeywords"
                value={inputs.secondaryKeywords}
                onChange={handleInputChange}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-300 outline-none transition-colors"
                placeholder="cth: metode matang alami, gas etilen buah, panduan praktis"
                id="input-secondaryKeywords"
              />
            </div>

            {/* Category & Label */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono tracking-wider">Kategori Utama</label>
                <input
                  type="text"
                  name="category"
                  value={inputs.category}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-300 outline-none transition-colors"
                  placeholder="cth: Tips Dapur"
                  id="input-category"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono tracking-wider">Label Tag Blogger</label>
                <input
                  type="text"
                  name="label"
                  value={inputs.label}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-300 outline-none transition-colors"
                  placeholder="Tag dipisah koma"
                  id="input-label"
                />
              </div>
            </div>

            {/* Target Negara & Audience */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono tracking-wider">Target Negara</label>
                <input
                  type="text"
                  name="targetCountry"
                  value={inputs.targetCountry}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-300 outline-none transition-colors"
                  id="input-targetCountry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-mono tracking-wider">Target Audience</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={inputs.targetAudience}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-300 outline-none transition-colors"
                  placeholder="cth: Ibu Rumah Tangga"
                  id="input-targetAudience"
                />
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono tracking-wider">Bahasa Artikel</label>
              <select
                name="language"
                value={inputs.language}
                onChange={handleInputChange}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-300 outline-none transition-colors"
                id="select-language"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            {/* Article Length Selection (Radios with nice UI) */}
            <div className="space-y-2">
              <label className="text-zinc-400 font-mono tracking-wider">Kerapatan Pembhasan (Panjang Artikel)</label>
              <div className="space-y-2">
                {LENGTHS.map(len => (
                  <label
                    key={len.value}
                    onClick={() => setInputs(prev => ({ ...prev, articleLength: len.value }))}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      inputs.articleLength === len.value
                        ? 'bg-emerald-500/5 border-emerald-500 text-white'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="articleLength"
                      value={len.value}
                      checked={inputs.articleLength === len.value}
                      onChange={() => {}} // Controlled via parent click
                      className="mt-1 accent-emerald-500 shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-xs text-zinc-200">{len.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 leading-normal">{len.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Writing Style selection */}
            <div className="space-y-2">
              <label className="text-zinc-400 font-mono tracking-wider">Gaya Tulisan (Search Intent Match)</label>
              <div className="grid grid-cols-1 gap-2">
                {WRITING_STYLES.map(style => (
                  <label
                    key={style.value}
                    onClick={() => setInputs(prev => ({ ...prev, writingStyle: style.value }))}
                    className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                      inputs.writingStyle === style.value
                        ? 'bg-emerald-500/5 border-emerald-500 text-white'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="writingStyle"
                      value={style.value}
                      checked={inputs.writingStyle === style.value}
                      onChange={() => {}}
                      className="mt-0.5 accent-emerald-500 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-xs text-zinc-200">{style.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 leading-normal">{style.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Slider: Strength of anti-spam and humanizer */}
            <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-400 flex items-center gap-1">
                  Strength Humanizer Layer
                </span>
                <span className="text-emerald-400 font-mono font-bold text-xs">{inputs.humanizeStrength}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={inputs.humanizeStrength}
                onChange={handleSliderChange}
                className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                id="range-humanizer"
              />
              <div className="flex justify-between text-[9.5px] text-zinc-500 font-mono">
                <span>Standard SEO</span>
                <span>Ultra-Natural (E-E-A-T)</span>
              </div>
            </div>

            {/* Posting Mode Selector */}
            <div className="space-y-3 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <label className="text-zinc-400 font-mono tracking-wider block">Mode Posting Otomatis</label>
              <div className="grid grid-cols-3 gap-2">
                {['draft', 'instant', 'scheduled'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setInputs(prev => ({ ...prev, postingMode: mode }))}
                    className={`p-2 rounded-lg text-center font-bold text-[10px] capitalize tracking-wide transition-all ${
                      inputs.postingMode === mode
                        ? 'bg-emerald-500 text-zinc-950 border border-emerald-400'
                        : 'bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {mode === 'instant' ? 'Instant Post' : mode}
                  </button>
                ))}
              </div>

              {inputs.postingMode === 'scheduled' && (
                <div className="space-y-1.5 pt-2 animate-fadeIn">
                  <label className="text-[10px] text-zinc-400 font-mono">Pilih Jadwal Posting (Local Time)</label>
                  <input
                    type="datetime-local"
                    name="scheduleTime"
                    value={inputs.scheduleTime || ""}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded p-2 text-xs focus:border-emerald-500 outline-none"
                    id="input-scheduleTime"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={executeGeneration}
              disabled={loading}
              className={`w-full py-4 text-xs font-bold font-mono tracking-wider uppercase rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                loading 
                  ? 'bg-zinc-800 text-zinc-600 border border-zinc-700 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-emerald-500/10'
              }`}
              id="generate-article-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  Memformulasikan Poin SEO...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Generate Premium SEO Artikel
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Side: Generation Result Preview - 7 Cols */}
        <div className="lg:col-span-7">
          
          {/* 1. Loading screen state */}
          {loading && (
            <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[500px] space-y-6 animate-pulse">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/10 border-t-emerald-500 animate-spin flex items-center justify-center" />
                <Sparkles className="w-6 h-6 text-emerald-400 absolute top-5 left-5 animate-pulse" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h4 className="font-bold text-white text-base">BlogForge AI Senior Editor sedang meracik...</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                  {steps[loadingStep]}
                </p>
              </div>

              {/* Fake logs display during analysis */}
              <div className="w-full max-w-md bg-black/80 font-mono text-[10px] text-zinc-500 p-4 rounded-xl text-left space-y-1.5 border border-zinc-900/60 leading-normal">
                <div className="text-emerald-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>[ANALISIS] Membaca Search Intent primer & sekunder... OK.</span>
                </div>
                {loadingStep >= 1 && (
                  <div className="text-emerald-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>[MAPPER] Memetakan relasi cluster topik & semantic expansion... OK.</span>
                  </div>
                )}
                {loadingStep >= 3 && (
                  <div className="text-emerald-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>[OUTLINE] Menentukan H2 & H3 hierarchy helpful-content standard... OK.</span>
                  </div>
                )}
                {loadingStep >= 4 && (
                  <div className="text-emerald-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>[HUMANIZER] Memangkas redundant AI wordings (misalnya "Dalam era digital saat ini")... OK.</span>
                  </div>
                )}
                <div className="text-zinc-600">
                  ⚡ Memanggil server-side Gemini 3.5-flash AI Model...
                </div>
              </div>
            </div>
          )}

          {/* 2. Error state */}
          {error && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-8 space-y-4 animate-fadeIn min-h-[400px] flex flex-col justify-center">
              <div className="inline-flex bg-rose-500/10 p-3.5 rounded-full text-rose-400 border border-rose-500/20 w-fit">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-rose-200 text-sm">Gagal Menghasilkan Artikel Premium</h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                  {error}
                </p>
              </div>
              <div className="pt-2 text-xs text-zinc-500">
                Langkah Solusi: Pastikan parameter input valid, secrets **GEMINI_API_KEY** disetel pada console, atau kurangi beban clustering keywords.
              </div>
            </div>
          )}

          {/* 3. Empty state */}
          {!loading && !error && !generationResult && (
            <div className="bg-zinc-900/60 border border-dashed border-zinc-800 rounded-2xl p-12 text-center min-h-[500px] flex flex-col items-center justify-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-zinc-950 border border-zinc-850 text-zinc-600">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-xs space-y-1">
                <h4 className="font-bold text-zinc-300 text-sm">Kertas Kerja Masih Kosong</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Isi niche blog, pilih target keyword utama, lalu klik **Generate Premium SEO Artikel** untuk memicu penganalisaan.
                </p>
              </div>
            </div>
          )}

          {/* 4. Generation Success State */}
          {!loading && !error && generationResult && (
            <div className="space-y-6 animate-fadeIn" id="article-output-preview">
              
              {/* Meta stats block */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-wrap gap-6 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="bg-emerald-500/10 text-emerald-400 w-11 h-11 rounded-xl border border-emerald-500/20 flex items-center justify-center font-bold font-mono">
                    {Math.round((generationResult.seoScoreChecklist.filter(t => t.isPassed).length / generationResult.seoScoreChecklist.length) * 100)}%
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">Skor Kualitas SEO</h4>
                    <p className="text-xs text-zinc-500">Berdasarkan Helpful Content Signals</p>
                  </div>
                </div>

                <div className="flex items-center gap-7 flex-wrap text-xs">
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 block font-mono text-[10px]">Waktu Baca</span>
                    <span className="font-bold text-zinc-200">{generationResult.readingTime} Menit</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 block font-mono text-[10px]">Jumlah Kata</span>
                    <span className="font-bold text-zinc-200">{generationResult.wordCount} Kata</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 block font-mono text-[10px]">Intent tipe</span>
                    <span className="font-mono bg-zinc-800 text-emerald-300 border border-zinc-700 px-1.5 py-0.5 rounded capitalize font-bold text-[10px]">
                      {generationResult.searchIntent.intentType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons bar for Blogger Publishing */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      Auto-Publishing Blogspot
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Kirim artikel premium ini langsung ke Blogspot <span className="font-mono text-zinc-400">{inputs.blogspotUrl}</span>
                    </p>
                  </div>

                  <button
                    onClick={sendToBlogspot}
                    disabled={isPosting}
                    className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-colors inline-flex items-center justify-center gap-1.5"
                    id="post-to-blogger-btn"
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Sedang Posting...
                      </>
                    ) : (
                      <>
                        Posting Sekarang ({inputs.postingMode.toUpperCase()})
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Successful Post indicator popup/card */}
                {postSuccessData && (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2 animate-slideUp">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-emerald-300 text-xs">
                          {inputs.postingMode === 'scheduled' 
                            ? 'Artikel Berhasil Dijadwalkan!' 
                            : 'Artikel Berhasil Diposting ke Blogger!'}
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {postSuccessData.isSandbox 
                            ? 'Lolos format posting Blogger API (Diproses aman via Sandbox offline)'
                            : 'Gelar indexing Google Search telah diajukan.'}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 flex items-center gap-3">
                      <a
                        href={postSuccessData.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        Buka Live Link Preview <Share2 className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible details components - Tabs of Article information */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                
                {/* Search intent & Semantic Cluster header expansion card */}
                <div className="p-6 border-b border-zinc-800/80 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10.5px] font-mono uppercase tracking-wider font-semibold">
                    <MessageSquare className="w-3 h-3" />
                    SEO Search Intent Analysis & Semantic Map
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-zinc-400">Search Intent Terdeteksi:</h4>
                      <p className="text-sm font-bold text-white tracking-snug mt-1 capitalize">
                        {generationResult.searchIntent.intentType} Intent
                      </p>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                        {generationResult.searchIntent.explanation}
                      </p>
                    </div>

                    <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-850 space-y-2">
                      <div className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono">
                        Format Penyajian Konten Paling Sesuai:
                      </div>
                      <p className="text-xs font-bold text-zinc-300 font-sans">
                        {generationResult.searchIntent.formattingStyleNeeded}
                      </p>
                    </div>

                    {/* Semantic cluster tags */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Klaster Semantik Terkait & Tingkat Kompetisi:</h5>
                      <div className="flex flex-wrap gap-2">
                        {generationResult.semanticCluster.map((cluster, i) => (
                          <div 
                            key={i} 
                            className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 rounded-lg p-2.5 text-left text-xs space-y-1 group"
                          >
                            <div className="font-bold text-zinc-300 group-hover:text-emerald-400 transition-colors">
                              {cluster.keyword}
                            </div>
                            <div className="flex items-center justify-between text-[9.5px] font-mono">
                              <span className="text-zinc-500">SERP Diff:</span>
                              <span className="text-emerald-400 font-semibold">{cluster.searchVolumeDifficulty}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-normal font-sans pt-1">
                              {cluster.relevanceExplanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slug, category, meta tags data sheet row */}
                <div className="p-6 border-b border-zinc-800/80 bg-zinc-950/40 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">SEO Friendly Slug:</span>
                      <span className="font-mono text-zinc-300 bg-zinc-950 px-2 py-1 rounded inline-block mt-1 border border-zinc-850">
                        {generationResult.slug}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Meta Description (CTR Optimized):</span>
                      <p className="text-zinc-300 bg-zinc-950 px-2.5 py-1.5 rounded mt-1 border border-zinc-850 leading-relaxed font-sans text-xs italic">
                        "{generationResult.metaDescription}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Kategori Niche:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {generationResult.categories.map((cat, i) => (
                          <span key={i} className="bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-zinc-850 font-mono text-[10px]">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Rekomendasi Label Tag:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {generationResult.labels.map((lab, i) => (
                          <span key={i} className="bg-zinc-950 text-zinc-300 px-2 py-0.5 rounded border border-zinc-850 font-mono text-[10px]">
                            #{lab}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Saran Internal Linking Anchor:</span>
                      <ul className="list-disc list-inside space-y-1 text-zinc-400 mt-1 font-serif text-[11px]">
                        {generationResult.internalLinkingSuggestions.map((sug, i) => (
                          <li key={i}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Audit Checklist Row */}
                <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/50">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Laporan Audit Helpful Content & SEO Checklist ({generationResult.seoScoreChecklist.filter(c => c.isPassed).length}/{generationResult.seoScoreChecklist.length})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {generationResult.seoScoreChecklist.map((check) => (
                      <div 
                        key={check.id}
                        className={`p-3 rounded-xl border flex gap-2.5 text-xs ${
                          check.isPassed 
                            ? 'bg-emerald-500/5 border-emerald-500/10 text-zinc-300' 
                            : 'bg-rose-500/5 border-rose-500/10 text-zinc-400'
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 ${check.isPassed ? 'text-emerald-400' : 'text-zinc-600'}`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className={`font-bold ${check.isPassed ? 'text-zinc-200' : 'text-zinc-400 line-through'}`}>
                            {check.label}
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-normal">
                            {check.notes}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structured Outline layout */}
                <div className="p-6 border-b border-zinc-800/80">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-emerald-400" />
                    Struktur Kerangka Artikel (Topical Outline Map)
                  </h4>
                  <div className="space-y-2 font-sans text-xs">
                    {/* Outline elements */}
                    {generationResult.outline.map((out, i) => (
                      <div 
                        key={i} 
                        className={`p-3.5 rounded-xl border border-zinc-850/60 flex items-start gap-3 bg-zinc-950/80 ${
                          out.level === 2 ? 'pl-4 border-l-2 border-l-emerald-500' : 'pl-8'
                        }`}
                      >
                        <span className="font-mono text-zinc-500 text-[10px] mt-0.5 uppercase">
                          H{out.level}
                        </span>
                        <div className="space-y-1 flex-1">
                          <div className="font-bold text-zinc-200">{out.heading}</div>
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {out.goals.map((goal, gi) => (
                              <span key={gi} className="bg-zinc-900 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded text-[10px] leading-relaxed">
                                • {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw generated premium text viewer - markdown visualizer style */}
                <div className="p-6 bg-zinc-950 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        Salinan Pratinjau Artikel (Rich Media Layout)
                      </h4>
                      <p className="text-[10.5px] text-zinc-500 mt-1">
                        Format Markdown premium yang siap di-copas atau dipublish ke Blogger.
                      </p>
                    </div>
                  </div>

                  {/* Rich Preview Box */}
                  <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-6 select-text overflow-x-auto text-sm leading-relaxed text-zinc-300 font-sans space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    
                    {/* Rendered article simulator */}
                    <div className="font-serif prose prose-invert max-w-none space-y-6">
                      
                      {/* Simulated title */}
                      <div className="border-b border-zinc-800 pb-5 mb-5 font-sans">
                        <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-2.5">
                          JUDUL ARTIKEL SEO
                        </span>
                        <h1 className="text-2xl font-black text-white hover:text-emerald-400 transition-colors leading-tight">
                          {generationResult.title}
                        </h1>
                      </div>

                      {/* Pure printed text formatting */}
                      <div className="font-sans text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed font-serif space-y-4 text-sm">
                        {generationResult.articleMarkdown}
                      </div>

                    </div>

                  </div>

                </div>

              </div>
              
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
