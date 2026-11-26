import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Session expirée" },
      { status: 401 }
    )
  }

  try {
    const modeles = await prisma.modeleAeronef.findMany({
      include: {
        categorie: true,
      },
      orderBy: {
        libelle_modele: 'asc',
      },
    })

    return NextResponse.json(modeles)
  } catch (error) {
    console.error("Error fetching modeles aeronefs:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des modèles d'aéronefs" },
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

    const modele = await prisma.modeleAeronef.create({
      data: {
        code_modele: body.code_modele,
        libelle_modele: body.libelle_modele,
        categorie_propulsion: body.categorie_propulsion,
        is_helico: body.is_helico || false,
        mtow_kg: body.mtow_kg ? parseFloat(body.mtow_kg) : null,
      },
      include: {
        categorie: true,
      },
    })

    return NextResponse.json(modele, { status: 201 })
  } catch (error) {
    console.error("Error creating modele aeronef:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du modèle d'aéronef" },
      { status: 500 }
    )
  }
}