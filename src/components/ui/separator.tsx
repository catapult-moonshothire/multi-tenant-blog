"use client";

import { cn } from "@/lib/utils";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

type SeparatorProps = {
  /**
   * @default ""
   */
  label?: React.ReactNode;
  /**
   * @default false
   */
  gradient?: boolean;
  className?: string;
};

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> &
    SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      label,
      gradient = false,
      ...props
    },
    ref
  ) => {
    if (label) {
      return (
        <div className="flex items-center w-full">
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
              "shrink-0",
              orientation === "horizontal"
                ? "h-[1px] w-full"
                : "h-full w-[1px]",
              gradient
                ? "bg-gradient-to-r from-transparent dark:from-zinc-800 dark:to-zinc-400 to-zinc-500"
                : "bg-zinc-300 dark:bg-zinc-800",
              className
            )}
            {...props}
          />
          <div className="text-gray-600 uppercase w-fit dark:text-gray-300 text-nowrap">
            {label}
          </div>
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
              "shrink-0",
              orientation === "horizontal"
                ? "h-[1px] w-full"
                : "h-full w-[1px]",
              gradient
                ? "bg-gradient-to-r from-zinc-500 dark:from-zinc-200 to-transparent dark:to-zinc-700"
                : "bg-zinc-300 dark:bg-zinc-800",
              className
            )}
            {...props}
          />
        </div>
      );
    }
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          gradient
            ? "bg-gradient-to-r from-transparent via-zinc-500 dark:via-zinc-200 to-transparent dark:from-zinc-800 dark:to-zinc-700"
            : "bg-zinc-300 dark:bg-zinc-800",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
