-- 清理官方模板表中不需要的字段

-- 删除 tags 列
ALTER TABLE official_templates DROP COLUMN IF EXISTS tags;

-- 删除 copy_count 列
ALTER TABLE official_templates DROP COLUMN IF EXISTS copy_count;

-- 删除 view_count 列
ALTER TABLE official_templates DROP COLUMN IF EXISTS view_count;
