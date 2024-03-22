import axios from "axios";
import * as SecureStore from "expo-secure-store";
import useDiseaseStore from "src/store/diseaseStore";
import useOrderStore from "src/store/orderStore";
import useResultStore from "src/store/resultStore";
import useSampleCollectionStore from "src/store/sampleCollectionStore";
import useTokenStore from "src/store/tokenStore";
import useUserStore from "src/store/userStore";

export const api = axios.create({
  baseURL: "https://kno-gateway-ar413sd3.uc.gateway.dev",
  headers: {
    "Content-Type": "application/json",
  },
});
// http://localhost:3000/auth/mobile/login
// https://kno-ak01so42.uc.gateway.dev
// https://kno-gateway-ar413sd3.uc.gateway.dev

export const protectedApi = axios.create({
  baseURL: "https://kno-gateway-ar413sd3.uc.gateway.dev",
  headers: {
    "Content-Type": "application/json",
  },
});
export const testManagementApi = axios.create({
  baseURL: "https://kno-gateway-ar413sd3.uc.gateway.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

const updateLocalAccessToken = async (accessToken: string) => {
  useTokenStore.getState().setAccessToken(accessToken);
  await SecureStore.setItemAsync("accessToken", accessToken);
};

const removeLocalTokens = async () => {
  await useOrderStore.getState().clear();
  await useDiseaseStore.getState().clear();
  await useTokenStore.getState().clear();
  await useUserStore.getState().clear();
  await useSampleCollectionStore.getState().clear();
  await useResultStore.getState().clear();
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};

protectedApi.interceptors.request.use(
  async (config: any) => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

testManagementApi.interceptors.request.use(
  async (config: any) => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

protectedApi.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/auth/mobile/login" && err.response) {
      if (
        err.response.status === 401 &&
        err.response?.data?.message === "Invalid Token" &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;

        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        try {
          const res = await api.post("/auth/mobile/token", {
            refreshToken,
          });
          const { accessToken } = res.data.data[0];
          updateLocalAccessToken(accessToken);
          return api(originalConfig);
        } catch (_error) {
          await removeLocalTokens();
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);
