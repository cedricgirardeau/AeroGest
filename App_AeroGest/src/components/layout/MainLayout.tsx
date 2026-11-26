"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page de connexion si non authentifié
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Afficher un loader pendant le chargement de la session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="text-gray-700">Chargement...</span>
        </div>
      </div>
    )
  }

  // Si non authentifié, ne pas afficher le contenu
  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Topbar */}
        <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}