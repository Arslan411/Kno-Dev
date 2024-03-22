import { protectedApi } from "./api";

class CouponServices {
  async referralCoupon() {
    const res = await protectedApi.get(
      "/protected/payment/mobile/coupon/referral"
    );
    return res;
  }
  async checkoutCoupon() {
    const res = await protectedApi.get(
      "/protected/payment/mobile/coupon/checkout"
    );
    return res;
  }

  async CheckoutSuccess(data: any) {
    console.log("emaill working", data);
    const res = await protectedApi.post("/payment/mobile/user-checkout", {
      email: data,
    });
    return res;
  }
  async freeCoupon() {
    const res = await protectedApi.get("/protected/payment/mobile/coupon/free");
    return res;
  }
}

export default new CouponServices();
