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

export async function getSvanthamData(): Promise<SvanthamData> {
  try {
    const raw = await redis?.get('svantham_data');

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

    return {
      content: { ...(data?.content || {}) },
      modules: data?.modules || [],
      deploymentCards: data?.deploymentCards || [],
      ticker: data?.ticker || [],
      tailoredPortfolio: data?.tailoredPortfolio || [],
      products: { ...(data?.products || {}) },
    };
  } catch (err) {
    console.warn('Failed to read from Upstash Redis', err);
    return {} as SvanthamData;
  }
}
