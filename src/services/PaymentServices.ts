import { protectedApi, testManagementApi } from "./api";

class AuthServices {
  async getPlans() {
    const res = await testManagementApi.get(
      "/protected/payment/mobile/products/list"
    );
    return res;
  }

  async createCheckoutSession(productId: number) {
    const res = await protectedApi.post(
      "/protected/payment/mobile/create-checkout-session",
      {
        productId,
      }
    );
    return res;
  }
}

export default new AuthServices();
