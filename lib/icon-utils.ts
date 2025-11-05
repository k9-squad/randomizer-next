// 图标工具函数
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

/**
 * 从图标名称获取 Lucide 图标组件
 */
export function getLucideIcon(iconName: string): LucideIcon | undefined {
  return (Icons as any)[iconName] as LucideIcon;
}

/**
 * 获取图标配置（用于项目卡片等）
 */
export function getIconConfig(
  iconType?: string,
  iconName?: string,
  iconUrl?: string
): { icon?: LucideIcon; iconUrl?: string } {
  if (iconType === "image" && iconUrl) {
    return { iconUrl };
  }
  if (iconType === "lucide" && iconName) {
    return { icon: getLucideIcon(iconName) };
  }
  return {};
}
