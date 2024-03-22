import { useEffect } from "react";
import { Image, ScrollView, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Path, Svg } from "react-native-svg";
import BigColoredButton from "src/components/BigColoredButton";
import HomeHeader from "src/components/HomeScreen/Header";
import { SV, Text } from "src/components/Themed";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import analytics from "@react-native-firebase/analytics";
import CouponServices from "src/services/CouponServices";
import useUserStore from "src/store/userStore";
import { err } from "react-native-svg/lib/typescript/xml";
import UserHeader from "src/components/HomeScreen/UserHeader";
import Cards from "src/components/Cards/Cards";
import { images } from "src/utils/Images";

const PaymentSuccessScreen = ({
  navigation,
}: HomeStackScreenProps<"PaymentSuccess">) => {
  const user = useUserStore((state) => state.user);

  async function handleCheckoutSuccess() {
    try {
      const res = await CouponServices.CheckoutSuccess(user?.primaryEmail);

      if (res.status === 200) {
      }
    } catch (error: any) {
      console.log("err in payment screenn----", error);
    }
  }

  useEffect(() => {
    handleCheckoutSuccess();
    analytics().logEvent("Checkout", { parameters: null });
  }, []);

  return (
    <SV>
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <UserHeader />
        <View
          style={{
            marginHorizontal: 5,
          }}
        >
          <Cards
            isTitle={true}
            imageHeaderTxt="Thank you for your order!"
            buttonTitle="View Order Status"
            bodyText=" Your knō kit is on it’s way.Your kit contains collection and return instructions. "
            imageCard
            imageSource={images.cardImgNew}
            width={RFPercentage(20)}
            customStyles={{ marginVertical: 10 }}
            // onPress={() => navigation.navigate("IntakeForm")}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "OrderStatus" }],
              });
            }}
            imageStyles={{
              height: RFPercentage(30),
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              width: "100%",
            }}
          />
        </View>
      </ScrollView>
    </SV>
  );
};

export default PaymentSuccessScreen;
