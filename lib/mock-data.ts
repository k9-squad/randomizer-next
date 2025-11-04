import {
  Dices,
  Users as UsersIcon,
  Shuffle,
  Zap,
  Hash,
  Sparkles,
  Target,
  Grid3x3,
  type LucideIcon,
} from "lucide-react";

// 项目数据类型
export interface MockProject {
  id: number;
  name: string;
  icon: LucideIcon;
  gradient: string;
  creator: string;
  stars?: number;
  tags: string[];
}

// 分类数据类型
export interface Category {
  id?: number;
  name: string;
  icon: LucideIcon;
  gradient: string;
  count: number;
  description?: string;
}

// 所有模拟项目数据
export const ALL_MOCK_PROJECTS: MockProject[] = [
  {
    id: 1,
    name: "随机抽奖",
    icon: Dices,
    gradient: "hsl(220 13% 69% / 0.15)",
    creator: "张三",
    stars: 210,
    tags: ["抽奖", "娱乐"],
  },
  {
    id: 2,
    name: "团队匹配",
    icon: UsersIcon,
    gradient: "hsl(330 81% 60% / 0.15)",
    creator: "李四",
    stars: 189,
    tags: ["团队", "协作"],
  },
  {
    id: 3,
    name: "幸运转盘",
    icon: Shuffle,
    gradient: "hsl(262 83% 58% / 0.15)",
    creator: "王五",
    stars: 256,
    tags: ["转盘", "随机"],
  },
  {
    id: 4,
    name: "快速决策",
    icon: Zap,
    gradient: "hsl(173 80% 40% / 0.15)",
    creator: "赵六",
    stars: 178,
    tags: ["决策", "快速"],
  },
  {
    id: 5,
    name: "名字生成",
    icon: Sparkles,
    gradient: "hsl(45 93% 47% / 0.15)",
    creator: "孙七",
    stars: 45,
    tags: ["名字", "生成"],
  },
  {
    id: 6,
    name: "分组助手",
    icon: UsersIcon,
    gradient: "hsl(142 76% 36% / 0.15)",
    creator: "周八",
    stars: 38,
    tags: ["分组", "助手"],
  },
  {
    id: 7,
    name: "幸运抽签",
    icon: Dices,
    gradient: "hsl(45 93% 47% / 0.15)",
    creator: "小明",
    stars: 88,
    tags: ["抽签", "幸运"],
  },
  {
    id: 8,
    name: "随机队伍",
    icon: UsersIcon,
    gradient: "hsl(262 83% 58% / 0.15)",
    creator: "小红",
    stars: 95,
    tags: ["队伍", "分组"],
  },
  {
    id: 9,
    name: "快速决策",
    icon: Zap,
    gradient: "hsl(173 80% 40% / 0.15)",
    creator: "小李",
    stars: 102,
    tags: ["决策", "快速"],
  },
  {
    id: 10,
    name: "目标选择",
    icon: Target,
    gradient: "hsl(330 81% 60% / 0.15)",
    creator: "小张",
    stars: 76,
    tags: ["目标", "选择"],
  },
  {
    id: 11,
    name: "随机数字",
    icon: Hash,
    gradient: "hsl(220 13% 69% / 0.15)",
    creator: "刘九",
    stars: 52,
    tags: ["数字", "随机"],
  },
  {
    id: 12,
    name: "幸运色子",
    icon: Dices,
    gradient: "hsl(262 83% 58% / 0.15)",
    creator: "陈十",
    stars: 41,
    tags: ["色子", "幸运"],
  },
  {
    id: 13,
    name: "随机数生成",
    icon: Hash,
    gradient: "hsl(45 93% 47% / 0.15)",
    creator: "孙七",
    stars: 167,
    tags: ["数字", "生成"],
  },
  {
    id: 14,
    name: "创意生成器",
    icon: Sparkles,
    gradient: "hsl(142 76% 36% / 0.15)",
    creator: "周八",
    stars: 156,
    tags: ["创意", "灵感"],
  },
  {
    id: 15,
    name: "目标选择器",
    icon: Target,
    gradient: "hsl(330 81% 60% / 0.15)",
    creator: "吴九",
    stars: 145,
    tags: ["目标", "选择"],
  },
  {
    id: 16,
    name: "幸运骰子",
    icon: Dices,
    gradient: "hsl(262 83% 58% / 0.15)",
    creator: "郑十",
    stars: 134,
    tags: ["骰子", "游戏"],
  },
  {
    id: 17,
    name: "团队分组",
    icon: UsersIcon,
    gradient: "hsl(220 13% 69% / 0.15)",
    creator: "冯十一",
    stars: 128,
    tags: ["团队", "分组"],
  },
  {
    id: 18,
    name: "随机排序",
    icon: Shuffle,
    gradient: "hsl(173 80% 40% / 0.15)",
    creator: "陈十二",
    stars: 119,
    tags: ["排序", "随机"],
  },
  {
    id: 19,
    name: "快速投票",
    icon: Zap,
    gradient: "hsl(45 93% 47% / 0.15)",
    creator: "褚十三",
    stars: 112,
    tags: ["投票", "决策"],
  },
  {
    id: 20,
    name: "灵感激发",
    icon: Sparkles,
    gradient: "hsl(330 81% 60% / 0.15)",
    creator: "卫十四",
    stars: 105,
    tags: ["灵感", "创意"],
  },
];

// 分类数据
export const CATEGORIES: Category[] = [
  {
    id: 0,
    name: "随机选择",
    icon: Dices,
    gradient: "hsl(220 13% 69% / 0.15)",
    count: 128,
    description: "从多个选项中随机选择一个或多个",
  },
  {
    id: 1,
    name: "团队分组",
    icon: UsersIcon,
    gradient: "hsl(330 81% 60% / 0.15)",
    count: 95,
    description: "团队分组、成员匹配等协作工具",
  },
  {
    id: 2,
    name: "抽奖活动",
    icon: Shuffle,
    gradient: "hsl(262 83% 58% / 0.15)",
    count: 156,
    description: "各类抽奖、转盘、摇奖工具",
  },
  {
    id: 3,
    name: "决策工具",
    icon: Zap,
    gradient: "hsl(173 80% 40% / 0.15)",
    count: 87,
    description: "帮助快速做出选择和决定",
  },
  {
    id: 4,
    name: "游戏娱乐",
    icon: Sparkles,
    gradient: "hsl(262 83% 58% / 0.15)",
    count: 78,
    description: "趣味游戏、娱乐互动工具",
  },
  {
    id: 5,
    name: "教育学习",
    icon: Target,
    gradient: "hsl(142 76% 36% / 0.15)",
    count: 56,
    description: "课堂互动、学习辅助工具",
  },
  {
    id: 6,
    name: "工作效率",
    icon: Hash,
    gradient: "hsl(45 93% 47% / 0.15)",
    count: 64,
    description: "提升工作效率的随机化工具",
  },
  {
    id: 7,
    name: "其他",
    icon: Grid3x3,
    gradient: "hsl(210 40% 96% / 0.15)",
    count: 43,
    description: "其他创意随机器工具",
  },
];

// 工具函数：获取热门项目（按星标排序）
export const getHotProjects = (limit?: number): MockProject[] => {
  const sorted = [...ALL_MOCK_PROJECTS].sort((a, b) => (b.stars || 0) - (a.stars || 0));
  return limit ? sorted.slice(0, limit) : sorted;
};

// 工具函数：获取最新项目（按ID倒序）
export const getLatestProjects = (limit?: number): MockProject[] => {
  const sorted = [...ALL_MOCK_PROJECTS].sort((a, b) => b.id - a.id);
  return limit ? sorted.slice(0, limit) : sorted;
};

// 工具函数：随机获取项目
export const getRandomProjects = (count: number): MockProject[] => {
  const shuffled = [...ALL_MOCK_PROJECTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// 工具函数：根据分类ID获取项目
export const getProjectsByCategory = (categoryId: number): MockProject[] => {
  // 简单模拟，实际应该有分类关联
  const allProjects = [...ALL_MOCK_PROJECTS];
  return allProjects.filter((_, index) => index % 6 === categoryId);
};
