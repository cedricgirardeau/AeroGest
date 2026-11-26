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
    const clients = await prisma.client.findMany({
      include: {
        pays: true,
        exploitant: true,
      },
      orderBy: {
        raison_sociale: 'asc',
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des clients" },
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

    const client = await prisma.client.create({
      data: {
        raison_sociale: body.raison_sociale,
        code_pays: body.code_pays || null,
        adresse: body.adresse || null,
        code_postal: body.code_postal || null,
        ville: body.ville || null,
        telephone: body.telephone || null,
        email: body.email || null,
        siren: body.siren || null,
        tva_intra: body.tva_intra || null,
        exploitant_id: body.exploitant_id ? BigInt(body.exploitant_id) : null,
        actif: body.actif !== undefined ? body.actif : true,
      },
      include: {
        pays: true,
        exploitant: true,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du client" },
      { status: 500 }
    )
  }
}