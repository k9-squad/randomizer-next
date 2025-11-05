-- 清理并重新插入官方模板数据

-- 1. 删除所有现有官方模板
DELETE FROM official_templates;

-- 2. 重置相关的收藏记录（如果有）
DELETE FROM favorites WHERE project_type = 'official';

-- 现在可以安全地插入新数据了
