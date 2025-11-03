"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Users, PlusCircle, User, Search } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setUserType(localStorage.getItem("userType"));
  }, []);

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
            <Link href="/community">
              <Button
                variant={pathname === "/community" ? "secondary" : "ghost"}
                size="sm"
              >
                <Users className="mr-1.5 h-4 w-4" />
                社区
              </Button>
            </Link>
            <Link href="/editor/new">
              <Button
                variant={pathname.startsWith("/editor") ? "secondary" : "ghost"}
                size="sm"
              >
                <PlusCircle className="mr-1.5 h-4 w-4" />
                编辑器
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
          {userType ? (
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
                <span className="ml-1.5 hidden lg:inline-block">个人</span>
              </Button>
            </Link>
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
          href="/community"
          className={cn(
            "flex items-center justify-center flex-1 py-2",
            pathname === "/community" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Users className="h-6 w-6" />
        </Link>
        <Link
          href="/editor/new"
          className={cn(
            "flex items-center justify-center flex-1 py-2",
            pathname.startsWith("/editor")
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <PlusCircle className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
}
