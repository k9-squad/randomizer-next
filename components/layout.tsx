"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Compass,
  PlusCircle,
  User,
  Search,
  LogOut,
  Settings,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchValue, setSearchValue] = useState("");

  const handleLogout = async () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    await signOut({ redirect: false });
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/98 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center justify-between px-4 md:px-6 gap-4">
        {/* Left side - Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            R
          </div>
          <span className="hidden md:inline-block font-semibold">
            Randomizer
          </span>
        </Link>

        {/* Center - Mobile Search OR Desktop Navigation */}
        <div className="flex-1 flex items-center justify-center md:justify-start">
          {/* Mobile Search - Center */}
          <div className="relative w-full max-w-sm md:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索项目、标签、创作者..."
              className="pl-9 h-9"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                size="sm"
              >
                <Home className="mr-1.5 h-4 w-4" />
                主页
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                variant={
                  pathname?.startsWith("/explore") ? "secondary" : "ghost"
                }
                size="sm"
              >
                <Compass className="mr-1.5 h-4 w-4" />
                探索
              </Button>
            </Link>
            <Link href="/new">
              <Button
                variant={pathname === "/new" ? "secondary" : "ghost"}
                size="sm"
              >
                <PlusCircle className="mr-1.5 h-4 w-4" />
                新建
              </Button>
            </Link>
          </nav>
        </div>

        {/* Right side - Desktop Search, Theme, Auth */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Desktop Search */}
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索项目、标签、创作者..."
              className="pl-9 h-9"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <div className="hidden md:block">
            <ModeToggle />
          </div>

          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || ""}
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase() ||
                        session.user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name || "用户"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                    {session.user.uid && (
                      <p className="text-xs leading-none text-muted-foreground font-mono">
                        UID: {session.user.uid}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    个人中心
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/my-projects"
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    我的项目
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm">登录</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

// Mobile Bottom Navigation
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-around px-4">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center justify-center flex-1 py-2",
            pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-6 w-6" />
        </Link>
        <Link
          href="/explore"
          className={cn(
            "flex items-center justify-center flex-1 py-2",
            pathname?.startsWith("/explore")
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Compass className="h-6 w-6" />
        </Link>
        <Link
          href="/new"
          className={cn(
            "flex items-center justify-center flex-1 py-2",
            pathname === "/new" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <PlusCircle className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
}
