-- 修复 favorites 表，移除 project_type 列
-- 因为 favorites 只用于收藏用户项目，不包括官方模板

-- 1. 如果表存在 project_type 列，则删除
ALTER TABLE favorites 
DROP COLUMN IF EXISTS project_type;

-- 2. 确保表结构正确
-- favorites 表应该只有这些列：
-- - id (primary key)
-- - user_id (外键到 users)
-- - project_id (外键到 projects)
-- - created_at (时间戳)

-- 如果表不存在，创建它
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_project_id ON favorites(project_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);
