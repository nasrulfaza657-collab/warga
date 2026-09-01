'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  HardHat,
  CircleDot,
  CircleCheckBig,
  Wrench,
  Send,
  Inbox,
} from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { CATEGORY_MAP, PETUGAS_LIST, STATUS_LABEL } from '@/lib/data'
import type { Status, TimelineEntry } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge, PriorityBadge } from '@/components/status-badge'
import { CategoryIcon } from '@/components/category-icon'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const TIMELINE_ICON: Record<string, typeof CircleDot> = {
  dilaporkan: Send,
  baru: Inbox,
  diproses: Wrench,
  selesai: CircleCheckBig,
}

export function ReportDetail() {
  const params = useParams<{ id: string }>()
  const { reports, role, updateStatus, loading } = useApp()
  const report = reports.find((r) => r.id === params.id)

  const [catatan, setCatatan] = useState('')
  const [petugas, setPetugas] = useState('')

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Memuat detail laporan...</p>
    )
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-lg font-semibold">Laporan tidak ditemukan</p>
        <Button asChild variant="outline">
          <Link href="/laporan">Kembali ke daftar</Link>
        </Button>
      </div>
    )
  }

  const cat = CATEGORY_MAP[report.kategori]

  const handleVerify = async () => {
    if (!petugas) {
      toast.error('Pilih petugas lapangan terlebih dahulu.')
      return
    }
    try {
      await updateStatus(
        report.id,
        'diproses',
        'Admin Dinas',
        catatan.trim() || `Ditugaskan ke ${petugas} untuk penanganan.`,
        petugas,
      )
      setCatatan('')
      toast.success(`Laporan diverifikasi dan ditugaskan ke ${petugas}.`)
    } catch {
      toast.error('Gagal memperbarui status. Silakan coba lagi.')
    }
  }

  const handleComplete = async (oleh: string) => {
    try {
      await updateStatus(
        report.id,
        'selesai',
        oleh,
        catatan.trim() || 'Penanganan telah selesai dilakukan.',
      )
      setCatatan('')
      toast.success('Laporan ditandai selesai.')
    } catch {
      toast.error('Gagal memperbarui status. Silakan coba lagi.')
    }
  }

  const showAdminAction = role === 'admin' && report.status === 'baru'
  const showPetugasAction =
    role === 'petugas' && report.status === 'diproses'
  const hasAction = showAdminAction || showPetugasAction

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/laporan"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar laporan
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="overflow-hidden p-0">
            <div className="relative aspect-video w-full bg-muted">
              <Image
                src={report.foto || '/placeholder.svg'}
                alt={`Foto laporan ${report.judul}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 640px"
                priority
              />
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">
                  <CategoryIcon kategori={report.kategori} className="size-3.5" />
                  {cat.nama}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {report.id}
                </span>
                <StatusBadge status={report.status} />
                <PriorityBadge prioritas={report.prioritas} />
              </div>
              <h2 className="text-pretty text-xl font-bold text-foreground">
                {report.judul}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {report.deskripsi}
              </p>
              <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
                <InfoRow icon={MapPin} label="Lokasi" value={report.lokasi} />
                <InfoRow icon={Calendar} label="Tanggal lapor" value={formatDate(report.tanggal)} />
                <InfoRow icon={User} label="Pelapor" value={report.pelapor} />
                <InfoRow
                  icon={HardHat}
                  label="Petugas"
                  value={report.petugas ?? 'Belum ditugaskan'}
                />
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-5">
            <h3 className="mb-4 font-bold text-foreground">Riwayat Penanganan</h3>
            <Timeline entries={report.timeline} />
          </Card>
        </div>

        {/* Side column: actions */}
        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <h3 className="mb-1 font-bold text-foreground">Status Saat Ini</h3>
            <div className="mb-4">
              <StatusBadge status={report.status} />
            </div>
            <StatusStepper status={report.status} />
          </Card>

          {hasAction && (
            <Card className="flex flex-col gap-4 p-5">
              <h3 className="font-bold text-foreground">
                {showAdminAction ? 'Verifikasi & Tugaskan' : 'Tindak Lanjut Lapangan'}
              </h3>

              {showAdminAction && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="petugas">Tugaskan petugas</Label>
                  <Select value={petugas} onValueChange={setPetugas}>
                    <SelectTrigger id="petugas">
                      <SelectValue placeholder="Pilih petugas lapangan" />
                    </SelectTrigger>
                    <SelectContent>
                      {PETUGAS_LIST.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="catatan">Catatan</Label>
                <Textarea
                  id="catatan"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder={
                    showAdminAction
                      ? 'Instruksi untuk petugas (opsional)'
                      : 'Ringkasan tindakan yang dilakukan (opsional)'
                  }
                  rows={3}
                />
              </div>

              {showAdminAction ? (
                <Button onClick={handleVerify} className="w-full gap-2">
                  <Wrench className="size-4" />
                  Verifikasi & Proses
                </Button>
              ) : (
                <Button
                  onClick={() => handleComplete(report.petugas ?? 'Petugas Lapangan')}
                  className="w-full gap-2"
                >
                  <CircleCheckBig className="size-4" />
                  Tandai Selesai
                </Button>
              )}
            </Card>
          )}

          {!hasAction && report.status !== 'selesai' && (
            <Card className="p-5 text-sm text-muted-foreground">
              {role === 'warga'
                ? 'Anda memantau laporan ini sebagai warga. Status akan diperbarui oleh admin dan petugas.'
                : role === 'admin'
                  ? 'Laporan ini sedang ditangani petugas lapangan.'
                  : 'Laporan ini menunggu verifikasi admin sebelum dapat ditindaklanjuti.'}
            </Card>
          )}

          {report.status === 'selesai' && (
            <Card className="flex items-center gap-3 border-status-selesai bg-status-selesai/40 p-5">
              <CircleCheckBig className="size-8 text-status-selesai-foreground" />
              <p className="text-sm font-medium text-status-selesai-foreground">
                Laporan ini telah selesai ditangani.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  )
}

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="flex flex-col">
      {entries.map((e, i) => {
        const Icon = TIMELINE_ICON[e.status] ?? CircleDot
        const isLast = i === entries.length - 1
        return (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={
                  'flex size-8 items-center justify-center rounded-full ' +
                  (isLast
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground')
                }
              >
                <Icon className="size-4" />
              </span>
              {!isLast && <span className="w-px flex-1 bg-border" />}
            </div>
            <div className={'flex flex-col pb-6 ' + (isLast ? 'pb-0' : '')}>
              <span className="text-sm font-semibold capitalize text-foreground">
                {e.status === 'dilaporkan'
                  ? 'Dilaporkan'
                  : STATUS_LABEL[e.status as Status]}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(e.tanggal)} · {e.oleh}
              </span>
              <p className="mt-1 text-sm text-muted-foreground">{e.catatan}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

const STEPS: Status[] = ['baru', 'diproses', 'selesai']

function StatusStepper({ status }: { status: Status }) {
  const currentIndex = STEPS.indexOf(status)
  return (
    <div className="flex flex-col gap-3">
      {STEPS.map((s, i) => {
        const done = i <= currentIndex
        return (
          <div key={s} className="flex items-center gap-3">
            <span
              className={
                'flex size-6 items-center justify-center rounded-full text-xs font-bold ' +
                (done
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground')
              }
            >
              {i + 1}
            </span>
            <span
              className={
                'text-sm ' +
                (done ? 'font-semibold text-foreground' : 'text-muted-foreground')
              }
            >
              {STATUS_LABEL[s]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
