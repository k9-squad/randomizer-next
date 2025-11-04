import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface LotteryConfigSectionProps {
  poolType: "shared" | "individual";
  drawMode: "unlimited" | "limited";
  allowDuplicates: boolean;
  sharedPool: string;
  rotators: Array<{ id: string; label: string; individualPool: string }>;
  onPoolTypeChange: (value: "shared" | "individual") => void;
  onDrawModeChange: (value: "unlimited" | "limited") => void;
  onAllowDuplicatesChange: (checked: boolean) => void;
  onSharedPoolChange: (value: string) => void;
  onAddRotator: () => void;
  onRemoveRotator: (id: string) => void;
  onUpdateRotator: (id: string, field: string, value: string) => void;
}

export function LotteryConfigSection({
  poolType,
  drawMode,
  allowDuplicates,
  sharedPool,
  rotators,
  onPoolTypeChange,
  onDrawModeChange,
  onAllowDuplicatesChange,
  onSharedPoolChange,
  onAddRotator,
  onRemoveRotator,
  onUpdateRotator,
}: LotteryConfigSectionProps) {
  const isSharedPool = poolType === "shared";

  return (
    <>
      {/* 抽奖模式设置 */}
      <Card className="p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">抽奖模式设置</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 共享/独立 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              池子模式 <span className="text-destructive">*</span>
            </label>
            <Select value={poolType} onValueChange={onPoolTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shared">共享池</SelectItem>
                <SelectItem value="individual">独立池</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {poolType === "shared"
                ? "所有轮换位从同一个池子中抽取"
                : "每个轮换位拥有自己的独立池"}
            </p>
          </div>

          {/* 放回/不放回 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              抽取模式 <span className="text-destructive">*</span>
            </label>
            <Select value={drawMode} onValueChange={onDrawModeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlimited">放回抽取（无限）</SelectItem>
                <SelectItem value="limited">不放回抽取（有限）</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {drawMode === "unlimited"
                ? "可以无限次抽取，选项可重复出现"
                : "每个选项只能抽取一次，抽完即止"}
            </p>
          </div>
        </div>

        {/* 重复/不重复 */}
        {poolType === "shared" &&
          drawMode === "unlimited" &&
          rotators.length > 1 && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium block">
                    允许重复结果
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {allowDuplicates
                      ? "不同轮换位可以抽到相同的内容"
                      : "不同轮换位不能抽到相同的内容"}
                  </p>
                </div>
                <Switch
                  checked={allowDuplicates}
                  onCheckedChange={onAllowDuplicatesChange}
                />
              </div>
            </div>
          )}

        {/* 不放回模式提示 */}
        {drawMode === "limited" && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              ⚠️ 不放回模式下，轮换位数量不能超过池子中的选项数量
            </p>
          </div>
        )}
      </Card>

      {/* 共享池内容 */}
      {isSharedPool && (
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">共享池内容</h2>
          <p className="text-sm text-muted-foreground">
            每行一个选项，所有轮换位将从这些选项中随机选择
          </p>
          <textarea
            className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm resize-y"
            placeholder={"黄焖鸡米饭\n沙县小吃\n兰州拉面\n麦当劳\n肯德基"}
            value={sharedPool}
            onChange={(e) => onSharedPoolChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            当前选项数：
            {sharedPool.split("\n").filter((line) => line.trim()).length}
            {drawMode === "limited" && (
              <span className="ml-2 text-yellow-700 dark:text-yellow-300">
                （轮换位数量：{rotators.length}）
              </span>
            )}
          </p>
        </Card>
      )}

      {/* 轮换位设置 */}
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
                  <Input
                    placeholder="轮换位标签"
                    value={rotator.label}
                    onChange={(e) =>
                      onUpdateRotator(rotator.id, "label", e.target.value)
                    }
                  />
                  {!isSharedPool && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        该轮换位的独立池（每行一个选项）
                      </p>
                      <textarea
                        className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm resize-y"
                        placeholder="选项1\n选项2\n选项3"
                        value={rotator.individualPool}
                        onChange={(e) =>
                          onUpdateRotator(
                            rotator.id,
                            "individualPool",
                            e.target.value
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
                      </p>
                    </div>
                  )}
                </div>
                {rotators.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveRotator(rotator.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </Card>
          ))}

          {/* 添加轮换位按钮 */}
          <button
            onClick={onAddRotator}
            className="p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-muted-foreground/50 hover:bg-muted/30 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">添加轮换位</span>
          </button>
        </div>
      </Card>
    </>
  );
}
