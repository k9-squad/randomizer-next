import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface BasicInfoSectionProps {
  projectName: string;
  locationText: string;
  category: string;
  tags: string[];
  tagInput: string;
  onProjectNameChange: (value: string) => void;
  onLocationTextChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CATEGORIES = [
  "随机选择",
  "团队分组",
  "抽奖活动",
  "决策工具",
  "游戏娱乐",
  "教育学习",
  "工作效率",
  "其他",
];

export function BasicInfoSection({
  projectName,
  locationText,
  category,
  tags,
  tagInput,
  onProjectNameChange,
  onLocationTextChange,
  onCategoryChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onTagInputKeyDown,
}: BasicInfoSectionProps) {
  return (
    <>
      <div>
        <label className="text-sm font-medium mb-2 block">项目名称</label>
        <Input
          placeholder="例如：中午吃什么"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          位置描述文字（可选）
        </label>
        <Input
          placeholder="例如：今天的午餐是"
          value={locationText}
          onChange={(e) => onLocationTextChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            项目分类 <span className="text-destructive">*</span>
          </label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="选择项目分类" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
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
              onChange={(e) => onTagInputChange(e.target.value)}
              onKeyDown={onTagInputKeyDown}
              className="flex-1"
              disabled={tags.length >= 3}
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddTag}
              className="h-10 px-3"
              disabled={tags.length >= 3}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

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
                onClick={() => onRemoveTag(tag)}
                className="hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
