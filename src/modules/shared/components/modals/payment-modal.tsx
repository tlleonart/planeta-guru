"use client"

import { useTranslations } from "next-intl"
import { FC, MouseEvent, useState } from "react"
import { useModalStore } from "../../providers/modal-store-provider"

interface PaymentModalProps {
    id: string
    value: number
    totalPrice: number
    origin?: string
    realIp?: string
    onClose: () => void
}

const PaymentModal: FC<PaymentModalProps> = ({
    id,
    value,
    totalPrice,
    origin,
    realIp,
    onClose
}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const t = useTranslations("PaymentModal")

    const openModal = useModalStore((state) => state.openModal)

    const currencyTitleClass = "text-sm sm:text-base md:text-lg ";
    const currencyValueClass = "text-sm sm:text-base md:text-lg ";

    const handleConfirm = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setLoading(true)

        try {
            const currentOrigin = origin ?? window.location.pathname
            const customSuccessUrl = `${window.location.origin}${currentOrigin}`

            const payload = {
                guru_pack_id: id,
                payment_method: 'CARD',
                custom_success_url: customSuccessUrl,
                user_ip_address: realIp ?? null
            }

            const response = await gurusPayment
        }
    }
}