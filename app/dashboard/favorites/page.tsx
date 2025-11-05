"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/project-card";
import {
  Dices,
  Shuffle,
  ChevronLeft,
  Star,
  type LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface FavoriteProject {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  icon_type?: string;
  icon_name?: string;
  icon_url?: string;
  theme_color?: string;
  tags?: string[];
  author_name?: string;
  created_at: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          // 按收藏时间排序（最新的在前）
          data.sort((a: FavoriteProject, b: FavoriteProject) => {
            const timeA = new Date(a.created_at).getTime();
            const timeB = new Date(b.created_at).getTime();
            return timeB - timeA;
          });
          setFavorites(data);
        }
      } catch (error) {
        console.error("加载收藏失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [session?.user?.id]);

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
              我的收藏
            </h1>
          </div>
        </div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">加载中...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold mb-2">还没有收藏</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              在社区中发现喜欢的项目，点击收藏星标即可添加到这里
            </p>
            <Link
              href="/community"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              探索社区项目
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((favorite) => {
              // 获取图标
              let icon: LucideIcon | undefined;
              let iconUrl: string | undefined;

              if (favorite.icon_type === "image" && favorite.icon_url) {
                iconUrl = favorite.icon_url;
              } else if (
                favorite.icon_type === "lucide" &&
                favorite.icon_name
              ) {
                icon = (Icons as any)[favorite.icon_name] as LucideIcon;
              } else {
                // 默认图标
                icon = Dices;
              }

              // 获取主题色
              const themeColor = favorite.theme_color || "#a855f7";
              const gradientFrom = `${themeColor}26`; // 15% opacity
              const gradientTo = `${themeColor}0d`; // 5% opacity

              return (
                <ProjectCard
                  key={favorite.id}
                  id={favorite.project_id}
                  name={favorite.name}
                  icon={icon}
                  iconUrl={iconUrl}
                  gradientFrom={gradientFrom}
                  gradientTo={gradientTo}
                  creatorName={favorite.author_name || "未知"}
                  tags={favorite.tags || []}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
