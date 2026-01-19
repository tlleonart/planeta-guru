import type { FC } from "react";
import type { Product } from "../types/product-types";
import { ThumbnailCarouselCard } from "./thumbnail-carousel-card";

interface ThumbnailGridProps {
  products: Product[];
}

export const ThumbnailGrid: FC<ThumbnailGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:flex md:flex-row justify-between lg:justify-start md:flex-wrap gap-x-1 gap-y-4 lg:gap-x-0 lg:gap-y-10 px-2 lg:px-4 py-4 w-full ">
      {products.map((product) => (
        <ThumbnailCarouselCard product={product} key={product.id} />
      ))}
    </div>
  );
};
