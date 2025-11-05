// 组件：官方模板卡片
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getLucideIcon } from "@/lib/icon-utils";
import { getGradientFrom } from "@/lib/gradient-utils";

interface OfficialTemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    icon_type?: string;
    icon_name?: string;
    theme_color?: string;
  };
}

export function OfficialTemplateCard({ template }: OfficialTemplateCardProps) {
  const icon =
    template.icon_type === "lucide" && template.icon_name
      ? getLucideIcon(template.icon_name)
      : undefined;

  const gradientFrom = getGradientFrom(template.theme_color);

  return (
    <Link href={`/app/official/${template.id}`}>
      <Card
        className="h-[100px] hover:border-primary/50 hover:scale-[1.02] transition-all cursor-pointer border border-border/50 relative overflow-hidden group"
        style={{
          background: `linear-gradient(270deg, ${gradientFrom} 0%, transparent 50%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-between px-5">
          <div className="flex flex-col items-start">
            <h3 className="text-base font-semibold mb-1">{template.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {template.description}
            </p>
          </div>
          {icon &&
            React.createElement(icon, {
              className:
                "h-14 w-14 group-hover:scale-110 transition-all flex-shrink-0",
              strokeWidth: 1.5,
              style: { color: template.theme_color },
            })}
        </div>
      </Card>
    </Link>
  );
}
