'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ClientLayout({ id, content, moduleData }: { id: string; content: any; moduleData: any }) {
  const accentKey = moduleData?.accent || 'chartreuse';
  let accentColor = '#b8ef3e';
  if (accentKey === 'coral') accentColor = '#ff6b6b';
  else if (accentKey === 'ink') accentColor = '#4a90e2';

  const getVal = (key: string, fallback: string) => content[`${id}_${key}`] || fallback;

  const eyebrow = getVal('hero_eyebrow', moduleData?.eyebrow || 'PRODUCT');
  const title1 = getVal('hero_title_1', moduleData?.name || id.toUpperCase());
  const title2 = getVal('hero_title_2', '');
  const titleHighlight = getVal('hero_title_highlight', '');
  const desc = getVal('hero_desc', moduleData?.context || '');

  const feat1_title = getVal('feat1_title', moduleData?.features?.[0] || 'Feature 1');
  const feat1_desc = getVal('feat1_desc', 'High performance capability.');
  const feat2_title = getVal('feat2_title', moduleData?.features?.[1] || 'Feature 2');
  const feat2_desc = getVal('feat2_desc', 'Seamless integration.');
  const feat3_title = getVal('feat3_title', moduleData?.features?.[2] || 'Feature 3');
  const feat3_desc = getVal('feat3_desc', 'Zero compromises.');

  const comp_title = getVal('comp_title', 'Why We Crush The Competition.');
  const comp_cloud_title = getVal('comp_cloud_title', 'Typical SaaS');
  const comp_sv_title = getVal('comp_sv_title', `Svantham ${moduleData?.name || 'Product'}`);
  
  const comp_cloud_points = content[`${id}_comp_cloud_points`] || [
    'Internet down? Sales stop.',
    'Heavy monthly recurring costs.',
    'Data hosted on foreign servers.'
  ];
  const comp_sv_points = content[`${id}_comp_sv_points`] || [
    '100% offline-capable checkout.',
    'Zero artificial user limits.',
    'Data stays firmly in your control.'
  ];

  const pricing_tag = getVal('pricing_tag', 'NO HIDDEN FEES');
  const pricing_title = getVal('pricing_title', 'Simple, Predictable Pricing');
  const pricing_desc = getVal('pricing_desc', "We don't punish your success. Pay a flat yearly rate.");
  const pricing_price = getVal('pricing_price', '₹3,000');
  const pricing_period = getVal('pricing_period', '/ year');
  const pricing_btn = getVal('pricing_btn', 'Book a Demo');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".pos-hero-title", 
      { y: 50, opacity: 0, rotationX: -20 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1, ease: "back.out(1.7)" }
    );

    gsap.fromTo(".pos-hero-desc",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
    );

    gsap.utils.toArray('.reveal-card').forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.1
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
          
          <div className="reveal-card" style={{ background: '#12140f', padding: '40px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', fontWeight: 'bold', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '24px', right: '24px', lineHeight: '1' }}>01</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', marginTop: '24px' }}>{feat1_title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{feat1_desc}</p>
          </div>

          <div className="reveal-card" style={{ background: '#12140f', padding: '40px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', fontWeight: 'bold', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '24px', right: '24px', lineHeight: '1' }}>02</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', marginTop: '24px' }}>{feat2_title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{feat2_desc}</p>
          </div>

          <div className="reveal-card" style={{ background: '#12140f', padding: '40px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', fontWeight: 'bold', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '24px', right: '24px', lineHeight: '1' }}>03</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', marginTop: '24px' }}>{feat3_title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{feat3_desc}</p>
          </div>

        </div>
      </section>

      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="reveal-card" style={{ width: '100%', aspectRatio: '16/9', background: '#0a0b08', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>[ PRODUCT VIDEO / UI DEMO PLACEHOLDER ]</span>
        </div>
      </section>

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

    </main>
  );
}
