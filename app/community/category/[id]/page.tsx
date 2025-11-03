"use client";

import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import {
  Dices,
  Users as UsersIcon,
  Shuffle,
  Zap,
  Hash,
  Grid3x3,
  ChevronLeft,
} from "lucide-react";
import { use } from "react";
import { useRouter } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const { id } = use(params);
  const categoryId = parseInt(id);
  const router = useRouter();

  const categories = [
    {
      name: "随机选择",
      icon: Dices,
      gradient: "hsl(220 13% 69% / 0.15)",
      description: "从多个选项中随机选择一个或多个",
    },
    {
      name: "团队协作",
      icon: UsersIcon,
      gradient: "hsl(330 81% 60% / 0.15)",
      description: "团队分组、成员匹配等协作工具",
    },
    {
      name: "抽奖活动",
      icon: Shuffle,
      gradient: "hsl(262 83% 58% / 0.15)",
      description: "各类抽奖、转盘、摇奖工具",
    },
    {
      name: "决策辅助",
      icon: Zap,
      gradient: "hsl(173 80% 40% / 0.15)",
      description: "帮助快速做出选择和决定",
    },
    {
      name: "数字生成",
      icon: Hash,
      gradient: "hsl(45 93% 47% / 0.15)",
      description: "随机数字、号码、密码生成器",
    },
    {
      name: "其他",
      icon: Grid3x3,
      gradient: "hsl(142 76% 36% / 0.15)",
      description: "其他创意随机器工具",
    },
  ];

  const categoryProjects: Record<number, any[]> = {
    0: [
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
      {
        id: 16,
        name: "幸运骰子",
        icon: Dices,
        gradient: "hsl(262 83% 58% / 0.15)",
        creator: "郑十",
        tags: ["骰子", "游戏"],
      },
      {
        id: 28,
        name: "骰子大师",
        icon: Dices,
        gradient: "hsl(173 80% 40% / 0.15)",
        creator: "郑十",
        tags: ["骰子", "游戏"],
      },
    ],
    1: [
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
      {
        id: 17,
        name: "团队分组",
        icon: UsersIcon,
        gradient: "hsl(220 13% 69% / 0.15)",
        creator: "冯十一",
        tags: ["团队", "分组"],
      },
      {
        id: 24,
        name: "队伍生成",
        icon: UsersIcon,
        gradient: "hsl(262 83% 58% / 0.15)",
        creator: "赵六",
        tags: ["队伍", "生成"],
      },
      {
        id: 31,
        name: "分组大师",
        icon: UsersIcon,
        gradient: "hsl(142 76% 36% / 0.15)",
        creator: "褚十三",
        tags: ["分组", "工具"],
      },
    ],
    2: [
      {
        id: 3,
        name: "幸运转盘",
        icon: Shuffle,
        gradient: "hsl(262 83% 58% / 0.15)",
        creator: "王五",
        tags: ["转盘", "随机"],
      },
      {
        id: 18,
        name: "随机排序",
        icon: Shuffle,
        gradient: "hsl(173 80% 40% / 0.15)",
        creator: "陈十二",
        tags: ["排序", "随机"],
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
    3: [
      {
        id: 4,
        name: "快速决策",
        icon: Zap,
        gradient: "hsl(173 80% 40% / 0.15)",
        creator: "赵六",
        tags: ["决策", "快速"],
      },
      {
        id: 19,
        name: "快速投票",
        icon: Zap,
        gradient: "hsl(45 93% 47% / 0.15)",
        creator: "褚十三",
        tags: ["投票", "决策"],
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
    4: [
      {
        id: 11,
        name: "随机数字",
        icon: Hash,
        gradient: "hsl(220 13% 69% / 0.15)",
        creator: "刘九",
        tags: ["数字", "随机"],
      },
      {
        id: 13,
        name: "随机数生成",
        icon: Hash,
        gradient: "hsl(45 93% 47% / 0.15)",
        creator: "孙七",
        tags: ["数字", "生成"],
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
        id: 32,
        name: "号码生成",
        icon: Hash,
        gradient: "hsl(220 13% 69% / 0.15)",
        creator: "卫十四",
        tags: ["号码", "生成"],
      },
    ],
    5: [
      {
        id: 14,
        name: "创意生成器",
        icon: Grid3x3,
        gradient: "hsl(142 76% 36% / 0.15)",
        creator: "周八",
        tags: ["创意", "灵感"],
      },
      {
        id: 15,
        name: "目标选择器",
        icon: Grid3x3,
        gradient: "hsl(330 81% 60% / 0.15)",
        creator: "吴九",
        tags: ["目标", "选择"],
      },
    ],
  };

  const category = categories[categoryId] || categories[0];
  const projects = categoryProjects[categoryId] || [];

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-6xl flex flex-col gap-6">
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
              {category.name}
            </h1>
          </div>
          <p className="text-muted-foreground ml-8 md:ml-9">
            {category.description}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
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

        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <category.icon className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">暂无项目</h3>
            <p className="text-sm text-muted-foreground">
              这个类别还没有项目，快来创建第一个吧！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
