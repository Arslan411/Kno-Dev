import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  View,
} from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";

export type HomeScreenItemProps = {
  id: number;
  name: string;
  icon: ImageSourcePropType;
  disabled?: boolean;
  onPress?: () => void;
  imgHeight?: string | number;
  imgWidth?: string | number;
};

const HomeScreenItem = (props: HomeScreenItemProps) => {
  const width = Dimensions.get("window").width;

  return (
    <Pressable
      // disabled={props.disabled}
      onPress={props.onPress}
      style={{
        width: width / 3 - 24,
        height: width / 3 + 16,
        margin: RFPercentage(1),
        marginBottom: 16,
        opacity: props.disabled ? 0.5 : 1,
        gap: 8,
      }}
    >
      <View
        style={{
          height: width / 3 - 24,
          borderWidth: 1,
          borderBottomWidth: 4,
          borderColor: Colors.velvet,
          borderRadius: 10,
        }}
      >
        <LinearGradient
          colors={gradients.primary}
          start={[0, 0]}
          end={[1, 1]}
          style={{
            flex: 1,
            padding: 18,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Image
            source={props.icon}
            style={{
              width: props.imgWidth ? props.imgWidth : RFPercentage(5),
              height: props.imgHeight ? props.imgHeight : RFPercentage(5),
              margin: 6,
            }}
          ></Image>
        </LinearGradient>
      </View>
      <Text
        textType="regular"
        style={{
          color: Colors.velvet,
          textAlign: "center",
          fontSize: 13,
          fontWeight: "500",
        }}
      >
        {props.name}
      </Text>
    </Pressable>
  );
};

export default HomeScreenItem;
