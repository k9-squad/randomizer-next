"use client";

import { Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Group {
  id: string;
  name: string;
}

interface GroupingConfigSectionProps {
  members: string;
  groups: Group[];
  onMembersChange: (value: string) => void;
  onGroupsChange: (groups: Group[]) => void;
  maxLineLength?: number;
}

function limitTextareaLines(text: string, maxLineLength: number): string {
  return text
    .split("\n")
    .map((line) => line.slice(0, maxLineLength))
    .join("\n");
}

export function GroupingConfigSection({
  members,
  groups,
  onMembersChange,
  onGroupsChange,
  maxLineLength = 50,
}: GroupingConfigSectionProps) {
  const addGroup = () => {
    const newId = Date.now().toString();
    onGroupsChange([
      ...groups,
      { id: newId, name: `第 ${groups.length + 1} 组` },
    ]);
  };

  const removeGroup = (id: string) => {
    if (groups.length > 2) {
      onGroupsChange(groups.filter((g) => g.id !== id));
    }
  };

  const updateGroup = (id: string, name: string) => {
    onGroupsChange(
      groups.map((g) => (g.id === id ? { ...g, name: name.slice(0, 20) } : g))
    );
  };

  const handleMembersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const limited = limitTextareaLines(e.target.value, maxLineLength);
    onMembersChange(limited);
  };

  const memberCount = members.split("\n").filter((m) => m.trim()).length;

  return (
    <Card className="p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">分组配置</h2>

      {/* 成员列表 */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          成员列表 <span className="text-destructive">*</span>
          <span className="text-xs text-muted-foreground ml-2">
            (当前 {memberCount} 个成员，每行一个，最多 200 个)
          </span>
        </label>
        <textarea
          className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="每行一个成员，例如：&#10;张三&#10;李四&#10;王五"
          value={members}
          onChange={handleMembersChange}
          rows={10}
        />
        <p className="text-xs text-muted-foreground mt-1">
          每行输入一个成员名称，将被随机分配到各个组中
        </p>
      </div>

      {/* 分组列表 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">
            分组设置 <span className="text-destructive">*</span>
            <span className="text-xs text-muted-foreground ml-2">
              (当前 {groups.length} 个组，至少 2 个)
            </span>
          </label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addGroup}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            添加组
          </Button>
        </div>

        <div className="space-y-2">
          {groups.map((group, index) => (
            <div
              key={group.id}
              className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 cursor-move" />
              <span className="text-sm text-muted-foreground w-8">
                {index + 1}.
              </span>
              <Input
                placeholder="组名称"
                value={group.name}
                onChange={(e) => updateGroup(group.id, e.target.value)}
                className="flex-1"
                maxLength={20}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeGroup(group.id)}
                disabled={groups.length <= 2}
                className="h-8 w-8 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          成员将被尽可能均匀地分配到各个组中
        </p>
      </div>
    </Card>
  );
}
