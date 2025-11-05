"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getLighterColor } from "@/lib/color-utils";
import { PageContainer } from "@/components/page-container";
import { BackHeader } from "@/components/back-header";
import { CATEGORIES } from "@/lib/mock-data";
import Link from "next/link";
import { LargeCategoryCardSkeleton } from "@/components/skeletons";

interface CategoryCount {
  name: string;
  count: number;
}

export default function CategoriesPage() {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载分类统计数据
  useEffect(() => {
    const loadCategoryCounts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/community/categories");
        if (res.ok) {
          const data = await res.json();
          setCategoryCounts(data);
        }
      } catch (error) {
        console.error("加载分类统计失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryCounts();
  }, []);

  // 合并分类定义和统计数据
  const categoriesWithCounts = CATEGORIES.map((category) => {
    const countData = categoryCounts.find((c) => c.name === category.name);
    return {
      ...category,
      count: countData?.count ?? 0,
    };
  });

  return (
    <PageContainer>
      <BackHeader title="类别" description="按类别浏览所有随机器项目" />

      {loading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <LargeCategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {categoriesWithCounts.map((category, i) => (
            <Link key={i} href={`/explore/category/${i}`}>
              <Card
                className="h-[100px] hover:border-primary/50 hover:scale-[1.01] transition-all cursor-pointer border border-border/50 relative overflow-hidden group"
                style={{
                  background: `linear-gradient(270deg, ${category.gradient} 0%, transparent 50%)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div className="flex items-center gap-4">
                    <category.icon
                      className="h-12 w-12 transition-colors flex-shrink-0"
                      strokeWidth={1.5}
                      style={{ color: getLighterColor(category.gradient) }}
                    />
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        {category.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {category.count}
                    </p>
                    <p className="text-xs text-muted-foreground">个项目</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
