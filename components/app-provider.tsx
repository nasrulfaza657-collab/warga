'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'
import type { Report, Role, Status, TimelineEntry, CategoryId, Priority } from '@/lib/types'

interface NewReportInput {
  judul: string
  kategori: CategoryId
  deskripsi: string
  lokasi: string
  prioritas: Priority
  pelapor: string
  foto: string
  lat: number
  lng: number
}

interface AppContextValue {
  role: Role
  setRole: (role: Role) => void
  reports: Report[]
  loading: boolean
  addReport: (input: NewReportInput) => Promise<Report>
  updateStatus: (
    id: string,
    status: Status,
    oleh: string,
    catatan: string,
    petugas?: string | null,
  ) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

interface DbReport {
  id: string
  judul: string
  kategori: CategoryId
  deskripsi: string
  lokasi: string
  lat: number
  lng: number
  status: Status
  prioritas: Priority
  pelapor: string
  tanggal: string
  foto: string | null
  petugas: string | null
}

interface DbTimeline {
  id: string
  report_id: string
  status: Status | 'dilaporkan'
  tanggal: string
  oleh: string
  catatan: string
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('warga')
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data: dbReports, error } = await supabase
        .from('reports')
        .select('*')
        .order('tanggal', { ascending: false })

      if (error || !dbReports) {
        if (!cancelled) setLoading(false)
        return
      }

      const { data: dbTimeline } = await supabase
        .from('report_timeline')
        .select('*')
        .order('created_at', { ascending: true })

      const timelineByReport: Record<string, TimelineEntry[]> = {}
      for (const t of (dbTimeline ?? []) as DbTimeline[]) {
        if (!timelineByReport[t.report_id]) timelineByReport[t.report_id] = []
        timelineByReport[t.report_id].push({
          status: t.status,
          tanggal: t.tanggal,
          oleh: t.oleh,
          catatan: t.catatan,
        })
      }

      const mapped: Report[] = (dbReports as DbReport[]).map((r) => ({
        id: r.id,
        judul: r.judul,
        kategori: r.kategori,
        deskripsi: r.deskripsi,
        lokasi: r.lokasi,
        lat: Number(r.lat),
        lng: Number(r.lng),
        status: r.status,
        prioritas: r.prioritas,
        pelapor: r.pelapor,
        tanggal: r.tanggal,
        foto: r.foto ?? '',
        petugas: r.petugas,
        timeline: timelineByReport[r.id] ?? [],
      }))

      if (!cancelled) {
        setReports(mapped)
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const addReport: AppContextValue['addReport'] = async (input) => {
    const id = `WC-${2409 + reports.filter((r) => r.id.startsWith('WC-24')).length}`
    const tanggal = todayISO()

    const { error: insertError } = await supabase.from('reports').insert({
      id,
      judul: input.judul,
      kategori: input.kategori,
      deskripsi: input.deskripsi,
      lokasi: input.lokasi,
      lat: input.lat,
      lng: input.lng,
      status: 'baru',
      prioritas: input.prioritas,
      pelapor: input.pelapor,
      tanggal,
      foto: input.foto,
      petugas: null,
    })

    if (insertError) throw insertError

    const timelineEntries: Omit<DbTimeline, 'id' | 'report_id' | 'created_at'>[] = [
      {
        status: 'dilaporkan',
        tanggal,
        oleh: input.pelapor,
        catatan: 'Laporan dibuat oleh warga.',
      },
      {
        status: 'baru',
        tanggal,
        oleh: 'Sistem',
        catatan: 'Menunggu verifikasi admin.',
      },
    ]

    await supabase.from('report_timeline').insert(
      timelineEntries.map((t) => ({
        report_id: id,
        status: t.status,
        tanggal: t.tanggal,
        oleh: t.oleh,
        catatan: t.catatan,
      })),
    )

    const report: Report = {
      ...input,
      id,
      status: 'baru',
      petugas: null,
      tanggal,
      timeline: timelineEntries.map((t) => ({
        status: t.status,
        tanggal: t.tanggal,
        oleh: t.oleh,
        catatan: t.catatan,
      })),
    }

    setReports((prev) => [report, ...prev])
    return report
  }

  const updateStatus: AppContextValue['updateStatus'] = async (
    id,
    status,
    oleh,
    catatan,
    petugas,
  ) => {
    const tanggal = todayISO()

    const updateData: Record<string, unknown> = { status }
    if (petugas !== undefined) updateData.petugas = petugas

    const { error: updateError } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)

    if (updateError) throw updateError

    await supabase.from('report_timeline').insert({
      report_id: id,
      status,
      tanggal,
      oleh,
      catatan,
    })

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const entry: TimelineEntry = { status, tanggal, oleh, catatan }
        return {
          ...r,
          status,
          petugas: petugas !== undefined ? petugas : r.petugas,
          timeline: [...r.timeline, entry],
        }
      }),
    )
  }

  const value = useMemo(
    () => ({ role, setRole, reports, loading, addReport, updateStatus }),
    [role, reports, loading],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
