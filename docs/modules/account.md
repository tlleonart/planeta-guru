# Modulo Account

## Vision General

El modulo Account gestiona la informacion de la cuenta del usuario, incluyendo su perfil, billetera de GURUs, suscripciones y descargas.

## Estructura de Archivos

```
src/modules/account/
├── components/
│   ├── account-header.tsx         # Header con avatar y nombre
│   ├── wallet-card.tsx            # Card con balance de GURUs
│   ├── wallet-history.tsx         # Historial de transacciones
│   ├── subscription-status.tsx    # Estado de suscripcion telco
│   └── quick-actions.tsx          # Acciones rapidas
└── account-page.tsx               # Pagina principal
```

## AccountPage

```typescript
// src/modules/account/account-page.tsx
import type { FC } from "react";
import { api } from "@/app/server/server";
import { AccountHeader } from "./components/account-header";
import { WalletCard } from "./components/wallet-card";
import { WalletHistory } from "./components/wallet-history";
import { SubscriptionStatus } from "./components/subscription-status";
import { QuickActions } from "./components/quick-actions";

export const AccountPage: FC = async () => {
  const [wallet, walletHistory, subscription] = await Promise.all([
    api.wallet.get(),
    api.wallet.getHistory({ page: 1, limit: 10 }),
    api.subscription.getStatus(),
  ]);

  return (
    <main className="container mx-auto py-8">
      <AccountHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-8">
          <WalletCard wallet={wallet} />
          <WalletHistory history={walletHistory} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <SubscriptionStatus subscription={subscription} />
          <QuickActions />
        </div>
      </div>
    </main>
  );
};
```

## Componentes

### AccountHeader

```typescript
// src/modules/account/components/account-header.tsx
import type { FC } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AccountHeader: FC = async () => {
  const user = await currentUser();

  if (!user) return null;

  return (
    <header className="flex items-center gap-4">
      <Avatar className="w-20 h-20">
        <AvatarImage src={user.imageUrl} alt={user.fullName || "Usuario"} />
        <AvatarFallback>
          {user.firstName?.[0]}
          {user.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{user.fullName}</h1>
        <p className="text-muted-foreground">
          {user.primaryEmailAddress?.emailAddress}
        </p>
      </div>
    </header>
  );
};
```

### WalletCard

```typescript
// src/modules/account/components/wallet-card.tsx
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WalletCardProps {
  wallet: Wallet;
}

export const WalletCard: FC<WalletCardProps> = ({ wallet }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Mi Billetera</span>
          <Link href="/charge-gurus">
            <Button size="sm">Cargar GURUs</Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="text-5xl font-bold text-primary mb-2">
            {wallet.amount.toLocaleString()}
          </div>
          <div className="text-muted-foreground">GURUs disponibles</div>
        </div>
      </CardContent>
    </Card>
  );
};
```

### WalletHistory

```typescript
// src/modules/account/components/wallet-history.tsx
"use client";

import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WalletHistoryProps {
  history: WalletHistory;
}

export const WalletHistory: FC<WalletHistoryProps> = ({ history }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de transacciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="incomes">Ingresos</TabsTrigger>
            <TabsTrigger value="outcomes">Gastos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2 mt-4">
            {[...history.incomes, ...history.outcomes]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
          </TabsContent>

          <TabsContent value="incomes" className="space-y-2 mt-4">
            {history.incomes.map((income) => (
              <TransactionItem key={income.id} transaction={income} type="income" />
            ))}
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-2 mt-4">
            {history.outcomes.map((outcome) => (
              <TransactionItem key={outcome.id} transaction={outcome} type="outcome" />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const TransactionItem: FC<{
  transaction: WalletIncome | WalletOutcome;
  type?: "income" | "outcome";
}> = ({ transaction, type }) => {
  const isIncome = type === "income" || "income" in transaction;

  return (
    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
      <div>
        <div className="font-medium">
          {isIncome ? transaction.purchase : transaction.productName}
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className={cn(
        "font-bold",
        isIncome ? "text-green-600" : "text-red-600"
      )}>
        {isIncome ? "+" : "-"}{isIncome ? transaction.amount : transaction.amount} GURUs
      </div>
    </div>
  );
};
```

### SubscriptionStatus

```typescript
// src/modules/account/components/subscription-status.tsx
import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionStatusProps {
  subscription: TelcoSubscription | null;
}

export const SubscriptionStatus: FC<SubscriptionStatusProps> = ({
  subscription,
}) => {
  if (!subscription) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Suscripcion</span>
          <Badge variant={subscription.isActive ? "default" : "secondary"}>
            {subscription.isActive ? "Activa" : "Inactiva"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Plan:</dt>
            <dd>{subscription.planName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Operador:</dt>
            <dd>{subscription.carrier}</dd>
          </div>
          {subscription.nextBillingDate && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Proxima facturacion:</dt>
              <dd>{new Date(subscription.nextBillingDate).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};
```

### QuickActions

```typescript
// src/modules/account/components/quick-actions.tsx
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Download, HelpCircle, Settings } from "lucide-react";

export const QuickActions: FC = () => {
  const actions = [
    { href: "/profile/favorites", icon: Heart, label: "Favoritos" },
    { href: "/profile/downloads", icon: Download, label: "Descargas" },
    { href: "/help", icon: HelpCircle, label: "Ayuda" },
    { href: "/profile", icon: Settings, label: "Configuracion" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acceso rapido</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button variant="outline" className="w-full flex gap-2">
              <action.icon className="w-4 h-4" />
              {action.label}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
```

## Rutas

```typescript
// src/app/[locale]/(root)/account/page.tsx
import { AccountPage } from "@/modules/account/account-page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AccountRoute() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  return <AccountPage />;
}
```

## API Utilizada

| Endpoint | Descripcion |
|----------|-------------|
| `api.wallet.get()` | Obtiene billetera del usuario |
| `api.wallet.getHistory()` | Historial de transacciones |
| `api.subscription.getStatus()` | Estado de suscripcion telco |

## Profile Module

El modulo Profile complementa Account con paginas adicionales:

### Structure

```
src/modules/profile/
├── components/
│   ├── profile-form.tsx         # Formulario de perfil
│   ├── favorites-grid.tsx       # Grid de favoritos
│   └── downloads-list.tsx       # Lista de descargas
├── profile-page.tsx             # Configuracion de perfil
├── favorites-page.tsx           # Pagina de favoritos
└── downloads-page.tsx           # Pagina de descargas
```

### Rutas

```
/[locale]/profile           → Configuracion de perfil
/[locale]/profile/favorites → Lista de productos favoritos
/[locale]/profile/downloads → Historial de descargas
```

## Consideraciones

### Seguridad

- Todas las paginas de cuenta requieren autenticacion
- Redireccion a sign-in si no esta autenticado
- Datos de usuario obtenidos via Clerk

### UX

- Loading states para datos async
- Tabs para organizar informacion
- Acciones rapidas visibles

### Responsive

- Layout de 2 columnas en desktop
- Stack vertical en mobile
- Cards adaptativas
