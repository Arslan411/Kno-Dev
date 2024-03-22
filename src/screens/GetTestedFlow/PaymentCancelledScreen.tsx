import { Image, ScrollView, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import BigColoredButton from "src/components/BigColoredButton";
import HomeHeader from "src/components/HomeScreen/Header";
import { Icon, SV, Text } from "src/components/Themed";
import { Colors } from "src/constants/Colors";
import { HomeStackScreenProps } from "src/types/NavigationTypes";

const PaymentCancelledScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"PaymentCancelled">) => {
  return (
    <SV style={{ flex: 1 }}>
      <HomeHeader />

      <ScrollView
        style={{
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            borderColor: "#37051A",
            borderWidth: 2,
            height: 48,
            width: 48,
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 36,
          }}
        >
          <Icon name="close-thick" size={24} color="#37051A" />
        </View>

        <Text
          textType="bold"
          style={{
            fontSize: 18,
            marginVertical: 24,
            color: Colors.velvet,
            textAlign: "center",
          }}
        >
          Your payment was cancelled.
          {"\n"}
          Please try again.
        </Text>

        <BigColoredButton
          text="Retry Payment"
          onPress={() => {
            navigation.navigate("HasSymptoms", {
              previousSTIs: [],
              IntakeForm: route.params.IntakeForm,
            });
          }}
        />
      </ScrollView>
    </SV>
  );
};

export default PaymentCancelledScreen;
