"use client"

import { useState, useEffect } from "react"

interface FieldOption {
  key: string
  label: string
}

interface EntityFields {
  [key: string]: FieldOption[]
}

interface ExportQuery {
  entity: string
  fields: string[]
  filters: Record<string, any>
  sortBy: string
  sortOrder: 'asc' | 'desc'
  limit: number
}

interface ExportFormProps {
  query: ExportQuery
  setQuery: (query: ExportQuery) => void
  entityFields: EntityFields
  onPreview: () => void
  loading: boolean
}

const entities = [
  { value: 'dossiers_vol', label: 'Dossiers de vol' },
  { value: 'mouvements', label: 'Mouvements' },
  { value: 'aeronefs', label: 'Aéronefs' },
  { value: 'factures', label: 'Factures' },
  { value: 'clients', label: 'Clients' },
  { value: 'exploitants', label: 'Exploitants' },
]

export default function ExportForm({ query, setQuery, entityFields, onPreview, loading }: ExportFormProps) {
  const [availableFields, setAvailableFields] = useState<FieldOption[]>([])

  useEffect(() => {
    setAvailableFields(entityFields[query.entity] || [])
  }, [query.entity, entityFields])

  const handleEntityChange = (entity: string) => {
    setQuery({
      ...query,
      entity,
      fields: [],
      filters: {},
    })
  }

  const handleFieldToggle = (fieldKey: string) => {
    const newFields = query.fields.includes(fieldKey)
      ? query.fields.filter(f => f !== fieldKey)
      : [...query.fields, fieldKey]
    setQuery({ ...query, fields: newFields })
  }

  const handleFilterChange = (key: string, value: any) => {
    setQuery({
      ...query,
      filters: { ...query.filters, [key]: value }
    })
  }

  const handleLimitChange = (limit: number) => {
    setQuery({ ...query, limit })
  }

  const handleSortChange = (sortBy: string) => {
    setQuery({
      ...query,
      sortBy,
      sortOrder: query.sortBy === sortBy && query.sortOrder === 'asc' ? 'desc' : 'asc'
    })
  }

  return (
    <div className="space-y-6">
      {/* Sélection de l'entité */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Entité à exporter
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {entities.map((entity) => (
            <button
              key={entity.value}
              onClick={() => handleEntityChange(entity.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                query.entity === entity.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {entity.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sélection des champs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Champs à exporter
        </label>
        <div className="border border-gray-200 rounded-md p-4 max-h-48 overflow-y-auto">
          {availableFields.length === 0 ? (
            <p className="text-sm text-gray-500">
              Sélectionnez une entité pour voir les champs disponibles
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableFields.map((field) => (
                <label
                  key={field.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={query.fields.includes(field.key)}
                    onChange={() => handleFieldToggle(field.key)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filtres
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {query.entity === 'dossiers_vol' && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date de début</label>
                <input
                  type="date"
                  value={query.filters.dateStart || ''}
                  onChange={(e) => handleFilterChange('dateStart', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date de fin</label>
                <input
                  type="date"
                  value={query.filters.dateEnd || ''}
                  onChange={(e) => handleFilterChange('dateEnd', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Statut</label>
                <select
                  value={query.filters.statut || ''}
                  onChange={(e) => handleFilterChange('statut', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Tous</option>
                  <option value="OUVERT">Ouvert</option>
                  <option value="CLOTURE">Clôturé</option>
                  <option value="ANNULE">Annulé</option>
                </select>
              </div>
            </>
          )}

          {query.entity === 'factures' && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Statut</label>
                <select
                  value={query.filters.statut || ''}
                  onChange={(e) => handleFilterChange('statut', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Tous</option>
                  <option value="BROUILLON">Brouillon</option>
                  <option value="VALIDE">Validé</option>
                  <option value="PAYEE">Payée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tri et limite */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trier par
          </label>
          <select
            value={query.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Aucun tri</option>
            {availableFields.map((field) => (
              <option key={field.key} value={field.key}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordre
          </label>
          <select
            value={query.sortOrder}
            onChange={(e) => setQuery({ ...query, sortOrder: e.target.value as 'asc' | 'desc' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Limite
          </label>
          <select
            value={query.limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={10000}>Tous</option>
          </select>
        </div>
      </div>

      {/* Bouton de prévisualisation */}
      <div className="pt-4">
        <button
          onClick={onPreview}
          disabled={loading || query.fields.length === 0}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Prévisualisation...
            </span>
          ) : (
            'Prévisualiser'
          )}
        </button>
      </div>
    </div>
  )
}