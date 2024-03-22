import * as SecureStore from "expo-secure-store";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { create } from "zustand";

const storage: StateStorage = {
  getItem: async (key) => {
    const value = await SecureStore.getItemAsync(key);
    return value;
  },
  setItem: async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export type ModalState = {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  clear: () => void;
};

const useModalStore = create<ModalState>()(
  persist(
    (set) => ({
      modalVisible: false,
      setModalVisible: (modalVisible: boolean) => {
        set(() => ({
          modalVisible,
        }));
      },

      clear: async () => {
        set(() => ({
          modalVisible: false,
        }));
      },
    }),
    {
      name: "modal",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useModalStore;
