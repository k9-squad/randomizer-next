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
import { LogIn, User, X, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGuestLogin = () => {
    // 设置游客状态
    localStorage.setItem("userType", "guest");
    localStorage.setItem("userName", "游客");
    router.push("/dashboard");
    router.refresh();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 首先检查邮箱验证状态（为了提供更好的错误提示）
      // 注意：NextAuth的authorize函数仍会再次验证凭据以确保安全性
      const checkResponse = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        let errorMessage = "登录失败，请稍后重试";
        
        if (checkData.error === "email_not_verified") {
          errorMessage = "该邮箱未经过验证，点击邮件链接激活账号后重试";
        } else if (checkData.error === "invalid_credentials") {
          errorMessage = "邮箱或密码错误";
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      // 邮箱已验证，进行正常登录
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("邮箱或密码错误");
        toast.error("邮箱或密码错误");
      } else {
        // 设置用户状态
        localStorage.setItem("userType", "user");
        toast.success("登录成功");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("登录失败，请稍后重试");
      toast.error("登录失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Google登录失败");
      setIsLoading(false);
    }
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
              登录
            </CardTitle>
            <CardDescription className="text-center">
              登录你的账号以同步和分享你的项目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {error && (
                <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/30 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  邮箱
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  密码
                </label>
                <Input
                  type="password"
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    登录中...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-1.5 h-4 w-4" />
                    登录
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

              {/* Google登录 - 暂时隐藏 */}
              {/* <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                使用Google登录
              </Button> */}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                <User className="mr-1.5 h-4 w-4" />
                以游客身份浏览
              </Button>

              <div className="text-center text-sm">
                还没有账号？{" "}
                <Link href="/register" className="text-primary hover:underline">
                  立即注册
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
