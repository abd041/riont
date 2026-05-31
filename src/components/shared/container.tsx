import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
};

/** Max-width marketplace shell — compact horizontal padding. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-content",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
