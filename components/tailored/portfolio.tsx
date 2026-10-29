'use client'

import { useContent, useData } from '@/components/data-provider'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/tailored/ui/toggle-group'
import { contact, type Project } from '@/lib/site-content'
import { cn } from '@/lib/utils'

const filters = ['All work', 'Software', 'Content', 'Digital marketing']

function ProjectSlideshow({ project }: { project: Project }) {
  const images = (project.images && project.images.length > 0)
    ? project.images
    : [project.image || '/placeholder.svg?height=880&width=1250']
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Automated slideshow: cycles every 3.8s when not hovered
  useEffect(() => {
    if (images.length <= 1 || isHovered) return
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length)
    }, 3800)
    return () => clearInterval(timer)
  }, [images.length, isHovered])

  const currentImg = images[currentIdx] || images[0]
  const isPlaceholder = currentImg.startsWith('/placeholder.svg')

  return (
    <div
      className="work-image relative overflow-hidden rounded-2xl group/slide select-none bg-secondary/40 text-foreground"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides crossfade */}
      {images.map((img, idx) => {
        const active = idx === currentIdx
        return (
          <img
            key={`${img}-${idx}`}
            src={img}
            alt={`${project.title} - slide ${idx + 1}`}
            width={1250}
            height={880}
            loading={idx === 0 ? 'eager' : 'lazy'}
            className={cn(
              'absolute inset-0 size-full object-cover transition-opacity duration-700 ease-in-out',
              active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            )}
          />
        )
      })}

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
        <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between z-30 opacity-0 group-hover/slide:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))
            }}
            className="flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/85"
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
            className="flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/85"
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col gap-4">
      <ProjectSlideshow project={project} />

      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {project.category}
          </span>
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
        {visibleProjects.map((project) => <ProjectCard project={project} key={project.id} />)}
      </div>
    </section>
  )
}
