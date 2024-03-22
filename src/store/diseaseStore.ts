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

type StiType = {
  Id: number;
  UiName: string;
};

export type DiseaseState = {
  stis: StiType[];
  setStis: (stis: StiType[]) => void;
  clear: () => void;
};

const useDiseaseStore = create<DiseaseState>()(
  persist(
    (set) => ({
      stis: [],

      setStis: (stis: StiType[]) => {
        set(() => ({
          stis,
        }));
      },

      clear: async () => {
        set(() => ({
          stis: [],
        }));
      },
    }),
    {
      name: "stis",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useDiseaseStore;
