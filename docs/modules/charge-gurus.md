# Modulo Charge Gurus

## Vision General

El modulo Charge Gurus permite a los usuarios recargar GURUs (la moneda virtual de la plataforma) mediante diferentes metodos de pago.

## Estructura de Archivos

```
src/modules/charge-gurus/
├── actions/
│   └── gurus-payment-action.ts    # Server Action para procesar pagos
├── components/
│   ├── pack-card.tsx              # Card de pack de GURUs
│   ├── pack-list.tsx              # Lista de packs disponibles
│   ├── payment-method-card.tsx    # Card de metodo de pago
│   ├── payment-methods-list.tsx   # Lista de metodos de pago
│   ├── payment-summary-modal.tsx  # Modal de resumen de pago
│   └── subscription-card.tsx      # Card de suscripcion (Mexico)
├── services/
│   └── payment-service.ts         # Servicio de pagos
├── charge-gurus-page.tsx          # Pagina principal
└── payment-detail-page.tsx        # Pagina de detalle de pago
```

## Flujo de Recarga

```
1. Usuario navega a /charge-gurus
          |
          v
2. Ve lista de packs disponibles
          |
          v
3. Selecciona un pack
          |
          v
4. Redirige a /charge-gurus/payments/[packId]/[guruAmount]/[price]/[fee]/[total]
          |
          v
5. Ve metodos de pago disponibles
          |
          v
6. Selecciona metodo de pago
          |
          v
7. Se abre modal de confirmacion
          |
          v
8. Confirma pago → Server Action procesa
          |
          v
9. Redirige a pasarela de pago externa (MercadoPago, etc.)
```

## Componentes

### ChargeGurusPage

Pagina principal que muestra los packs disponibles.

```typescript
// src/modules/charge-gurus/charge-gurus-page.tsx
import type { FC } from "react";
import { api } from "@/app/server/server";
import { PackList } from "./components/pack-list";
import { SubscriptionCard } from "./components/subscription-card";

export const ChargeGurusPage: FC = async () => {
  const packs = await api.packs.list();

  return (
    <main className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Cargar GURUs</h1>
        <p className="text-muted-foreground">
          Selecciona la cantidad de GURUs que deseas cargar
        </p>
      </header>

      {/* Card de suscripcion solo para Mexico */}
      <SubscriptionCard />

      <PackList packs={packs} />
    </main>
  );
};
```

### PackCard

Card individual de pack de GURUs.

```typescript
// src/modules/charge-gurus/components/pack-card.tsx
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PackCardProps {
  pack: Pack;
}

export const PackCard: FC<PackCardProps> = ({ pack }) => {
  const href = `/charge-gurus/payments/${pack.id}/${pack.guruAmount}/${pack.prices.price}/${pack.prices.transactionCost}/${pack.prices.totalPrice}`;

  return (
    <Link href={href}>
      <Card
        data-testid="pack-card"
        className={cn(
          "cursor-pointer transition-all hover:shadow-lg hover:scale-105",
          pack.offered && "border-primary ring-2 ring-primary"
        )}
      >
        <CardContent className="p-6 text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {pack.guruAmount}
          </div>
          <div className="text-sm text-muted-foreground mb-4">GURUs</div>

          <div className="border-t pt-4">
            <div className="text-2xl font-semibold">
              ${pack.prices.totalPrice}
            </div>
            {pack.prices.transactionCost > 0 && (
              <div className="text-xs text-muted-foreground">
                Incluye ${pack.prices.transactionCost} de comision
              </div>
            )}
          </div>

          {pack.offered && (
            <div className="mt-2 text-xs text-primary font-semibold">
              Recomendado
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
```

### PaymentDetailPage

Pagina de seleccion de metodo de pago.

```typescript
// src/modules/charge-gurus/payment-detail-page.tsx
import type { FC } from "react";
import { api } from "@/app/server/server";
import { PaymentMethodsList } from "./components/payment-methods-list";

interface PaymentDetailPageProps {
  packId: number;
  guruAmount: number;
  price: number;
  transactionCost: number;
  totalPrice: number;
}

export const PaymentDetailPage: FC<PaymentDetailPageProps> = async ({
  packId,
  guruAmount,
  price,
  transactionCost,
  totalPrice,
}) => {
  const paymentMethods = await api.packs.getPaymentMethods();

  return (
    <main className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Selecciona tu metodo de pago</h1>
        <p className="text-muted-foreground">
          Estas por cargar {guruAmount} GURUs por ${totalPrice}
        </p>
      </header>

      <PaymentMethodsList
        methods={paymentMethods}
        packDetails={{
          packId,
          guruAmount,
          price,
          transactionCost,
          totalPrice,
        }}
      />
    </main>
  );
};
```

### PaymentMethodCard

```typescript
// src/modules/charge-gurus/components/payment-method-card.tsx
"use client";

import type { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useModalStore } from "@/modules/shared/stores/modal-store";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  packDetails: PackDetails;
}

export const PaymentMethodCard: FC<PaymentMethodCardProps> = ({
  method,
  packDetails,
}) => {
  const { openModal } = useModalStore();

  const handleClick = () => {
    openModal("paymentSummary", {
      method,
      ...packDetails,
    });
  };

  return (
    <Card
      data-testid={`payment-method-${method.type}`}
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <img
          src={method.iconUrl}
          alt={method.name}
          className="w-12 h-12 object-contain"
        />
        <div>
          <h3 className="font-semibold">{method.name}</h3>
          <p className="text-sm text-muted-foreground">{method.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
```

### PaymentSummaryModal

```typescript
// src/modules/charge-gurus/components/payment-summary-modal.tsx
"use client";

import type { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/modules/shared/stores/modal-store";
import { gurusPaymentAction } from "../actions/gurus-payment-action";

export const PaymentSummaryModal: FC = () => {
  const { activeModal, modalProps, closeModal } = useModalStore();
  const isOpen = activeModal === "paymentSummary";

  const handleConfirm = async () => {
    const result = await gurusPaymentAction({
      packId: modalProps.packId,
      paymentMethod: modalProps.method.type,
    });

    if (result.redirectUrl) {
      window.location.href = result.redirectUrl;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent data-testid="payment-summary-modal">
        <DialogHeader>
          <DialogTitle>Resumen de compra</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>GURUs:</span>
            <span className="font-bold">{modalProps.guruAmount} GURUs</span>
          </div>
          <div className="flex justify-between">
            <span>Precio:</span>
            <span>${modalProps.price}</span>
          </div>
          {modalProps.transactionCost > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Comision:</span>
              <span>${modalProps.transactionCost}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${modalProps.totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Metodo de pago:</span>
            <span>{modalProps.method?.name}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={closeModal} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Confirmar pago
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

## Server Action

```typescript
// src/modules/charge-gurus/actions/gurus-payment-action.ts
"use server";

import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { paymentService } from "../services/payment-service";
import { getRequestContext } from "@/modules/http/helpers";

interface GurusPaymentInput {
  packId: number;
  paymentMethod: PaymentMethodType;
}

interface GurusPaymentResult {
  success: boolean;
  redirectUrl?: string;
  error?: string;
}

export async function gurusPaymentAction(
  input: GurusPaymentInput
): Promise<GurusPaymentResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Usuario no autenticado",
      };
    }

    const ctx = await getRequestContext();

    const result = await paymentService.initiatePayment({
      packId: input.packId,
      paymentMethod: input.paymentMethod,
      context: ctx,
    });

    return {
      success: true,
      redirectUrl: result.paymentUrl,
    };
  } catch (error) {
    console.error("Payment error:", error);
    return {
      success: false,
      error: "Error al procesar el pago",
    };
  }
}
```

## Rutas

```typescript
// src/app/[locale]/(root)/charge-gurus/page.tsx
import { ChargeGurusPage } from "@/modules/charge-gurus/charge-gurus-page";

export default function ChargeGurusRoute() {
  return <ChargeGurusPage />;
}

// src/app/[locale]/(root)/charge-gurus/payments/[...pack]/page.tsx
import { PaymentDetailPage } from "@/modules/charge-gurus/payment-detail-page";

export default async function PaymentDetailRoute({
  params,
}: { params: Promise<{ pack: string[] }> }) {
  const { pack } = await params;
  const [packId, guruAmount, price, transactionCost, totalPrice] = pack.map(Number);

  return (
    <PaymentDetailPage
      packId={packId}
      guruAmount={guruAmount}
      price={price}
      transactionCost={transactionCost}
      totalPrice={totalPrice}
    />
  );
}
```

## API Utilizada

| Endpoint | Descripcion |
|----------|-------------|
| `api.packs.list()` | Lista de packs disponibles |
| `api.packs.getPaymentMethods()` | Metodos de pago disponibles |
| `paymentService.initiatePayment()` | Iniciar proceso de pago |

## Metodos de Pago Soportados

| Tipo | Nombre | Disponibilidad |
|------|--------|----------------|
| `CREDIT_CARD` | Tarjeta de credito | Todos |
| `DEBIT_CARD` | Tarjeta de debito | Todos |
| `MERCADO_PAGO` | MercadoPago | LATAM |
| `OXXO` | OXXO | Mexico |
| `PAYPAL` | PayPal | Todos |
| `BANK_TRANSFER` | Transferencia | Seleccionados |

## Consideraciones

### Seguridad

- Los pagos se procesan mediante Server Actions
- Se valida autenticacion antes de procesar
- Los datos sensibles no se exponen al cliente

### UX

- Feedback visual durante procesamiento
- Modal de confirmacion antes de pagar
- Redireccion automatica a pasarela

### Localizacion

- Precios en moneda local
- Metodos de pago segun pais
- Textos traducidos
