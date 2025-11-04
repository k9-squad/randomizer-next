"use client";

import { useState, useEffect, useRef, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Settings,
  Copy,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProject, saveProject } from "@/lib/storage";
import { LotteryConfig, GroupingConfig, Group } from "@/types/project";
import { distributeMembers } from "@/lib/grouping";

// ============ 抽奖模式相关 ============

interface RotatorState {
  id: string;
  label: string;
  currentValue: string;
  isSpinning: boolean;
  pool?: string[]; // For individual pool mode
}

// ============ 分组模式相关 ============

interface GroupState extends Group {
  isAnimating: boolean;
}

export default function RandomizerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // 通用状态
  const [projectName, setProjectName] = useState("随机器项目");
  const [locationText, setLocationText] = useState("");
  const [speed, setSpeed] = useState(30);
  const [mode, setMode] = useState<"lottery" | "grouping">("lottery");
  const [isOwner, setIsOwner] = useState(true);

  // 抽奖模式状态
  const [rotators, setRotators] = useState<RotatorState[]>([]);
  const rotatorsRef = useRef<RotatorState[]>([]); // 保持最新的 rotators 引用
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
  // 不允许重复：跟踪当前轮的已抽取值
  const currentRoundValues = useRef<Set<string>>(new Set());

  // 计算剩余池子大小（不放回模式）
  const getRemainingPoolSize = useCallback((): number => {
    if (drawMode !== "limited") return Infinity;

    if (poolType === "shared") {
      return sharedPoolRef.current.length - usedValuesRef.current.size;
    } else {
      // 独立池模式：返回最小的剩余池子大小
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

  const getRandomValue = useCallback(
    (
      rotatorId: string,
      pool: string[],
      config: { drawMode: string; allowDuplicates: boolean }
    ): string => {
      if (pool.length === 0) return "?";

      // 计算可用选项
      let availablePool = [...pool];

      // 不放回模式：移除已使用的选项
      if (config.drawMode === "limited") {
        availablePool = availablePool.filter(
          (item) => !usedValuesRef.current.has(item)
        );
        if (availablePool.length === 0) return "?"; // 池子已空
      }

      // 不允许重复：移除当前轮已抽取的值
      if (!config.allowDuplicates && config.drawMode === "unlimited") {
        availablePool = availablePool.filter(
          (item) => !currentRoundValues.current.has(item)
        );
        if (availablePool.length === 0) {
          // 如果所有选项都被使用了，重置当前轮
          currentRoundValues.current.clear();
          availablePool = [...pool];
        }
      }

      if (availablePool.length === 0) return "?";
      if (availablePool.length === 1) return availablePool[0];

      // 避免连续相同值
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

  // 同步 rotators 到 ref
  useEffect(() => {
    rotatorsRef.current = rotators;
  }, [rotators]);

  // 加载项目数据
  useEffect(() => {
    const project = getProject(id);

    if (project) {
      setProjectName(project.name);
      setLocationText(project.config.locationText || "");
      setSpeed(Math.max(15, Math.min(60, project.config.speed)));
      setIsOwner(project.isOwner !== false);

      if (project.config.mode === "lottery") {
        // 抽奖模式
        setMode("lottery");
        const lotteryConfig = project.config as LotteryConfig;

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
      } else if (project.config.mode === "grouping") {
        // 分组模式
        setMode("grouping");
        const groupingConfig = project.config as GroupingConfig;

        // 如果已有分组结果，加载；否则初次生成
        if (groupingConfig.groups && groupingConfig.groups.length > 0) {
          setGroups(
            groupingConfig.groups.map((g) => ({ ...g, isAnimating: false }))
          );
        } else {
          // 初次生成分组
          const newGroups = distributeMembers(
            groupingConfig.members,
            groupingConfig.groupCount
          );
          setGroups(newGroups.map((g) => ({ ...g, isAnimating: false })));

          // 保存到 localStorage
          const updatedConfig: GroupingConfig = {
            ...groupingConfig,
            groups: newGroups,
          };
          saveProject({
            ...project,
            config: updatedConfig,
          });
        }
      }
    } else {
      router.push("/dashboard/my-projects");
    }
  }, [id, router]);

  const startSpinning = (rotatorId: string) => {
    const interval = setInterval(() => {
      // 使用 ref 获取最新的 rotators，避免闭包陷阱
      const rotator = rotatorsRef.current.find((r) => r.id === rotatorId);
      if (!rotator) return;

      const pool = rotator.pool || sharedPoolRef.current;
      const newValue = getRandomValue(rotatorId, pool, {
        drawMode,
        allowDuplicates,
      });

      // 不放回模式：记录已使用的值
      if (drawMode === "limited" && newValue !== "?") {
        usedValuesRef.current.add(newValue);
      }

      // 不允许重复：记录当前轮的值
      if (!allowDuplicates && drawMode === "unlimited" && newValue !== "?") {
        currentRoundValues.current.add(newValue);
      }

      // 更新状态
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

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);

    // 清空当前轮的重复追踪
    currentRoundValues.current.clear();

    if (drawMode === "limited") {
      // 不放回模式：直接抽取一次
      const remainingSize = getRemainingPoolSize();

      console.log(
        "[不放回] 抽取前 - 已使用:",
        Array.from(usedValuesRef.current)
      );
      console.log("[不放回] 抽取前 - 剩余数量:", remainingSize);

      // 先抽取所有值并收集
      const results = rotators.map((r, index) => {
        if (index >= remainingSize) {
          return { id: r.id, value: "--" };
        }

        const pool = r.pool || sharedPoolRef.current;
        const newValue = getRandomValue(r.id, pool, {
          drawMode,
          allowDuplicates,
        });

        console.log(`[不放回] 轮换位${index} 抽到:`, newValue);
        return { id: r.id, value: newValue };
      });

      // 将有效值添加到已使用集合
      results.forEach(({ value }) => {
        if (value !== "?" && value !== "--") {
          usedValuesRef.current.add(value);
        }
      });

      console.log(
        "[不放回] 抽取后 - 新增:",
        results.map((r) => r.value).filter((v) => v !== "?" && v !== "--")
      );
      console.log("[不放回] 抽取后 - 已使用总数:", usedValuesRef.current.size);

      // 更新状态
      setRotators((prev) =>
        prev.map((r) => {
          const result = results.find((res) => res.id === r.id);
          return {
            ...r,
            currentValue: result?.value || "?",
            isSpinning: false,
          };
        })
      );
    } else {
      // 放回模式：开始轮转动画
      setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: true })));
      rotators.forEach((r) => startSpinning(r.id));
    }
  };

  const handlePause = () => {
    setIsPaused(true);

    // Stop all intervals
    Object.keys(intervalRefs.current).forEach(stopSpinning);

    // Mark all as not spinning
    setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: false })));
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);

    // Stop all intervals
    Object.keys(intervalRefs.current).forEach(stopSpinning);

    // Reset all values
    setRotators((prev) =>
      prev.map((r) => ({ ...r, currentValue: "?", isSpinning: false }))
    );
    previousValues.current = {};

    // 重置抽奖追踪状态
    usedValuesRef.current.clear();
    currentRoundValues.current.clear();
  };

  const handleContinue = () => {
    setIsPaused(false);

    if (drawMode === "limited") {
      // 不放回模式："继续"按钮变成"下一抽"
      currentRoundValues.current.clear();
      const remainingSize = getRemainingPoolSize();

      console.log(
        "[不放回-继续] 抽取前 - 已使用:",
        Array.from(usedValuesRef.current)
      );
      console.log("[不放回-继续] 抽取前 - 剩余数量:", remainingSize);

      // 先抽取所有值并收集
      const results = rotators.map((r, index) => {
        if (index >= remainingSize) {
          return { id: r.id, value: "--" };
        }

        const pool = r.pool || sharedPoolRef.current;
        const newValue = getRandomValue(r.id, pool, {
          drawMode,
          allowDuplicates,
        });

        console.log(`[不放回-继续] 轮换位${index} 抽到:`, newValue);
        return { id: r.id, value: newValue };
      });

      // 将有效值添加到已使用集合
      results.forEach(({ value }) => {
        if (value !== "?" && value !== "--") {
          usedValuesRef.current.add(value);
        }
      });

      console.log(
        "[不放回-继续] 抽取后 - 新增:",
        results.map((r) => r.value).filter((v) => v !== "?" && v !== "--")
      );
      console.log(
        "[不放回-继续] 抽取后 - 已使用总数:",
        usedValuesRef.current.size
      );

      // 更新状态
      setRotators((prev) =>
        prev.map((r) => {
          const result = results.find((res) => res.id === r.id);
          return {
            ...r,
            currentValue: result?.value || "?",
            isSpinning: false,
          };
        })
      );
    } else {
      // 放回模式：继续轮转
      currentRoundValues.current.clear();
      setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: true })));
      rotators.forEach((r) => startSpinning(r.id));
    }
  };

  // ============ 分组模式函数 ============

  const handleRegroup = async () => {
    setIsGrouping(true);

    // 添加动画效果
    setGroups((prev) => prev.map((g) => ({ ...g, isAnimating: true })));

    // 延迟后重新分组
    await new Promise((resolve) => setTimeout(resolve, 300));

    const project = getProject(id);
    if (project && project.config.mode === "grouping") {
      const groupingConfig = project.config as GroupingConfig;
      // 传入现有groups以保留自定义组名
      const newGroups = distributeMembers(
        groupingConfig.members,
        groupingConfig.groupCount,
        groupingConfig.groups
      );

      setGroups(newGroups.map((g) => ({ ...g, isAnimating: false })));

      // 保存到 localStorage
      const updatedConfig: GroupingConfig = {
        ...groupingConfig,
        groups: newGroups,
      };
      saveProject({
        ...project,
        config: updatedConfig,
      });
    }

    setIsGrouping(false);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      Object.keys(intervalRefs.current).forEach(stopSpinning);
    };
  }, []);

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
          {isOwner ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 flex-shrink-0"
              title="项目设置"
              onClick={() => router.push(`/app/${id}/settings`)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 flex-shrink-0"
              title="复制项目"
            >
              <Copy className="h-5 w-5" />
            </Button>
          )}
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
                className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 min-h-[160px] md:min-h-[200px]"
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
                  // 不放回模式的按钮逻辑
                  <>
                    {!isRunning ? (
                      // 初始状态：只显示"开始"
                      <Button
                        size="lg"
                        className="rounded-full h-14 px-8"
                        onClick={handleStart}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        开始
                      </Button>
                    ) : getRemainingPoolSize() <= 0 ? (
                      // 池子已空：只显示"重置"（重点色）
                      <Button
                        size="lg"
                        className="rounded-full h-14 px-8"
                        onClick={handleReset}
                      >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        重置
                      </Button>
                    ) : (
                      // 池子未空：显示"继续"（重点色）和"重置"
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
                  // 放回模式的按钮逻辑（原逻辑）
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
