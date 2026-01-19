/** biome-ignore-all lint/a11y/noStaticElementInteractions: Modal backdrop requires click handler on div */
/** biome-ignore-all lint/suspicious/noExplicitAny: Dynamic modal props require flexible typing */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Keyboard events handled by Dialog component */

"use client";

import dynamic from "next/dynamic";
import type { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ModalType } from "@/modules/shared/stores/modal-store";
import { useModalStore } from "../../providers/modal-store-provider";

const AuthenticateModal = dynamic(() => import("./authenticate-modal"));
const EditUserModal = dynamic(() => import("./edit-user-modal"));
const ComboSummaryModal = dynamic(() => import("./combo-summary-modal"));
const InsufficientGurusModal = dynamic(
  () => import("./insufficient-gurus-modal"),
);
const BuyBundleModal = dynamic(() => import("./buy-bundle-modal"));
const ErrorModal = dynamic(() => import("./error-modal"));
const ConfirmationModal = dynamic(() => import("./confirmation-modal"));

const MODAL_COMPONENTS: Partial<Record<Exclude<ModalType, null>, FC<any>>> = {
  Authenticate: AuthenticateModal as FC,
  EditUser: EditUserModal as FC,
  ComboSummary: ComboSummaryModal as FC,
  InsufficientGurus: InsufficientGurusModal as FC,
  BuyBundle: BuyBundleModal as FC,
  Error: ErrorModal as FC,
  Confirmation: ConfirmationModal as FC,
};

export const ModalRenderer: FC = () => {
  const type = useModalStore((state) => state.type);
  const props = useModalStore(useShallow((state) => state.props));
  const isOpen = useModalStore((state) => state.isOpen);
  const closeModal = useModalStore((state) => state.closeModal);

  if (!isOpen || !type) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[type];

  if (!SpecificModal) {
    return null;
  }

  return <SpecificModal {...props} onClose={closeModal} />;
};
