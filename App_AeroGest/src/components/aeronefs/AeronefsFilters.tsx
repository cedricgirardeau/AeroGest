"use client"

import { useState, useEffect } from "react"

interface AeronefFiltersProps {
  filters: {
    immatriculation: string
    modele: string
    exploitant: string
    actif: string
    aerodrome: string
  }
  setFilters: (filters: any) => void
}

interface FilterOptions {
  modeles: { value: string; label: string }[]
  exploitants: { value: string; label: string }[]
}

export default function AeronefFilters({ filters, setFilters }: AeronefFiltersProps) {
  const [options, setOptions] = useState<FilterOptions>({
    modeles: [],
    exploitants: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger les options de filtres
    const fetchOptions = async () => {
      try {
        const [modelesRes, exploitantsRes] = await Promise.all([
          fetch('/api/modeles-aeronefs'),
          fetch('/api/exploitants'),
        ])

        const modeles = await modelesRes.json()
        const exploitants = await exploitantsRes.json()

        setOptions({
          modeles: modeles.map((m: any) => ({
            value: m.code_modele,
            label: `${m.code_modele} - ${m.libelle_modele}`,
          })),
          exploitants: exploitants.map((e: any) => ({
            value: e.id.toString(),
            label: e.raison_sociale,
          })),
        })
      } catch (error) {
        console.error('Erreur lors du chargement des options:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [])

  const handleChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleReset = () => {
    setFilters({
      immatriculation: '',
      modele: '',
      exploitant: '',
      actif: '',
      aerodrome: filters.aerodrome,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Immatriculation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Immatriculation
          </label>
          <input
            type="text"
            value={filters.immatriculation}
            onChange={(e) => handleChange('immatriculation', e.target.value)}
            placeholder="F-GXYZ"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Modèle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modèle
          </label>
          <select
            value={filters.modele}
            onChange={(e) => handleChange('modele', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled={loading}
          >
            <option value="">Tous les modèles</option>
            {options.modeles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Exploitant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exploitant
          </label>
          <select
            value={filters.exploitant}
            onChange={(e) => handleChange('exploitant', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            disabled={loading}
          >
            <option value="">Tous les exploitants</option>
            {options.exploitants.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={filters.actif}
            onChange={(e) => handleChange('actif', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
        </div>
      </div>
    </div>
  )
}