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

export interface ProductData {
  hero_eyebrow: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_title_highlight: string;
  hero_desc: string;
  comp_title: string;
  comp_cloud_title: string;
  comp_sv_title: string;
  pricing_tag: string;
  pricing_title: string;
  pricing_desc: string;
  pricing_price: string;
  pricing_period: string;
  pricing_btn: string;
  features: Array<{ title: string; desc: string }>;
  comp_cloud_points: string[];
  comp_sv_points: string[];
  images: string[];
}

export interface SvanthamData {
  content: Record<string, string>;
  modules: ModuleItem[];
  deploymentCards: DeploymentCardItem[];
  ticker: string[];
  tailoredPortfolio?: any[];
  products: Record<string, ProductData>;
  [key: string]: any;
}

export async function getSvanthamData(): Promise<SvanthamData> {
  try {
    const raw = await redis?.get('svantham_data');

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

    return {
      content: { ...(data.content || {}) },
      modules: data.modules || [],
      deploymentCards: data.deploymentCards || [],
      ticker: data.ticker || [],
      tailoredPortfolio: data.tailoredPortfolio || [],
      products: { ...(data.products || {}) },
    };
  } catch (err) {
    console.warn('Failed to read from Upstash Redis', err);
    return {} as SvanthamData;
  }
}

