import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import ClickableItem from "./ClickableItem";
import { StackNavigation } from "src/types/NavigationTypes";
import { useNavigation } from "@react-navigation/native";
import StrokeText from "../StrokeText";
import IconButton from "../IconButton";

type GenericSymptomsModalProps = {
  heading: string;
  body: string;
  secondBody?: string;
  buttonText: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selected: string[];
  route?: any;
  onRequestClose?: () => void;
};

const GenericSymptomsModal = ({
  heading,
  body,
  buttonText,
  secondBody,
  modalVisible,
  setModalVisible,
  selected,
  route,
  onRequestClose,
}: GenericSymptomsModalProps) => {
  const navigation = useNavigation<StackNavigation>();

  const navigate = () => {
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

  const click = () => {
    const timer = setTimeout(() => navigate(), 350);
    return () => clearTimeout(timer);
  };

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
          marginHorizontal: 6,
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <Pressable
          style={{
            height: RFPercentage(55),
            marginTop: RFPercentage(8),
            marginHorizontal: 6,
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
            {/* <StrokeText myText={heading} /> */}
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
            {/* <Text
              textType="LBBold"
              style={{
                textAlign: "center",
                fontSize: RFPercentage(2.5),
                color: Colors.velvet,
              }}
            >
              {heading}
            </Text> */}

            <View
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "#BDC99C",
              }}
            >
              <ScrollView
                persistentScrollbar={true}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{
                  justifyContent: "center",
                }}
                style={{
                  maxHeight: RFPercentage(16),
                }}
              >
                {selected.map((symptom, index) => (
                  <ClickableItem key={index} item={symptom} checked />
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                flexDirection: "column",
                gap: 12,
                marginHorizontal: 12,
                marginBottom: 12,
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

              {secondBody && (
                <Text
                  textType="regular"
                  style={{
                    textAlign: "center",
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                  }}
                >
                  {secondBody}
                </Text>
              )}
            </View>

            {/* <Pressable
              onPress={click}
              style={{
                height: RFPercentage(6),
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
            </Pressable> */}
            <View
              style={{
                alignSelf: "center",
              }}
            >
              <IconButton
                checked
                checkedLabel="Exit"
                width={RFPercentage(19)}
                height={RFPercentage(5.5)}
                fontSize={RFPercentage(1.85)}
                onPress={click}
              />
            </View>
            {/* </LinearGradient> */}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default GenericSymptomsModal;
