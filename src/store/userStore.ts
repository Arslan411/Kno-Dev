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

type User = {
  primaryEmail: string;
  referringEmail: string;
  mobile: string;
  firstName: string;
  lastName: string;
  profilePic: string | null;
  address1: string;
  address2: string;
  state: string;
  city: string;
  zipCode: string;
  gender: any;
  dob: any;

  // Edit profile 
  // Gender: string;
  // Dob: Date | null; 

};

export type UserState = {
  user: User | null;
  isFirstTime: boolean;
  hasResult: boolean;
  isNewUser: boolean;
  isNewUserFcm: boolean;
  setIsFirstTime: (isFirstTime: boolean) => void;
  setNewUserFcm:(isNewUserFcm: boolean)=> void;
  setIsNewUser: (isFirstTime: boolean) => void;
  setUser: (user: User) => void;
  setHasResult: (hasResult: boolean) => void;
  clear: () => void;
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isFirstTime: true,
      hasResult: false,
      isNewUser: true,
      isNewUserFcm:true,
      
      setUser: (user: User) => {
        set(() => ({
          user,
        }));
      },

      setIsFirstTime: (isFirstTime: boolean) => {
        set(() => ({
          isFirstTime,
        }));
      },

      setNewUserFcm: (isNewUserFcm: boolean) => {
        set(() => ({
          isNewUserFcm,
        }));
      },


      setIsNewUser: (isNewUser: boolean) => {
        set(() => ({
          isNewUser,
        }));
      },

      setHasResult: (hasResult: boolean) => {
        set(() => ({
          hasResult,
        }));
      },

      clear: async () => {
        set(() => ({
          user: null,
          isFirstTime: true,
        }));
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useUserStore;
