"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dices, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveProject } from "@/lib/storage";
import { LotteryConfig, GroupingConfig } from "@/types/project";

export default function NewProjectPage() {
  const router = useRouter();

  // 预设主题色
  const presetColors = [
    "#a855f7", // 紫色
    "#3b82f6", // 蓝色
    "#06b6d4", // 青色
    "#10b981", // 绿色
    "#f59e0b", // 黄色
    "#f97316", // 橙色
    "#ef4444", // 红色
    "#ec4899", // 粉色
  ];

  // 常用图标
  const commonIcons = [
    "Sparkles",
    "Dices",
    "Shuffle",
    "TrendingUp",
    "Zap",
    "Heart",
    "Star",
    "Gift",
    "Trophy",
    "Crown",
    "Flame",
    "Music",
    "Gamepad2",
    "Coffee",
    "Pizza",
  ];

  // 随机选择函数
  const getRandomItem = <T,>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const handleCreateLottery = () => {
    const newId = `lottery-${Date.now()}`;

    const lotteryConfig: LotteryConfig = {
      mode: "lottery",
      locationText: "",
      speed: 30,
      poolType: "shared",
      drawMode: "unlimited",
      allowDuplicates: true,
      sharedPool: ["选项1", "选项2", "选项3"],
      rotators: [
        { id: 1, label: "轮换位 1" },
        { id: 2, label: "轮换位 2" },
        { id: 3, label: "轮换位 3" },
      ],
    };

    saveProject({
      id: newId,
      name: "新建抽奖项目",
      config: lotteryConfig,
      isOwner: true,
      category: "随机选择",
      themeColor: getRandomItem(presetColors),
      iconType: "lucide",
      iconName: getRandomItem(commonIcons),
      isPublished: false,
    });

    router.push(`/app/${newId}`);
  };

  const handleCreateGrouping = () => {
    const newId = `grouping-${Date.now()}`;

    const groupingConfig: GroupingConfig = {
      mode: "grouping",
      locationText: "",
      speed: 30,
      members: ["成员1", "成员2", "成员3", "成员4", "成员5", "成员6"],
      groupCount: 3,
      groups: [
        { id: 1, name: "第 1 组", members: [] },
        { id: 2, name: "第 2 组", members: [] },
        { id: 3, name: "第 3 组", members: [] },
      ], // 初始包含默认组名，成员运行时生成
    };

    saveProject({
      id: newId,
      name: "新建分组项目",
      config: groupingConfig,
      isOwner: true,
      category: "团队分组",
      themeColor: getRandomItem(presetColors),
      iconType: "lucide",
      iconName: getRandomItem(commonIcons),
      isPublished: false,
    });

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
            onClick={handleCreateLottery}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  "linear-gradient(135deg, hsl(262 83% 58% / 0.3) 0%, transparent 100%)",
              }}
            />
            <div className="relative p-8 flex flex-col gap-6">
              <Dices className="h-16 w-16 text-primary" strokeWidth={1.5} />

              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">抽奖模式</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  多个轮换位，每个轮换位独立抽取结果。可选择共享池或独立池，支持无限抽取或有限抽取（不放回）。
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-secondary/50 rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground">
                  典型案例
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-foreground/80">• 今天吃什么</p>
                  <p className="text-foreground/80">• 随机抽签</p>
                  <p className="text-foreground/80">• COC人设车卡</p>
                </div>
              </div>

              <Button className="w-full group-hover:bg-primary/90">
                创建抽奖项目
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card
            className="relative overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer group"
            onClick={handleCreateGrouping}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  "linear-gradient(135deg, hsl(173 80% 40% / 0.3) 0%, transparent 100%)",
              }}
            />
            <div className="relative p-8 flex flex-col gap-6">
              <Users className="h-16 w-16 text-primary" strokeWidth={1.5} />

              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">分组模式</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  将成员随机分配到指定数量的组中。支持均匀分配算法，确保每个组的人数尽可能接近，可无限重新分组。
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-secondary/50 rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground">
                  典型案例
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-foreground/80">• 随机分队</p>
                  <p className="text-foreground/80">• 小组作业分组</p>
                  <p className="text-foreground/80">• 活动团队划分</p>
                </div>
              </div>

              <Button className="w-full group-hover:bg-primary/90">
                创建分组项目
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex-shrink-0 w-1 h-1 rounded-full bg-primary mt-2" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">提示：</span>
            创建后，项目会带有默认的占位内容。点击项目页面右上角的设置按钮即可编辑项目内容和配置。
          </p>
        </div>

        <div className="flex flex-col gap-4 p-5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="font-semibold text-foreground">💡 两种模式的区别</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-foreground mb-2">抽奖模式</p>
              <p className="text-muted-foreground leading-relaxed">
                适合需要多次独立抽取的场景。例如"今天吃什么"项目中，第一道菜、第二道菜、第三道菜分别独立抽取。
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">分组模式</p>
              <p className="text-muted-foreground leading-relaxed">
                适合需要将人员分配到不同组的场景。例如将30名学生随机分成10个小组，系统会自动均匀分配人数。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
