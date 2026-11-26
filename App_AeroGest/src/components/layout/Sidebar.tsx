"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

const navItems = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: "📊",
    permission: null,
  },
  {
    label: "Vols & Mouvements",
    href: "/vols",
    icon: "✈️",
    permission: null,
  },
  {
    label: "Aéronefs",
    href: "/aeronefs",
    icon: "🛩️",
    permission: null,
  },
  {
    label: "Exploitants",
    href: "/exploitants",
    icon: "🏢",
    permission: null,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: "👥",
    permission: null,
  },
  {
    label: "Facturation",
    href: "/facturation",
    icon: "💰",
    permission: null,
  },
  {
    label: "Comptabilité",
    href: "/comptabilite",
    icon: "📈",
    permission: "GESTION_COMPTA",
  },
  {
    label: "Paramétrage",
    href: "/parametrage",
    icon: "⚙️",
    permission: "ADMINISTRATION",
  },
  {
    label: "Export",
    href: "/export",
    icon: "📥",
    permission: "EXPORT_DONNEES",
  },
]

const adminNavItems = [
  {
    label: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: "👤",
    permission: "ADMINISTRATION",
  },
  {
    label: "Rôles & Permissions",
    href: "/admin/roles",
    icon: "🔐",
    permission: "ADMINISTRATION",
  },
]

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const hasPermission = (permission: string | null) => {
    if (!permission) return true
    if (!session?.user?.permissions) return false
    return session.user.permissions.includes(permission)
  }

  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-800 text-white z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">AeroGest</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white">
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-[calc(100%-4rem)] p-4">
          {/* Menu principal */}
          <div className="flex-1">
            <h3 className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Menu principal
            </h3>
            <ul className="space-y-1">
              {navItems.map((item) => (
                hasPermission(item.permission) && (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        pathname === item.href || pathname.startsWith(`${item.href}/`)
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                      onClick={onClose}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </div>

          {/* Menu admin */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-700">
              <h3 className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Administration
              </h3>
              <ul className="space-y-1">
                {adminNavItems.map((item) => (
                  hasPermission(item.permission) && (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          pathname === item.href || pathname.startsWith(`${item.href}/`)
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                        onClick={onClose}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-700 mt-4">
            <div className="px-3 py-2 text-xs text-slate-400">
              <p>Version 1.0.0</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}