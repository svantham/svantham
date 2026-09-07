'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowDownRight,
  Check,
  Zap,
  Menu,
  X,
  MessageSquare,
  Users,
  ArrowDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SvanthamData } from '@/lib/get-data';



function ArrowUpRightIcon() {
  return <ArrowRight size={16} className="row-arrow" />;
}

export default function HomeClient({ initialData }: { initialData: SvanthamData }) {
  const router = useRouter();
  const [data] = useState<SvanthamData>(initialData);
  const { content, modules, dashboardViews, deploymentCards, ticker } = data;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const [infraIndex, setInfraIndex] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactMessage, setContactMessage] = useState('');


  const [calcUsers, setCalcUsers] = useState(20);
  const [calcYears, setCalcYears] = useState(2);

  const userOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Active items
  const activeDash = dashboardViews[activeDeckIndex] || dashboardViews[0];

  const saasRatePerMonth = 800;
  const saasTotal = calcUsers * saasRatePerMonth * 12 * calcYears;

  // Svantham pricing: tiered
  let svanthamBase = 0;
  if (calcYears === 1) svanthamBase = 25000;
  else if (calcYears === 2) svanthamBase = 45000;
  else if (calcYears === 3) svanthamBase = 65000;
  else if (calcYears === 4) svanthamBase = 80000;
  else if (calcYears === 5) svanthamBase = 100000;

  const amcTotal = 10000 * calcYears;
  const svanthamTotal = svanthamBase + amcTotal;

  const costDifference = saasTotal - svanthamTotal;

  // Scroll Reveal & 3D Rotating Stack Timer
  useEffect(() => {
    document.documentElement.classList.add('has-js');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            entry.target.setAttribute('data-visible', 'true');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal, .text-reveal').forEach((el) => observer.observe(el));

    // Auto rotate the deployment stack every 3.5 seconds
    const infraInterval = setInterval(() => {
      setInfraIndex((prev) => (prev + 1) % (deploymentCards.length || 3));
    }, 3500);

    // Auto rotate the dashboard deck every 4.5 seconds
    const dashboardInterval = setInterval(() => {
      setActiveDeckIndex((prev) => (prev + 1) % (dashboardViews.length || 3));
    }, 4500);

    return () => {
      observer.disconnect();
      clearInterval(infraInterval);
      clearInterval(dashboardInterval);
    };
  }, [deploymentCards.length, dashboardViews.length]);

  const handleWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = content.contact_whatsapp_number || '917845299722';
    const text = encodeURIComponent(
      `Hi Svantham Team,\n\nI'm ${contactName || 'an operator'} from ${contactCompany || 'my company'}.\n\n${contactMessage || "I'd like to schedule a demo of Svantham."}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setContactModalOpen(false);
  };

  return (
    <main className="svantham-page">
      {/* Navigation */}
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#top" className="wordmark" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.svg" alt={content.nav_logo} style={{ height: '48px', width: 'auto' }} />
        </a>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#suite" onClick={() => setMenuOpen(false)}>
            {content.nav_suite}
          </a>
          <a href="#why" onClick={() => setMenuOpen(false)}>
            {content.nav_why}
          </a>
          <a
            href="#deployments"
            onClick={() => {
              setMenuOpen(false);
              setContactModalOpen(true);
            }}
            className="nav-cta"
          >
            {content.nav_cta} <ArrowUpRightIcon />
          </a>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="kicker reveal">
            <span className="kicker-line" /> {content.hero_kicker}
          </p>
          <h1 className="reveal reveal-delay-1">
            {content.hero_title_line1}
            <br />
            <span>{content.hero_title_highlight}</span>
          </h1>
          <p
            className="hero-description reveal reveal-delay-2"
            dangerouslySetInnerHTML={{ __html: content.hero_description.replace('no artificial limits', '<span style="color: var(--coral); font-weight: bold;">no artificial limits</span>') }}
          />
          <div className="hero-actions reveal reveal-delay-3">
            <a className="button button-dark" href="#suite">
              {content.hero_cta_primary} <ArrowRight size={17} />
            </a>
            <a className="text-link" href="#why">
              {content.hero_cta_secondary} <ArrowDownRight size={16} />
            </a>
          </div>
        </div>

        {/* Hero Visual: Stacked Dashboard Deck */}
        <div className="hero-visual reveal reveal-delay-2">
          <div className="visual-tag tag-one">
            {content.hero_tag_one_top}
            <br />
            <b>{content.hero_tag_one_bottom}</b>
          </div>
          <div className="visual-tag tag-two">
            {content.hero_tag_two_top}
            <br />
            <b>{content.hero_tag_two_bottom}</b>
          </div>

          <div className="dashboard-deck-container">

            {/* Background Peeking Card (3D Stacking depth) */}
            <div className="dashboard-card peek-under" aria-hidden="true" />

            {/* Active Card Foreground */}
            <div className="dashboard-card" aria-label={`Svantham ${activeDash.badge} preview`}>
              {activeDash.id === 'crm' ? (
                <div className="crm-dashboard-layout">
                  <div className="dashboard-topline">
                    <span className="mono-label">{activeDash.badge}</span>
                    <span className="status-dot coral-dot">
                      <i /> {activeDash.statusText}
                    </span>
                  </div>
                  <div className="dashboard-title-row">
                    <div>
                      <span className="mono-label muted">{activeDash.subtitle}</span>
                      <h3>{activeDash.heading}</h3>
                    </div>
                    <div className="avatar coral-avatar"><MessageSquare size={16} /></div>
                  </div>
                  <div className="dashboard-grid crm-grid">
                    <div className="chart-tile full-width-chart" style={{ gridColumn: '1 / -1' }}>
                      <div className="tile-heading">
                        <span>{activeDash.chartTitle}</span>
                        <span className="chart-key coral-key">
                          <i /> {activeDash.chartSubtitle}
                        </span>
                      </div>
                      <svg viewBox="0 0 430 95" role="img" aria-label="WhatsApp message stream chart" preserveAspectRatio="none">
                        <path d="M0 75 C45 60 70 85 110 50 S180 80 220 35 S290 60 340 25 S390 45 430 12" fill="none" stroke="currentColor" strokeWidth="3.5" />
                        <path d="M0 75 C45 60 70 85 110 50 S180 80 220 35 S290 60 340 25 S390 45 430 12 V95 H0Z" fill="currentColor" opacity=".14" />
                      </svg>
                      <div className="chart-labels"><span>MON</span><span>WED</span><span>FRI</span><span>TODAY</span></div>
                    </div>
                    <div className="metric-tile coral-tile">
                      <span>{activeDash.metric1.label}</span>
                      <strong>{activeDash.metric1.val}</strong>
                      <em>{activeDash.metric1.sub}</em>
                    </div>
                    <div className="metric-tile dark-tile">
                      <span>{activeDash.metric2.label}</span>
                      <strong>{activeDash.metric2.val}</strong>
                      <em>{activeDash.metric2.sub}</em>
                    </div>
                  </div>
                </div>
              ) : activeDash.id === 'hrms' ? (
                <div className="hrms-dashboard-layout">
                  <div className="dashboard-topline">
                    <span className="mono-label">{activeDash.badge}</span>
                    <span className="status-dot blue-dot">
                      <i /> {activeDash.statusText}
                    </span>
                  </div>
                  <div className="dashboard-title-row">
                    <div>
                      <span className="mono-label muted">{activeDash.subtitle}</span>
                      <h3>{activeDash.heading}</h3>
                    </div>
                    <div className="avatar blue-avatar"><Users size={16} /></div>
                  </div>
                  <div className="dashboard-grid hrms-grid">
                    <div className="metric-tile blue-tile" style={{ gridColumn: '1 / -1' }}>
                      <span>{activeDash.metric1.label}</span>
                      <strong>{activeDash.metric1.val}</strong>
                      <em>{activeDash.metric1.sub}</em>
                    </div>
                    <div className="metric-tile dark-tile">
                      <span>{activeDash.metric2.label}</span>
                      <strong>{activeDash.metric2.val}</strong>
                      <em>{activeDash.metric2.sub}</em>
                    </div>
                    <div className="chart-tile">
                      <div className="tile-heading">
                        <span>{activeDash.chartTitle}</span>
                      </div>
                      <svg viewBox="0 0 430 95" role="img" aria-label="Floor attendance shifts" preserveAspectRatio="none">
                        <path d="M0 65 C50 50 90 70 140 40 S210 55 260 25 S330 40 380 18 S410 25 430 10" fill="none" stroke="currentColor" strokeWidth="3.5" />
                        <path d="M0 65 C50 50 90 70 140 40 S210 55 260 25 S330 40 380 18 S410 25 430 10 V95 H0Z" fill="currentColor" opacity=".14" />
                      </svg>
                      <div className="chart-labels"><span>SHIFT 1</span><span>SHIFT 2</span><span>SHIFT 3</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="poss-dashboard-layout">
                  <div className="dashboard-topline">
                    <span className="mono-label">{activeDash.badge}</span>
                    <span className="status-dot">
                      <i /> {activeDash.statusText}
                    </span>
                  </div>
                  <div className="dashboard-title-row">
                    <div>
                      <span className="mono-label muted">{activeDash.subtitle}</span>
                      <h3>{activeDash.heading}</h3>
                    </div>
                    <div className="avatar">AK</div>
                  </div>
                  <div className="dashboard-grid">
                    <div className="metric-tile lime-tile">
                      <span>{activeDash.metric1.label}</span>
                      <strong>{activeDash.metric1.val}</strong>
                      <em>{activeDash.metric1.sub}</em>
                    </div>
                    <div className="metric-tile dark-tile">
                      <span>{activeDash.metric2.label}</span>
                      <strong>{activeDash.metric2.val}</strong>
                      <em>{activeDash.metric2.sub}</em>
                    </div>
                    <div className="chart-tile" style={{ gridColumn: '1 / -1' }}>
                      <div className="tile-heading">
                        <span>{activeDash.chartTitle}</span>
                        <span className="chart-key">
                          <i /> {activeDash.chartSubtitle}
                        </span>
                      </div>
                      <svg viewBox="0 0 430 95" role="img" aria-label="Order velocity chart" preserveAspectRatio="none">
                        <path d="M0 80 C35 70 40 78 67 62 S108 78 139 50 S177 64 205 35 S243 55 270 28 S306 43 335 15 S371 34 430 5" fill="none" stroke="currentColor" strokeWidth="3.5" />
                        <path d="M0 80 C35 70 40 78 67 62 S108 78 139 50 S177 64 205 35 S243 55 270 28 S306 43 335 15 S371 34 430 5 V95 H0Z" fill="currentColor" opacity=".13" />
                      </svg>
                      <div className="chart-labels"><span>MON</span><span>WED</span><span>FRI</span><span>TODAY</span></div>
                    </div>
                  </div>
                  <div className="activity-row">
                    <span className="activity-icon"><Check size={15} /></span>
                    <div>
                      <strong>{activeDash.activity1.title}</strong>
                      <small>{activeDash.activity1.subtitle}</small>
                    </div>
                    <ArrowUpRightIcon />
                  </div>
                  <div className="activity-row">
                    <span className="activity-icon coral-icon"><Zap size={15} /></span>
                    <div>
                      <strong>{activeDash.activity2.title}</strong>
                      <small>{activeDash.activity2.subtitle}</small>
                    </div>
                    <ArrowUpRightIcon />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
        </div>

        <div className="scroll-indicator bouncing-scroll">
          <span>Scroll Down</span>
          <ArrowDown size={14} />
        </div>


      </section>

      {/* Benefits Ticker */}
      <section className="ticker" aria-label="Svantham benefits">
        <div className="ticker-track">
          <div className="ticker-content">
            {[...ticker, ...ticker, ...ticker, ...ticker].map((item, i) => (
              <React.Fragment key={i}>
                <span>{item}</span>
                <b>✦</b>
              </React.Fragment>
            ))}
          </div>
          {/* Double track for seamless loop */}
          <div className="ticker-content">
            {[...ticker, ...ticker, ...ticker, ...ticker].map((item, i) => (
              <React.Fragment key={`dup-${i}`}>
                <span>{item}</span>
                <b>✦</b>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Cost / Why Svantham Section */}
      <section className="cost-section section-shell" id="why">
        <div className="section-intro reveal">
          <p className="eyebrow">{content.cost_eyebrow}</p>
          <h2>
            {content.cost_title_line1}
            <br />
            <span>{content.cost_title_highlight}</span>
          </h2>
        </div>

        <div className="cost-story reveal reveal-delay-1">
          <p>{content.cost_story}</p>
          <a className="text-link" href="#suite">
            {content.cost_cta} <ArrowRight size={16} />
          </a>
        </div>

        <div className="comparison-table reveal reveal-delay-2">
          <div className="calculator-controls">
            <div className="calc-control-group">
              <div className="calc-header">
                <label>{content.calc_team_size_label}</label>
                <div className="calc-value">{calcUsers} <span>{content.calc_users_suffix}</span></div>
              </div>
              <input
                type="range"
                min="0"
                max={userOptions.length - 1}
                step="1"
                value={userOptions.indexOf(calcUsers)}
                onChange={(e) => setCalcUsers(userOptions[parseInt(e.target.value)])}
                className="custom-slider"
              />
            </div>
            <div className="calc-divider" />
            <div className="calc-control-group">
              <div className="calc-header">
                <label>{content.calc_timeframe_label}</label>
                <div className="calc-value">
                  {calcYears}<span> {calcYears > 1 ? content.calc_years_suffix : 'year'}</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={calcYears}
                onChange={(e) => setCalcYears(parseInt(e.target.value))}
                className="custom-slider"
              />
            </div>
          </div>

          <div className="comparison-head">
            <span>
              {content.cost_table_head_left}
            </span>
            <span>{`${calcYears}-YEAR BILL`}</span>
          </div>

          <div className="comparison-row">
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>{content.saas_row_title}</span>
              <span style={{ opacity: 0.6, fontSize: '11px', letterSpacing: '0', fontWeight: 'normal' }}>*Assumed SaaS rate: ₹{saasRatePerMonth}/user/mo</span>
            </span>
            <strong className="price-red price-align">
              {formatCurrency(saasTotal)}
            </strong>
          </div>

          <div className="comparison-row highlighted">
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {content.svantham_row_title}
              <span style={{ opacity: 0.6, fontSize: '11px', letterSpacing: '0', fontWeight: 'normal' }}>*Includes AMC</span>
            </span>
            <strong className="price-align">
              {formatCurrency(svanthamTotal)}
            </strong>
          </div>

          <div className="saving-badge">
            <Zap size={15} /> {content.calc_save_up_to} <b>{formatCurrency(Math.max(0, costDifference))}</b> {content.calc_over} {calcYears} {calcYears > 1 ? content.calc_years_suffix : 'year'}
          </div>
        </div>
      </section>

      {/* Dynamic Suite Section (NO module-icon) */}
      <section className="suite-section" id="suite">
        <div className="section-shell">
          <div className="suite-header reveal">
            <div>
              <p className="eyebrow">{content.suite_eyebrow}</p>
              <h2>
                {content.suite_title_line1}
                <br />
                <span>{content.suite_title_highlight}</span>
              </h2>
            </div>
            <p>{content.suite_description}</p>
          </div>

          {/* Dynamic Module Grid */}
          <div className="suite-module-grid">
            {modules.map((mod, index) => {
              return (
                <div
                  key={mod.id || mod.name}
                  onClick={() => router.push(`/product/${mod.id}`)}
                  className="suite-card-dynamic reveal"
                  style={{ transitionDelay: `${(index % 3) * 80}ms` }}
                >
                  <div className="suite-card-body">
                    <div className="suite-card-header">
                      <h3>{mod.name}</h3>
                      <span className="suite-card-arrow">↗</span>
                    </div>
                    <p className="desc-text">{mod.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tailored Custom Banner */}
          <div className="tailored-banner reveal" style={{ transitionDelay: '300ms' }}>
            <div className="tailored-banner-content">
              <h3>{content.toast_custom_made}</h3>
              <p>SVANTHAM / TAILORED</p>
            </div>
            <Link href="/tailored" target="_blank" rel="noopener noreferrer" className="tailored-banner-btn">
              {content.toast_visit_btn} <ArrowUpRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Deployment Section (Replaced cta-section with 3D Stack + Contact Button) */}
      <section className="deployment-section section-shell" id="deployments">
        <div className="deployment-card">
          <div className="deployment-grid">
            <div className="deployment-copy reveal">
              <p className="eyebrow">{content.deployment_eyebrow}</p>
              <h2>
                {content.deployment_title_line1}
                <br />
                <span>{content.deployment_title_highlight}</span>
              </h2>
              <p>{content.deployment_description}</p>

              <div className="deployment-actions">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(!contactModalOpen)}
                  className="btn-contact"
                >
                  {content.deployment_contact_btn} <ArrowRight size={16} />
                </button>
                <span className="btn-contact-sub">{content.deployment_contact_sub}</span>
              </div>
            </div>

            {/* Collapsible Contact Form - appears above infra-stack on mobile, spans full width on desktop */}
            {contactModalOpen && (
              <div className="order-2 md:order-3 col-span-full w-full pt-4 md:pt-5 border-t border-[#270d14]/10 -mt-4 md:-mt-2">
                <form onSubmit={handleWhatsAppInquiry} className="flex flex-col md:flex-row gap-4 md:items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] font-mono text-[#270d14]/60 uppercase mb-1 font-bold">Your Name</label>
                    <input
                      required
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Anil Kumar"
                      className="w-full bg-white/30 border border-[#270d14]/10 rounded-xl p-3 text-sm text-[#270d14] placeholder-[#270d14]/40 outline-none focus:border-[#270d14] transition"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] font-mono text-[#270d14]/60 uppercase mb-1 font-bold">Company</label>
                    <input
                      required
                      type="text"
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      placeholder="XYZ LLP"
                      className="w-full bg-white/30 border border-[#270d14]/10 rounded-xl p-3 text-sm text-[#270d14] placeholder-[#270d14]/40 outline-none focus:border-[#270d14] transition"
                    />
                  </div>

                  <div className="flex-[2]">
                    <label className="block text-[10px] font-mono text-[#270d14]/60 uppercase mb-1 font-bold">How can we help?</label>
                    <input
                      required
                      type="text"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="I'm interested in the POSS and CRM modules..."
                      className="w-full bg-white/30 border border-[#270d14]/10 rounded-xl p-3 text-sm text-[#270d14] placeholder-[#270d14]/40 outline-none focus:border-[#270d14] transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap rounded-xl bg-[#270d14] px-6 py-3.5 text-[11px] font-mono font-bold tracking-widest text-white hover:bg-black transition uppercase"
                  >
                    <span>WHATSAPP&nbsp;US</span>
                    <ArrowRight size={16} className="shrink-0" />
                  </button>
                </form>
                {content.contact_email && (
                  <div className="text-right mt-3">
                    <span className="text-[10px] font-mono text-[#270d14]/60 font-bold">
                      (or email us at <a href={`mailto:${content.contact_email}`} className="underline hover:text-[#270d14] transition">{content.contact_email}</a>)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 3D Rotating Stack from HomeClient */}
            <div className="infra-stack reveal reveal-delay-2 order-3 md:order-2">
              {deploymentCards.map((card, idx) => {
                const total = deploymentCards.length;
                const posClass = `pos-${(total * 2 + idx - (infraIndex % total)) % total}`;
                return (
                  <article
                    key={card.code}
                    onClick={() => setInfraIndex((prev) => (prev + 1) % total)}
                    className={posClass}
                  >
                    <span>{card.code}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer section-shell">
        <a href="#top" className="wordmark" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.svg" alt={content.footer_wordmark} style={{ height: '48px', width: 'auto' }} />
        </a>
        <span className="copyright">{content.footer_copyright}</span>
      </footer>


    </main>
  );
}

















