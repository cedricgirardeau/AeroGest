import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      aerodrome_id: string | null
      permissions?: string[]
    } & DefaultSession['user']
    accessToken?: string
    refreshToken?: string
    provider?: string
  }

  interface User {
    id: string
    email: string
    name: string
    role?: string
    aerodrome_id?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    aerodrome_id: string | null
    accessToken?: string
    refreshToken?: string
    provider?: string
  }
}