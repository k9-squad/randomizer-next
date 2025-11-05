-- 插入或更新 8 个官方模板数据

-- ========== 经典实用模板 ==========

-- 1. 简单随机器
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order, tags
) VALUES (
  'template-simple-picker',
  '简单随机器',
  '从列表中随机选择一个项目，最基础的随机工具',
  '{
    "mode": "lottery",
    "locationText": "",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "unlimited",
    "allowDuplicates": true,
    "sharedPool": ["选项 1", "选项 2", "选项 3", "选项 4"],
    "rotators": [
      {"id": 1, "label": "结果"}
    ]
  }',
  'lucide',
  'Dices',
  '#94a3b8',
  'classic',
  1,
  ARRAY['随机', '抽取', '基础']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  config = EXCLUDED.config,
  icon_type = EXCLUDED.icon_type,
  icon_name = EXCLUDED.icon_name,
  theme_color = EXCLUDED.theme_color,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order,
  tags = EXCLUDED.tags,
  updated_at = NOW();

-- 2. 今天吃什么
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order, tags
) VALUES (
  'template-food-picker',
  '今天吃什么',
  '解决选择困难症，随机决定今天的美食',
  '{
    "mode": "lottery",
    "locationText": "今天吃",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "unlimited",
    "allowDuplicates": true,
    "sharedPool": ["火锅", "烧烤", "面条", "寿司", "披萨", "炸鸡", "中餐", "西餐"],
    "rotators": [
      {"id": 1, "label": "午餐"}
    ]
  }',
  'lucide',
  'UtensilsCrossed',
  '#f59e0b',
  'classic',
  2,
  ARRAY['美食', '决策', '生活']
);

-- 3. 团队分组
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order, tags
) VALUES (
  'template-team-divider',
  '团队分组',
  '快速将成员随机分配到不同团队',
  '{
    "mode": "grouping",
    "locationText": "",
    "speed": 30,
    "members": ["张三", "李四", "王五", "赵六", "孙七", "周八"],
    "groupCount": 2,
    "groups": [
      {"id": 1, "name": "第 1 组", "members": []},
      {"id": 2, "name": "第 2 组", "members": []}
    ]
  }',
  'lucide',
  'Users',
  '#ec4899',
  'classic',
  3,
  ARRAY['团队', '分组', '协作']
);

-- 4. 抽奖转盘（多轮换位展示）
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order, tags
) VALUES (
  'template-lottery-wheel',
  '抽奖转盘',
  '可视化的转盘抽奖工具，适合活动和游戏',
  '{
    "mode": "lottery",
    "locationText": "恭喜获得",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "unlimited",
    "allowDuplicates": true,
    "sharedPool": ["一等奖", "二等奖", "三等奖", "参与奖", "谢谢参与"],
    "rotators": [
      {"id": 1, "label": "奖品"}
    ]
  }',
  'lucide',
  'CircleDot',
  '#8b5cf6',
  'classic',
  4,
  ARRAY['抽奖', '转盘', '活动']
);

-- ========== 教学性质模板 ==========

-- 5. 概率教学：独立事件（有放回抽样）
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order, tags
) VALUES (
  'template-probability-independent',
  '概率教学：独立事件',
  '理解独立事件的概率，每次抽取互不影响（有放回抽样）',
  '{
    "mode": "lottery",
    "locationText": "抽到",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "unlimited",
    "allowDuplicates": true,
    "sharedPool": ["红球", "红球", "红球", "蓝球", "蓝球", "绿球"],
    "rotators": [
      {"id": 1, "label": "第1次"},
      {"id": 2, "label": "第2次"},
      {"id": 3, "label": "第3次"}
    ]
  }',
  'lucide',
  'RefreshCw',
  '#10b981',
  'education',
  5,
  ARRAY['概率', '教学', '独立事件', '有放回']
);

-- 6. 概率教学：非独立事件（无放回抽样）
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order, tags
) VALUES (
  'template-probability-dependent',
  '概率教学：非独立事件',
  '理解非独立事件的概率，抽取后不放回，影响后续概率',
  '{
    "mode": "lottery",
    "locationText": "抽到",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "limited",
    "allowDuplicates": false,
    "sharedPool": ["红球", "红球", "红球", "蓝球", "蓝球", "绿球"],
    "rotators": [
      {"id": 1, "label": "第1次"},
      {"id": 2, "label": "第2次"},
      {"id": 3, "label": "第3次"}
    ]
  }',
  'lucide',
  'Ban',
  '#ef4444',
  'education',
  6,
  ARRAY['概率', '教学', '非独立事件', '无放回']
);

-- 7. 权重教学：加权随机（模拟抽卡概率）
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order, tags
) VALUES (
  'template-weighted-random',
  '权重教学：加权随机',
  '学习权重对随机结果的影响，权重越大，被选中的概率越高',
  '{
    "mode": "lottery",
    "locationText": "抽到",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "unlimited",
    "allowDuplicates": true,
    "sharedPool": ["SSR (1%)", "SR (9%)", "SR (9%)", "SR (9%)", "SR (9%)", "SR (9%)", "SR (9%)", "SR (9%)", "SR (9%)", "SR (9%)", "R (81%)"],
    "rotators": [
      {"id": 1, "label": "稀有度"}
    ]
  }',
  'lucide',
  'Scale',
  '#3b82f6',
  'education',
  7,
  ARRAY['权重', '教学', '概率', '游戏']
);

-- 8. 排列组合：随机排序（比赛排名）
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order, tags
) VALUES (
  'template-shuffle-order',
  '排列组合：随机排序',
  '学习排列的概念，将列表随机打乱顺序',
  '{
    "mode": "lottery",
    "locationText": "",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "limited",
    "allowDuplicates": false,
    "sharedPool": ["选手A", "选手B", "选手C", "选手D", "选手E"],
    "rotators": [
      {"id": 1, "label": "第一名"},
      {"id": 2, "label": "第二名"},
      {"id": 3, "label": "第三名"},
      {"id": 4, "label": "第四名"},
      {"id": 5, "label": "第五名"}
    ]
  }',
  'lucide',
  'Shuffle',
  '#f59e0b',
  'education',
  8,
  ARRAY['排列', '教学', '顺序', '打乱']
);
