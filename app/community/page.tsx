"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TrendingUp,
  Clock,
  Grid3x3,
  Sparkles,
  ChevronRight,
  Search,
  RefreshCw,
  Dices,
  Users as UsersIcon,
  Shuffle,
  Zap,
  Target,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { ProjectCard } from "@/components/project-card";

export default function CommunityPage() {
  const [luckyProjects, setLuckyProjects] = useState([
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
  ]);

  const refreshLuckyProjects = () => {
    // 模拟随机刷新项目
    const allProjects = [
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
    ];
    const shuffled = [...allProjects].sort(() => Math.random() - 0.5);
    setLuckyProjects(shuffled.slice(0, 2));
  };

  const categories = [
    {
      name: "随机选择",
      icon: Dices,
      gradient: "hsl(220 13% 69% / 0.15)",
      count: 128,
    },
    {
      name: "团队协作",
      icon: UsersIcon,
      gradient: "hsl(330 81% 60% / 0.15)",
      count: 95,
    },
    {
      name: "抽奖活动",
      icon: Shuffle,
      gradient: "hsl(262 83% 58% / 0.15)",
      count: 156,
    },
    {
      name: "决策辅助",
      icon: Zap,
      gradient: "hsl(173 80% 40% / 0.15)",
      count: 87,
    },
    {
      name: "数字生成",
      icon: Hash,
      gradient: "hsl(45 93% 47% / 0.15)",
      count: 64,
    },
    {
      name: "其他",
      icon: Grid3x3,
      gradient: "hsl(142 76% 36% / 0.15)",
      count: 43,
    },
  ];

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Header */}
        <div className="mt-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            探索
          </h1>
          <p className="text-muted-foreground mt-1">发现和分享创意随机器项目</p>
        </div>

        {/* Hot Projects Section */}
        <div className="flex flex-col gap-4">
          <Link href="/community/hot" className="group w-fit">
            <div className="flex items-center gap-2 cursor-pointer">
              <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                热门项目
              </h2>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <div className="relative">
            <HorizontalScroll className="flex gap-4 pb-4 pl-2">
              {[
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
              ].map((project) => (
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
            </HorizontalScroll>
          </div>
        </div>

        {/* Latest Projects Section */}
        <div className="flex flex-col gap-4">
          <Link href="/community/latest" className="group w-fit">
            <div className="flex items-center gap-2 cursor-pointer">
              <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                最新上传
              </h2>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <div className="relative">
            <HorizontalScroll className="flex gap-4 pb-4 pl-2">
              {[
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
              ].map((project) => (
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
            </HorizontalScroll>
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex flex-col gap-4">
          <Link href="/community/categories" className="group w-fit">
            <div className="flex items-center gap-2 cursor-pointer">
              <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                类别
              </h2>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, i) => (
              <Link key={i} href={`/community/category/${i}`}>
                <Card
                  className="h-[80px] hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer border border-border/50 relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(270deg, ${category.gradient} 0%, transparent 50%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                      <category.icon
                        className="h-8 w-8 text-foreground/40 group-hover:text-foreground/60 transition-colors flex-shrink-0"
                        strokeWidth={1.5}
                      />
                      <div>
                        <h3 className="text-base font-semibold">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.count} 个项目
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Lucky Pick Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">手气不错</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshLuckyProjects}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              换一批
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {luckyProjects.map((project) => (
              <Link key={project.id} href={`/app/${project.id}`}>
                <Card
                  className="h-[240px] hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative group border border-border/50"
                  style={{
                    background: `linear-gradient(180deg, ${project.gradient} 0%, transparent 100%)`,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[150px] flex items-center justify-center">
                    <project.icon
                      className="h-20 w-20 text-foreground/40 group-hover:text-foreground/60 group-hover:scale-110 transition-all duration-300"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[90px] p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 flex flex-col">
                    <h3 className="text-lg font-semibold mb-auto truncate">
                      {project.name}
                    </h3>
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-secondary/80 rounded text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                          {project.creator}
                        </span>
                        <Avatar className="h-5 w-5 ring-1 ring-border">
                          <AvatarFallback className="text-[10px]">
                            {project.creator.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
