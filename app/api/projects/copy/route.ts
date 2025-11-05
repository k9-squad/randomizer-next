import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

/**
 * POST /api/projects/copy
 * 复制项目到用户的项目库
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { projectId, projectType } = await request.json();

    if (!projectId || !projectType) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    let projectData;
    let originalAuthorId;

    // 根据类型获取项目数据
    if (projectType === "official") {
      const templates = await sql`
        SELECT * FROM official_templates WHERE id = ${projectId}
      `;

      if (templates.length === 0) {
        return NextResponse.json(
          { error: "官方模板不存在" },
          { status: 404 }
        );
      }

      projectData = templates[0];
      originalAuthorId = null; // 官方模板没有原作者
    } else if (projectType === "user") {
      const projects = await sql`
        SELECT * FROM projects 
        WHERE id = ${projectId} AND is_public = true
      `;

      if (projects.length === 0) {
        return NextResponse.json(
          { error: "项目不存在或未公开" },
          { status: 404 }
        );
      }

      projectData = projects[0];
      originalAuthorId = projectData.original_author_id || projectData.user_id;

      // 增加复制计数
      await sql`
        UPDATE projects
        SET copy_count = copy_count + 1
        WHERE id = ${projectId}
      `;
    } else {
      return NextResponse.json(
        { error: "无效的项目类型" },
        { status: 400 }
      );
    }

    // 创建副本
    const newProject = await sql`
      INSERT INTO projects (
        id, name, config, description,
        icon_type, icon_name, icon_url, theme_color,
        user_id, tags, is_public,
        original_author_id, modified_by
      )
      VALUES (
        gen_random_uuid()::TEXT,
        ${projectData.name + " (副本)"},
        ${projectData.config},
        ${projectData.description || ""},
        ${projectData.icon_type},
        ${projectData.icon_name},
        ${projectData.icon_url || null},
        ${projectData.theme_color},
        ${session.user.id},
        ${projectData.tags || []},
        false,
        ${originalAuthorId},
        ${[session.user.id]}
      )
      RETURNING *
    `;

    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error("复制项目失败:", error);
    return NextResponse.json({ error: "复制项目失败" }, { status: 500 });
  }
}
