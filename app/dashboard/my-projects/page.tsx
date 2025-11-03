"use client";

import { ProjectCard, NewProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import {
  Dices,
  Shuffle,
  TrendingUp,
  Users as UsersIcon,
  ChevronLeft,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyProjectsPage() {
  const userName = "用户";
  const router = useRouter();

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
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
              我的项目
            </h1>
          </div>
          <Link href="/editor/new">
            <Button>
              <PlusCircle className="mr-1.5 h-4 w-4" />
              新建项目
            </Button>
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ProjectCard
            id="1"
            name="随机选择器"
            icon={Dices}
            gradientFrom="hsl(220 13% 69% / 0.15)"
            gradientTo="hsl(220 13% 69% / 0.01)"
            creatorName={userName}
            tags={["随机选择", "列表"]}
          />
          <ProjectCard
            id="2"
            name="团队分组"
            icon={UsersIcon}
            gradientFrom="hsl(330 81% 60% / 0.15)"
            gradientTo="hsl(330 81% 60% / 0.01)"
            creatorName={userName}
            tags={["团队", "分组"]}
          />
          <ProjectCard
            id="3"
            name="抽奖转盘"
            icon={Shuffle}
            gradientFrom="hsl(262 83% 58% / 0.15)"
            gradientTo="hsl(262 83% 58% / 0.01)"
            creatorName={userName}
            tags={["抽奖", "娱乐"]}
          />
          <ProjectCard
            id="4"
            name="决策助手"
            icon={TrendingUp}
            gradientFrom="hsl(173 80% 40% / 0.15)"
            gradientTo="hsl(173 80% 40% / 0.01)"
            creatorName={userName}
            tags={["决策", "助手"]}
          />
          <ProjectCard
            id="5"
            name="随机选择器 2"
            icon={Dices}
            gradientFrom="hsl(220 13% 69% / 0.15)"
            gradientTo="hsl(220 13% 69% / 0.01)"
            creatorName={userName}
            tags={["随机选择", "列表"]}
          />
          <ProjectCard
            id="6"
            name="团队分组 2"
            icon={UsersIcon}
            gradientFrom="hsl(330 81% 60% / 0.15)"
            gradientTo="hsl(330 81% 60% / 0.01)"
            creatorName={userName}
            tags={["团队", "分组"]}
          />
          <NewProjectCard />
        </div>
      </div>
    </div>
  );
}
