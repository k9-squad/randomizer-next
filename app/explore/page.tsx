"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Compass } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { CommunityProjectCard } from "@/components/community-project-card";
import { getLighterColor } from "@/lib/color-utils";
import { PageContainer } from "@/components/page-container";
import { SectionWrapper } from "@/components/section-wrapper";
import { ProjectGrid } from "@/components/project-grid";
import {
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { CATEGORIES } from "@/lib/mock-data";
import { HorizontalScrollSkeleton, GridSkeleton } from "@/components/skeletons";

interface CommunityProject {
  id: string;
  name: string;
  icon_type?: string;
  icon_name?: string;
  theme_color?: string;
  star_count?: number;
  tags?: string[];
  author_name?: string;
}

interface CategoryCount {
  name: string;
  count: number;
}

export default function ExplorePage() {
  const [hotProjects, setHotProjects] = useState<CommunityProject[]>([]);
  const [latestProjects, setLatestProjects] = useState<CommunityProject[]>([]);
  const [luckyProjects, setLuckyProjects] = useState<CommunityProject[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载项目数据
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);

        // 并行加载热门、最新项目和分类统计
        const [hotRes, latestRes, categoriesRes] = await Promise.all([
          fetch("/api/community/projects?sort=hot&limit=4"),
          fetch("/api/community/projects?sort=latest&limit=4"),
          fetch("/api/community/categories"),
        ]);

        if (hotRes.ok) {
          const hotData = await hotRes.json();
          setHotProjects(hotData);
        }

        if (latestRes.ok) {
          const latestData = await latestRes.json();
          setLatestProjects(latestData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategoryCounts(categoriesData);
        }

        // 手气不错：从所有项目中随机选择
        const allRes = await fetch(
          "/api/community/projects?sort=latest&limit=20"
        );
        if (allRes.ok) {
          const allData = await allRes.json();
          // 随机打乱并选择2个
          const shuffled = allData.sort(() => Math.random() - 0.5);
          setLuckyProjects(shuffled.slice(0, 2));
        }
      } catch (error) {
        console.error("加载探索页面数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const refreshLuckyProjects = async () => {
    try {
      const res = await fetch("/api/community/projects?sort=latest&limit=20");
      if (res.ok) {
        const data = await res.json();
        const shuffled = data.sort(() => Math.random() - 0.5);
        setLuckyProjects(shuffled.slice(0, 2));
      }
    } catch (error) {
      console.error("刷新手气不错失败:", error);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mt-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">探索</h1>
        <p className="text-muted-foreground mt-1">发现和分享创意随机器项目</p>
      </div>

      {/* Hot Projects Section */}
      <SectionWrapper title="热门项目" href="/explore/hot">
        {loading ? (
          <HorizontalScrollSkeleton count={4} />
        ) : hotProjects.length === 0 ? (
          <Empty>
            <EmptyIcon>
              <Compass className="h-12 w-12" />
            </EmptyIcon>
            <EmptyTitle>暂无热门项目</EmptyTitle>
            <EmptyDescription>
              目前还没有公开的项目，快去创建并发布第一个项目吧！
            </EmptyDescription>
          </Empty>
        ) : (
          <HorizontalScroll className="flex gap-4 pb-4 pl-2">
            {hotProjects.map((project) => (
              <CommunityProjectCard key={project.id} project={project} />
            ))}
          </HorizontalScroll>
        )}
      </SectionWrapper>

      {/* Latest Projects Section */}
      <SectionWrapper title="最新上传" href="/explore/latest">
        {loading ? (
          <HorizontalScrollSkeleton count={4} />
        ) : latestProjects.length === 0 ? (
          <Empty>
            <EmptyIcon>
              <Compass className="h-12 w-12" />
            </EmptyIcon>
            <EmptyTitle>暂无最新项目</EmptyTitle>
            <EmptyDescription>
              目前还没有公开的项目，快去创建并发布第一个项目吧！
            </EmptyDescription>
          </Empty>
        ) : (
          <HorizontalScroll className="flex gap-4 pb-4 pl-2">
            {latestProjects.map((project) => (
              <CommunityProjectCard key={project.id} project={project} />
            ))}
          </HorizontalScroll>
        )}
      </SectionWrapper>

      {/* Categories Section */}
      <SectionWrapper title="类别" href="/explore/categories">
        {loading ? (
          <GridSkeleton count={8} columns={3} cardType="category" />
        ) : (
          <ProjectGrid columns={3}>
            {CATEGORIES.map((category) => {
              // 从 API 获取真实的分类计数
              const countData = categoryCounts.find(
                (c) => c.name === category.name
              );
              const realCount = countData?.count ?? 0;

              return (
                <Link
                  key={category.id}
                  href={`/explore/category/${category.id}`}
                >
                  <Card
                    className="h-[80px] hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer border border-border/50 relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(270deg, ${category.gradient} 0%, transparent 50%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <div className="flex items-center gap-3">
                        <category.icon
                          className="h-8 w-8 transition-colors flex-shrink-0"
                          strokeWidth={1.5}
                          style={{ color: getLighterColor(category.gradient) }}
                        />
                        <div>
                          <h3 className="text-base font-semibold">
                            {category.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {realCount} 个项目
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </ProjectGrid>
        )}
      </SectionWrapper>

      {/* Lucky Pick Section */}
      <SectionWrapper
        title="手气不错"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={refreshLuckyProjects}
            className="gap-2"
            disabled={loading || luckyProjects.length === 0}
          >
            <RefreshCw className="h-4 w-4" />
            换一批
          </Button>
        }
      >
        {loading ? (
          <GridSkeleton count={2} columns={2} cardType="project" />
        ) : luckyProjects.length === 0 ? (
          <Empty>
            <EmptyIcon>
              <Compass className="h-12 w-12" />
            </EmptyIcon>
            <EmptyTitle>暂无项目</EmptyTitle>
            <EmptyDescription>
              目前还没有公开的项目，快去创建并发布第一个项目吧！
            </EmptyDescription>
          </Empty>
        ) : (
          <ProjectGrid columns={2}>
            {luckyProjects.map((project) => (
              <CommunityProjectCard key={project.id} project={project} />
            ))}
          </ProjectGrid>
        )}
      </SectionWrapper>
    </PageContainer>
  );
}
