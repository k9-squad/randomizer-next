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
        f.project_type,
        f.created_at,
        CASE 
          WHEN f.project_type = 'official' THEN (
            SELECT json_build_object(
              'id', ot.id,
              'name', ot.name,
              'description', ot.description,
              'icon_type', ot.icon_type,
              'icon_name', ot.icon_name,
              'theme_color', ot.theme_color,
              'type', 'official'
            )
            FROM official_templates ot
            WHERE ot.id = f.project_id
          )
          ELSE (
            SELECT json_build_object(
              'id', p.id,
              'name', p.name,
              'description', p.description,
              'icon_type', p.icon_type,
              'icon_name', p.icon_name,
              'theme_color', p.theme_color,
              'tags', p.tags,
              'star_count', p.star_count,
              'type', 'user',
              'author', json_build_object(
                'id', u.id,
                'name', u.name,
                'uid', u.uid
              )
            )
            FROM projects p
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.id = f.project_id
          )
        END as project
      FROM favorites f
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

    const { projectId, projectType } = await request.json();

    if (!projectId || !projectType) {
      return NextResponse.json(
        { error: "缺少参数" },
        { status: 400 }
      );
    }

    if (!["user", "official"].includes(projectType)) {
      return NextResponse.json(
        { error: "无效的项目类型" },
        { status: 400 }
      );
    }

    // 检查是否已收藏
    const existing = await sql`
      SELECT id FROM favorites
      WHERE user_id = ${session.user.id}
        AND project_id = ${projectId}
        AND project_type = ${projectType}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "已经收藏过了" },
        { status: 400 }
      );
    }

    // 添加收藏
    const result = await sql`
      INSERT INTO favorites (user_id, project_id, project_type)
      VALUES (${session.user.id}, ${projectId}, ${projectType})
      RETURNING *
    `;

    // 更新项目的 star_count
    if (projectType === "user") {
      await sql`
        UPDATE projects
        SET star_count = star_count + 1
        WHERE id = ${projectId}
      `;
    }

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
    const projectType = searchParams.get("projectType");

    if (!projectId || !projectType) {
      return NextResponse.json(
        { error: "缺少参数" },
        { status: 400 }
      );
    }

    // 删除收藏
    const result = await sql`
      DELETE FROM favorites
      WHERE user_id = ${session.user.id}
        AND project_id = ${projectId}
        AND project_type = ${projectType}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "收藏不存在" },
        { status: 404 }
      );
    }

    // 更新项目的 star_count
    if (projectType === "user") {
      await sql`
        UPDATE projects
        SET star_count = GREATEST(star_count - 1, 0)
        WHERE id = ${projectId}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("取消收藏失败:", error);
    return NextResponse.json(
      { error: "取消收藏失败" },
      { status: 500 }
    );
  }
}
