import { Image } from "react-native";

const IconHome = () => {
  return (
    <Image
      source={require("src/assets/home.png")}
      style={{ width: 24, height: 24 }}
    />
  );
};

export default IconHome;
