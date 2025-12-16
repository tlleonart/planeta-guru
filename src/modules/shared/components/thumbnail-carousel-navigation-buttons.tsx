import { FC } from "react"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ThumbnailCarouselNavigationButtonsProps {
    prevBtnEnabled: boolean
    nextBtnEnabled: boolean
    scrollPrev: () => void
    scrollNext: () => void
    classRight?: string
    classLeft?: string;
}

export const ThumbnailCarouselNavigationButtons: FC<ThumbnailCarouselNavigationButtonsProps> = ({
    prevBtnEnabled,
    nextBtnEnabled,
    scrollPrev,
    scrollNext,
    classRight,
    classLeft
}) => {
    return (
        <>
            <Button
                className={`hidden ${
                    prevBtnEnabled 
                        ? "md:block md:absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-1 sm:p-2 rounded-full ml-1 sm:ml-3 md:ml-6 lg:ml-10 cursor-pointer z-10"
                        : "md:hidden"
                } ${classLeft || ""}`}
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </Button>
            <Button
                className={`hidden ${
                    nextBtnEnabled
                        ? "md:block md:absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-1 sm:p-2 rounded-full mr-1 sm:mr-3 md:mr-6 lg:mr-10 cursor-pointer z-10"
                        : "md:hidden"
                } ${classRight || ""}`}
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                aria-label="Next slide"
            >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </Button>
        </>
    )
};