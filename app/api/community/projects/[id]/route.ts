import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // 获取项目信息（只返回公开项目）
    const projects = await sql`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.config,
        p.theme_color,
        p.icon_type,
        p.icon_name,
        p.icon_url,
        p.tags,
        p.category,
        p.star_count,
        p.view_count,
        p.copy_count,
        p.created_at,
        p.updated_at,
        u.name as author_name,
        u.id as author_id
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ${id} AND p.is_public = true
    `;

    if (projects.length === 0) {
      return NextResponse.json(
        { error: "项目不存在或未公开" },
        { status: 404 }
      );
    }

    const project = projects[0];

    // 增加浏览次数
    await sql`
      UPDATE projects 
      SET view_count = view_count + 1
      WHERE id = ${id}
    `;

    return NextResponse.json({
      id: project.id,
      name: project.name,
      description: project.description,
      config: project.config,
      theme_color: project.theme_color,
      icon_type: project.icon_type,
      icon_name: project.icon_name,
      icon_url: project.icon_url,
      tags: project.tags || [],
      category: project.category,
      star_count: project.star_count || 0,
      view_count: (project.view_count || 0) + 1,
      copy_count: project.copy_count || 0,
      created_at: project.created_at,
      updated_at: project.updated_at,
      author_name: project.author_name,
      author_id: project.author_id,
    });
  } catch (error) {
    console.error("获取社区项目失败:", error);
    return NextResponse.json(
      { error: "获取项目失败" },
      { status: 500 }
    );
  }
}
