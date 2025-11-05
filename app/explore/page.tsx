"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { ProjectCard } from "@/components/project-card";
import { getLighterColor } from "@/lib/color-utils";
import { PageContainer } from "@/components/page-container";
import { SectionWrapper } from "@/components/section-wrapper";
import { ProjectGrid } from "@/components/project-grid";
import {
  getHotProjects,
  getLatestProjects,
  getRandomProjects,
  CATEGORIES,
} from "@/lib/mock-data";

export default function CommunityPage() {
  const [luckyProjects, setLuckyProjects] = useState(() =>
    getRandomProjects(2)
  );

  const refreshLuckyProjects = () => {
    setLuckyProjects(getRandomProjects(2));
  };

  const hotProjects = getHotProjects(4);
  const latestProjects = getLatestProjects(4);

  return (
    <PageContainer>
      {/* Header */}
      <div className="mt-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">探索</h1>
        <p className="text-muted-foreground mt-1">发现和分享创意随机器项目</p>
      </div>

      {/* Hot Projects Section */}
      <SectionWrapper title="热门项目" href="/community/hot">
        <HorizontalScroll className="flex gap-4 pb-4 pl-2">
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
        </HorizontalScroll>
      </SectionWrapper>

      {/* Latest Projects Section */}
      <SectionWrapper title="最新上传" href="/community/latest">
        <HorizontalScroll className="flex gap-4 pb-4 pl-2">
          {latestProjects.map((project) => (
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
      </SectionWrapper>

      {/* Categories Section */}
      <SectionWrapper title="类别" href="/community/categories">
        <ProjectGrid columns={3}>
          {CATEGORIES.map((category) => (
            <Link key={category.id} href={`/community/category/${category.id}`}>
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
                        {category.count} 个项目
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </ProjectGrid>
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
          >
            <RefreshCw className="h-4 w-4" />
            换一批
          </Button>
        }
      >
        <ProjectGrid columns={2}>
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
                    className="h-20 w-20 group-hover:scale-110 transition-all duration-300"
                    strokeWidth={1.5}
                    style={{ color: getLighterColor(project.gradient) }}
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
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </ProjectGrid>
      </SectionWrapper>
    </PageContainer>
  );
}
