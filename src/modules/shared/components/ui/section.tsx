import type { FC, HTMLAttributes } from "react";
import { cn } from "@/modules/shared/lib/utils";

export const Section: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <section className={cn("", className)} {...props}>
      {children}
    </section>
  );
};
