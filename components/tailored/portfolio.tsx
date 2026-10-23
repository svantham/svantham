'use client'

import { useContent, useData } from '@/components/data-provider'
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/tailored/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/tailored/ui/toggle-group'
import { contact, projects as defaultProjects, type Project } from '@/lib/site-content'
import { cn } from '@/lib/utils'

const filters = ['All work', 'Software', 'Content', 'Digital marketing']
const colorClasses: Record<string, string> = {
  sage: 'bg-sage text-background',
  blue: 'bg-secondary text-secondary-foreground',
  clay: 'bg-clay text-background',
  plum: 'bg-plum text-primary',
}

function ProjectImage({ project }: { project: Project }) {
  const images = project.images && project.images.length > 0 ? project.images : [project.image]
  const cover = images[0] || project.image || '/placeholder.svg?height=880&width=1250'
  const isPlaceholder = cover.startsWith('/placeholder.svg')
  const colorClass = colorClasses[project.color] || colorClasses.sage

  return (
    <div data-placeholder={isPlaceholder} className={cn('work-image relative overflow-hidden rounded-xl', colorClass)}>
      <img src={cover} alt={isPlaceholder ? '' : project.title} width={1250} height={880} loading="lazy" className="absolute inset-0 size-full object-cover" />
      {isPlaceholder && (
        <div className="absolute inset-6 flex flex-col justify-between md:inset-8">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm tracking-[0.12em] uppercase">{project.category}</span>
            <span className="project-arrow flex size-10 items-center justify-center rounded-full border border-current/30">
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <ImageIcon className="size-8 opacity-50" strokeWidth={1} aria-hidden="true" />
            <span className="text-sm tracking-[0.15em] uppercase">{project.title}</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className="text-2xl font-medium tracking-[-0.06em]">
              {useContent('tailored_portfolio_img_label_1', 'tailored')}
              <span className="font-serif italic">{useContent('tailored_portfolio_img_label_2', ' showcase')}</span>
            </span>
          </div>
        </div>
      )}
      {images.length > 1 && (
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-mono font-medium text-white shadow-sm backdrop-blur-md">
          <ImageIcon className="size-3.5" aria-hidden="true" />
          {images.length}
        </span>
      )}
    </div>
  )
}

function ProjectGallery({ project }: { project: Project }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const images = project.images && project.images.length > 0 ? project.images : [project.image || '/placeholder.svg?height=880&width=1250']
  const currentImg = images[activeIdx] || images[0]
  const isPlaceholder = currentImg.startsWith('/placeholder.svg')
  const colorClass = colorClasses[project.color] || colorClasses.sage

  return (
    <div className="flex flex-col gap-3">
      <div data-placeholder={isPlaceholder} className={cn('work-image relative overflow-hidden rounded-xl', colorClass)}>
        <img
          src={currentImg}
          alt={`${project.title} - view ${activeIdx + 1}`}
          width={1250}
          height={880}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-opacity duration-200"
        />
        {isPlaceholder && (
          <div className="absolute inset-6 flex flex-col justify-between md:inset-8">
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm tracking-[0.12em] uppercase">{project.category}</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <ImageIcon className="size-8 opacity-50" strokeWidth={1} aria-hidden="true" />
              <span className="text-sm tracking-[0.15em] uppercase">{project.title}</span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <span className="text-2xl font-medium tracking-[-0.06em]">
                {useContent('tailored_portfolio_img_label_1', 'tailored')}
                <span className="font-serif italic">{useContent('tailored_portfolio_img_label_2', ' showcase')}</span>
              </span>
            </div>
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-mono font-medium text-white shadow-sm backdrop-blur-md">
            <span>{activeIdx + 1} / {images.length}</span>
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))
              }}
              className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/80"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
              }}
              className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/80"
              aria-label="Next image"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={cn(
                'relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                idx === activeIdx
                  ? 'border-primary ring-2 ring-primary/40 scale-105'
                  : 'border-border/60 opacity-60 hover:opacity-100'
              )}
              aria-label={`Switch to image ${idx + 1}`}
            >
              <img src={img} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group">
      <Dialog>
        <DialogTrigger
          className="project-trigger block w-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          aria-label={`View project: ${project.title}`}
        >
          <ProjectImage project={project} />
          <div className="flex items-start justify-between gap-4 pt-5">
            <div className="flex flex-col gap-1.5 flex-1">
              <h3 className="text-xl font-medium tracking-tight md:text-2xl group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">{project.discipline}</p>
              {project.shortDescription && (
                <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2 mt-1">
                  {project.shortDescription}
                </p>
              )}
            </div>
            <span className="project-arrow flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-200 group-hover:border-primary group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 mt-1">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{project.title}</DialogTitle>
            <DialogDescription className="text-sm">
              {project.discipline} · <span className="font-medium text-foreground">{project.category}</span>
            </DialogDescription>
          </DialogHeader>

          <ProjectGallery project={project} />

          {project.shortDescription && (
            <p className="text-base font-medium leading-relaxed text-foreground pt-1">
              {project.shortDescription}
            </p>
          )}

          {project.description && project.description !== project.shortDescription && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          )}

          {project.scope && project.scope.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {project.scope.map((item) => (
                <span key={item} className="rounded-full border border-border/80 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2">
            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="pill-link w-fit">
              {useContent('tailored_portfolio_card_btn', 'Discuss a similar project')} <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}

export function Portfolio() {
  const [filter, setFilter] = useState('All work')
  const data = useData()
  const colors: ('sage' | 'blue' | 'clay' | 'plum')[] = ['sage', 'blue', 'clay', 'plum']

  const rawList = (data.tailoredPortfolio && data.tailoredPortfolio.length > 0)
    ? data.tailoredPortfolio
    : defaultProjects

  const mappedProjects: Project[] = rawList.map((proj: any, idx: number) => {
    const images: string[] = (Array.isArray(proj.images) && proj.images.length > 0)
      ? proj.images
      : (proj.image ? [proj.image] : (proj.logo ? [proj.logo] : ['/placeholder.svg?height=880&width=1250']))

    const primaryImage = images[0] || proj.image || '/placeholder.svg?height=880&width=1250'

    let fullDesc = ''
    if (typeof proj.description === 'string') {
      fullDesc = proj.description
    } else if (proj.description && typeof proj.description === 'object') {
      fullDesc = [proj.description.challenge, proj.description.solution, proj.description.impact].filter(Boolean).join(' ')
    }

    const shortDesc = proj.shortDescription || proj.short_description || ''

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
      discipline: proj.discipline || proj.client || category,
      color: (proj.color && colorClasses[proj.color]) ? proj.color : colors[idx % colors.length],
      images,
      image: primaryImage,
      shortDescription: shortDesc,
      description: fullDesc || shortDesc,
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
