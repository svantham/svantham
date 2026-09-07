import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSvanthamData } from '@/lib/get-data';
import ClientLayout from './ClientLayout';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id.toLowerCase();
  const data = await getSvanthamData();
  const moduleData = data.modules.find(m => m.id === id) || null;
  const title = `Svantham ${moduleData?.name || id.toUpperCase()}`;
  return {
    title,
    robots: id !== 'poss' ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      images: [
        {
          url: data.content.seo_og_image || '/logo.png',
          width: 1200,
          height: 630,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [data.content.seo_og_image || '/logo.png'],
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id.toLowerCase();
  const data = await getSvanthamData();
  
  const moduleData = data.modules.find(m => m.id === id) || null;
  
  if (!moduleData) {
    notFound();
  }
  
  return <ClientLayout id={id} content={data.content} data={data} moduleData={moduleData} />;
}
