import { HttpResponse, http } from "msw";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const handlers = [
  // Products
  http.get(`${API_BASE_URL}/products/:slug`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        name: "Test Game",
        slug: "test-game",
        product_type_id: 1,
        is_favorite: false,
        is_owner: false,
        bundles: [{ id: 1, price: 100, name: "Standard" }],
        descriptions: [{ description_type_id: 1, text: "Test description" }],
        categories: [],
        specs: [],
        media: [],
      },
    });
  }),

  // Packs
  http.get(`${API_BASE_URL}/guru-packs`, () => {
    return HttpResponse.json({
      data: {
        guru_packs: [
          {
            id: 1,
            value: 100,
            guru_pack_country_prices: [
              {
                id: 1,
                guru_pack_id: 1,
                price: 50,
                transaction_cost: 5,
                total_price: 55,
              },
            ],
          },
          {
            id: 2,
            value: 500,
            guru_pack_country_prices: [
              {
                id: 2,
                guru_pack_id: 2,
                price: 200,
                transaction_cost: 10,
                total_price: 210,
              },
            ],
          },
        ],
      },
    });
  }),

  // Wallet
  http.get(`${API_BASE_URL}/wallet`, () => {
    return HttpResponse.json({
      data: {
        balance: 1000,
        currency: "MXN",
      },
    });
  }),

  // Subscription
  http.post(`${API_BASE_URL}/ph/subscriptions/pg-status`, () => {
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

  // Legals
  http.get(`${API_BASE_URL}/legals/urls`, () => {
    return HttpResponse.json({
      url: "https://example.com/terms",
      terms_url: "https://example.com/terms",
      privacy_url: "https://example.com/privacy",
    });
  }),

  // Payment
  http.post(`${API_BASE_URL}/payments/transactions`, () => {
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
];
