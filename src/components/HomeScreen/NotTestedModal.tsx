import { LinearGradient } from "expo-linear-gradient";
import { Modal, Platform, Pressable, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "src/types/NavigationTypes";

type NotTestedProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const NotTestedModal = ({ visible, setVisible }: NotTestedProps) => {
  const navigation = useNavigation<StackNavigation>();
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <Pressable
        onPress={() => {
          setVisible(false);
        }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.1)",
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
                Not Yet!
              </Text>
              <View
                style={{
                  gap: 12,
                }}
              >
                <Text
                  textType="regular"
                  style={{
                    textAlign: "center",
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                  }}
                >
                  Before you can create your knō profile image you need to get
                  tested.
                </Text>
                <Text
                  textType="regular"
                  style={{
                    textAlign: "center",
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                  }}
                >
                  Once you have a test under your belt (heh), you can share that
                  your are in the club by adding the knō icon to your profile
                  pic.
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  setVisible(false);
                  navigation.navigate("TestContent");
                }}
                style={{
                  height: RFPercentage(7.5),
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
                    Got it!
                  </Text>
                </LinearGradient>
              </Pressable>
            </Pressable>
          </LinearGradient>
        </View>
      </Pressable>
    </Modal>
  );
};

export default NotTestedModal;
