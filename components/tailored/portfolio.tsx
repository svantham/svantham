'use client'

import { useContent, useData } from '@/components/data-provider'
import { ArrowUpRight, ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/tailored/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/tailored/ui/toggle-group'
import { contact, type Project } from '@/lib/site-content'
import { cn } from '@/lib/utils'

const filters = ['All work', 'Software', 'Content', 'Digital marketing']
const colorClasses = {
  sage: 'bg-sage text-background',
  blue: 'bg-secondary text-secondary-foreground',
  clay: 'bg-clay text-background',
  plum: 'bg-plum text-primary',
}

function ProjectImage({ project, detail = false }: { project: Project; detail?: boolean }) {
  const isPlaceholder = project.image.startsWith('/placeholder.svg')

  return (
    <div data-placeholder={isPlaceholder} className={cn('work-image', colorClasses[project.color])}>
      <img src={project.image} alt={isPlaceholder ? '' : project.title} width={1250} height={880} loading="lazy" className="absolute inset-0 size-full object-cover" />
      {isPlaceholder && <div className="absolute inset-6 flex flex-col justify-between md:inset-8">
        <div className="flex items-start justify-between gap-4">
          <span className="text-sm tracking-[0.12em] uppercase">{project.category}</span>
          {!detail && <span className="project-arrow flex size-10 items-center justify-center rounded-full border border-current/30"><ArrowUpRight className="size-5" aria-hidden="true" /></span>}
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <ImageIcon className="size-8 opacity-50" strokeWidth={1} aria-hidden="true" />
          <span className="text-sm tracking-[0.15em] uppercase">{useContent('tailored_portfolio_img_placeholder', 'Your project image here')}</span>
          <span className="text-sm opacity-65">{useContent('tailored_portfolio_img_rec', '1600 × 1100 recommended')}</span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <span className="text-2xl font-medium tracking-[-0.06em]">{useContent('tailored_portfolio_img_label_1', 'tailored')}<span className="font-serif italic">{useContent('tailored_portfolio_img_label_2', ' showcase')}</span></span>
        </div>
      </div>}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article>
      <Dialog>
        <DialogTrigger className="project-trigger block w-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background" aria-label={`View sample project: ${project.title}`}>
          <ProjectImage project={project} />
          <div className="flex items-start justify-between gap-4 pt-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-medium tracking-tight md:text-2xl">{project.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{project.discipline}</p>
            </div>
            <span className="shrink-0 pt-1 text-sm text-muted-foreground">{useContent('tailored_portfolio_card_sample', 'Sample project')}</span>
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{project.title}</DialogTitle>
            <DialogDescription>{useContent('tailored_portfolio_card_desc', 'Portfolio placeholder')} · {project.category}</DialogDescription>
          </DialogHeader>
          <ProjectImage project={project} detail />
          <p className="text-base leading-relaxed text-muted-foreground">{project.description}</p>
          <div className="flex flex-wrap gap-2">{project.scope.map((item) => <span key={item} className="rounded-full border border-border px-3 py-1.5 text-sm">{item}</span>)}</div>
          <p className="text-sm leading-relaxed text-muted-foreground">{useContent('tailored_portfolio_card_note', 'This is a sample layout, not a published client case study.')}</p>
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="pill-link w-fit">{useContent('tailored_portfolio_card_btn', 'Discuss a similar project')} <ArrowUpRight className="size-4" aria-hidden="true" /></a>
        </DialogContent>
      </Dialog>
    </article>
  )
}

export function Portfolio() {
  const [filter, setFilter] = useState('All work')
    const data = useData();
  const colors: ('sage' | 'blue' | 'clay' | 'plum')[] = ['sage', 'blue', 'clay', 'plum'];
  
  const mappedProjects: Project[] = (data.tailoredPortfolio || []).map((proj: any, idx: number) => {
    // If it's already using the new schema (because I accidentally seeded it), it will have title and color.
    // Otherwise, we map it from the old schema (name, client, description.challenge, images).
    const isOldSchema = !proj.title && proj.name;
    
    if (isOldSchema) {
      return {
        id: proj.id || `proj-${idx}`,
        title: proj.name || 'Untitled',
        category: 'Software', // Default category since old schema lacks it
        discipline: proj.client || '',
        color: colors[idx % colors.length],
        image: (proj.images && proj.images.length > 0) ? proj.images[0] : (proj.logo || '/placeholder.svg?height=880&width=1250'),
        description: `${proj.description?.challenge || ''} ${proj.description?.solution || ''} ${proj.description?.impact || ''}`.trim(),
        scope: []
      };
    }
    
    // Fallback if it's already matching Project type
    return {
      id: proj.id || `proj-${idx}`,
      title: proj.title || 'Untitled',
      category: proj.category || 'Software',
      discipline: proj.discipline || '',
      color: proj.color || colors[idx % colors.length],
      image: proj.image || '/placeholder.svg?height=880&width=1250',
      description: proj.description || '',
      scope: proj.scope || []
    };
  });

  const visibleProjects = mappedProjects.filter((project) => filter === 'All work' || project.category === filter)

  return (
    <section id="work" aria-labelledby="work-heading" className="page-shell py-16 md:py-20">
      <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
        <div className="flex flex-col gap-4"><p className="eyebrow text-muted-foreground">{useContent('tailored_portfolio_eyebrow', 'The work speaks')}</p><h2 id="work-heading" className="section-heading">{useContent('tailored_portfolio_h2_1', 'A little of what ')}<span className="font-serif italic">{useContent('tailored_portfolio_h2_2', 'we do.')}</span></h2></div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{useContent('tailored_portfolio_p1_1', 'Different businesses. Different challenges.')}<br />{useContent('tailored_portfolio_p1_2', 'One thing in common: made-to-fit thinking.')}</p>
      </div>
      <div className="flex flex-col justify-between gap-4 pb-8 pt-9 lg:flex-row lg:items-center">
        <ToggleGroup aria-label="Filter portfolio by service" variant="portfolio" value={[filter]} onValueChange={(values) => { if (values.length) setFilter(values[0]) }} className="flex-wrap" spacing={2}>
          {filters.map((item) => <ToggleGroupItem key={item} value={item} className="h-10 px-4">{item}</ToggleGroupItem>)}
        </ToggleGroup>
        <p className="text-sm text-muted-foreground">{useContent('tailored_portfolio_preview', 'A preview canvas — real client stories coming soon.')}</p>
      </div>
      <div aria-live="polite" className="sr-only">{`Showing ${visibleProjects.length} ${filter === 'All work' ? '' : `${filter.toLowerCase()} `}sample projects.`}</div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-y-12">
        {visibleProjects.map((project) => <ProjectCard project={project} key={project.id} />)}
      </div>
    </section>
  )
}
