import { type FC, Suspense } from "react";
import { api } from "@/app/server/server";
import { ThumbnailGrid } from "@/modules/shared/components/thumbnail-grid";
import type { Product } from "@/modules/shared/types/product-types";
import { CategoriesContainer } from "../../components/categories-container";

interface CategoryByIdWrapperProps {
  id: string;
}

const CategoryByIdSkeleton = () => {
  const skeletons = Array(10).fill("");

  return (
    <div className="relative h-full px-3 md:pt-24">
      <div className="flex align-middle pl-2 sm:pl-3 md:pl-4 py-2">
        <div className="grid grid-cols-2 md:flex md:flex-row justify-between lg:justify-start md:flex-wrap gap-x-1 gap-y-4 lg:gap-x-10 lg:gap-y-10 px-4 py-4 w-full ">
          {skeletons.map((_skeleton, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items that won't reorder
              key={index}
              className="w-64 h-36 px-2 sm:px-3 md:px-4 relative bg-gray-300/20 rounded-none "
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Fetches all products from a category by paginating through all pages
 */
async function fetchAllCategoryProducts(
  categoryId: number,
): Promise<Product[]> {
  const allProducts: Product[] = [];
  let currentPage = 1;
  const perPage = 100;
  let hasMorePages = true;

  while (hasMorePages) {
    const response = await api.product.getByCategory({
      categoryId,
      page: currentPage,
      perPage,
    });

    allProducts.push(...response.items);

    // Check if there are more pages
    const { pagination } = response;
    hasMorePages = pagination.currentPage < pagination.lastPage;
    currentPage++;

    // Safety limit to prevent infinite loops
    if (currentPage > 50) break;
  }

  return allProducts;
}

export const CategoryByIdWrapper: FC<CategoryByIdWrapperProps> = async ({
  id,
}) => {
  const products = await fetchAllCategoryProducts(Number(id));

  if (!products || products.length === 0) {
    return null;
  }

  const categoryName = products[0].categories.find(
    (category) => category.categoryLanguages[0]?.categoryId === Number(id),
  )?.categoryLanguages[0]?.name;

  return (
    <Suspense fallback={<CategoryByIdSkeleton />}>
      <CategoriesContainer>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-0 md:mb-4 px-4 md:px-10">
          {categoryName}
        </h2>
        <ThumbnailGrid products={products} />
      </CategoriesContainer>
    </Suspense>
  );
};
