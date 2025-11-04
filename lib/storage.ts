import { Project, ProjectConfig, LotteryConfig } from "@/types/project";

const STORAGE_KEY = "randomizer_projects";
const USER_TYPE_KEY = "user_type"; // 'guest' | 'user'
const USER_ID_KEY = "user_id";

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

// 判断是否使用云端存储
function shouldUseCloud(): boolean {
  if (typeof window === "undefined") return false;
  const userType = localStorage.getItem(USER_TYPE_KEY);
  return userType === "user";
}

// 获取当前用户ID
function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}

// ============ 本地存储函数（游客模式） ============

function getAllProjectsFromLocal(): StoredProject[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const rawProjects = JSON.parse(data) as LegacyStoredProject[];
    const migratedProjects = rawProjects.map(migrateProject);
    
    const needsMigration = rawProjects.some((p, i) => 
      !('mode' in p.config) && 'mode' in migratedProjects[i].config
    );
    
    if (needsMigration) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedProjects));
    }
    
    return migratedProjects;
  } catch (error) {
    console.error("Failed to load projects:", error);
    return [];
  }
}

function getProjectFromLocal(id: string): StoredProject | null {
  const projects = getAllProjectsFromLocal();
  return projects.find(p => p.id === id) || null;
}

function saveProjectToLocal(project: Omit<StoredProject, "createdAt" | "updatedAt">): StoredProject {
  const projects = getAllProjectsFromLocal();
  const now = new Date().toISOString();
  
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    const updated = {
      ...projects[existingIndex],
      ...project,
      updatedAt: now,
    };
    projects[existingIndex] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return updated;
  } else {
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

function deleteProjectFromLocal(id: string): boolean {
  const projects = getAllProjectsFromLocal();
  const filtered = projects.filter(p => p.id !== id);
  
  if (filtered.length < projects.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  
  return false;
}

// ============ 云端存储函数（登录用户） ============

async function getAllProjectsFromCloud(): Promise<StoredProject[]> {
  const userId = getCurrentUserId();
  if (!userId) return [];

  try {
    const response = await fetch(`/api/projects?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    
    const projects = await response.json();
    return projects.map((p: any) => ({
      id: p.id,
      name: p.name,
      config: p.config,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      category: p.tags?.[0], // 暂时用第一个标签作为分类
      tags: p.tags || [],
      themeColor: p.theme_color,
      iconType: p.icon_type,
      iconName: p.icon_name,
      iconUrl: p.icon_url,
      isPublished: p.is_public,
      isOwner: true,
    }));
  } catch (error) {
    console.error('Failed to fetch projects from cloud:', error);
    return [];
  }
}

async function getProjectFromCloud(id: string): Promise<StoredProject | null> {
  try {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) return null;
    
    const p = await response.json();
    return {
      id: p.id,
      name: p.name,
      config: p.config,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      category: p.tags?.[0],
      tags: p.tags || [],
      themeColor: p.theme_color,
      iconType: p.icon_type,
      iconName: p.icon_name,
      iconUrl: p.icon_url,
      isPublished: p.is_public,
      isOwner: true,
    };
  } catch (error) {
    console.error('Failed to fetch project from cloud:', error);
    return null;
  }
}

async function saveProjectToCloud(project: Omit<StoredProject, "createdAt" | "updatedAt">): Promise<StoredProject> {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User not logged in');

  const body = {
    name: project.name,
    description: '',
    config: project.config,
    themeColor: project.themeColor,
    iconType: project.iconType,
    iconName: project.iconName,
    tags: project.tags || [],
    userId: userId,
    isPublic: project.isPublished || false,
  };

  try {
    // 检查是新建还是更新
    const existingProject = await getProjectFromCloud(project.id);
    
    let response;
    if (existingProject) {
      // 更新
      response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      // 新建
      response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    if (!response.ok) throw new Error('Failed to save project');
    
    const saved = await response.json();
    return {
      id: saved.id,
      name: saved.name,
      config: saved.config,
      createdAt: saved.created_at,
      updatedAt: saved.updated_at,
      category: saved.tags?.[0],
      tags: saved.tags || [],
      themeColor: saved.theme_color,
      iconType: saved.icon_type,
      iconName: saved.icon_name,
      iconUrl: saved.icon_url,
      isPublished: saved.is_public,
      isOwner: true,
    };
  } catch (error) {
    console.error('Failed to save project to cloud:', error);
    throw error;
  }
}

async function deleteProjectFromCloud(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to delete project from cloud:', error);
    return false;
  }
}

// ============ 统一的公共接口 ============

// Get all projects
export async function getAllProjects(): Promise<StoredProject[]> {
  if (shouldUseCloud()) {
    return await getAllProjectsFromCloud();
  } else {
    return getAllProjectsFromLocal();
  }
}

// Get project by ID
export async function getProject(id: string): Promise<StoredProject | null> {
  if (shouldUseCloud()) {
    return await getProjectFromCloud(id);
  } else {
    return getProjectFromLocal(id);
  }
}

// Save or update project
export async function saveProject(project: Omit<StoredProject, "createdAt" | "updatedAt">): Promise<StoredProject> {
  if (shouldUseCloud()) {
    return await saveProjectToCloud(project);
  } else {
    return saveProjectToLocal(project);
  }
}

// Delete project
export async function deleteProject(id: string): Promise<boolean> {
  if (shouldUseCloud()) {
    return await deleteProjectFromCloud(id);
  } else {
    return deleteProjectFromLocal(id);
  }
}

// Clear all projects
export function clearAllProjects(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ============ 用户管理函数 ============

// 设置用户类型（游客/登录用户）
export function setUserType(type: 'guest' | 'user', userId?: string): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(USER_TYPE_KEY, type);
  if (type === 'user' && userId) {
    localStorage.setItem(USER_ID_KEY, userId);
  } else if (type === 'guest') {
    localStorage.removeItem(USER_ID_KEY);
  }
}

// 获取用户类型
export function getUserType(): 'guest' | 'user' {
  if (typeof window === "undefined") return 'guest';
  return (localStorage.getItem(USER_TYPE_KEY) as 'guest' | 'user') || 'guest';
}

// 获取用户ID
export function getUserId(): string | null {
  return getCurrentUserId();
}

// 迁移本地数据到云端（登录后使用）
export async function migrateLocalToCloud(): Promise<void> {
  const localProjects = getAllProjectsFromLocal();
  
  if (localProjects.length === 0) return;
  
  console.log(`Migrating ${localProjects.length} projects to cloud...`);
  
  try {
    for (const project of localProjects) {
      await saveProjectToCloud(project);
    }
    
    console.log('Migration completed successfully');
    // 清除本地数据
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to migrate projects:', error);
    throw error;
  }
}