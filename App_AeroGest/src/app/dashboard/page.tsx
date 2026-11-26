"use client"

import { useSession } from "next-auth/react"
import MainLayout from "@/components/layout/MainLayout"
import StatsCard from "@/components/dashboard/StatsCard"
import RecentActivity from "@/components/dashboard/RecentActivity"
import QuickActions from "@/components/dashboard/QuickActions"

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="mt-1 text-sm text-gray-600">
                Bienvenue sur AeroGest - {session?.user?.aerodrome_id && (
                  <span>🛬 {session.user.aerodrome_id}</span>
                )}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-500">
                Dernière connexion: {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Dossiers de vol"
            value="24"
            icon="✈️"
            color="blue"
            subtitle="Ce mois"
          />
          <StatsCard
            title="Mouvements"
            value="128"
            icon="📊"
            color="green"
            subtitle="Ce mois"
          />
          <StatsCard
            title="Factures"
            value="15"
            icon="💰"
            color="purple"
            subtitle="En attente"
          />
          <StatsCard
            title="Recette"
            value="€ 45,850"
            icon="💵"
            color="orange"
            subtitle="Ce mois"
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activité récente */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Actions rapides */}
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}