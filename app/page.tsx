import { AppShell } from '@/components/app-shell'
import { Dashboard } from '@/components/dashboard'

export default function Page() {
  return (
    <AppShell
      title="Dashboard"
      description="Ringkasan pelaporan dan pemantauan fasilitas umum"
    >
      <Dashboard />
    </AppShell>
  )
}
