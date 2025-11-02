"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, PlusCircle, User } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Left side - Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            R
          </div>
          <span className="hidden md:inline-block font-semibold">
            Randomizer
          </span>
        </Link>

        {/* Center - Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              size="sm"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/community">
            <Button
              variant={pathname === "/community" ? "secondary" : "ghost"}
              size="sm"
            >
              <Users className="mr-2 h-4 w-4" />
              Community
            </Button>
          </Link>
          <Link href="/editor/new">
            <Button
              variant={pathname.startsWith("/editor") ? "secondary" : "ghost"}
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Editor
            </Button>
          </Link>
        </nav>

        {/* Right side - Theme, New Project, Auth */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button size="sm" className="hidden md:flex">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            <span className="ml-2 hidden lg:inline-block">Login</span>
          </Button>
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
          <LayoutDashboard className="h-6 w-6" />
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
