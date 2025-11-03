import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, href, action }: SectionHeaderProps) {
  const titleContent = (
    <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
      {title}
    </h2>
  );

  return (
    <div className="flex items-center justify-between">
      {href ? (
        <Link href={href} className="group w-fit">
          <div className="flex items-center gap-2 cursor-pointer">
            {titleContent}
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      ) : (
        titleContent
      )}
      {action}
    </div>
  );
}
