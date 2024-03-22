import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, View, ScrollView } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import { ResultType } from "./ResultLabel";
import React from "react";
import ResultInfo from "./ResultInfo";

type ResultModalProps = {
  currentResult: ResultType[];
  onPress: () => void;
  buttonText: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const MultipleResultModal = ({
  currentResult,
  modalVisible,
  onPress,
  buttonText,
}: ResultModalProps) => {
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <View
          style={{
            height: RFPercentage(60),
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
              paddingTop: 12,
              paddingHorizontal: 4,
              borderRadius: 10,
            }}
          >
            <>
              <ScrollView
                style={{
                  height: RFPercentage(50),
                  // margin: 8,
                }}
                keyboardShouldPersistTaps="handled"
              >
                <Text
                  textType="LBBold"
                  style={{
                    paddingTop: 12,
                    textAlign: "center",
                    fontSize: RFPercentage(2.5),
                    color: Colors.velvet,
                  }}
                >
                  We've detected...
                </Text>
                {currentResult.map((item, index) => (
                  <ResultInfo currentResult={item} key={item.id} />
                ))}
              </ScrollView>
              <Pressable
                onPress={onPress}
                style={{
                  height: RFPercentage(6.5),
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                  margin: 10,
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
            </>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default MultipleResultModal;
