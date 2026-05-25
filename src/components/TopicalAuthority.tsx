import React, { useState } from "react";
import { CampaignHistoryItem } from "../types";
import { Network, Sparkles, Star, GitFork, RefreshCw, Key, HelpCircle, Layers, CheckCircle } from "lucide-react";

interface TopicalAuthorityProps {
  history: CampaignHistoryItem[];
}

interface CustomNode {
  id: string;
  label: string;
  category: string; // 'core' | 'subtopic' | 'competitor' | 'semantic'
  difficulty: 'Low' | 'Medium' | 'High';
  x: number;
  y: number;
  description: string;
}

export default function TopicalAuthority({ history }: TopicalAuthorityProps) {
  // Hardcoded default cool nodes
  const [nodes, setNodes] = useState<CustomNode[]>([
    { id: "1", label: "Belajar Prompt Engineering", category: "core", difficulty: "Medium", x: 250, y: 200, description: "Konsep sentral membangun struktur perintah cerdas berbasis model instruksi." },
    { id: "2", label: "Tips Menulis Prompt Gemini", category: "subtopic", difficulty: "Low", x: 100, y: 100, description: "Teknik zero-shot dan few-shot prompting spesifik untuk Gemini SDK." },
    { id: "3", label: "Topical Authority SEO", category: "semantic", difficulty: "High", x: 400, y: 120, description: "Membangun kredibilitas konten dengan menguasai seluruh subtopik relevan." },
    { id: "4", label: "Structured JSON Output", category: "subtopic", difficulty: "Low", x: 120, y: 280, description: "Panduan model mengembalikan skema JSON yang tervalidasi secara konsisten." },
    { id: "5", label: "Blogger API Auto-Posting", category: "subtopic", difficulty: "Low", x: 380, y: 290, description: "Rangkaian integrasi data client-server ke Google Blogger OAuth." },
  ]);

  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(nodes[0]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState<'subtopic' | 'semantic'>('subtopic');
  const [newDiff, setNewDiff] = useState<'Low' | 'Medium' | 'High'>('Low');

  // Insert extra node to expand the map
  const addNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    // Place randomly close to center
    const x = 100 + Math.random() * 300;
    const y = 80 + Math.random() * 240;

    const added: CustomNode = {
      id: String(Date.now()),
      label: newKeyword,
      category: newCategory,
      difficulty: newDiff,
      x,
      y,
      description: `Ekspansi kata kunci semantis untuk mendukung topical authority niche ${newCategory}.`
    };

    setNodes(prev => [...prev, added]);
    setSelectedNode(added);
    setNewKeyword("");
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="topical-authority-view">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Topical Authority Graph Engine</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Visualisasikan cakupan subtopik (Topic Cluster) dan relasi entitas pencarian untuk mendominasi Google Helpful Content Update.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Interactive SVG Graph Canvas - 2 cols */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-zinc-100">Topical Entity Relationship Web</h3>
            </div>
            <div className="flex gap-2 text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Core</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Subtopic</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Semantic</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Klik pada node lingkaran interaktif di bawah untuk melihat detail target SEO, nilai kompetisi kesulitan kata kunci, dan intent terklaster.
          </p>

          {/* SVG Visual Stage */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-xl relative overflow-hidden h-[360px] cursor-crosshair">
            
            {/* Grid backgrounds */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-30" />
            
            <svg className="w-full h-full">
              {/* Lines from core to other nodes */}
              {nodes.map((node) => {
                if (node.category === 'core') return null;
                // Find core node
                const coreNode = nodes.find(n => n.category === 'core') || nodes[0];
                return (
                  <line
                    key={`line-${node.id}`}
                    x1={coreNode.x}
                    y1={coreNode.y}
                    x2={node.x}
                    y2={node.y}
                    stroke="rgba(16, 185, 129, 0.2)"
                    strokeWidth="1.5"
                    strokeDasharray={node.category === 'semantic' ? '4,4' : '0'}
                    className="transition-all"
                  />
                );
              })}

              {/* Draw connected lines */}
              {nodes.map((node, i) => {
                const nextNode = nodes[(i + 1) % nodes.length];
                if (node.category !== 'core' && nextNode.category !== 'core') {
                  return (
                    <line
                      key={`line-sub-${node.id}`}
                      x1={node.x}
                      y1={node.y}
                      x2={nextNode.x}
                      y2={nextNode.y}
                      stroke="rgba(6, 182, 212, 0.12)"
                      strokeWidth="1"
                    />
                  );
                }
                return null;
              })}

              {/* Node Circles */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const coreNodeColor = "fill-emerald-500 stroke-emerald-400";
                const subtopicColor = "fill-cyan-500 stroke-cyan-400";
                const semanticColor = "fill-yellow-500 stroke-yellow-400";
                
                const nodeTheme = node.category === 'core' 
                  ? coreNodeColor 
                  : node.category === 'subtopic' 
                  ? subtopicColor 
                  : semanticColor;

                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node)}
                  >
                    <circle
                      r={node.category === 'core' ? 14 : parseInt(node.id) % 2 === 0 ? 9 : 8}
                      className={`${nodeTheme} transition-all duration-150 relative ${
                        isSelected ? 'stroke-white stroke-[3px] scale-125' : 'stroke-[1.5px] hover:stroke-white'
                      }`}
                    />
                    <text
                      y={node.category === 'core' ? -20 : 18}
                      textAnchor="middle"
                      className="fill-zinc-300 group-hover:fill-white text-[10px] font-mono tracking-tight select-none bg-black"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Float quick actions banner inside stage */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-[9px] font-mono text-zinc-500 uppercase bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                Interactive SVG Rendered
              </span>
            </div>
          </div>

          {/* Quick Node insertion Form */}
          <form onSubmit={addNode} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-850">
            <div className="sm:col-span-2 text-xs space-y-1">
              <label className="text-zinc-500 font-mono text-[10px]">Tambahkan Keyword Baru</label>
              <input
                type="text"
                placeholder="cth: Prompt Engineering Roadmap"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="text-xs space-y-1">
              <label className="text-zinc-500 font-mono text-[10px]">Tipe Peta</label>
              <select
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-cyan-500 outline-none"
              >
                <option value="subtopic">Subtopic API</option>
                <option value="semantic">Semantic Query</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-auto py-1.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs rounded transition-colors"
            >
              Petakan Poin
            </button>
          </form>

        </div>

        {/* Right Detail Card panel & guidelines - 1 col */}
        <div className="space-y-6">
          
          {/* Node Selected detail view */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800">
              <Star className="w-4.5 h-4.5 text-yellow-400" />
              <h3 className="font-bold text-xs text-zinc-300 uppercase tracking-widest font-mono">Klaster Detail Peta</h3>
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-550">Klausa Kata Kunci</h4>
                  <p className="text-sm font-black text-white mt-1">{selectedNode.label}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-[10.5px]">
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-850">
                    <span className="text-zinc-500 block text-[9px] uppercase">Grup Entitas</span>
                    <span className="text-zinc-300 uppercase capitalize font-bold">{selectedNode.category}</span>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-850">
                    <span className="text-zinc-500 block text-[9px] uppercase">SEO Difficulty</span>
                    <span className={`font-bold ${
                      selectedNode.difficulty === 'Low' ? 'text-emerald-400' : selectedNode.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {selectedNode.difficulty}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-550 uppercase">Deskripsi Relevansi</span>
                  <p className="text-zinc-400 leading-relaxed mt-1">{selectedNode.description}</p>
                </div>

                <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Helpful-Content Alignment
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Menghubungkan pembahasan ke subtopik ini memperkuat topical authority blogspot Anda sebesar +25% di mata crawler Google.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 text-center py-6">Pilih salah satu node pada jaring relasi untuk melihat metrik khusus.</p>
            )}
          </div>

          {/* Core concept explanation help block */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3.5">
            <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Mengapa Topical Authority?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Google tidak lagi mengukur kredibilitas artikel hanya berdasarkan pengulangan kata kunci tunggal. 
              Mesin pencari modern menggunakan analisis semantik grafis (Knowledge Graph) untuk melihat seberapa komprehensif Anda membahas seluruh klaster topik dalam satu niche blogspot.
            </p>
            <div className="text-[10.5px] text-zinc-500 font-mono uppercase bg-zinc-950 p-2.5 rounded border border-zinc-850 leading-normal">
              💡 Tips Premium: Buat interkoneksi link internal antar-artikel dengan tag/label setipe untuk mempercepat proses indexing.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
