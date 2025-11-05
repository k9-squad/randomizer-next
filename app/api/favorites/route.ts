import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

/**
 * GET /api/favorites
 * 获取用户的收藏列表
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const favorites = await sql`
      SELECT 
        f.id,
        f.project_id,
        f.created_at,
        p.id as project_id,
        p.name,
        p.description,
        p.icon_type,
        p.icon_name,
        p.icon_url,
        p.theme_color,
        p.tags,
        p.star_count,
        p.copy_count,
        u.id as author_id,
        u.name as author_name,
        u.uid as author_uid
      FROM favorites f
      INNER JOIN projects p ON f.project_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE f.user_id = ${session.user.id}
      ORDER BY f.created_at DESC
    `;

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("获取收藏列表失败:", error);
    return NextResponse.json(
      { error: "获取收藏列表失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * 添加收藏
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "缺少项目ID" },
        { status: 400 }
      );
    }

    // 检查是否已收藏
    const existing = await sql`
      SELECT id FROM favorites
      WHERE user_id = ${session.user.id}
        AND project_id = ${projectId}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "已经收藏过了" },
        { status: 400 }
      );
    }

    // 添加收藏
    const result = await sql`
      INSERT INTO favorites (user_id, project_id)
      VALUES (${session.user.id}, ${projectId})
      RETURNING *
    `;

    // 更新项目的 star_count
    await sql`
      UPDATE projects
      SET star_count = star_count + 1
      WHERE id = ${projectId}
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("添加收藏失败:", error);
    return NextResponse.json(
      { error: "添加收藏失败" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/favorites
 * 取消收藏
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "缺少项目ID" },
        { status: 400 }
      );
    }

    // 删除收藏
    const result = await sql`
      DELETE FROM favorites
      WHERE user_id = ${session.user.id}
        AND project_id = ${projectId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "收藏不存在" },
        { status: 404 }
      );
    }

    // 更新项目的 star_count
    await sql`
      UPDATE projects
      SET star_count = GREATEST(star_count - 1, 0)
      WHERE id = ${projectId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("取消收藏失败:", error);
    return NextResponse.json(
      { error: "取消收藏失败" },
      { status: 500 }
    );
  }
}
