"use client"

import { Link } from "@/i18n/navigation"
import type { FC } from "react"
import { Heading } from "./ui/heading"
import { useTranslations } from "next-intl"

interface ThumbnailCarouselWatchMoreProps {
    href: string
}

export const ThumbnailCarouselWatchMore: FC<ThumbnailCarouselWatchMoreProps> = ({ href }) => {
    const t = useTranslations("WatchMoreCard")

    return (
    <div className="flex-[0_0_47%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_25%] xl:flex-[0_0_22%] min-w-0 px-2 sm:px-3 md:px-4 relative cursor-pointer hover:scale-105 transition-all">
      <div className="relative aspect-[3/2] md:aspect-[2/1] bg-white/20 flex justify-center items-center text-white rounded-none">
        <Link href={href}>
            <div className="w-full h-full flex items-center justify-center">
                <Heading className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                    {t("watch")}
                </Heading>
            </div>
        </Link>
      </div>
    </div>
    )
}   