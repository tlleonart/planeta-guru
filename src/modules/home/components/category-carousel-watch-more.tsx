import { getTranslations } from "next-intl/server"
import type { FC } from "react"
import { ArrowRight } from "lucide-react"
import { Span } from "@/modules/shared/components/ui/span"
import { Paragraph } from "@/modules/shared/components/ui/paragraph"
import { LinkButton } from "@/modules/shared/components/ui/link-button"

interface CategoryCarouselWatchMoreProps {
    categoryId: number
}

export const CategoryCarouselWatchMore: FC<CategoryCarouselWatchMoreProps> = async ({ categoryId }) => {
    const t = await getTranslations("WatchMoreButton")

    return (
        <LinkButton
            className="flex flex-row justify-center items-center gap-2 pointer-events-none group-hover:pointer-events-auto cursor-pointer mb-2 md:mb-3 opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity ease-in-out duration-150"
            href={`categories/${categoryId}`}
        >
            <ArrowRight/>
            <Span>
                <Paragraph className="hover:underline">{t("watch")}</Paragraph>
            </Span>
        </LinkButton>
    )
}   