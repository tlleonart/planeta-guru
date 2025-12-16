import { api } from "@/app/server/server";
import { getTranslations } from "next-intl/server";
import { Suspense, type FC } from "react";
import { Heading } from "@/modules/shared/components/ui/heading";
import { DownloadsGrid } from "../../downloads/components/downloads-grid";

export const FavoritesWrapper: FC = async () => {
    const favorites = await api.product.getFavorites()
    const t = await getTranslations("FavoritesWrapper")

    const products = favorites.items.map((favorite) => favorite.product);

    if (!favorites) {
        return <h1>Parece que aún no has marcado ningún juego como favorito!</h1>;
    }

    // TODO: Pasar downloadsgrid y container a shared entre componentes de profile.
    
    return (
        <Suspense fallback={<div />}>
            <div className="relative h-full md:pt-16">
                <div className="overflow-hidden h-full" >
                    <div className="h-full flex">
                        <div
                            className="flex-[0_0_100%] h-full relative"
                        >
                            <div className="flex flex-col md:block">
                                <Heading className="text-lg sm:text-xl md:text-3xl font-semibold mb-0 md:mb-4 px-4 md:px-10">{t("title")}</Heading>
                                <DownloadsGrid products={products} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}