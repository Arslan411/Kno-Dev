import { Pressable, StyleSheet } from "react-native";
import { Icon } from "./Themed";
import { Colors } from "src/constants/Colors";
import { Path, Svg } from "react-native-svg";

function CheckBox({
  rounded,
  onValueChange,
  checked,
  style,
  color,
  size,
  checkedColor,
  disabledColor,
  borderWidth,
}: {
  rounded?: boolean;
  onValueChange: (value: boolean) => void;
  checked: boolean;
  style?: any;
  color: string;
  size?: number;
  checkedColor: string;
  disabledColor: string;
  borderWidth?: number;
}) {
  const handlePress = () => {
    onValueChange(!checked);
  };

  const styles = StyleSheet.create({
    checkboxBase: {
      width: size ? size : 24,
      height: size ? size : 24,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: rounded ? 12 : 3,
      borderWidth: borderWidth ? borderWidth : 1,
      borderColor: checked ? color : disabledColor,
    },
    checkBoxChecked: {
      borderColor: color,
    },
  });

  return (
    <Pressable
      style={[styles.checkboxBase, checked && styles.checkBoxChecked, style]}
      onPress={handlePress}
    >
      {checked && (
        <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <Path
            d="M11.6666 3.5L5.24998 9.91667L2.33331 7"
            stroke="#8E186D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </Pressable>
  );
}

export default CheckBox;
