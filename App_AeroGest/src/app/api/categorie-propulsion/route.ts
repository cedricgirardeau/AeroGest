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
    const categories = await prisma.categoriePropulsion.findMany({
      orderBy: {
        libelle: 'asc',
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories propulsion:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories de propulsion" },
      { status: 500 }
    )
  }
}