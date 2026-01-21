import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface PaymentRequest {
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

export async function POST(request: Request) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required for payment" },
        { status: 401 },
      );
    }

    const body: PaymentRequest = await request.json();
    const cookieStore = await cookies();

    // Country debe estar en MAYÚSCULAS (AR, MX, etc.) - así lo guarda proxy.ts
    const selectedCountry = cookieStore.get("selectedCountry")?.value || "AR";
    // Language en minúsculas (es, en)
    const selectedLanguage = cookieStore.get("selectedLanguage")?.value || "es";

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
      body,
      { headers: requestHeaders },
    );

    return NextResponse.json(response.data.transaction);
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json(
      { error: "Error processing payment" },
      { status: 500 },
    );
  }
}
