'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import {
  ClipboardList,
  Inbox,
  Wrench,
  CircleCheckBig,
  ArrowRight,
} from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { CATEGORIES, CATEGORY_MAP, STATUS_LABEL } from '@/lib/data'
import type { CategoryId, Status } from '@/lib/types'
import { Card } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { CategoryIcon } from '@/components/category-icon'
import { ReportCard } from '@/components/report-card'

const STATUS_COLORS: Record<Status, string> = {
  baru: 'var(--chart-5)',
  diproses: 'var(--chart-2)',
  selesai: 'var(--chart-3)',
}

function KpiCard({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string
  value: number
  icon: typeof Inbox
  tint: string
}) {
  return (
    <Card className="flex flex-row items-center gap-4 p-5">
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `color-mix(in oklch, ${tint} 14%, transparent)`,
          color: tint,
        }}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="flex flex-col">
        <span className="text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </Card>
  )
}

export function Dashboard() {
  const { reports } = useApp()

  const stats = useMemo(() => {
    const byStatus: Record<Status, number> = { baru: 0, diproses: 0, selesai: 0 }
    const byCat: Record<string, number> = {}
    const byMonth: Record<string, number> = {}
    for (const r of reports) {
      byStatus[r.status]++
      byCat[r.kategori] = (byCat[r.kategori] ?? 0) + 1
      const m = r.tanggal.slice(0, 7)
      byMonth[m] = (byMonth[m] ?? 0) + 1
    }
    return { byStatus, byCat, byMonth }
  }, [reports])

  const catData = CATEGORIES.map((c) => ({
    kategori: c.nama.split(' ')[0],
    total: stats.byCat[c.id] ?? 0,
    fill: c.warna,
  }))

  const statusData = (Object.keys(stats.byStatus) as Status[]).map((s) => ({
    status: STATUS_LABEL[s],
    total: stats.byStatus[s],
    fill: STATUS_COLORS[s],
  }))

  const trendData = Object.entries(stats.byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month: new Date(month + '-01').toLocaleDateString('id-ID', {
        month: 'short',
      }),
      total,
    }))

  const catConfig: ChartConfig = { total: { label: 'Laporan' } }
  const trendConfig: ChartConfig = {
    total: { label: 'Laporan', color: 'var(--chart-1)' },
  }
  const statusConfig: ChartConfig = statusData.reduce((acc, d) => {
    acc[d.status] = { label: d.status, color: d.fill }
    return acc
  }, {} as ChartConfig)

  const recent = [...reports]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 4)

  const total = reports.length
  const selesaiPct = total
    ? Math.round((stats.byStatus.selesai / total) * 100)
    : 0

  return (
    <div className="flex flex-col gap-6">
      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Laporan" value={total} icon={ClipboardList} tint="var(--chart-1)" />
        <KpiCard label="Laporan Baru" value={stats.byStatus.baru} icon={Inbox} tint="var(--chart-5)" />
        <KpiCard label="Sedang Diproses" value={stats.byStatus.diproses} icon={Wrench} tint="var(--chart-2)" />
        <KpiCard label="Telah Selesai" value={stats.byStatus.selesai} icon={CircleCheckBig} tint="var(--chart-3)" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-foreground">Laporan per Kategori</h2>
              <p className="text-sm text-muted-foreground">
                Distribusi pengaduan berdasarkan jenis fasilitas
              </p>
            </div>
          </div>
          <ChartContainer config={catConfig} className="h-64 w-full">
            <BarChart data={catData} margin={{ left: -16, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="kategori"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {catData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-2">
            <h2 className="font-bold text-foreground">Status Penanganan</h2>
            <p className="text-sm text-muted-foreground">
              {selesaiPct}% laporan telah diselesaikan
            </p>
          </div>
          <ChartContainer
            config={statusConfig}
            className="mx-auto aspect-square h-52"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
              <Pie
                data={statusData}
                dataKey="total"
                nameKey="status"
                innerRadius={55}
                strokeWidth={4}
              >
                {statusData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-col gap-2">
            {statusData.map((d) => (
              <div key={d.status} className="flex items-center gap-2 text-sm">
                <span
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: d.fill }}
                />
                <span className="text-muted-foreground">{d.status}</span>
                <span className="ml-auto font-semibold text-foreground">
                  {d.total}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trend + Kategori */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="font-bold text-foreground">Tren Laporan Masuk</h2>
            <p className="text-sm text-muted-foreground">Jumlah per bulan</p>
          </div>
          <ChartContainer config={trendConfig} className="h-44 w-full">
            <AreaChart data={trendData} margin={{ left: -24, right: 8 }}>
              <defs>
                <linearGradient id="fillTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="total"
                type="monotone"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#fillTrend)"
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold text-foreground">Kategori Fasilitas</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/laporan?kategori=${c.id}`}
                className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-secondary/50"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${c.warna} 14%, transparent)`,
                    color: c.warna,
                  }}
                >
                  <CategoryIcon kategori={c.id as CategoryId} className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {c.nama}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stats.byCat[c.id] ?? 0} laporan
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-foreground">Laporan Terbaru</h2>
          <Link
            href="/laporan"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Lihat semua
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {recent.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </Card>
    </div>
  )
}
