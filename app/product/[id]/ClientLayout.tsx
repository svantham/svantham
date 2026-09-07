'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ClientLayout({ id, content, data, moduleData }: { id: string; content: any; data?: any; moduleData: any }) {
  const accentKey = moduleData?.accent || 'chartreuse';
  let accentColor = '#b8ef3e';
  if (accentKey === 'coral') accentColor = '#ff6b6b';
  else if (accentKey === 'ink') accentColor = '#4a90e2';

  const productData = data?.products?.[id] || {};
  const getVal = (key: string) => productData[key] || '';
  const getArr = (key: string) => {
    if (Array.isArray(productData[key])) return productData[key];
    return [];
  };

  const eyebrow = getVal('hero_eyebrow');
  const title1 = getVal('hero_title_1');
  const title2 = getVal('hero_title_2');
  const titleHighlight = getVal('hero_title_highlight');
  const desc = getVal('hero_desc');

  const features = getArr('features') as Array<{title: string, desc: string}>;
  const comp_title = getVal('comp_title');
  const comp_cloud_title = getVal('comp_cloud_title');
  const comp_sv_title = getVal('comp_sv_title');
  const comp_cloud_points = getArr('comp_cloud_points') as string[];
  const comp_sv_points = getArr('comp_sv_points') as string[];

  const pricing_tag = getVal('pricing_tag');
  const pricing_title = getVal('pricing_title');
  const pricing_desc = getVal('pricing_desc');
  const pricing_price = getVal('pricing_price');
  const pricing_period = getVal('pricing_period');
  const pricing_btn = getVal('pricing_btn');

  const images = getArr('images') as string[];

  const [imageDims, setImageDims] = useState<Record<number, { width: number; height: number; ratio: number }>>({});
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Helper to resolve images if they're not full URLs
  const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('/')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://r2.svantham.in';
    return `${baseUrl}/images/${url}`;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!images || images.length === 0) return;
    images.forEach((url, idx) => {
      const src = resolveImageUrl(url);
      if (!src) return;
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setImageDims((prev) => {
          if (prev[idx]?.width === img.naturalWidth && prev[idx]?.height === img.naturalHeight) return prev;
          return {
            ...prev,
            [idx]: {
              width: img.naturalWidth,
              height: img.naturalHeight,
              ratio: img.naturalWidth / img.naturalHeight,
            },
          };
        });
      };
    });
  }, [images]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".pos-hero-title", 
      { y: 50, opacity: 0, rotationX: -20 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1, ease: "back.out(1.7)" }
    );

    gsap.fromTo(".pos-hero-desc",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" }
    );

    const cards = gsap.utils.toArray('.reveal-card');
    cards.forEach((card: any, i) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          },
          y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: "power3.out"
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main className="product-page-wrapper" style={{ backgroundColor: '#0e100b', minHeight: '100vh', color: '#f8f7f1', overflowX: 'hidden' }}>
      
      <nav style={{ padding: '24px 40px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'linear-gradient(to bottom, rgba(14,16,11,0.9), transparent)' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <ArrowLeft size={16} /> Back to Svantham
        </Link>
      </nav>

      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '120px 24px 40px' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 30%, ${accentColor}1A 0%, transparent 60%)`, zIndex: 0, pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', zIndex: 1 }}>
          <div style={{ display: 'inline-block', padding: '6px 12px', border: `1px solid ${accentColor}`, borderRadius: '100px', color: accentColor, fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '24px' }}>{eyebrow}</div>
          <h1 className="pos-hero-title" style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '800', marginBottom: '24px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            {title1}{title2 && <br/>}{title2}{titleHighlight && <br/>}<span style={{ color: accentColor }}>{titleHighlight}</span>
          </h1>
          <p className="pos-hero-desc" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            {desc}
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {features.map((feat, idx) => (
            <div key={idx} className="reveal-card" style={{ background: '#12140f', padding: '40px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', fontWeight: 'bold', color: `${accentColor}33`, position: 'absolute', top: '24px', right: '24px', lineHeight: '1' }}>0{idx + 1}</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', marginTop: '24px' }}>{feat.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{feat.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {images && images.length > 0 ? (
        <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '28px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {images.map((img, idx) => {
              // Dynamically calculate the optimal card size based on the image's own dimensions.
              const dim = imageDims[idx];
              const ratio = dim?.ratio || (idx % 2 === 0 ? 1.78 : 1.28);
              const BASE_HEIGHT = 340;

              let targetWidth: number;
              let targetHeight: number = BASE_HEIGHT;

              if (ratio >= 1.6) {
                // Wide / panoramic UI (16:9, 16:10, 21:9) -> wide landscape card (~580-620px)
                targetWidth = Math.min(620, Math.round(BASE_HEIGHT * ratio));
                targetHeight = Math.round(targetWidth / ratio);
              } else if (ratio >= 1.15) {
                // Standard 4:3 / 3:2 screen -> compact card (~420-460px)
                targetWidth = Math.min(460, Math.round(BASE_HEIGHT * ratio));
                targetHeight = Math.round(targetWidth / ratio);
              } else {
                // Portrait / mobile app view -> narrow card (~200-280px)
                targetHeight = Math.min(380, Math.max(300, Math.round(260 / ratio)));
                targetWidth = Math.min(300, Math.round(targetHeight * ratio));
              }

              return (
                <div
                  key={idx}
                  className="reveal-card group"
                  onClick={() => setActiveModalImage(resolveImageUrl(img))}
                  style={{
                    width: `min(100%, ${targetWidth}px)`,
                    background: '#12140f',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    cursor: 'zoom-in',
                    position: 'relative',
                    boxShadow: '0 16px 36px -8px rgba(0,0,0,0.6)',
                    transition: 'border-color 0.25s ease, transform 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${accentColor}55`;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img
                    src={resolveImageUrl(img)}
                    alt={`Screenshot ${idx + 1}`}
                    loading="lazy"
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget;
                      if (naturalWidth && naturalHeight) {
                        setImageDims((prev) => {
                          if (prev[idx]?.width === naturalWidth && prev[idx]?.height === naturalHeight) return prev;
                          return {
                            ...prev,
                            [idx]: {
                              width: naturalWidth,
                              height: naturalHeight,
                              ratio: naturalWidth / naturalHeight,
                            },
                          };
                        });
                      }
                    }}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: `${targetHeight}px`,
                      display: 'block',
                      objectFit: 'contain',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.08em',
                      pointerEvents: 'none',
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    EXPAND ↗
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-card" style={{ width: '100%', aspectRatio: '16/9', background: '#0a0b08', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>[ PRODUCT VIDEO / UI DEMO PLACEHOLDER ]</span>
          </div>
        </section>
      )}

      <section className="vs-comp-section" style={{ padding: '120px 24px', marginTop: '40px', background: '#0a0b08', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: '800', letterSpacing: '-0.04em', marginBottom: '64px', textAlign: 'center' }}>
            {comp_title}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div style={{ padding: '40px', border: '1px solid rgba(255, 107, 107, 0.2)', background: 'rgba(255, 107, 107, 0.02)', borderRadius: '2px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '24px', background: '#ff6b6b', color: '#000', padding: '4px 12px', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', letterSpacing: '0.1em' }}>{comp_cloud_title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {comp_cloud_points.map((pt: string, idx: number) => (
                  <li key={idx} style={{ display: 'flex', gap: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
                    <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>✗</span> {pt}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ padding: '40px', border: `2px solid ${accentColor}`, background: `${accentColor}08`, borderRadius: '2px', position: 'relative', boxShadow: `0 0 40px ${accentColor}0D` }}>
              <div style={{ position: 'absolute', top: '-12px', left: '24px', background: accentColor, color: '#000', padding: '4px 12px', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', letterSpacing: '0.1em' }}>{comp_sv_title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {comp_sv_points.map((pt: string, idx: number) => (
                  <li key={idx} style={{ display: 'flex', gap: '16px', color: '#f8f7f1', fontSize: '15px', fontWeight: '500' }}>
                    <span style={{ color: accentColor, fontWeight: 'bold' }}>✓</span> {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '120px 24px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <div className="reveal-card" style={{ background: '#12140f', border: `1px solid ${accentColor}`, borderRadius: '2px', padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 16px', background: accentColor, color: '#000', fontWeight: 'bold', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.1em' }}>{pricing_tag}</div>
          
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>{pricing_title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px' }}>{pricing_desc}</p>
          
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '64px', fontWeight: '900', letterSpacing: '-0.04em' }}>{pricing_price}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>{pricing_period}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '2px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <ShieldCheck size={14} color={accentColor} /> Unlimited users
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '2px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <ShieldCheck size={14} color={accentColor} /> Free updates
            </div>
          </div>

          <button style={{ background: accentColor, color: '#000', border: 'none', padding: '16px 32px', borderRadius: '2px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'transform 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            {pricing_btn}
          </button>
        </div>
      </section>

      {/* Expandable Image Modal / Lightbox */}
      {activeModalImage && (
        <div
          onClick={() => setActiveModalImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'zoom-out',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '96vw',
              maxHeight: '92vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalImage(null)}
              style={{
                position: 'absolute',
                top: '-44px',
                right: '0',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '100px',
                padding: '6px 14px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <X size={14} /> CLOSE (ESC)
            </button>
            <img
              src={activeModalImage}
              alt="Enlarged view"
              style={{
                maxWidth: '96vw',
                maxHeight: '88vh',
                width: 'auto',
                height: 'auto',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}

    </main>
  );
}
