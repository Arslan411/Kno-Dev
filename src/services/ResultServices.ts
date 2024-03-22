import { protectedApi, testManagementApi } from "./api";

class ResultServices {
  async fetchResult(orderId: number) {
    const response = await protectedApi.post(
      "/protected/test/mobile/order-results",
      { orderId: orderId }
    );
    return response;
  }

  async getSti(id: number) {
    const response = await protectedApi.get(`/test/mobile/sti/${id}`);
    return response;
  }

  async createOrder(body: any) {
    const response = await testManagementApi.post("/pubsub/create-order", body);
    return response;
  }
}

export default new ResultServices();
