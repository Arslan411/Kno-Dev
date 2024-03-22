import { LinearGradient } from "expo-linear-gradient";
import { Pressable, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";

interface CustomClickableProps {
  item: string;
  onPress?: () => void;
  checked?: boolean;
}

const CustomClickable: React.FC<CustomClickableProps> = ({
  item,
  onPress,
  checked,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        alignItems: "center",
        flexDirection: "row",
        margin: 10,
        marginHorizontal: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          justifyContent: "center",
          borderColor: Colors.primary,
          borderRadius: 18,
          opacity: 1,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flex: 1,
            height: 34,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "flex-start",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              height: 36,
              width: 36,
              marginTop: -1,
              borderWidth: 1,
              borderLeftWidth: 0,
              borderColor: Colors.primary,
              borderRadius: 18,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {checked && (
                <Svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <Path
                    d="M10.3333 1L3.91667 7.41667L1 4.5"
                    stroke="#8E186D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </View>
          </View>
        </View>
        <Text
          textType="LBBold"
          style={{
            fontSize: 14,
            position: "absolute",
            alignSelf: "center",
            color: Colors.black,
          }}
        >
          {item}
        </Text>
      </View>
    </Pressable>
  );
};

export default CustomClickable;
