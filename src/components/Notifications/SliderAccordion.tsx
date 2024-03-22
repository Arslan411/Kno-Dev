import { LinearGradient } from "expo-linear-gradient";
import { Pressable, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Icon, Text } from "../Themed";
import { Path, Svg } from "react-native-svg";
import { NotificationType } from "src/screens/Dashboard/OrderStatusScreen";

interface SliderAccordionProps {
  item: NotificationType;
  current: number;
}

const SliderAccordion: React.FC<SliderAccordionProps> = ({ item, current }) => {
  return (
    <Pressable
      style={{
        marginVertical: 12,
        marginHorizontal: 30,
        position: "relative",
      }}
    >
      {item.id === current ? (
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderBottomWidth: 4,
            justifyContent: "center",
            borderColor: Colors.velvet,
            borderRadius: 18,
            position: "relative",
            overflow: "visible",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -4,
              left: -4,
              height: 36,
              width: 36,
              borderWidth: 1,
              elevation: 1,
              borderColor: Colors.velvet,
              borderRadius: 18,
              zIndex: 1,
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
              {item.id === current && (
                <Icon name="chevron-down" size={20} color={Colors.velvet} />
              )}
            </LinearGradient>
          </View>
          <LinearGradient
            colors={gradients.primary}
            start={[0, 0.3]}
            end={[0, 1]}
            style={{
              flex: 1,
              borderRadius: 18,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: 16,
              elevation: 0,
              overflow: "hidden",
            }}
          >
            <Text
              textType="LBBold"
              style={{
                fontSize: 14,
                color: Colors.velvet,
              }}
            >
              {item.title}
            </Text>
            <Text
              textType="regular"
              style={{
                fontSize: 14,
                color: Colors.velvet,
              }}
            >
              {item.subText}
            </Text>
          </LinearGradient>
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
              borderColor: Colors.velvet,
              borderRadius: 18,
              opacity: 0.5,
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
                  {current === item.id ||
                    (current >= item.id && (
                      <Svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <Path
                          d="M10.3333 1L3.91667 7.41667L1 4.5"
                          stroke="#8E186D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    ))}
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
      )}
    </Pressable>
  );
};

export default SliderAccordion;
