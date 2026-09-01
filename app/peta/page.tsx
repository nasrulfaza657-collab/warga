import { AppShell } from '@/components/app-shell'
import { PetaView } from '@/components/peta-view'

export default function PetaPage() {
  return (
    <AppShell
      title="Peta Lokasi"
      description="Sebaran titik laporan fasilitas umum di seluruh wilayah"
    >
      <PetaView />
    </AppShell>
  )
}
