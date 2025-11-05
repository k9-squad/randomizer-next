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

export default function LatestProjectsPage() {
  const router = useRouter();
  const latestProjects = [
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
      id: 21,
      name: "快速抽签",
      icon: Shuffle,
      gradient: "hsl(330 81% 60% / 0.15)",
      creator: "张三",
      stars: 28,
      tags: ["抽签", "快速"],
    },
    {
      id: 22,
      name: "选择困难症",
      icon: Target,
      gradient: "hsl(173 80% 40% / 0.15)",
      creator: "李四",
      stars: 35,
      tags: ["选择", "决策"],
    },
    {
      id: 23,
      name: "闪电决策",
      icon: Zap,
      gradient: "hsl(45 93% 47% / 0.15)",
      creator: "王五",
      stars: 31,
      tags: ["决策", "快速"],
    },
    {
      id: 24,
      name: "队伍生成",
      icon: UsersIcon,
      gradient: "hsl(262 83% 58% / 0.15)",
      creator: "赵六",
      stars: 26,
      tags: ["队伍", "生成"],
    },
    {
      id: 25,
      name: "幸运数字",
      icon: Hash,
      gradient: "hsl(142 76% 36% / 0.15)",
      creator: "孙七",
      stars: 23,
      tags: ["数字", "幸运"],
    },
    {
      id: 26,
      name: "灵感火花",
      icon: Sparkles,
      gradient: "hsl(220 13% 69% / 0.15)",
      creator: "周八",
      stars: 29,
      tags: ["灵感", "创意"],
    },
    {
      id: 27,
      name: "随机挑战",
      icon: Target,
      gradient: "hsl(330 81% 60% / 0.15)",
      creator: "吴九",
      stars: 19,
      tags: ["挑战", "随机"],
    },
    {
      id: 28,
      name: "骰子大师",
      icon: Dices,
      gradient: "hsl(173 80% 40% / 0.15)",
      creator: "郑十",
      stars: 22,
      tags: ["骰子", "游戏"],
    },
    {
      id: 29,
      name: "洗牌工具",
      icon: Shuffle,
      gradient: "hsl(45 93% 47% / 0.15)",
      creator: "冯十一",
      stars: 17,
      tags: ["洗牌", "工具"],
    },
    {
      id: 30,
      name: "速度决定",
      icon: Zap,
      gradient: "hsl(262 83% 58% / 0.15)",
      creator: "陈十二",
      stars: 21,
      tags: ["速度", "决定"],
    },
    {
      id: 31,
      name: "分组大师",
      icon: UsersIcon,
      gradient: "hsl(142 76% 36% / 0.15)",
      creator: "褚十三",
      stars: 15,
      tags: ["分组", "工具"],
    },
    {
      id: 32,
      name: "号码生成",
      icon: Hash,
      gradient: "hsl(220 13% 69% / 0.15)",
      creator: "卫十四",
      stars: 18,
      tags: ["号码", "生成"],
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
              最新上传
            </h1>
          </div>
          <p className="text-muted-foreground ml-8 md:ml-9">
            最新发布的随机器项目，持续更新
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {latestProjects.map((project) => (
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
      </div>
    </div>
  );
}
