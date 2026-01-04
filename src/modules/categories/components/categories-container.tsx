import { FC, ReactNode } from "react";

interface CategoriesContainerProps {
    children: ReactNode
}

export const CategoriesContainer: FC<CategoriesContainerProps> = ({ children }) => {
    return (
        <div className="relative h-full md:pt-16">
            <div className="overflow-hidden h-full" >
                <div className="h-full flex">
                    <div
                        className="flex-[0_0_100%] h-full relative"
                    >
                        <div className="flex flex-col md:block">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}