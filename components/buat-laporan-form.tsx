'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ImagePlus, X, MapPin, Send } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { CATEGORIES, MAP_CENTER, PRIORITY_LABEL } from '@/lib/data'
import type { CategoryId, Priority } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CategoryIcon } from '@/components/category-icon'
import { cn } from '@/lib/utils'

const PRIORITIES: Priority[] = ['rendah', 'sedang', 'tinggi']

export function BuatLaporanForm() {
  const { addReport } = useApp()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [pelapor, setPelapor] = useState('')
  const [judul, setJudul] = useState('')
  const [kategori, setKategori] = useState<CategoryId | ''>('')
  const [prioritas, setPrioritas] = useState<Priority>('sedang')
  const [lokasi, setLokasi] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Koordinat titik demo: pusat peta + offset acak kecil
  const [coord] = useState<[number, number]>(() => [
    MAP_CENTER[0] + (Math.random() - 0.5) * 0.03,
    MAP_CENTER[1] + (Math.random() - 0.5) * 0.03,
  ])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pelapor.trim() || !judul.trim() || !kategori || !lokasi.trim() || !deskripsi.trim()) {
      toast.error('Mohon lengkapi semua kolom yang wajib diisi.')
      return
    }
    setSubmitting(true)
    try {
      const cat = CATEGORIES.find((c) => c.id === kategori)!
      const report = await addReport({
        judul: judul.trim(),
        kategori,
        deskripsi: deskripsi.trim(),
        lokasi: lokasi.trim(),
        prioritas,
        pelapor: pelapor.trim(),
        foto: cat.foto,
        lat: coord[0],
        lng: coord[1],
      })
      toast.success('Laporan berhasil dikirim. Terima kasih atas partisipasinya!')
      router.push(`/laporan/${report.id}`)
    } catch {
      toast.error('Gagal mengirim laporan. Silakan coba lagi.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pelapor">Nama Pelapor *</Label>
            <Input
              id="pelapor"
              value={pelapor}
              onChange={(e) => setPelapor(e.target.value)}
              placeholder="Nama lengkap Anda"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="judul">Judul Laporan *</Label>
            <Input
              id="judul"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Jalan berlubang di depan pasar"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Kategori Fasilitas *</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setKategori(c.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors',
                    kategori === c.id
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border hover:bg-secondary',
                  )}
                >
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-md"
                    style={{
                      backgroundColor: `color-mix(in oklch, ${c.warna} 14%, transparent)`,
                      color: c.warna,
                    }}
                  >
                    <CategoryIcon kategori={c.id} className="size-4" />
                  </span>
                  <span className="line-clamp-1 font-medium">{c.nama}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="deskripsi">Deskripsi Masalah *</Label>
            <Textarea
              id="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan kondisi, tingkat kerusakan, dan dampaknya bagi warga."
              rows={4}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-2">
            <Label>Foto Pendukung</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            {preview ? (
              <div className="relative overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview || '/placeholder.svg'}
                  alt="Pratinjau foto laporan"
                  className="aspect-video w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-foreground/70 text-background"
                  aria-label="Hapus foto"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-muted-foreground transition-colors hover:bg-secondary"
              >
                <ImagePlus className="size-7" />
                <span className="text-sm font-medium">Unggah foto</span>
                <span className="text-xs">JPG atau PNG</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="lokasi">Alamat / Lokasi *</Label>
            <Input
              id="lokasi"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Nama jalan, RT/RW, kelurahan"
            />
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              Titik: {coord[0].toFixed(4)}, {coord[1].toFixed(4)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="prioritas">Tingkat Prioritas</Label>
            <Select value={prioritas} onValueChange={(v) => setPrioritas(v as Priority)}>
              <SelectTrigger id="prioritas">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Button type="submit" disabled={submitting} className="w-full gap-2" size="lg">
          <Send className="size-4" />
          Kirim Laporan
        </Button>
      </div>
    </form>
  )
}
