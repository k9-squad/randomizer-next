"use client";

import { Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Rotator {
  id: string;
  label: string;
  individualPool: string;
}

interface RotatorListProps {
  rotators: Rotator[];
  poolType: "shared" | "individual";
  drawMode: "unlimited" | "limited";
  onRotatorsChange: (rotators: Rotator[]) => void;
  maxLineLength?: number;
}

function limitTextareaLines(text: string, maxLineLength: number): string {
  return text
    .split("\n")
    .map((line) => line.slice(0, maxLineLength))
    .join("\n");
}

export function RotatorList({
  rotators,
  poolType,
  drawMode,
  onRotatorsChange,
  maxLineLength = 100,
}: RotatorListProps) {
  const addRotator = () => {
    const newId = Date.now().toString();
    onRotatorsChange([
      ...rotators,
      { id: newId, label: `轮换位 ${rotators.length + 1}`, individualPool: "" },
    ]);
  };

  const removeRotator = (id: string) => {
    if (rotators.length > 1) {
      onRotatorsChange(rotators.filter((r) => r.id !== id));
    }
  };

  const updateRotator = (id: string, field: string, value: string) => {
    onRotatorsChange(
      rotators.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const isSharedPool = poolType === "shared";

  return (
    <Card className="p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">轮换位设置</h2>

      <div className="flex flex-col gap-4">
        {rotators.map((rotator) => (
          <Card key={rotator.id} className="p-4 bg-secondary/20">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 text-muted-foreground">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <Input
                    placeholder="轮换位标签"
                    value={rotator.label}
                    onChange={(e) =>
                      updateRotator(
                        rotator.id,
                        "label",
                        e.target.value.slice(0, 30)
                      )
                    }
                    maxLength={30}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {rotator.label.length}/30
                  </p>
                </div>
                {!isSharedPool && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      该轮换位的独立池（每行一个选项，最多{maxLineLength}
                      字符/行）
                    </p>
                    <textarea
                      className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm resize-y"
                      placeholder="选项1&#10;选项2&#10;选项3"
                      value={rotator.individualPool}
                      onChange={(e) =>
                        updateRotator(
                          rotator.id,
                          "individualPool",
                          limitTextareaLines(e.target.value, maxLineLength)
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      当前选项数：
                      {
                        rotator.individualPool
                          .split("\n")
                          .filter((line) => line.trim()).length
                      }
                      {drawMode === "limited" && (
                        <span className="ml-2 text-yellow-700 dark:text-yellow-300">
                          （不放回模式下请确保选项足够）
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
              {rotators.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRotator(rotator.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </Card>
        ))}

        {/* 添加轮换位按钮 */}
        <button
          onClick={addRotator}
          className="p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-muted-foreground/50 hover:bg-muted/30 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">添加轮换位</span>
        </button>
      </div>

      {drawMode === "limited" && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            ⚠️ 不放回模式下，轮换位数量不能超过池子中的选项数量
          </p>
        </div>
      )}
    </Card>
  );
}
