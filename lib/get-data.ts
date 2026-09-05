import { redis } from './redis';
import fallbackData from '@/data/content.json';

export interface ModuleItem {
  id: string;
  code: string;
  name: string;
  eyebrow: string;
  description: string;
  context: string;
  features: string[];
  tags: string[];
  accent: 'chartreuse' | 'coral' | 'ink' | string;
  image?: string;
}

export interface DashboardViewItem {
  id: string;
  tabLabel: string;
  badge: string;
  statusText: string;
  subtitle: string;
  heading: string;
  metric1: {
    label: string;
    val: string;
    sub: string;
  };
  metric2: {
    label: string;
    val: string;
    sub: string;
  };
  chartTitle: string;
  chartSubtitle: string;
  activity1: {
    title: string;
    subtitle: string;
    type: string;
  };
  activity2: {
    title: string;
    subtitle: string;
    type: string;
  };
}

export interface DeploymentCardItem {
  code: string;
  title: string;
  description: string;
}

export interface SvanthamData {
  content: Record<string, string>;
  modules: ModuleItem[];
  dashboardViews: DashboardViewItem[];
  deploymentCards: DeploymentCardItem[];
  ticker: string[];
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

    return {
      content: { ...fallback.content, ...(data.content || {}) },
      modules: Array.isArray(data.modules) && data.modules.length > 0 ? data.modules : fallback.modules,
      dashboardViews: Array.isArray(data.dashboardViews) && data.dashboardViews.length > 0 ? data.dashboardViews : fallback.dashboardViews,
      deploymentCards: Array.isArray(data.deploymentCards) && data.deploymentCards.length > 0 ? data.deploymentCards : fallback.deploymentCards,
      ticker: Array.isArray(data.ticker) && data.ticker.length > 0 ? data.ticker : fallback.ticker,
    };
  } catch (err) {
    console.warn('Failed to read from Upstash Redis, using fallback data/content.json:', err);
    return fallback;
  }
}
