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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Mail,
  User as UserIcon,
  LogOut,
  Lock,
  AtSign,
  Shield,
  Settings,
  ChevronDown,
  AlertTriangle,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const type = localStorage.getItem("userType");
      setUserType(type);
      // 优先使用session中的数据
      if (session?.user) {
        setUserName(session.user.name || "");
      } else {
        setUserName(localStorage.getItem("userName") || "");
      }
    }
  }, [session?.user?.name]);

  const handleLogout = async () => {
    const confirmMessage = isGuest
      ? "确定要退出游客模式吗？本地保存的数据将会保留，但下次需要重新登录。"
      : "确定要退出登录吗？";

    if (window.confirm(confirmMessage)) {
      localStorage.removeItem("userType");
      localStorage.removeItem("userName");

      if (session) {
        await signOut({ redirect: false });
      }

      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "确定要删除账户吗？此操作无法撤销，所有数据将被永久删除！\n\n请输入你的密码以确认。"
      )
    ) {
      // TODO: 实现真实的删除账户API调用
      localStorage.removeItem("userType");
      localStorage.removeItem("userName");

      if (session) {
        await signOut({ redirect: false });
      }

      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleSaveProfile = async () => {
    // TODO: 实现更新用户信息的API调用
    toast.success("个人信息已保存！");
  };

  const isGuest = userType === "guest";
  const isLoggedIn = session?.user || userType === "user";

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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                立即登录
              </CardTitle>
              <CardDescription>
                解锁完整功能，保存和同步你的创作
              </CardDescription>
            </CardHeader>
            <CardContent>
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

        {/* User Profile Card - Only for logged in users */}
        {isLoggedIn && session?.user && (
          <Card>
            <CardHeader>
              <CardTitle>个人资料</CardTitle>
              <CardDescription>你的账户信息和头像</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-muted">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="text-2xl">
                      {(session.user.name || session.user.email)
                        ?.charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div>
                  <Button variant="outline" size="sm" disabled>
                    上传头像
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    推荐尺寸：512x512px，最大 2MB
                  </p>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* User Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    昵称
                  </label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="输入你的昵称"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    邮箱
                  </label>
                  <Input
                    type="email"
                    value={session.user.email || ""}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    邮箱地址无法更改
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    用户 UID
                  </label>
                  <Input
                    value={session.user.uid || ""}
                    disabled
                    className="bg-muted cursor-not-allowed font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    你的唯一标识符，用于分享和识别
                  </p>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="w-full sm:w-auto"
                >
                  保存更改
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              账户管理
            </CardTitle>
            <CardDescription>
              {isGuest ? "退出游客模式" : "登出或删除账户"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isGuest ? "退出游客模式" : "退出登录"}
            </Button>

            {isLoggedIn && session?.user && (
              <>
                <div className="h-px bg-border my-4" />

                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-destructive mb-1">
                        危险操作
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        删除账户将永久删除你的所有数据，包括项目、收藏等，此操作无法撤销。
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={handleDeleteAccount}
                  >
                    删除我的账户
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
