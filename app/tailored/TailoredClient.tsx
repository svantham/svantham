'use client';
import { FormEvent, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import StrokeText from "@/components/StrokeText";

type PortfolioProject = {
  id: string;
  category: string;
  client: string;
  description: string | { challenge: string; solution: string; impact: string; };
  images: string[];
  logo: string;
  name: string;
  tags: string[];
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className={`inline-block text-xl leading-none transition-transform duration-300 ${diagonal ? "group-hover:-translate-y-1 group-hover:translate-x-1" : "group-hover:translate-x-1"}`}>→</span>;
}

function ProjectArtwork({ type }: { type: number }) {
  if (type % 3 === 0) {
    return <div className="relative h-full overflow-hidden"><div className="absolute -left-7 top-9 h-44 w-44 rounded-full border-[18px] border-white/80" /><div className="absolute bottom-[-45px] right-[-22px] h-52 w-52 rounded-full bg-[#1d1733]" /><div className="absolute bottom-14 left-12 h-16 w-24 rounded-full border-2 border-white/70" /><div className="absolute right-12 top-12 font-display text-6xl italic text-[#1d1733]">A</div></div>;
  }
  if (type % 3 === 1) {
    return <div className="relative h-full overflow-hidden"><div className="absolute -right-3 top-5 h-48 w-48 rounded-full border-[22px] border-white/70" /><div className="absolute bottom-[-48px] left-[-25px] h-48 w-48 rounded-full bg-[#164d4c]" /><div className="absolute bottom-12 right-12 h-12 w-20 rounded-full border-2 border-white/70" /><div className="absolute left-12 top-10 text-5xl font-light text-[#164d4c]">N°</div></div>;
  }
  return <div className="relative h-full overflow-hidden"><div className="absolute -top-14 left-10 h-64 w-64 rotate-45 rounded-[40px] border-[18px] border-white/70" /><div className="absolute bottom-[-60px] right-[-20px] h-52 w-52 rounded-full bg-[#19194a]" /><div className="absolute left-10 top-11 text-5xl font-display text-[#19194a]">Lumen</div></div>;
}

function ProjectCarousel({ images, name }: { images: string[]; name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!images || images.length === 0) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <>
      <div className="relative h-full w-full group cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
        <div className="absolute inset-0 overflow-hidden rounded-[1.25rem]">
          {images.map((img, i) => (
            <img
              key={img}
              src={`${'https://r2.svantham.in'}/images/${img}`}
              alt={`${name} ${i + 1}`}
              className={`absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-300 ${i === currentIndex ? 'opacity-100 z-10 animate-[fadeIn_0.3s_ease-out]' : 'opacity-0 z-0'}`}
            />
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-100 transition hover:bg-black/80 backdrop-blur md:opacity-0 group-hover:opacity-100 z-20"
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-100 transition hover:bg-black/80 backdrop-blur md:opacity-0 group-hover:opacity-100 z-20"
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div className="absolute -bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-[#d7ff55] scale-125' : 'bg-white/20 hover:bg-white/40'}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {isPreviewOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 sm:p-16"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/50 hover:text-white transition p-2 z-10"
            onClick={() => setIsPreviewOpen(false)}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          {images.map((img, i) => (
            <img
              key={`lightbox-${img}`}
              src={`${'https://r2.svantham.in'}/images/${img}`}
              alt={`${name} ${i + 1}`}
              className={`absolute max-h-[85vh] w-full object-contain shadow-2xl drop-shadow-2xl transition-opacity duration-300 ${i === currentIndex ? 'opacity-100 z-10 animate-[fadeIn_0.3s_ease-out]' : 'opacity-0 z-0'}`}
              onClick={(e) => e.stopPropagation()}
            />
          ))}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 rounded-full bg-black/40 sm:bg-white/10 p-3 sm:p-4 text-white transition hover:bg-white/20 hover:scale-110 z-10"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 rounded-full bg-black/40 sm:bg-white/10 p-3 sm:p-4 text-white transition hover:bg-white/20 hover:scale-110 z-10"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>

              <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex justify-center gap-3 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                    className={`h-2 w-2 rounded-full transition-all ${i === currentIndex ? 'bg-[#d7ff55] scale-150' : 'bg-white/30 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  );
}

const AudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="mb-6 rounded-2xl bg-[#121612]/5 p-4 flex items-center gap-4 border border-[#121612]/10">
      <button
        onClick={togglePlay}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#121612] text-[#d7ff55] transition hover:scale-105"
        aria-label={isPlaying ? "Pause testimony" : "Play testimony"}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -translate-x-[1px]"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        className="hidden"
      />
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#121612]/50">CLIENT TESTIMONY</p>
        <div className="flex items-center justify-between gap-3 mt-0.5">
          <p className="text-sm font-semibold tracking-tight text-[#121612] truncate">Listen to their experience</p>
          <span className="text-xs font-mono font-medium text-[#121612]/60 shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full bg-[#121612]/10 overflow-hidden">
          <div
            className="h-full bg-[#121612] transition-all duration-75"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default function TailoredClient({ data }: { data: any }) {
  const [activeProject, setActiveProject] = useState(0);
  const [sent, setSent] = useState(false);

  if (!data) return <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center text-white">Loading...</div>;
  const { content, tailoredPortfolio: projects = [] } = data;

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    if (projects.length > 0) {
      if (distance > 50) setActiveProject((prev) => (prev + 1) % projects.length);
      else if (distance < -50) setActiveProject((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    if (!data) return;
    document.title = data.content.metaTitle || "Svantham Tailored";
    document.querySelector('meta[name="description"]')?.setAttribute("content", data.content.metaDescription || "");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [data]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const message = formData.get('message') as string;

    const phone = content.contact_whatsapp_number || '917845299722';
    const text = encodeURIComponent(
      `Hi Svantham Tailored Team,\n\nI'm ${name}${company ? ` from ${company}` : ''}.\n\n${message}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setSent(true);
  };

  if (!data) {
    return <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center text-white">Loading...</div>;
  }



  const heroHeadline = content.tailored_hero_headline || '';
  const heroTextDesktop = heroHeadline.includes('?') ? heroHeadline.replace('? ', '?\n') : heroHeadline.replace(' & ', '\n& ').replace(' & Content', '\n& Content');
  const heroTextMobile = heroTextDesktop.replace(' the ', ' the\n');

  const services = [
    { index: "01", title: content.tailored_service_software_title, text: content.tailored_service_software_desc, tags: ["CRM", "ERP", "AI"] },
    { index: "02", title: content.tailored_service_marketing_title, text: content.tailored_service_marketing_desc, tags: ["SEO", "Content", "Growth"] },
    { index: "03", title: content.tailored_service_infra_title, text: content.tailored_service_infra_desc, tags: ["Cloud", "DNS", "Servers"] },
    { index: "04", title: content.tailored_service_both_title, text: content.tailored_service_both_desc, tags: ["Product", "Demand", "End-to-end"] },
  ];

  return (
    <main className="tailored-page min-h-screen overflow-x-hidden bg-[#0c0e16] text-[#f8f7f1] selection:bg-[#d7ff55] selection:text-[#0c0e16]">
      <header className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#top" className="brand-lockup text-base font-extrabold tracking-[-0.05em]" aria-label="Svantham Tailored home">
          <span className="brand-sv">Svantham</span><span className="brand-services"> Tailored</span>
        </a>
        <a href="#contact" className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold tracking-[0.12em] text-white transition hover:border-[#d7ff55] hover:bg-[#d7ff55] hover:text-[#0c0e16]">LET'S TALK</a>
      </header>

      <section id="top" className="relative isolate flex min-h-[90vh] lg:min-h-screen flex-col overflow-hidden px-5 pb-2 pt-24 sm:px-8 lg:pb-4 lg:px-12">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="relative mx-auto flex w-full max-w-[1344px] flex-1 flex-col justify-end">
          <div className="mb-4 lg:mb-5 flex items-center gap-3 text-[10px] font-bold tracking-[0.22em] text-[#d7ff55] sm:text-xs"><span className="h-px w-9 bg-[#d7ff55]" />STRATEGY · DESIGN · TECHNOLOGY</div>
          <div className="grid items-end gap-2 lg:grid-cols-[1fr_300px] lg:gap-8">
            <h1 className="max-w-[1400px] font-geom text-[clamp(3.5rem,8.5vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.05em]">
              <span className="hidden sm:block">
                <StrokeText
                  text={heroTextDesktop}
                  strokeColor="#d7ff55"
                  fillColor="#f8f7f1"
                  strokeWidth={1.4}
                  trigger="mount"
                  fillMode="wipe"
                  fontFamily="'Geom', sans-serif"
                />
              </span>
              <span className="block sm:hidden">
                <StrokeText
                  text={heroTextMobile}
                  strokeColor="#d7ff55"
                  fillColor="#f8f7f1"
                  strokeWidth={1.4}
                  trigger="mount"
                  fillMode="wipe"
                  fontFamily="'Geom', sans-serif"
                />
              </span>
            </h1>
            <p className="max-w-xs pb-1 text-base leading-relaxed text-white/68">{content.tailored_hero_subheadline}</p>
          </div>
          <div className="mt-4 lg:mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4 lg:pt-5 text-[10px] font-semibold tracking-[0.14em] text-white/50 sm:text-xs">
            <span>BASED WHEREVER THE WORK IS</span><span className="hidden sm:block">SCROLL TO EXPLORE ↓</span>
            <a href="#work" className="group flex items-center gap-2 text-white transition hover:text-[#d7ff55]">EXPLORE THE WORK <Arrow /></a>
          </div>
        </div>
      </section>

      <section id="services" className="relative bg-[#f6f3eb] px-5 py-20 text-[#10121a] sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1344px]">
          <div data-reveal className="reveal mb-14">
            <h2 className="max-w-3xl font-display text-5xl leading-[.9] tracking-[-0.06em] sm:text-6xl">{content.tailored_services_headline}<br /><em className="font-normal text-3xl sm:text-4xl text-[#4e724d] block mt-2">{content.tailored_services_subheadline}</em></h2>
          </div>
          <div className="grid gap-px bg-[#10121a]/15 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => <article key={service.index} data-reveal className="reveal group flex min-h-[320px] flex-col bg-[#f6f3eb] p-6 transition duration-500 hover:bg-[#d7ff55] sm:p-8" style={{ transitionDelay: `${Number(service.index) * 80}ms` }}>
              <span className="font-mono text-xs text-[#4e724d]">{service.index}</span>
              <div className="mt-12"><h3 className="text-2xl font-semibold tracking-[-0.04em]">{service.title}</h3><p className="mt-3 max-w-xs text-sm leading-relaxed text-[#4c504d]">{service.text}</p></div>
              <div className="mt-auto flex flex-wrap gap-2 pt-8">{service.tags.filter(t => t.trim() !== "").map(tag => <span key={tag} className="rounded-full border border-[#10121a]/15 px-2.5 py-1 text-[10px] font-bold tracking-wide">{tag.trim()}</span>)}</div>
            </article>)}
          </div>
        </div>
      </section>

      <section id="work" className="bg-[#171d37] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1344px]">
          <div data-reveal className="reveal mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="font-display text-5xl leading-none tracking-[-0.06em] sm:text-6xl text-white">{content.tailored_portfolio_headline}</h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">{content.tailored_portfolio_subheadline}</p>
          </div>

          <div
            data-reveal
            className="reveal project-scroller relative grid items-start overflow-hidden rounded-[2rem] bg-[#d7ff55] lg:overflow-visible lg:rounded-none lg:bg-transparent lg:gap-4 lg:grid-cols-[1.55fr_.85fr]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <svg className="absolute hidden lg:block text-[#b8860b] -top-12 left-[52%] w-56 h-48 z-20 pointer-events-none" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 90 C 60 80, 70 20, 50 20 C 30 20, 30 70, 70 70 Q 120 70, 140 120" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" fill="none" strokeLinecap="round" />
              <path d="M125 110 L140 120 L145 105" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>

            {projects[activeProject] && <article data-cms-id={projects[activeProject].id} className="p-5 pb-0 sm:p-7 sm:pb-0 text-[#121612] lg:text-white lg:overflow-hidden lg:rounded-[2rem] lg:bg-[#22294b] lg:p-7 lg:pb-0">
              <div className={`relative h-[310px] rounded-[1.25rem] bg-gradient-to-br ${activeProject % 3 === 0 ? "from-[#f2bf5a] via-[#e99638] to-[#c85c35]" : activeProject % 3 === 1 ? "from-[#b9dfca] via-[#78bca5] to-[#247a73]" : "from-[#aab4fc] via-[#6974dc] to-[#292b74]"} sm:h-[390px]`}>
                {projects[activeProject].images && projects[activeProject].images.length > 0 ? (
                  <ProjectCarousel images={projects[activeProject].images} name={projects[activeProject].name} />
                ) : (
                  <div className="h-full w-full overflow-hidden rounded-[1.25rem]"><ProjectArtwork type={activeProject} /></div>
                )}
              </div>
              <div className="grid gap-5 pt-6 pb-5 sm:pt-7 sm:pb-6 sm:grid-cols-[1fr_auto] sm:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[.14em] text-[#121612]/60 lg:text-[#d7ff55]">
                {projects[activeProject].logo ? (
                  <img src={`${'https://r2.svantham.in'}/images/${projects[activeProject].logo}`} fetchPriority="high" loading="eager" alt={`${projects[activeProject].client} logo`} className="h-7 w-7 rounded-full object-contain bg-black/10 lg:bg-white/10 p-1" />
                ) : (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-black/10 lg:bg-white/10 text-[9px] text-[#121612] lg:text-white">{projects[activeProject].client.slice(0, 2).toUpperCase()}</span>
                )}
                {projects[activeProject].client.toUpperCase()}</div><h3 className="max-w-xl font-display text-3xl tracking-[-.045em] sm:text-4xl">{projects[activeProject].name}</h3></div></div>
            </article>}
            {projects[activeProject] && <aside className="flex flex-col justify-between gap-4 p-5 sm:p-7 bg-[#d7ff55] text-[#121612] lg:rounded-[2rem] lg:p-8"><div><div className="flex items-center justify-between"><span className="hidden lg:inline-block font-mono text-xs opacity-60 lg:opacity-100">{String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span><div className="hidden sm:flex items-center gap-2"><button onClick={() => setActiveProject((activeProject === 0 ? projects.length - 1 : activeProject - 1))} className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#121612]/20 transition hover:border-[#121612] hover:text-[#121612]" aria-label="Previous Project"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="M15 18l-6-6 6-6" /></svg></button><button onClick={() => setActiveProject((activeProject + 1) % projects.length)} className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#121612]/20 transition hover:border-[#121612] hover:text-[#121612]" aria-label="Next Project"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M9 18l6-6-6-6" /></svg></button></div></div><div className="mt-0 sm:mt-8 lg:mt-12 space-y-6 max-w-sm">{typeof projects[activeProject].description === 'object' ? (<><div><h4 className="text-[10px] font-bold text-[#121612]/60 uppercase tracking-widest mb-1.5">The Challenge</h4><p className="whitespace-pre-line text-lg leading-snug tracking-[-.02em]">{projects[activeProject].description.challenge}</p></div><div><h4 className="text-[10px] font-bold text-[#121612]/60 uppercase tracking-widest mb-1.5">Our Solution</h4><p className="whitespace-pre-line text-lg leading-snug tracking-[-.02em]">{projects[activeProject].description.solution}</p></div><div><h4 className="text-[10px] font-bold text-[#121612]/60 uppercase tracking-widest mb-1.5">The Impact</h4><p className="whitespace-pre-line text-lg leading-snug tracking-[-.02em]">{projects[activeProject].description.impact}</p></div></>) : (<p className="whitespace-pre-line text-xl leading-snug tracking-[-.03em]">{projects[activeProject].description}</p>)}</div></div><div>

              {projects[activeProject].audioTestimony && (
                <AudioPlayer src={`${'https://r2.svantham.in'}/images/${projects[activeProject].audioTestimony}`} />
              )}

              <div className="flex gap-2">{projects.map((project, index) => <button key={project.id} data-cms-id={project.id} onClick={() => setActiveProject(index)} aria-label={`View ${project.client} case study`} className={`h-2 flex-1 rounded-full transition ${activeProject === index ? "bg-[#121612]" : "bg-[#121612]/20 hover:bg-[#121612]/50"}`} />)}</div><div className="mt-6 sm:hidden"><p className="text-xs font-bold tracking-[.12em]">SWIPE THROUGH OUR IMPACT →</p></div></div></aside>}
          </div>

          <div className="hidden" aria-hidden="true">
            {projects.map(p => p.images && p.images[0] && (
              <img key={`preload-${p.id}`} src={`${'https://r2.svantham.in'}/images/${p.images[0]}`} alt="" />
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="reveal relative overflow-hidden bg-[#ee6d4f] py-16 text-[#20131e]">
        <div className="marquee-track font-display text-[clamp(3.4rem,8vw,8.5rem)] leading-none tracking-[-.07em]">
          <span>{content.tailored_marquee_text}&nbsp;</span><span aria-hidden="true">{content.tailored_marquee_text}&nbsp;</span>
        </div>
      </section>

      <section id="contact" className="bg-[#f6f3eb] px-5 py-20 text-[#10121a] sm:px-8 lg:px-12 lg:py-28">
        <div data-reveal className="reveal mx-auto grid max-w-[1344px] gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><p className="text-xs font-bold tracking-[.16em] text-[#59604f]">START A CONVERSATION</p><h2 className="mt-5 max-w-lg font-display text-5xl leading-[.9] tracking-[-.065em] sm:text-7xl">{content.tailored_contact_headline}</h2><p className="mt-8 max-w-sm text-base leading-relaxed text-[#4c504d]">{content.tailored_contact_subheadline}</p><img src="/logo.svg" className="mt-8 block w-44 max-w-full object-contain mix-blend-multiply" alt="Svantham Tailored logo" /></div>
          <form onSubmit={handleSubmit} className="rounded-[2rem] bg-[#10121a] p-6 text-white sm:p-9">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-xs font-bold tracking-[.14em] text-white/55">YOUR NAME<input required name="name" className="mt-3 w-full border-b border-white/25 bg-transparent py-3 text-base outline-none transition placeholder:text-white/25 focus:border-[#d7ff55]" placeholder="Your name" /></label>
              <label className="block text-xs font-bold tracking-[.14em] text-white/55">COMPANY NAME<input name="company" className="mt-3 w-full border-b border-white/25 bg-transparent py-3 text-base outline-none transition placeholder:text-white/25 focus:border-[#d7ff55]" placeholder="Company or brand" /></label>
            </div>
            <label className="mt-7 block text-xs font-bold tracking-[.14em] text-white/55">HOW CAN WE HELP?<textarea required name="message" rows={4} className="mt-3 w-full resize-none border-b border-white/25 bg-transparent py-3 text-base outline-none transition placeholder:text-white/25 focus:border-[#d7ff55]" placeholder="A little context goes a long way..." /></label>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/45">We'll reply on WhatsApp within 1 business day.</p>
                {content.contact_email && (
                  <p className="mt-1 text-xs text-white/45">
                    (or email us at <a href={`mailto:${content.contact_email}`} className="underline hover:text-white transition">{content.contact_email}</a>)
                  </p>
                )}
              </div>
              <button className="group rounded-full bg-[#d7ff55] px-5 py-3 text-xs font-black tracking-[.12em] text-[#10121a] transition hover:bg-white">{sent ? "MESSAGE RECEIVED ✓" : <span className="flex items-center gap-3">WHATSAPP US <Arrow diagonal /></span>}</button>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-[#10121a] px-5 py-7 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1344px] flex-wrap items-center justify-between gap-4 text-[10px] font-bold tracking-[.14em] text-white/45"><span>{(content.tailored_footer_copyright || content.footer_copyright)}</span><a className="transition hover:text-[#d7ff55]">{(content.tailored_footer_tagline || '').toUpperCase()}</a></div></footer>

    </main>
  );
}
