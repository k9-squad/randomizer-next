"use client";

import { useState } from "react";
import {
  getAllProjects,
  saveProject,
  getProject,
  deleteProject,
  setUserType,
  getUserType,
  migrateLocalToCloud,
} from "@/lib/storage";
import { StoredProject } from "@/lib/storage";

export default function TestStoragePage() {
  const [results, setResults] = useState<string>("点击按钮开始测试...");
  const [userType, setUserTypeState] = useState<string>("guest");

  const log = (message: string) => {
    setResults((prev) => prev + "\n" + message);
    console.log(message);
  };

  const clearLog = () => {
    setResults("");
  };

  const testGuestMode = async () => {
    clearLog();
    log("=== 测试游客模式 ===");
    setUserType("guest");
    setUserTypeState("guest");

    const testProject: Omit<StoredProject, "createdAt" | "updatedAt"> = {
      id: crypto.randomUUID(),
      name: "游客测试项目",
      config: {
        mode: "lottery",
        speed: 50,
        poolType: "shared",
        drawMode: "unlimited",
        allowDuplicates: true,
        sharedPool: ["选项A", "选项B", "选项C"],
        rotators: [],
      },
      isOwner: true,
    };

    try {
      await saveProject(testProject);
      log("✅ 游客项目已保存到 localStorage");

      const projects = await getAllProjects();
      log(`📦 获取到 ${projects.length} 个项目`);
      projects.forEach((p) => log(`  - ${p.name} (ID: ${p.id})`));
    } catch (error) {
      log("❌ 错误: " + (error as Error).message);
    }
  };

  const testUserMode = async () => {
    clearLog();
    log("=== 测试登录模式 ===");
    log("⚠️ 需要真实登录才能测试用户模式");
    setUserType("user");
    setUserTypeState("user");

    const testProject: Omit<StoredProject, "createdAt" | "updatedAt"> = {
      id: crypto.randomUUID(),
      name: "云端测试项目",
      config: {
        mode: "lottery",
        speed: 100,
        poolType: "shared",
        drawMode: "unlimited",
        allowDuplicates: false,
        sharedPool: ["选项X", "选项Y", "选项Z"],
        rotators: [],
      },
      isOwner: true,
      tags: ["测试", "云端"],
    };

    try {
      const saved = await saveProject(testProject);
      log("✅ 云端项目已保存到数据库");
      log(`   项目ID: ${saved.id}`);

      const projects = await getAllProjects();
      log(`☁️ 获取到 ${projects.length} 个云端项目`);
      projects.forEach((p) => log(`  - ${p.name} (ID: ${p.id})`));
    } catch (error) {
      log("❌ 错误: " + (error as Error).message);
      console.error(error);
    }
  };

  const testGetAllProjects = async () => {
    clearLog();
    log("=== 测试获取所有项目 ===");
    log(`当前模式: ${getUserType()}`);

    try {
      const projects = await getAllProjects();
      log(`📋 共有 ${projects.length} 个项目`);

      if (projects.length === 0) {
        log("⚠️ 没有找到任何项目");
      } else {
        projects.forEach((p, index) => {
          log(`\n项目 ${index + 1}:`);
          log(`  名称: ${p.name}`);
          log(`  ID: ${p.id}`);
          log(`  创建时间: ${p.createdAt}`);
          log(`  标签: ${p.tags?.join(", ") || "无"}`);
        });
      }
    } catch (error) {
      log("❌ 错误: " + (error as Error).message);
    }
  };

  const testMigration = async () => {
    clearLog();
    log("=== 测试数据迁移 ===");

    try {
      // 先切换到游客模式创建测试数据
      setUserType("guest");
      log("1. 切换到游客模式");

      const guestProject: Omit<StoredProject, "createdAt" | "updatedAt"> = {
        id: crypto.randomUUID(),
        name: "待迁移的游客项目",
        config: {
          mode: "lottery",
          speed: 75,
          poolType: "shared",
          drawMode: "unlimited",
          allowDuplicates: true,
          sharedPool: ["迁移1", "迁移2"],
          rotators: [],
        },
        isOwner: true,
      };

      await saveProject(guestProject);
      log("2. 创建游客项目");

      // 切换到登录模式并迁移
      log("⚠️ 需要真实登录才能测试迁移功能");
      setUserType("user");
      setUserTypeState("user");
      log("3. 切换到登录模式");

      await migrateLocalToCloud();
      log("✅ 本地数据已迁移到云端");

      const projects = await getAllProjects();
      log(`4. 迁移后共有 ${projects.length} 个云端项目`);
    } catch (error) {
      log("❌ 迁移失败: " + (error as Error).message);
      console.error(error);
    }
  };

  const clearAllData = () => {
    if (confirm("确定要清空所有数据吗？这将删除 localStorage 中的所有项目。")) {
      localStorage.clear();
      setResults("");
      log("🗑️ 所有本地数据已清空");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">存储系统测试</h1>
        <p className="text-muted-foreground mb-6">
          测试游客模式和登录模式的数据存储
        </p>

        <div className="mb-6 p-4 bg-secondary rounded-lg">
          <p className="font-semibold text-lg">
            当前模式:{" "}
            <span className="text-primary">
              {userType === "guest" ? "🎮 游客模式" : "☁️ 登录模式"}
            </span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {userType === "guest"
              ? "数据保存在浏览器本地 (localStorage)"
              : "数据保存在云端数据库 (Neon)"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={testGuestMode}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            🎮 测试游客模式
          </button>

          <button
            onClick={testUserMode}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
          >
            ☁️ 测试登录模式
          </button>

          <button
            onClick={testGetAllProjects}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold"
          >
            📋 获取所有项目
          </button>

          <button
            onClick={testMigration}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            🔄 测试数据迁移
          </button>

          <button
            onClick={() => setResults("点击按钮开始测试...")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            🧹 清空日志
          </button>

          <button
            onClick={clearAllData}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            🗑️ 清空所有数据
          </button>
        </div>

        <div className="bg-black text-green-400 p-6 rounded-lg font-mono text-sm overflow-auto max-h-[500px]">
          <pre className="whitespace-pre-wrap">{results}</pre>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="font-semibold mb-2">💡 使用说明</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              • <strong>游客模式</strong>: 数据保存在浏览器
              localStorage，关闭页面不丢失，但换设备会丢失
            </li>
            <li>
              • <strong>登录模式</strong>: 数据保存在云端数据库，可以跨设备同步
            </li>
            <li>
              • <strong>数据迁移</strong>:
              将游客模式的本地数据上传到云端（登录后自动触发）
            </li>
            <li>
              • <strong>当前实现</strong>: 登录模式使用测试用户 ID
              (test-user-123)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
