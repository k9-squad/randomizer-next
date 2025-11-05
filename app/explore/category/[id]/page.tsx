"use client";

import { useState, useEffect, use } from "react";
import { CommunityProjectCard } from "@/components/community-project-card";
import { PageContainer } from "@/components/page-container";
import { BackHeader } from "@/components/back-header";
import { ProjectGrid } from "@/components/project-grid";
import {
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { CATEGORIES } from "@/lib/mock-data";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

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

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const { id } = use(params);
  const categoryId = parseInt(id);
  const [categoryProjects, setCategoryProjects] = useState<CommunityProject[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // 使用全局分类定义
  const category = CATEGORIES[categoryId] || CATEGORIES[0];

  // 加载该分类的项目
  useEffect(() => {
    const loadCategoryProjects = async () => {
      if (!category) return;

      try {
        setLoading(true);
        // 根据分类名称获取项目（通过标签筛选）
        const res = await fetch(
          `/api/community/projects?category=${encodeURIComponent(
            category.name
          )}&limit=20`
        );
        if (res.ok) {
          const data = await res.json();
          setCategoryProjects(data);
        }
      } catch (error) {
        console.error("加载分类项目失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProjects();
  }, [categoryId, category]);

  return (
    <PageContainer>
      <BackHeader title={category.name} description={category.description} />

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">加载中...</p>
        </div>
      ) : categoryProjects.length === 0 ? (
        <Empty>
          <EmptyIcon>
            <category.icon className="h-16 w-16" />
          </EmptyIcon>
          <EmptyTitle>暂无项目</EmptyTitle>
          <EmptyDescription>
            这个类别还没有项目，快来创建第一个吧！
          </EmptyDescription>
        </Empty>
      ) : (
        <ProjectGrid columns={4}>
          {categoryProjects.map((project) => (
            <CommunityProjectCard key={project.id} project={project} />
          ))}
        </ProjectGrid>
      )}
    </PageContainer>
  );
}
