import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Session expirée" },
      { status: 401 }
    )
  }

  try {
    const { aerodrome_id } = await request.json()

    if (!aerodrome_id) {
      return NextResponse.json(
        { error: "L'ID de l'aérodrome est requis" },
        { status: 400 }
      )
    }

    // Vérifier que l'aérodrome existe
    const aerodrome = await prisma.aerodrome.findUnique({
      where: { code_oaci: aerodrome_id },
    })

    if (!aerodrome) {
      return NextResponse.json(
        { error: "Aérodrome non trouvé" },
        { status: 404 }
      )
    }

    // Mettre à jour l'utilisateur
    await prisma.utilisateur.update({
      where: { id: BigInt(session.user.id) },
      data: { aerodrome_id },
    })

    return NextResponse.json(
      { success: true, message: "Aérodrome mis à jour avec succès" }
    )
  } catch (error) {
    console.error("Error updating aerodrome:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'aérodrome" },
      { status: 500 }
    )
  }
}