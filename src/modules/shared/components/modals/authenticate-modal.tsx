import { getTranslations } from "next-intl/server"
import type { FC } from "react"
import { BaseModal } from "./base-modal"
import { LoginButton } from "../ui/login-button"

interface AuthenticateModalProps {
    onClose: () => void
}

const AuthenticateModal: FC<AuthenticateModalProps> = async ({ onClose }) => {
    const t = await getTranslations("NotLoggedInModal")

    return (
        <BaseModal onClose={onClose} title={t('title')}>
            <div className="flex flex-row w-full gap-4 justify-center">
                <LoginButton />
            </div>
        </BaseModal>
    )
}

export default AuthenticateModal