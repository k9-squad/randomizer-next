import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import { INPUT_LIMITS } from "@/lib/constants"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: "邮箱和密码不能为空" },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "邮箱格式不正确" },
        { status: 400 }
      )
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要6个字符" },
        { status: 400 }
      )
    }

    if (password.length > 50) {
      return NextResponse.json(
        { error: "密码不能超过50个字符" },
        { status: 400 }
      )
    }

    // 验证用户名长度
    if (name && name.length > INPUT_LIMITS.PROJECT_NAME) {
      return NextResponse.json(
        { error: `用户名不能超过${INPUT_LIMITS.PROJECT_NAME}个字符` },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户 (id和uid会自动生成)
    const result = await sql`
      INSERT INTO users (email, password, name, uid)
      VALUES (
        ${email},
        ${hashedPassword},
        ${name || email.split('@')[0]},
        generate_user_uid()
      )
      RETURNING id, email, name, uid, created_at
    `

    const newUser = result[0]

    // 生成验证token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时后过期

    // 保存验证token到数据库
    await sql`
      INSERT INTO verification_tokens (identifier, token, expires)
      VALUES (${email}, ${verificationToken}, ${expiresAt})
    `

    // 发送验证邮件
    try {
      await sendVerificationEmail({
        email: newUser.email,
        name: newUser.name,
        token: verificationToken,
      })

      return NextResponse.json(
        {
          message: "注册成功！我们已向你的邮箱发送了验证链接，请查收。",
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            uid: newUser.uid,
            createdAt: newUser.created_at,
            emailVerified: false
          }
        },
        { status: 201 }
      )
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      
      // 邮件发送失败，但用户已创建，返回警告信息
      return NextResponse.json(
        {
          message: "注册成功，但验证邮件发送失败。请稍后在个人中心重新发送验证邮件。",
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            uid: newUser.uid,
            createdAt: newUser.created_at,
            emailVerified: false
          }
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    )
  }
}
