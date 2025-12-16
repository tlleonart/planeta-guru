/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

"use client"

import type { FC, MouseEvent, ReactNode } from "react"
import type { ModalType } from "../../stores/modal-store"
import { Span } from "../ui/span"
import { useModalStore } from "../../providers/modal-store-provider"

interface ModalActivatorProps {
    modalType: ModalType
    modalProps: Record<string, any>
    children: ReactNode
}

export const ModalActivator: FC<ModalActivatorProps> = ({
    modalType,
    modalProps,
    children
}) => {
    const openModal = useModalStore((state) => state.openModal)

    const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        if (modalType) {
            openModal(modalType, modalProps)
        }
    }

    return (
        <Span onClick={handleClick}>
            {children}
        </Span>
    )
}