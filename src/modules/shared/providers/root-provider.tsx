import type { FC, ReactNode } from "react";
import { ModalStoreProvider } from "./modal-store-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "../lib/trpc/provider";

interface RootProviderProps {
  children: ReactNode;
}

export const RootProvider: FC<RootProviderProps> = ({ children }) => {
  return (
    <ClerkProvider>
      <TRPCProvider>
        <ModalStoreProvider>{children}</ModalStoreProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
};
