"use client";

import { ProjectCard } from "@/components/project-card";
import { PageContainer } from "@/components/page-container";
import { BackHeader } from "@/components/back-header";
import { ProjectGrid } from "@/components/project-grid";
import { getHotProjects } from "@/lib/mock-data";

export default function HotProjectsPage() {
  const hotProjects = getHotProjects(12);

  return (
    <PageContainer>
      <BackHeader
        title="热门项目"
        description="最受欢迎的随机器项目，按热度排序"
      />

      <ProjectGrid columns={4}>
        {hotProjects.map((project) => (
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
      </ProjectGrid>
    </PageContainer>
  );
}
