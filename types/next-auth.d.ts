import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      uid?: number
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    uid?: number
    emailVerified?: Date | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    uid?: number
  }
}
