# Mappers

## Vision General

Los mappers transforman datos entre el formato de la API (snake_case) y el formato de dominio (camelCase). Esta separacion permite:

- Mantener consistencia en el codigo del frontend
- Aislar cambios de la API del resto de la aplicacion
- Facilitar testing y mantenimiento
- Garantizar type-safety

## Convencion de Nombres

| Tipo | Nombre | Ejemplo |
|------|--------|---------|
| Modelo API | `{Entity}ApiModel` | `ProductApiModel` |
| Modelo Dominio | `{Entity}` | `Product` |
| Respuesta API | `{Get/Create}{Entity}ApiResponse` | `GetProductApiResponse` |
| Funcion Mapper | `map{Entity}` | `mapProduct` |
| Mapper de Lista | `map{Entity}List` | `mapProductList` |

## Estructura de Tipos

```typescript
// src/modules/shared/types/product-types.ts

// Modelo de API (como viene del backend)
export interface ProductApiModel {
  id: number;
  name: string;
  slug: string;
  product_type: string;
  base_price: number;
  discount_percentage: number | null;
  image_url: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

// Modelo de dominio (como se usa en el frontend)
export interface Product {
  id: number;
  name: string;
  slug: string;
  productType: string;
  basePrice: number;
  discountPercentage: number | null;
  imageUrl: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Respuesta de API
export interface GetProductApiResponse {
  product: ProductApiModel;
}

export interface GetProductsApiResponse {
  products: ProductApiModel[];
  pagination: PaginationApiModel;
}
```

## Implementacion de Mappers

### Mapper Simple

```typescript
// src/modules/shared/mappers/product-mapper.ts
import type { Product, ProductApiModel } from "../types/product-types";

export function mapProduct(api: ProductApiModel): Product {
  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    productType: api.product_type,
    basePrice: api.base_price,
    discountPercentage: api.discount_percentage,
    imageUrl: api.image_url,
    description: api.description,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}
```

### Mapper de Lista

```typescript
export function mapProductList(apiList: ProductApiModel[]): Product[] {
  return apiList.map(mapProduct);
}
```

### Mapper con Objetos Anidados

```typescript
// Tipos
export interface GameKeyApiModel extends ProductApiModel {
  system_requirements: SystemRequirementsApiModel;
  activation_guide: ActivationGuideApiModel | null;
  languages: LanguageApiModel[];
}

export interface GameKey extends Product {
  systemRequirements: SystemRequirements;
  activationGuide: ActivationGuide | null;
  languages: Language[];
}

// Mappers
export function mapSystemRequirements(
  api: SystemRequirementsApiModel
): SystemRequirements {
  return {
    minCpu: api.min_cpu,
    minRam: api.min_ram,
    minGpu: api.min_gpu,
    minStorage: api.min_storage,
    recCpu: api.rec_cpu,
    recRam: api.rec_ram,
    recGpu: api.rec_gpu,
    recStorage: api.rec_storage,
    os: api.os,
  };
}

export function mapLanguage(api: LanguageApiModel): Language {
  return {
    id: api.id,
    name: api.name,
    code: api.code,
    hasAudio: api.has_audio,
    hasSubtitles: api.has_subtitles,
    hasInterface: api.has_interface,
  };
}

export function mapGameKey(api: GameKeyApiModel): GameKey {
  return {
    ...mapProduct(api),
    systemRequirements: mapSystemRequirements(api.system_requirements),
    activationGuide: api.activation_guide
      ? mapActivationGuide(api.activation_guide)
      : null,
    languages: api.languages.map(mapLanguage),
  };
}
```

### Mapper con Campos Opcionales

```typescript
export function mapWallet(api: WalletApiModel): Wallet {
  return {
    id: api.id,
    userId: api.user_id,
    amount: api.amount,
    deleted: api.deleted,
    // Campo opcional con default
    lastUpdated: api.last_updated || null,
  };
}
```

### Mapper con Transformacion de Datos

```typescript
export function mapPack(api: PackApiModel): Pack {
  return {
    id: api.id,
    name: api.name,
    guruAmount: api.guru_amount,
    usdAmount: api.usd_amount,
    countryId: api.country_id,
    offered: api.offered,
    prices: mapGuruPackCountryPrice(api.prices),
    // Calcular campo derivado
    discountedPrice: api.offered
      ? api.prices.total_price * 0.9
      : api.prices.total_price,
  };
}
```

### Mapper de Respuesta Completa

```typescript
export function mapWalletHistory(
  response: GetWalletHistoryApiResponse
): WalletHistory {
  return {
    outcomes: response.outcomes.map(mapOutcome),
    incomes: response.incomes.map(mapIncome),
    pagination: {
      currentPage: response.pagination.current_page,
      perPage: response.pagination.per_page,
      totalPages: response.pagination.total_pages,
      total: response.pagination.total,
    },
  };
}
```

## Mappers Existentes

### legals-mapper.ts

```typescript
mapLegal(api: LegalApiModel): Legal
mapLegalList(apiList: LegalApiModel[]): Legal[]
extractPrivacyUrl(legals: Legal[]): string | null
extractTermsUrl(legals: Legal[]): string | null
```

### pack-mapper.ts

```typescript
mapGuruPackCountryPrice(api: GuruPackCountryPriceApiModel): GuruPackCountryPrice
mapPack(api: PackApiModel): Pack
mapPackList(api: PackListApiModel): PackList
```

### wallet-mapper.ts

```typescript
mapWallet(api: WalletApiModel): Wallet
mapWalletResponse(response: GetWalletApiResponse): Wallet
mapOutcome(api: WalletOutcomeApiModel): WalletOutcome
mapIncome(api: WalletIncomeApiModel): WalletIncome
```

### product-mapper.ts

```typescript
mapProduct(api: ProductApiModel): Product
mapProductList(apiList: ProductApiModel[]): Product[]
mapGameKey(api: GameKeyApiModel): GameKey
mapGiftCard(api: GiftCardApiModel): GiftCard
mapSubscription(api: SubscriptionApiModel): Subscription
```

### category-mapper.ts

```typescript
mapCategory(api: CategoryApiModel): Category
mapCategoryList(apiList: CategoryApiModel[]): Category[]
```

## Testing de Mappers

```typescript
// tests/unit/mappers/product-mapper.test.ts
import { describe, expect, it } from "vitest";
import { mapProduct, mapProductList } from "@/modules/shared/mappers/product-mapper";

describe("product-mapper", () => {
  describe("mapProduct", () => {
    it("should map all fields from snake_case to camelCase", () => {
      const apiModel = {
        id: 1,
        name: "Test Product",
        slug: "test-product",
        product_type: "game_key",
        base_price: 1000,
        discount_percentage: 10,
        image_url: "https://example.com/image.jpg",
        description: "A test product",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      };

      const result = mapProduct(apiModel);

      expect(result).toEqual({
        id: 1,
        name: "Test Product",
        slug: "test-product",
        productType: "game_key",
        basePrice: 1000,
        discountPercentage: 10,
        imageUrl: "https://example.com/image.jpg",
        description: "A test product",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      });
    });

    it("should handle null optional fields", () => {
      const apiModel = {
        id: 1,
        name: "Test",
        slug: "test",
        product_type: "game_key",
        base_price: 100,
        discount_percentage: null,
        image_url: null,
        description: "",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      const result = mapProduct(apiModel);

      expect(result.discountPercentage).toBeNull();
      expect(result.imageUrl).toBeNull();
    });
  });

  describe("mapProductList", () => {
    it("should map array of products", () => {
      const apiList = [
        {
          id: 1,
          name: "Product 1",
          slug: "product-1",
          product_type: "game_key",
          base_price: 100,
          discount_percentage: null,
          image_url: null,
          description: "",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          name: "Product 2",
          slug: "product-2",
          product_type: "gift_card",
          base_price: 200,
          discount_percentage: 5,
          image_url: "https://example.com/img.jpg",
          description: "Description",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
        },
      ];

      const result = mapProductList(apiList);

      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("product-1");
      expect(result[1].slug).toBe("product-2");
    });

    it("should return empty array for empty input", () => {
      const result = mapProductList([]);
      expect(result).toEqual([]);
    });
  });
});
```

## Buenas Practicas

1. **Un mapper por entidad**: Cada tipo de entidad debe tener su propio archivo de mapper

2. **Funciones puras**: Los mappers no deben tener efectos secundarios

3. **Tipado estricto**: Siempre especificar tipos de entrada y salida

4. **Reutilizar mappers**: Componer mappers para objetos anidados

5. **Manejar nulls**: Considerar campos opcionales y valores null

6. **Testing exhaustivo**: Probar todos los casos edge

7. **No logica de negocio**: Los mappers solo transforman datos, no validan ni procesan
