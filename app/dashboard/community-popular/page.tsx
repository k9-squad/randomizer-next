"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dices,
  Shuffle,
  TrendingUp,
  Users as UsersIcon,
  Sparkles,
  PlusCircle,
  ArrowLeft,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function CommunityPopularPage() {
  const projects = [
    {
      id: 1,
      name: "随机抽奖",
      icon: Dices,
      gradient: "hsl(220 13% 69% / 0.15)",
      creator: "张三",
      stars: 110,
      tags: ["抽奖", "娱乐"],
    },
    {
      id: 2,
      name: "团队匹配",
      icon: UsersIcon,
      gradient: "hsl(330 81% 60% / 0.15)",
      creator: "李四",
      stars: 120,
      tags: ["团队", "协作"],
    },
    {
      id: 3,
      name: "幸运转盘",
      icon: Shuffle,
      gradient: "hsl(262 83% 58% / 0.15)",
      creator: "王五",
      stars: 130,
      tags: ["转盘", "随机"],
    },
    {
      id: 4,
      name: "数字魔方",
      icon: TrendingUp,
      gradient: "hsl(173 80% 40% / 0.15)",
      creator: "赵六",
      stars: 140,
      tags: ["数字", "生成"],
    },
    {
      id: 5,
      name: "决策助手",
      icon: Sparkles,
      gradient: "hsl(45 93% 47% / 0.15)",
      creator: "孙七",
      stars: 150,
      tags: ["决策", "辅助"],
    },
    {
      id: 6,
      name: "名称生成",
      icon: PlusCircle,
      gradient: "hsl(142 76% 36% / 0.15)",
      creator: "周八",
      stars: 160,
      tags: ["名称", "创意"],
    },
    {
      id: 7,
      name: "幸运数字",
      icon: Dices,
      gradient: "hsl(220 13% 69% / 0.15)",
      creator: "钱九",
      stars: 170,
      tags: ["数字", "幸运"],
    },
    {
      id: 8,
      name: "分组工具",
      icon: UsersIcon,
      gradient: "hsl(330 81% 60% / 0.15)",
      creator: "陈十",
      stars: 180,
      tags: ["分组", "工具"],
    },
    {
      id: 9,
      name: "随机事件",
      icon: Shuffle,
      gradient: "hsl(262 83% 58% / 0.15)",
      creator: "林一",
      stars: 190,
      tags: ["事件", "随机"],
    },
    {
      id: 10,
      name: "趋势分析",
      icon: TrendingUp,
      gradient: "hsl(173 80% 40% / 0.15)",
      creator: "黄二",
      stars: 200,
      tags: ["分析", "趋势"],
    },
    {
      id: 11,
      name: "创意火花",
      icon: Sparkles,
      gradient: "hsl(45 93% 47% / 0.15)",
      creator: "吴三",
      stars: 210,
      tags: ["创意", "灵感"],
    },
    {
      id: 12,
      name: "快速生成",
      icon: PlusCircle,
      gradient: "hsl(142 76% 36% / 0.15)",
      creator: "郑四",
      stars: 220,
      tags: ["生成", "快速"],
    },
  ];

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            社区热门
          </h1>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/app/${project.id}`}>
              <Card
                className="h-[240px] hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative group border border-border/50"
                style={{
                  background: `linear-gradient(180deg, ${project.gradient} 0%, transparent 100%)`,
                }}
              >
                {/* 上部：图标区域 */}
                <div className="absolute top-0 left-0 right-0 h-[150px] flex items-center justify-center">
                  <project.icon
                    className="h-20 w-20 text-foreground/40 group-hover:text-foreground/60 group-hover:scale-110 transition-all duration-300"
                    strokeWidth={1.5}
                  />
                </div>

                {/* 下部：文字信息区域 */}
                <div className="absolute bottom-0 left-0 right-0 h-[90px] p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 flex flex-col">
                  {/* 标题和星标 */}
                  <div className="flex items-start justify-between mb-auto">
                    <h3 className="text-lg font-semibold truncate flex-1">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">
                        {project.stars}
                      </span>
                    </div>
                  </div>

                  {/* 底部区域：左边标签，右边用户 */}
                  <div className="flex items-end justify-between gap-2">
                    {/* 标签 - 左下角 */}
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

                    {/* 创建者信息 - 右下角 */}
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
  );
}
