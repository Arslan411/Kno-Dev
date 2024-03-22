import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";

type GenericModalProps = {
  heading: string;
  height?: number;
  body?: string;
  anotherBody?: string;
  onPress: () => void;
  buttonText: string;
  modalVisible: boolean;
  onRequestClose?: () => void;
  setModalVisible: (visible: boolean) => void;
};

const GenericModal = ({
  height,
  modalVisible,
  setModalVisible,
  heading,
  body,
  anotherBody,
  onPress,
  onRequestClose,
  buttonText,
}: GenericModalProps) => {
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}
    >
      <Pressable
        onPress={onRequestClose}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <Pressable
          style={{
            height: height ? height : RFPercentage(50),
            marginTop: RFPercentage(8),
            marginHorizontal: 8,
            borderColor: Colors.primary,
            borderWidth: 1,
            borderRadius: 10,
            borderBottomWidth: 4,
            backgroundColor: Colors.white,
          }}
        >
          {/* <LinearGradient
            colors={gradients.primary}
            start={[0, 0]}
            end={[1, 1]}
            style={{
              flex: 1,
              padding: 12,
              paddingHorizontal: 12,
              borderRadius: 10,
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          > */}
          <View
            style={{
              flex: 1,
              padding: 12,
              paddingHorizontal: 12,
              borderRadius: 10,
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
              {heading}
            </Text>

            <View
              style={{
                flexDirection: "column",
                gap: 12,
                marginHorizontal: 12,
              }}
            >
              {body && (
                <Text
                  textType="regular"
                  style={{
                    textAlign: "center",
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                  }}
                >
                  {body}
                </Text>
              )}

              {anotherBody && (
                <Text
                  textType="regular"
                  style={{
                    textAlign: "center",
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                  }}
                >
                  {anotherBody}
                </Text>
              )}
            </View>

            <Pressable
              onPress={onPress}
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
                  {buttonText}
                </Text>
              </LinearGradient>
            </Pressable>
            {/* </LinearGradient> */}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default GenericModal;
