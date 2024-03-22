import {
  EditPhoneNumberFormType,
  EditPhoneNumberVerifyOTPFormType,
  EditReferringEmailFormType,
} from "src/types/FormTypes";
import { protectedApi, testManagementApi } from "./api";
import * as SecureStore from "expo-secure-store";
import {
  EditProfileFormDataType,
  EditProfileReqDataType,
} from "src/types/AuthTypes";

type ChangeNameFormType = {
  firstName: string;
  lastName: string;
};

export type ChangePasswordFormType = {
  password: string;
  otp: number;
};

class ProfileServices {
  async fetchProfile() {
    const res = await protectedApi.get("/protected/user/mobile/profile");
    return res;
  }

  async changeName(name: ChangeNameFormType) {
    const res = await protectedApi.post("/user/protected/edit-name", name);
    return res;
  }

  async changeReferringEmail(data: EditReferringEmailFormType) {
    const res = await protectedApi.post(
      "/user/protected/edit-referring-email",
      data
    );
    return res;
  }

  async getOtpEditChangeMobile(data: EditPhoneNumberFormType) {
    const res = await protectedApi.post(
      "/user/protected/get-otp-edit-mobile",
      data
    );
    return res;
  }

  async changeMobile(data: EditPhoneNumberVerifyOTPFormType) {
    const res = await protectedApi.post("/user/protected/edit-mobile", data);
    return res;
  }

  async getOtpChangePassword(password: string) {
    const res = await protectedApi.post(
      "/user/protected/get-otp-change-password",
      { password }
    );
    return res;
  }

  async changePassword(form: ChangePasswordFormType) {
    const res = await protectedApi.post(
      "/user/protected/change-password",
      form
    );
    return res;
  }

  async editProfile(form: EditProfileReqDataType) {
    const res = await protectedApi.put("/protected/user/mobile/edit", form);
    return res;
  }

  async deleteAccount() {
    const res = await protectedApi.delete("/protected/user/mobile/delete");
    return res;
  }

  async updateProfileImage(profilePicture: any) {
    const res = await protectedApi.put(
      "/protected/user/mobile/upload",
      profilePicture,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  }

  async deleteProfileImage() {
    const res = await protectedApi.delete("/protected/user/mobile/profile-pic");
    return res;
  }

  async fetchFaqs() {
    const res = await protectedApi.get("/user/mobile/faq");
    return res;
  }

  async fetchState() {
    const res = await testManagementApi.get("/test/mobile/states");
    return res;
  }
  async fetchCities(stateId: any) {
    const res = await testManagementApi.get(`/test/mobile/city/${stateId}`);
    return res;
  }
}

export default new ProfileServices();
