# Modulo Auth

## Vision General

El modulo Auth maneja la autenticacion de usuarios utilizando Clerk. Incluye paginas de sign-in, sign-up y flujos especiales como completar suscripcion.

## Estructura de Archivos

```
src/modules/auth/
├── components/
│   ├── auth-layout.tsx             # Layout para paginas de auth
│   ├── complete-subscription-form.tsx  # Formulario de suscripcion
│   └── social-providers.tsx        # Botones de login social
├── sign-in-page.tsx               # Pagina de inicio de sesion
├── sign-up-page.tsx               # Pagina de registro
└── complete-subscription-page.tsx # Completar suscripcion telco
```

## Configuracion de Clerk

### Variables de Entorno

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
```

### Middleware

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/:locale/account(.*)",
  "/:locale/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
```

## SignInPage

```typescript
// src/modules/auth/sign-in-page.tsx
import type { FC } from "react";
import { SignIn } from "@clerk/nextjs";

export const SignInPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-xl",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "bg-secondary hover:bg-secondary/80",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
            footerActionLink: "text-primary hover:text-primary/80",
          },
        }}
      />
    </div>
  );
};
```

## SignUpPage

```typescript
// src/modules/auth/sign-up-page.tsx
import type { FC } from "react";
import { SignUp } from "@clerk/nextjs";

export const SignUpPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-xl",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "bg-secondary hover:bg-secondary/80",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
            footerActionLink: "text-primary hover:text-primary/80",
          },
        }}
      />
    </div>
  );
};
```

## CompleteSubscriptionPage

Pagina especial para usuarios que llegan desde operadores telco y necesitan completar su registro.

```typescript
// src/modules/auth/complete-subscription-page.tsx
import type { FC } from "react";
import { CompleteSubscriptionForm } from "./components/complete-subscription-form";

export const CompleteSubscriptionPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold">Completa tu suscripcion</h1>
          <p className="text-muted-foreground mt-2">
            Ingresa tu informacion para activar tu suscripcion
          </p>
        </header>

        <CompleteSubscriptionForm />
      </div>
    </div>
  );
};
```

### CompleteSubscriptionForm

```typescript
// src/modules/auth/components/complete-subscription-form.tsx
"use client";

import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/modules/http/trpc-client";

const schema = z.object({
  email: z.string().email("Email invalido"),
  name: z.string().min(2, "Nombre muy corto"),
  msisdn: z.string().regex(/^\d{10}$/, "Numero invalido"),
});

type FormData = z.infer<typeof schema>;

export const CompleteSubscriptionForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const completeSubscription = trpc.subscription.complete.useMutation({
    onSuccess: () => {
      // Redirigir a cuenta
      window.location.href = "/account";
    },
  });

  const onSubmit = (data: FormData) => {
    completeSubscription.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Tu nombre"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="msisdn">Numero de telefono</Label>
        <Input
          id="msisdn"
          {...register("msisdn")}
          placeholder="1234567890"
        />
        {errors.msisdn && (
          <p className="text-sm text-destructive">{errors.msisdn.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || completeSubscription.isPending}
      >
        {isSubmitting || completeSubscription.isPending
          ? "Procesando..."
          : "Completar suscripcion"}
      </Button>
    </form>
  );
};
```

## Rutas

```typescript
// src/app/[locale]/(auth)/auth/sign-in/[[...sign-in]]/page.tsx
import { SignInPage } from "@/modules/auth/sign-in-page";

export default function SignInRoute() {
  return <SignInPage />;
}

// src/app/[locale]/(auth)/auth/sign-up/[[...sign-up]]/page.tsx
import { SignUpPage } from "@/modules/auth/sign-up-page";

export default function SignUpRoute() {
  return <SignUpPage />;
}

// src/app/[locale]/(auth)/auth/complete-subscription/page.tsx
import { CompleteSubscriptionPage } from "@/modules/auth/complete-subscription-page";

export default function CompleteSubscriptionRoute() {
  return <CompleteSubscriptionPage />;
}
```

## Layout de Auth

Las paginas de auth usan un layout minimo sin header ni footer.

```typescript
// src/app/[locale]/(auth)/layout.tsx
import type { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {children}
    </div>
  );
};

export default AuthLayout;
```

## Hooks de Autenticacion

### Verificar Autenticacion

```typescript
// En Server Components
import { auth } from "@clerk/nextjs/server";

export const ProtectedPage: FC = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Contenido protegido
};
```

### Obtener Usuario Actual

```typescript
// En Server Components
import { currentUser } from "@clerk/nextjs/server";

export const UserProfile: FC = async () => {
  const user = await currentUser();

  return (
    <div>
      <img src={user?.imageUrl} alt={user?.fullName || ""} />
      <h1>{user?.fullName}</h1>
    </div>
  );
};
```

### En Client Components

```typescript
"use client";

import { useAuth, useUser } from "@clerk/nextjs";

export const UserMenu: FC = () => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  if (!isSignedIn) {
    return <Link href="/auth/sign-in">Iniciar sesion</Link>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.imageUrl} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => signOut()}>
          Cerrar sesion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

## Proteccion de Rutas

### En tRPC

```typescript
// Procedure protegido
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

// Uso en router
export const accountRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    // ctx.userId esta garantizado
    return profileService.get(ctx.userId, ctx.requestContext);
  }),
});
```

## Flujo de Autenticacion Telco

1. Usuario llega desde landing de operador (ej: /landings/vgl)
2. Se captura MSISDN de query params o headers
3. Se guarda MSISDN en cookie
4. Usuario se redirige a complete-subscription
5. Usuario completa formulario
6. Se crea cuenta y se vincula con suscripcion telco
7. Usuario redirigido a cuenta

## Consideraciones

### Seguridad

- Tokens JWT manejados por Clerk
- Middleware protege rutas sensibles
- CSRF protegido por defecto

### UX

- Persistencia de sesion entre tabs
- Refresh de tokens automatico
- Redirect a pagina anterior despues de login

### Personalizacion

- Appearance API de Clerk para estilos
- Componentes custom para formularios especiales
- Integracion con sistema de i18n
