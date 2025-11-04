import { LucideIcon } from "lucide-react";

// ============ 抽奖模式相关 ============

// 轮换位定义（抽奖模式）
export interface Rotator {
  id: number;
  label: string; // 轮换位名称（如"第一道菜"、"故乡是"）
  individualPool?: string[]; // 独立池数据（仅当poolType='individual'时使用）
}

// 抽奖模式配置
export interface LotteryConfig {
  mode: "lottery";
  locationText?: string; // 情景文字
  speed: number; // 轮换速度(次/秒)，默认30
  poolType: "shared" | "individual"; // 共享池 or 独立池
  drawMode: "unlimited" | "limited"; // 无限抽取 or 有限抽取（不放回）
  allowDuplicates?: boolean; // 是否允许重复（仅unlimited模式有效）
  sharedPool?: string[]; // 共享池数据（仅当poolType='shared'时使用）
  rotators: Rotator[]; // 轮换位列表
}

// ============ 分组模式相关 ============

// 分组定义
export interface Group {
  id: number;
  name: string; // 组名
  members: string[]; // 本组成员
}

// 分组模式配置
export interface GroupingConfig {
  mode: "grouping";
  locationText?: string; // 情景文字
  speed: number; // 轮换速度(次/秒)，默认30
  members: string[]; // 所有成员列表
  groupCount: number; // 分组数量
  groups: Group[]; // 当前分组结果（运行时生成）
}

// 项目配置（联合类型）
export type ProjectConfig = LotteryConfig | GroupingConfig;

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
