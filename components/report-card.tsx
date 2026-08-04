import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, ChevronRight } from 'lucide-react'
import { CATEGORY_MAP } from '@/lib/data'
import type { Report } from '@/lib/types'
import { StatusBadge, PriorityBadge } from '@/components/status-badge'
import { CategoryIcon } from '@/components/category-icon'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function ReportCard({ report }: { report: Report }) {
  const cat = CATEGORY_MAP[report.kategori]
  return (
    <Link
      href={`/laporan/${report.id}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-secondary/50"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
        <Image
          src={report.foto || '/placeholder.svg'}
          alt={`Foto laporan ${report.judul}`}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CategoryIcon kategori={report.kategori} className="size-3.5" />
            {cat.nama}
          </div>
          <StatusBadge status={report.status} />
        </div>
        <h3 className="line-clamp-1 font-semibold text-foreground">
          {report.judul}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            <span className="line-clamp-1 max-w-[16rem]">{report.lokasi}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" aria-hidden="true" />
            {formatDate(report.tanggal)}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {report.id}
            </span>
            <PriorityBadge prioritas={report.prioritas} />
          </div>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}
