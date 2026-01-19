import { PaymentPage } from "@/modules/charge-gurus/payment-page";

interface PaymentsPageRouteProps {
  params: Promise<{
    pack: string[];
  }>;
  searchParams: Promise<{ origin?: string }>;
}

/**
 * Ruta catch-all de Payment Detail
 * - Recibe parámetros: [packValue, id, price, transactionCost, totalPrice, method]
 * - method es opcional (aparece cuando se selecciona un método de pago)
 * - origin es opcional (viene desde query param)
 * - Renderiza PaymentPage con todos los parámetros
 */
export default async function PaymentsPageRoute({
  params,
  searchParams,
}: PaymentsPageRouteProps) {
  const { pack } = await params;
  const { origin } = await searchParams;

  const [packValue, id, price, transactionCost, totalPrice, method] = pack;

  return (
    <PaymentPage
      id={Number(id)}
      pack={packValue}
      price={price}
      transactionCost={transactionCost}
      totalPrice={totalPrice}
      method={method}
      origin={origin}
    />
  );
}
