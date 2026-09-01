'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, ListFilter, Inbox } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { CATEGORIES, STATUS_LABEL } from '@/lib/data'
import type { CategoryId, Status } from '@/lib/types'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ReportCard } from '@/components/report-card'
import { cn } from '@/lib/utils'

const STATUSES: Status[] = ['baru', 'diproses', 'selesai']

export function LaporanList() {
  const { reports, loading } = useApp()
  const searchParams = useSearchParams()
  const initialCat = searchParams.get('kategori') ?? 'all'

  const [query, setQuery] = useState('')
  const [kategori, setKategori] = useState<string>(initialCat)
  const [status, setStatus] = useState<string>('all')

  const filtered = useMemo(() => {
    return reports
      .filter((r) => (kategori === 'all' ? true : r.kategori === kategori))
      .filter((r) => (status === 'all' ? true : r.status === status))
      .filter((r) =>
        query.trim() === ''
          ? true
          : (r.judul + r.lokasi + r.id + r.pelapor)
              .toLowerCase()
              .includes(query.toLowerCase()),
      )
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
  }, [reports, kategori, status, query])

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: reports.length }
    for (const s of STATUSES) c[s] = reports.filter((r) => r.status === s).length
    return c
  }, [reports])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat laporan...</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Status quick filter */}
      <div className="flex flex-wrap gap-2">
        <StatusPill
          active={status === 'all'}
          onClick={() => setStatus('all')}
          label="Semua"
          count={statusCounts.all}
        />
        {STATUSES.map((s) => (
          <StatusPill
            key={s}
            active={status === s}
            onClick={() => setStatus(s)}
            label={STATUS_LABEL[s]}
            count={statusCounts[s]}
          />
        ))}
      </div>

      {/* Search + category */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, lokasi, ID, atau pelapor..."
            className="pl-9"
          />
        </div>
        <Select value={kategori} onValueChange={setKategori}>
          <SelectTrigger className="w-full sm:w-56">
            <ListFilter className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> laporan
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Inbox className="size-10 text-muted-foreground" />
          <p className="font-medium text-foreground">Tidak ada laporan ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Coba ubah kata kunci atau filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filtered.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatusPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:bg-secondary',
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-full px-1.5 text-xs',
          active ? 'bg-primary-foreground/20' : 'bg-muted',
        )}
      >
        {count}
      </span>
    </button>
  )
}
