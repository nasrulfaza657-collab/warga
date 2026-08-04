import { Route, Lightbulb, Droplets, Trash2, Trees, Wrench } from 'lucide-react'
import type { CategoryId } from '@/lib/types'

const ICONS = {
  jalan: Route,
  lampu: Lightbulb,
  drainase: Droplets,
  sampah: Trash2,
  taman: Trees,
  air: Wrench,
} as const

export function CategoryIcon({
  kategori,
  className,
}: {
  kategori: CategoryId
  className?: string
}) {
  const Icon = ICONS[kategori] ?? Route
  return <Icon className={className} aria-hidden="true" />
}
