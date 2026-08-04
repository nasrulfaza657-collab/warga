'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { REPORTS } from '@/lib/data'
import type { Report, Role, Status, TimelineEntry } from '@/lib/types'

interface NewReportInput {
  judul: string
  kategori: Report['kategori']
  deskripsi: string
  lokasi: string
  prioritas: Report['prioritas']
  pelapor: string
  foto: string
  lat: number
  lng: number
}

interface AppContextValue {
  role: Role
  setRole: (role: Role) => void
  reports: Report[]
  addReport: (input: NewReportInput) => Report
  updateStatus: (
    id: string,
    status: Status,
    oleh: string,
    catatan: string,
    petugas?: string | null,
  ) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('warga')
  const [reports, setReports] = useState<Report[]>(REPORTS)

  const addReport = (input: NewReportInput) => {
    const id = `WC-${2409 + reports.filter((r) => r.id.startsWith('WC-24')).length}`
    const tanggal = todayISO()
    const report: Report = {
      ...input,
      id,
      status: 'baru',
      petugas: null,
      tanggal,
      timeline: [
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
      ],
    }
    setReports((prev) => [report, ...prev])
    return report
  }

  const updateStatus: AppContextValue['updateStatus'] = (
    id,
    status,
    oleh,
    catatan,
    petugas,
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const entry: TimelineEntry = {
          status,
          tanggal: todayISO(),
          oleh,
          catatan,
        }
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
    () => ({ role, setRole, reports, addReport, updateStatus }),
    [role, reports],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
