"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Folder, Star, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HorizontalScroll } from "@/components/horizontal-scroll";

export default function DashboardPage() {
  // 模拟登录状态，实际使用时替换为真实的认证状态
  const [isLoggedIn] = useState(false);
  const [userName] = useState("用户");

  // 获取问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "早上好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* Welcome Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {isLoggedIn ? `${getGreeting()}，${userName}` : "你好，游客"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isLoggedIn
                  ? "欢迎回来，继续你的创作之旅"
                  : "登录后开始创建你的随机器项目"}
              </p>
            </div>
            {!isLoggedIn && (
              <Link href="/login">
                <Button>登录 / 注册</Button>
              </Link>
            )}
          </div>
        </div>

        {/* My Projects Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">我的项目</h2>
            <Link href="/editor/new">
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                新建项目
              </Button>
            </Link>
          </div>

          {/* Projects Horizontal Scroll */}
          <div className="relative">
            <HorizontalScroll className="flex gap-4 pb-4">
              {[1, 2, 3, 4].map((i) => (
                <Link key={i} href={`/app/${i}`} className="flex-shrink-0">
                  <Card className="w-[280px] md:w-[320px] hover:shadow-lg transition-all cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Folder className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            我的项目 {i}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            简单随机器
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          10 个项目 · 最后编辑于{" "}
                          {new Date().toLocaleDateString("zh-CN")}
                        </p>
                        <div className="flex gap-2">
                          <div className="px-2 py-1 bg-secondary rounded text-xs">
                            随机选择
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {/* Add New Card */}
              <Link href="/editor/new" className="flex-shrink-0">
                <Card className="w-[280px] md:w-[320px] hover:shadow-lg transition-all cursor-pointer border-dashed">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <PlusCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">创建新项目</CardTitle>
                        <CardDescription className="text-xs">
                          从模板或空白开始
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        选择模板快速开始创作
                      </p>
                      <div className="flex gap-2">
                        <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          立即创建
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </HorizontalScroll>
          </div>
        </div>

        {/* Official Templates Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">官方模板</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "简单随机器", desc: "从列表中随机选择项目", icon: "🎲" },
              { name: "团队分组", desc: "自动创建随机团队", icon: "👥" },
              { name: "数字生成器", desc: "生成随机数字", icon: "🔢" },
              { name: "抽奖转盘", desc: "可视化抽奖工具", icon: "🎰" },
              { name: "问题决策器", desc: "帮你做出选择", icon: "❓" },
              { name: "名字生成器", desc: "随机生成名字", icon: "📝" },
            ].map((template, i) => (
              <Link key={i} href="/editor/new">
                <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{template.icon}</div>
                      <div>
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {template.desc}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Community Popular Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">社区热门</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Link key={i} href={`/app/${i}`}>
                <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-xs font-semibold">U{i}</span>
                        </div>
                        <div>
                          <CardTitle className="text-sm">
                            热门项目 {i}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            by 用户{i}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">
                          {100 + i * 10}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      这是一个很有趣的随机器项目，可以帮助你快速做出决策...
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
