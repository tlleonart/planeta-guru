import axios from "axios";

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