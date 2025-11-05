-- ============================================================
-- 为 projects 表添加 category 列用于存储项目分类
-- ============================================================
-- 
-- 说明：
-- - category: 用于探索页面的分类筛选（单个分类）
-- - tags: 用于用户搜索的标签（多个标签，已存在）
--
-- 执行方式：
-- 在 Neon Database Studio 的 SQL Editor 中执行以下语句
-- ============================================================

-- 1. 添加 category 列
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT NULL;

-- 2. 添加索引以提高按分类查询的性能
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);

-- 3. 可选：为现有项目添加默认分类
-- 例如：将所有现有项目标记为"其他"分类
-- UPDATE projects SET category = '其他' WHERE category IS NULL;

-- 4. 验证表结构
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects' AND column_name IN ('category', 'tags')
ORDER BY column_name;
