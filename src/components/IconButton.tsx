import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, View, ActivityIndicator } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Colors, gradients } from "src/constants/Colors";
import { StackNavigation } from "src/types/NavigationTypes";
import { Icon, Text } from "./Themed";
import { Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const IconButton = ({
  onPress,
  checked,
  checkedLabel,
  unCheckedLabel,
  mark,
  width,
  checkedIcon,
  source,
  height,
  loading,
  checkedLabelColor,
  txtColor,
  disabled,
  opacity,
  fontSize,
}: {
  onPress?: () => void;
  checked?: boolean;
  checkedLabel?: string;
  unCheckedLabel?: string;
  mark?: boolean;
  width?: any;
  checkedIcon?: boolean;
  source?: any;
  height?: any;
  loading?: boolean;
  checkedLabelColor?: {};
  txtColor?: any;
  disabled?: boolean;
  opacity?: any;
  fontSize?: any;
}) => {
  const navigation = useNavigation<StackNavigation>();
  return (
    <Pressable
      style={{
        borderWidth: 1.5,
        height: height ? height : RFPercentage(6),
        width: width ? width : RFPercentage(13),
        borderColor: Colors.primary,
        borderRadius: 30,
        opacity: opacity ? opacity : disabled ? 0.5 : 1,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      {checked ? (
        <LinearGradient
          colors={gradients.primary}
          start={[0, 0.3]}
          end={[0, 1]}
          style={{
            flex: 1,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
            padding: 9,
          }}
        >
          {loading ? (
            <ActivityIndicator size={20} />
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-evenly",
                flexDirection: "row",
              }}
            >
              {checkedIcon ? (
                mark ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={Colors.velvet}
                  />
                ) : (
                  <Image
                    style={{
                      height: RFPercentage(3),
                      width: RFPercentage(3),
                    }}
                    source={source ? source : require("../assets/testTube.png")}
                  />
                )
              ) : null}

              <Text
                textType="medium"
                style={
                  checkedLabelColor
                    ? checkedLabelColor
                    : {
                        fontSize: RFPercentage(2),
                        color: checkedLabelColor ? Colors.white : Colors.black,
                      }
                }
              >
                {checkedLabel}
              </Text>
            </View>
          )}
        </LinearGradient>
      ) : (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={{
            flex: 1,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            padding: 9,
            backgroundColor: "#F2F2F2",
          }}
        >
          <Text
            style={{
              fontSize: fontSize ? fontSize : RFPercentage(2),
              color: txtColor ? txtColor : Colors.black,
            }}
          >
            {unCheckedLabel}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default IconButton;
