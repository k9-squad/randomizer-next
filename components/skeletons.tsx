import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 项目卡片骨架屏 - 完全匹配 ProjectCard 和 CommunityProjectCard 的布局
export function ProjectCardSkeleton() {
  return (
    <Card className="w-full min-w-[280px] h-[240px] border border-border/50 overflow-hidden relative">
      {/* 上部：图标区域 (150px高) */}
      <div className="absolute top-0 left-0 right-0 h-[150px] flex items-center justify-center">
        <Skeleton className="h-20 w-20 rounded-xl" />
      </div>

      {/* 下部：文字信息区域 (90px高) */}
      <div className="absolute bottom-0 left-0 right-0 h-[90px] p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 flex flex-col">
        {/* 标题行 */}
        <div className="flex items-start justify-between mb-auto">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-8 rounded-full" />
        </div>

        {/* 底部区域：左边标签，右边用户 */}
        <div className="flex items-end justify-between gap-2">
          {/* 标签 */}
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>

          {/* 创建者信息 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}

// 类别卡片骨架屏 - 匹配 explore 页面的小型类别卡片
export function CategoryCardSkeleton() {
  return (
    <Card className="h-[80px] border border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
}

// 大型类别卡片骨架屏 - 匹配 categories 页面的大型类别卡片
export function LargeCategoryCardSkeleton() {
  return (
    <Card className="h-[100px] border border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-7 w-12 ml-auto" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
      </div>
    </Card>
  );
}

// Dashboard 统计卡片骨架屏
export function StatCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-3 w-24" />
    </Card>
  );
}

// Dashboard 项目列表骨架屏
export function DashboardProjectSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>
    </Card>
  );
}

// 水平滚动列表骨架屏 - 用于水平滚动的项目卡片
export function HorizontalScrollSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 pb-4 pl-2 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0">
          <ProjectCardSkeleton />
        </div>
      ))}
    </div>
  );
}

// 网格骨架屏 - 支持不同类型的卡片布局
export function GridSkeleton({
  count = 6,
  columns = 3,
  cardType = "category",
}: {
  count?: number;
  columns?: number;
  cardType?: "category" | "project";
}) {
  // 根据列数自动调整响应式类名
  const gridColsClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid gap-4 ${gridColsClass}`}>
      {Array.from({ length: count }).map((_, i) =>
        cardType === "category" ? (
          <CategoryCardSkeleton key={i} />
        ) : (
          <ProjectCardSkeleton key={i} />
        )
      )}
    </div>
  );
}

// 应用页面骨架屏 - 抽奖模式轮换位卡片
export function RotatorCardSkeleton() {
  return (
    <Card className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 min-h-[160px] md:min-h-[200px]">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-10 w-24 md:h-12 md:w-32" />
    </Card>
  );
}

// 应用页面骨架屏 - 分组模式分组卡片
export function GroupCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
    </Card>
  );
}

// 应用页面完整骨架屏
export function AppPageSkeleton({
  mode = "lottery",
}: {
  mode?: "lottery" | "grouping";
}) {
  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6 pb-32">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-9 md:h-10 md:w-10 rounded-md flex-shrink-0" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
        </div>

        {/* Location Text (可选) */}
        <div className="text-center">
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>

        {/* 抽奖模式 - Rotators Grid */}
        {mode === "lottery" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RotatorCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 分组模式 - Groups Grid */}
        {mode === "grouping" && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <GroupCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Control Buttons */}
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 flex justify-center px-4">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-full p-2 shadow-lg">
            <Skeleton className="h-14 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
