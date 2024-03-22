import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Icon, Text } from "../Themed";
import { Path, Svg } from "react-native-svg";
import { NotificationType } from "src/screens/Dashboard/OrderStatusScreen";
import { RFPercentage } from "react-native-responsive-fontsize";
interface NotifiDetailsProps {
  item: NotificationType;
  current: number;
}
const NotifiDetails: React.FC<NotifiDetailsProps> = ({ item, current }) => {
  return (
    <View
      style={{
        marginVertical: 5,
        marginHorizontal: 30,
        position: "relative",
      }}
    >
      {item.id === current ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                height: 32,
                width: 32,
                borderColor: Colors.velvet,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: -20,
              }}
            >
              {item.id === current && (
                // <Icon name="chevron-down" size={20} color={Colors.velvet} />
                <View
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 16,
                    backgroundColor: Colors.greige,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/check.png")}
                    style={{
                      height: 20,
                      width: 20,
                    }}
                  />
                </View>
              )}
            </View>

            <Text
              textType="LBBold"
              style={{
                fontSize: 14,
                color: Colors.velvet,
              }}
            >
              {item.title}
            </Text>
          </View>

          <Text
            textType="medium"
            style={{
              color: Colors.primary,
              fontSize: RFPercentage(1.8),
              marginHorizontal: 26,
              lineHeight: 20,
              letterSpacing: 0.25,
              top: -4,
              textAlign: "left",
            }}
          >
            {item.subText}
          </Text>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            opacity: current >= item.id ? 1 : 0.6,
          }}
        >
          <View
            style={{
              height: 32,
              width: 32,
              borderColor: Colors.velvet,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: -20,
            }}
          >
            {current === item.id ||
              (current >= item.id ? (
                <View
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 16,
                    backgroundColor: Colors.greige,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/check.png")}
                    style={{
                      height: 20,
                      width: 20,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 16,
                    backgroundColor: Colors.greige,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/access.png")}
                    style={{
                      height: 20,
                      width: 20,
                    }}
                  />
                </View>
              ))}
          </View>

          <Text
            textType="LBBold"
            style={{
              fontSize: 14,
              color: Colors.velvet,
            }}
          >
            {item.title}
          </Text>
        </View>
      )}
    </View>
  );
};
export default NotifiDetails;
