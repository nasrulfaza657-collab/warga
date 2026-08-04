import { AppShell } from '@/components/app-shell'
import { BuatLaporanForm } from '@/components/buat-laporan-form'

export default function BuatPage() {
  return (
    <AppShell
      title="Buat Laporan"
      description="Laporkan kerusakan atau masalah fasilitas umum di sekitar Anda"
    >
      <BuatLaporanForm />
    </AppShell>
  )
}
