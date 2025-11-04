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
  const [sharedPool, setSharedPool] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const previousValues = useRef<{ [key: string]: string }>({});
  const sharedPoolRef = useRef<string[]>([]);

  // 分组模式状态
  const [groups, setGroups] = useState<GroupState[]>([]);
  const [isGrouping, setIsGrouping] = useState(false);

  const getRandomValue = useCallback(
    (rotatorId: string, pool: string[]): string => {
      if (pool.length === 0) return "?";
      if (pool.length === 1) return pool[0];

      const lastValue = previousValues.current[rotatorId];
      let newValue = "";
      let attempts = 0;
      const maxAttempts = pool.length * 2;

      do {
        newValue = pool[Math.floor(Math.random() * pool.length)];
        attempts++;
      } while (
        newValue === lastValue &&
        pool.length > 1 &&
        attempts < maxAttempts
      );

      previousValues.current[rotatorId] = newValue;
      return newValue;
    },
    []
  );

  // 加载项目数据
  useEffect(() => {
    const loadProject = async () => {
      const project = await getProject(id);

      if (project) {
        setProjectName(project.name);
        setLocationText(project.config.locationText || "");
        setSpeed(Math.max(15, Math.min(60, project.config.speed)));
        setIsOwner(project.isOwner !== false);

        if (project.config.mode === "lottery") {
          // 抽奖模式
          setMode("lottery");
          const lotteryConfig = project.config as LotteryConfig;

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

          // 如果已有分组结果，加载；否则初始生成
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
            await saveProject({
              ...project,
              config: updatedConfig,
            });
          }
        }
      } else {
        router.push("/dashboard/my-projects");
      }
    };

    loadProject();
  }, [id, router]);

  // ============ 抽奖模式函数 ============

  const startSpinning = (rotatorId: string) => {
    const interval = setInterval(() => {
      setRotators((prev) =>
        prev.map((r) => {
          if (r.id === rotatorId) {
            const pool = r.pool || sharedPoolRef.current;
            return { ...r, currentValue: getRandomValue(rotatorId, pool) };
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
    setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: true })));
    rotators.forEach((r) => startSpinning(r.id));
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
  };

  const handleContinue = () => {
    setIsPaused(false);
    setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: true })));
    rotators.forEach((r) => startSpinning(r.id));
  };

  // ============ 分组模式函数 ============

  const handleRegroup = async () => {
    setIsGrouping(true);

    // 添加动画效果
    setGroups((prev) => prev.map((g) => ({ ...g, isAnimating: true })));

    // 延迟后重新分组
    await new Promise((resolve) => setTimeout(resolve, 300));

    const project = await getProject(id);
    if (project && project.config.mode === "grouping") {
      const groupingConfig = project.config as GroupingConfig;
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
      await saveProject({
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

  // ============ 渲染 ============

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

        {/* 分组模式 - Groups List */}
        {mode === "grouping" && (
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <Card
                key={group.id}
                className={`p-6 transition-all ${
                  group.isAnimating ? "opacity-50 scale-95" : "opacity-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {group.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((member, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-secondary rounded-full text-sm"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-sm text-muted-foreground">
                    {group.members.length} 人
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
