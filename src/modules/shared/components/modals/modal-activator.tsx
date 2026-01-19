/** biome-ignore-all lint/suspicious/noExplicitAny: Dynamic modal props require flexible typing */

"use client";

import type { FC, MouseEvent, ReactNode } from "react";
import { useModalStore } from "../../providers/modal-store-provider";
import type { ModalType } from "../../stores/modal-store";
import { Span } from "../ui/span";

interface ModalActivatorProps {
  modalType: ModalType;
  modalProps: Record<string, any>;
  children: ReactNode;
}

export const ModalActivator: FC<ModalActivatorProps> = ({
  modalType,
  modalProps,
  children,
}) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (modalType) {
      openModal(modalType, modalProps);
    }
  };

  return <Span onClick={handleClick}>{children}</Span>;
};
