import { SV, Text } from "src/components/Themed";
import { openInbox } from "react-native-email-link";
import { Platform, ScrollView, View } from "react-native";
import { Colors } from "src/constants/Colors";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import { CommonActions } from "@react-navigation/native";
import AuthHeader from "src/components/AuthHeader";
import BigColoredButton from "src/components/BigColoredButton";

const OpenEmailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"OpenEmail">) => {
  const email = route.params?.email;

  const open = () => {
    if (Platform.OS === "android") {
      openInbox({
        app: "gmail",
      });
    } else {
      openInbox();
    }
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: "Login" }],
    //   })
    // );
  };

  return (
    <SV style={{ flex: 1 }}>
      <AuthHeader text="forgot something" subText="Reset Your Password" />

      <ScrollView
        style={{ flex: 1, marginHorizontal: 16, paddingTop: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            gap: 16,
            marginTop: 32,
          }}
        >
          <Text
            textType="LBBold"
            style={{ fontSize: 24, textAlign: "center", color: Colors.velvet }}
          >
            Check your email
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: Colors.velvet,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            We’ve sent a password reset link to {`\n`} {email}
          </Text>

          <BigColoredButton onPress={open} text="Open Email" horizontal />
        </View>
      </ScrollView>
    </SV>
  );
};

export default OpenEmailScreen;
