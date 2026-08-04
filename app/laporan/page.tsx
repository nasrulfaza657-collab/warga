import { Suspense } from 'react'
import { AppShell } from '@/components/app-shell'
import { LaporanList } from '@/components/laporan-list'

export default function LaporanPage() {
  return (
    <AppShell
      title="Semua Laporan"
      description="Pantau dan telusuri status seluruh pengaduan warga"
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Memuat laporan...</p>}>
        <LaporanList />
      </Suspense>
    </AppShell>
  )
}
