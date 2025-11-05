-- 为用户添加公开的UID（类似游戏账号系统）
-- 在Neon Console的SQL Editor中运行此脚本

-- 1. 添加uid字段（BIGINT类型，存储9位数字）
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS uid BIGINT UNIQUE;

-- 2. 创建唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_uid ON users(uid);

-- 3. 创建函数生成随机9位UID
CREATE OR REPLACE FUNCTION generate_user_uid()
RETURNS BIGINT AS $$
DECLARE
  new_uid BIGINT;
  uid_exists BOOLEAN;
BEGIN
  LOOP
    -- 生成100000000到999999999之间的随机数
    new_uid := 100000000 + floor(random() * 900000000)::BIGINT;
    
    -- 检查是否已存在
    SELECT EXISTS(SELECT 1 FROM users WHERE uid = new_uid) INTO uid_exists;
    
    -- 如果不存在则返回
    IF NOT uid_exists THEN
      RETURN new_uid;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. 为现有用户补充UID
UPDATE users 
SET uid = generate_user_uid()
WHERE uid IS NULL;

-- 5. 设置uid为NOT NULL（在补充完现有数据后）
ALTER TABLE users 
ALTER COLUMN uid SET NOT NULL;

-- 6. 验证结果
SELECT id, email, name, uid, created_at
FROM users
ORDER BY created_at DESC
LIMIT 5;

-- 7. 测试UID生成函数
SELECT generate_user_uid() as sample_uid;
