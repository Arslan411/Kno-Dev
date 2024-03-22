import { Pressable, View } from "react-native";
import { Text } from "./Themed";
import { Colors, gradients } from "src/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";

const ButtonWithIcon = ({
  icon,
  text,
  onPress,
}: {
  icon?: React.ReactNode;
  text: string;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        alignItems: "flex-start",
        justifyContent: "center",
        height: 48,
        marginLeft: "4%",
        width: "96%",
        backgroundColor: "transparent",
        borderRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 1,
        borderColor: Colors.velvet,
        borderBottomWidth: 4,
      }}
    >
      <View
        style={{
          left: "-4%",
          width: 48,
          height: 48,
          marginTop: 3,
          borderWidth: 1,
          borderColor: Colors.velvet,
          borderRadius: 50,
        }}
      >
        <LinearGradient
          colors={gradients.primary}
          start={[1, 0]}
          end={[1, 1]}
          style={{
            flex: 1,
            borderRadius: 50,
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </LinearGradient>
      </View>

      <Text
        textType="LBBold"
        style={{
          color: Colors.velvet,
          fontSize: RFPercentage(2),
          alignSelf: "center",
          position: "absolute",
          paddingLeft: 24,
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default ButtonWithIcon;
