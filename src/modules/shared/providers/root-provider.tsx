import { enUS, esES } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { FC, ReactNode } from "react";
import { TRPCProvider } from "../lib/trpc/provider";
import { ModalStoreProvider } from "./modal-store-provider";

interface RootProviderProps {
  children: ReactNode;
  language?: string;
}

export const RootProvider: FC<RootProviderProps> = ({
  children,
  language = "es",
}) => {
  const localization = language === "en" ? enUS : esES;

  return (
    <ClerkProvider localization={localization}>
      <NuqsAdapter>
        <TRPCProvider>
          <ModalStoreProvider>{children}</ModalStoreProvider>
        </TRPCProvider>
      </NuqsAdapter>
    </ClerkProvider>
  );
};
