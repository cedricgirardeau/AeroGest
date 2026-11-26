import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/aeronefs/:id - Récupérer un aéronef
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Session expirée" },
      { status: 401 }
    )
  }

  try {
    const aeronef = await prisma.aeronef.findUnique({
      where: { id: BigInt(params.id) },
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
    })

    if (!aeronef) {
      return NextResponse.json(
        { error: "Aéronef non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json(aeronef)
  } catch (error) {
    console.error("Error fetching aeronef:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'aéronef" },
      { status: 500 }
    )
  }
}

// PUT /api/aeronefs/:id - Mettre à jour un aéronef
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Session expirée" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const aeronef = await prisma.aeronef.update({
      where: { id: BigInt(params.id) },
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

    return NextResponse.json(aeronef)
  } catch (error) {
    console.error("Error updating aeronef:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'aéronef" },
      { status: 500 }
    )
  }
}

// DELETE /api/aeronefs/:id - Supprimer un aéronef
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Session expirée" },
      { status: 401 }
    )
  }

  try {
    // Vérifier que l'aéronef n'est pas utilisé dans des dossiers de vol
    const dossierCount = await prisma.dossierVol.count({
      where: { aeronef_id: BigInt(params.id) },
    })

    if (dossierCount > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer : l'aéronef est utilisé dans des dossiers de vol" },
        { status: 400 }
      )
    }

    await prisma.aeronef.delete({
      where: { id: BigInt(params.id) },
    })

    return NextResponse.json(
      { success: true, message: "Aéronef supprimé avec succès" }
    )
  } catch (error) {
    console.error("Error deleting aeronef:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'aéronef" },
      { status: 500 }
    )
  }
}