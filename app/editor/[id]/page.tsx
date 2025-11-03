"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  GripVertical,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PageHeader } from "@/components/page-header";
import { saveProject, getProject } from "@/lib/storage";
import type { ProjectConfig } from "@/types/project";

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

  // 新增：主题色和图标
  const [themeColor, setThemeColor] = useState("#a855f7"); // 默认紫色
  const [iconType, setIconType] = useState<"lucide" | "image">("lucide");
  const [selectedIcon, setSelectedIcon] = useState("Sparkles");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const isSharedPool = projectType === "shared";

  // 预设主题色
  const presetColors = [
    { name: "紫色", value: "#a855f7" },
    { name: "蓝色", value: "#3b82f6" },
    { name: "青色", value: "#06b6d4" },
    { name: "绿色", value: "#10b981" },
    { name: "黄色", value: "#f59e0b" },
    { name: "橙色", value: "#f97316" },
    { name: "红色", value: "#ef4444" },
    { name: "粉色", value: "#ec4899" },
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

  // Load existing project if editing
  useEffect(() => {
    const existing = getProject(params.id);
    if (existing) {
      setProjectName(existing.name);
      setLocationText(existing.config.locationText || "");
      // 确保速度在15-60范围内
      const loadedSpeed = existing.config.speed;
      setSpeed(Math.max(15, Math.min(60, loadedSpeed)));
      setSharedPool(existing.config.sharedPool?.join("\n") || "");
      setRotators(
        existing.config.rotators.map((r) => ({
          id: r.id.toString(),
          label: r.label,
          individualPool: r.individualPool?.join("\n") || "",
        }))
      );
      // 加载外观设置
      if (existing.themeColor) setThemeColor(existing.themeColor);
      if (existing.iconType) setIconType(existing.iconType);
      if (existing.iconName) setSelectedIcon(existing.iconName);
      if (existing.iconUrl) setImageUrl(existing.iconUrl);
      if (existing.isPublished) setIsPublished(existing.isPublished);
    }
  }, [params.id]);

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
    if (!projectName.trim()) {
      alert("请输入项目名称");
      return;
    }

    const config: ProjectConfig = {
      locationText: locationText.trim(),
      speed,
      sharedPool: isSharedPool
        ? sharedPool.split("\n").filter((line) => line.trim())
        : undefined,
      rotators: rotators.map((r, index) => ({
        id: index + 1,
        label: r.label.trim() || `轮换位 ${index + 1}`,
        individualPool: !isSharedPool
          ? r.individualPool.split("\n").filter((line) => line.trim())
          : undefined,
      })),
    };

    saveProject({
      id: params.id,
      name: projectName.trim(),
      config,
      isOwner: true, // 标记为自己创建的
      themeColor,
      iconType,
      iconName: iconType === "lucide" ? selectedIcon : undefined,
      iconUrl: iconType === "image" ? imageUrl : undefined,
      isPublished,
    });

    router.push("/dashboard/my-projects");
  };

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6 pb-24">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <PageHeader title={isSharedPool ? "共享池项目" : "独立池项目"} />
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">旋转速度</label>
                <span className="text-sm text-muted-foreground">
                  {speed} 项/秒
                </span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                min={15}
                max={60}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>慢 (15)</span>
                <span>快 (60)</span>
              </div>
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

        {/* 分隔线 */}
        <div className="border-t my-4" />

        {/* 外观设置 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">外观设置</h2>
          <div className="flex flex-col gap-4">
            {/* 主题色 */}
            <div>
              <label className="text-sm font-medium mb-3 block">主题色</label>

              {/* 预设颜色网格 */}
              <div className="grid grid-cols-8 gap-3 mb-4">
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setThemeColor(color.value)}
                    className="group relative aspect-square rounded-xl transition-all hover:scale-110"
                    title={color.name}
                  >
                    <div
                      className={`absolute inset-0 rounded-xl transition-all ${
                        themeColor === color.value
                          ? "ring-2 ring-offset-2 ring-offset-background"
                          : ""
                      }`}
                      style={{
                        backgroundColor: color.value,
                        boxShadow:
                          themeColor === color.value
                            ? `0 0 0 2px ${color.value}`
                            : "none",
                      }}
                    />
                    {themeColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* 自定义颜色 */}
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <Input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-12 h-12 cursor-pointer p-1 border-2"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    value={themeColor.toUpperCase()}
                    onChange={(e) => setThemeColor(e.target.value)}
                    placeholder="#A855F7"
                    className="font-mono"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
            </div>

            {/* 图标 */}
            <div>
              <label className="text-sm font-medium mb-2 block">图标</label>
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant={iconType === "lucide" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIconType("lucide")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  图标库
                </Button>
                <Button
                  type="button"
                  variant={iconType === "image" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIconType("image")}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  自定义图片
                </Button>
              </div>

              {iconType === "lucide" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {(() => {
                        const IconComponent = (Icons as any)[
                          selectedIcon
                        ] as LucideIcon;
                        return IconComponent ? (
                          <>
                            <IconComponent className="h-5 w-5 mr-2" />
                            {selectedIcon}
                          </>
                        ) : (
                          "选择图标"
                        );
                      })()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid grid-cols-5 gap-2">
                      {commonIcons.map((iconName) => {
                        const IconComponent = (Icons as any)[
                          iconName
                        ] as LucideIcon;
                        return (
                          <button
                            key={iconName}
                            onClick={() => setSelectedIcon(iconName)}
                            className={`p-3 rounded-lg hover:bg-accent transition-colors ${
                              selectedIcon === iconName ? "bg-accent" : ""
                            }`}
                            title={iconName}
                          >
                            {IconComponent && (
                              <IconComponent className="h-5 w-5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  type="url"
                  placeholder="输入图片 URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              )}
            </div>

            {/* 预览 */}
            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">预览</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor}33 0%, ${themeColor}08 100%)`,
                  }}
                >
                  {iconType === "lucide" ? (
                    (() => {
                      const IconComponent = (Icons as any)[
                        selectedIcon
                      ] as LucideIcon;
                      return IconComponent ? (
                        <IconComponent
                          className="h-8 w-8"
                          style={{ color: themeColor }}
                        />
                      ) : null;
                    })()
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Icon"
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{projectName || "项目名称"}</p>
                  <p className="text-sm text-muted-foreground">
                    {isSharedPool ? "共享池" : "独立池"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 发布设置 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">发布到社区</h2>
              <p className="text-sm text-muted-foreground mt-1">
                将项目分享到探索页面，让其他用户发现和使用
              </p>
            </div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </Card>
      </div>
    </div>
  );
}
