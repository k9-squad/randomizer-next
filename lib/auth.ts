import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { sql } from "./db"

export const authConfig: NextAuthConfig = {
  providers: [
    // 邮箱密码登录
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // 查询用户
          const result = await sql`
            SELECT id, email, name, password, image, email_verified, uid
            FROM users 
            WHERE email = ${credentials.email as string}
          `

          const user = result[0]
          if (!user || !user.password) {
            return null
          }

          // 验证密码
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) {
            return null
          }

          // 检查邮箱是否已验证
          if (!user.email_verified) {
            throw new Error("EmailNotVerified")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            uid: user.uid,
            emailVerified: user.email_verified
          }
        } catch (error) {
          console.error("Auth error:", error)
          // 重新抛出特定错误
          if ((error as Error).message === "EmailNotVerified") {
            throw error
          }
          return null
        }
      }
    }),

    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        // 检查用户是否存在
        const existingUser = await sql`
          SELECT id FROM users WHERE email = ${user.email}
        `

        if (existingUser.length === 0) {
          // 创建新用户（OAuth登录时）
          const newUser = await sql`
            INSERT INTO users (email, name, image, email_verified, uid)
            VALUES (
              ${user.email},
              ${user.name || user.email.split('@')[0]},
              ${user.image || null},
              ${account?.provider !== 'credentials' ? new Date() : null},
              generate_user_uid()
            )
            RETURNING id, uid
          `
          user.id = newUser[0].id
          user.uid = newUser[0].uid
        } else {
          user.id = existingUser[0].id

          // 如果是OAuth登录,更新用户信息
          if (account?.provider !== 'credentials') {
            await sql`
              UPDATE users 
              SET 
                name = COALESCE(${user.name}, name),
                image = COALESCE(${user.image}, image),
                email_verified = COALESCE(email_verified, ${new Date()})
              WHERE id = ${user.id}
            `
          }
        }

        // OAuth登录时保存account信息
        if (account && account.provider !== 'credentials') {
          await sql`
            INSERT INTO accounts (
              user_id, type, provider, provider_account_id,
              access_token, refresh_token, expires_at, token_type, scope, id_token
            )
            VALUES (
              ${user.id}, ${account.type}, ${account.provider}, 
              ${account.providerAccountId}, ${account.access_token || null},
              ${account.refresh_token || null}, ${account.expires_at || null},
              ${account.token_type || null}, ${account.scope || null}, 
              ${account.id_token || null}
            )
            ON CONFLICT (provider, provider_account_id) 
            DO UPDATE SET
              access_token = EXCLUDED.access_token,
              refresh_token = EXCLUDED.refresh_token,
              expires_at = EXCLUDED.expires_at,
              updated_at = CURRENT_TIMESTAMP
          `
        }

        return true
      } catch (error) {
        console.error("SignIn error:", error)
        return false
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.uid = user.uid
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.uid = token.uid as number
      }
      return session
    }
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
