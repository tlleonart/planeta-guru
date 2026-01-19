import type { RequestContext } from "@/modules/http";
import { BaseService } from "@/modules/http/base-service";
import {
  mapAddedFavorite,
  mapCategory,
  mapFavorite,
  mapFeaturedProduct,
  mapProduct,
  mapUserProduct,
} from "@/modules/shared/mappers/product-mapper";
import type {
  AddedFavorite,
  AddFavoriteApiResponse,
  GetCategoriesApiResponse,
  GetFavoritesApiResponse,
  GetFeaturedProductsApiResponse,
  GetFeaturedProductsParams,
  GetProductBySlugApiResponse,
  GetProductsApiResponse,
  GetProductsParams,
  GetUserProductsApiResponse,
  GetUserProductsParams,
  PaginatedCategories,
  PaginatedFavorites,
  PaginatedFeaturedProducts,
  PaginatedProducts,
  PaginatedUserProducts,
  Product,
} from "@/modules/shared/types/product-types";

class ProductService extends BaseService {
  private readonly basePath = "/products";

  async getProducts(
    params: GetProductsParams = {},
    context: RequestContext,
  ): Promise<PaginatedProducts> {
    const response = await this.http.get<GetProductsApiResponse>(
      `${this.basePath}/list`,
      {
        params: {
          search: params.search,
          category_id: params.categoryId,
          ...this.buildPaginationParams(params),
        },
        context,
      },
    );

    return {
      items: response.data.products.map(mapProduct),
      pagination: this.mapPagination(response.data.pagination),
    };
  }

  async getProductsByCategory(
    categoryId: number,
    params: Omit<GetProductsParams, "categoryId"> = {},
    context: RequestContext,
  ): Promise<PaginatedProducts> {
    return this.getProducts({ ...params, categoryId }, context);
  }

  async searchProducts(
    query: string,
    params: Omit<GetProductsParams, "search"> = {},
    context: RequestContext,
  ): Promise<PaginatedProducts> {
    return this.getProducts({ ...params, search: query }, context);
  }

  async getProductBySlug(
    slug: string,
    context: RequestContext,
  ): Promise<Product> {
    const response = await this.http.get<GetProductBySlugApiResponse>(
      `${this.basePath}/item/slug/${slug}`,
      { context },
    );

    return mapProduct(response.data.product);
  }

  async getFeaturedProducts(
    _params: GetFeaturedProductsParams = {},
    context: RequestContext,
  ): Promise<PaginatedFeaturedProducts> {
    const response = await this.http.get<GetFeaturedProductsApiResponse>(
      `${this.basePath}/featured-products`,
      {
        params: {
          section_id: 1,
        },
        context,
      },
    );

    return {
      items: response.data.featured_products.map(mapFeaturedProduct),
      pagination: this.mapPagination(response.data.pagination),
    };
  }

  async getCategories(context: RequestContext): Promise<PaginatedCategories> {
    const response = await this.http.get<GetCategoriesApiResponse>(
      `${this.basePath}/categories`,
      { context },
    );

    return {
      items: response.data.categories.map(mapCategory),
      pagination: this.mapPagination(response.data.pagination),
    };
  }

  async getUserProducts(
    params: GetUserProductsParams = {},
    context: RequestContext,
  ): Promise<PaginatedUserProducts> {
    const response = await this.http.get<GetUserProductsApiResponse>(
      `${this.basePath}/user-products`,
      {
        params: this.buildQueryParams(params),
        context,
      },
    );

    return {
      items: response.data["user-products"].map(mapUserProduct),
      pagination: this.mapPagination(response.data.pagination),
    };
  }

  async getDownloads(
    params: GetUserProductsParams = {},
    context: RequestContext,
  ): Promise<PaginatedUserProducts> {
    return this.getUserProducts(params, context);
  }

  async getFavorites(context: RequestContext): Promise<PaginatedFavorites> {
    const response = await this.http.get<GetFavoritesApiResponse>(
      `${this.basePath}/favorites`,
      { context },
    );

    return {
      items: response.data.favorites.map(mapFavorite),
      pagination: this.mapPagination(response.data.pagination),
    };
  }

  async addFavorite(
    productId: number,
    context: RequestContext,
  ): Promise<AddedFavorite> {
    const response = await this.http.post<AddFavoriteApiResponse>(
      `${this.basePath}/favorites`,
      { product_id: productId },
      { context },
    );

    return mapAddedFavorite(response.data.favorite);
  }

  async removeFavorite(
    favoriteId: number,
    context: RequestContext,
  ): Promise<void> {
    await this.http.delete(`${this.basePath}/favorites/${favoriteId}`, {
      context,
    });
  }
}

export const productService = new ProductService();
