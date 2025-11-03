"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function EditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectType = searchParams.get("type");

  const [projectName, setProjectName] = useState("");
  const [locationText, setLocationText] = useState("");
  const [speed, setSpeed] = useState(30);
  const [sharedPool, setSharedPool] = useState("");
  const [rotators, setRotators] = useState([
    { id: "1", label: "轮换位 1", individualPool: "" },
  ]);

  const isSharedPool = projectType === "shared";

  const addRotator = () => {
    const newId = Date.now().toString();
    setRotators([
      ...rotators,
      { id: newId, label: `轮换位 ${rotators.length + 1}`, individualPool: "" },
    ]);
  };

  const removeRotator = (id: string) => {
    if (rotators.length > 1) {
      setRotators(rotators.filter((r) => r.id !== id));
    }
  };

  const updateRotator = (id: string, field: string, value: string) => {
    setRotators(
      rotators.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = () => {
    console.log("Saving project...", {
      projectName,
      locationText,
      speed,
      sharedPool,
      rotators,
      isSharedPool,
    });
    router.push("/dashboard/my-projects");
  };

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6 pb-24">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:h-10 md:w-10"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isSharedPool ? "共享池项目" : "独立池项目"}
            </h1>
          </div>
          <Button onClick={handleSave}>保存项目</Button>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">项目设置</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">项目名称</label>
              <Input
                placeholder="例如：中午吃什么"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                位置描述文字（可选）
              </label>
              <Input
                placeholder="例如：今天的午餐是"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                旋转速度（项/秒）
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value) || 30)}
              />
            </div>
          </div>
        </Card>

        {isSharedPool ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">共享池内容</h2>
            <p className="text-sm text-muted-foreground mb-4">
              每行一个选项，所有轮换位将从这些选项中随机选择
            </p>
            <textarea
              className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm resize-y"
              placeholder={"黄焖鸡米饭\n沙县小吃\n兰州拉面\n麦当劳\n肯德基"}
              value={sharedPool}
              onChange={(e) => setSharedPool(e.target.value)}
            />
          </Card>
        ) : null}

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">轮换位设置</h2>
            <Button onClick={addRotator} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              添加轮换位
            </Button>
          </div>

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
                        updateRotator(rotator.id, "label", e.target.value)
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
                            updateRotator(
                              rotator.id,
                              "individualPool",
                              e.target.value
                            )
                          }
                        />
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
          </div>
        </Card>

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex-shrink-0 w-1 h-1 rounded-full bg-primary mt-2" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">提示：</span>
            保存后可在"我的项目"中找到此项目，点击即可使用随机器。
          </p>
        </div>
      </div>
    </div>
  );
}
