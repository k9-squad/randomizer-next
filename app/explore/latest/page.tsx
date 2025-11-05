"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
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
import { GridSkeleton } from "@/components/skeletons";

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

export default function LatestProjectsPage() {
  const [latestProjects, setLatestProjects] = useState<CommunityProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/community/projects?sort=latest&limit=20");
        if (res.ok) {
          const data = await res.json();
          setLatestProjects(data);
        }
      } catch (error) {
        console.error("加载最新项目失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLatestProjects();
  }, []);

  return (
    <PageContainer>
      <BackHeader
        title="最新上传"
        description="最新发布的随机器项目，持续更新"
      />

      {loading ? (
        <GridSkeleton count={12} columns={4} cardType="project" />
      ) : latestProjects.length === 0 ? (
        <Empty>
          <EmptyIcon>
            <Clock className="h-16 w-16" />
          </EmptyIcon>
          <EmptyTitle>暂无最新项目</EmptyTitle>
          <EmptyDescription>
            目前还没有公开的项目，快去创建并发布第一个项目吧！
          </EmptyDescription>
        </Empty>
      ) : (
        <ProjectGrid columns={4}>
          {latestProjects.map((project) => (
            <CommunityProjectCard key={project.id} project={project} />
          ))}
        </ProjectGrid>
      )}
    </PageContainer>
  );
}
