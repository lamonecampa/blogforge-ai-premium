import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EditorialStudio from "./components/EditorialStudio";
import TopicalAuthority from "./components/TopicalAuthority";
import BloggerIntegration from "./components/BloggerIntegration";
import { CampaignHistoryItem, GeneralInputs, BlogForgeResult, BloggerAccount } from "./types";
import { Sparkles, Key, AlertCircle, HelpCircle } from "lucide-react";

// Pre-populated senior editorial templates to give user immediate illustrative SEO concepts
const PRE_POPULATED_CAMPAIGNS: CampaignHistoryItem[] = [
  {
    id: "camp_1",
    inputs: {
      niche: "Teknologi & Artificial Intelligence",
      primaryKeyword: "belajar prompt engineering untuk pemula",
      secondaryKeywords: "tips menulis prompt, panduan prompt engineering, contoh prompt terbaik",
      blogspotUrl: "https://premiumdemo.blogspot.com",
      category: "AI & Machine Learning",
      label: "Tutorial, Prompting, AI",
      language: "id",
      articleLength: "medium",
      writingStyle: "conversational",
      targetCountry: "Indonesia",
      targetAudience: "Mahasiswa dan Fresh Graduate",
      postingMode: "draft",
      humanizeStrength: 85
    },
    result: {
      title: "Panduan Belajar Prompt Engineering untuk Pemula Tanpa Ribet",
      searchIntent: {
        intentType: "informational",
        explanation: "Pengguna mencari materi edukasi berbobot tinggi untuk memahami instruksi AI tanpa istilah jargon yang kaku.",
        formattingStyleNeeded: "Step-by-step list dengan contoh analogi kehidupan nyata."
      },
      semanticCluster: [
        { keyword: "teknik zero shot prompting", searchVolumeDifficulty: "Low Diff / High Intent", relevanceExplanation: "Sangat relevan untuk pemula yang ingin langsung mencoba instruksi sekali tembak." },
        { keyword: "few-shot learning prompt", searchVolumeDifficulty: "Medium Diff / High Intent", relevanceExplanation: "Membantu melatih pemirsa memberi contoh data terstruktur ke model LLM." }
      ],
      outline: [
        { heading: "Mengapa Perintah AI Terasa Kurang Akurat?", level: 2, goals: ["Mengurai keluhan umum tebakan salah model", "Memperkenalkan konsep prompt terstruktur"] },
        { heading: "3 Langkah Emas Menulis Prompt Orisinal", level: 2, goals: ["Penetapan Persona", "Pemberian Konteks", "Format Output yang Diinginkan"] }
      ],
      articleMarkdown: `Belakangan ini, berinteraksi dengan AI sering kali terasa seperti membisikkan sesuatu ke ruang kosong—kadang Anda mendapatkan jawaban brilian, namun tak jarang Anda justru menerima respons yang meleset jauh dari harapan. Mengapa demikian? Jawabannya bukan karena AI Anda kurang cerdas, melainkan karena cara kita menginstruksikannya masih terlalu samar. Di sinilah **Prompt Engineering** bertindak sebagai jembatan.

## Mengapa Perintah AI Terasa Kurang Akurat?
Ketika kita menulis perintah seadanya seperti "buatkan postingan instagram tentang kopi", AI akan memperkirakan miliaran format acak. Hasilnya sering kali melebar, penuh dengan bahasa klise seperti "di era digital saat ini" atau "tahukah Anda?". 

Perintah yang baik adalah perintah yang memiliki kemudi. Menulis prompt tidak memerlukan latar belakang pemrograman komputer. Yang Anda butuhkan hanyalah presisi dalam mendiktekan maksud Anda kepada asisten virtual tersebut.

## 3 Langkah Emas Menulis Prompt Orisinal
### 1. Tetapkan Persona yang Jelas
Alih-alih langsung menyuruh AI menulis, mintalah ia mengadopsi identitas tertentu terlebih dahulu. Misalnya: "Bertindaklah sebagai barista senior dengan pengalaman 10 tahun..."

### 2. Berikan Konteks Dunia Nyata
AI tidak memiliki penglihatan horizontal. Jelaskan siapa target pembaca Anda. Katakan secara spesifik: "Target pembaca kita adalah mahasiswa yang sedang mengantuk dan membutuhkan rekomendasi kopi cepat saji."

### 3. Batasi Format Output
Mintalah output unik: "Buat dalam bentuk 3 poin bullet, hindari pengantar basa-basi, langsung mulai dengan instruksi utama."`,
      metaDescription: "Temukan rahasia menulis instruksi AI yang akurat dengan panduan prompt engineering untuk pemula beserta contoh taktis orisinal.",
      slug: "panduan-belajar-prompt-engineering-pemula",
      labels: ["AI", "Tutorial", "Prompting"],
      categories: ["AI & Machine Learning"],
      internalLinkingSuggestions: ["Gunakan jangkar 'panduan dasar AI' untuk menghubungkan artikel pilar."],
      seoScoreChecklist: [
        { id: "1", label: "Helpful Content Compliant", isPassed: true, notes: "Langsung menjawab maksud utama tanpa pembukaan generik." },
        { id: "2", label: "Semantic Density", isPassed: true, notes: "Keyword tertanam halus dan bernada natural." }
      ],
      readingTime: 4,
      wordCount: 850
    },
    createdAt: "2026-05-24T18:30:00Z",
    status: "published",
    publishUrl: "https://premiumdemo.blogspot.com/2026/05/panduan-belajar-prompt-engineering-pemula.html"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'studio' | 'topical' | 'blogger'>('dashboard');
  const [hasGeminiKey, setHasGeminiKey] = useState(true);
  const [history, setHistory] = useState<CampaignHistoryItem[]>(PRE_POPULATED_CAMPAIGNS);
  const [bloggerAccount, setBloggerAccount] = useState<BloggerAccount>({
    connected: true,
    blogName: "Premium Demo Blogspot",
    blogUrl: "https://premiumdemo.blogspot.com",
    blogId: "999888777",
    useSandbox: true,
  });

  // Verify health and gemini key presence on local startup mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch("/api/health");
        if (response.ok) {
          const data = await response.json();
          setHasGeminiKey(data.hasGeminiKey);
        }
      } catch (err) {
        console.error("Health check error:", err);
      }
    }
    checkHealth();
  }, []);

  // Handler: When a new article is generated successfully via studio
  const handleArticleGenerated = (inputs: GeneralInputs, result: BlogForgeResult) => {
    const newItem: CampaignHistoryItem = {
      id: "camp_" + Date.now(),
      inputs,
      result,
      createdAt: new Date().toISOString(),
      status: 'draft', // Saved as draft inside historical list first
    };
    setHistory(prev => [newItem, ...prev]);
  };

  // Handler: Modify/Authorize Blogger specifications
  const handleUpdateBloggerAccount = (account: BloggerAccount) => {
    setBloggerAccount(account);
  };

  // Handler: Post / Schedule a generated article directly to Blogger via server proxy
  const handlePostToBlogger = async (result: BlogForgeResult, inputs: GeneralInputs): Promise<any> => {
    try {
      const response = await fetch("/api/blogspot/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.title,
          contentMarkdown: result.articleMarkdown,
          labels: result.labels,
          bloggerPostId: bloggerAccount.blogId,
          useSandbox: bloggerAccount.useSandbox,
          blogspotUrl: inputs.blogspotUrl,
          accessToken: bloggerAccount.accessToken,
          blogId: bloggerAccount.blogId,
          postingMode: inputs.postingMode,
          scheduleTime: inputs.scheduleTime,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal memposting artikel");
      }

      const data = await response.json();
      
      // Update our history items status
      setHistory(prev => {
        return prev.map(item => {
          if (item.result.title === result.title) {
            return {
              ...item,
              status: data.status,
              publishUrl: data.url,
              bloggerPostId: data.postId,
              scheduledFor: inputs.scheduleTime,
            };
          }
          return item;
        });
      });

      return data;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  // Handler: Trigger immediate publishing for scheduled posts inside history
  const handleTriggerPublish = async (campaignId: string) => {
    const campaign = history.find(c => c.id === campaignId);
    if (!campaign) return;

    try {
      const response = await fetch("/api/blogspot/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: campaign.result.title,
          contentMarkdown: campaign.result.articleMarkdown,
          labels: campaign.result.labels,
          useSandbox: bloggerAccount.useSandbox,
          blogspotUrl: campaign.inputs.blogspotUrl,
          accessToken: bloggerAccount.accessToken,
          blogId: bloggerAccount.blogId,
          postingMode: "instant",
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal memaksa terbit artikel");
      }

      const data = await response.json();
      setHistory(prev => {
        return prev.map(item => {
          if (item.id === campaignId) {
            return {
              ...item,
              status: "published",
              publishUrl: data.url,
              bloggerPostId: data.postId,
            };
          }
          return item;
        });
      });

      alert(`Artikel "${campaign.result.title}" berhasil dipublikasikan sekarang!`);
    } catch (err: any) {
      alert("Error memicu posting scheduler: " + err.message);
    }
  };

  // Selected historic log preview details
  const handleSelectCampaign = (camp: CampaignHistoryItem) => {
    // Simply prefill inputs and set active tab to Editorial Studio
    setActiveTab('studio');
    // Scroll automatically or trigger direct presentation in EditorialStudio preview if needed
  };

  return (
    <div className="flex bg-zinc-950 text-zinc-100 min-h-screen" id="applet-container">
      
      {/* 1. Sticky Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasGeminiKey={hasGeminiKey} 
      />

      {/* 2. Main content container frame */}
      <main className="flex-1 overflow-x-hidden min-h-screen relative p-8 lg:p-12" id="main-content-scroll">
        
        {/* Render Active Tap view */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            history={history} 
            hasGeminiKey={hasGeminiKey}
            onSelectCampaign={handleSelectCampaign}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'studio' && (
          <EditorialStudio 
            onArticleGenerated={handleArticleGenerated}
            hasGeminiKey={hasGeminiKey}
            onPostToBlogger={handlePostToBlogger}
          />
        )}

        {activeTab === 'topical' && (
          <TopicalAuthority 
            history={history}
          />
        )}

        {activeTab === 'blogger' && (
          <BloggerIntegration 
            bloggerAccount={bloggerAccount}
            onUpdateBloggerAccount={handleUpdateBloggerAccount}
            campaigns={history}
            onTriggerPublish={handleTriggerPublish}
          />
        )}

      </main>

    </div>
  );
}
