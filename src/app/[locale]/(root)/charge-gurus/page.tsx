import { ChargeGurusPage } from "@/modules/charge-gurus/charge-gurus-page";

interface ChargeGurusRouteProps {
  searchParams: Promise<{ origin?: string }>;
}

export default async function ChargeGurusRoute({
  searchParams,
}: ChargeGurusRouteProps) {
  const { origin } = await searchParams;

  return <ChargeGurusPage origin={origin} />;
}
