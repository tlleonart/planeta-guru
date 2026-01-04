import Image from "next/image";
import type { FC } from "react";
import type { FeaturedProduct } from "@/modules/shared/types/product-types";
import { MainCarouselSlideCard } from "./main-carousel-slide-card";

interface MainCarouselSlideProps {
    product: FeaturedProduct
}

export const MainCarouselSlide: FC<MainCarouselSlideProps> = ({ product }) => {
    const {
        id,
        product: {
            media,
            name,
            descriptions,
            slug,
            productType
        }
    } = product

    const desktopImage = media.find((media) => media.url.toLowerCase().includes("desktop"))?.url ?? "/placeholder.svg"
    const mobileImage = media.find((media) => media.url.toLowerCase().includes("mobile"))?.url ?? "/placeholder.svg"

    return (
        <div
            key={product.id}
            className="embla__slide flex-[0_0_100%] h-full relative"
        >
            <div className="flex flex-col md:block">
                <div className="relative aspect-square md:aspect-auto md:absolute md:inset-0 overflow-hidden rounded-none">
                    <picture>
                        <source media="(max-width: 767px)" srcSet={mobileImage} />
                        <source media="(min-width: 768px)" srcSet={desktopImage} />
                        <Image
                            src={desktopImage}
                            alt={name}
                            fill
                            className="relative object-cover object-center md:object-top w-full"
                            {...(id === 0 ? { priority: true } : {})}
                        />
                    </picture>
                </div>
                <MainCarouselSlideCard
                    name={name}
                    description={descriptions && descriptions?.length > 0 ? descriptions[0].text : ""}
                    slug={slug}
                    type={productType.name
                        .toLocaleLowerCase()
                        .replace(" ", "-")}
                />
            </div>
        </div>
    )
}