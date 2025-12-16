/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */

"use client"

import dynamic from 'next/dynamic'
import type { FC } from 'react'
import type { ModalType } from '@/modules/shared/stores/modal-store'
import { useModalStore } from '../../providers/modal-store-provider'

const AuthenticateModal = dynamic(() => import('./authenticate-modal'))
const EditUserModal = dynamic(() => import('./edit-user-modal'))

const MODAL_COMPONENTS: Record<Exclude<ModalType, null>, FC<any>> = {
  Authenticate: AuthenticateModal as FC,
  EditUser: EditUserModal as FC
};

export const ModalRenderer: FC = () => {
    const { type, props, isOpen, closeModal } = useModalStore((state) => ({
        type: state.type,
        props: state.props,
        isOpen:state.isOpen,
        closeModal: state.closeModal
    }))

    if (!isOpen || !type) {
        return null
    }

    const SpecificModal = MODAL_COMPONENTS[type]

    return (
        <SpecificModal {...props} onClose={closeModal} />
    )
}