"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { headers } from "next/headers";
import z from "zod";

export const vodacomWebSubscribeAction = async () => {
  try {
    const response = await axios.get(
      "https://vodacom-za-product-offering-qualification-1040674388597.us-central1.run.app?purchase_frequency=daily",
    );

    return {
      message: "Success, you will be redirected to Vodacom!",
      url: response.data.relatedParty[0].id,
    };
  } catch {
    return { message: "Error trying to subscribe, try again later." };
  }
};

export const vodacomWapSubscribeAction = async (
  msisdn: string,
  transaction_id: string,
) => {
  try {
    const response = await axios.post(
      "https://vodacom-za-product-offering-qualification-1040674388597.us-central1.run.app",
      {
        msisdn,
        transaction_id,
      },
    );

    return {
      message: "Success, you will be redirected to Vodacom!",
      url: response.data.relatedParty[0].id,
    };
  } catch {
    return { message: "Error trying to subscribe, try again later." };
  }
};

export const vodacomGetServiceElegibilityAction = async (msisdn: string) => {
  const response = await axios.post(
    "https://vodacom-za-get-service-eligibility-1040674388597.us-central1.run.app",
    { msisdn },
  );

  return {
    message: "Success, you will be redirected to Vodacom!",
    transaction_id: response.data.sourceTransactionId,
  };
};

const unsubscribeActionSchema = z.object({
  msisdn: z.string(),
  serviceName: z.string(),
  providerName: z.string(),
  operatorName: z.string(),
});

export const unsubscribeAction = async (
  _initialState: {
    msisdn: string;
    serviceName: string;
    providerName: string;
    operatorName: string;
  },
  formData: FormData,
) => {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return {
        message: "Authentication required to unsubscribe.",
      };
    }

    const validatedFields = unsubscribeActionSchema.safeParse({
      msisdn: formData.get("msisdn"),
      serviceName: formData.get("serviceName"),
      providerName: formData.get("providerName"),
      operatorName: formData.get("operatorName"),
    });

    if (!validatedFields.success) {
      return {
        message: "Error trying to unsubscribe, try again later.",
      };
    }

    const authToken = await getToken();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/ph/subscriptions/pg/unsubscribe`,
      {
        msisdn: validatedFields.data.msisdn,
        serviceName: validatedFields.data.serviceName,
        providerName: validatedFields.data.providerName,
        operatorName: validatedFields.data.operatorName,
      },
      {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
      },
    );

    return response.data;
  } catch {
    return {
      message: "Error trying to unsubscribe, try again later.",
    };
  }
};

// Payment types
export interface PaymentMethod {
  guru_pack_id: number;
  payment_method: string;
  custom_success_url?: string | null;
  user_ip_address?: string | null;
}

interface PaymentLinks {
  purchase_link: string;
  sandbox_link: string;
}

interface PaymentTransaction {
  link: string;
  id: PaymentLinks;
}

interface GetPaymentResponse {
  transaction: PaymentTransaction;
}

/**
 * Server Action: Procesa el pago de gurús
 * - Envía petición a /payments/transactions con método de pago
 * - Retorna link de compra de MercadoPago
 * - Inyecta headers automáticamente (auth, country, language, platform)
 */
export const gurusPaymentAction = async (paymentMethod: PaymentMethod) => {
  const headersList = await headers();
  const { userId, getToken } = await auth();

  if (!userId) {
    throw new Error("Authentication required for payment");
  }

  const selectedCountry = headersList.get("selected-country") || "ar";
  const selectedLanguage = headersList.get("selected-language") || "es";

  const authToken = await getToken();

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Selected-Country": selectedCountry,
    "Selected-Language": selectedLanguage,
    "Platform-Key": process.env.PLATFORM_KEY || "",
  };

  if (authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await axios.post<GetPaymentResponse>(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/transactions`,
    paymentMethod,
    { headers: requestHeaders },
  );

  return response.data.transaction;
};

// Combo payment types
export interface ComboPaymentMethod {
  bundle_id: number;
  payment_method: string;
  custom_success_url?: string | null;
}

/**
 * Server Action: Procesa el pago de combo
 * - Envia peticion a /payments/transactions/combo
 * - Retorna link de compra de MercadoPago
 * - Inyecta headers automaticamente (auth, country, language, platform)
 */
export const comboPaymentAction = async (paymentMethod: ComboPaymentMethod) => {
  const headersList = await headers();
  const { userId, getToken } = await auth();

  if (!userId) {
    throw new Error("Authentication required for payment");
  }

  const selectedCountry = headersList.get("selected-country") || "ar";
  const selectedLanguage = headersList.get("selected-language") || "es";

  const authToken = await getToken();

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Selected-Country": selectedCountry,
    "Selected-Language": selectedLanguage,
    "Platform-Key": process.env.PLATFORM_KEY || "",
  };

  if (authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await axios.post<GetPaymentResponse>(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/transactions/combo`,
    paymentMethod,
    { headers: requestHeaders },
  );

  return response.data.transaction;
};

// Purchase types
export interface Outcome {
  id: number;
  user_id: string;
  bundle_id: number;
  created_at: string;
}

interface OutcomeResponse {
  outcome: Outcome;
}

/**
 * Server Action: Compra de producto con códigos (gift cards, game keys)
 * - Envía petición a /wallets/outcome/store
 * - Descuenta gurus del wallet del usuario
 * - Retorna el outcome de la compra
 */
export const storeOutcomeAction = async (
  bundleId: number,
  walletId: number,
): Promise<Outcome> => {
  const headersList = await headers();
  const { userId, getToken } = await auth();

  if (!userId) {
    throw new Error("Authentication required for purchase");
  }

  const selectedCountry = headersList.get("selected-country") || "ar";
  const selectedLanguage = headersList.get("selected-language") || "es";

  const authToken = await getToken();

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Selected-Country": selectedCountry,
    "Selected-Language": selectedLanguage,
    "Platform-Key": process.env.PLATFORM_KEY || "",
  };

  if (authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await axios.post<OutcomeResponse>(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/wallets/outcome/store`,
    {
      bundle_id: bundleId,
      wallet_id: walletId,
    },
    { headers: requestHeaders },
  );

  return response.data.outcome;
};

/**
 * Server Action: Compra de producto con proveedor externo (Muve, Indie.io)
 * - Envía petición a /products/orders
 * - Para productos que no requieren códigos internos
 */
export const externalProviderPurchaseAction = async (
  bundleId: number,
  sopId: number | null = null,
) => {
  const headersList = await headers();
  const { userId, getToken } = await auth();

  if (!userId) {
    throw new Error("Authentication required for purchase");
  }

  const selectedCountry = headersList.get("selected-country") || "ar";
  const selectedLanguage = headersList.get("selected-language") || "es";

  const authToken = await getToken();

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Selected-Country": selectedCountry,
    "Selected-Language": selectedLanguage,
    "Platform-Key": process.env.PLATFORM_KEY || "",
  };

  if (authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/orders`,
    {
      bundle_id: bundleId,
      sop_id: sopId,
    },
    { headers: requestHeaders },
  );

  return response.data;
};
