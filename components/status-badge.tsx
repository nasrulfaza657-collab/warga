import { cn } from '@/lib/utils'
import { STATUS_LABEL } from '@/lib/data'
import type { Priority, Status } from '@/lib/types'

const STATUS_STYLES: Record<Status, string> = {
  baru: 'bg-status-baru text-status-baru-foreground',
  diproses: 'bg-status-proses text-status-proses-foreground',
  selesai: 'bg-status-selesai text-status-selesai-foreground',
}

export function StatusBadge({
  status,
  className,
}: {
  status: Status
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        STATUS_STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  )
}

const PRIORITY_STYLES: Record<Priority, string> = {
  rendah: 'border-border text-muted-foreground',
  sedang: 'border-accent-foreground/30 text-accent-foreground',
  tinggi: 'border-destructive/40 text-destructive',
}

const PRIORITY_LABEL: Record<Priority, string> = {
  rendah: 'Rendah',
  sedang: 'Sedang',
  tinggi: 'Tinggi',
}

export function PriorityBadge({
  prioritas,
  className,
}: {
  prioritas: Priority
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
        PRIORITY_STYLES[prioritas],
        className,
      )}
    >
      Prioritas {PRIORITY_LABEL[prioritas]}
    </span>
  )
}
