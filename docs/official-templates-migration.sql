-- 官方模板表
CREATE TABLE IF NOT EXISTS official_templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  config JSONB NOT NULL,
  
  -- 显示相关
  icon_type TEXT DEFAULT 'lucide',
  icon_name TEXT,
  icon_url TEXT,
  theme_color TEXT,
  
  -- 分类和排序
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  -- 元数据
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  project_type TEXT NOT NULL, -- 'user' | 'official'
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, project_id, project_type)
);

-- 修改 projects 表，添加社区相关字段
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS star_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS copy_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS original_author_id TEXT; -- 原作者ID（复制时保留）
ALTER TABLE projects ADD COLUMN IF NOT EXISTS modified_by TEXT[] DEFAULT '{}'; -- 修改者列表

-- 管理员表（简单实现）
CREATE TABLE IF NOT EXISTS admins (
  user_id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 举报表（暂时创建，未来实现）
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  project_id TEXT NOT NULL,
  reporter_id TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'reviewed' | 'resolved'
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_official_templates_display_order ON official_templates(display_order);
CREATE INDEX IF NOT EXISTS idx_official_templates_featured ON official_templates(is_featured);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_project_id ON favorites(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_public ON projects(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_projects_star_count ON projects(star_count DESC) WHERE is_public = true;

-- 插入你的管理员账号
INSERT INTO admins (user_id) 
SELECT id FROM users WHERE email = 'baishouzangtan@gmail.com'
ON CONFLICT (user_id) DO NOTHING;
