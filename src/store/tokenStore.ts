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

export type TokenState = {
  accessToken: string | null;
  refreshToken: string | null;
  authenticated: boolean;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  clear: () => void;
};

const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      authenticated: false,

      setAccessToken: (accessToken: string) => {
        SecureStore.setItemAsync("accessToken", accessToken);
        set(() => ({
          accessToken,
        }));
      },

      setRefreshToken: (refreshToken: string) => {
        SecureStore.setItemAsync("refreshToken", refreshToken);
        set(() => ({
          refreshToken,
        }));
      },

      setIsAuthenticated: (authenticated: boolean) => {
        set(() => ({
          authenticated,
        }));
      },

      clear: async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        set(() => ({
          accessToken: null,
          refreshToken: null,
          authenticated: false,
        }));
      },
    }),
    {
      name: "token",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useTokenStore;
