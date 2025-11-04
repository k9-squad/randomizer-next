"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, List, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveProject } from "@/lib/storage";

export default function NewProjectPage() {
  const router = useRouter();

  const handleCreateShared = () => {
    const newId = `shared-${Date.now()}`;

    // 创建带默认值的共享池项目
    saveProject({
      id: newId,
      name: "新建项目",
      config: {
        locationText: "",
        speed: 30,
        sharedPool: ["选项1", "选项2", "选项3"],
        rotators: [
          { id: 1, label: "轮换位 1" },
          { id: 2, label: "轮换位 2" },
          { id: 3, label: "轮换位 3" },
        ],
      },
      isOwner: true,
      category: "随机选择",
      themeColor: "#a855f7",
      iconType: "lucide",
      iconName: "Sparkles",
      isPublished: false,
    });

    // 直接跳转到项目页面
    router.push(`/app/${newId}`);
  };

  const handleCreateIndividual = () => {
    const newId = `individual-${Date.now()}`;

    // 创建带默认值的独立池项目
    saveProject({
      id: newId,
      name: "新建项目",
      config: {
        locationText: "",
        speed: 30,
        rotators: [
          {
            id: 1,
            label: "轮换位 1",
            individualPool: ["选项1", "选项2", "选项3"],
          },
          {
            id: 2,
            label: "轮换位 2",
            individualPool: ["选项1", "选项2", "选项3"],
          },
          {
            id: 3,
            label: "轮换位 3",
            individualPool: ["选项1", "选项2", "选项3"],
          },
        ],
      },
      isOwner: true,
      category: "随机选择",
      themeColor: "#a855f7",
      iconType: "lucide",
      iconName: "Sparkles",
      isPublished: false,
    });

    // 直接跳转到项目页面
    router.push(`/app/${newId}`);
  };

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className="mt-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            新建项目
          </h1>
          <p className="text-muted-foreground mt-1">
            选择一个模板开始创建你的随机器项目
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card
            className="relative overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer group"
            onClick={handleCreateShared}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  "linear-gradient(135deg, hsl(262 83% 58% / 0.3) 0%, transparent 100%)",
              }}
            />
            <div className="relative p-8 flex flex-col gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Database className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">共享池</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  所有轮换位使用同一个池子。适合"今天吃什么"、"随机抽签"等场景，每个轮换位从相同的选项中抽取不同的结果。
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-secondary/50 rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground">
                  典型案例
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-foreground/80">• 中午吃什么</p>
                  <p className="text-foreground/80">• 抽奖活动</p>
                  <p className="text-foreground/80">• 守望先锋穿越</p>
                </div>
              </div>

              <Button className="w-full group-hover:bg-primary/90">
                创建共享池项目
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card
            className="relative overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer group"
            onClick={handleCreateIndividual}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  "linear-gradient(135deg, hsl(173 80% 40% / 0.3) 0%, transparent 100%)",
              }}
            />
            <div className="relative p-8 flex flex-col gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <List className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">独立池</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  每个轮换位拥有独立的池子。适合"COC车卡"、"角色生成器"等场景，每个轮换位从不同的选项类别中抽取结果。
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-secondary/50 rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground">
                  典型案例
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-foreground/80">• COC人设车卡</p>
                  <p className="text-foreground/80">• 随机超能力</p>
                  <p className="text-foreground/80">• 角色生成器</p>
                </div>
              </div>

              <Button className="w-full group-hover:bg-primary/90">
                创建独立池项目
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex-shrink-0 w-1 h-1 rounded-full bg-primary mt-2" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">提示：</span>
            创建后，项目会带有默认的占位内容。点击右上角的设置按钮即可编辑项目内容和配置。
          </p>
        </div>
      </div>
    </div>
  );
}
