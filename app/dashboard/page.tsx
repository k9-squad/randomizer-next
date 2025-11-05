"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  PlusCircle,
  Dices,
  Star,
  TrendingUp,
  Sparkles,
  Shuffle,
  Users as UsersIcon,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { ProjectCard, NewProjectCard } from "@/components/project-card";
import { getAllProjects, type StoredProject } from "@/lib/storage";
import { getLighterColor } from "@/lib/color-utils";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [myProjects, setMyProjects] = useState<StoredProject[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserType(localStorage.getItem("userType"));
      // 优先使用session中的用户名
      const name =
        session?.user?.name || localStorage.getItem("userName") || "用户";
      setUserName(name);

      // 加载用户项目并按修改时间排序（最新的在前）
      const loadProjects = async () => {
        const projects = await getAllProjects();
        const userProjects = projects.filter((p) => p.isOwner !== false);
        userProjects.sort((a, b) => {
          const timeA = new Date(a.updatedAt).getTime();
          const timeB = new Date(b.updatedAt).getTime();
          return timeB - timeA; // 降序：最新的在前
        });
        setMyProjects(userProjects);
      };

      loadProjects();
    }
  }, [session?.user?.name]);

  // 获取问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "早上好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  // 判断是否为游客
  const isGuest = userType === "guest";
  // 判断是否已登录（包括游客和正式用户）
  const isLoggedIn = userType === "user";

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Welcome Section */}
        <div className="flex flex-col gap-4">
          <div className="mt-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {!userType
                ? "欢迎使用 Randomizer"
                : isLoggedIn
                ? `${getGreeting()}，${userName}`
                : "你好，游客"}
            </h1>
            {!userType || isGuest ? (
              <p className="text-muted-foreground mt-1">
                <Link
                  href="/login"
                  className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors"
                >
                  登录
                </Link>{" "}
                即可保存并与世界分享您的项目
              </p>
            ) : (
              <p className="text-muted-foreground mt-1">
                欢迎回来，继续你的创作之旅
              </p>
            )}
          </div>
        </div>

        {/* My Projects Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/my-projects" className="group">
              <div className="flex items-center gap-2 cursor-pointer">
                <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                  我的项目
                </h2>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
            <Link href="/new">
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-1.5 h-4 w-4" />
                新建项目
              </Button>
            </Link>
          </div>

          {/* Projects Horizontal Scroll */}
          <div className="relative">
            {myProjects.length > 0 ? (
              <HorizontalScroll className="flex gap-4 pb-4 pl-2">
                {myProjects.map((project) => {
                  let icon: LucideIcon | undefined;
                  let iconUrl: string | undefined;

                  if (project.iconType === "image" && project.iconUrl) {
                    iconUrl = project.iconUrl;
                  } else if (
                    project.iconType === "lucide" &&
                    project.iconName
                  ) {
                    icon = (Icons as any)[project.iconName] as LucideIcon;
                  }

                  const gradientFrom = project.themeColor
                    ? `${project.themeColor}26`
                    : "hsl(220 13% 69% / 0.15)";
                  const gradientTo = project.themeColor
                    ? `${project.themeColor}0d`
                    : "hsl(220 13% 69% / 0.01)";

                  return (
                    <ProjectCard
                      id={project.id}
                      name={project.name}
                      icon={icon}
                      iconUrl={iconUrl}
                      gradientFrom={gradientFrom}
                      gradientTo={gradientTo}
                      creatorName={userName}
                      tags={project.tags || []}
                    />
                  );
                })}
                <NewProjectCard key="new-project" />
              </HorizontalScroll>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">还没有项目</p>
                <Link href="/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    创建第一个项目
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Official Templates Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">官方模板</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "简单随机器",
                desc: "从列表中随机选择项目",
                Icon: Dices,
                gradient: "hsl(220 13% 69% / 0.15)",
              },
              {
                name: "团队分组",
                desc: "自动创建随机团队",
                Icon: UsersIcon,
                gradient: "hsl(330 81% 60% / 0.15)",
              },
              {
                name: "数字生成器",
                desc: "生成随机数字",
                Icon: TrendingUp,
                gradient: "hsl(173 80% 40% / 0.15)",
              },
              {
                name: "抽奖转盘",
                desc: "可视化抽奖工具",
                Icon: Shuffle,
                gradient: "hsl(262 83% 58% / 0.15)",
              },
              {
                name: "问题决策器",
                desc: "帮你做出选择",
                Icon: Sparkles,
                gradient: "hsl(45 93% 47% / 0.15)",
              },
              {
                name: "名字生成器",
                desc: "随机生成名字",
                Icon: PlusCircle,
                gradient: "hsl(142 76% 36% / 0.15)",
              },
            ].map((template, i) => (
              <Link key={i} href="/new">
                <Card
                  className="h-[100px] hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer border border-border/50 relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(270deg, ${template.gradient} 0%, transparent 50%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-5">
                    <div className="flex flex-col items-start">
                      <h3 className="text-base font-semibold mb-1">
                        {template.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {template.desc}
                      </p>
                    </div>
                    <template.Icon
                      className="h-14 w-14 group-hover:scale-110 transition-all flex-shrink-0"
                      strokeWidth={1.5}
                      style={{ color: getLighterColor(template.gradient) }}
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Community Popular Section */}
        <div className="flex flex-col gap-4">
          <Link href="/dashboard/community-popular" className="group w-fit">
            <div className="flex items-center gap-2 cursor-pointer">
              <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                社区热门
              </h2>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
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
            ].map((project) => (
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
                      className="h-20 w-20 group-hover:scale-110 transition-all duration-300"
                      strokeWidth={1.5}
                      style={{ color: getLighterColor(project.gradient) }}
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
    </div>
  );
}
