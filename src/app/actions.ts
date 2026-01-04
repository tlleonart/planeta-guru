"use server"

import axios from "axios";
import z from "zod";

export const vodacomWebSubscribeAction = async () => {
  try {
    const response = await axios.get(
      "https://vodacom-za-product-offering-qualification-1040674388597.us-central1.run.app?purchase_frequency=daily"
    );

    return {
      message: "Success, you will be redirected to Vodacom!",
      url: response.data.relatedParty[0].id,
    };
  } catch (error) {
    console.error(`[VODACOM ACTION ERROR] Error intentando suscribir: `, error);

    return { message: "Error trying to subscribe, try again later." };
  }
};

export const vodacomWapSubscribeAction = async (
  msisdn: string,
  transaction_id: string
) => {
  try {
    const response = await axios.post(
      "https://vodacom-za-product-offering-qualification-1040674388597.us-central1.run.app",
      {
        msisdn,
        transaction_id,
      }
    )

    return {
      message: "Success, you will be redirected to Vodacom!",
      url: response.data.relatedParty[0].id,
    };
  } catch (error) {
    console.error(`[VODACOM ACTION ERROR] Error intentando suscribir: `, error);

    return { message: "Error trying to subscribe, try again later." };
  }
};

export const vodacomGetServiceElegibilityAction = async (msisdn: string) => {
  try {
    const response = await axios.post(
      "https://vodacom-za-get-service-eligibility-1040674388597.us-central1.run.app",
      { msisdn }
    );

    return {
      message: "Success, you will be redirected to Vodacom!",
      transaction_id: response.data.sourceTransactionId,
    };
  } catch (error) {
    console.error(`[VODACOM ACTION ERROR] Error intentando suscribir: `, error);

    throw error;
  }
};

const unsubscribeActionSchema = z.object({
  msisdn: z.string(),
  serviceName: z.string(),
  providerName: z.string(),
  operatorName: z.string(),
})

export const unsubscribeAction = async (initialState: {
  msisdn: string,
  serviceName: string,
  providerName: string,
  operatorName: string
},
  formData: FormData) => {
  try {
    const validatedFields = unsubscribeActionSchema.safeParse({
      msisdn: formData.get("msisdn"),
      serviceName: formData.get("serviceName"),
      providerName: formData.get("providerName"),
      operatorName: formData.get("operatorName")
    })

    if (!validatedFields.success) {
      return {
        message: "Error trying to unsubscribe, try again later.",
      }
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/ph/subscriptions/pg/unsubscribe`, {
      msisdn: validatedFields.data.msisdn,
      serviceName: validatedFields.data.serviceName,
      providerName: validatedFields.data.providerName,
      operatorName: validatedFields.data.operatorName
    })

    return response.data
  } catch (error) {
    console.error(`[UNSUBSCRIBE ACTION ERROR] Error intentando suscribir: `, error);

    throw error;
  }
}