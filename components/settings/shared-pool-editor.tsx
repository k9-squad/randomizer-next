"use client";

import { Card } from "@/components/ui/card";

interface SharedPoolEditorProps {
  value: string;
  onChange: (value: string) => void;
  drawMode: "unlimited" | "limited";
  rotatorCount: number;
  maxLineLength?: number;
}

function limitTextareaLines(text: string, maxLineLength: number): string {
  return text
    .split("\n")
    .map((line) => line.slice(0, maxLineLength))
    .join("\n");
}

export function SharedPoolEditor({
  value,
  onChange,
  drawMode,
  rotatorCount,
  maxLineLength = 100,
}: SharedPoolEditorProps) {
  const optionCount = value.split("\n").filter((line) => line.trim()).length;

  return (
    <Card className="p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">共享池内容</h2>
      <p className="text-sm text-muted-foreground">
        每行一个选项（最多{maxLineLength}
        字符/行），所有轮换位将从这些选项中随机选择
      </p>
      <textarea
        className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder={"黄焖鸡米饭\n沙县小吃\n兰州拉面\n麦当劳\n肯德基"}
        value={value}
        onChange={(e) =>
          onChange(limitTextareaLines(e.target.value, maxLineLength))
        }
      />
      <p className="text-xs text-muted-foreground">
        当前选项数：{optionCount}
        {drawMode === "limited" && (
          <span className="ml-2 text-yellow-700 dark:text-yellow-300">
            （轮换位数量：{rotatorCount}）
          </span>
        )}
      </p>
    </Card>
  );
}
