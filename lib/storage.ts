import { Project, ProjectConfig, LotteryConfig } from "@/types/project";

const STORAGE_KEY = "randomizer_projects";

export interface StoredProject {
  id: string;
  name: string;
  config: ProjectConfig;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean; // true表示自己创建的，false表示复制或官方模板
  isTemplate?: boolean; // true表示官方模板
  // 分类和标签
  category?: string; // 项目分类
  tags?: string[]; // 项目标签
  // 外观设置
  themeColor?: string;
  iconType?: "lucide" | "image";
  iconName?: string; // lucide图标名称
  iconUrl?: string; // 自定义图片URL
  // 发布设置
  isPublished?: boolean;
}

// 旧版本项目配置（用于迁移）
interface LegacyProjectConfig {
  locationText?: string;
  speed: number;
  sharedPool?: string[];
  rotators: Array<{
    id: number;
    label: string;
    individualPool?: string[];
  }>;
}

interface LegacyStoredProject {
  id: string;
  name: string;
  isSharedPool?: boolean;
  config: LegacyProjectConfig;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
  isTemplate?: boolean;
  category?: string;
  tags?: string[];
  themeColor?: string;
  iconType?: "lucide" | "image";
  iconName?: string;
  iconUrl?: string;
  isPublished?: boolean;
}

// 迁移函数：将旧格式转换为新格式
function migrateProject(legacy: LegacyStoredProject): StoredProject {
  // 如果已经是新格式（有mode字段），直接返回
  if ('mode' in legacy.config) {
    return legacy as StoredProject;
  }

  // 将旧格式转换为新的抽奖模式
  const hasSharedPool = legacy.isSharedPool !== false && 
                        !!legacy.config.sharedPool && 
                        legacy.config.sharedPool.length > 0;

  const newConfig: LotteryConfig = {
    mode: "lottery",
    locationText: legacy.config.locationText,
    speed: legacy.config.speed,
    poolType: hasSharedPool ? "shared" : "individual",
    drawMode: "unlimited", // 旧版本默认无限抽取
    allowDuplicates: true, // 旧版本允许重复
    sharedPool: hasSharedPool ? legacy.config.sharedPool : undefined,
    rotators: legacy.config.rotators,
  };

  return {
    ...legacy,
    config: newConfig,
  };
}

// Get all projects
export function getAllProjects(): StoredProject[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const rawProjects = JSON.parse(data) as LegacyStoredProject[];
    // 自动迁移所有项目
    const migratedProjects = rawProjects.map(migrateProject);
    
    // 如果发生了迁移，保存回localStorage
    const needsMigration = rawProjects.some((p, i) => 
      !('mode' in p.config) && 'mode' in migratedProjects[i].config
    );
    
    if (needsMigration) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedProjects));
      console.log("Auto-migrated projects to new format");
    }
    
    return migratedProjects;
  } catch (error) {
    console.error("Failed to load projects:", error);
    return [];
  }
}

// Get project by ID
export function getProject(id: string): StoredProject | null {
  const projects = getAllProjects();
  return projects.find(p => p.id === id) || null;
}

// Save or update project
export function saveProject(project: Omit<StoredProject, "createdAt" | "updatedAt">): StoredProject {
  const projects = getAllProjects();
  const now = new Date().toISOString();
  
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    // Update existing
    const updated = {
      ...projects[existingIndex],
      ...project,
      updatedAt: now,
    };
    projects[existingIndex] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return updated;
  } else {
    // Create new
    const newProject = {
      ...project,
      createdAt: now,
      updatedAt: now,
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return newProject;
  }
}

// Delete project
export function deleteProject(id: string): boolean {
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== id);
  
  if (filtered.length < projects.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  
  return false;
}

// Clear all projects
export function clearAllProjects(): void {
  localStorage.removeItem(STORAGE_KEY);
}