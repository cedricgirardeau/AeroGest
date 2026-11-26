"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import AerodromeSelector from "./AerodromeSelector"

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between h-12">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="text-xl">☰</span>
          </button>

          {/* Logo pour mobile */}
          <Link href="/dashboard" className="lg:hidden">
            <span className="font-bold text-gray-800">AeroGest</span>
          </Link>

          {/* Sélecteur d'aérodrome */}
          <AerodromeSelector />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {session?.user && (
            <>
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{session.user.name}</span>
                <span className="text-xs text-gray-500 capitalize">{session.user.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm">
                {getInitials(session.user.name)}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}