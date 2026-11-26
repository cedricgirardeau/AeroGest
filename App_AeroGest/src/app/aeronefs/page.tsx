"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import MainLayout from "@/components/layout/MainLayout"
import AeronefTable from "@/components/aeronefs/AeronefTable"
import AeronefFilters from "@/components/aeronefs/AeronefFilters"
import { Aeronef } from "@/types/aeronef"
import Link from "next/link"

export default function AeronefsPage() {
  const { data: session } = useSession()
  const [aeronefs, setAeronefs] = useState<Aeronef[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    immatriculation: '',
    modele: '',
    exploitant: '',
    actif: '',
    aerodrome: session?.user?.aerodrome_id || '',
  })

  useEffect(() => {
    fetchAeronefs()
  }, [filters, session?.user?.aerodrome_id])

  const fetchAeronefs = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/aeronefs?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des aéronefs')
      }

      const data = await response.json()
      setAeronefs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: bigint) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet aéronef ?')) {
      return
    }

    try {
      const response = await fetch(`/api/aeronefs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAeronefs()
      } else {
        throw new Error('Erreur lors de la suppression')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des aéronefs</h1>
            <p className="mt-1 text-sm text-gray-600">
              Liste des aéronefs enregistrés dans le système
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/aeronefs/nouveau"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              + Ajouter un aéronef
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Filtres */}
        <AeronefFilters filters={filters} setFilters={setFilters} />

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow">
          <AeronefTable
            aeronefs={aeronefs}
            loading={loading}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  )
}