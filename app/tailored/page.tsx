import React from 'react';
import { getSvanthamData } from '@/lib/get-data';
import TailoredClient from './TailoredClient';

export async function generateMetadata() {
  const data = await getSvanthamData();
  return {
    title: data.content.tailored_metaTitle || "Svantham Tailored",
    description: data.content.tailored_metaDescription || "",
    openGraph: {
      title: data.content.tailored_metaOgTitle || data.content.tailored_metaTitle || "Svantham Tailored",
      description: data.content.tailored_metaOgDescription || data.content.tailored_metaDescription || "",
      images: [
        {
          url: data.content.tailored_ogImageUrl || "https://r2.svantham.in/logos/logo.webp",
          width: 1200,
          height: 630,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.content.tailored_metaOgTitle || data.content.tailored_metaTitle || "Svantham Tailored",
      description: data.content.tailored_metaOgDescription || data.content.tailored_metaDescription || "",
      images: [data.content.tailored_ogImageUrl || "https://r2.svantham.in/logos/logo.webp"],
    }
  };
}

export default async function TailoredPage() {
  const data = await getSvanthamData();
  return <TailoredClient data={data} />;
}
