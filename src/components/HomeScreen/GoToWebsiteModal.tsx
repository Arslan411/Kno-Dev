import { LinearGradient } from "expo-linear-gradient";
import { Linking, Platform, Pressable, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import useModalStore from "src/store/modalStore";

const GoToWebsiteModal = () => {
  const modalVisible = useModalStore((state) => state.modalVisible);
  const setModalVisible = useModalStore((state) => state.setModalVisible);

  return (
    <Pressable
      onPress={() => {
        setModalVisible(false);
      }}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom:
          Platform.OS === "ios" ? RFPercentage(16) + 64 : RFPercentage(16) + 48,
      }}
    >
      <View
        style={{
          height: RFPercentage(50),
          marginHorizontal: 16,
          borderRadius: 10,
          borderWidth: 1,
          borderBottomWidth: 4,
          borderColor: Colors.velvet,
        }}
      >
        <LinearGradient
          colors={gradients.primary}
          start={[0, 0]}
          end={[1, 1]}
          style={{
            flex: 1,
            borderRadius: 10,
          }}
        >
          <Pressable
            style={{
              flex: 1,
              padding: 16,
              gap: 24,
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Text
              textType="LBBold"
              style={{
                textAlign: "center",
                fontSize: RFPercentage(2.5),
                color: Colors.velvet,
              }}
            >
              Coming Soon!
            </Text>
            <Text
              textType="regular"
              style={{
                textAlign: "center",
                fontSize: RFPercentage(2),
                color: Colors.velvet,
              }}
            >
              Thanks for your interest in knō, we’re so glad there are people
              like you in the world who support our mission!
            </Text>
            <Text
              textType="regular"
              style={{
                textAlign: "center",
                fontSize: RFPercentage(2),
                color: Colors.velvet,
              }}
            >
              Our kno kits aren’t available yet, but our lab is hard at work to
              make them available in just a few weeks!
            </Text>

            <Pressable
              onPress={() => {
                Linking.openURL("https://kno.co/");
                setModalVisible(false);
              }}
              style={{
                height: RFPercentage(7),
                borderWidth: 1,
                borderColor: Colors.velvet,
                borderBottomWidth: 4,
                borderRadius: 10,
              }}
            >
              <LinearGradient
                colors={gradients.primary}
                start={[0, 0.3]}
                end={[0, 1]}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  textType="LBBold"
                  style={{
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                  }}
                >
                  Check out kno.co
                </Text>
              </LinearGradient>
            </Pressable>
          </Pressable>
        </LinearGradient>
      </View>
    </Pressable>
  );
};

export default GoToWebsiteModal;
