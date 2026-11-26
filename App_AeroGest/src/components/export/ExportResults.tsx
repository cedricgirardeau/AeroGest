"use client"

interface ExportResultsProps {
  data: any[]
  onExport: (format: 'csv' | 'xlsx' | 'json') => void
  loading: boolean
}

export default function ExportResults({ data, onExport, loading }: ExportResultsProps) {
  if (data.length === 0) {
    return null
  }

  // Extraire les clés du premier objet pour les colonnes
  const columns = Object.keys(data[0] || {})

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Aperçu des données ({data.length} enregistrements)
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onExport('csv')}
            disabled={loading}
            className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => onExport('xlsx')}
            disabled={loading}
            className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
          >
            Export XLSX
          </button>
          <button
            onClick={() => onExport('json')}
            disabled={loading}
            className="inline-flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium disabled:opacity-50"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Tableau de prévisualisation */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(0, 10).map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {formatValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 10 && (
        <p className="text-sm text-gray-500">
          Affichage des 10 premiers enregistrements sur {data.length}
        </p>
      )}
    </div>
  )
}

// Fonction pour formater les valeurs
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return 'N/A'
  }

  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non'
  }

  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toLocaleDateString('fr-FR')
    }
    return JSON.stringify(value)
  }

  if (typeof value === 'number') {
    // Vérifier si c'est un timestamp
    if (value > 10000000000) {
      return new Date(value).toLocaleDateString('fr-FR')
    }
    return value.toLocaleString('fr-FR')
  }

  return String(value)
}