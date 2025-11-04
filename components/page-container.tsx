import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "4xl" | "6xl" | "7xl";
}

export function PageContainer({
  children,
  className,
  maxWidth = "6xl",
}: PageContainerProps) {
  const maxWidthClass = {
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  }[maxWidth];

  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className={cn("w-full flex flex-col gap-8", maxWidthClass, className)}>
        {children}
      </div>
    </div>
  );
}
