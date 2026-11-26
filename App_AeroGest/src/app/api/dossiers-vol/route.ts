import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { generateDossierNumber } from "@/lib/utils"

const prisma = new PrismaClient()

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
      aerodrome: searchParams.get('aerodrome') || undefined,
      dateStart: searchParams.get('dateStart') || undefined,
      dateEnd: searchParams.get('dateEnd') || undefined,
      statut: searchParams.get('statut') || undefined,
      immatriculation: searchParams.get('immatriculation') || undefined,
    }

    const where: any = {}

    if (filters.aerodrome) {
      where.code_aerodrome_source = filters.aerodrome
    }

    if (filters.dateStart) {
      where.date_vol = { ...where.date_vol, gte: new Date(filters.dateStart) }
    }

    if (filters.dateEnd) {
      where.date_vol = { ...where.date_vol, lte: new Date(filters.dateEnd) }
    }

    if (filters.statut) {
      where.statut = filters.statut
    }

    if (filters.immatriculation) {
      where.aeronef = {
        immatriculation: { contains: filters.immatriculation, mode: 'insensitive' }
      }
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
        indicatif_oaci: true,
        type_voyage: true,
        mouvements: {
          include: {
            type_mouvement: true,
            aerodrome_escale: true,
          },
          orderBy: { ordre_chrono: 'asc' },
        },
      },
      orderBy: { date_vol: 'desc' },
    })

    return NextResponse.json(dossiers)
  } catch (error) {
    console.error("Error fetching dossiers vol:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des dossiers de vol" },
      { status: 500 }
    )
  }
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
    const body = await request.json()

    // Générer un numéro de dossier si non fourni
    const numeroDossier = body.numero_dossier ||
      generateDossierNumber(session.user.aerodrome_id || 'LFPB')

    const dossier = await prisma.dossierVol.create({
      data: {
        numero_dossier: numeroDossier,
        date_vol: new Date(body.date_vol),
        code_aerodrome_source: body.code_aerodrome_source,
        aeronef_id: BigInt(body.aeronef_id),
        exploitant_id: body.exploitant_id ? BigInt(body.exploitant_id) : null,
        indicatif_utilise: body.indicatif_utilise || null,
        code_indicatif_oaci: body.code_indicatif_oaci || null,
        qualification: body.qualification,
        type_voyage_dgac: body.type_voyage_dgac,
        regime_vol: body.regime_vol,
        case8_plan_vol: body.case8_plan_vol || null,
        circonstance_vol: body.circonstance_vol || 'N',
        vol_regulier: body.vol_regulier || false,
        nb_passagers: body.nb_passagers || 0,
        fret_kg: body.fret_kg || 0,
        poste_kg: body.poste_kg || 0,
        retard_minutes: body.retard_minutes || null,
        code_cause_retard: body.code_cause_retard || null,
        statut: body.statut || 'OUVERT',
        saisi_par: session.user.email,
      },
      include: {
        aerodrome_source: true,
        aeronef: {
          include: {
            modele: true,
            exploitant: true,
          },
        },
        exploitant: true,
        indicatif_oaci: true,
        type_voyage: true,
        mouvements: true,
      },
    })

    return NextResponse.json(dossier, { status: 201 })
  } catch (error) {
    console.error("Error creating dossier vol:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du dossier de vol" },
      { status: 500 }
    )
  }
}