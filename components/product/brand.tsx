import { cn } from '@/lib/utils'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-sans font-bold tracking-tight', compact ? 'text-lg' : 'text-2xl')}>
      <img src="/icon.svg" className="h-[1.25em] w-auto" alt="" aria-hidden="true" />
      <span>Svantham<span className="text-primary">CRM</span></span>
    </span>
  )
}
