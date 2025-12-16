import type { FC } from "react";
import type { Product } from "../types/product-types";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Paragraph } from "./ui/paragraph";

interface ThumbnailCarouselCardProps {
    product: Product
}

export const ThumbnailCarouselCard: FC<ThumbnailCarouselCardProps> = ({ product }) => {
    const { media, name } = product

    const desktopImage = media.find((media) => media.url.toLowerCase().includes("desktop"))?.url ?? media[0].url ?? "/placeholder.svg"
    const mobileImage = media.find((media) => media.url.toLowerCase().includes("mobile"))?.url ?? media[0].url ?? "/placeholder.svg"

    return (
        <div
                className="flex-[0_0_47%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_25%] xl:flex-[0_0_22%] min-w-0 px-2 sm:px-3 md:px-4 relative cursor-pointer hover:scale-105 transition-all rounded-md"
            >
            <Link href={`/products/${product.productType.name.toLowerCase().replace(" ", "-")}/${product.slug}`}>
                <div className="relative aspect-[3/2] md:aspect-[2/1] overflow-hidden">
                    <picture>
                        <source media="(max-width: 767px)" srcSet={mobileImage} />
                        <source media="(min-width: 768px)" srcSet={desktopImage} />
                        <Image
                            src={desktopImage}
                            alt={`${name} thumbnail`}
                            sizes="100vw"
                            fill
                            className="relative object-cover"
                        />
                    </picture>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 w-full p-2 sm:p-3 md:p-4 text-center text-white">
                        <Paragraph className="text-xs sm:text-sm md:text-base font-medium truncate">
                            {name}
                        </Paragraph>
                    </div>
                </div>
            </Link>
            </div>
    );
}