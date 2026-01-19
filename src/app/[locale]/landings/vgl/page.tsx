import { headers } from "next/headers";
import { VodacomLandingPage } from "@/modules/landings/vodacom/vodacom-landing-page";

export default async function VodacomLanding() {
  const msisdn = (await headers()).get("x-api.id");

  return <VodacomLandingPage msisdn={msisdn ?? undefined} />;
}
