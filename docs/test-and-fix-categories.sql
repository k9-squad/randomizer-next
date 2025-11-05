-- ============================================================
-- 测试和修复分类数据
-- ============================================================

-- 1. 检查 category 列是否存在
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects' AND column_name = 'category';

-- 2. 查看当前所有公开项目的分类情况
SELECT id, name, category, is_public, tags
FROM projects
WHERE is_public = true
ORDER BY created_at DESC;

-- 3. 统计每个分类的项目数量
SELECT 
  category,
  COUNT(*) as count
FROM projects
WHERE is_public = true
GROUP BY category
ORDER BY count DESC;

-- 4. 查看没有分类的公开项目
SELECT id, name, is_public
FROM projects
WHERE is_public = true AND (category IS NULL OR category = '')
ORDER BY created_at DESC;

-- 5. 为测试：手动设置现有项目的分类（根据实际情况修改）
-- 示例：将第一个项目设置为"随机选择"
-- UPDATE projects 
-- SET category = '随机选择' 
-- WHERE id = '你的项目ID';

-- 6. 验证更新后的分类统计
SELECT 
  category,
  COUNT(*) as count
FROM projects
WHERE is_public = true
GROUP BY category
ORDER BY count DESC;
