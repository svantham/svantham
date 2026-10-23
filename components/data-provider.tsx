'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import type { SvanthamData } from '@/lib/get-data';

const DataContext = createContext<SvanthamData | null>(null);

export function DataProvider({ data, children }: { data: SvanthamData, children: ReactNode }) {
  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  return context || ({} as SvanthamData);
}

export function useContent(key: string, fallback: string) {
  const data = useData();
  return data?.content?.[key] || fallback;
}
