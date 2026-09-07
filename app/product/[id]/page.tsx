import React from 'react';
import Link from 'next/link';
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
  
  if (id === 'poss') {
    return <ClientLayout id={id} content={data.content} moduleData={moduleData} />;
  }

  // Return the WIP Page for all other products
  const productId = id.toUpperCase();
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--background)',
      color: 'var(--foreground)',
      fontFamily: "'IBM Plex Mono', monospace",
      position: 'relative'
    }}>
      <Link href="/" style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--muted-foreground)',
        textDecoration: 'none'
      }}>
        <ArrowLeft size={16} /> Back to Suite
      </Link>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        <div className="crane-container">
          <div className="crane-tower"></div>
          <div className="crane-arm"></div>
          <div className="crane-cable">
            <div className="crane-hook">
              <div className="crane-load"></div>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '0.05em' }}>
            SVANTHAM / {productId}
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Building in progress...</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .crane-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 20px;
        }
        .crane-tower {
          position: absolute;
          bottom: 0;
          left: 20px;
          width: 8px;
          height: 80px;
          background: var(--chartreuse);
        }
        .crane-arm {
          position: absolute;
          bottom: 80px;
          left: 10px;
          width: 80px;
          height: 8px;
          background: var(--chartreuse);
        }
        .crane-cable {
          position: absolute;
          top: 20px;
          right: 15px;
          width: 2px;
          height: 40px;
          background: var(--chartreuse);
          transform-origin: top;
          animation: swing 2s ease-in-out infinite alternate;
        }
        .crane-hook {
          position: absolute;
          bottom: -8px;
          left: -4px;
          width: 10px;
          height: 10px;
          border: 2px solid var(--chartreuse);
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .crane-load {
          position: absolute;
          top: 8px;
          left: -4px;
          width: 14px;
          height: 14px;
          background: var(--coral);
          border-radius: 2px;
        }
        @keyframes swing {
          0% { transform: rotate(-25deg); }
          100% { transform: rotate(25deg); }
        }
      `}} />
    </div>
  );
}
