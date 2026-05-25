export interface GeneralInputs {
  niche: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  blogspotUrl: string;
  category: string;
  label: string;
  language: string; // 'id' | 'en' | etc.
  articleLength: string; // 'short' (800 words), 'medium' (1500 words), 'long' (2500+ words)
  writingStyle: string; // 'analytical' | 'kredibel' | 'step-by-step' | 'strategis' | 'edukatif' | 'conversational'
  targetCountry: string;
  targetAudience: string;
  postingMode: string; // 'draft' | 'instant' | 'scheduled'
  scheduleTime?: string;
  humanizeStrength: number; // 0 to 100
}

export interface SearchIntentResult {
  intentType: 'informational' | 'transactional' | 'navigational' | 'commercial';
  explanation: string;
  formattingStyleNeeded: string; // e.g. "Step-by-step tutorial", "Comparison chart", "Solution-first CTA"
}

export interface OutlineItem {
  heading: string;
  level: 2 | 3;
  goals: string[];
}

export interface SemanticCluster {
  keyword: string;
  searchVolumeDifficulty: string; // e.g. "High Intent / Low Diff"
  relevanceExplanation: string;
}

export interface SEOChecklistItem {
  id: string;
  label: string;
  isPassed: boolean;
  notes: string;
}

export interface BlogForgeResult {
  title: string;
  searchIntent: SearchIntentResult;
  semanticCluster: SemanticCluster[];
  outline: OutlineItem[];
  articleMarkdown: string; // Contains Judul, Hook, H2, H3, FAQ, Kesimpulan, CTA
  metaDescription: string;
  slug: string;
  labels: string[];
  categories: string[];
  internalLinkingSuggestions: string[];
  seoScoreChecklist: SEOChecklistItem[];
  readingTime: number; // in minutes
  wordCount: number;
}

export interface BloggerAccount {
  connected: boolean;
  blogName?: string;
  blogUrl?: string;
  blogId?: string;
  accessToken?: string;
  useSandbox: boolean;
}

export interface CampaignHistoryItem {
  id: string;
  inputs: GeneralInputs;
  result: BlogForgeResult;
  createdAt: string;
  status: 'draft' | 'published' | 'scheduled';
  publishUrl?: string;
  bloggerPostId?: string;
  scheduledFor?: string;
}
