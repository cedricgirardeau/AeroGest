import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Fonctions réutilisées du fichier parent
async function getDossiersVol(fields: string[], filters: any, sortBy: string, sortOrder: string, limit: number) {
  const where: any = {}

  if (filters.dateStart) {
    where.date_vol = { ...where.date_vol, gte: new Date(filters.dateStart) }
  }
  if (filters.dateEnd) {
    where.date_vol = { ...where.date_vol, lte: new Date(filters.dateEnd) }
  }
  if (filters.statut) {
    where.statut = filters.statut
  }

  const dossiers = await prisma.dossierVol.findMany({
    where,
    include: {
      aerodrome_source: true,
      aeronef: {
        include: {
          modele: true,
          exploitant: true,
        },
      },
      exploitant: true,
      type_voyage: true,
    },
    orderBy: sortBy ? { [sortBy.split('.')[0]]: sortOrder } : { date_vol: 'desc' },
    take: limit === 10000 ? undefined : limit,
  })

  return formatData(dossiers, fields)
}

async function getMouvements(fields: string[], filters: any, sortBy: string, sortOrder: string, limit: number) {
  const where: any = {}

  const mouvements = await prisma.mouvement.findMany({
    where,
    include: {
      dossier: {
        include: {
          aeronef: {
            include: {
              modele: true,
            },
          },
        },
      },
      type_mouvement: true,
      aerodrome_escale: true,
    },
    orderBy: sortBy ? { [sortBy.split('.')[0]]: sortOrder } : { debut_ts: 'desc' },
    take: limit === 10000 ? undefined : limit,
  })

  return formatData(mouvements, fields)
}

async function getAeronefs(fields: string[], filters: any, sortBy: string, sortOrder: string, limit: number) {
  const where: any = {}

  if (filters.actif) {
    where.actif = filters.actif === 'true'
  }

  const aeronefs = await prisma.aeronef.findMany({
    where,
    include: {
      modele: true,
      exploitant: true,
      client: true,
      pays: true,
    },
    orderBy: sortBy ? { [sortBy.split('.')[0]]: sortOrder } : { immatriculation: 'asc' },
    take: limit === 10000 ? undefined : limit,
  })

  return formatData(aeronefs, fields)
}

async function getFactures(fields: string[], filters: any, sortBy: string, sortOrder: string, limit: number) {
  const where: any = {}

  if (filters.statut) {
    where.statut = filters.statut
  }

  const factures = await prisma.facture.findMany({
    where,
    include: {
      client: true,
      contrat: true,
      lignes_facture: {
        include: {
          dossier: true,
          mouvement: true,
          prestation: true,
          rubrique: true,
        },
      },
    },
    orderBy: sortBy ? { [sortBy.split('.')[0]]: sortOrder } : { date_facture: 'desc' },
    take: limit === 10000 ? undefined : limit,
  })

  return formatData(factures, fields)
}

async function getClients(fields: string[], filters: any, sortBy: string, sortOrder: string, limit: number) {
  const where: any = {}

  if (filters.actif) {
    where.actif = filters.actif === 'true'
  }

  const clients = await prisma.client.findMany({
    where,
    include: {
      pays: true,
      exploitant: true,
    },
    orderBy: sortBy ? { [sortBy.split('.')[0]]: sortOrder } : { raison_sociale: 'asc' },
    take: limit === 10000 ? undefined : limit,
  })

  return formatData(clients, fields)
}

async function getExploitants(fields: string[], filters: any, sortBy: string, sortOrder: string, limit: number) {
  const where: any = {}

  const exploitants = await prisma.exploitant.findMany({
    where,
    include: {
      pays: true,
      type: true,
    },
    orderBy: sortBy ? { [sortBy.split('.')[0]]: sortOrder } : { raison_sociale: 'asc' },
    take: limit === 10000 ? undefined : limit,
  })

  return formatData(exploitants, fields)
}

// Fonction pour formater les données
function formatData(data: any[], fields: string[]) {
  return data.map(item => {
    const result: any = {}

    fields.forEach(field => {
      const parts = field.split('.')
      let value: any = item

      for (const part of parts) {
        if (value && value.hasOwnProperty(part)) {
          value = value[part]
        } else {
          value = null
          break
        }
      }

      if (value instanceof Date) {
        result[field] = value.toISOString().split('T')[0]
      } else if (typeof value === 'object' && value !== null) {
        result[field] = JSON.stringify(value)
      } else {
        result[field] = value
      }
    })

    return result
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Session expirée" },
      { status: 401 }
    )
  }

  try {
    const { entity, fields, filters, sortBy, sortOrder, limit } = await request.json()

    if (!entity || !fields) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      )
    }

    // Récupérer les données en fonction de l'entité
    let data: any[] = []

    switch (entity) {
      case 'dossiers_vol':
        data = await getDossiersVol(fields, filters, sortBy, sortOrder, limit)
        break
      case 'mouvements':
        data = await getMouvements(fields, filters, sortBy, sortOrder, limit)
        break
      case 'aeronefs':
        data = await getAeronefs(fields, filters, sortBy, sortOrder, limit)
        break
      case 'factures':
        data = await getFactures(fields, filters, sortBy, sortOrder, limit)
        break
      case 'clients':
        data = await getClients(fields, filters, sortBy, sortOrder, limit)
        break
      case 'exploitants':
        data = await getExploitants(fields, filters, sortBy, sortOrder, limit)
        break
      default:
        return NextResponse.json(
          { error: "Entité inconnue" },
          { status: 400 }
        )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error previewing data:", error)
    return NextResponse.json(
      { error: "Erreur lors de la prévisualisation des données" },
      { status: 500 }
    )
  }
}