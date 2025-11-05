"use client";

import { useState, useEffect } from "react";
import { ProjectCard, NewProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import {
  Dices,
  Shuffle,
  Sparkles,
  ChevronLeft,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllProjects, type StoredProject } from "@/lib/storage";
import { GridSkeleton } from "@/components/skeletons";

export default function MyProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取所有项目并按修改时间排序（最新的在前）
    const loadProjects = async () => {
      setLoading(true);
      const allProjects = await getAllProjects();
      allProjects.sort((a, b) => {
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        return timeB - timeA; // 降序：最新的在前
      });
      setProjects(allProjects);
      setLoading(false);
    };

    loadProjects();
  }, []);

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
          <Link href="/new">
            <Button>
              <PlusCircle className="mr-1.5 h-4 w-4" />
              新建项目
            </Button>
          </Link>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <GridSkeleton count={8} columns={4} cardType="project" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => {
              // 获取图标
              let icon: LucideIcon | undefined;
              let iconUrl: string | undefined;

              if (project.iconType === "image" && project.iconUrl) {
                iconUrl = project.iconUrl;
              } else if (project.iconName) {
                icon = (Icons as any)[project.iconName] as LucideIcon;
              } else {
                // 默认图标：根据模式选择
                icon = project.config.mode === "grouping" ? Shuffle : Dices;
              }

              // 获取主题色
              const themeColor = project.themeColor || "#a855f7";
              const gradientFrom = `${themeColor}26`; // 15% opacity
              const gradientTo = `${themeColor}0d`; // 5% opacity

              return (
                <ProjectCard
                  id={project.id}
                  name={project.name}
                  icon={icon}
                  iconUrl={iconUrl}
                  gradientFrom={gradientFrom}
                  gradientTo={gradientTo}
                  creatorName="我"
                  tags={project.tags || []}
                />
              );
            })}
            <NewProjectCard key="new-project" />
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-4">还没有项目</p>
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
  );
}
