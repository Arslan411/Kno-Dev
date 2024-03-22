import { LinearGradient } from "expo-linear-gradient";
import {
  Modal,
  Pressable,
  View,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Icon, Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import RenderHTML, {
  HTMLContentModel,
  HTMLElementModel,
} from "react-native-render-html";
import ResultLabel, { ResultType } from "./ResultLabel";
import React, { useEffect, useState } from "react";
import { Loading } from "src/constants/enums";
import ResultServices from "src/services/ResultServices";
import { Toast } from "../ToastManager";
import { diseasesHTML } from "src/data/diseases";

type ResultModalProps = {
  currentResult: ResultType;
  heading: string;
  body?: string;
  anotherBody?: string;
  onPress: () => void;
  buttonText: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export const customStyle = {
  h1: HTMLElementModel.fromCustomModel({
    tagName: "h1",
    mixedUAStyles: {
      fontFamily: "DMSans_500Medium",
    },
    contentModel: HTMLContentModel.block,
  }),

  ul: HTMLElementModel.fromCustomModel({
    tagName: "ul",
    mixedUAStyles: {
      fontSize: RFPercentage(1.5),
      lineHeight: RFPercentage(2),
      color: Colors.velvet,
      marginVertical: 4,
      marginHorizontal: 16,
      listStyleType: "disc",
      fontFamily: "DMSans_500Medium",
    },
    contentModel: HTMLContentModel.block,
  }),
  li: HTMLElementModel.fromCustomModel({
    tagName: "li",
    mixedUAStyles: {
      fontSize: RFPercentage(1.5),
      lineHeight: RFPercentage(2),
      color: Colors.velvet,
      // marginVertical: 4,
      // marginHorizontal: 8,
    },
    contentModel: HTMLContentModel.block,
  }),
};

export const WebDisplay = React.memo(function WebDisplay({ html }: any) {
  const { width } = useWindowDimensions();
  return (
    <RenderHTML
      enableExperimentalBRCollapsing={true}
      contentWidth={width}
      source={{ html }}
      customHTMLElementModels={customStyle}
      systemFonts={["DMSans_400Regular", "DMSans_500Medium"]}
    />
  );
});
export const WebPlaceHolderDisplay = React.memo(function WebDisplay({
  html,
}: any) {
  const { width } = useWindowDimensions();
  return (
    <RenderHTML
      enableExperimentalBRCollapsing={true}
      contentWidth={width}
      source={{ html }}
      customHTMLElementModels={customStyle}
      systemFonts={["DMSans_400Regular", "DMSans_500Medium"]}
    />
  );
});

const ResultModal = ({
  currentResult,
  modalVisible,
  onPress,
  buttonText,
}: ResultModalProps) => {
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [response, setResponse] = useState<any[]>([]);

  const fetchInfo = async () => {
    setLoading(Loading.loading);
    try {
      const res = await ResultServices.getSti(currentResult.id);
      setResponse(res.data.data);
      setLoading(Loading.idle);
    } catch (error: any) {
      setLoading(Loading.idle);
      Toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setResponse([]);
  }, [currentResult]);

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
              padding: 12,
              paddingHorizontal: 4,
              borderRadius: 10,
            }}
          >
            <>
              <ScrollView
                style={{
                  maxHeight: RFPercentage(50),
                  margin: 8,
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
                <ResultLabel result={currentResult} />

                <Text
                  textType="bold"
                  style={{
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  {
                    diseasesHTML.find((item) => item.id === currentResult.id)
                      ?.sample
                  }
                </Text>

                <Text
                  style={{
                    fontSize: RFPercentage(2),
                    color: Colors.velvet,
                    marginTop: 12,
                    marginHorizontal: 16,
                    textAlign: "center",
                  }}
                >
                  {
                    diseasesHTML.find((item) => item.id === currentResult.id)
                      ?.firstPoint
                  }
                </Text>
                <WebPlaceHolderDisplay
                  html={
                    diseasesHTML.find((item) => item.id === currentResult.id)
                      ?.html
                  }
                />

                <Text
                  textType="bold"
                  style={{
                    fontSize: 16,
                    color: Colors.velvet,
                    marginTop: 12,
                    marginHorizontal: 16,
                    textAlign: "center",
                    letterSpacing: -0.41,
                  }}
                >
                  {
                    diseasesHTML.find((item) => item.id === currentResult.id)
                      ?.secondPoint
                  }
                </Text>

                {response.length > 0 || loading === Loading.loading ? null : (
                  <Pressable
                    onPress={fetchInfo}
                    style={{
                      margin: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: Colors.velvet,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        name="chevron-right"
                        size={16}
                        color={Colors.velvet}
                        style={{
                          alignSelf: "center",
                        }}
                      />
                    </View>
                    <Text
                      textType="LBBold"
                      style={{
                        fontSize: 18,
                        color: Colors.velvet,
                        textAlign: "center",
                      }}
                    >
                      Learn More
                    </Text>
                  </Pressable>
                )}
                {loading === Loading.loading ? (
                  <ActivityIndicator color={Colors.velvet} size="small" />
                ) : (
                  <>
                    {response.map((item: any, index) => (
                      <WebDisplay key={index} html={item.text} />
                    ))}
                  </>
                )}
              </ScrollView>
              <Pressable
                onPress={onPress}
                style={{
                  height: RFPercentage(6),
                  borderWidth: 1,
                  borderColor: Colors.velvet,
                  borderBottomWidth: 4,
                  borderRadius: 10,
                  marginHorizontal: 10,
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
                    // padding: 16,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    textType="LBBold"
                    style={{
                      fontSize: RFPercentage(1.5),
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

export default ResultModal;
