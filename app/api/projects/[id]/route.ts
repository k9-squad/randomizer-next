import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/projects/[id] - 获取单个项目
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await sql`
      SELECT p.*, u.name as user_name,
             (SELECT COUNT(*) FROM favorites WHERE project_id = p.id) as favorite_count
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // 增加浏览量
    await sql`
      UPDATE projects 
      SET view_count = view_count + 1 
      WHERE id = ${id}
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - 更新项目
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, config, themeColor, iconType, iconName, tags, isPublic } = body;

    const result = await sql`
      UPDATE projects
      SET 
        name = ${name},
        description = ${description || null},
        config = ${JSON.stringify(config)},
        theme_color = ${themeColor || null},
        icon_type = ${iconType || null},
        icon_name = ${iconName || null},
        tags = ${tags || []},
        is_public = ${isPublic !== undefined ? isPublic : false},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - 删除项目
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
