import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "missing_credentials" },
        { status: 400 }
      );
    }

    // 查询用户
    const result = await sql`
      SELECT email_verified, password
      FROM users 
      WHERE email = ${email}
    `;

    const user = result[0];
    
    // 如果用户不存在或密码为空，返回通用错误（不要泄露用户是否存在）
    if (!user || !user.password) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    // 密码正确，检查邮箱是否已验证
    if (!user.email_verified) {
      return NextResponse.json(
        { error: "email_not_verified" },
        { status: 403 }
      );
    }

    // 一切正常
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      { error: "server_error" },
      { status: 500 }
    );
  }
}
