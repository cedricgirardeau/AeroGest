"use client"

import Link from "next/link"

const activities = [
  {
    id: 1,
    type: 'dossier',
    title: 'Dossier de vol LFPB-2026-000001',
    description: 'Airbus A320 - Air France - Arrivée à 10:15',
    time: 'Il y a 2 heures',
    status: 'CLOTURE',
    href: '/vols/LFPB-2026-000001',
  },
  {
    id: 2,
    type: 'mouvement',
    title: 'Mouvement local AERO1',
    description: 'Cessna 172 - Aéroclub de Beauvais - 3 touch and go',
    time: 'Il y a 5 heures',
    status: 'CLOTURE',
    href: '/vols/LFPB-2026-000002',
  },
  {
    id: 3,
    type: 'facture',
    title: 'Facture FACT-2026-000001',
    description: 'Air France - €1,800.00',
    time: 'Il y a 1 jour',
    status: 'VALIDE',
    href: '/facturation/FACT-2026-000001',
  },
  {
    id: 4,
    type: 'dossier',
    title: 'Dossier de vol LFPB-2026-000003',
    description: 'Robinson R44 - Jean Dupont - Vol local',
    time: 'Il y a 2 jours',
    status: 'OUVERT',
    href: '/vols/LFPB-2026-000003',
  },
]

const statusColors = {
  CLOTURE: 'bg-green-100 text-green-600',
  OUVERT: 'bg-blue-100 text-blue-600',
  VALIDE: 'bg-purple-100 text-purple-600',
  BROUILLON: 'bg-gray-100 text-gray-600',
}

const statusLabels = {
  CLOTURE: 'Clôturé',
  OUVERT: 'Ouvert',
  VALIDE: 'Validé',
  BROUILLON: 'Brouillon',
}

const icons = {
  dossier: '✈️',
  mouvement: '📍',
  facture: '💰',
}

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
        <Link href="/vols" className="text-sm text-blue-600 hover:text-blue-700">
          Voir tout
        </Link>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={activity.href}
            className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">{icons[activity.type as keyof typeof icons]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[activity.status as keyof typeof statusColors]}`}>
                    {statusLabels[activity.status as keyof typeof statusLabels]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}