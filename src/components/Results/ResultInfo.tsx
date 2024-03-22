import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import ResultLabel, { ResultType } from "./ResultLabel";
import { Icon, Text } from "../Themed";
import { Colors } from "src/constants/Colors";
import { WebDisplay, WebPlaceHolderDisplay } from "./ResultModal";
import { useState } from "react";
import { Loading } from "src/constants/enums";
import ResultServices from "src/services/ResultServices";
import { Toast } from "../ToastManager";
import { diseasesHTML } from "src/data/diseases";

type ResultInfoProps = {
  currentResult: ResultType;
};

const ResultInfo = ({ currentResult }: ResultInfoProps) => {
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

  return (
    <View
      style={{
        flex: 1,
        margin: 8,
      }}
    >
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
        {diseasesHTML.find((item) => item.id === currentResult.id)?.sample}
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
        {diseasesHTML.find((item) => item.id === currentResult.id)?.firstPoint}
      </Text>
      <WebPlaceHolderDisplay
        html={diseasesHTML.find((item) => item.id === currentResult.id)?.html}
      />

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
    </View>
  );
};

export default ResultInfo;
