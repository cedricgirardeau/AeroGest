import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import MicrosoftEntraIdProvider from 'next-auth/providers/microsoft-entra-id'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Authentification locale
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        aerodrome_id: { label: "Aérodrome", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.utilisateur.findUnique({
          where: { email: credentials.email as string },
          include: { role: true }
        })

        if (!user || !user.password_hash || !user.actif) {
          throw new Error('Invalid email or password')
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        )

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        // Mettre à jour l'aérodrome de rattachement si fourni
        if (credentials.aerodrome_id) {
          await prisma.utilisateur.update({
            where: { id: user.id },
            data: { aerodrome_id: credentials.aerodrome_id as string }
          })
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.prenom || ''} ${user.nom || ''}`.trim(),
          role: user.role?.code || 'UTILISATEUR',
          aerodrome_id: user.aerodrome_id,
        }
      }
    }),

    // Authentification Microsoft Entra ID (Office 365)
    MicrosoftEntraIdProvider({
      clientId: process.env.MICROSOFT_ENTRA_ID_CLIENT_ID || '',
      clientSecret: process.env.MICROSOFT_ENTRA_ID_CLIENT_SECRET || '',
      tenantId: process.env.MICROSOFT_ENTRA_ID_TENANT_ID || '',
      authorization: {
        params: {
          scope: 'openid email profile User.Read',
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'UTILISATEUR'
        token.aerodrome_id = (user as any).aerodrome_id
      }

      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role as string
        session.user.aerodrome_id = token.aerodrome_id as string | null
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
        session.provider = token.provider as string | undefined
      }

      // Récupérer les permissions de l'utilisateur
      const user = await prisma.utilisateur.findUnique({
        where: { id: BigInt(session.user.id) },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      })

      if (user?.role) {
        const permissions = user.role.permissions.map(rp => rp.permission.code)
        session.user.permissions = permissions
      }

      return session
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Pour Microsoft Entra ID, vérifier si l'utilisateur existe
      if (account?.provider === 'microsoft-entra-id') {
        const email = user.email
        if (!email) return false

        let dbUser = await prisma.utilisateur.findUnique({
          where: { email },
        })

        if (!dbUser) {
          // Créer un nouvel utilisateur
          dbUser = await prisma.utilisateur.create({
            data: {
              email,
              nom: profile?.family_name || '',
              prenom: profile?.given_name || '',
              provider: 'microsoft',
              provider_id: profile?.sub || profile?.oid,
              aerodrome_id: null, // À sélectionner après connexion
              role_id: 4, // UTILISATEUR par défaut
              actif: true,
            },
          })
        } else {
          // Mettre à jour les infos du provider
          await prisma.utilisateur.update({
            where: { id: dbUser.id },
            data: {
              provider: 'microsoft',
              provider_id: profile?.sub || profile?.oid,
              nom: profile?.family_name || dbUser.nom,
              prenom: profile?.given_name || dbUser.prenom,
            },
          })
        }

        user.id = dbUser.id.toString()
        user.name = `${dbUser.prenom || ''} ${dbUser.nom || ''}`.trim()
      }

      return true
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)