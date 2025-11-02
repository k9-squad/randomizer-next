"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, useCallback, useEffect } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({
  children,
  className = "",
}: HorizontalScrollProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (!emblaApi) return;

      // Convert vertical scroll to horizontal with smooth scrolling
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        const scrollAmount = e.deltaY;
        emblaApi.scrollTo(
          emblaApi.selectedScrollSnap() + Math.sign(scrollAmount)
        );
      }
    },
    [emblaApi]
  );

  useEffect(() => {
    const emblaNode = emblaApi?.rootNode();
    if (!emblaNode) return;

    emblaNode.addEventListener("wheel", onWheel, { passive: false });
    return () => emblaNode.removeEventListener("wheel", onWheel);
  }, [emblaApi, onWheel]);

  return (
    <div
      ref={emblaRef}
      className="overflow-x-hidden overflow-y-visible cursor-grab active:cursor-grabbing py-2 -mx-2"
    >
      <div className={className}>{children}</div>
    </div>
  );
}
