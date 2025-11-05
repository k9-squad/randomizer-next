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
import React, { useState, useEffect } from "react";
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
  const [officialTemplates, setOfficialTemplates] = useState<any[]>([]);
  const [communityProjects, setCommunityProjects] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showAllTemplates, setShowAllTemplates] = useState(false);

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

      // 加载官方模板（加载全部，前端控制显示数量）
      const loadOfficialTemplates = async () => {
        try {
          const response = await fetch("/api/official-templates");
          if (response.ok) {
            const data = await response.json();
            setOfficialTemplates(data);
          }
        } catch (error) {
          console.error("加载官方模板失败:", error);
        }
      };

      // 加载社区热门项目
      const loadCommunityProjects = async () => {
        try {
          const response = await fetch(
            "/api/community/projects?sort=hot&limit=6"
          );
          if (response.ok) {
            const data = await response.json();
            setCommunityProjects(data);
          }
        } catch (error) {
          console.error("加载社区项目失败:", error);
        }
      };

      // 加载用户收藏
      const loadFavorites = async () => {
        if (session?.user?.id) {
          try {
            const response = await fetch("/api/favorites");
            if (response.ok) {
              const data = await response.json();
              setFavorites(data.slice(0, 6)); // 只显示前6个
            }
          } catch (error) {
            console.error("加载收藏失败:", error);
          }
        }
      };

      loadProjects();
      loadOfficialTemplates();
      loadCommunityProjects();
      loadFavorites();
    }
  }, [session?.user?.name, session?.user?.id]);

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

        {/* My Favorites Section */}
        {session?.user?.id && favorites.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard/favorites" className="group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Star className="h-5 w-5" />
                  <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                    我的收藏
                  </h2>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>

            <HorizontalScroll className="flex gap-4 pb-4 pl-2">
              {favorites.map((fav) => {
                const project = fav.project;
                if (!project) return null;

                let icon: LucideIcon | undefined;
                if (project.icon_type === "lucide" && project.icon_name) {
                  icon = (Icons as any)[project.icon_name] as LucideIcon;
                }

                const gradientFrom = project.theme_color
                  ? `${project.theme_color}26`
                  : "hsl(220 13% 69% / 0.15)";
                const gradientTo = project.theme_color
                  ? `${project.theme_color}0d`
                  : "hsl(220 13% 69% / 0.01)";

                return (
                  <Link
                    key={fav.id}
                    href={
                      fav.project_type === "official"
                        ? `/app/official/${project.id}`
                        : `/app/${project.id}`
                    }
                  >
                    <ProjectCard
                      id={project.id}
                      name={project.name}
                      icon={icon}
                      iconUrl={project.icon_url}
                      gradientFrom={gradientFrom}
                      gradientTo={gradientTo}
                      creatorName={
                        project.author?.name || project.type === "official"
                          ? "官方"
                          : "未知"
                      }
                      tags={project.tags || []}
                    />
                  </Link>
                );
              })}
            </HorizontalScroll>
          </div>
        )}

        {/* Favorites Section */}
        {isLoggedIn && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard/favorites" className="group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                    我的收藏
                  </h2>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>

            <div className="relative">
              {favorites.length > 0 ? (
                <HorizontalScroll className="flex gap-4 pb-4 pl-2">
                  {favorites.map((fav) => {
                    let icon: LucideIcon | undefined;
                    let iconUrl: string | undefined;

                    if (fav.icon_type === "image" && fav.icon_url) {
                      iconUrl = fav.icon_url;
                    } else if (fav.icon_type === "lucide" && fav.icon_name) {
                      icon = (Icons as any)[fav.icon_name] as LucideIcon;
                    }

                    const gradientFrom = fav.theme_color
                      ? `${fav.theme_color}26`
                      : "hsl(220 13% 69% / 0.15)";
                    const gradientTo = fav.theme_color
                      ? `${fav.theme_color}0d`
                      : "hsl(220 13% 69% / 0.01)";

                    return (
                      <Link key={fav.id} href={`/app/${fav.project_id}`}>
                        <ProjectCard
                          id={fav.project_id}
                          name={fav.name}
                          icon={icon}
                          iconUrl={iconUrl}
                          gradientFrom={gradientFrom}
                          gradientTo={gradientTo}
                          creatorName={fav.author_name || "未知"}
                          tags={fav.tags || []}
                        />
                      </Link>
                    );
                  })}
                </HorizontalScroll>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-lg">
                  <Star className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <h3 className="text-lg font-medium mb-1">还没有收藏</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    在社区中发现喜欢的项目，点击收藏星标即可添加到这里
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Official Templates Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">官方模板</h2>
            {officialTemplates.length > 6 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTemplates(!showAllTemplates)}
                className="text-muted-foreground hover:text-primary"
              >
                {showAllTemplates
                  ? "收起"
                  : `查看全部 ${officialTemplates.length} 个`}
                <ChevronRight
                  className={`ml-1 h-4 w-4 transition-transform ${
                    showAllTemplates ? "rotate-90" : ""
                  }`}
                />
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(showAllTemplates
              ? officialTemplates
              : officialTemplates.slice(0, 6)
            ).map((template) => {
              let icon: LucideIcon | undefined;
              if (template.icon_type === "lucide" && template.icon_name) {
                icon = (Icons as any)[template.icon_name] as LucideIcon;
              }

              const gradientFrom = template.theme_color
                ? `${template.theme_color}26`
                : "hsl(220 13% 69% / 0.15)";

              return (
                <Link key={template.id} href={`/app/official/${template.id}`}>
                  <Card
                    className="h-[100px] hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer border border-border/50 relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(270deg, ${gradientFrom} 0%, transparent 50%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-5">
                      <div className="flex flex-col items-start">
                        <h3 className="text-base font-semibold mb-1">
                          {template.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {template.description}
                        </p>
                      </div>
                      {icon &&
                        React.createElement(icon, {
                          className:
                            "h-14 w-14 group-hover:scale-110 transition-all flex-shrink-0",
                          strokeWidth: 1.5,
                          style: { color: template.theme_color },
                        })}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Community Popular Section */}
        <div className="flex flex-col gap-4">
          <Link href="/explore" className="group w-fit">
            <div className="flex items-center gap-2 cursor-pointer">
              <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                社区热门
              </h2>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {communityProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {communityProjects.map((project) => {
                let icon: LucideIcon | undefined;
                if (project.icon_type === "lucide" && project.icon_name) {
                  icon = (Icons as any)[project.icon_name] as LucideIcon;
                }

                const gradientFrom = project.theme_color
                  ? `${project.theme_color}26`
                  : "hsl(220 13% 69% / 0.15)";

                return (
                  <Link key={project.id} href={`/app/${project.id}`}>
                    <Card
                      className="h-[240px] hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative group border border-border/50"
                      style={{
                        background: `linear-gradient(180deg, ${gradientFrom} 0%, transparent 100%)`,
                      }}
                    >
                      {/* 上部：图标区域 */}
                      <div className="absolute top-0 left-0 right-0 h-[150px] flex items-center justify-center">
                        {icon &&
                          React.createElement(icon, {
                            className:
                              "h-20 w-20 group-hover:scale-110 transition-all duration-300",
                            strokeWidth: 1.5,
                            style: { color: project.theme_color },
                          })}
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
                              {project.star_count || 0}
                            </span>
                          </div>
                        </div>

                        {/* 底部区域：左边标签，右边用户 */}
                        <div className="flex items-end justify-between gap-2">
                          {/* 标签 - 左下角 */}
                          <div className="flex flex-wrap gap-1.5">
                            {(project.tags || [])
                              .slice(0, 2)
                              .map((tag: string, index: number) => (
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
                              {project.author_name || "未知"}
                            </span>
                            <Avatar className="h-5 w-5 ring-1 ring-border">
                              <AvatarFallback className="text-[10px]">
                                {(project.author_name || "U").charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-lg">
              <TrendingUp className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <h3 className="text-lg font-medium mb-1">暂无热门项目</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                成为第一个发布项目的用户，分享你的创意吧！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
