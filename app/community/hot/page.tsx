"use client";

import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import {
  Dices,
  Users as UsersIcon,
  Shuffle,
  Zap,
  Hash,
  Sparkles,
  Target,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HotProjectsPage() {
  const router = useRouter();
  const hotProjects = [
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
              热门项目
            </h1>
          </div>
          <p className="text-muted-foreground ml-8 md:ml-9">
            最受欢迎的随机器项目，按热度排序
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hotProjects.map((project) => (
            <ProjectCard
              key={project.id}
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
      </div>
    </div>
  );
}
