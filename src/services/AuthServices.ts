import {
  ForgotPasswordDataType,
  LoginFormDataType,
  RegisterVerifyOTPDataType,
  ResetPasswordDataType,
} from "src/types/AuthTypes";
import { api, protectedApi } from "./api";
import * as SecureStore from "expo-secure-store";
import useTokenStore from "src/store/tokenStore";

type GetRegisterOTPDataType = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  referringEmail: string | null;
  password: string;
};

class AuthServices {
  async getOtpLogin(data: LoginFormDataType) {
    const res = await api.post("/auth/mobile/otp/login", data);
    return res;
  }

  async socialAuthLogin(data: any) {
    const res = await api.post("user/mobile/create-google-login", data);
    return res;
  }

  async checkUserValidate(data: any) {
    const res = await api.post("user/mobile/check-email-phone", data);
    return res;
  }

  async intakeWithSignup(data: any) {
    const res = await api.post("/user/mobile/create-user-with-intake", data);
    return res;
  }

  async socialAppleAuth(data: any) {
    const res = await api.post("/user/mobile/create-apple-login", data);
    return res;
  }

  async getOtpRegister(data: GetRegisterOTPDataType) {
    const res = await api.post("/user/mobile/otp/create-user", data);
    return res;
  }

  async register(data: RegisterVerifyOTPDataType) {
    const res = await protectedApi.post("/user/mobile/create-user", data);
    return res;
  }

  async login(email: string, password: string, otp: string) {
    const { data } = await api.post("/auth/mobile/login", {
      email,
      password,
      otp,
    });
    return data;
  }

  async forgotPassword(data: ForgotPasswordDataType) {
    const res = await api.post("/auth/mobile/forgot-password", data);
    return res;
  }

  async resetPassword(data: ResetPasswordDataType) {
    const res = await api.post("/auth/mobile/reset-password", data);
    return res;
  }

  async fetchAccessToken(token: string) {
    const { data } = await api.post("/auth/mobile/token", {
      refreshToken: token,
    });
    useTokenStore.getState().setAccessToken(data.data[0].accessToken);
    SecureStore.setItemAsync("accessToken", data.data[0].accessToken);
    SecureStore.setItemAsync("refreshToken", data.data[0].refreshToken);
    return data;
  }

  async sendFCMToken(data: string) {
    const res = await api.post("/user/mobile/save-fcm", {
      fcmToken: data,
    });
    return res;
  }

  async logout() {
    const res = await protectedApi.post("/protected/auth/mobile/logout");
    return res;
  }

  async deleteAccount() {
    const res = await protectedApi.delete("/protected/user/mobile/delete");
    return res;
  }
}

export default new AuthServices();
