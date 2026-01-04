"use client"

import { useStore } from "zustand";
import { createContext, type ReactNode, useContext, useRef } from "react"
import { type ModalStore, createModalStore } from "@/modules/shared/stores/modal-store";

export type ModalStoreApi = ReturnType<typeof createModalStore>

export const ModalStoreContext = createContext<ModalStoreApi | undefined>(undefined)

export interface ModalStoreProviderProps {
    children: ReactNode
}

export const ModalStoreProvider = ({ children }: ModalStoreProviderProps) => {
    const storeRef = useRef<ModalStoreApi | null>(null)

    if (storeRef.current === null) {
        storeRef.current = createModalStore()
    }

    return (
        <ModalStoreContext.Provider value={storeRef.current}>
            {children}
        </ModalStoreContext.Provider>
    )
}

export const useModalStore = <T,>(selector: (store: ModalStore) => T): T => {
    const modalStoreContext = useContext(ModalStoreContext)

    if (!modalStoreContext) {
        throw new Error("useModalStore debe usarse dentro de ModalStoreProvider")
    }

    return useStore(modalStoreContext, selector)
}
