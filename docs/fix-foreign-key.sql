-- 修复外键类型不匹配 - users.id 是 TEXT 类型
-- 在Neon Console的SQL Editor中运行此脚本

-- 1. 删除失败创建的表（如果存在）
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS verification_tokens CASCADE;

-- 2. 创建accounts表（user_id使用TEXT类型匹配users.id）
CREATE TABLE accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- 3. 创建sessions表（user_id使用TEXT类型匹配users.id）
CREATE TABLE sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 创建verification_tokens表
CREATE TABLE verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 5. 创建索引提升性能
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);

-- 6. 验证表创建成功并检查类型匹配
SELECT 
  'users.id' as column_ref,
  data_type
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'id'

UNION ALL

SELECT 
  'accounts.user_id' as column_ref,
  data_type
FROM information_schema.columns
WHERE table_name = 'accounts' AND column_name = 'user_id'

UNION ALL

SELECT 
  'sessions.user_id' as column_ref,
  data_type
FROM information_schema.columns
WHERE table_name = 'sessions' AND column_name = 'user_id';

-- 7. 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
