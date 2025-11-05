// 组件：社区项目卡片
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { getLucideIcon } from "@/lib/icon-utils";
import { getGradientFrom } from "@/lib/gradient-utils";

interface CommunityProjectCardProps {
  project: {
    id: string;
    name: string;
    icon_type?: string;
    icon_name?: string;
    theme_color?: string;
    star_count?: number;
    tags?: string[];
    author_name?: string;
  };
}

export function CommunityProjectCard({ project }: CommunityProjectCardProps) {
  const icon =
    project.icon_type === "lucide" && project.icon_name
      ? getLucideIcon(project.icon_name)
      : undefined;

  const gradientFrom = getGradientFrom(project.theme_color);

  return (
    <Link href={`/app/${project.id}`}>
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
}
