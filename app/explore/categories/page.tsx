"use client";

import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLighterColor } from "@/lib/color-utils";
import {
  Dices,
  Users as UsersIcon,
  Shuffle,
  Zap,
  Hash,
  Grid3x3,
  ChevronLeft,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  const categories = [
    {
      name: "随机选择",
      icon: Dices,
      gradient: "hsl(220 13% 69% / 0.15)",
      count: 128,
      description: "从多个选项中随机选择一个或多个",
    },
    {
      name: "团队分组",
      icon: UsersIcon,
      gradient: "hsl(330 81% 60% / 0.15)",
      count: 95,
      description: "团队分组、成员匹配等协作工具",
    },
    {
      name: "抽奖活动",
      icon: Shuffle,
      gradient: "hsl(262 83% 58% / 0.15)",
      count: 156,
      description: "各类抽奖、转盘、摇奖工具",
    },
    {
      name: "决策工具",
      icon: Zap,
      gradient: "hsl(173 80% 40% / 0.15)",
      count: 87,
      description: "帮助快速做出选择和决定",
    },
    {
      name: "游戏娱乐",
      icon: Sparkles,
      gradient: "hsl(262 83% 58% / 0.15)",
      count: 78,
      description: "趣味游戏、娱乐互动工具",
    },
    {
      name: "教育学习",
      icon: Target,
      gradient: "hsl(142 76% 36% / 0.15)",
      count: 56,
      description: "课堂互动、学习辅助工具",
    },
    {
      name: "工作效率",
      icon: Hash,
      gradient: "hsl(45 93% 47% / 0.15)",
      count: 64,
      description: "提升工作效率的随机化工具",
    },
    {
      name: "其他",
      icon: Grid3x3,
      gradient: "hsl(210 40% 96% / 0.15)",
      count: 43,
      description: "其他创意随机器工具",
    },
  ];

  // Sample projects for each category
  const categoryProjects = {
    随机选择: [
      {
        id: 1,
        name: "随机抽奖",
        icon: Dices,
        gradient: "hsl(220 13% 69% / 0.15)",
        creator: "张三",
        tags: ["抽奖", "娱乐"],
      },
      {
        id: 7,
        name: "幸运抽签",
        icon: Dices,
        gradient: "hsl(45 93% 47% / 0.15)",
        creator: "小明",
        tags: ["抽签", "幸运"],
      },
      {
        id: 12,
        name: "幸运色子",
        icon: Dices,
        gradient: "hsl(262 83% 58% / 0.15)",
        creator: "陈十",
        tags: ["色子", "幸运"],
      },
    ],
    团队分组: [
      {
        id: 2,
        name: "团队匹配",
        icon: UsersIcon,
        gradient: "hsl(330 81% 60% / 0.15)",
        creator: "李四",
        tags: ["团队", "协作"],
      },
      {
        id: 6,
        name: "分组助手",
        icon: UsersIcon,
        gradient: "hsl(142 76% 36% / 0.15)",
        creator: "周八",
        tags: ["分组", "助手"],
      },
      {
        id: 8,
        name: "随机队伍",
        icon: UsersIcon,
        gradient: "hsl(262 83% 58% / 0.15)",
        creator: "小红",
        tags: ["队伍", "分组"],
      },
    ],
    抽奖活动: [
      {
        id: 3,
        name: "幸运转盘",
        icon: Shuffle,
        gradient: "hsl(262 83% 58% / 0.15)",
        creator: "王五",
        tags: ["转盘", "随机"],
      },
      {
        id: 21,
        name: "快速抽签",
        icon: Shuffle,
        gradient: "hsl(330 81% 60% / 0.15)",
        creator: "张三",
        tags: ["抽签", "快速"],
      },
      {
        id: 29,
        name: "洗牌工具",
        icon: Shuffle,
        gradient: "hsl(45 93% 47% / 0.15)",
        creator: "冯十一",
        tags: ["洗牌", "工具"],
      },
    ],
    决策工具: [
      {
        id: 4,
        name: "快速决策",
        icon: Zap,
        gradient: "hsl(173 80% 40% / 0.15)",
        creator: "赵六",
        tags: ["决策", "快速"],
      },
      {
        id: 23,
        name: "闪电决策",
        icon: Zap,
        gradient: "hsl(45 93% 47% / 0.15)",
        creator: "王五",
        tags: ["决策", "快速"],
      },
      {
        id: 30,
        name: "速度决定",
        icon: Zap,
        gradient: "hsl(262 83% 58% / 0.15)",
        creator: "陈十二",
        tags: ["速度", "决定"],
      },
    ],
    游戏娱乐: [
      {
        id: 5,
        name: "名字生成",
        icon: Sparkles,
        gradient: "hsl(45 93% 47% / 0.15)",
        creator: "孙七",
        tags: ["名字", "生成"],
      },
      {
        id: 16,
        name: "幸运骰子",
        icon: Dices,
        gradient: "hsl(262 83% 58% / 0.15)",
        creator: "郑十",
        tags: ["骰子", "游戏"],
      },
      {
        id: 20,
        name: "灵感激发",
        icon: Sparkles,
        gradient: "hsl(330 81% 60% / 0.15)",
        creator: "卫十四",
        tags: ["灵感", "创意"],
      },
    ],
    教育学习: [
      {
        id: 10,
        name: "目标选择",
        icon: Target,
        gradient: "hsl(330 81% 60% / 0.15)",
        creator: "小张",
        tags: ["目标", "选择"],
      },
      {
        id: 15,
        name: "目标选择器",
        icon: Target,
        gradient: "hsl(330 81% 60% / 0.15)",
        creator: "吴九",
        tags: ["目标", "选择"],
      },
      {
        id: 19,
        name: "快速投票",
        icon: Zap,
        gradient: "hsl(45 93% 47% / 0.15)",
        creator: "褚十三",
        tags: ["投票", "决策"],
      },
    ],
    工作效率: [
      {
        id: 11,
        name: "随机数字",
        icon: Hash,
        gradient: "hsl(220 13% 69% / 0.15)",
        creator: "刘九",
        tags: ["数字", "随机"],
      },
      {
        id: 25,
        name: "幸运数字",
        icon: Hash,
        gradient: "hsl(142 76% 36% / 0.15)",
        creator: "孙七",
        tags: ["数字", "幸运"],
      },
      {
        id: 18,
        name: "随机排序",
        icon: Shuffle,
        gradient: "hsl(173 80% 40% / 0.15)",
        creator: "陈十二",
        tags: ["排序", "随机"],
      },
    ],
  };

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.back()}
              className="flex-shrink-0 -ml-1 hover:opacity-70 transition-opacity"
            >
              <ChevronLeft
                className="h-9 w-9 md:h-10 md:w-10"
                strokeWidth={2}
              />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              类别
            </h1>
          </div>
          <p className="text-muted-foreground ml-8 md:ml-9">
            按类别浏览所有随机器项目
          </p>
        </div>

        {/* Categories with Projects */}
        {categories.map((category, i) => (
          <div key={i} className="flex flex-col gap-4">
            {/* Category Header Card */}
            <Link href={`/explore/category/${i}`}>
              <Card
                className="h-[100px] hover:border-primary/50 hover:scale-[1.01] transition-all cursor-pointer border border-border/50 relative overflow-hidden group"
                style={{
                  background: `linear-gradient(270deg, ${category.gradient} 0%, transparent 50%)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div className="flex items-center gap-4">
                    <category.icon
                      className="h-12 w-12 transition-colors flex-shrink-0"
                      strokeWidth={1.5}
                      style={{ color: getLighterColor(category.gradient) }}
                    />
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        {category.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {category.count}
                    </p>
                    <p className="text-xs text-muted-foreground">个项目</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Sample Projects for this Category - Hidden on mobile */}
            {categoryProjects[
              category.name as keyof typeof categoryProjects
            ] && (
              <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryProjects[
                  category.name as keyof typeof categoryProjects
                ].map((project) => (
                  <ProjectCard
                    id={project.id}
                    name={project.name}
                    icon={project.icon}
                    gradientFrom={project.gradient}
                    gradientTo={project.gradient.replace("0.15", "0.01")}
                    creatorName={project.creator}
                    tags={project.tags}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
