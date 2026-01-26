import { HttpResponse, http } from "msw";

// Note: HttpClient builds URLs as `${baseUrl}/${endpoint}` where endpoint starts with `/`
// This results in double slashes (e.g., http://localhost:8000//products/list)
// We handle this by normalizing the URL in our handlers
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000";

// ============================================================
// Test Data Factories
// ============================================================

const createMediaTypeApiModel = (id = 1) => ({
  id,
  name: "image",
  mimes: "image/jpeg,image/png",
  max_size: 5000000,
  max_height: 1080,
  max_width: 1920,
});

const createMediaApiModel = (id = 1) => ({
  id,
  url: `https://cdn.example.com/image-${id}.jpg`,
  description: `Product image ${id}`,
  media_type_id: 1,
  media_type: createMediaTypeApiModel(),
});

const createDescriptionApiModel = (id = 1, languageId = 1) => ({
  id,
  language_id: languageId,
  description_type_id: 1,
  text: `Description text ${id}`,
});

const createCategoryApiModel = (id = 1) => ({
  id,
  name: "Games",
  category_languages: [{ category_id: id, name: "Games" }],
  category_media: [
    {
      url: "https://cdn.example.com/cat.jpg",
      description: "Category",
      media_type_id: 1,
    },
  ],
  laravel_through_key: 1,
  parent_id: null,
});

const createBundleApiModel = (id = 1) => ({
  id,
  product_id: 100,
  title: `Bundle ${id}`,
  price: 1000,
  price_with_discount: 800,
  price_with_sop_discount: 750,
  price_in_currency: 199.99,
  final_price_in_currency: 159.99,
  currency: "MXN",
  discount: { id: 1, percentage: 20, bundle_id: id },
  sop_discount: { id: 2, percentage: 25, bundle_id: id },
  region_id: 1,
  region: {
    id: 1,
    name: "LATAM",
    region_languages: [{ name: "Global", language_id: 1 }],
    countries: [{ name: "Mexico", code: "MX", region_id: 1 }],
  },
  store_id: 1,
  store: { name: "Steam", description: "Steam Store" },
  external_provider_id: null,
  available_into_selected_country: { available: true, country: "MX" },
});

const createProductApiModel = (id = 1, slug = "test-game") => ({
  id,
  name: "Test Game",
  slug,
  product_type_id: 1,
  is_owner: false,
  is_favorite: false,
  favorite_id: 0,
  rating: 4.5,
  media: [createMediaApiModel()],
  categories: [createCategoryApiModel()],
  specs: [],
  tags: [],
  product_type: { id: 1, name: "Game Key" },
  descriptions: [createDescriptionApiModel()],
  bundles: [createBundleApiModel()],
});

const createFeaturedProductApiModel = (id = 1) => ({
  id,
  product_id: 100,
  section_id: 1,
  position: id,
  product: createProductApiModel(100),
});

const createUserProductApiModel = (id = 1) => ({
  id,
  user_id: "test-user-id",
  bundle_id: 1,
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T12:00:00Z",
  deleted_at: null,
  bundle: {
    ...createBundleApiModel(),
    product: createProductApiModel(),
  },
});

const createFavoriteApiModel = (productId = 1) => ({
  product_id: productId,
  user_id: 1,
  product: createProductApiModel(productId),
});

const createPagination = (total = 1) => ({
  total,
  per_page: 10,
  current_page: 1,
  last_page: 1,
  from: 1,
  to: total,
});

const createGuruPackApiModel = (id = 1, guruAmount = 100) => ({
  id,
  name: `Pack ${guruAmount}`,
  guru_amount: guruAmount,
  usd_amount: guruAmount / 10,
  country_id: 1,
  offered: true,
  prices: {
    guru_pack_id: id,
    country_id: 1,
    currency_id: 2,
    price: guruAmount * 0.5,
    transaction_cost: 5,
    transaction_percentage: 10,
    total_price: guruAmount * 0.5 + 5,
  },
});

// ============================================================
// URL Matcher Helper
// ============================================================
// HttpClient creates URLs like: baseUrl + "/" + "/endpoint" = "http://localhost:8000//endpoint"
// We use regex patterns to match both single and double slash versions

const url = (path: string) => {
  // Replace path params like :slug with a pattern that matches any non-slash characters
  const pathWithParams = path
    .replace(/^\/+/, "") // Remove leading slashes
    .replace(/\//g, "/+") // Match one or more slashes
    .replace(/:([^/]+)/g, "[^/]+"); // Replace :param with non-slash pattern

  return new RegExp(`^${API_BASE_URL}/+${pathWithParams}(\\?.*)?$`);
};

// ============================================================
// Handlers
// ============================================================

export const handlers = [
  // ----------------------------------------
  // Product Service Handlers
  // ----------------------------------------

  // GET /products/list - getProducts, getProductsByCategory, searchProducts
  http.get(url("products/list"), ({ request }) => {
    const reqUrl = new URL(request.url);
    const search = reqUrl.searchParams.get("search");

    const products = [
      createProductApiModel(1, "game-1"),
      createProductApiModel(2, "game-2"),
    ];

    // Filter by search if provided
    const filteredProducts = search
      ? products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        )
      : products;

    return HttpResponse.json({
      products: filteredProducts,
      pagination: createPagination(filteredProducts.length),
      message: { type: "success", text: "OK" },
    });
  }),

  // GET /products/item/slug/:slug - getProductBySlug
  http.get(url("products/item/slug/:slug"), ({ params }) => {
    const { slug } = params;

    if (slug === "not-found") {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      product: createProductApiModel(1, slug as string),
      pagination: createPagination(1),
      message: { type: "success", text: "OK" },
    });
  }),

  // GET /products/featured-products - getFeaturedProducts, getAdBanner
  http.get(url("products/featured-products"), ({ request }) => {
    const reqUrl = new URL(request.url);
    const sectionId = reqUrl.searchParams.get("section_id");

    // Section 2 is for ad banner
    if (sectionId === "2") {
      return HttpResponse.json({
        featured_products: [
          {
            id: 1,
            product_id: 100,
            section_id: 2,
            position: 1,
            descriptions: [createDescriptionApiModel()],
            media: [createMediaApiModel()],
          },
        ],
        pagination: createPagination(1),
        message: { type: "success", text: "OK" },
      });
    }

    return HttpResponse.json({
      featured_products: [
        createFeaturedProductApiModel(1),
        createFeaturedProductApiModel(2),
      ],
      pagination: createPagination(2),
      message: { type: "success", text: "OK" },
    });
  }),

  // GET /products/categories - getCategories
  http.get(url("products/categories"), () => {
    return HttpResponse.json({
      categories: [createCategoryApiModel(1), createCategoryApiModel(2)],
      pagination: createPagination(2),
      message: { type: "success", text: "OK" },
    });
  }),

  // GET /products/user-products - getUserProducts, getDownloads
  http.get(url("products/user-products"), () => {
    return HttpResponse.json({
      "user-products": [
        createUserProductApiModel(1),
        createUserProductApiModel(2),
      ],
      pagination: createPagination(2),
      message: { type: "success", text: "OK" },
    });
  }),

  // GET /products/favorites - getFavorites
  http.get(url("products/favorites"), () => {
    return HttpResponse.json({
      favorites: [createFavoriteApiModel(1), createFavoriteApiModel(2)],
      pagination: createPagination(2),
      message: { type: "success", text: "OK" },
    });
  }),

  // POST /products/favorites - addFavorite
  http.post(url("products/favorites"), async ({ request }) => {
    const body = (await request.json()) as { product_id: number };
    return HttpResponse.json({
      favorite: {
        user_id: "test-user-id",
        product_id: body.product_id,
        id: 123,
      },
      pagination: createPagination(1),
      message: { type: "success", text: "Favorite added" },
    });
  }),

  // DELETE /products/favorites/:id - removeFavorite
  http.delete(url("products/favorites/:id"), () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ----------------------------------------
  // Wallet Service Handlers
  // ----------------------------------------

  // GET /wallets/wallet - getWallet, getBalance
  http.get(url("wallets/wallet"), () => {
    return HttpResponse.json({
      wallet: {
        id: 1,
        user_id: 123,
        amount: 1500,
        deleted: false,
      },
    });
  }),

  // GET /wallets/outcomes - getOutcomes
  http.get(url("wallets/outcomes"), () => {
    return HttpResponse.json({
      outcomes: [
        {
          id: 1,
          wallet_id: 1,
          amount: 100,
          product_id: 10,
          percentage_discount: 0,
          created_at: "2024-01-15T10:00:00Z",
          deleted: false,
          voucher_id: "voucher-1",
          product_name: "Test Game",
        },
        {
          id: 2,
          wallet_id: 1,
          amount: 50,
          product_id: 20,
          percentage_discount: 10,
          created_at: "2024-01-14T10:00:00Z",
          deleted: false,
          voucher_id: "voucher-2",
          product_name: "Test DLC",
        },
      ],
      pagination: createPagination(2),
    });
  }),

  // GET /wallets/incomes - getIncomes
  http.get(url("wallets/incomes"), () => {
    return HttpResponse.json({
      incomes: [
        {
          id: 1,
          wallet_id: 1,
          purchase: 100,
          amount: 500,
          income_type_id: 1,
          currency: "MXN",
          created_at: "2024-01-10T10:00:00Z",
          deleted: false,
        },
      ],
      pagination: createPagination(1),
    });
  }),

  // ----------------------------------------
  // Pack Service Handlers
  // ----------------------------------------

  // GET /games-management/guru-packs - getPacks
  http.get(url("games-management/guru-packs"), () => {
    return HttpResponse.json({
      guru_packs: [
        createGuruPackApiModel(1, 100),
        createGuruPackApiModel(2, 500),
        createGuruPackApiModel(3, 1000),
      ],
      pagination: createPagination(3),
      message: { type: "success", text: "OK" },
    });
  }),

  // ----------------------------------------
  // Legals Service Handlers
  // ----------------------------------------

  // GET /landings/product-provider/selected-country - getLegalsUrls
  http.get(url("landings/product-provider/selected-country"), () => {
    return HttpResponse.json({
      terms_url: "https://example.com/terms",
      privacy_url: "https://example.com/privacy",
    });
  }),

  // ----------------------------------------
  // Subscription Service Handlers
  // ----------------------------------------

  // POST /ph/subscriptions/pg-status - getSubscription
  http.post(url("ph/subscriptions/pg-status"), () => {
    return HttpResponse.json({
      subscription_data: {
        status: "ACTIVE",
        external_user_account: "+5212345678",
        service_name: "Premium",
        provider_name: "Telcel",
        operator_name: "Telcel MX",
        valid: true,
      },
    });
  }),

  // ----------------------------------------
  // Payment Handlers
  // ----------------------------------------

  // POST /payments/transactions - gurusPaymentAction
  http.post(url("payments/transactions"), () => {
    return HttpResponse.json({
      transaction: {
        link: "https://mercadopago.com/checkout/123",
        id: {
          purchase_link: "https://mercadopago.com/checkout/123",
          sandbox_link: "https://sandbox.mercadopago.com/checkout/123",
        },
      },
    });
  }),

  // POST /payments/transactions/combo - comboPaymentAction
  http.post(url("payments/transactions/combo"), () => {
    return HttpResponse.json({
      url: "https://mercadopago.com/checkout/combo/456",
    });
  }),

  // ----------------------------------------
  // Next.js API Routes (Internal)
  // ----------------------------------------

  // POST /api/payment - Internal API route for payment processing
  http.post("http://localhost:3000/api/payment", () => {
    return HttpResponse.json({
      link: "https://mercadopago.com/checkout/123",
      id: {
        purchase_link: "https://mercadopago.com/checkout/123",
        sandbox_link: "https://sandbox.mercadopago.com/checkout/123",
      },
    });
  }),

  // Also handle relative URL (for jsdom environment)
  http.post("/api/payment", () => {
    return HttpResponse.json({
      link: "https://mercadopago.com/checkout/123",
      id: {
        purchase_link: "https://mercadopago.com/checkout/123",
        sandbox_link: "https://sandbox.mercadopago.com/checkout/123",
      },
    });
  }),
];

// ============================================================
// Error Handlers (for testing error scenarios)
// ============================================================

export const errorHandlers = {
  productNotFound: http.get(url("products/item/slug/:slug"), () => {
    return HttpResponse.json({ message: "Product not found" }, { status: 404 });
  }),

  serverError: http.get(url("products/list"), () => {
    return HttpResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }),

  unauthorized: http.get(url("products/favorites"), () => {
    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }),

  subscriptionInactive: http.post(url("ph/subscriptions/pg-status"), () => {
    return HttpResponse.json({
      subscription_data: {
        status: "INACTIVE",
        external_user_account: "",
        service_name: "",
        provider_name: "",
        operator_name: "",
        valid: false,
      },
    });
  }),

  networkError: http.get(url("products/list"), () => {
    return HttpResponse.error();
  }),
};
