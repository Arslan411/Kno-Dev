import * as SecureStore from "expo-secure-store";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { create } from "zustand";
import { ResultResponse } from "src/screens/Result/ResultScreen";

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

export type ResultState = {
  result: ResultResponse | null;
  setResult: (result: ResultResponse) => void;
  clear: () => void;
};

const useResultStore = create<ResultState>()(
  persist(
    (set) => ({
      result: null,

      setResult: (result: ResultResponse) => {
        set(() => ({
          result,
        }));
      },

      clear: async () => {
        set(() => ({
          result: null,
        }));
      },
    }),
    {
      name: "result",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useResultStore;
