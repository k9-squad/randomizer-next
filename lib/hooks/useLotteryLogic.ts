// 抽奖模式相关的自定义 hooks
import { useCallback, useRef } from "react";

export interface RotatorState {
  id: string;
  label: string;
  currentValue: string;
  isSpinning: boolean;
  isAnimating?: boolean;
  pool?: string[];
}

interface LotteryConfig {
  drawMode: "unlimited" | "limited";
  allowDuplicates: boolean;
}

/**
 * 获取随机值的 hook
 */
export function useRandomValue() {
  const previousValues = useRef<{ [key: string]: string }>({});

  const getRandomValue = useCallback(
    (
      rotatorId: string,
      pool: string[],
      config: LotteryConfig,
      usedValues: Set<string>,
      currentRoundValues: Set<string>
    ): string => {
      if (pool.length === 0) return "?";

      // 计算可用选项
      let availablePool = [...pool];

      // 不放回模式：移除已使用的选项
      if (config.drawMode === "limited") {
        availablePool = availablePool.filter(
          (item) => !usedValues.has(item)
        );
        if (availablePool.length === 0) return "?";
      }

      // 不允许重复：移除当前轮已抽取的值
      if (!config.allowDuplicates && config.drawMode === "unlimited") {
        availablePool = availablePool.filter(
          (item) => !currentRoundValues.has(item)
        );
        if (availablePool.length === 0) {
          // 如果所有选项都被使用了，重置当前轮
          currentRoundValues.clear();
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

  const resetPreviousValues = useCallback(() => {
    previousValues.current = {};
  }, []);

  return { getRandomValue, resetPreviousValues };
}

/**
 * 计算剩余池子大小
 */
export function useRemainingPoolSize(
  drawMode: "unlimited" | "limited",
  poolType: "shared" | "independent",
  rotators: RotatorState[],
  sharedPool: string[],
  usedValues: Set<string>
) {
  const getRemainingPoolSize = useCallback((): number => {
    if (drawMode !== "limited") return Infinity;

    if (poolType === "shared") {
      return sharedPool.length - usedValues.size;
    } else {
      // 独立池模式：返回最小的剩余池子大小
      const remainingSizes = rotators.map((r) => {
        const pool = r.pool || [];
        return (
          pool.length -
          Array.from(usedValues).filter((v) => pool.includes(v)).length
        );
      });
      return remainingSizes.length > 0 ? Math.min(...remainingSizes) : 0;
    }
  }, [drawMode, poolType, rotators, sharedPool, usedValues]);

  return getRemainingPoolSize;
}
