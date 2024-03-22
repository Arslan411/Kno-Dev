import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import Cards from "../Cards/Cards";
import { images } from "src/utils/Images";
import IconButton from "../IconButton";
import Navigation from "src/navigation";
import { useNavigation } from "@react-navigation/native";

type RetestModalProps = {
  heading: string;
  height?: number;
  body?: string;
  anotherBody?: string;
  onPress: () => void;
  onClosePress?: () => void;
  buttonText: string;
  modalVisible: boolean;
  onRequestClose?: () => void;
  setModalVisible: (visible: boolean) => void;
};

const RetestModal = ({
  height,
  modalVisible,
  setModalVisible,
  heading,
  body,
  anotherBody,
  onPress,
  onRequestClose,
  buttonText,
  onClosePress,
}: RetestModalProps) => {
  const navigation = useNavigation();
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
          //   flex: 1,
          marginTop: -50,
          alignItems: "center",

          //   opacity: 0.8,
          //   position: "absolute",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {/* <ImageBackground source={images.circular} style={{ flex: 1 }}> */}
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
            width: Platform.OS === "ios" ? "96%" : "96%",
          }}
        >
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
            <View style={styles.header}>
              <TouchableOpacity onPress={onClosePress}>
                <Image
                  source={images.backArrow}
                  style={{ height: 60, width: 60 }}
                />
              </TouchableOpacity>
              <Text
                textType="LBBold"
                style={{
                  textAlign: "center",
                  fontSize: RFPercentage(2.5),
                  color: Colors.velvet,
                }}
              >
                Time for a new test
              </Text>
              <View />
            </View>

            <View
              style={{
                flexDirection: "column",
                gap: 12,
                marginHorizontal: 8,
                borderWidth: 1,
                borderColor: "#BDC99C",
                padding: 12,
                borderRadius: 10,
                marginBottom: 5,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Image
                  source={images.emoji}
                  style={{ width: 40, height: 40 }}
                />
              </View>
              {body && (
                <Text
                  textType="regular"
                  style={{
                    textAlign: "center",
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                    width:
                      Platform.OS === "ios"
                        ? RFPercentage(33)
                        : RFPercentage(38),
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
            <View style={styles.buttonContainer}>
              <IconButton
                width={RFPercentage(14)}
                height={48}
                checked
                checkedLabel="Retest"
                checkedIcon
                checkedLabelColor={{ color: Colors.velvet }}
              />
              <IconButton
                height={48}
                width={RFPercentage(18)}
                checked={false}
                unCheckedLabel="Past tests"
                onPress={onPress}
              />
            </View>
          </View>
        </Pressable>
        {/* </ImageBackground> */}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -15,
    width: "92%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderTopColor: Colors.primary,
    gap: 8,
  },
});

export default RetestModal;
