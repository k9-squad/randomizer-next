import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * GET /api/community/projects
 * 获取社区公开项目
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "latest"; // latest | hot | top
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const category = searchParams.get("category");

    let orderBy = "p.created_at DESC";
    
    switch (sort) {
      case "hot":
        // 热门：综合浏览量、收藏数、复制数
        orderBy = "(p.star_count * 3 + p.view_count + p.copy_count * 2) DESC, p.created_at DESC";
        break;
      case "top":
        // 最受欢迎：按收藏数排序
        orderBy = "p.star_count DESC, p.created_at DESC";
        break;
      case "latest":
      default:
        orderBy = "p.published_at DESC";
        break;
    }

    let query = sql`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.icon_type,
        p.icon_name,
        p.icon_url,
        p.theme_color,
        p.tags,
        p.star_count,
        p.view_count,
        p.copy_count,
        p.published_at,
        p.created_at,
        u.id as author_id,
        u.name as author_name,
        u.uid as author_uid,
        u.image as author_image,
        COALESCE(p.original_author_id, p.user_id) as original_author_id,
        CASE 
          WHEN p.original_author_id IS NOT NULL THEN (
            SELECT json_build_object(
              'id', ou.id,
              'name', ou.name,
              'uid', ou.uid
            )
            FROM users ou
            WHERE ou.id = p.original_author_id
          )
          ELSE NULL
        END as original_author
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.is_public = true
    `;

    // 按标签筛选
    if (category) {
      query = sql`${query} AND ${category} = ANY(p.tags)`;
    }

    query = sql`${query} ORDER BY ${sql.unsafe(orderBy)} LIMIT ${limit} OFFSET ${offset}`;

    const projects = await query;

    return NextResponse.json(projects);
  } catch (error) {
    console.error("获取社区项目失败:", error);
    return NextResponse.json(
      { error: "获取社区项目失败" },
      { status: 500 }
    );
  }
}
