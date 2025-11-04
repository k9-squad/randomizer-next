"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackHeaderProps {
  title: string;
  description?: string;
}

export function BackHeader({ title, description }: BackHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => router.back()}
          className="flex-shrink-0 -ml-1 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="h-9 w-9 md:h-10 md:w-10" strokeWidth={2} />
        </button>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {title}
        </h1>
      </div>
      {description && (
        <p className="text-muted-foreground ml-8 md:ml-9">{description}</p>
      )}
    </div>
  );
}
