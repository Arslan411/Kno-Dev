import { View } from "react-native";
import { Icon, SV } from "src/components/Themed";
import { Colors } from "src/constants/Colors";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import { CommonActions } from "@react-navigation/native";
import AuthHeader from "src/components/AuthHeader";
import { Slider } from "src/components/Slider";
import { Path, Svg } from "react-native-svg";

const RegistrationSuccessScreen = ({
  navigation,
}: RootStackScreenProps<"RegistrationSuccess">) => {
  const navigateToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  return (
    <SV
      style={{
        flex: 1,
      }}
    >
      <AuthHeader logoCentered />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
      >
        <Slider
          text="Registered Successfully"
          onEndReached={navigateToLogin}
          sliderElement={
            <View
              style={{
                backgroundColor: Colors.sliderGreen,
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderRadius: 50,
                width: 48,
                height: 48,
                marginTop: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <Path
                  d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                  stroke="#F2F2EF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          }
          containerStyle={{
            backgroundColor: "transparent",
            borderRadius: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            width: "100%",
            borderWidth: 1,
            borderColor: Colors.velvet,
            borderBottomWidth: 4,
          }}
        />
      </View>
    </SV>
  );
};

export default RegistrationSuccessScreen;
