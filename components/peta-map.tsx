'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { CATEGORY_MAP, MAP_CENTER, STATUS_LABEL } from '@/lib/data'
import type { Report } from '@/lib/types'

function pinIcon(color: string, active: boolean) {
  const size = active ? 34 : 26
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, 16, { duration: 0.8 })
  }, [target, map])
  return null
}

export default function PetaMap({
  reports,
  focus,
}: {
  reports: Report[]
  focus: { id: string; coord: [number, number] } | null
}) {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={13}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo target={focus ? focus.coord : null} />
      {reports.map((r) => {
        const cat = CATEGORY_MAP[r.kategori]
        const color = getColor(cat.warna)
        return (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={pinIcon(color, focus?.id === r.id)}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{r.judul}</div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
                  {cat.nama} · {STATUS_LABEL[r.status]}
                </div>
                <div style={{ fontSize: 12, marginBottom: 6 }}>{r.lokasi}</div>
                <Link
                  href={`/laporan/${r.id}`}
                  style={{ fontSize: 12, fontWeight: 600, color: '#0e7490' }}
                >
                  Lihat detail →
                </Link>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

// Konversi token var(--chart-x) menjadi warna solid untuk elemen non-CSS (Leaflet)
const COLOR_FALLBACK: Record<string, string> = {
  'var(--chart-1)': '#2b7a8c',
  'var(--chart-2)': '#d99329',
  'var(--chart-3)': '#3a9f6b',
  'var(--chart-4)': '#cf4f3a',
  'var(--chart-5)': '#6a63c4',
}

function getColor(token: string) {
  return COLOR_FALLBACK[token] ?? '#2b7a8c'
}
