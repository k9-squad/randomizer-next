"use client";

import { useState, useEffect, useRef, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronLeft,
  Copy,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  MoreVertical,
  Star,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LotteryConfig, GroupingConfig, Group } from "@/types/project";
import { distributeMembers } from "@/lib/grouping";
import { AppPageSkeleton } from "@/components/skeletons";
import { saveProject, type StoredProject } from "@/lib/storage";
import { toast } from "sonner";

// ============ 抽奖模式相关 ============

interface RotatorState {
  id: string;
  label: string;
  currentValue: string;
  isSpinning: boolean;
  isAnimating?: boolean;
  pool?: string[];
}

// ============ 分组模式相关 ============

interface GroupState extends Group {
  isAnimating: boolean;
}

export default function CommunityProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  // 通用状态
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<any>(null);
  const [projectName, setProjectName] = useState("社区项目");
  const [locationText, setLocationText] = useState("");
  const [speed, setSpeed] = useState(30);
  const [mode, setMode] = useState<"lottery" | "grouping">("lottery");
  const [isCopying, setIsCopying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // 抽奖模式状态
  const [rotators, setRotators] = useState<RotatorState[]>([]);
  const rotatorsRef = useRef<RotatorState[]>([]);
  const [sharedPool, setSharedPool] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const previousValues = useRef<{ [key: string]: string }>({});
  const sharedPoolRef = useRef<string[]>([]);

  // 抽奖配置
  const [drawMode, setDrawMode] = useState<"unlimited" | "limited">(
    "unlimited"
  );
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [poolType, setPoolType] = useState<"shared" | "individual">("shared");

  // 不放回模式：跟踪已使用的选项
  const usedValuesRef = useRef<Set<string>>(new Set());
  const currentRoundValues = useRef<Set<string>>(new Set());

  // 计算剩余池子大小
  const getRemainingPoolSize = useCallback((): number => {
    if (drawMode !== "limited") return Infinity;

    if (poolType === "shared") {
      return sharedPoolRef.current.length - usedValuesRef.current.size;
    } else {
      const remainingSizes = rotators.map((r) => {
        const pool = r.pool || [];
        return (
          pool.length -
          Array.from(usedValuesRef.current).filter((v) => pool.includes(v))
            .length
        );
      });
      return remainingSizes.length > 0 ? Math.min(...remainingSizes) : 0;
    }
  }, [drawMode, poolType, rotators]);

  // 分组模式状态
  const [groups, setGroups] = useState<GroupState[]>([]);
  const [isGrouping, setIsGrouping] = useState(false);
  const [groupingConfig, setGroupingConfig] = useState<GroupingConfig | null>(
    null
  );

  const getRandomValue = useCallback(
    (
      rotatorId: string,
      pool: string[],
      config: { drawMode: string; allowDuplicates: boolean }
    ): string => {
      if (pool.length === 0) return "?";

      let availablePool = [...pool];

      if (config.drawMode === "limited") {
        availablePool = availablePool.filter(
          (item) => !usedValuesRef.current.has(item)
        );
        if (availablePool.length === 0) return "?";
      }

      if (!config.allowDuplicates && config.drawMode === "unlimited") {
        availablePool = availablePool.filter(
          (item) => !currentRoundValues.current.has(item)
        );
        if (availablePool.length === 0) {
          currentRoundValues.current.clear();
          availablePool = [...pool];
        }
      }

      if (availablePool.length === 0) return "?";
      if (availablePool.length === 1) return availablePool[0];

      const lastValue = previousValues.current[rotatorId];
      let newValue = "";
      let attempts = 0;
      const maxAttempts = availablePool.length * 2;

      do {
        newValue =
          availablePool[Math.floor(Math.random() * availablePool.length)];
        attempts++;
      } while (
        newValue === lastValue &&
        availablePool.length > 1 &&
        attempts < maxAttempts
      );

      previousValues.current[rotatorId] = newValue;
      return newValue;
    },
    []
  );

  useEffect(() => {
    rotatorsRef.current = rotators;
  }, [rotators]);

  // 加载社区项目数据
  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/community/projects/${id}`);
        if (!response.ok) {
          throw new Error("项目不存在");
        }

        const project = await response.json();
        const config = project.config;

        setProjectData(project); // 保存完整项目数据用于复制
        setProjectName(project.name);
        setLocationText(config.locationText || "");
        setSpeed(Math.max(15, Math.min(60, config.speed)));

        // 检查是否已收藏
        if (session?.user?.id) {
          const favResponse = await fetch(
            `/api/favorites/check?projectId=${id}`
          );
          if (favResponse.ok) {
            const { isFavorited } = await favResponse.json();
            setIsFavorited(isFavorited);
          }
        }

        if (config.mode === "lottery") {
          setMode("lottery");
          const lotteryConfig = config as LotteryConfig;

          setPoolType(lotteryConfig.poolType);
          setDrawMode(lotteryConfig.drawMode);
          setAllowDuplicates(lotteryConfig.allowDuplicates ?? true);

          if (lotteryConfig.poolType === "shared" && lotteryConfig.sharedPool) {
            setSharedPool(lotteryConfig.sharedPool);
            sharedPoolRef.current = lotteryConfig.sharedPool;
          }

          setRotators(
            lotteryConfig.rotators.map((r) => ({
              id: r.id.toString(),
              label: r.label,
              currentValue: "?",
              isSpinning: false,
              pool: r.individualPool,
            }))
          );
        } else if (config.mode === "grouping") {
          setMode("grouping");
          const groupingConfig = config as GroupingConfig;
          setGroupingConfig(groupingConfig);

          // 初次生成分组
          const newGroups = distributeMembers(
            groupingConfig.members,
            groupingConfig.groupCount
          );
          setGroups(newGroups.map((g) => ({ ...g, isAnimating: false })));
        }
      } catch (error) {
        console.error("加载项目失败:", error);
        router.push("/explore");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, router, session?.user?.id]);

  // 复制到我的项目
  const handleCopy = async () => {
    // 检查用户状态
    const userType =
      typeof window !== "undefined" ? localStorage.getItem("userType") : null;
    const isGuest = userType === "guest";
    const isLoggedIn = session?.user?.id;

    // 未登录且不是游客，跳转登录
    if (!isLoggedIn && !isGuest) {
      router.push("/login");
      return;
    }

    if (!projectData) {
      toast.error("项目数据加载中，请稍后再试");
      return;
    }

    setIsCopying(true);
    try {
      if (isLoggedIn) {
        // 登录用户：通过 API 复制到云端
        const response = await fetch("/api/projects/copy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: id,
            projectType: "community",
          }),
        });

        if (!response.ok) {
          throw new Error("复制失败");
        }

        const newProject = await response.json();
        toast.success("复制成功");
        router.push(`/app/${newProject.id}`);
      } else {
        // 游客：保存到本地存储
        const newId = `guest-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const newProject: StoredProject = {
          id: newId,
          name: projectData.name + " (副本)",
          config: projectData.config,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: projectData.category || null,
          tags: projectData.tags || [],
          themeColor: projectData.theme_color,
          iconType: projectData.icon_type,
          iconName: projectData.icon_name,
          iconUrl: projectData.icon_url,
          isPublished: false,
          isOwner: true,
        };

        await saveProject(newProject);
        toast.success("复制成功");
        router.push(`/app/${newId}`);
      }
    } catch (error) {
      console.error("复制项目失败:", error);
      toast.error("复制失败，请重试");
    } finally {
      setIsCopying(false);
    }
  };

  // 收藏/取消收藏
  const handleToggleFavorite = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: id,
          projectType: "community",
        }),
      });

      if (!response.ok) {
        throw new Error(isFavorited ? "取消收藏失败" : "收藏失败");
      }

      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? "已取消收藏" : "收藏成功");
    } catch (error) {
      console.error("收藏操作失败:", error);
      toast.error(isFavorited ? "取消收藏失败，请重试" : "收藏失败，请重试");
    }
  };

  // 举报（暂不实现）
  const handleReport = () => {
    toast.info("举报功能即将推出");
  };

  const startSpinning = (rotatorId: string) => {
    const interval = setInterval(() => {
      const rotator = rotatorsRef.current.find((r) => r.id === rotatorId);
      if (!rotator) return;

      const pool = rotator.pool || sharedPoolRef.current;
      const newValue = getRandomValue(rotatorId, pool, {
        drawMode,
        allowDuplicates,
      });

      if (drawMode === "limited" && newValue !== "?") {
        usedValuesRef.current.add(newValue);
      }

      if (!allowDuplicates && drawMode === "unlimited" && newValue !== "?") {
        currentRoundValues.current.add(newValue);
      }

      setRotators((prev) =>
        prev.map((r) => {
          if (r.id === rotatorId) {
            return { ...r, currentValue: newValue };
          }
          return r;
        })
      );
    }, 1000 / speed);

    intervalRefs.current[rotatorId] = interval;
  };

  const stopSpinning = (rotatorId: string) => {
    if (intervalRefs.current[rotatorId]) {
      clearInterval(intervalRefs.current[rotatorId]);
      delete intervalRefs.current[rotatorId];
    }
  };

  const handleStart = async () => {
    setIsRunning(true);
    setIsPaused(false);
    currentRoundValues.current.clear();

    if (drawMode === "limited") {
      const remainingSize = getRemainingPoolSize();

      setRotators((prev) => prev.map((r) => ({ ...r, isAnimating: true })));
      await new Promise((resolve) => setTimeout(resolve, 300));

      const currentRoundUsed = new Set<string>();
      const results = rotators.map((r, index) => {
        if (index >= remainingSize) {
          return { id: r.id, value: "--" };
        }

        const pool = r.pool || sharedPoolRef.current;
        const availablePool = pool.filter(
          (item) =>
            !usedValuesRef.current.has(item) && !currentRoundUsed.has(item)
        );

        if (availablePool.length === 0) {
          return { id: r.id, value: "?" };
        }

        const newValue =
          availablePool[Math.floor(Math.random() * availablePool.length)];
        currentRoundUsed.add(newValue);
        return { id: r.id, value: newValue };
      });

      results.forEach(({ value }) => {
        if (value !== "?" && value !== "--") {
          usedValuesRef.current.add(value);
        }
      });

      setRotators((prev) =>
        prev.map((r) => {
          const result = results.find((res) => res.id === r.id);
          return {
            ...r,
            currentValue: result?.value || "?",
            isSpinning: false,
            isAnimating: false,
          };
        })
      );
    } else {
      setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: true })));
      rotators.forEach((r) => startSpinning(r.id));
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    Object.keys(intervalRefs.current).forEach(stopSpinning);
    setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: false })));
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    Object.keys(intervalRefs.current).forEach(stopSpinning);
    setRotators((prev) =>
      prev.map((r) => ({ ...r, currentValue: "?", isSpinning: false }))
    );
    previousValues.current = {};
    usedValuesRef.current.clear();
    currentRoundValues.current.clear();
  };

  const handleContinue = async () => {
    setIsPaused(false);

    if (drawMode === "limited") {
      currentRoundValues.current.clear();
      const remainingSize = getRemainingPoolSize();

      setRotators((prev) => prev.map((r) => ({ ...r, isAnimating: true })));
      await new Promise((resolve) => setTimeout(resolve, 300));

      const currentRoundUsed = new Set<string>();
      const results = rotators.map((r, index) => {
        if (index >= remainingSize) {
          return { id: r.id, value: "--" };
        }

        const pool = r.pool || sharedPoolRef.current;
        const availablePool = pool.filter(
          (item) =>
            !usedValuesRef.current.has(item) && !currentRoundUsed.has(item)
        );

        if (availablePool.length === 0) {
          return { id: r.id, value: "?" };
        }

        const newValue =
          availablePool[Math.floor(Math.random() * availablePool.length)];
        currentRoundUsed.add(newValue);
        return { id: r.id, value: newValue };
      });

      results.forEach(({ value }) => {
        if (value !== "?" && value !== "--") {
          usedValuesRef.current.add(value);
        }
      });

      setRotators((prev) =>
        prev.map((r) => {
          const result = results.find((res) => res.id === r.id);
          return {
            ...r,
            currentValue: result?.value || "?",
            isSpinning: false,
            isAnimating: false,
          };
        })
      );
    } else {
      currentRoundValues.current.clear();
      setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: true })));
      rotators.forEach((r) => startSpinning(r.id));
    }
  };

  const handleRegroup = async () => {
    if (!groupingConfig) return;

    setIsGrouping(true);
    setGroups((prev) => prev.map((g) => ({ ...g, isAnimating: true })));
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newGroups = distributeMembers(
      groupingConfig.members,
      groupingConfig.groupCount,
      groupingConfig.groups
    );

    setGroups(newGroups.map((g) => ({ ...g, isAnimating: false })));
    setIsGrouping(false);
  };

  useEffect(() => {
    return () => {
      Object.keys(intervalRefs.current).forEach(stopSpinning);
    };
  }, []);

  if (loading) {
    return <AppPageSkeleton mode={mode} />;
  }

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6 pb-32">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.back()}
            className="flex-shrink-0 -ml-1 hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="h-9 w-9 md:h-10 md:w-10" strokeWidth={2} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex-1 min-w-0 truncate">
            {projectName}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy} disabled={isCopying}>
                <Copy className="h-4 w-4 mr-2" />
                {isCopying ? "复制中..." : "复制到我的项目"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleFavorite}>
                <Star
                  className={`h-4 w-4 mr-2 ${
                    isFavorited ? "fill-yellow-500 text-yellow-500" : ""
                  }`}
                />
                {isFavorited ? "取消收藏" : "收藏"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReport}>
                <Flag className="h-4 w-4 mr-2" />
                举报
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Location Text */}
        {locationText && (
          <div className="text-center text-lg md:text-xl text-muted-foreground">
            {locationText}
          </div>
        )}

        {/* 抽奖模式 - Rotators Grid */}
        {mode === "lottery" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {rotators.map((rotator) => (
              <Card
                key={rotator.id}
                className={`p-6 md:p-8 flex flex-col items-center justify-center gap-4 min-h-[160px] md:min-h-[200px] transition-all ${
                  rotator.isAnimating ? "opacity-50 scale-95" : "opacity-100"
                }`}
              >
                <div className="text-sm md:text-base font-medium text-muted-foreground">
                  {rotator.label}
                </div>
                <div
                  className={`text-2xl md:text-4xl font-bold text-center transition-all ${
                    rotator.isSpinning ? "animate-pulse text-primary" : ""
                  }`}
                >
                  {rotator.currentValue}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 分组模式 - Groups Grid */}
        {mode === "grouping" && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groups.map((group) => (
              <Card
                key={group.id}
                className={`p-6 transition-all ${
                  group.isAnimating ? "opacity-50 scale-95" : "opacity-100"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {group.members.length} 人
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.members.map((member, idx) => (
                      <div key={idx} className="text-base">
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Control Buttons */}
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 flex justify-center px-4">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-full p-2 shadow-lg flex gap-2">
            {mode === "lottery" && (
              <>
                {drawMode === "limited" ? (
                  <>
                    {!isRunning ? (
                      <Button
                        size="lg"
                        className="rounded-full h-14 px-8"
                        onClick={handleStart}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        开始
                      </Button>
                    ) : getRemainingPoolSize() <= 0 ? (
                      <Button
                        size="lg"
                        className="rounded-full h-14 px-8"
                        onClick={handleReset}
                      >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        重置
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          className="rounded-full h-14 px-8"
                          onClick={handleContinue}
                        >
                          <Play className="h-5 w-5 mr-2" />
                          继续
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-full h-14 px-8"
                          onClick={handleReset}
                        >
                          <RotateCcw className="h-5 w-5 mr-2" />
                          重置
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {!isRunning ? (
                      <Button
                        size="lg"
                        className="rounded-full h-14 px-8"
                        onClick={handleStart}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        开始
                      </Button>
                    ) : (
                      <>
                        {!isPaused ? (
                          <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-full h-14 px-8"
                            onClick={handlePause}
                          >
                            <Pause className="h-5 w-5 mr-2" />
                            暂停
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            className="rounded-full h-14 px-8"
                            onClick={handleContinue}
                          >
                            <Play className="h-5 w-5 mr-2" />
                            继续
                          </Button>
                        )}
                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-full h-14 px-8"
                          onClick={handleReset}
                        >
                          <RotateCcw className="h-5 w-5 mr-2" />
                          重置
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {mode === "grouping" && (
              <Button
                size="lg"
                className="rounded-full h-14 px-8"
                onClick={handleRegroup}
                disabled={isGrouping}
              >
                <Shuffle className="h-5 w-5 mr-2" />
                {isGrouping ? "分组中..." : "重新分组"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
