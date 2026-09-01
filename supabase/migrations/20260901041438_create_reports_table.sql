/*
# Create reports table (single-tenant, no auth)

1. New Tables
- `reports`
  - `id` (text, primary key) — human-readable report ID like "WC-2401"
  - `judul` (text, not null) — report title
  - `kategori` (text, not null) — category: jalan, lampu, drainase, sampah, taman, air
  - `deskripsi` (text, not null) — problem description
  - `lokasi` (text, not null) — address/location string
  - `lat` (numeric, not null) — latitude
  - `lng` (numeric, not null) — longitude
  - `status` (text, not null, default 'baru') — baru, diproses, selesai
  - `prioritas` (text, not null, default 'sedang') — rendah, sedang, tinggi
  - `pelapor` (text, not null) — reporter name
  - `tanggal` (date, not null, default current date) — report date
  - `foto` (text) — photo URL
  - `petugas` (text) — assigned field officer name, nullable
  - `created_at` (timestamptz, default now())
- `report_timeline`
  - `id` (uuid, primary key)
  - `report_id` (text, foreign key to reports.id ON DELETE CASCADE)
  - `status` (text, not null) — dilaporkan, baru, diproses, selesai
  - `tanggal` (date, not null, default current date)
  - `oleh` (text, not null) — who made the change
  - `catatan` (text, not null) — note
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated full CRUD because this is a single-tenant demo app with intentionally shared/public data.

3. Notes
- Seed data is inserted after table creation to match the existing in-memory REPORTS array.
*/

CREATE TABLE IF NOT EXISTS reports (
  id text PRIMARY KEY,
  judul text NOT NULL,
  kategori text NOT NULL,
  deskripsi text NOT NULL,
  lokasi text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  status text NOT NULL DEFAULT 'baru',
  prioritas text NOT NULL DEFAULT 'sedang',
  pelapor text NOT NULL,
  tanggal date NOT NULL DEFAULT CURRENT_DATE,
  foto text,
  petugas text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id text NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  status text NOT NULL,
  tanggal date NOT NULL DEFAULT CURRENT_DATE,
  oleh text NOT NULL,
  catatan text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_timeline_report_id ON report_timeline(report_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_kategori ON reports(kategori);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_timeline ENABLE ROW LEVEL SECURITY;

-- reports policies
DROP POLICY IF EXISTS "anon_select_reports" ON reports;
CREATE POLICY "anon_select_reports" ON reports FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reports" ON reports;
CREATE POLICY "anon_insert_reports" ON reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reports" ON reports;
CREATE POLICY "anon_update_reports" ON reports FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reports" ON reports;
CREATE POLICY "anon_delete_reports" ON reports FOR DELETE
  TO anon, authenticated USING (true);

-- report_timeline policies
DROP POLICY IF EXISTS "anon_select_timeline" ON report_timeline;
CREATE POLICY "anon_select_timeline" ON report_timeline FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_timeline" ON report_timeline;
CREATE POLICY "anon_insert_timeline" ON report_timeline FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_timeline" ON report_timeline;
CREATE POLICY "anon_update_timeline" ON report_timeline FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_timeline" ON report_timeline;
CREATE POLICY "anon_delete_timeline" ON report_timeline FOR DELETE
  TO anon, authenticated USING (true);

-- Seed data
INSERT INTO reports (id, judul, kategori, deskripsi, lokasi, lat, lng, status, prioritas, pelapor, tanggal, foto, petugas) VALUES
('WC-2401', 'Jalan berlubang besar di Jl. Merdeka', 'jalan', 'Lubang berdiameter sekitar 60 cm di tengah jalan dekat perempatan. Sudah menyebabkan dua pengendara motor terjatuh minggu ini.', 'Jl. Merdeka No. 12, Kel. Citarum', -6.9101, 107.6112, 'diproses', 'tinggi', 'Siti Rahayu', '2026-07-28', '/images/jalan.png', 'Budi Santoso'),
('WC-2402', 'Lampu jalan mati di depan SDN 03', 'lampu', 'Tiga titik lampu penerangan jalan mati total sejak seminggu lalu. Area menjadi gelap dan rawan pada malam hari.', 'Jl. Pendidikan, Kel. Cihapit', -6.9075, 107.6205, 'baru', 'sedang', 'Ahmad Fauzi', '2026-08-02', '/images/lampu.png', NULL),
('WC-2403', 'Saluran got tersumbat & meluap', 'drainase', 'Got mampet oleh sampah dan lumpur, air meluap ke jalan setiap hujan deras. Menimbulkan genangan hingga 30 cm.', 'Gg. Mawar III, Kel. Sukajadi', -6.8934, 107.5988, 'selesai', 'tinggi', 'Rina Wijaya', '2026-07-15', '/images/drainase.png', 'Agus Priyanto'),
('WC-2404', 'Sampah menumpuk di TPS liar', 'sampah', 'Tumpukan sampah di lahan kosong sudah tidak diangkut selama dua minggu, menimbulkan bau dan lalat.', 'Jl. Cikutra Barat, Kel. Neglasari', -6.8998, 107.6321, 'diproses', 'sedang', 'Joko Susilo', '2026-07-31', '/images/sampah.png', 'Rina Marlina'),
('WC-2405', 'Bangku taman patah & ayunan rusak', 'taman', 'Dua bangku beton retak dan ayunan anak lepas dari rantainya di Taman Flamboyan. Berbahaya untuk anak-anak.', 'Taman Flamboyan, Kel. Turangga', -6.9245, 107.6289, 'baru', 'rendah', 'Maya Sari', '2026-08-03', '/images/taman.png', NULL),
('WC-2406', 'Pipa PDAM bocor di bahu jalan', 'air', 'Pipa air utama bocor sehingga air terus mengalir dan menggenangi trotoar. Tekanan air ke rumah warga menurun.', 'Jl. Dipatiukur, Kel. Lebakgede', -6.8905, 107.6155, 'diproses', 'tinggi', 'Hendra Gunawan', '2026-08-01', '/images/air.png', 'Dewi Lartika'),
('WC-2407', 'Trotoar amblas dekat halte', 'jalan', 'Sebagian trotoar amblas sekitar 20 cm sehingga menyulitkan pejalan kaki dan pengguna kursi roda.', 'Jl. Asia Afrika, Kel. Braga', -6.9218, 107.6091, 'selesai', 'sedang', 'Lestari Ningsih', '2026-07-10', '/images/jalan.png', 'Budi Santoso'),
('WC-2408', 'Lampu taman berkedip & kabel terkelupas', 'lampu', 'Lampu di area taman berkedip tidak stabil dan terdapat kabel terkelupas yang membahayakan pengunjung.', 'Taman Lansia, Kel. Cihapit', -6.9052, 107.6238, 'baru', 'sedang', 'Bambang Iryanto', '2026-08-04', '/images/lampu.png', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO report_timeline (report_id, status, tanggal, oleh, catatan) VALUES
('WC-2401', 'dilaporkan', '2026-07-28', 'Siti Rahayu', 'Laporan dibuat oleh warga.'),
('WC-2401', 'baru', '2026-07-28', 'Sistem', 'Laporan masuk ke antrean verifikasi.'),
('WC-2401', 'diproses', '2026-07-30', 'Admin Dinas', 'Ditugaskan ke Budi Santoso untuk penambalan.'),
('WC-2402', 'dilaporkan', '2026-08-02', 'Ahmad Fauzi', 'Laporan dibuat oleh warga.'),
('WC-2402', 'baru', '2026-08-02', 'Sistem', 'Menunggu verifikasi admin.'),
('WC-2403', 'dilaporkan', '2026-07-15', 'Rina Wijaya', 'Laporan dibuat oleh warga.'),
('WC-2403', 'baru', '2026-07-15', 'Sistem', 'Laporan masuk.'),
('WC-2403', 'diproses', '2026-07-17', 'Admin Dinas', 'Ditugaskan ke tim pembersihan drainase.'),
('WC-2403', 'selesai', '2026-07-20', 'Agus Priyanto', 'Saluran telah dibersihkan dan air kembali lancar.'),
('WC-2404', 'dilaporkan', '2026-07-31', 'Joko Susilo', 'Laporan dibuat oleh warga.'),
('WC-2404', 'baru', '2026-07-31', 'Sistem', 'Laporan masuk.'),
('WC-2404', 'diproses', '2026-08-01', 'Admin Dinas', 'Dijadwalkan pengangkutan oleh armada kebersihan.'),
('WC-2405', 'dilaporkan', '2026-08-03', 'Maya Sari', 'Laporan dibuat oleh warga.'),
('WC-2405', 'baru', '2026-08-03', 'Sistem', 'Menunggu verifikasi admin.'),
('WC-2406', 'dilaporkan', '2026-08-01', 'Hendra Gunawan', 'Laporan dibuat oleh warga.'),
('WC-2406', 'baru', '2026-08-01', 'Sistem', 'Laporan masuk.'),
('WC-2406', 'diproses', '2026-08-02', 'Admin Dinas', 'Tim teknis PDAM diturunkan ke lokasi.'),
('WC-2407', 'dilaporkan', '2026-07-10', 'Lestari Ningsih', 'Laporan dibuat oleh warga.'),
('WC-2407', 'baru', '2026-07-10', 'Sistem', 'Laporan masuk.'),
('WC-2407', 'diproses', '2026-07-12', 'Admin Dinas', 'Ditugaskan untuk perbaikan trotoar.'),
('WC-2407', 'selesai', '2026-07-16', 'Budi Santoso', 'Trotoar telah dicor ulang dan diratakan.'),
('WC-2408', 'dilaporkan', '2026-08-04', 'Bambang Iryanto', 'Laporan dibuat oleh warga.'),
('WC-2408', 'baru', '2026-08-04', 'Sistem', 'Menunggu verifikasi admin.')
ON CONFLICT DO NOTHING;
