import type {
  ApiMessage,
  ApiPagination,
  PaginatedResponse,
  PaginationParams,
  SortParams,
} from "./api-types";

export interface MediaType {
  id: number;
  name: string;
  mimes: string;
  maxSize: number;
  maxHeight: number;
  maxWidth: number;
}

export interface Media {
  id: number;
  url: string;
  description: string;
  mediaTypeId: number;
  mediaType?: MediaType;
}

export interface Description {
  id: number;
  languageId: number;
  descriptionTypeId: number;
  text: string;
}

export interface ProductType {
  id: number;
  name: string;
}

export interface Country {
  name: string;
  code: string;
  regionId: number;
}

export interface RegionLanguage {
  name: string;
  languageId: number;
}

export interface Region {
  id: number;
  name: string;
  regionLanguages?: RegionLanguage[];
  countries: Country[];
}

export interface Store {
  name: string;
  description: string;
}

export interface Discount {
  id: number;
  percentage: number;
  bundleId: number;
}

export interface BundleAvailability {
  available: boolean;
  country: string | null;
}

export interface Bundle {
  id: number;
  productId: number;
  title: string;
  price: number;
  priceWithDiscount: number;
  priceWithSopDiscount: number;
  priceInCurrency: number;
  finalPriceInCurrency: number;
  currency: string;
  discount?: Discount;
  sopDiscount?: Discount;
  regionId: number;
  region?: Region;
  storeId?: number;
  store?: Store;
  externalProviderId: number | null;
  availableIntoSelectedCountry?: BundleAvailability;
}

export interface CategoryLanguage {
  categoryId: number;
  name: string;
}

export interface CategoryMedia {
  url: string;
  description: string;
  mediaTypeId: number;
}

export interface Category {
  id: number;
  categoryLanguages: CategoryLanguage[];
  categoryMedia?: CategoryMedia[];
  parentId?: number | null;
}

export interface SpecLanguage {
  id: number;
  name: string;
}

export interface SpecValue {
  id: number;
  name: string;
}

export interface SpecDetail {
  id: number;
  name: string;
  specTypeId: number;
  specLanguages: SpecLanguage[];
}

export interface Spec {
  id: number;
  name: string;
  specTypeId: number;
  specId: number;
  spec?: SpecDetail;
  specValue?: SpecValue;
  specValueId: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  productTypeId: number;
  isOwner: boolean;
  isFavorite: boolean;
  favoriteId: number;
  rating: number;
  media: Media[];
  categories: Category[];
  specs: Spec[];
  tags: [];
  productType?: ProductType;
  descriptions?: Description[];
  bundles: Bundle[];
}

export interface FeaturedProduct {
  id: number;
  productId: number;
  sectionId: number;
  position: number;
  product: Product;
}

export interface BundleWithProduct extends Bundle {
  product: Product;
}

export interface UserProduct {
  id: number;
  userId: string;
  bundleId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  bundle: BundleWithProduct;
}

export interface Favorite {
  productId: number;
  userId: number;
  product: Product;
}

export interface MediaTypeApiModel {
  id: number;
  name: string;
  mimes: string;
  max_size: number;
  max_height: number;
  max_width: number;
}

export interface MediaApiModel {
  id: number;
  url: string;
  description: string;
  media_type_id: number;
  media_type: MediaTypeApiModel;
}

export interface DescriptionApiModel {
  id: number;
  language_id: number;
  description_type_id: number;
  text: string;
}

export interface ProductTypeApiModel {
  id: number;
  name: string;
}

export interface CountryApiModel {
  name: string;
  code: string;
  region_id: number;
}

export interface RegionLanguageApiModel {
  name: string;
  language_id: number;
}

export interface RegionApiModel {
  id: number;
  name: string;
  region_languages: RegionLanguageApiModel[];
  countries: CountryApiModel[];
}

export interface StoreApiModel {
  name: string;
  description: string;
}

export interface DiscountApiModel {
  id: number;
  percentage: number;
  bundle_id: number;
}

export interface BundleAvailabilityApiModel {
  available: boolean;
  country: string | null;
}

export interface BundleApiModel {
  id: number;
  product_id: number;
  title: string;
  price: number;
  price_with_discount: number;
  price_with_sop_discount: number;
  price_in_currency: number;
  final_price_in_currency: number;
  currency: string;
  discount: DiscountApiModel;
  sop_discount: DiscountApiModel;
  region_id: number;
  region: RegionApiModel;
  store_id: number;
  store: StoreApiModel;
  external_provider_id: number | null;
  available_into_selected_country: BundleAvailabilityApiModel;
}

export interface CategoryLanguageApiModel {
  category_id: number;
  name: string;
}

export interface CategoryMediaApiModel {
  url: string;
  description: string;
  media_type_id: number;
}

export interface CategoryApiModel {
  id: number;
  name: string;
  category_languages: CategoryLanguageApiModel[];
  category_media: CategoryMediaApiModel[];
  laravel_through_key: number;
  parent_id: number;
}

export interface SpecLanguageApiModel {
  id: number;
  name: string;
}

export interface SpecValueApiModel {
  id: number;
  name: string;
}

export interface SpecDetailApiModel {
  id: number;
  name: string;
  spec_type_id: number;
  spec_languages: SpecLanguageApiModel[];
}

export interface SpecApiModel {
  id: number;
  name: string;
  spec_type_id: number;
  spec_id: number;
  spec: SpecDetailApiModel;
  spec_value: SpecValueApiModel;
  spec_value_id: number;
}

export interface ProductApiModel {
  id: number;
  name: string;
  slug: string;
  product_type_id: number;
  is_owner: boolean;
  is_favorite: boolean;
  favorite_id: number;
  rating: number;
  media: MediaApiModel[];
  categories: CategoryApiModel[];
  specs: SpecApiModel[];
  tags: [];
  product_type: ProductTypeApiModel;
  descriptions: DescriptionApiModel[];
  bundles: BundleApiModel[];
}

export interface FeaturedProductApiModel {
  id: number;
  product_id: number;
  section_id: number;
  position: number;
  product: ProductApiModel;
}

/**
 * Alternative API response shape where media/descriptions are at root level
 * Used when the API returns featured products with flattened structure
 */
export interface FeaturedProductApiModelFlattened {
  id: number;
  product_id: number;
  section_id: number;
  position: number;
  media: MediaApiModel[];
  descriptions: DescriptionApiModel[];
  product: Omit<ProductApiModel, "media" | "descriptions">;
}

export type FeaturedProductApiModelUnion =
  | FeaturedProductApiModel
  | FeaturedProductApiModelFlattened;

export interface BundleWithProductApiModel extends BundleApiModel {
  product: ProductApiModel;
}

export interface UserProductApiModel {
  id: number;
  user_id: string;
  bundle_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  bundle: BundleWithProductApiModel;
}

export interface FavoriteApiModel {
  product_id: number;
  user_id: number;
  product: ProductApiModel;
}

export interface GetProductsApiResponse {
  products: ProductApiModel[];
  pagination: ApiPagination;
  message: ApiMessage;
}

export interface GetProductBySlugApiResponse {
  product: ProductApiModel;
  pagination: ApiPagination;
  message: ApiMessage;
}

export interface GetFeaturedProductsApiResponse {
  featured_products: FeaturedProductApiModel[];
  pagination: ApiPagination;
  message: ApiMessage;
}

export interface GetCategoriesApiResponse {
  categories: CategoryApiModel[];
  pagination: ApiPagination;
  message: ApiMessage;
}

export interface GetUserProductsApiResponse {
  "user-products": UserProductApiModel[];
  pagination: ApiPagination;
}

export interface GetFavoritesApiResponse {
  favorites: FavoriteApiModel[];
  pagination: ApiPagination;
  message: ApiMessage;
}

export interface AddFavoriteApiResponse {
  favorite: AddedFavoriteApiModel;
  pagination: ApiPagination;
  message: ApiMessage;
}

export interface AddedFavoriteApiModel {
  user_id: string;
  product_id: number;
  id: number;
}

export interface AddedFavorite {
  userId: string;
  productId: number;
  id: number;
}

export interface GetProductsParams extends PaginationParams {
  search?: string;
  categoryId?: number;
}

export interface GetFeaturedProductsParams {
  sectionId?: number;
}

export interface GetUserProductsParams extends PaginationParams, SortParams {
  orderBy?: "created_at" | "updated_at";
}

export interface GetDownloadsApiResponse {
  "user-products": UserProductApiModel[];
  pagination: ApiPagination;
  message: ApiMessage;
}

export type PaginatedProducts = PaginatedResponse<Product>;
export type PaginatedFeaturedProducts = PaginatedResponse<FeaturedProduct>;
export type PaginatedCategories = PaginatedResponse<Category>;
export type PaginatedUserProducts = PaginatedResponse<UserProduct>;
export type PaginatedFavorites = PaginatedResponse<Favorite>;
