"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("缺少验证token");
      return;
    }

    // 调用验证API
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
          setUserInfo({
            name: data.user.name,
            email: data.user.email,
          });

          // 3秒后自动跳转到登录页
          setTimeout(() => {
            router.push("/login?verified=true");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "验证失败");
        }
      } catch (error) {
        setStatus("error");
        setMessage("验证失败，请稍后重试");
        console.error("Verification error:", error);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12 px-4 md:px-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            {status === "loading" && (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
                <CardTitle className="text-2xl">验证中...</CardTitle>
                <CardDescription>请稍候，正在验证你的邮箱</CardDescription>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-green-600">
                  验证成功！
                </CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex justify-center mb-4">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <CardTitle className="text-2xl text-red-600">
                  验证失败
                </CardTitle>
                <CardDescription className="text-red-500">
                  {message}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {status === "success" && userInfo && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    欢迎加入 Randomizer！
                  </p>
                  <p className="font-medium">{userInfo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {userInfo.email}
                  </p>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  3秒后自动跳转到登录页...
                </p>

                <div className="flex gap-2">
                  <Link href="/login" className="flex-1">
                    <Button className="w-full">立即登录</Button>
                  </Link>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      返回首页
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">可能的原因：</p>
                  <ul className="text-sm text-left mt-2 space-y-1">
                    <li>• 验证链接已过期（24小时有效期）</li>
                    <li>• 验证链接已被使用</li>
                    <li>• 验证链接无效</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Link href="/register" className="flex-1">
                    <Button variant="outline" className="w-full">
                      重新注册
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      返回首页
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {status === "loading" && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  这可能需要几秒钟时间...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
