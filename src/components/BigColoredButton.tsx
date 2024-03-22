import {
  ActivityIndicator,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Text } from "./Themed";
import { Colors, gradients } from "src/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

type BigColoredButtonProps = {
  disabled?: boolean;
  onPress: () => void;
  isLoading?: boolean;
  text: string;
  style?: any;
  horizontal?: boolean;
};

const BigColoredButton = ({
  onPress,
  disabled,
  isLoading,
  text,
  style,
  horizontal,
}: BigColoredButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          opacity: disabled ? 0.5 : 1,
          flex: 1,
          borderWidth: 1,
          borderColor: Colors.velvet,
          borderBottomWidth: 4,
          borderRadius: 10,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradients.primary}
        start={horizontal ? [0, 1] : [0, 0.3]}
        end={horizontal ? [1, 0] : [0, 1]}
        style={{
          flex: 1,
          padding: 12,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.velvet} />
        ) : (
          <Text
            textType="LBBold"
            style={{
              fontSize: 16,
              color: Colors.velvet,
            }}
          >
            {text}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

export default BigColoredButton;
