-- 插入或更新 8 个官方模板数据（使用 UPSERT）

-- ========== 经典实用模板 ==========

-- 1. 六面骰子
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order
) VALUES (
  'template-simple-picker',
  '六面骰子',
  '投掷一个标准的六面骰子，结果为1-6',
  '{
    "mode": "lottery",
    "locationText": "你丢出一个六面骰",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "unlimited",
    "allowDuplicates": true,
    "sharedPool": ["1", "2", "3", "4", "5", "6"],
    "rotators": [
      {"id": 1, "label": "你丢到了"}
    ]
  }',
  'lucide',
  'Dices',
  '#94a3b8',
  'classic',
  1
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
  updated_at = NOW();

-- 2. 今天吃什么
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order
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
  2
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
  updated_at = NOW();

-- 3. 团队分组
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order
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
  3
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
  updated_at = NOW();

-- 4. 抽奖转盘
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order
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
  4
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
  updated_at = NOW();

-- ========== 教学性质模板 ==========

-- 5. COC 人物车卡（独立池 + 放回抽取）
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order
) VALUES (
  'template-coc-independent',
  'COC 人物车卡',
  '了解独立池和放回抽取的运作原理',
  '{
    "mode": "lottery",
    "locationText": "你的COC角色的",
    "speed": 30,
    "poolType": "independent",
    "drawMode": "unlimited",
    "allowDuplicates": true,
    "rotators": [
      {"id": 1, "label": "故乡是", "individualPool": ["美国", "英国", "法国", "德国", "俄罗斯", "中国", "日本", "意大利", "西班牙", "加拿大", "澳大利亚", "印度", "巴西", "埃及", "瑞典", "墨西哥", "阿根廷", "土耳其", "希腊", "波兰"]},
      {"id": 2, "label": "现居地是", "individualPool": ["美国", "英国", "法国", "德国", "俄罗斯", "中国", "日本", "意大利", "西班牙", "加拿大", "澳大利亚", "印度", "巴西", "埃及", "瑞典", "墨西哥", "阿根廷", "土耳其", "希腊", "波兰"]},
      {"id": 3, "label": "职业是", "individualPool": ["2 会计师", "3 杂技演员", "4 演员-戏剧演员", "5 演员-电影演员", "6 事务所侦探、保安", "7 精神病医生（古典）", "8 动物训练师", "9 文物学家（原作向）", "10 古董商", "11 考古学家（原作向）", "12 建筑师", "13 艺术家", "14 精神病院看护", "15 运动员", "16 作家（原作向）", "17 酒保", "18 猎人", "19 书商", "20 赏金猎人", "21 拳击手、摔跤手", "22 管家、男仆、女仆", "23 神职人员", "24 程序员、电子工程师（现代）", "25 黑客/骇客（现代）", "26 牛仔", "27 工匠", "28 罪犯-刺客", "29 罪犯-银行劫匪", "30 罪犯-打手、暴徒", "31 罪犯-窃贼", "32 罪犯-欺诈师", "33 罪犯-独行罪犯", "34 罪犯-女飞贼（古典）", "35 罪犯-赃物贩子", "36 罪犯-赝造者", "37 罪犯-走私者", "38 罪犯-混混", "39 教团首领", "40 除魅师（现代）", "41 设计师", "42 业余艺术爱好者（原作向）", "43 潜水员", "44 医生（原作向）", "45 流浪者", "46 司机-私人司机", "47 司机-司机", "48 司机-出租车司机", "49 编辑", "50 政府官员", "51 工程师", "52 艺人", "53 探险家（古典）", "54 农民", "55 联邦探员", "56 消防员", "57 驻外记者", "58 法医", "59 赌徒", "60 黑帮-黑帮老大", "61 黑帮-马仔", "62 绅士、淑女", "63 游民", "64 勤杂护工", "65 记者(原作向)-调查记者", "66 记者(原作向)-通讯记者", "67 法官", "68 实验室助理", "69 工人-非熟练工人", "70 工人-伐木工", "71 工人-矿工", "72 律师", "73 图书馆管理员（原作向）", "74 技师", "75 军官", "76 传教士", "77 登山家", "78 博物馆管理员", "79 音乐家", "80 护士", "81 神秘学者", "82 旅行家", "83 超心理学家", "84 药剂师", "85 摄影师-摄影师", "86 摄影师-摄影记者", "87 飞行员-飞行员", "88 飞行员-特技飞行员（古典）", "89 警方(原作向)-警探", "90 警方(原作向)-巡警", "91 私家侦探", "92 教授（原作向）", "93 淘金客", "94 性工作者", "95 精神病学家", "96 心理学家、精神分析学家", "97 研究员", "98 海员-军舰海员", "99 海员-民船海员", "100 推销员", "101 科学家", "102 秘书", "103 店老板", "104 士兵、海军陆战队士兵", "105 间谍", "106 学生、实习生", "107 替身演员", "108 部落成员", "109 殡葬师", "110 工会活动家", "111 服务生", "112 白领工人-职员、主管", "113 白领工人-中高层管理人员", "114 狂热者", "115 饲养员"]},
      {"id": 4, "label": "年龄是", "individualPool": ["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55"]}
    ]
  }',
  'lucide',
  'Dices',
  '#10b981',
  'education',
  5
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
  updated_at = NOW();

-- 6. 扑克发牌器（共享池 + 不放回抽取）
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order
) VALUES (
  'template-poker-dealer',
  '扑克发牌器',
  '了解共享池和不放回抽取的运作原理',
  '{
    "mode": "lottery",
    "locationText": "发到",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "limited",
    "allowDuplicates": false,
    "sharedPool": ["♠A", "♠2", "♠3", "♠4", "♠5", "♥A", "♥2", "♥3", "♥4", "♥5", "♦A", "♦2", "♦3", "♦4", "♦5", "♣A", "♣2", "♣3", "♣4", "♣5"],
    "rotators": [
      {"id": 1, "label": "玩家1"},
      {"id": 2, "label": "玩家2"},
      {"id": 3, "label": "玩家3"}
    ]
  }',
  'lucide',
  'Spade',
  '#ef4444',
  'education',
  6
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
  updated_at = NOW();

-- 7. 游戏抽卡模拟器（权重抽取）
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order
) VALUES (
  'template-gacha-simulator',
  '游戏抽卡模拟器',
  '通过重复项模拟不同稀有度的抽取概率',
  '{
    "mode": "lottery",
    "locationText": "抽到",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "unlimited",
    "allowDuplicates": true,
    "sharedPool": ["SSR", "SR", "SR", "SR", "SR", "SR", "SR", "SR", "SR", "SR", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R"],
    "rotators": [
      {"id": 1, "label": "第1抽"},
      {"id": 2, "label": "第2抽"},
      {"id": 3, "label": "第3抽"}
    ]
  }',
  'lucide',
  'Sparkles',
  '#8b5cf6',
  'education',
  7
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
  updated_at = NOW();

-- 8. 比赛出场顺序（随机排列）
INSERT INTO official_templates (
  id, name, description, config, icon_type, icon_name, theme_color, category, display_order
) VALUES (
  'template-match-order',
  '比赛出场顺序',
  '体验不放回抽取如何生成不重复的随机排序',
  '{
    "mode": "lottery",
    "locationText": "",
    "speed": 30,
    "poolType": "shared",
    "drawMode": "limited",
    "allowDuplicates": false,
    "sharedPool": ["1号选手", "2号选手", "3号选手", "4号选手", "5号选手", "6号选手"],
    "rotators": [
      {"id": 1, "label": "第1个出场"},
      {"id": 2, "label": "第2个出场"},
      {"id": 3, "label": "第3个出场"},
      {"id": 4, "label": "第4个出场"},
      {"id": 5, "label": "第5个出场"},
      {"id": 6, "label": "第6个出场"}
    ]
  }',
  'lucide',
  'ListOrdered',
  '#f59e0b',
  'education',
  8
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
  updated_at = NOW();
