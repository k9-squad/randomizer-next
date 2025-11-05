import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * GET /api/official-templates/[id]
 * 获取单个官方模板
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const templates = await sql`
      SELECT 
        id, name, description, config, 
        icon_type, icon_name, icon_url, theme_color,
        category, display_order, is_featured,
        created_at, updated_at
      FROM official_templates
      WHERE id = ${id}
    `;

    if (templates.length === 0) {
      return NextResponse.json({ error: "模板不存在" }, { status: 404 });
    }

    return NextResponse.json(templates[0]);
  } catch (error) {
    console.error("获取官方模板失败:", error);
    return NextResponse.json(
      { error: "获取官方模板失败" },
      { status: 500 }
    );
  }
}
