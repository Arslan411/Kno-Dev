import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import ClickableItem from "./ClickableItem";
import { StackNavigation } from "src/types/NavigationTypes";
import { useNavigation } from "@react-navigation/native";

type CurrentSymptomsModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  currentSymptoms: string[];
};

const CurrentSymptomsModal = ({
  modalVisible,
  setModalVisible,
  currentSymptoms,
}: CurrentSymptomsModalProps) => {
  const navigation = useNavigation<StackNavigation>();

  const navigate = () => {
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

  const click = () => {
    // const timer = setTimeout(() => navigate(), 350);
    // return () => clearTimeout(timer);
    console.log("clicked");
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <Pressable
        onPress={() => {
          setModalVisible(false);
        }}
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <Pressable
          style={{
            height: RFPercentage(55),
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
              paddingHorizontal: 0,
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
                paddingHorizontal: 12,
              }}
            >
              We are very sorry you are experiencing...
            </Text>

            <ScrollView
              persistentScrollbar={true}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{
                justifyContent: "center",
              }}
              style={{
                maxHeight: RFPercentage(12),
              }}
            >
              {currentSymptoms.map((symptom, index) => (
                <ClickableItem key={index} item={symptom} checked />
              ))}
            </ScrollView>

            <View
              style={{
                gap: 4,
                // paddingHorizontal: 12,
              }}
            >
              <Text
                textType="regular"
                style={{
                  textAlign: "center",
                  fontSize: RFPercentage(2),
                  color: Colors.velvet,
                  marginBottom: 12,
                }}
              >
                These things happen, but the knō test is designed for screening.
                {"\n"}
                {"\n"}
                When experiencing symptoms it is best to visit a doctor for a
                more specific test and potentially treatment.
              </Text>
            </View>

            <Pressable
              onPress={click}
              style={{
                height: RFPercentage(7.5),
                marginHorizontal: 12,
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
                  padding: 16,
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

export default CurrentSymptomsModal;
