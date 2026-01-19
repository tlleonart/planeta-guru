import type { FC, HTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/modules/shared/lib/utils";
import { Button } from "./button";

interface LinkButtonProps extends HTMLAttributes<HTMLButtonElement> {
  href: string;
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
}

export const LinkButton: FC<LinkButtonProps> = ({
  children,
  className,
  href,
  size = "default",
  ...props
}) => {
  return (
    <Button {...props} size={size} className={cn(className)}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};
