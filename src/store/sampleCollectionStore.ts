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

export type SampleCollectionState = {
  sampleCollection: boolean;
  setSampleCollection: (sampleCollection: boolean) => void;
  clear: () => void;
};

const useSampleCollectionStore = create<SampleCollectionState>()(
  persist(
    (set) => ({
      sampleCollection: false,
      setSampleCollection: (sampleCollection: boolean) => {
        set(() => ({
          sampleCollection,
        }));
      },

      clear: async () => {
        set(() => ({
          sampleCollection: false,
        }));
      },
    }),
    {
      name: "sampleCollection",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useSampleCollectionStore;
