import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { FC } from "react"

interface AdBannerProps {
    mobileUrl?: string
    desktopUrl?: string
}

export const AdBanner: FC<AdBannerProps> = ({ mobileUrl, desktopUrl }) => {
        return (
        <div 
            className="w-full h-full absolute cursor-pointer"
        >
            <Link href={"/categories"}>
            <picture>
                <source media="(max-width: 767px)" srcSet={mobileUrl} />
                <source media="(min-width: 768px)" srcSet={desktopUrl} />
                <Image
                    alt="Ad Banner"
                    src={desktopUrl ?? "/placeholder.svg"}
                    fill
                    style={{ objectFit: "cover" }}
                    className="relative overflow-hidden"
                />
            </picture>
            </Link>
        </div>
    );
}