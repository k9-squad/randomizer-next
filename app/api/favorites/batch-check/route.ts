import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

/**
 * POST /api/favorites/batch-check
 * 批量检查多个项目的收藏状态
 * Body: { projectIds: string[] }
 * Returns: { [projectId: string]: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // 未登录用户，所有项目都未收藏
    if (!session?.user?.id) {
      return NextResponse.json({});
    }

    const { projectIds } = await request.json();

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({});
    }

    // 查询用户收藏的项目
    const favorites = await sql`
      SELECT project_id FROM favorites
      WHERE user_id = ${session.user.id}
        AND project_id = ANY(${projectIds})
    `;

    // 转换为对象格式 { projectId: true }
    const result: { [key: string]: boolean } = {};
    favorites.forEach((fav: any) => {
      result[fav.project_id] = true;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("批量检查收藏状态失败:", error);
    return NextResponse.json(
      { error: "批量检查收藏状态失败" },
      { status: 500 }
    );
  }
}
