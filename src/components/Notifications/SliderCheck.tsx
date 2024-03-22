import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { Colors, gradients } from "src/constants/Colors";
import { NotificationType } from "src/screens/BottomTabs/NotificationsScreen";
import { Icon, Text } from "../Themed";

interface SliderCheckProps {
  item: NotificationType;
}

const SliderCheck: React.FC<SliderCheckProps> = ({ item }) => {
  return (
    <View>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          margin: 10,
          marginHorizontal: 30,
        }}
      >
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            justifyContent: "center",
            borderColor: Colors.velvet,
            borderRadius: 18,
            opacity: item.disabled ? 0.5 : 1,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0, 0.3]}
            end={[0, 1]}
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
                // borderEndWidth: 1,
                borderColor: Colors.velvet,
                borderRadius: 18,
              }}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0]}
                end={[1, 1]}
                style={{
                  flex: 1,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!item.disabled && (
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
              </LinearGradient>
            </View>
          </LinearGradient>
          <Text
            textType="LBBold"
            style={{
              fontSize: 14,
              position: "absolute",
              alignSelf: "center",
              color: Colors.velvet,
            }}
          >
            {item.title}
          </Text>
        </View>
      </View>

      <View
        style={{
          alignSelf: "center",
        }}
      >
        {item.id === 6 ? (
          <View
            style={{
              marginBottom: 12,
            }}
          />
        ) : (
          <Icon
            name="chevron-down"
            size={24}
            color={Colors.velvet}
            style={{
              opacity: 0.5,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default SliderCheck;
