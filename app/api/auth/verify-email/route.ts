import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "缺少验证token" },
        { status: 400 }
      );
    }

    // 查询验证token
    const tokenRecord = await sql`
      SELECT identifier, token, expires
      FROM verification_tokens
      WHERE token = ${token}
    `;

    if (tokenRecord.length === 0) {
      return NextResponse.json(
        { error: "验证链接无效或已被使用" },
        { status: 400 }
      );
    }

    const { identifier: email, expires } = tokenRecord[0];

    // 检查是否过期
    if (new Date(expires) < new Date()) {
      // 删除过期token
      await sql`
        DELETE FROM verification_tokens
        WHERE token = ${token}
      `;

      return NextResponse.json(
        { error: "验证链接已过期，请重新注册" },
        { status: 400 }
      );
    }

    // 更新用户的email_verified字段
    const updateResult = await sql`
      UPDATE users
      SET email_verified = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = ${email}
      RETURNING id, email, name, uid
    `;

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    // 删除已使用的token
    await sql`
      DELETE FROM verification_tokens
      WHERE token = ${token}
    `;

    const user = updateResult[0];

    return NextResponse.json(
      {
        success: true,
        message: "邮箱验证成功！",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          uid: user.uid,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "验证失败，请稍后重试" },
      { status: 500 }
    );
  }
}
