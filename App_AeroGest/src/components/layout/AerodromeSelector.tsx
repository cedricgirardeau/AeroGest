"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AerodromeSelector() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [aerodromes, setAerodromes] = useState<any[]>([])
  const [selectedAerodrome, setSelectedAerodrome] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Récupérer la liste des aérodromes
    const fetchAerodromes = async () => {
      try {
        const response = await fetch("/api/aerodromes")
        const data = await response.json()
        setAerodromes(data)

        // Définir l'aérodrome sélectionné
        if (session?.user?.aerodrome_id) {
          setSelectedAerodrome(session.user.aerodrome_id)
        } else if (data.length > 0) {
          // Par défaut, sélectionner le premier aérodrome
          setSelectedAerodrome(data[0].code_oaci)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des aérodromes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAerodromes()
  }, [session])

  const handleSelectAerodrome = async (codeOaci: string) => {
    setSelectedAerodrome(codeOaci)
    setIsOpen(false)

    // Mettre à jour la session avec le nouvel aérodrome
    if (session?.user) {
      try {
        const response = await fetch("/api/auth/update-aerodrome", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aerodrome_id: codeOaci }),
        })

        if (response.ok) {
          // Mettre à jour la session localement
          await update({
            ...session,
            user: {
              ...session.user,
              aerodrome_id: codeOaci,
            },
          })

          // Rediriger vers le dashboard pour appliquer le changement
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'aérodrome:", error)
      }
    }
  }

  const getAerodromeLabel = (codeOaci: string) => {
    const aerodrome = aerodromes.find(a => a.code_oaci === codeOaci)
    return aerodrome ? `${codeOaci} - ${aerodrome.libelle}` : codeOaci
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Chargement...</span>
      </div>
    )
  }

  if (!selectedAerodrome) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sélectionnez un aérodrome</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition-colors"
      >
        <span className="text-gray-600">🛬</span>
        <span className="text-gray-800">{getAerodromeLabel(selectedAerodrome)}</span>
        <span className="text-gray-500">▼</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
            <div className="py-1">
              {aerodromes.map((aerodrome) => (
                <button
                  key={aerodrome.code_oaci}
                  onClick={() => handleSelectAerodrome(aerodrome.code_oaci)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    selectedAerodrome === aerodrome.code_oaci
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="font-medium">{aerodrome.code_oaci}</span> - {aerodrome.libelle}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}