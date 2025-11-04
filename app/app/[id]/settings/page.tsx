"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  GripVertical,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Pipette,
  X,
  type LucideIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { saveProject, getProject, deleteProject } from "@/lib/storage";
import type {
  ProjectConfig,
  LotteryConfig,
  GroupingConfig,
} from "@/types/project";
import { validateGroupingConfig } from "@/lib/grouping";

export default function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // 项目模式
  const [mode, setMode] = useState<"lottery" | "grouping">("lottery");

  const [projectName, setProjectName] = useState("");
  const [locationText, setLocationText] = useState("");
  const [speedLevel, setSpeedLevel] = useState<"slow" | "medium" | "fast">(
    "medium"
  );

  // 抽奖模式状态
  const [sharedPool, setSharedPool] = useState("");
  const [rotators, setRotators] = useState([
    { id: "1", label: "轮换位 1", individualPool: "" },
  ]);
  const [poolType, setPoolType] = useState<"shared" | "individual">("shared");
  const [drawMode, setDrawMode] = useState<"unlimited" | "limited">(
    "unlimited"
  );
  const [allowDuplicates, setAllowDuplicates] = useState(true);

  // 为了兼容旧代码
  const isSharedPool = poolType === "shared";

  // 分组模式状态
  const [members, setMembers] = useState("");
  const [groupCount, setGroupCount] = useState(3);
  const [groupNames, setGroupNames] = useState<string[]>([]);

  // 速度映射
  const speedMap = {
    slow: 15,
    medium: 30,
    fast: 60,
  };

  // 分类和标签
  const [category, setCategory] = useState("随机选择");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // 主题色和图标
  const [themeColor, setThemeColor] = useState("#a855f7");
  const [iconType, setIconType] = useState<"lucide" | "image">("lucide");
  const [selectedIcon, setSelectedIcon] = useState("Sparkles");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  // 删除确认
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 修改追踪和确认弹窗
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [pendingPublishState, setPendingPublishState] = useState(false);
  const isInitialLoadRef = useRef(true);

  // 预设分类
  const categories = [
    "随机选择",
    "团队分组",
    "抽奖活动",
    "决策工具",
    "游戏娱乐",
    "教育学习",
    "工作效率",
    "其他",
  ];

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
    "Users",
    "Target",
    "Rocket",
    "Lightbulb",
    "Megaphone",
    "Calendar",
    "Clock",
    "MapPin",
    "Book",
    "Briefcase",
    "ShoppingCart",
    "Smile",
    "ThumbsUp",
    "Bookmark",
    "Bell",
  ];

  // Load existing project
  useEffect(() => {
    const existing = getProject(id);
    if (existing) {
      setProjectName(existing.name);
      setLocationText(existing.config.locationText || "");
      const loadedSpeed = existing.config.speed;
      if (loadedSpeed <= 15) setSpeedLevel("slow");
      else if (loadedSpeed <= 30) setSpeedLevel("medium");
      else setSpeedLevel("fast");

      // 根据模式加载配置
      if (existing.config.mode === "lottery") {
        setMode("lottery");
        setPoolType(existing.config.poolType);
        setDrawMode(existing.config.drawMode);
        setAllowDuplicates(existing.config.allowDuplicates ?? true);

        setSharedPool(existing.config.sharedPool?.join("\n") || "");
        setRotators(
          existing.config.rotators.map((r) => ({
            id: r.id.toString(),
            label: r.label,
            individualPool: r.individualPool?.join("\n") || "",
          }))
        );
      } else if (existing.config.mode === "grouping") {
        setMode("grouping");
        setMembers(existing.config.members.join("\n"));
        setGroupCount(existing.config.groupCount);
        // 加载自定义组名
        if (existing.config.groups && existing.config.groups.length > 0) {
          const customNames = existing.config.groups.map((g) =>
            g.name !== `第 ${g.id} 组` ? g.name : ""
          );
          setGroupNames(customNames);
        }
      }
      if (existing.category) setCategory(existing.category);
      if (existing.tags) setTags(existing.tags);
      if (existing.themeColor) setThemeColor(existing.themeColor);
      if (existing.iconType) setIconType(existing.iconType);
      if (existing.iconName) setSelectedIcon(existing.iconName);
      if (existing.iconUrl) setImageUrl(existing.iconUrl);
      if (existing.isPublished) setIsPublished(existing.isPublished);

      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 100);
    }
  }, [id]);

  // 监听字段变化
  useEffect(() => {
    if (!isInitialLoadRef.current) {
      setHasUnsavedChanges(true);
    }
  }, [
    projectName,
    locationText,
    speedLevel,
    sharedPool,
    rotators,
    poolType,
    drawMode,
    allowDuplicates,
    members,
    groupCount,
    groupNames,
    category,
    tags,
    themeColor,
    iconType,
    selectedIcon,
    imageUrl,
    isPublished,
    id,
  ]);

  const addRotator = () => {
    const newId = Date.now().toString();
    setRotators([
      ...rotators,
      { id: newId, label: `轮换位 ${rotators.length + 1}`, individualPool: "" },
    ]);
    setHasUnsavedChanges(true);
  };

  const removeRotator = (id: string) => {
    if (rotators.length > 1) {
      setRotators(rotators.filter((r) => r.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const updateRotator = (id: string, field: string, value: string) => {
    setRotators(
      rotators.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
    setHasUnsavedChanges(true);
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      if (tags.length >= 3) {
        alert("最多只能添加3个标签");
        return;
      }
      setTags([...tags, trimmed]);
      setTagInput("");
      setHasUnsavedChanges(true);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setHasUnsavedChanges(true);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = () => {
    if (!projectName.trim()) {
      alert("请输入项目名称");
      return;
    }

    let config: ProjectConfig;

    if (mode === "lottery") {
      const poolItems =
        poolType === "shared"
          ? sharedPool.split("\n").filter((line) => line.trim())
          : [];

      const rotatorConfigs = rotators.map((r, index) => ({
        id: index + 1,
        label: r.label.trim() || `轮换位 ${index + 1}`,
        individualPool:
          poolType === "individual"
            ? r.individualPool.split("\n").filter((line) => line.trim())
            : undefined,
      }));

      // 验证：不放回模式下，轮换位数量不能超过池子大小
      if (drawMode === "limited") {
        let poolSize = 0;
        if (poolType === "shared") {
          poolSize = poolItems.length;
        } else {
          // 独立池模式下，取最小池子大小
          const poolSizes = rotatorConfigs
            .map((r) => r.individualPool?.length || 0)
            .filter((size) => size > 0);
          poolSize = poolSizes.length > 0 ? Math.min(...poolSizes) : 0;
        }

        if (rotators.length > poolSize) {
          alert(
            `不放回模式下，轮换位数量（${rotators.length}）不能超过池子大小（${poolSize}）`
          );
          return;
        }
      }

      config = {
        mode: "lottery",
        locationText: locationText.trim(),
        speed: speedMap[speedLevel],
        poolType: poolType,
        drawMode: drawMode,
        allowDuplicates: allowDuplicates,
        sharedPool: poolType === "shared" ? poolItems : undefined,
        rotators: rotatorConfigs,
      } as LotteryConfig;
    } else {
      // 分组模式
      const memberList = members
        .split("\n")
        .map((m) => m.trim())
        .filter((m) => m);

      // 验证配置
      const validation = validateGroupingConfig(memberList, groupCount);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      // 构建自定义组名的groups（仅包含组名，成员稍后生成）
      const customGroups = Array.from({ length: groupCount }, (_, i) => ({
        id: i + 1,
        name: groupNames[i]?.trim() || `第 ${i + 1} 组`,
        members: [], // 运行时填充
      }));

      config = {
        mode: "grouping",
        locationText: locationText.trim(),
        speed: speedMap[speedLevel],
        members: memberList,
        groupCount: groupCount,
        groups: customGroups, // 保存包含自定义名称的空组
      } as GroupingConfig;
    }

    saveProject({
      id: id,
      name: projectName.trim(),
      config,
      isOwner: true,
      category: category,
      tags: tags.length > 0 ? tags : undefined,
      themeColor,
      iconType,
      iconName: iconType === "lucide" ? selectedIcon : undefined,
      iconUrl: iconType === "image" ? imageUrl : undefined,
      isPublished,
    });

    setHasUnsavedChanges(false);
    router.back();
  };

  const handleSaveAndGoBack = () => {
    handleSave();
    setShowUnsavedDialog(false);
  };

  const handleDiscardAndGoBack = () => {
    setHasUnsavedChanges(false);
    router.back();
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      router.back();
    }
  };

  const handleDelete = () => {
    if (deleteProject(id)) {
      setHasUnsavedChanges(false);
      router.push("/dashboard/my-projects");
    }
  };

  const handlePublishToggle = (checked: boolean) => {
    setPendingPublishState(checked);
    setShowPublishDialog(true);
  };

  const confirmPublishChange = () => {
    setIsPublished(pendingPublishState);
    setShowPublishDialog(false);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6 pb-24">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <PageHeader title="项目设置" onBack={handleBackClick} />
          <Button onClick={handleSave}>保存设置</Button>
        </div>

        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">基本信息</h2>
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

            {/* 分类和标签 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  项目分类 <span className="text-destructive">*</span>
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择项目分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  标签（可选，最多3个）
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="输入标签后按回车添加"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    className="flex-1"
                    disabled={tags.length >= 3}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    className="h-10 px-3"
                    disabled={tags.length >= 3}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 标签显示 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 旋转速度 */}
            <div>
              <label className="text-sm font-medium mb-2 block">旋转速度</label>
              <Tabs
                value={speedLevel}
                onValueChange={(value) =>
                  setSpeedLevel(value as "slow" | "medium" | "fast")
                }
              >
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="slow">慢</TabsTrigger>
                  <TabsTrigger value="medium">中</TabsTrigger>
                  <TabsTrigger value="fast">快</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 发布到社区 */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex-1">
                <label className="text-sm font-medium block">发布到社区</label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  将项目分享到探索页面，让其他用户发现和使用
                </p>
              </div>
              <Switch
                checked={isPublished}
                onCheckedChange={handlePublishToggle}
              />
            </div>
          </div>
        </Card>

        {/* 抽奖模式配置 */}
        {mode === "lottery" && (
          <>
            {/* 抽奖模式选项 */}
            <Card className="p-6 flex flex-col gap-4">
              <h2 className="text-xl font-semibold">抽奖模式设置</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 共享/独立 */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    池子模式 <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={poolType}
                    onValueChange={(value: "shared" | "individual") =>
                      setPoolType(value)
                    }
                  >
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
                  <Select
                    value={drawMode}
                    onValueChange={(value: "unlimited" | "limited") =>
                      setDrawMode(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlimited">
                        放回抽取（无限）
                      </SelectItem>
                      <SelectItem value="limited">
                        不放回抽取（有限）
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {drawMode === "unlimited"
                      ? "可以无限次抽取，选项可重复出现"
                      : "每个选项只能抽取一次，抽完即止"}
                  </p>
                </div>
              </div>

              {/* 重复/不重复（仅在共享池、无限抽取且轮换位>1时显示） */}
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
                        onCheckedChange={setAllowDuplicates}
                      />
                    </div>
                  </div>
                )}

              {/* 不放回模式的提示 */}
              {drawMode === "limited" && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    ⚠️ 不放回模式下，轮换位数量不能超过池子中的选项数量
                  </p>
                </div>
              )}
            </Card>

            {isSharedPool ? (
              <Card className="p-6 flex flex-col gap-4">
                <h2 className="text-xl font-semibold">共享池内容</h2>
                <p className="text-sm text-muted-foreground">
                  每行一个选项，所有轮换位将从这些选项中随机选择
                </p>
                <textarea
                  className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm resize-y"
                  placeholder={"黄焖鸡米饭\n沙县小吃\n兰州拉面\n麦当劳\n肯德基"}
                  value={sharedPool}
                  onChange={(e) => setSharedPool(e.target.value)}
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
            ) : null}

            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
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
          </>
        )}

        {/* 分组模式配置 */}
        {mode === "grouping" && (
          <>
            <Card className="p-6 flex flex-col gap-4">
              <h2 className="text-xl font-semibold">成员列表</h2>
              <p className="text-sm text-muted-foreground">
                每行一个成员名称，这些成员将被随机分配到各个组中
              </p>
              <textarea
                className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm resize-y font-mono"
                placeholder={"张三\n李四\n王五\n赵六\n钱七\n孙八"}
                value={members}
                onChange={(e) => setMembers(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                当前成员数：{members.split("\n").filter((m) => m.trim()).length}
              </p>
            </Card>

            <Card className="p-6 flex flex-col gap-4">
              <h2 className="text-xl font-semibold">分组设置</h2>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  分组数量 <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={groupCount}
                  onChange={(e) =>
                    setGroupCount(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  placeholder="请输入分组数量"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  💡 系统会自动均匀分配成员到各组，确保每组人数尽可能接近
                </p>
              </div>

              {/* 实时预览分组情况 */}
              {members.trim() && groupCount > 0 && (
                <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">预计分组情况：</p>
                  {(() => {
                    const memberCount = members
                      .split("\n")
                      .filter((m) => m.trim()).length;
                    if (memberCount < groupCount) {
                      return (
                        <p className="text-sm text-destructive">
                          ⚠️ 成员数量（{memberCount}）少于分组数量（{groupCount}
                          ），请增加成员或减少分组数
                        </p>
                      );
                    }
                    const baseSize = Math.floor(memberCount / groupCount);
                    const remainder = memberCount % groupCount;
                    const groupsWithExtra = remainder;
                    const groupsWithBase = groupCount - remainder;

                    return (
                      <div className="text-sm text-muted-foreground space-y-1">
                        {groupsWithBase > 0 && (
                          <p>
                            • {groupsWithBase} 个组，每组 {baseSize} 人
                          </p>
                        )}
                        {groupsWithExtra > 0 && (
                          <p>
                            • {groupsWithExtra} 个组，每组 {baseSize + 1} 人
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </Card>

            {/* 自定义组名 */}
            <Card className="p-6 flex flex-col gap-4">
              <h2 className="text-xl font-semibold">自定义组名（可选）</h2>
              <p className="text-sm text-muted-foreground">
                为每个组设置自定义名称。如不设置，将使用默认名称（第 1 组、第 2
                组...）
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: groupCount }, (_, i) => (
                  <div key={i}>
                    <label className="text-sm font-medium mb-1.5 block">
                      第 {i + 1} 组
                    </label>
                    <Input
                      placeholder={`第 ${i + 1} 组`}
                      value={groupNames[i] || ""}
                      onChange={(e) => {
                        const newNames = [...groupNames];
                        newNames[i] = e.target.value;
                        setGroupNames(newNames);
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* 外观设置 */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">外观设置</h2>
          <div className="flex flex-col gap-4">
            {/* 主题色 */}
            <div>
              <label className="text-sm font-medium mb-3 block">主题色</label>
              <div className="flex flex-wrap gap-2 items-center">
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setThemeColor(color.value)}
                    className="group relative w-10 h-10 rounded-full transition-all hover:scale-110"
                    title={color.name}
                  >
                    <div
                      className={`absolute inset-0 rounded-full transition-all ${
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

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="relative w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/50 hover:border-muted-foreground hover:scale-110 transition-all flex items-center justify-center"
                      title="自定义颜色"
                    >
                      <Pipette className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium">自定义颜色</label>
                      <div className="flex gap-3 items-center">
                        <Input
                          type="color"
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="w-16 h-16 cursor-pointer p-1 border-2"
                        />
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={themeColor.toUpperCase()}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                setThemeColor(value);
                              }
                            }}
                            placeholder="#A855F7"
                            className="font-mono"
                            maxLength={7}
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* 图标 */}
            <div>
              <label className="text-sm font-medium mb-3 block">图标</label>
              <Tabs
                value={iconType}
                onValueChange={(value) =>
                  setIconType(value as "lucide" | "image")
                }
                className="w-full"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <TabsList className="w-fit">
                    <TabsTrigger value="lucide" className="gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      图标库
                    </TabsTrigger>
                    <TabsTrigger value="image" className="gap-1.5">
                      <ImageIcon className="h-4 w-4" />
                      自定义图片
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1">
                    <TabsContent value="lucide" className="mt-0">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
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
                    </TabsContent>

                    <TabsContent value="image" className="mt-0">
                      <Input
                        type="url"
                        placeholder="输入图片 URL..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </TabsContent>
                  </div>
                </div>
              </Tabs>
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

        {/* 分隔线 */}
        <div className="border-t my-2" />

        {/* 删除项目 */}
        <Card className="p-6 border-destructive/50 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-destructive">危险区域</h2>
            <p className="text-sm text-muted-foreground mt-1">
              删除后无法恢复，请谨慎操作
            </p>
          </div>
          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除项目
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-center">
                确定要删除这个项目吗？
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  取消
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                >
                  确认删除
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* 未保存更改对话框 */}
        {showUnsavedDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="p-6 max-w-md w-full flex flex-col gap-4 relative">
              <button
                onClick={() => setShowUnsavedDialog(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold">有未保存的更改</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  您有未保存的更改，确定要离开吗？
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleSaveAndGoBack} className="w-full">
                  保存并返回
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDiscardAndGoBack}
                  className="w-full"
                >
                  放弃更改
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* 发布确认对话框 */}
        {showPublishDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="p-6 max-w-md w-full flex flex-col gap-4 relative">
              <button
                onClick={() => setShowPublishDialog(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold">
                  {pendingPublishState ? "发布到社区" : "取消发布"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {pendingPublishState
                    ? "发布后，您的项目将出现在探索页面，其他用户可以发现和复制使用。"
                    : "取消发布后，您的项目将从探索页面移除，但仍保留在您的项目列表中。"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPublishDialog(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button onClick={confirmPublishChange} className="flex-1">
                  确认
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
