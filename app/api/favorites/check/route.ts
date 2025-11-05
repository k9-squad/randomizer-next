import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

/**
 * GET /api/favorites/check?projectId=xxx
 * 检查项目是否已被当前用户收藏
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorited: false });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "缺少项目ID" },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT id FROM favorites
      WHERE user_id = ${session.user.id}
        AND project_id = ${projectId}
    `;

    return NextResponse.json({ isFavorited: result.length > 0 });
  } catch (error) {
    console.error("检查收藏状态失败:", error);
    return NextResponse.json(
      { error: "检查收藏状态失败" },
      { status: 500 }
    );
  }
}
