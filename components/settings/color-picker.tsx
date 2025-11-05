"use client";

import { Pipette } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const presetColors = [
  { name: "紫色", value: "#a855f7" },
  { name: "蓝色", value: "#3b82f6" },
  { name: "青色", value: "#06b6d4" },
  { name: "绿色", value: "#10b981" },
  { name: "黄色", value: "#f59e0b" },
  { name: "橙色", value: "#f97316" },
  { name: "红色", value: "#ef4444" },
  { name: "粉色", value: "#ec4899" },
  { name: "灰色", value: "#64748b" },
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-3 block">主题色</label>
      <div className="flex flex-wrap gap-2 items-center">
        {presetColors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className="group relative w-10 h-10 rounded-full transition-all hover:scale-110"
            title={color.name}
          >
            <div
              className={`absolute inset-0 rounded-full transition-all ${
                value === color.value
                  ? "ring-2 ring-offset-2 ring-offset-background"
                  : ""
              }`}
              style={{
                backgroundColor: color.value,
                boxShadow:
                  value === color.value ? `0 0 0 2px ${color.value}` : "none",
              }}
            />
            {value === color.value && (
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
              style={{
                backgroundColor: !presetColors.some((c) => c.value === value)
                  ? value
                  : "transparent",
              }}
            >
              {presetColors.some((c) => c.value === value) ? (
                <Pipette className="h-5 w-5 text-muted-foreground" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-white shadow-lg" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">自定义颜色</label>
              <div className="flex gap-3 items-center">
                <Input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-16 h-16 cursor-pointer p-1 border-2"
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    value={value.toUpperCase()}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                        onChange(val);
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
  );
}
