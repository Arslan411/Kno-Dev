import { Image, Platform, Pressable } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const SignupUserIcon = ({ onPress }: any) => {
  return (
    <Pressable
      style={{
        width: 100,
        alignItems: "center",
        height: 50,
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <Image
        source={require("src/assets/signupUser.png")}
        style={{
          width: 69,
          height: 69,
        }}
      />
    </Pressable>
  );
};

export default SignupUserIcon;
