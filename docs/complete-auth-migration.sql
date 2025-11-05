-- 完整的数据库迁移脚本（认证系统 + UID）
-- 在Neon Console的SQL Editor中按顺序运行

-- ============================================
-- 第一部分：修复UUID和添加认证字段
-- ============================================

-- 1. 修复users表的id列，添加UUID默认值
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. 添加认证相关字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_verified TIMESTAMP,
ADD COLUMN IF NOT EXISTS image TEXT;

-- ============================================
-- 第二部分：添加用户UID系统
-- ============================================

-- 3. 添加uid字段（9位随机数字）
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS uid BIGINT UNIQUE;

-- 4. 创建生成随机UID的函数
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

-- 5. 为现有用户补充UID
UPDATE users 
SET uid = generate_user_uid()
WHERE uid IS NULL;

-- 6. 设置uid为NOT NULL
ALTER TABLE users 
ALTER COLUMN uid SET NOT NULL;

-- ============================================
-- 第三部分：创建OAuth和会话表
-- ============================================

-- 7. 创建accounts表（OAuth提供商）
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(50),
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_account_id)
);

-- 8. 创建sessions表（会话管理）
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. 创建verification_tokens表（邮箱验证）
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ============================================
-- 第四部分：创建索引提升性能
-- ============================================

-- 10. 创建各种索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);

-- ============================================
-- 第五部分：验证迁移结果
-- ============================================

-- 11. 查看users表结构
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 12. 查看现有用户（测试UID生成）
SELECT id, email, name, uid, 
       CASE WHEN password IS NOT NULL THEN '已设置' ELSE '未设置' END as password_status,
       created_at
FROM users
ORDER BY created_at DESC;

-- 13. 测试UID生成函数
SELECT generate_user_uid() as sample_uid_1,
       generate_user_uid() as sample_uid_2,
       generate_user_uid() as sample_uid_3;

-- ============================================
-- 完成！现在可以开始测试注册和登录功能
-- ============================================
