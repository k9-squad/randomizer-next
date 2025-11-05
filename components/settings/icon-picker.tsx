"use client";

import { useState } from "react";
import { Sparkles, ImageIcon, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface IconPickerProps {
  iconType: "lucide" | "image";
  selectedIcon: string;
  imageUrl: string;
  onIconTypeChange: (type: "lucide" | "image") => void;
  onIconChange: (iconName: string) => void;
  onImageUrlChange: (url: string) => void;
}

const iconCategories = [
  { id: "all", name: "全部" },
  { id: "random", name: "随机" },
  { id: "food", name: "食物" },
  { id: "team", name: "团队" },
  { id: "game", name: "游戏" },
  { id: "emotion", name: "情绪" },
];

const iconsByCategory: Record<string, string[]> = {
  random: [
    "Shuffle",
    "Dices",
    "Sparkles",
    "Wand2",
    "Percent",
    "CircleDot",
    "Target",
    "Zap",
    "TrendingUp",
    "BarChart3",
    "PieChart",
    "Activity",
    "GitBranch",
    "Workflow",
    "RefreshCw",
    "RotateCw",
    "Repeat",
    "Atom",
    "Binary",
    "Hash",
  ],
  food: [
    "UtensilsCrossed",
    "Coffee",
    "Pizza",
    "Cake",
    "Cookie",
    "IceCream",
    "Apple",
    "Cherry",
    "Salad",
    "Sandwich",
    "CupSoda",
    "Wine",
    "Beer",
    "Popcorn",
    "Croissant",
    "Donut",
    "Soup",
    "Drumstick",
    "FishSymbol",
    "Milk",
  ],
  team: [
    "Users",
    "UsersRound",
    "UserPlus",
    "UserCheck",
    "Handshake",
    "Users2",
    "Group",
    "Network",
    "Share2",
    "MessageCircle",
    "UserCog",
    "UserCircle",
    "UserSquare",
    "Shield",
    "BadgeCheck",
    "CircleUserRound",
    "Contact",
    "HeartHandshake",
    "Megaphone",
    "Presentation",
  ],
  game: [
    "Gamepad2",
    "Joystick",
    "Puzzle",
    "Dice1",
    "Dice2",
    "Dice3",
    "Dice4",
    "Dice5",
    "Dice6",
    "Swords",
    "Drama",
    "Music",
    "Mic",
    "Headphones",
    "Film",
    "Tv",
    "Radio",
    "Camera",
    "Video",
    "PartyPopper",
  ],
  emotion: [
    "Smile",
    "Laugh",
    "Heart",
    "HeartHandshake",
    "ThumbsUp",
    "ThumbsDown",
    "PartyPopper",
    "Flame",
    "Star",
    "Bookmark",
    "Sun",
    "Moon",
    "Cloud",
    "CloudRain",
    "Snowflake",
    "Flower",
    "Trees",
    "Leaf",
    "Sunset",
    "Rainbow",
  ],
};

export function IconPicker({
  iconType,
  selectedIcon,
  imageUrl,
  onIconTypeChange,
  onIconChange,
  onImageUrlChange,
}: IconPickerProps) {
  const [iconCategory, setIconCategory] = useState<string>("all");

  const filteredIcons =
    iconCategory === "all"
      ? Object.values(iconsByCategory).flat()
      : iconsByCategory[iconCategory] || [];

  return (
    <div>
      <label className="text-sm font-medium mb-3 block">图标</label>
      <Tabs
        value={iconType}
        onValueChange={(value) => onIconTypeChange(value as "lucide" | "image")}
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
                <PopoverContent className="w-[90vw] max-w-md p-0">
                  <div className="flex h-[50vh] max-h-[400px]">
                    {/* 左侧分类列表 */}
                    <div className="w-20 border-r bg-muted/30 flex-shrink-0">
                      <div className="overflow-y-auto h-full">
                        {iconCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setIconCategory(cat.id)}
                            className={`w-full px-2 py-2.5 text-left text-sm transition-colors border-l-2 ${
                              iconCategory === cat.id
                                ? "border-l-primary bg-background text-foreground font-medium"
                                : "border-l-transparent hover:bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 右侧图标网格 */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-2.5">
                        {filteredIcons.length > 0 ? (
                          <div className="grid grid-cols-5 gap-2.5">
                            {filteredIcons.map((iconName) => {
                              const IconComponent = (Icons as any)[
                                iconName
                              ] as LucideIcon;
                              return (
                                <button
                                  key={iconName}
                                  onClick={() => onIconChange(iconName)}
                                  className={`aspect-square p-2 rounded-md border-2 transition-colors ${
                                    selectedIcon === iconName
                                      ? "border-primary bg-accent"
                                      : "border-transparent hover:border-primary/50 hover:bg-accent"
                                  }`}
                                  title={iconName}
                                >
                                  {IconComponent && (
                                    <IconComponent className="w-full h-full" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            该分类暂无图标
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TabsContent>

            <TabsContent value="image" className="mt-0">
              <Input
                type="url"
                placeholder="输入图片 URL..."
                value={imageUrl}
                onChange={(e) => onImageUrlChange(e.target.value)}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
