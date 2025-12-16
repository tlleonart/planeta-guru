import { FC, HTMLAttributes } from "react";
import { cn } from "@/modules/shared/lib/utils";

export const Paragraph: FC<HTMLAttributes<HTMLParagraphElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <p className={cn("", className)} {...props}>
            {children}
        </p>
    )
}