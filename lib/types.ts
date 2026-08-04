export type Role = 'warga' | 'admin' | 'petugas'

export type CategoryId =
  | 'jalan'
  | 'lampu'
  | 'drainase'
  | 'sampah'
  | 'taman'
  | 'air'

export type Status = 'baru' | 'diproses' | 'selesai'

export type Priority = 'rendah' | 'sedang' | 'tinggi'

export interface TimelineEntry {
  status: Status | 'dilaporkan'
  tanggal: string
  oleh: string
  catatan: string
}

export interface Report {
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
  foto: string
  petugas: string | null
  timeline: TimelineEntry[]
}

export interface Category {
  id: CategoryId
  nama: string
  deskripsi: string
  foto: string
  warna: string
}
