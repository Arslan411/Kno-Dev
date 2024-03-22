import { LinearGradient } from "expo-linear-gradient";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, View, TouchableOpacity, Pressable } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { useWindowDimensions } from "react-native";
import StrokeText from "../StrokeText";
import IconButton from "../IconButton";
import { height } from "src/constants/Layout";

type CustomModalProps = {
  isVisible: boolean;
  onClose: () => void;
  heading: string;
  body?: string;
  ph?: number;
  mh?: number;
  innerBody?: ReactNode;
  innerChild?: ReactNode;
  anotherBody?: string;
  buttonText?: string;
  children?: ReactNode;
};

const ModalContext = createContext<{
  showModal: (props: CustomModalProps) => void;
  closeModal: () => void;
} | null>(null);

type GlobalModalProviderProps = {
  children: React.ReactNode;
};

export const GlobalModalProvider: React.FC<GlobalModalProviderProps> = ({
  children,
}) => {
  const { width } = useWindowDimensions();
  const [modalProps, setModalProps] = useState<CustomModalProps>({
    isVisible: false,
    onClose: () => {},
    heading: "",
    body: "",
    buttonText: "",
  });

  const showModal = (props: CustomModalProps) => {
    setModalProps(props);
  };

  const closeModal = () => {
    setModalProps({
      isVisible: false,
      onClose: () => {},
      heading: "",
      body: "",
    });
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      <Modal
        statusBarTranslucent
        animationType="slide"
        transparent={true}
        visible={modalProps.isVisible}
        onRequestClose={modalProps.onClose}
      >
        <Pressable
          onPress={() => closeModal()}
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
              width: width - 16,
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
                paddingHorizontal: modalProps.ph ? modalProps.ph : 12,
                borderRadius: 10,
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            > */}
            <View
              style={{
                flex: 1,
                padding: 12,
                paddingHorizontal: modalProps.ph ? modalProps.ph : 12,
                borderRadius: 10,
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              {/* <Text
                textType="LBBold"
                style={{
                  textAlign: "center",
                  fontSize:
                    modalProps.heading.length > 5
                      ? RFPercentage(2.5)
                      : RFPercentage(5),
                  color: Colors.velvet,
                }}
              >
                {modalProps.heading}
              </Text> */}
              <View style={{ top: 20 }}>
                {/* <StrokeText fontSize={22} myText={modalProps.heading} /> */}
                <Text
                  textType="LBBold"
                  style={{
                    textAlign: "center",
                    fontSize: RFPercentage(2.2),
                    color: Colors.velvet,
                  }}
                >
                  {modalProps.heading}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  gap: 12,
                  marginHorizontal: modalProps.mh ? modalProps.mh : 12,
                }}
              >
                {modalProps.innerChild}
                {modalProps.innerBody}
                {modalProps.body && (
                  <Text
                    textType="regular"
                    style={{
                      textAlign: "center",
                      fontSize: RFPercentage(2),
                      color: Colors.velvet,
                    }}
                  >
                    {modalProps.body}
                  </Text>
                )}

                {modalProps.anotherBody && (
                  <Text
                    textType="regular"
                    style={{
                      textAlign: "center",
                      fontSize: RFPercentage(2),
                      color: Colors.velvet,
                    }}
                  >
                    {modalProps.anotherBody}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={modalProps.onClose}
                style={
                  {
                    // height: RFPercentage(9),
                    // borderWidth: 1,
                    // borderColor: Colors.primary,
                    // borderBottomWidth: 4,
                    // borderRadius: 10,
                  }
                }
              >
                {/* <View
                  style={{
                    borderWidth: 1,
                    width: RFPercentage(19),
                    height: RFPercentage(5.5),
                    borderRadius: 10,
                  }}
                >
                  <Text>{modalProps.buttonText}</Text>
                </View> */}
                <LinearGradient
                  colors={[
                    "rgba(213, 187, 234, 0.5)",
                    "rgba(222, 244, 159, 0.5)",
                  ]}
                  start={[0, 0.3]}
                  end={[0, 1]}
                  style={{
                    borderWidth: 1,
                    width: RFPercentage(19),
                    height: RFPercentage(5.5),
                    borderRadius: 100,
                    borderColor: Colors.primary,
                    alignSelf: "center",
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
                    {modalProps.buttonText}
                  </Text>
                </LinearGradient>
              </Pressable>

              {/* </LinearGradient> */}
            </View>
          </View>
        </Pressable>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a GlobalModalProvider");
  }
  return context;
};
