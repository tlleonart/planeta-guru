import { getTranslations } from "next-intl/server"
import type { FC } from "react"
import { BaseModal } from "./base-modal"
import { UserProfile } from "@clerk/nextjs"

 interface EditUserModalProps {
    onClose: () => void
}

const EditUserModal: FC<EditUserModalProps> = async ({ onClose }) => {
    const t = await getTranslations("EditUser")

    return (
        <BaseModal onClose={onClose} title={t('title')}>
            <UserProfile
                routing="hash"
                appearance={{
                    elements: {
                        navbar: "!hidden",
                        profileSection__emailAddresses: "!hidden",
                        profileSection__phoneNumbers: "!hidden",
                        profileSection__connectedAccounts: "!hidden",
                        cardBox: "!h-fit !w-fit !shadow-none",
                        header: "!hidden",
                        actionCard: "!rounded-none",
                        profileSectionTitleText: "!text-base",
                        profileSectionPrimaryButton: "!text-base",
                        userPreviewMainIdentifier: "!text-base",
                        profileSectionItem: "!text-base",
                        formFieldInput: "!rounded-none",
                        avatarImageActionsUpload: "!rounded-none"
                    }
                }} 
            />
        </BaseModal>
    )
}

export default EditUserModal