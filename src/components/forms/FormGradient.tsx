import { LinearGradient } from "expo-linear-gradient";
import { View, ViewStyle } from "react-native";
import { Colors, gradients } from "src/constants/Colors";

const FormGradient = ({
  disabled,
  children,
  vertical,
  flex,
  flexDirection,
  style,
  padding,
}: {
  children: React.ReactNode;
  vertical?: boolean;
  flex?: number;
  flexDirection?: "row" | "column";
  style?: ViewStyle;
  disabled?: boolean;
  padding?: number;
}) => {
  return (
    <View
      style={[
        {
          flex: flex || 1,
          borderWidth: 1,
          borderColor: Colors.velvet,
          borderBottomWidth: 4,
          borderRadius: 10,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradients.primary}
        start={vertical ? [0, 0.3] : [0.3, 0]}
        end={vertical ? [0, 1] : [1, 0.5]}
        style={{
          flex: 1,
          padding: padding ? padding : 12,
          borderRadius: 10,
          flexDirection: flexDirection || "column",
        }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

export default FormGradient;
