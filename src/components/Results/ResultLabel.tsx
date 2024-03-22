import { LinearGradient } from "expo-linear-gradient";
import { Pressable, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";

export type ResultType = {
  id?: number;
  name?: string;
  value?: "POSITIVE" | "NEGATIVE" | "SELF_REPORTED";
};

const ResultLabel = ({
  result,
  onPress,
}: {
  result: ResultType;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      onPress={
        result.value === "POSITIVE" || result.value === "SELF_REPORTED"
          ? onPress
          : () => {
              return;
            }
      }
      style={{
        alignItems: "center",
        flexDirection: "row",
        marginTop: 12,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.velvet,
        borderRadius: 24,
        height: 32,
        opacity: 1,
      }}
    >
      <LinearGradient
        colors={gradients.primary}
        start={[0, 0.3]}
        end={[0, 1]}
        style={{
          flex: 1,
          height: 30,
          borderRadius: 24,
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <>
          <View
            style={{
              height: 32,
              width: RFPercentage(10),
              borderWidth: 1,
              borderLeftWidth: 0,
              borderColor: Colors.velvet,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                result.value === "POSITIVE"
                  ? Colors.primary
                  : result.value === "SELF_REPORTED"
                  ? Colors.selfReportedPink
                  : Colors.sliderGreen,
            }}
          >
            <Text
              textType="LBBold"
              style={{
                fontSize: 9,
                color: Colors.white,
                paddingHorizontal: 4,
              }}
            >
              {result && result.value === "POSITIVE"
                ? "Detected"
                : result && result.value === "SELF_REPORTED"
                ? "Self Reported"
                : "Not Detected"}
            </Text>
          </View>
        </>

        <View
          style={{
            height: 30,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text
            textType="LBBold"
            style={{
              fontSize:
                result && result.name && result.name.length >= 20 ? 12 : 14,
              alignSelf: "center",
              color:
                result.value === "POSITIVE" ? Colors.primary : Colors.velvet,
            }}
          >
            {result.name}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default ResultLabel;
