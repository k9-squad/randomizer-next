import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * GET /api/official-templates
 * 获取所有官方模板
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");

    let query = sql`
      SELECT 
        id, name, description, config, 
        icon_type, icon_name, icon_url, theme_color,
        category, display_order, is_featured,
        created_at
      FROM official_templates
      WHERE 1=1
    `;

    // 按分类筛选
    if (category) {
      query = sql`${query} AND category = ${category}`;
    }

    query = sql`${query} ORDER BY display_order ASC`;

    // 限制数量
    if (limit) {
      query = sql`${query} LIMIT ${parseInt(limit)}`;
    }

    const templates = await query;

    return NextResponse.json(templates);
  } catch (error) {
    console.error("获取官方模板失败:", error);
    return NextResponse.json(
      { error: "获取官方模板失败" },
      { status: 500 }
    );
  }
}
