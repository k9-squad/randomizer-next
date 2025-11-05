import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/projects - 获取项目列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const isPublic = searchParams.get('public') === 'true';

  try {
    let projects;
    
    if (userId) {
      // 获取指定用户的项目
      projects = await sql`
        SELECT p.*, u.name as user_name,
               (SELECT COUNT(*) FROM favorites WHERE project_id = p.id) as favorite_count
        FROM projects p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ${userId}
        ORDER BY p.updated_at DESC
      `;
    } else if (isPublic) {
      // 获取所有公开项目
      projects = await sql`
        SELECT p.*, u.name as user_name,
               (SELECT COUNT(*) FROM favorites WHERE project_id = p.id) as favorite_count
        FROM projects p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.is_public = true
        ORDER BY p.updated_at DESC
        LIMIT 50
      `;
    } else {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - 创建新项目
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, config, category, themeColor, iconType, iconName, tags, userId, description } = body;

    // 验证输入长度
    if (name && name.length > 50) {
      return NextResponse.json({ error: '项目名称不能超过50个字符' }, { status: 400 });
    }
    if (description && description.length > 200) {
      return NextResponse.json({ error: '项目描述不能超过200个字符' }, { status: 400 });
    }
    if (category && category.length > 20) {
      return NextResponse.json({ error: '分类名称不能超过20个字符' }, { status: 400 });
    }
    if (tags && tags.length > 10) {
      return NextResponse.json({ error: '标签数量不能超过10个' }, { status: 400 });
    }
    if (tags && tags.some((tag: string) => tag.length > 20)) {
      return NextResponse.json({ error: '单个标签不能超过20个字符' }, { status: 400 });
    }

    // 生成唯一 ID
    const id = crypto.randomUUID();
    
    const result = await sql`
      INSERT INTO projects (
        id, name, description, config, category, theme_color, icon_type, icon_name, 
        tags, user_id, is_public
      )
      VALUES (
        ${id}, ${name?.slice(0, 50)}, ${description?.slice(0, 200) || null}, ${JSON.stringify(config)}, 
        ${category?.slice(0, 20) || null}, ${themeColor || null}, ${iconType || null}, ${iconName || null}, 
        ${tags?.slice(0, 10).map((t: string) => t.slice(0, 20)) || []}, ${userId}, false
      )
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
