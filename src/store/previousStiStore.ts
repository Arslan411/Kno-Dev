import * as SecureStore from "expo-secure-store";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { create } from "zustand";
import { ResultType } from "src/components/Results/ResultLabel";

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

export type previousStiType = {
  email: string;
  stis: number[];
};

export type previousStiState = {
  previousStis: previousStiType[];
  setPreviousSti: (previousStis: previousStiType[]) => void;
  clear: () => void;
};

const usepreviousStiStore = create<previousStiState>()(
  persist(
    (set) => ({
      previousStis: [],

      setPreviousSti: (previousStis: previousStiType[]) => {
        set(() => ({
          previousStis,
        }));
      },

      clear: async () => {
        set(() => ({
          previousStis: [],
        }));
      },
    }),
    {
      name: "stis",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default usepreviousStiStore;
