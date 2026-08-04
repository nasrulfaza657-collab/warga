import type { Category, CategoryId, Report, Status, Priority } from './types'

export const CATEGORIES: Category[] = [
  {
    id: 'jalan',
    nama: 'Jalan & Trotoar',
    deskripsi: 'Jalan berlubang, aspal rusak, trotoar amblas',
    foto: '/images/jalan.png',
    warna: 'var(--chart-1)',
  },
  {
    id: 'lampu',
    nama: 'Lampu Penerangan',
    deskripsi: 'Lampu jalan mati, tiang miring, kabel terkelupas',
    foto: '/images/lampu.png',
    warna: 'var(--chart-2)',
  },
  {
    id: 'drainase',
    nama: 'Drainase & Saluran',
    deskripsi: 'Got tersumbat, saluran meluap, gorong-gorong pecah',
    foto: '/images/drainase.png',
    warna: 'var(--chart-5)',
  },
  {
    id: 'sampah',
    nama: 'Sampah & Kebersihan',
    deskripsi: 'Sampah menumpuk, TPS penuh, pembuangan liar',
    foto: '/images/sampah.png',
    warna: 'var(--chart-3)',
  },
  {
    id: 'taman',
    nama: 'Taman & Fasilitas',
    deskripsi: 'Taman rusak, bangku patah, fasilitas bermain',
    foto: '/images/taman.png',
    warna: 'var(--chart-4)',
  },
  {
    id: 'air',
    nama: 'Air & Pipa',
    deskripsi: 'Pipa bocor, hidran rusak, air PDAM mampet',
    foto: '/images/air.png',
    warna: 'var(--chart-1)',
  },
]

export const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c
    return acc
  },
  {} as Record<CategoryId, Category>,
)

export const STATUS_LABEL: Record<Status, string> = {
  baru: 'Baru',
  diproses: 'Diproses',
  selesai: 'Selesai',
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  rendah: 'Rendah',
  sedang: 'Sedang',
  tinggi: 'Tinggi',
}

// Pusat peta: kawasan Kota Bandung (koordinat demo)
export const MAP_CENTER: [number, number] = [-6.9147, 107.6098]

export const PETUGAS_LIST = [
  'Budi Santoso',
  'Dewi Lartika',
  'Agus Priyanto',
  'Rina Marlina',
]

export const REPORTS: Report[] = [
  {
    id: 'WC-2401',
    judul: 'Jalan berlubang besar di Jl. Merdeka',
    kategori: 'jalan',
    deskripsi:
      'Lubang berdiameter sekitar 60 cm di tengah jalan dekat perempatan. Sudah menyebabkan dua pengendara motor terjatuh minggu ini.',
    lokasi: 'Jl. Merdeka No. 12, Kel. Citarum',
    lat: -6.9101,
    lng: 107.6112,
    status: 'diproses',
    prioritas: 'tinggi',
    pelapor: 'Siti Rahayu',
    tanggal: '2026-07-28',
    foto: '/images/jalan.png',
    petugas: 'Budi Santoso',
    timeline: [
      { status: 'dilaporkan', tanggal: '2026-07-28', oleh: 'Siti Rahayu', catatan: 'Laporan dibuat oleh warga.' },
      { status: 'baru', tanggal: '2026-07-28', oleh: 'Sistem', catatan: 'Laporan masuk ke antrean verifikasi.' },
      { status: 'diproses', tanggal: '2026-07-30', oleh: 'Admin Dinas', catatan: 'Ditugaskan ke Budi Santoso untuk penambalan.' },
    ],
  },
  {
    id: 'WC-2402',
    judul: 'Lampu jalan mati di depan SDN 03',
    kategori: 'lampu',
    deskripsi:
      'Tiga titik lampu penerangan jalan mati total sejak seminggu lalu. Area menjadi gelap dan rawan pada malam hari.',
    lokasi: 'Jl. Pendidikan, Kel. Cihapit',
    lat: -6.9075,
    lng: 107.6205,
    status: 'baru',
    prioritas: 'sedang',
    pelapor: 'Ahmad Fauzi',
    tanggal: '2026-08-02',
    foto: '/images/lampu.png',
    petugas: null,
    timeline: [
      { status: 'dilaporkan', tanggal: '2026-08-02', oleh: 'Ahmad Fauzi', catatan: 'Laporan dibuat oleh warga.' },
      { status: 'baru', tanggal: '2026-08-02', oleh: 'Sistem', catatan: 'Menunggu verifikasi admin.' },
    ],
  },
  {
    id: 'WC-2403',
    judul: 'Saluran got tersumbat & meluap',
    kategori: 'drainase',
    deskripsi:
      'Got mampet oleh sampah dan lumpur, air meluap ke jalan setiap hujan deras. Menimbulkan genangan hingga 30 cm.',
    lokasi: 'Gg. Mawar III, Kel. Sukajadi',
    lat: -6.8934,
    lng: 107.5988,
    status: 'selesai',
    prioritas: 'tinggi',
    pelapor: 'Rina Wijaya',
    tanggal: '2026-07-15',
    foto: '/images/drainase.png',
    petugas: 'Agus Priyanto',
    timeline: [
      { status: 'dilaporkan', tanggal: '2026-07-15', oleh: 'Rina Wijaya', catatan: 'Laporan dibuat oleh warga.' },
      { status: 'baru', tanggal: '2026-07-15', oleh: 'Sistem', catatan: 'Laporan masuk.' },
      { status: 'diproses', tanggal: '2026-07-17', oleh: 'Admin Dinas', catatan: 'Ditugaskan ke tim pembersihan drainase.' },
      { status: 'selesai', tanggal: '2026-07-20', oleh: 'Agus Priyanto', catatan: 'Saluran telah dibersihkan dan air kembali lancar.' },
    ],
  },
  {
    id: 'WC-2404',
    judul: 'Sampah menumpuk di TPS liar',
    kategori: 'sampah',
    deskripsi:
      'Tumpukan sampah di lahan kosong sudah tidak diangkut selama dua minggu, menimbulkan bau dan lalat.',
    lokasi: 'Jl. Cikutra Barat, Kel. Neglasari',
    lat: -6.8998,
    lng: 107.6321,
    status: 'diproses',
    prioritas: 'sedang',
    pelapor: 'Joko Susilo',
    tanggal: '2026-07-31',
    foto: '/images/sampah.png',
    petugas: 'Rina Marlina',
    timeline: [
      { status: 'dilaporkan', tanggal: '2026-07-31', oleh: 'Joko Susilo', catatan: 'Laporan dibuat oleh warga.' },
      { status: 'baru', tanggal: '2026-07-31', oleh: 'Sistem', catatan: 'Laporan masuk.' },
      { status: 'diproses', tanggal: '2026-08-01', oleh: 'Admin Dinas', catatan: 'Dijadwalkan pengangkutan oleh armada kebersihan.' },
    ],
  },
  {
    id: 'WC-2405',
    judul: 'Bangku taman patah & ayunan rusak',
    kategori: 'taman',
    deskripsi:
      'Dua bangku beton retak dan ayunan anak lepas dari rantainya di Taman Flamboyan. Berbahaya untuk anak-anak.',
    lokasi: 'Taman Flamboyan, Kel. Turangga',
    lat: -6.9245,
    lng: 107.6289,
    status: 'baru',
    prioritas: 'rendah',
    pelapor: 'Maya Sari',
    tanggal: '2026-08-03',
    foto: '/images/taman.png',
    petugas: null,
    timeline: [
      { status: 'dilaporkan', tanggal: '2026-08-03', oleh: 'Maya Sari', catatan: 'Laporan dibuat oleh warga.' },
      { status: 'baru', tanggal: '2026-08-03', oleh: 'Sistem', catatan: 'Menunggu verifikasi admin.' },
    ],
  },
  {
    id: 'WC-2406',
    judul: 'Pipa PDAM bocor di bahu jalan',
    kategori: 'air',
    deskripsi:
      'Pipa air utama bocor sehingga air terus mengalir dan menggenangi trotoar. Tekanan air ke rumah warga menurun.',
    lokasi: 'Jl. Dipatiukur, Kel. Lebakgede',
    lat: -6.8905,
    lng: 107.6155,
    status: 'diproses',
    prioritas: 'tinggi',
    pelapor: 'Hendra Gunawan',
    tanggal: '2026-08-01',
    foto: '/images/air.png',
    petugas: 'Dewi Lartika',
    timeline: [
      { status: 'dilaporkan', tanggal: '2026-08-01', oleh: 'Hendra Gunawan', catatan: 'Laporan dibuat oleh warga.' },
      { status: 'baru', tanggal: '2026-08-01', oleh: 'Sistem', catatan: 'Laporan masuk.' },
      { status: 'diproses', tanggal: '2026-08-02', oleh: 'Admin Dinas', catatan: 'Tim teknis PDAM diturunkan ke lokasi.' },
    ],
  },
  {
    id: 'WC-2407',
    judul: 'Trotoar amblas dekat halte',
    kategori: 'jalan',
    deskripsi:
      'Sebagian trotoar amblas sekitar 20 cm sehingga menyulitkan pejalan kaki dan pengguna kursi roda.',
    lokasi: 'Jl. Asia Afrika, Kel. Braga',
    lat: -6.9218,
    lng: 107.6091,
    status: 'selesai',
    prioritas: 'sedang',
    pelapor: 'Lestari Ningsih',
    tanggal: '2026-07-10',
    foto: '/images/jalan.png',
    petugas: 'Budi Santoso',
    timeline: [
      { status: 'dilaporkan', tanggal: '2026-07-10', oleh: 'Lestari Ningsih', catatan: 'Laporan dibuat oleh warga.' },
      { status: 'baru', tanggal: '2026-07-10', oleh: 'Sistem', catatan: 'Laporan masuk.' },
      { status: 'diproses', tanggal: '2026-07-12', oleh: 'Admin Dinas', catatan: 'Ditugaskan untuk perbaikan trotoar.' },
      { status: 'selesai', tanggal: '2026-07-16', oleh: 'Budi Santoso', catatan: 'Trotoar telah dicor ulang dan diratakan.' },
    ],
  },
  {
    id: 'WC-2408',
    judul: 'Lampu taman berkedip & kabel terkelupas',
    kategori: 'lampu',
    deskripsi:
      'Lampu di area taman berkedip tidak stabil dan terdapat kabel terkelupas yang membahayakan pengunjung.',
    lokasi: 'Taman Lansia, Kel. Cihapit',
    lat: -6.9052,
    lng: 107.6238,
    status: 'baru',
    prioritas: 'sedang',
    pelapor: 'Bambang Iryanto',
    tanggal: '2026-08-04',
    foto: '/images/lampu.png',
    petugas: null,
    timeline: [
      { status: 'dilaporkan', tanggal: '2026-08-04', oleh: 'Bambang Iryanto', catatan: 'Laporan dibuat oleh warga.' },
      { status: 'baru', tanggal: '2026-08-04', oleh: 'Sistem', catatan: 'Menunggu verifikasi admin.' },
    ],
  },
]
