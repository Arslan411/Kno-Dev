import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { Text } from "../Themed";
import { RFPercentage } from "react-native-responsive-fontsize";

const DiseaseLabel = ({
  disease,
  spread,
  margin,
}: {
  disease: string;
  spread?: boolean;
  margin?: number;
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        marginHorizontal: 44,
        borderWidth: 1,
        borderColor: Colors.velvet,
        borderRadius: 50,
        height: 32,
        opacity: 1,
        overflow: "hidden",
        margin: margin ? margin : 0,
      }}
    >
      <LinearGradient
        colors={gradients.primary}
        start={[0, 0.3]}
        end={[0, 1]}
        style={{
          flex: 1,
          height: 34,
          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          // overflow: "hidden",
        }}
      >
        <>
          {!spread && (
            <View
              style={{
                height: 32,
                width: RFPercentage(8.5),
                borderWidth: 1,
                borderLeftWidth: 0,
                borderColor: Colors.velvet,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                textType="LBBold"
                style={{
                  fontSize: 13,
                  color: Colors.primary,
                  paddingHorizontal: 4,
                }}
              >
                ...
              </Text>
            </View>
          )}
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
              fontSize: disease.length >= 20 ? 12 : 14,
              alignSelf: "center",
              color: Colors.velvet,
            }}
          >
            {/* {disease == "Hepatitus B"
              ? "Hepatitis B"
              : disease == "Hepatitus C"
              ? "Hepatitis C"
              : disease == "Mycoplasm Genitalium"
              ? "Mycoplasma Genitalium"
              : disease} */}
            {disease == "Mycoplasm Genitalium"
              ? "Mycoplasma Genitalium"
              : disease}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default DiseaseLabel;
