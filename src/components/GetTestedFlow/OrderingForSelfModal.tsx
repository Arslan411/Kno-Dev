import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import StrokeText from "../StrokeText";

type OrderingForSelfModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const OrderingForSelfModal = ({
  modalVisible,
  setModalVisible,
}: OrderingForSelfModalProps) => {
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(true);
      }}
    >
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            height: RFPercentage(50),
            marginTop: RFPercentage(8),
            marginHorizontal: 8,
            borderColor: Colors.velvet,
            borderWidth: 1,
            borderRadius: 10,
            borderBottomWidth: 4,
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0, 0]}
            end={[1, 1]}
            style={{
              flex: 1,
              padding: 12,
              paddingHorizontal: 24,
              borderRadius: 10,
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <StrokeText myText={`Sharing is${"\n"}caring...but...`} />
            {/* <Text
              textType="LBBold"
              style={{
                textAlign: "center",
                fontSize: RFPercentage(2.5),
                color: Colors.velvet,
              }}
            >
              Sharing is caring...but...
            </Text> */}

            <Text
              textType="regular"
              style={{
                textAlign: "center",
                fontSize: RFPercentage(2),
                color: Colors.velvet,
              }}
            >
              We only allow ordering knō kits for self testing. If you’re
              testing with your partner, please complete your order and have
              your partner order their own knō kit with the promo code you’re
              given.
            </Text>

            <Pressable
              onPress={() => {
                setModalVisible(true);
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
                colors={[
                  "rgba(213, 187, 234, 0.5)",
                  "rgba(222, 244, 159, 0.5)",
                ]}
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
                  Exit
                </Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default OrderingForSelfModal;
