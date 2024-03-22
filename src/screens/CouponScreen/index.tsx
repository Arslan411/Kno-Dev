import {
  View,
  ScrollView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import HomeHeader from "src/components/HomeScreen/Header";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SV } from "src/components/Themed";
import CouponServices from "src/services/CouponServices";
import React, { useEffect, useState } from "react";
import CouponModal from "src/components/Coupons/CouponModal";
import { Loading } from "src/constants/enums";
import { Colors } from "src/constants/Colors";
import UserHeader from "src/components/HomeScreen/UserHeader";
import useUserStore from "src/store/userStore";

type Coupon = {
  code: string;
  expiry: string;
};
const CouponScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"CouponScreen">) => {
  const [referralCoupon, setReferralCoupon] = useState<Coupon>({
    code: "",
    expiry: "",
  });
  const [freeCoupon, setFreeCoupon] = useState<Coupon>({
    code: "",
    expiry: "",
  });

  const [remainingTimes, setRemainingTimes] = useState<string[]>([]);
  const [checkoutCoupons, setCheckoutCoupons] = useState<Coupon[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const user = useUserStore((state) => state.user);

  const checkoutModalMsg =
    "Share this one time use code with your partner and they can enjoy 20% off. Code expires 5 days after each purchase.";
  const freeCouponModalMessage =
    "For referring 10 friends, you’ve earned a free knō kit. We seriously appreciate helping to build such an incredible community & your support.";
  const freeCouponHeading = "This one is on us!";
  const referralModalMsg = route?.params?.referFriend
    ? `We appreciate that you care about your friends, but we only allow testing for yourself. If you want a friend to get tested here's a code for 10% off.`
    : `Copy the code above and share with friends, partners, lovers, or whoever else. They’ll get 10% off their knō kit.`;
  const referralModalHeading = route?.params?.referFriend
    ? "Refer a friend"
    : "Spread the love";

  const fetchCoupons = async () => {
    setLoading(Loading.loading);
    try {
      const promises = [
        CouponServices.freeCoupon(),
        CouponServices.referralCoupon(),
        CouponServices.checkoutCoupon(),
      ];
      const [res, res1, res2] = await Promise.all(promises);
      setReferralCoupon(res1.data.data[0]);
      setCheckoutCoupons(res2.data.data);
      setFreeCoupon(res.data.data);
      setLoading(Loading.idle);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCoupons();
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCoupons();
    setRefreshing(false);
  }, []);

  const calculateRemainingTime = (expiryDate: string) => {
    const now = new Date();
    const expiryDateObj = new Date(expiryDate);
    if (expiryDateObj <= now) {
      return "Expired";
    }
    const timeDifference = expiryDateObj.getTime() - now.getTime();
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedRemainingTimes = checkoutCoupons.map((coupon) => {
        return calculateRemainingTime(coupon.expiry);
      });
      setRemainingTimes(updatedRemainingTimes);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [checkoutCoupons]);

  return (
    <SV style={{ flex: 1 }}>
      <UserHeader />
      {loading === Loading.loading ? (
        <View
          style={{
            paddingTop: RFPercentage(25),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.velvet} />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, padding: 16 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS === "ios"
                ? RFPercentage(16) + 72
                : RFPercentage(16) + 72,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.velvet]}
            />
          }
        >
          {user && referralCoupon.code ? (
            <CouponModal
              coupon={referralCoupon}
              message={referralModalMsg}
              heading={referralModalHeading}
              remainingTime={""}
            />
          ) : (
            <CouponModal
              coupon={"BHSW9QWI"}
              message={referralModalMsg}
              heading={referralModalHeading}
              remainingTime={""}
            />
          )}
          {checkoutCoupons.length > 0 &&
            checkoutCoupons.map((coupon, index) => (
              <CouponModal
                key={index}
                coupon={coupon}
                message={checkoutModalMsg}
                heading={"Your partner code expires in:"}
                remainingTime={remainingTimes[index] || ""}
              />
            ))}
          {freeCoupon.code && (
            <CouponModal
              coupon={freeCoupon}
              message={freeCouponModalMessage}
              heading={freeCouponHeading}
              remainingTime={""}
            />
          )}
        </ScrollView>
      )}
    </SV>
  );
};
export default CouponScreen;
