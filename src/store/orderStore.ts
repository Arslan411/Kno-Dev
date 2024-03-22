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

type Order = {
  clinicalOrderId: string;
  inBoundTrackingNumber: string;
  inBoundTrackingUrl: string;
  kitOrderId: string;
  orderId: number;
  sampleCollectedOn: string;
  shippedOn: string;
  status: string;
  trackingNumber: string;
  trackingUrl: string;
  resultsReleasedOn: string;
};

export type OrderState = {
  order: Order | null;
  setOrder: (order: Order) => void;
  clear: () => void;
};

const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      order: null,
      setOrder: (order: Order) => {
        set(() => ({
          order,
        }));
      },

      clear: async () => {
        set(() => ({
          order: null,
        }));
      },
    }),
    {
      name: "order",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useOrderStore;
