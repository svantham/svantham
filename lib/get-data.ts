import { redis } from './redis';

export interface ModuleItem {
  id: string;
  name: string;
  description: string;
  accent: 'chartreuse' | 'coral' | 'ink' | 'sky' | 'violet' | 'amber' | string;
  image?: string;
}

export interface DeploymentCardItem {
  code: string;
  title: string;
  description: string;
}

export interface TailoredProjectItem {
  id: string;
  title: string;
  name?: string;
  category: 'Software' | 'Content' | 'Digital marketing' | string;
  client?: string;
  client_name?: string;
  client_logo?: string;
  clientLogo?: string;
  shortDescription?: string;
  short_description?: string;
  images: string[];
  image?: string;
  scope?: string[] | string;
  [key: string]: any;
}

export interface ProductData {
  hero_eyebrow?: string;
  hero_title_1?: string;
  hero_title_2?: string;
  hero_desc?: string;
  hero_btn_features?: string;
  hero_btn_pricing?: string;
  hero_pricing_note?: string;
  hero_sec_title?: string;
  hero_sec_subtitle?: string;
  highlights?: Array<{ title: string; desc: string }>;
  features?: Array<{ title: string; desc: string }>;
  built_around?: string;
  comp_title?: string;
  comp_desc?: string;
  benefits?: Array<{ title: string; copy: string }>;
  video_url?: string;
  images?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  [key: string]: any;
}

export interface SvanthamData {
  content: Record<string, string>;
  modules: ModuleItem[];
  deploymentCards: DeploymentCardItem[];
  ticker: string[];
  tailoredPortfolio?: TailoredProjectItem[];
  products: Record<string, ProductData>;
  [key: string]: any;
}

let memoryCache: { data: SvanthamData; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export function invalidateSvanthamCache() {
  memoryCache = null;
}

export async function getSvanthamData(): Promise<SvanthamData> {
  if (memoryCache && (Date.now() - memoryCache.timestamp < CACHE_TTL_MS)) {
    return memoryCache.data;
  }

  try {
    const raw = await redis?.get('svantham_data');

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

    const result: SvanthamData = {
      content: { ...(data?.content || {}) },
      modules: data?.modules || [],
      deploymentCards: data?.deploymentCards || [],
      ticker: data?.ticker || [],
      tailoredPortfolio: data?.tailoredPortfolio || [],
      products: { ...(data?.products || {}) },
    };

    memoryCache = {
      data: result,
      timestamp: Date.now(),
    };

    return result;
  } catch (err) {
    console.warn('Failed to read from Upstash Redis', err);
    if (memoryCache) return memoryCache.data;
    return {} as SvanthamData;
  }
}
