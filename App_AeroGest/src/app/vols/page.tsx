"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import MainLayout from "@/components/layout/MainLayout"
import Link from "next/link"

export default function VolsPage() {
  const { data: session } = useSession()
  const [dossiers, setDossiers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDossiers()
  }, [session?.user?.aerodrome_id])

  const fetchDossiers = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (session?.user?.aerodrome_id) {
        params.append('aerodrome', session.user.aerodrome_id)
      }

      const response = await fetch(`/api/dossiers-vol?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des dossiers de vol')
      }

      const data = await response.json()
      setDossiers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: bigint) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce dossier de vol ?')) {
      return
    }

    try {
      const response = await fetch(`/api/dossiers-vol/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchDossiers()
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion des vols</h1>
            <p className="mt-1 text-sm text-gray-600">
              Liste des dossiers de vol et mouvements
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/vols/nouveau"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              + Nouveau dossier de vol
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aéronef
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exploitant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qualification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                        <span>Chargement...</span>
                      </div>
                    </td>
                  </tr>
                ) : dossiers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Aucun dossier de vol trouvé
                    </td>
                  </tr>
                ) : (
                  dossiers.map((dossier) => (
                    <tr key={dossier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/vols/${dossier.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          {dossier.numero_dossier}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(dossier.date_vol).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dossier.aeronef?.immatriculation || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dossier.exploitant?.raison_sociale || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dossier.qualification}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dossier.statut === 'CLOTURE' ? 'bg-green-100 text-green-800' :
                          dossier.statut === 'OUVERT' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {dossier.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/vols/${dossier.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(dossier.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}