'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  CirclePlus,
  MapPin,
  ShieldCheck,
  HardHat,
  User,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/components/app-provider'
import type { Role } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/laporan', label: 'Semua Laporan', icon: ClipboardList },
  { href: '/buat', label: 'Buat Laporan', icon: CirclePlus },
  { href: '/peta', label: 'Peta Lokasi', icon: MapPin },
]

const ROLE_META: Record<
  Role,
  { label: string; desc: string; icon: typeof User }
> = {
  warga: { label: 'Warga', desc: 'Pelapor', icon: User },
  admin: { label: 'Admin Dinas', desc: 'Verifikasi & penugasan', icon: ShieldCheck },
  petugas: { label: 'Petugas Lapangan', desc: 'Penindakan', icon: HardHat },
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <ShieldCheck className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-extrabold tracking-tight text-sidebar-foreground">
          WARGA CARE
        </span>
        <span className="text-[11px] font-medium text-sidebar-foreground/60">
          Pelaporan Fasilitas Umum
        </span>
      </span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            <Icon className="size-4.5" aria-hidden="true" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function RoleSwitcher() {
  const { role, setRole } = useApp()
  const meta = ROLE_META[role]
  const Icon = meta.icon
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-1.5 text-left transition-colors hover:bg-secondary">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-sm font-semibold text-foreground">
            {meta.label}
          </span>
          <span className="text-[11px] text-muted-foreground">{meta.desc}</span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Masuk sebagai (mode demo)
        </div>
        <DropdownMenuSeparator />
        {(Object.keys(ROLE_META) as Role[]).map((r) => {
          const m = ROLE_META[r]
          const RIcon = m.icon
          return (
            <DropdownMenuItem
              key={r}
              onClick={() => setRole(r)}
              className="gap-2.5 py-2"
            >
              <RIcon className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="flex flex-col">
                <span className="text-sm font-medium">{m.label}</span>
                <span className="text-xs text-muted-foreground">{m.desc}</span>
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-6 bg-sidebar p-5 lg:flex">
        <Brand />
        <NavLinks />
        <div className="mt-auto rounded-xl bg-sidebar-accent p-4">
          <p className="text-xs font-medium text-sidebar-foreground/70">
            Layanan pengaduan resmi warga untuk fasilitas umum. Laporkan, pantau,
            dan lihat tindak lanjutnya.
          </p>
        </div>
      </aside>

      {/* Sidebar - mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col gap-6 bg-sidebar p-5">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                className="text-sidebar-foreground/70"
                aria-label="Tutup menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-border bg-background/85 px-5 py-3 backdrop-blur lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-foreground lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="size-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="truncate text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <RoleSwitcher />
        </header>
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
