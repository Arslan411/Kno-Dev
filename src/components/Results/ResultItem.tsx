import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";
import { images } from "src/utils/Images";

export type ResultType = {
  id: number;
  name: string;
  value: "POSITIVE" | "NEGATIVE" | "SELF_REPORTED";
};

const ResultItem = ({
  result,
  onPress,
  isValue,
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
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 12,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.velvet,
        borderRadius: 24,
        height: 40,
        opacity: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 40,
          borderRadius: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <>
          {isValue ? (
            <View
              style={{
                height: 40,
                width: RFPercentage(15),
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
                    ? Colors.white
                    : Colors.velvet,
              }}
            >
              <Text
                textType="bold"
                style={{
                  fontSize: 12,
                  color:
                    result.value === "SELF_REPORTED"
                      ? Colors.black
                      : Colors.white,
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
          ) : (
            <View
              style={{
                width: RFPercentage(5),
              }}
            ></View>
          )}
        </>

        <View
          style={{
            height: 30,
            flex: 1,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Text
            textType="medium"
            style={{
              fontSize:
                result && result.name && result.name.length >= 20 ? 12 : 14,
              alignSelf: "center",
              color:
                result.value === "POSITIVE"
                  ? Colors.primary
                  : result.value === "SELF_REPORTED"
                  ? Colors.primary
                  : Colors.velvet,
            }}
          >
            {result.name}
          </Text>
        </View>
        {result.value === "POSITIVE" || result.value === "SELF_REPORTED" ? (
          <TouchableOpacity
            style={{
              paddingHorizontal: 8,
              paddingVertical: 5,
            }}
          >
            <Image
              source={images.information}
              style={{
                width: 25,
                height: 25,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: 25,
              height: 25,
              marginHorizontal: 8,
              marginVertical: 5,
            }}
          />
        )}
      </View>
    </Pressable>
  );
};

export default ResultItem;
