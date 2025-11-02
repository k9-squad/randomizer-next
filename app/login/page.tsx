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
import { LogIn, UserPlus, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const handleGuestLogin = () => {
    // 设置游客状态
    localStorage.setItem("userType", "guest");
    localStorage.removeItem("userName");
    router.push("/dashboard");
  };

  const handleLogin = () => {
    // 模拟登录
    localStorage.setItem("userType", "user");
    localStorage.setItem("userName", "用户名");
    router.push("/dashboard");
  };

  const handleRegister = () => {
    // 模拟注册
    localStorage.setItem("userType", "user");
    localStorage.setItem("userName", "新用户");
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12 px-4 md:px-6">
      <div className="w-full max-w-md">
        <Card className="relative">
          <Link href="/dashboard" className="absolute top-4 right-4 z-10">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </Link>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? "登录" : "注册"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? "登录你的账号以同步和分享你的项目"
                : "创建一个账号以保存你的创作"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">用户名</label>
                <Input placeholder="输入用户名" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">邮箱</label>
              <Input type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">密码</label>
              <Input type="password" placeholder="输入密码" />
            </div>

            <Button
              className="w-full"
              onClick={isLogin ? handleLogin : handleRegister}
            >
              {isLogin ? (
                <>
                  <LogIn className="mr-1.5 h-4 w-4" />
                  登录
                </>
              ) : (
                <>
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  注册
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGuestLogin}
            >
              <User className="mr-1.5 h-4 w-4" />
              以游客身份登录
            </Button>

            <div className="text-center text-sm">
              {isLogin ? (
                <>
                  还没有账号？{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary hover:underline"
                  >
                    立即注册
                  </button>
                </>
              ) : (
                <>
                  已有账号？{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:underline"
                  >
                    立即登录
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
