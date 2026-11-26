"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import MainLayout from "@/components/layout/MainLayout"
import ExportForm from "@/components/export/ExportForm"
import ExportResults from "@/components/export/ExportResults"

export default function ExportPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState({
    entity: 'dossiers_vol',
    fields: [],
    filters: {},
    sortBy: '',
    sortOrder: 'asc' as const,
    limit: 100,
  })

  const entityFields = {
    dossiers_vol: [
      { key: 'numero_dossier', label: 'Numéro de dossier' },
      { key: 'date_vol', label: 'Date du vol' },
      { key: 'aerodrome_source', label: 'Aérodrome source' },
      { key: 'aeronef.immatriculation', label: 'Immatriculation' },
      { key: 'aeronef.modele.libelle_modele', label: 'Modèle' },
      { key: 'exploitant.raison_sociale', label: 'Exploitant' },
      { key: 'qualification', label: 'Qualification' },
      { key: 'type_voyage_dgac', label: 'Type de voyage DGAC' },
      { key: 'nb_passagers', label: 'Nombre de passagers' },
      { key: 'statut', label: 'Statut' },
    ],
    mouvements: [
      { key: 'dossier.numero_dossier', label: 'Dossier' },
      { key: 'code_type_mouvement', label: 'Type de mouvement' },
      { key: 'debut_ts', label: 'Début' },
      { key: 'fin_ts', label: 'Fin' },
      { key: 'heure_bloc', label: 'Heure bloc' },
      { key: 'heure_piste', label: 'Heure piste' },
      { key: 'piste_utilisee', label: 'Piste utilisée' },
      { key: 'nb_touch_and_go', label: 'Touch and go' },
      { key: 'nb_remises_gaz', label: 'Remises de gaz' },
    ],
    aeronefs: [
      { key: 'immatriculation', label: 'Immatriculation' },
      { key: 'modele.code_modele', label: 'Code modèle' },
      { key: 'modele.libelle_modele', label: 'Modèle' },
      { key: 'exploitant.raison_sociale', label: 'Exploitant' },
      { key: 'client.raison_sociale', label: 'Client' },
      { key: 'mtow_kg_override', label: 'MTOW' },
      { key: 'adresse_mode_s', label: 'Adresse Mode S' },
      { key: 'actif', label: 'Actif' },
    ],
    factures: [
      { key: 'numero_facture', label: 'Numéro de facture' },
      { key: 'date_facture', label: 'Date' },
      { key: 'client.raison_sociale', label: 'Client' },
      { key: 'montant_ht', label: 'Montant HT' },
      { key: 'montant_tva', label: 'TVA' },
      { key: 'montant_ttc', label: 'Montant TTC' },
      { key: 'statut', label: 'Statut' },
    ],
    clients: [
      { key: 'raison_sociale', label: 'Raison sociale' },
      { key: 'siren', label: 'SIREN' },
      { key: 'tva_intra', label: 'TVA intracommunautaire' },
      { key: 'email', label: 'Email' },
      { key: 'telephone', label: 'Téléphone' },
      { key: 'adresse', label: 'Adresse' },
      { key: 'ville', label: 'Ville' },
      { key: 'code_postal', label: 'Code postal' },
      { key: 'actif', label: 'Actif' },
    ],
    exploitants: [
      { key: 'raison_sociale', label: 'Raison sociale' },
      { key: 'code_pays', label: 'Pays' },
      { key: 'code_type_exploitant', label: 'Type' },
      { key: 'cta_detenu', label: 'CTA détenu' },
      { key: 'code_transporteur', label: 'Code transporteur' },
    ],
  }

  const handleExport = async (format: 'csv' | 'xlsx' | 'json') => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...query,
          format,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\\'export')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export_${query.entity}_${new Date().toISOString().slice(0, 10)}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/export/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la prévisualisation')
      }

      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Export des données</h1>
            <p className="mt-1 text-sm text-gray-600">
              Exportez vos données au format CSV, XLSX ou JSON
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Formulaire d'export */}
        <div className="bg-white rounded-lg shadow p-6">
          <ExportForm
            query={query}
            setQuery={setQuery}
            entityFields={entityFields}
            onPreview={handlePreview}
            loading={loading}
          />
        </div>

        {/* Aperçu des résultats */}
        {data.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <ExportResults
              data={data}
              onExport={handleExport}
              loading={loading}
            />
          </div>
        )}
      </div>
    </MainLayout>
  )
}