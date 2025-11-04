"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { getLighterColor } from "@/lib/color-utils";

interface ProjectCardProps {
  id: string | number;
  name: string;
  icon?: LucideIcon; // Lucide 图标（可选）
  iconUrl?: string; // 自定义图片URL（可选）
  gradientFrom: string; // 渐变起始色
  gradientTo?: string; // 渐变结束色，默认透明
  creatorName: string;
  creatorAvatar?: string;
  tags: string[];
}

export function ProjectCard({
  id,
  name,
  icon: Icon,
  iconUrl,
  gradientFrom,
  gradientTo = "hsl(var(--background) / 0.25)",
  creatorName,
  creatorAvatar,
  tags,
}: ProjectCardProps) {
  return (
    <Link href={`/app/${id}`} className="flex-shrink-0 block" key={id}>
      <Card
        className="w-full min-w-[280px] h-[240px] transition-all duration-300 cursor-pointer overflow-hidden relative group border border-border/50 hover:border-primary/50 hover:scale-[1.02]"
        style={{
          background: `linear-gradient(180deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        }}
      >
        {/* 上部：图标区域 */}
        <div className="absolute top-0 left-0 right-0 h-[150px] flex items-center justify-center">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={name}
              className="h-20 w-20 object-contain group-hover:scale-110 transition-all duration-300"
            />
          ) : Icon ? (
            <Icon
              className="h-20 w-20 group-hover:scale-110 transition-all duration-300"
              strokeWidth={1.5}
              style={{ color: getLighterColor(gradientFrom) }}
            />
          ) : null}
        </div>

        {/* 下部：文字信息区域 */}
        <div className="absolute bottom-0 left-0 right-0 h-[90px] p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 flex flex-col">
          {/* 标题 - 左上角 */}
          <h3 className="text-lg font-semibold mb-auto truncate">{name}</h3>

          {/* 底部区域：左边标签，右边用户 */}
          <div className="flex items-end justify-between gap-2">
            {/* 标签 - 左下角 */}
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((tag, index) => (
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
                {creatorName}
              </span>
              <Avatar className="h-5 w-5 ring-1 ring-border">
                <AvatarFallback className="text-[10px]">
                  {creatorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// 创建新项目卡片
export function NewProjectCard() {
  return (
    <Link href="/new" className="flex-shrink-0 block">
      <Card className="w-full min-w-[280px] h-[240px] transition-all duration-300 cursor-pointer border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:scale-[1.02] bg-transparent flex items-center justify-center group">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-16 w-16 text-primary transition-transform group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-sm font-medium text-muted-foreground">
            创建新项目
          </p>
        </div>
      </Card>
    </Link>
  );
}
