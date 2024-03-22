import { Image } from "react-native";

const IconIphone = () => {
  return (
    <Image
      source={require("src/assets/selfie.png")}
      style={{ width: 24, height: 24 }}
    />
  );
};

export default IconIphone;
