import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/aeronefs - Liste des aéronefs avec filtres
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Session expirée" },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)

    const filters: any = {
      immatriculation: searchParams.get('immatriculation') || undefined,
      modele: searchParams.get('modele') || undefined,
      exploitant: searchParams.get('exploitant') || undefined,
      actif: searchParams.get('actif') !== '' ? searchParams.get('actif') === 'true' : undefined,
      aerodrome: session.user.aerodrome_id || undefined,
    }

    // Construire le where clause
    const where: any = {}

    if (filters.immatriculation) {
      where.immatriculation = { contains: filters.immatriculation, mode: 'insensitive' }
    }

    if (filters.modele) {
      where.code_modele = filters.modele
    }

    if (filters.exploitant) {
      where.exploitant_habituel_id = BigInt(filters.exploitant)
    }

    if (filters.actif !== undefined) {
      where.actif = filters.actif
    }

    const aeronefs = await prisma.aeronef.findMany({
      where,
      include: {
        modele: {
          include: {
            categorie: true,
          },
        },
        exploitant: true,
        client: true,
        pays: true,
      },
      orderBy: [
        { immatriculation: 'asc' },
      ],
    })

    return NextResponse.json(aeronefs)
  } catch (error) {
    console.error("Error fetching aeronefs:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des aéronefs" },
      { status: 500 }
    )
  }
}

// POST /api/aeronefs - Créer un nouvel aéronef
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Session expirée" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const aeronef = await prisma.aeronef.create({
      data: {
        immatriculation: body.immatriculation,
        code_pays_registre: body.code_pays_registre,
        code_modele: body.code_modele,
        exploitant_habituel_id: body.exploitant_id ? BigInt(body.exploitant_id) : null,
        client_id: body.client_id ? BigInt(body.client_id) : null,
        mtow_kg_override: body.mtow_kg_override ? parseFloat(body.mtow_kg_override) : null,
        adresse_mode_s: body.adresse_mode_s || null,
        actif: body.actif !== undefined ? body.actif : true,
      },
      include: {
        modele: true,
        exploitant: true,
        client: true,
        pays: true,
      },
    })

    return NextResponse.json(aeronef, { status: 201 })
  } catch (error) {
    console.error("Error creating aeronef:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de l'aéronef" },
      { status: 500 }
    )
  }
}