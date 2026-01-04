import { ModalActivator } from "@/modules/shared/components/modals/modal-activator"
import Image from "next/image"
import { FC } from "react"

interface ProfileCardAvatarCardProps {
    avatarUrl?: string | null
}

export const ProfileCardAvatar: FC<ProfileCardAvatarCardProps> = ({ avatarUrl }) => {
    return (
        <ModalActivator modalType="EditUser" modalProps={{}}>
            <div
                className="relative h-16 md:h-20 w-16 md:w-20 rounded-full overflow-hidden cursor-pointer"
            >
                {avatarUrl && (
                    <Image
                        alt="Profile avatar"
                        src={avatarUrl}
                        fill
                        style={{ objectFit: "cover" }}
                        className="relative overflow-hidden"
                    />
                )}
            </div>
        </ModalActivator>
    )
}