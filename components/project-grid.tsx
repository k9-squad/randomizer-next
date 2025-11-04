import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProjectGrid({ children, columns = 3, className }: ProjectGridProps) {
  const colsClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-4", colsClass, className)}>
      {children}
    </div>
  );
}
