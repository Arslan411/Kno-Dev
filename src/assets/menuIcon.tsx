import { Image, Platform, Pressable } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const MenuIcon = ({ onPress, user }: any) => {
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
      {user ? (
        <Image
          source={require("src/assets/menuIcon.png")}
          style={{
            width: 69,
            height: 69,
          }}
        />
      ) : (
        <Image
          source={require("src/assets/signupUser.png")}
          style={{
            width: 30,
            height: 30,
          }}
        />
      )}
    </Pressable>
  );
};

export default MenuIcon;
