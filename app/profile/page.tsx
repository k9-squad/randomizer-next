"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Mail, User as UserIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState("随机器用户");
  const [email, setEmail] = useState("user@example.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const type = localStorage.getItem("userType");
      setUserType(type);
      setUserName(localStorage.getItem("userName") || "随机器用户");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    router.push("/dashboard");
    window.location.reload();
  };

  const isGuest = userType === "guest";
  const isLoggedIn = userType === "user";

  if (!userType) {
    return (
      <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
        <div className="w-full max-w-2xl flex flex-col items-center gap-6 py-12">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">欢迎来到随机器</h1>
            <p className="text-muted-foreground">
              登录后即可创建和管理你的随机器项目
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button size="lg">登录</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                注册
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isGuest ? "游客模式" : "个人设置"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isGuest
              ? "你正在以游客身份使用，登录后可以保存和同步数据"
              : "管理你的账户信息和偏好"}
          </p>
        </div>

        {/* Guest Notice */}
        {isGuest && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm">
                  游客模式下，你的项目只会保存在本地浏览器中。登录账户后可以在多设备间同步数据并与社区分享。
                </p>
                <Link href="/login">
                  <Button className="w-full sm:w-auto">登录或注册账户</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Avatar Card - Only for logged in users */}
        {isLoggedIn && (
          <Card>
            <CardHeader>
              <CardTitle>头像</CardTitle>
              <CardDescription>点击头像上传新的头像图片</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-muted">
                  <AvatarFallback className="text-2xl">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  上传头像
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  推荐尺寸：512x512px，最大 2MB
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Info Card - Only for logged in users */}
        {isLoggedIn && (
          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
              <CardDescription>更新你的个人资料</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  昵称
                </label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="输入你的昵称"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  邮箱
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入你的邮箱"
                />
              </div>
              <Button className="w-full sm:w-auto">保存更改</Button>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>账户操作</CardTitle>
            <CardDescription>
              {isGuest ? "退出游客模式" : "管理你的账户"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              {isGuest ? "退出游客模式" : "退出登录"}
            </Button>
            {isLoggedIn && (
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                删除账户
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
