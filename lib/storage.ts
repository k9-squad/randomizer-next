import { Project, ProjectConfig } from "@/types/project";

const STORAGE_KEY = "randomizer_projects";

export interface StoredProject {
  id: string;
  name: string;
  config: ProjectConfig;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean; // true表示自己创建的，false表示复制或官方模板
  isTemplate?: boolean; // true表示官方模板
  // 外观设置
  themeColor?: string;
  iconType?: "lucide" | "image";
  iconName?: string; // lucide图标名称
  iconUrl?: string; // 自定义图片URL
  // 发布设置
  isPublished?: boolean;
}

// Get all projects
export function getAllProjects(): StoredProject[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
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