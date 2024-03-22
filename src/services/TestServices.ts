import { SampleCollectionData } from "src/screens/Dashboard/SampleCollectionScreen";
import { protectedApi, testManagementApi } from "./api";

class TestServices {
  async getSTIList() {
    const res = await protectedApi.get("/test/mobile/sti");
    return res;
  }

  async getSymptomsList() {
    const res = await protectedApi.get("/test/mobile/symptoms");
    return res;
  }

  async getPlans() {
    const res = await protectedApi.get(
      "/protected/payment/mobile/products/list"
    );
    return res;
  }

  async saveIntakeDetails(IntakeFormData: any) {
    const res = await testManagementApi.post(
      "/protected/test/mobile/intake-details",
      IntakeFormData
    );
    return res;
  }

  async fetchOrderStatus() {
    const res = await testManagementApi.get(
      "/protected/test/mobile/order-status"
    );
    return res;
  }

  async updateSampleCollectionDate(data: SampleCollectionData) {
    const res = await protectedApi.put(
      "/protected/test/mobile/order-collection",
      data
    );
    return res;
  }
}

export default new TestServices();
