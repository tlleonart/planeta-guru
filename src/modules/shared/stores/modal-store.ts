/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

import { createStore } from 'zustand';

export type ModalType = 'Authenticate' | 'EditUser' |null;

export type ModalState = {
  type: ModalType;
  props: Record<string, any>;
  isOpen: boolean;
};

export type ModalActions = {
  openModal: (type: ModalType, props?: Record<string, any>) => void;
  closeModal: () => void;
};

export type ModalStore = ModalState & ModalActions;

const defaultInitialState: ModalState = {
  type: null,
  props: {},
  isOpen: false,
};

export const createModalStore = (initState: ModalState = defaultInitialState) => {
  return createStore<ModalStore>((set) => ({
    ...initState,
    openModal: (type, props = {}) => set({ type, props, isOpen: true }),
    closeModal: () => set({ type: null, props: {}, isOpen: false }),
  }));
};