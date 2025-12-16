import { FC, HTMLAttributes } from "react";
import { cn } from "@/modules/shared/lib/utils";

export const Span: FC<HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => {
    return <span className={cn("", className)} {...props} />
}