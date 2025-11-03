import { LucideIcon } from "lucide-react";

// 轮换位定义
export interface Rotator {
  id: number;
  label: string; // 轮换位名称（如"第一道菜"、"故乡是"）
  individualPool?: string[]; // 独立池数据（仅当isSharedPool=false时使用）
}

// 项目配置
export interface ProjectConfig {
  locationText?: string; // 情景文字
  speed: number; // 轮换速度(次/秒)，默认30
  sharedPool?: string[]; // 共享池数据（仅当isSharedPool=true时使用）
  rotators: Rotator[]; // 轮换位列表
}

// 项目统计数据（仅分享后有）
export interface ProjectStats {
  views: number; // 被浏览数
  uses: number; // 被使用数
  favorites: number; // 被收藏数
  copies: number; // 被复制数
}

// 完整项目定义
export interface Project {
  // 基础数据
  id: string;
  name: string;
  isSharedPool: boolean; // true=共享池, false=独立池
  isDefault?: boolean; // 是否为官方模板
  
  // 视觉数据
  icon: LucideIcon; // 图标
  gradient: string; // 主题色渐变
  
  // 内容数据
  config: ProjectConfig;
  
  // 社区数据
  creatorId: string;
  creatorName: string;
  category?: string; // 分类
  tags: string[]; // 标签
  
  // 版本控制
  modifiers: string[]; // 修改者ID列表
  originalProjectId?: string; // 如果是复制的，记录原项目ID
  
  // 统计数据（仅分享后有）
  isShared: boolean;
  stats?: ProjectStats;
  
  // 元数据
  createdAt: string;
  updatedAt: string;
}
