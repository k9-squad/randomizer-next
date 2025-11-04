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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProject } from "@/lib/storage";

interface RotatorState {
  id: string;
  label: string;
  currentValue: string;
  isSpinning: boolean;
  pool?: string[]; // For individual pool mode
}

export default function RandomizerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [projectName, setProjectName] = useState("随机器项目");
  const [locationText, setLocationText] = useState("");
  const [speed, setSpeed] = useState(30);
  const [isSharedPool, setIsSharedPool] = useState(true);
  const [sharedPool, setSharedPool] = useState<string[]>([]);
  const [rotators, setRotators] = useState<RotatorState[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOwner, setIsOwner] = useState(true); // 是否是自己的项目
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const previousValues = useRef<{ [key: string]: string }>({});
  const sharedPoolRef = useRef<string[]>([]); // 使用 ref 避免闭包陷阱

  const getRandomValue = useCallback(
    (rotatorId: string, pool: string[]): string => {
      if (pool.length === 0) return "?";
      if (pool.length === 1) return pool[0];

      const lastValue = previousValues.current[rotatorId];
      let newValue = "";
      let attempts = 0;
      const maxAttempts = pool.length * 2; // 防止无限循环

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

  // Load project data from localStorage
  useEffect(() => {
    const project = getProject(id);

    if (project) {
      setProjectName(project.name);
      setLocationText(project.config.locationText || "");
      // 确保速度在15-60范围内
      const loadedSpeed = project.config.speed;
      setSpeed(Math.max(15, Math.min(60, loadedSpeed)));
      setIsOwner(project.isOwner !== false); // 默认true，除非明确标记为false

      const hasSharedPool =
        !!project.config.sharedPool && project.config.sharedPool.length > 0;
      setIsSharedPool(hasSharedPool);

      if (hasSharedPool) {
        const pool = project.config.sharedPool || [];
        setSharedPool(pool);
        sharedPoolRef.current = pool; // 同步到 ref
      }

      setRotators(
        project.config.rotators.map((r) => ({
          id: r.id.toString(),
          label: r.label,
          currentValue: "?",
          isSpinning: false,
          pool: r.individualPool, // Store individual pool if exists
        }))
      );
    } else {
      // Project not found, redirect to dashboard
      router.push("/dashboard/my-projects");
    }
  }, [id, router]);

  const startSpinning = (rotatorId: string) => {
    const interval = setInterval(() => {
      setRotators((prev) =>
        prev.map((r) => {
          if (r.id === rotatorId) {
            // Use individual pool if available, otherwise shared pool
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

    // Mark all as spinning
    setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: true })));

    // Start spinning all rotators
    rotators.forEach((r) => startSpinning(r.id));
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
  };

  const handleContinue = () => {
    setIsPaused(false);

    // Mark all as spinning
    setRotators((prev) => prev.map((r) => ({ ...r, isSpinning: true })));

    // Resume spinning
    rotators.forEach((r) => startSpinning(r.id));
  };

  // Cleanup on unmount
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
              title="编辑项目"
              onClick={() => router.push(`/editor/${id}`)}
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

        {/* Rotators Grid */}
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

        {/* Control Buttons */}
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 flex justify-center px-4">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-full p-2 shadow-lg flex gap-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
