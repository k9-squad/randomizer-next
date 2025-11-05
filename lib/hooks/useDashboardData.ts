// Dashboard 数据加载 hooks
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getAllProjects, type StoredProject } from "@/lib/storage";

/**
 * 加载用户项目
 */
export function useMyProjects() {
  const [projects, setProjects] = useState<StoredProject[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const allProjects = await getAllProjects();
      const userProjects = allProjects.filter((p) => p.isOwner !== false);
      userProjects.sort((a, b) => {
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        return timeB - timeA; // 降序：最新的在前
      });
      setProjects(userProjects);
    };

    loadProjects();
  }, []);

  return projects;
}

/**
 * 加载官方模板
 */
export function useOfficialTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/official-templates");
        if (response.ok) {
          const data = await response.json();
          setTemplates(data);
        } else {
          throw new Error("加载官方模板失败");
        }
      } catch (err) {
        console.error("加载官方模板失败:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return { templates, loading, error };
}

/**
 * 加载社区热门项目
 */
export function useCommunityProjects(limit: number = 6) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/community/projects?sort=hot&limit=${limit}`
        );
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          throw new Error("加载社区项目失败");
        }
      } catch (err) {
        console.error("加载社区项目失败:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [limit]);

  return { projects, loading, error };
}

/**
 * 加载用户收藏
 */
export function useFavorites(limit?: number) {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          setFavorites(limit ? data.slice(0, limit) : data);
        } else {
          throw new Error("加载收藏失败");
        }
      } catch (err) {
        console.error("加载收藏失败:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [session?.user?.id, limit]);

  return { favorites, loading, error };
}
