import type { FC, ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/modules/shared/components/ui/dialog";
import { cn } from "@/modules/shared/lib/utils";

interface BaseModalProps {
    children: ReactNode
    title?: string
    description?: string
    full?: boolean
    onClose: () => void
}

export const BaseModal: FC<BaseModalProps> = ({
    children,
    title,
    description,
    full,
    onClose
}) => {
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                className={cn(
                    "w-full md:w-fit sm:max-w-lg md:max-w-[55%] border-none overflow-y-auto hidden-scrollbar max-h-[85vh] p-5 md:p-10 text-black rounded-none",
                    full && "md:w-full"
                )}
            >
                <DialogHeader className="w-full flex flex-col text-center p-4">
                    <DialogTitle className="w-full text-center text-xl">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="w-full text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}