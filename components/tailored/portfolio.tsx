'use client'

import { useContent, useData } from '@/components/data-provider'
import { ChevronLeft, ChevronRight, ImageIcon, Maximize2, X } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/tailored/ui/toggle-group'
import { type Project } from '@/lib/site-content'
import { cn } from '@/lib/utils'

const filters = ['All work', 'Software', 'Content', 'Digital marketing']

function ProjectLightbox({
  isOpen,
  images,
  currentIdx,
  title,
  category,
  client,
  onClose,
  onPrev,
  onNext,
  onSelectIdx,
}: {
  isOpen: boolean
  images: string[]
  currentIdx: number
  title: string
  category: string
  client?: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onSelectIdx: (idx: number) => void
}) {
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef<number>(0)

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)

    const origOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = origOverflow
    }
  }, [isOpen, onClose, onPrev, onNext])

  if (!isOpen || images.length === 0) return null

  const currentSrc = images[currentIdx] || images[0]

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current
    }
  }

  const handleTouchEnd = () => {
    if (touchStartX.current !== null) {
      if (touchDeltaX.current < -40) onNext()
      else if (touchDeltaX.current > 40) onPrev()
    }
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} expanded image gallery`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Header */}
      <div
        className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 border-b border-white/10 z-10 bg-black/40 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#b8ef3e] font-bold">
              {category}
            </span>
            {client && (
              <>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-xs font-mono text-white/70 truncate">{client}</span>
              </>
            )}
          </div>
          <h3 className="text-white font-medium text-base sm:text-lg tracking-tight truncate max-w-[260px] sm:max-w-md md:max-w-xl">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {images.length > 1 && (
            <span className="text-xs font-mono text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
              {currentIdx + 1} / {images.length}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all"
            aria-label="Close fullscreen view"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Mobile Touch Swipe - fits viewport without resolution loss */}
      <div
        className="relative flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden touch-pan-y"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-2 sm:left-6 z-20 flex size-11 sm:size-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white backdrop-blur-md transition-all border border-white/15"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-2 sm:right-6 z-20 flex size-11 sm:size-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white backdrop-blur-md transition-all border border-white/15"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        {/* High-Resolution Expanded Image - fitted to viewport without resolution loss */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            src={currentSrc}
            alt={`${title} - expanded view ${currentIdx + 1}`}
            className="max-h-[80vh] max-w-[95vw] sm:max-w-[88vw] w-auto h-auto object-contain rounded-xl shadow-2xl transition-transform duration-200"
            style={{
              imageRendering: '-webkit-optimize-contrast',
            }}
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip (if multiple images) */}
      {images.length > 1 && (
        <div
          className="flex items-center justify-center gap-2 px-4 py-3 border-t border-white/10 z-10 overflow-x-auto bg-black/40 backdrop-blur-md scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIdx(idx)}
              className={cn(
                'relative h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-white/5 active:scale-95',
                idx === currentIdx
                  ? 'border-[#b8ef3e] scale-105 opacity-100 ring-2 ring-[#b8ef3e]/30'
                  : 'border-transparent opacity-45 hover:opacity-85'
              )}
              aria-label={`View slide ${idx + 1}`}
            >
              <img src={img} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectSlideshow({
  project,
  cardIndex,
  onOpenLightbox,
}: {
  project: Project
  cardIndex: number
  onOpenLightbox: (idx: number) => void
}) {
  const images = (project.images && project.images.length > 0)
    ? project.images
    : [project.image || '/placeholder.svg?height=880&width=1250']
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Automated slideshow: cycles every 4.2s when not hovered
  useEffect(() => {
    if (images.length <= 1 || isHovered) return
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length)
    }, 4200)
    return () => clearInterval(timer)
  }, [images.length, isHovered])

  const currentImg = images[currentIdx] || images[0]
  const isPlaceholder = currentImg.startsWith('/placeholder.svg')

  return (
    <div
      className="work-image relative overflow-hidden rounded-2xl group/slide select-none bg-secondary/40 text-foreground cursor-zoom-in aspect-[16/10]"
      onClick={() => onOpenLightbox(currentIdx)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Click or tap to expand full image"
    >
      {/* Slides crossfade with progressive loading & crisp rendering */}
      {images.map((img, idx) => {
        const active = idx === currentIdx

        // Progressive render: active slide + adjacent slides, or all when hovered
        const shouldRender =
          active ||
          idx === (currentIdx + 1) % images.length ||
          idx === (currentIdx - 1 + images.length) % images.length ||
          isHovered
        if (!shouldRender) return null

        const isEager = cardIndex === 0 && idx === 0

        return (
          <img
            key={`${img}-${idx}`}
            src={img}
            alt={`${project.title} - slide ${idx + 1}`}
            loading={isEager ? 'eager' : 'lazy'}
            decoding="async"
            className={cn(
              'absolute inset-0 size-full object-cover object-top transition-opacity duration-700 ease-in-out',
              active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            )}
            style={{
              imageRendering: '-webkit-optimize-contrast',
            }}
          />
        )
      })}

      {/* Expand Pill Badge */}
      <div className="absolute top-3 right-3 z-30 opacity-0 group-hover/slide:opacity-100 transition-opacity pointer-events-none">
        <span className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-white shadow-lg border border-white/10">
          <Maximize2 className="size-3 text-[#b8ef3e]" />
          <span className="hidden sm:inline">Expand</span>
        </span>
      </div>

      {/* Placeholder illustration fallback if SVG placeholder */}
      {isPlaceholder && (
        <div className="absolute inset-6 flex flex-col justify-between md:inset-8 z-20 pointer-events-none">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm tracking-[0.12em] uppercase font-medium">{project.category}</span>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <ImageIcon className="size-8 opacity-50" strokeWidth={1} aria-hidden="true" />
            <span className="text-sm tracking-[0.15em] uppercase font-medium">{project.title}</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className="text-2xl font-medium tracking-[-0.06em]">
              {useContent('tailored_portfolio_img_label_1', 'tailored')}
              <span className="font-serif italic">{useContent('tailored_portfolio_img_label_2', ' showcase')}</span>
            </span>
          </div>
        </div>
      )}

      {/* Manual Arrow Controls (visible on hover when multiple images) */}
      {images.length > 1 && (
        <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between z-30 opacity-0 group-hover/slide:opacity-100 transition-opacity pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))
            }}
            className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/85"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
            }}
            className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/85"
            aria-label="Next image"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

      {/* Dots Indicator & Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-30 pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIdx(dotIdx)
                }}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  dotIdx === currentIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                )}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          <span className="rounded-full bg-black/55 backdrop-blur-md px-2 py-0.5 text-[11px] font-mono text-white/90">
            {currentIdx + 1}/{images.length}
          </span>
        </div>
      )}
    </div>
  )
}

function ProjectCard({
  project,
  cardIndex,
  onOpenLightbox,
}: {
  project: Project
  cardIndex: number
  onOpenLightbox: (images: string[], index: number, title: string, category: string, client?: string) => void
}) {
  const images = (project.images && project.images.length > 0)
    ? project.images
    : [project.image || '/placeholder.svg?height=880&width=1250']

  return (
    <article
      className="group flex flex-col gap-4"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 450px',
      }}
    >
      <ProjectSlideshow
        project={project}
        cardIndex={cardIndex}
        onOpenLightbox={(idx) =>
          onOpenLightbox(images, idx, project.title, project.category, project.client)
        }
      />

      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {project.category}
          </span>

          {(project.client_logo || project.client) && (
            <div className="flex items-center gap-2">
              {project.client_logo && (
                <img
                  src={project.client_logo}
                  alt={project.client ? `${project.client} logo` : 'Client logo'}
                  className="h-4 max-w-[85px] object-contain opacity-75 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              )}
              {project.client && (
                <span className="text-xs font-mono text-muted-foreground/80">
                  {project.client}
                </span>
              )}
            </div>
          )}
        </div>

        <h3 className="text-xl font-medium tracking-tight md:text-2xl">
          {project.title}
        </h3>

        {project.shortDescription && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.shortDescription}
          </p>
        )}

        {project.scope && project.scope.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.scope.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border/70 bg-muted/20 px-2.5 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export function Portfolio() {
  const [filter, setFilter] = useState('All work')
  const data = useData()

  // Lightbox Modal State
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean
    images: string[]
    currentIdx: number
    title: string
    category: string
    client?: string
  }>({
    isOpen: false,
    images: [],
    currentIdx: 0,
    title: '',
    category: '',
    client: '',
  })

  const openLightbox = useCallback(
    (images: string[], index: number, title: string, category: string, client?: string) => {
      setLightboxState({
        isOpen: true,
        images,
        currentIdx: index,
        title,
        category,
        client,
      })
    },
    []
  )

  const closeLightbox = useCallback(() => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const nextLightboxSlide = useCallback(() => {
    setLightboxState((prev) => ({
      ...prev,
      currentIdx: (prev.currentIdx + 1) % (prev.images.length || 1),
    }))
  }, [])

  const prevLightboxSlide = useCallback(() => {
    setLightboxState((prev) => ({
      ...prev,
      currentIdx: (prev.currentIdx - 1 + prev.images.length) % (prev.images.length || 1),
    }))
  }, [])

  const selectLightboxIdx = useCallback((idx: number) => {
    setLightboxState((prev) => ({ ...prev, currentIdx: idx }))
  }, [])

  const rawList = data.tailoredPortfolio || []

  const mappedProjects: Project[] = rawList.map((proj: any, idx: number) => {
    const images: string[] = (Array.isArray(proj.images) && proj.images.length > 0)
      ? proj.images
      : (proj.image ? [proj.image] : (proj.logo ? [proj.logo] : ['/placeholder.svg?height=880&width=1250']))

    const primaryImage = images[0] || proj.image || '/placeholder.svg?height=880&width=1250'

    const shortDesc = proj.shortDescription || proj.short_description || proj.description || ''

    let category = proj.category || 'Software'
    if (category.toLowerCase() === 'software') category = 'Software'
    else if (category.toLowerCase() === 'content') category = 'Content'
    else if (category.toLowerCase() === 'digital marketing' || category.toLowerCase() === 'digital_marketing') category = 'Digital marketing'

    const scope = Array.isArray(proj.scope)
      ? proj.scope
      : (typeof proj.scope === 'string'
        ? proj.scope.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [])

    return {
      id: proj.id || `proj-${idx}`,
      title: proj.title || proj.name || 'Untitled project',
      category,
      images,
      image: primaryImage,
      shortDescription: typeof shortDesc === 'string' ? shortDesc : '',
      scope,
      client: proj.client || proj.client_name || '',
      client_name: proj.client_name || proj.client || '',
      client_logo: proj.client_logo || proj.clientLogo || '',
      clientLogo: proj.clientLogo || proj.client_logo || '',
    }
  })

  const visibleProjects = mappedProjects.filter((project) => filter === 'All work' || project.category === filter)

  return (
    <section id="work" aria-labelledby="work-heading" className="page-shell py-16 md:py-20">
      <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
        <div className="flex flex-col gap-4">
          <p className="eyebrow text-muted-foreground">{useContent('tailored_portfolio_eyebrow', 'The work speaks')}</p>
          <h2 id="work-heading" className="section-heading">
            {useContent('tailored_portfolio_h2_1', 'A little of what ')}
            <span className="font-serif italic">{useContent('tailored_portfolio_h2_2', 'we do.')}</span>
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          {useContent('tailored_portfolio_p1_1', 'Different businesses. Different challenges.')}<br />
          {useContent('tailored_portfolio_p1_2', 'One thing in common: made-to-fit thinking.')}
        </p>
      </div>
      <div className="flex flex-col justify-between gap-4 pb-8 pt-9 lg:flex-row lg:items-center">
        <ToggleGroup aria-label="Filter portfolio by service" variant="portfolio" value={[filter]} onValueChange={(values) => { if (values.length) setFilter(values[0]) }} className="flex-wrap" spacing={2}>
          {filters.map((item) => <ToggleGroupItem key={item} value={item} className="h-10 px-4">{item}</ToggleGroupItem>)}
        </ToggleGroup>
        <p className="text-sm text-muted-foreground">{useContent('tailored_portfolio_preview', 'Selected client work and case studies.')}</p>
      </div>
      <div aria-live="polite" className="sr-only">{`Showing ${visibleProjects.length} ${filter === 'All work' ? '' : `${filter.toLowerCase()} `}projects.`}</div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-y-12">
        {visibleProjects.map((project, idx) => (
          <ProjectCard
            project={project}
            cardIndex={idx}
            key={project.id}
            onOpenLightbox={openLightbox}
          />
        ))}
      </div>

      {/* Full-screen Lightbox Gallery */}
      <ProjectLightbox
        isOpen={lightboxState.isOpen}
        images={lightboxState.images}
        currentIdx={lightboxState.currentIdx}
        title={lightboxState.title}
        category={lightboxState.category}
        client={lightboxState.client}
        onClose={closeLightbox}
        onNext={nextLightboxSlide}
        onPrev={prevLightboxSlide}
        onSelectIdx={selectLightboxIdx}
      />
    </section>
  )
}
