import { protectedApi } from "./api";

class NotificationServices {
  async addDeviceToken(deviceToken: string) {
    const res = await protectedApi.put(`/protected/auth/mobile/device-token`, {
      deviceToken,
    });
    return res;
  }

  async deleteDeviceToken() {
    const res = await protectedApi.delete(
      `/protected/auth/mobile/device-token`
    );
    return res;
  }

  async fetch(size: number, page: number) {
    const res = await protectedApi.get(
      `/protected/user/mobile/notifications?size=${size}&page=${page}`
    );
    return res;
  }
}

export default new NotificationServices();
