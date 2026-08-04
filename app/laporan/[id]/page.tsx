import { AppShell } from '@/components/app-shell'
import { ReportDetail } from '@/components/report-detail'

export default function ReportDetailPage() {
  return (
    <AppShell title="Detail Laporan" description="Rincian dan pelacakan status laporan">
      <ReportDetail />
    </AppShell>
  )
}
