import { Image, Platform } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const IconSweat = () => {
  return (
    <Image
      source={require("src/assets/notificationBell.png")}
      style={{
        width: 55,
        height: 55,
      }}
    />
  );
};

export default IconSweat;
