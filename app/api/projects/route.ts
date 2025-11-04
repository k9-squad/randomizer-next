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
    const { name, config, themeColor, iconType, iconName, tags, userId, description } = body;

    // 生成唯一 ID
    const id = crypto.randomUUID();
    
    const result = await sql`
      INSERT INTO projects (
        id, name, description, config, theme_color, icon_type, icon_name, 
        tags, user_id, is_public
      )
      VALUES (
        ${id}, ${name}, ${description || null}, ${JSON.stringify(config)}, 
        ${themeColor || null}, ${iconType || null}, ${iconName || null}, 
        ${tags || []}, ${userId}, false
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
