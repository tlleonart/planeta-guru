import type { FC, HTMLAttributes } from "react";
import { cn } from "@/modules/shared/lib/utils";

export const Heading: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h1
      className={cn("text-3xl font-bold tracking-tighter", className)}
      {...props}
    >
      {children}
    </h1>
  );
};
