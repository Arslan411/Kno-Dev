import { Image, Platform, Pressable } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const CheckIcon = ({ onPress, opacity }: any) => {
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
        source={require("src/assets/checkIcon.png")}
        style={{
          width: 25,
          height: 25,
          opacity: opacity ? opacity : 1,
        }}
      />
    </Pressable>
  );
};

export default CheckIcon;
