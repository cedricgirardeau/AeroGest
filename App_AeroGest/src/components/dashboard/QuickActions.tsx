"use client"

import Link from "next/link"

const actions = [
  {
    title: "Nouveau dossier de vol",
    description: "Créer un nouveau dossier de vol",
    href: "/vols/nouveau",
    icon: "✈️",
    color: "blue",
  },
  {
    title: "Nouvelle facture",
    description: "Créer une nouvelle facture",
    href: "/facturation/nouvelle",
    icon: "💰",
    color: "green",
  },
  {
    title: "Nouvel aéronef",
    description: "Ajouter un aéronef",
    href: "/aeronefs/nouveau",
    icon: "🛩️",
    color: "purple",
  },
  {
    title: "Export données",
    description: "Exporter les données",
    href: "/export",
    icon: "📥",
    color: "orange",
  },
]

const colorClasses = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  green: 'bg-green-500 hover:bg-green-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  orange: 'bg-orange-500 hover:bg-orange-600',
}

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>

      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`block p-4 rounded-lg ${colorClasses[action.color as keyof typeof colorClasses]} text-white transition-colors`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{action.icon}</span>
              <div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}