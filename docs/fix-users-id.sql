-- 修复users表的id列，添加UUID默认值
-- 在Neon Console的SQL Editor中运行此脚本

-- 1. 查看当前users表结构
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 2. 如果id列是UUID类型但没有默认值，修改它
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. 验证修改
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'id';
