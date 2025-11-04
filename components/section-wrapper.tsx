import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  title: string;
  href?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({
  title,
  href,
  action,
  children,
  className,
}: SectionWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        {href ? (
          <Link href={href} className="group w-fit">
            <div className="flex items-center gap-2 cursor-pointer">
              <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                {title}
              </h2>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ) : (
          <h2 className="text-2xl font-semibold">{title}</h2>
        )}
        {action}
      </div>
      {children}
    </div>
  );
}
