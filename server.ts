import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK securely on the server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Ensure database/history can hold some sessions in memory during runtime
const campaignHistory: any[] = [];

// API Route: Check Gemini availability
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!apiKey,
  });
});

// API Route: Generate Premium Blog Post Packages
app.post("/api/generate", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "API Key Gemini belum dikonfigurasi. Silakan tambahkan GEMINI_API_KEY di dashboard Secrets panel."
    });
  }

  const {
    niche,
    primaryKeyword,
    secondaryKeywords,
    blogspotUrl,
    category,
    label,
    language,
    articleLength,
    writingStyle,
    targetCountry,
    targetAudience,
  } = req.body;

  if (!niche || !primaryKeyword) {
    return res.status(400).json({ error: "Niche dan Keyword Utama wajib diisi." });
  }

  // Length estimation word count
  let lengthDescription = "sekitar 1000 kata dengan detail tinggi";
  if (articleLength === "short") lengthDescription = "sekitar 800 kata, padat dan langsung ke poin";
  if (articleLength === "long") lengthDescription = "lebih dari 2000 kata dengan komparasi dan data mendalam";

  // Writing style guidance
  let styleGuider = "informatif, natural, dan mudah dipahami manusia nyata";
  if (writingStyle === "analytical") styleGuider = "gaya analitis, menggunakan data logika, membandingkan opsi secara objektif";
  if (writingStyle === "kredibel") styleGuider = "gaya hati-hati, kredibel, seperti ahli medis atau finansial profesional";
  if (writingStyle === "step-by-step") styleGuider = "step-by-step tutorial yang sangat detail dan mudah diikuti pemula";
  if (writingStyle === "strategis") styleGuider = "gaya strategis bisnis, berfokus pada hasil jangka panjang dan analisis taktis";
  if (writingStyle === "edukatif") styleGuider = "edukatif sederhana namun mendalam, mengajari konsep fundamental tanpa membingungkan";
  if (writingStyle === "conversational") styleGuider = "conversational natural, santai seperti obrolan kedai kopi, ramah pembaca";

  const prompt = `
Silakan buat artikel premium SEO-friendly berorientasi ranking Google berdasarkan data input berikut:
- Niche Blogspot: "${niche}"
- Keyword Utama: "${primaryKeyword}"
- Keyword Turunan/Sekunder: "${secondaryKeywords || "tidak ada"}"
- Kategori bawaan: "${category || "Umum"}"
- Label bawaan: "${label || "Premium"}"
- Bahasa Artikel: "${language || "id"}"
- Panjang Artikel Target: "${articleLength}" (${lengthDescription})
- Gaya Penulisan: "${writingStyle}" (${styleGuider})
- Target Negara: "${targetCountry || "Indonesia"}"
- Target Pemirsa: "${targetAudience || "Umum"}"

ATURAN STRUKTUR EDITORIAL (Wajib Dipenuhi):
- Buat judul artikel yang menarik dan SEO-Friendly (Auto Generate Judul SEO).
- Tulis sebuah Hook pembuka artikel yang memikat, langsung menjawab keresahan pembaca.
- JABARKAN artikel lengkap (articleMarkdown) secara utuh, jangan gunakan placeholder seperti "[lanjutkan di sini...]" atau ringkasan pendek. Tulis setiap kata secara lengkap.
- Terapkan heading modern H2 dan H3.
- Sisipkan 3 Pertanyaan FAQ SEO yang sering dicari terkait topik ini beserta jawabannya yang ringkas.
- Berikan saran internal linking natural yang sesuai untuk niche ini.
- Hasil artikel harus lolos uji manual search intent dan anti-spam AI.

Silakan berikan tanggapan dalam bentuk JSON lengkap yang sesuai dengan JSON Schema yang diminta.
`;

  const systemInstruction = `
Kamu adalah seorang Editor SEO Senior, Ahli Strategi Konten, dan Blogger Teknis Profesional.
Kamu TIDAK menulis seperti AI generik. Gaya tulisanmu sangat natural, kredibel, kaya akan analogi cerdas, dan langsung menjawab maksud pencarian pengguna (User/Search Intent).

ATURAN ANTI-SPAM AI DAN HUMANIZE KETAT:
1. JANGAN PERNAH gunakan frasa pembuka atau pengisi yang klise seperti:
   - "Dalam era digital saat ini"
   - "Penting untuk diketahui"
   - "Pada artikel ini kita akan membahas"
   - "Tidak dapat dipungkiri"
   - "Di zaman modern"
   - "Mari kita bahas secara mendalam..."
2. Mulai tulisan langsung dengan fakta menarik, skenario kehidupan nyata, pertanyaan provokatif, atau pernyataan berani yang relevan dengan topik.
3. Variasikan panjang kalimat secara dinamis. Campurkan kalimat pendek yang menohok dengan kalimat panjang yang berstruktur logis.
4. Paragraf harus pendek dan nyaman dibaca (maksimal 3-4 kalimat per paragraf). Gunakan spasi putih (negative space) untuk kemudahan scrolling smartphone.
5. Jangan gunakan keyword stuffing secara berlebihan. Masukkan kata kunci utama dan semantic keyword ke dalam tulisan secara halus dan mengalir alami.
6. Buat konten yang sangat bermanfaat (Helpful Content) yang memberikan sudut pandang unik atau contoh kasus praktis dibanding hanya menyalin hal-hal umum dari internet.
7. Artikel wajib memiliki: Judul Menarik, Hook Kuat, Pendahuluan Tanpa Basa-Basi, Pembahasan Utama (dengan H2 & H3), Contoh Nyata/Dunia Nyata, FAQ SEO terstruktur, Kesimpulan, serta CTA yang luwes dan tidak memaksa.
8. Selalu analisis Search Intent (apakah Informational, Transactional, Navigational, atau Commercial Investigation) terlebih dahulu untuk menyesuaikan struktur artikel Anda.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "title",
            "searchIntent",
            "semanticCluster",
            "outline",
            "articleMarkdown",
            "metaDescription",
            "slug",
            "labels",
            "categories",
            "internalLinkingSuggestions",
            "seoScoreChecklist"
          ],
          properties: {
            title: {
              type: Type.STRING,
              description: "Judul artikel SEO yang menarik dan bebas clickbait berlebih."
            },
            searchIntent: {
              type: Type.OBJECT,
              description: "Hasil analisa search intent pembaca.",
              required: ["intentType", "explanation", "formattingStyleNeeded"],
              properties: {
                intentType: {
                  type: Type.STRING,
                  description: "Tipe intent: informational, transactional, navigational, atau commercial."
                },
                explanation: {
                  type: Type.STRING,
                  description: "Alasan mengapa query keyword ini masuk ke tipe intent tersebut."
                },
                formattingStyleNeeded: {
                  type: Type.STRING,
                  description: "Bagaimana cara menyajikan konten ini (misal: Step-by-step list, Komparasi tabel, dsb)."
                }
              }
            },
            semanticCluster: {
              type: Type.ARRAY,
              description: "Daftar kata kunci semantik pendukung dan kesulitannya.",
              items: {
                type: Type.OBJECT,
                required: ["keyword", "searchVolumeDifficulty", "relevanceExplanation"],
                properties: {
                  keyword: { type: Type.STRING },
                  searchVolumeDifficulty: { type: Type.STRING },
                  relevanceExplanation: { type: Type.STRING }
                }
              }
            },
            outline: {
              type: Type.ARRAY,
              description: "Rencana kerangka artikel dengan heading level 2 atau 3.",
              items: {
                type: Type.OBJECT,
                required: ["heading", "level", "goals"],
                properties: {
                  heading: { type: Type.STRING },
                  level: { type: Type.INTEGER, description: "Heading level, 2 atau 3." },
                  goals: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Tujuan poin-poin yang dibahas di bawah heading ini."
                  }
                }
              }
            },
            articleMarkdown: {
              type: Type.STRING,
              description: "Artikel lengkap premium secara utuh (markdown). Wajib diisi panjang lengkap lengkap, berbobot, dengan pembahasan detail, analogi, contoh nyata, FAQ, dan CTA."
            },
            metaDescription: {
              type: Type.STRING,
              description: "Meta description optimal maksimal 150 karakter yang menarik CTR Google."
            },
            slug: {
              type: Type.STRING,
              description: "URL slug SEO-friendly dipisah tanda minus (huruf kecil)."
            },
            labels: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Label relevan untuk blogspot."
            },
            categories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Kategori niche relevan."
            },
            internalLinkingSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Saran topik internal link atau anchor text untuk dihubungkan."
            },
            seoScoreChecklist: {
              type: Type.ARRAY,
              description: "Evaluasi audit SEO artikel ini.",
              items: {
                type: Type.OBJECT,
                required: ["id", "label", "isPassed", "notes"],
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  isPassed: { type: Type.BOOLEAN },
                  notes: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    // Calculate simple metadata counts for UX
    const articleText = parsedResult.articleMarkdown || "";
    const wordCount = articleText.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.round(wordCount / 220));

    const finalResult = {
      ...parsedResult,
      wordCount,
      readingTime,
    };

    res.json(finalResult);
  } catch (error: any) {
    console.error("Gemini generation API error:", error);
    res.status(500).json({
      error: "Gagal menghasilkan artikel premium melalui Gemini. " + (error.message || "Error tidak dikenal.")
    });
  }
});

// Helper: Convert Markdown to HTML for Blogger layout post
function markdownToHtml(md: string): string {
  let html = md;
  // Simple conversion helper for rendering on Blogger
  // 1. Replace headers
  html = html.replace(/### (.*?)\n/g, '<h3>$1</h3>\n');
  html = html.replace(/## (.*?)\n/g, '<h2>$1</h2>\n');
  html = html.replace(/# (.*?)\n/g, '<h1>$1</h1>\n');
  
  // 2. Bold/Italics
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 3. Lists
  // Simple bullet lists
  html = html.replace(/^\s*[\-\*]\s+(.*)$/gm, '<li>$1</li>');
  // Wrap list items that are adjacents
  // We can do a rudimentary wrap
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>\n$1\n</ul>');
  // Avoid duplicating tags
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // 4. Paragraf (wrap any double return lines in paragraph tags if they aren't tag enclosed)
  const lines = html.split('\n');
  const paragraphLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('</h') || trimmed.startsWith('<ul') || trimmed.startsWith('</ul') || trimmed.startsWith('<li') || trimmed.startsWith('</li')) {
      return line;
    }
    return `<p>${trimmed}</p>`;
  });
  
  return paragraphLines.filter(Boolean).join('\n');
}

// API Route: Post to Blogspot (Google Blogger API)
app.post("/api/blogspot/post", async (req, res) => {
  const {
    title,
    contentMarkdown,
    labels,
    campaignId,
    useSandbox,
    blogspotUrl,
    accessToken,
    blogId,
    postingMode,
    scheduleTime,
  } = req.body;

  if (!title || !contentMarkdown) {
    return res.status(400).json({ error: "Judul dan artikel markdown diperlukan." });
  }

  const htmlContent = markdownToHtml(contentMarkdown);

  // SANBOX SIMULATED MODE (or fallback if oauth is missing)
  if (useSandbox || !accessToken || !blogId) {
    // Generate a beautiful simulated published URL
    const cleanUrl = blogspotUrl ? blogspotUrl.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "") : "premiumdemo.blogspot.com";
    const date = new Date(scheduleTime || Date.now());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Create clean URL Slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    const mockPostUrl = `https://${cleanUrl}/${year}/${month}/${slug}.html`;

    // Simulate delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return res.json({
      success: true,
      message: postingMode === "scheduled" ? "Artikel telah terjadwal di Blogger (Sandbox Mode)" : "Artikel berhasil dipublikasikan ke Blogger (Sandbox Mode)",
      postId: "mock_post_" + Math.random().toString(36).substr(2, 9),
      url: mockPostUrl,
      isSandbox: true,
      publishedAt: date.toISOString(),
      status: postingMode === "scheduled" ? "scheduled" : "published"
    });
  }

  // REAL BLOGGER API integration
  try {
    // Check if blogId or accessToken is valid
    // Blogger API endpoint: POST https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts
    const requestBody: any = {
      kind: "blogger#post",
      title: title,
      content: htmlContent,
      labels: labels || [],
    };

    if (postingMode === "scheduled" && scheduleTime) {
      requestBody.published = new Date(scheduleTime).toISOString();
    }

    const isDraft = postingMode === "draft";
    const bloggerUrl = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?isDraft=${isDraft}`;

    const bloggerResponse = await fetch(bloggerUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!bloggerResponse.ok) {
      const errorData = await bloggerResponse.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || `HTTP error ${bloggerResponse.status}`;
      return res.status(400).json({
        error: `Gagal memposting ke Blogger API: ${errorMsg}. Pastikan Access Token OAuth Anda masih aktif atau beralih ke Sandbox Mode.`
      });
    }

    const data = await bloggerResponse.json();
    return res.json({
      success: true,
      message: isDraft ? "Artikel berhasil disimpan sebagai Draft di Blogger!" : (postingMode === "scheduled" ? "Artikel berhasil dijadwalkan di Blogger!" : "Artikel premium berhasil dipublikasikan langsung ke Blogspot Anda!"),
      postId: data.id,
      url: data.url,
      isSandbox: false,
      publishedAt: data.published,
      status: isDraft ? "draft" : (postingMode === "scheduled" ? "scheduled" : "published")
    });

  } catch (error: any) {
    console.error("Real Blogger API posting error:", error);
    res.status(500).json({
      error: "Internal Server Error saat memproses posting Blogger API: " + error.message
    });
  }
});


// Handle Google OAuth client flow redirection simulation / credential exchanges
// Simply helper routes if needed
app.get("/api/blogger/userInfo", async (req, res) => {
  const token = req.query.accessToken;
  if (!token) {
    return res.status(401).json({ error: "Access token is required" });
  }

  try {
    // Request list of blogs for verified user
    const response = await fetch("https://www.googleapis.com/blogger/v3/users/self/blogs", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return res.status(400).json({ error: "OAuth access token tidak valid atau kadaluarsa." });
    }

    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Configure Vite Development Server Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets compiled inside /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BlogForge AI Server] Berjalan pada http://localhost:${PORT}`);
  });
}

startServer();
