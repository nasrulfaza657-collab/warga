'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useApp } from '@/components/app-provider'
import { CATEGORIES } from '@/lib/data'
import { CategoryIcon } from '@/components/category-icon'
import { StatusBadge } from '@/components/status-badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import type { Status } from '@/lib/types'

const PetaMap = dynamic(() => import('@/components/peta-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <p className="text-sm text-muted-foreground">Memuat peta...</p>
    </div>
  ),
})

const STATUS_FILTERS: { value: Status | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'baru', label: 'Baru' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
]

export function PetaView() {
  const { reports, loading } = useApp()
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [focus, setFocus] = useState<{ id: string; coord: [number, number] } | null>(
    null,
  )

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (categoryFilter !== 'all' && r.kategori !== categoryFilter) return false
      return true
    })
  }, [reports, statusFilter, categoryFilter])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat data peta...</p>
  }

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100vh-8rem)] lg:flex-row">
      {/* Sidebar list */}
      <div className="flex w-full shrink-0 flex-col gap-4 lg:w-80">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <Button
              key={s.value}
              size="sm"
              variant={statusFilter === s.value ? 'default' : 'outline'}
              onClick={() => setStatusFilter(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={categoryFilter === 'all' ? 'secondary' : 'ghost'}
            onClick={() => setCategoryFilter('all')}
          >
            Semua Kategori
          </Button>
          {CATEGORIES.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={categoryFilter === c.id ? 'secondary' : 'ghost'}
              onClick={() => setCategoryFilter(c.id)}
              className="gap-1.5"
            >
              <CategoryIcon category={c.id} className="size-3.5" />
              {c.nama}
            </Button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {filtered.length} lokasi ditampilkan
        </p>

        <div className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto lg:max-h-none lg:flex-1">
          {filtered.map((r) => {
            const cat = CATEGORIES.find((c) => c.id === r.kategori)
            return (
              <Card
                key={r.id}
                onClick={() => setFocus({ id: r.id, coord: [r.lat, r.lng] })}
                className={`cursor-pointer p-3 transition-colors hover:border-primary/50 ${
                  focus?.id === r.id ? 'border-primary ring-1 ring-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md"
                    style={{
                      backgroundColor: `color-mix(in oklch, ${cat?.warna} 14%, transparent)`,
                      color: cat?.warna,
                    }}
                  >
                    <CategoryIcon category={r.kategori} className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.judul}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      {r.lokasi}
                    </p>
                    <div className="mt-1.5">
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Map */}
      <div className="h-[60vh] min-h-80 flex-1 overflow-hidden rounded-xl border lg:h-full">
        <PetaMap reports={filtered} focus={focus} />
      </div>
    </div>
  )
}
