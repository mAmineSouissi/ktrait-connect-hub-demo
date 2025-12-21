import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface UseSheetOptions {
  children: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  onToggle?: () => void;
  side?: "top" | "bottom" | "left" | "right";
}

interface UseSheetReturn {
  SheetFragment: React.ReactNode;
  openSheet: () => void;
  closeSheet: () => void;
  isOpen: boolean;
}

export function useSheet({
  children,
  className = "",
  title,
  description,
  onToggle,
  side = "right",
}: UseSheetOptions): UseSheetReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const openSheet = (): void => setIsOpen(true);
  const closeSheet = (): void => setIsOpen(false);
  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onToggle?.();
    }
  };

  const SheetFragment = (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : side}
        className={cn(
          "flex flex-col overflow-y-auto",
          isMobile ? "max-h-[90vh]" : "min-w-[50vw]",
          className
        )}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );

  return { SheetFragment, openSheet, closeSheet, isOpen };
}
