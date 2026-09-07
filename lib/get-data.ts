import { redis } from './redis';
import fallbackData from '@/data/content.json';

export interface ModuleItem {
  id: string;
  name: string;
  description: string;
  accent: 'chartreuse' | 'coral' | 'ink' | string;
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
  const fallback = fallbackData as unknown as SvanthamData;
  if (!redis) {
    return fallback;
  }

  try {
    const raw = await redis.get('svantham_data');
    if (!raw) {
      return fallback;
    }

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const mergedData = { ...fallback, ...data };

    return {
      ...mergedData,
      content: { ...fallback.content, ...(data.content || {}) },
      modules: Array.isArray(data.modules) && data.modules.length > 0 ? data.modules : fallback.modules,
      deploymentCards: Array.isArray(data.deploymentCards) && data.deploymentCards.length > 0 ? data.deploymentCards : fallback.deploymentCards,
      ticker: Array.isArray(data.ticker) && data.ticker.length > 0 ? data.ticker : fallback.ticker,
      tailoredPortfolio: Array.isArray(data.tailoredPortfolio) && data.tailoredPortfolio.length > 0 ? data.tailoredPortfolio : fallback.tailoredPortfolio || [],
      products: { ...(fallback.products || {}), ...(data.products || {}) },
    };
  } catch (err) {
    console.warn('Failed to read from Upstash Redis, using fallback data/content.json:', err);
    return fallback;
  }
}

