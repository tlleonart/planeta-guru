/** biome-ignore-all lint/complexity/useOptionalChain: Explicit null checks for API response mapping */
import type {
  AddedFavorite,
  AddedFavoriteApiModel,
  Bundle,
  BundleApiModel,
  BundleAvailability,
  BundleAvailabilityApiModel,
  BundleWithProduct,
  BundleWithProductApiModel,
  Category,
  CategoryApiModel,
  CategoryLanguage,
  CategoryLanguageApiModel,
  CategoryMedia,
  CategoryMediaApiModel,
  Country,
  CountryApiModel,
  Description,
  DescriptionApiModel,
  Discount,
  DiscountApiModel,
  Favorite,
  FavoriteApiModel,
  FeaturedProduct,
  FeaturedProductApiModelFlattened,
  FeaturedProductApiModelUnion,
  Media,
  MediaApiModel,
  MediaType,
  MediaTypeApiModel,
  Product,
  ProductApiModel,
  ProductType,
  ProductTypeApiModel,
  Region,
  RegionApiModel,
  RegionLanguage,
  RegionLanguageApiModel,
  Spec,
  SpecApiModel,
  SpecDetail,
  SpecDetailApiModel,
  SpecLanguage,
  SpecLanguageApiModel,
  SpecValue,
  SpecValueApiModel,
  Store,
  StoreApiModel,
  UserProduct,
  UserProductApiModel,
} from "@/modules/shared/types/product-types";

export function mapMediaType(api: MediaTypeApiModel): MediaType {
  return {
    id: api.id,
    name: api.name,
    mimes: api.mimes,
    maxSize: api.max_size,
    maxHeight: api.max_height,
    maxWidth: api.max_width,
  };
}

export function mapMedia(api: MediaApiModel): Media {
  return {
    id: api.id,
    url: api.url,
    description: api.description,
    mediaTypeId: api.media_type_id,
    mediaType: api.media_type ? mapMediaType(api.media_type) : undefined,
  };
}

export function mapDescription(api: DescriptionApiModel): Description {
  return {
    id: api.id,
    languageId: api.language_id,
    descriptionTypeId: api.description_type_id,
    text: api.text,
  };
}

export function mapProductType(api: ProductTypeApiModel): ProductType {
  return {
    id: api.id,
    name: api.name,
  };
}

export function mapCountry(api: CountryApiModel): Country {
  return {
    name: api.name,
    code: api.code,
    regionId: api.region_id,
  };
}

export function mapRegionLanguage(api: RegionLanguageApiModel): RegionLanguage {
  return {
    name: api.name,
    languageId: api.language_id,
  };
}

export function mapRegion(api: RegionApiModel): Region {
  return {
    id: api.id,
    name: api.name,
    regionLanguages:
      api.region_languages && api.region_languages.map(mapRegionLanguage),
    countries: api.countries && api.countries.map(mapCountry),
  };
}

export function mapStore(api: StoreApiModel): Store {
  return {
    name: api.name,
    description: api.description,
  };
}

export function mapDiscount(api: DiscountApiModel): Discount {
  return {
    id: api.id,
    percentage: api.percentage,
    bundleId: api.bundle_id,
  };
}

export function mapBundleAvailability(
  api: BundleAvailabilityApiModel,
): BundleAvailability {
  return {
    available: api.available,
    country: api.country,
  };
}

export function mapBundle(api: BundleApiModel): Bundle {
  return {
    id: api.id,
    productId: api.product_id,
    title: api.title,
    price: api.price,
    priceWithDiscount: api.price_with_discount,
    priceWithSopDiscount: api.price_with_sop_discount,
    priceInCurrency: api.price_in_currency,
    finalPriceInCurrency: api.final_price_in_currency,
    currency: api.currency,
    discount: api.discount ? mapDiscount(api.discount) : undefined,
    sopDiscount: api.sop_discount ? mapDiscount(api.sop_discount) : undefined,
    regionId: api.region_id,
    region: api.region ? mapRegion(api.region) : undefined,
    storeId: api.store_id,
    store: api.store ? mapStore(api.store) : undefined,
    externalProviderId: api.external_provider_id,
    availableIntoSelectedCountry: api.available_into_selected_country
      ? mapBundleAvailability(api.available_into_selected_country)
      : undefined,
  };
}

export function mapCategoryLanguage(
  api: CategoryLanguageApiModel,
): CategoryLanguage {
  return {
    categoryId: api.category_id,
    name: api.name,
  };
}

export function mapCategoryMedia(api: CategoryMediaApiModel): CategoryMedia {
  return {
    url: api.url,
    description: api.description,
    mediaTypeId: api.media_type_id,
  };
}

export function mapCategory(api: CategoryApiModel): Category {
  return {
    id: api.id,
    categoryLanguages: api.category_languages.map(mapCategoryLanguage),
    categoryMedia: api.category_media?.map(mapCategoryMedia),
    parentId: api.parent_id,
  };
}

export function mapSpecLanguage(api: SpecLanguageApiModel): SpecLanguage {
  return {
    id: api.id,
    name: api.name,
  };
}

export function mapSpecValue(api: SpecValueApiModel): SpecValue {
  return {
    id: api.id,
    name: api.name,
  };
}

export function mapSpecDetail(api: SpecDetailApiModel): SpecDetail {
  return {
    id: api.id,
    name: api.name,
    specTypeId: api.spec_type_id,
    specLanguages: api.spec_languages.map(mapSpecLanguage),
  };
}

export function mapSpec(api: SpecApiModel): Spec {
  return {
    id: api.id,
    name: api.name,
    specTypeId: api.spec_type_id,
    specId: api.spec_id,
    spec: api.spec ? mapSpecDetail(api.spec) : undefined,
    specValue: api.spec_value ? mapSpecValue(api.spec_value) : undefined,
    specValueId: api.spec_value_id,
  };
}

export function mapProduct(api: ProductApiModel): Product {
  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    productTypeId: api.product_type_id,
    isOwner: api.is_owner,
    isFavorite: api.is_favorite,
    favoriteId: api.favorite_id,
    rating: api.rating,
    media: api.media?.map(mapMedia),
    categories: api.categories?.map(mapCategory) ?? [],
    specs: api.specs?.map(mapSpec),
    tags: api.tags,
    productType: api.product_type
      ? mapProductType(api.product_type)
      : undefined,
    descriptions: api.descriptions?.map(mapDescription),
    bundles: api.bundles?.map(mapBundle) ?? [],
  };
}

export function mapBundleWithProduct(
  api: BundleWithProductApiModel,
): BundleWithProduct {
  return {
    ...mapBundle(api),
    product: mapProduct(api.product),
  };
}

/**
 * Type guard to check if the API response has flattened structure
 * (media/descriptions at root level instead of inside product)
 */
function isFlattenedFeaturedProduct(
  api: FeaturedProductApiModelUnion,
): api is FeaturedProductApiModelFlattened {
  return !("media" in api.product) && "media" in api;
}

export function mapFeaturedProduct(
  api: FeaturedProductApiModelUnion,
): FeaturedProduct {
  if (isFlattenedFeaturedProduct(api)) {
    return {
      id: api.id,
      productId: api.product_id,
      sectionId: api.section_id,
      position: api.position,
      product: mapProduct({
        ...api.product,
        media: api.media,
        descriptions: api.descriptions,
      } as ProductApiModel),
    };
  }

  return {
    id: api.id,
    productId: api.product_id,
    sectionId: api.section_id,
    position: api.position,
    product: mapProduct(api.product),
  };
}

export function mapUserProduct(api: UserProductApiModel): UserProduct {
  return {
    id: api.id,
    userId: api.user_id,
    bundleId: api.bundle_id,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    deletedAt: api.deleted_at,
    bundle: mapBundleWithProduct(api.bundle),
  };
}

export function mapFavorite(api: FavoriteApiModel): Favorite {
  return {
    productId: api.product_id,
    userId: api.user_id,
    product: mapProduct(api.product),
  };
}

export function mapAddedFavorite(api: AddedFavoriteApiModel): AddedFavorite {
  return {
    userId: api.user_id,
    productId: api.product_id,
    id: api.id,
  };
}
