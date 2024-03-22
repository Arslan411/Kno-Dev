/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "src/constants/Colors";

type ThemeProps = {
  textType?: "bold" | "regular" | "medium" | "LBRegular" | "LBBold";
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, textType, ...otherProps } = props;

  let fontFamily;
  switch (textType) {
    case "bold": {
      fontFamily = "DMSans_700Bold";
      break;
    }
    case "medium": {
      fontFamily = "DMSans_500Medium";
      break;
    }
    case "LBRegular": {
      fontFamily = "LibreBaskerville_400Regular";
      break;
    }
    case "LBBold": {
      fontFamily = "LibreBaskerville_700Bold";
      break;
    }
    default:
      fontFamily = "DMSans_400Regular";
      break;
  }

  return <DefaultText style={[style, { fontFamily }]} {...otherProps} />;
}

export function SV(props: ViewProps) {
  const { style, ...otherProps } = props;

  return (
    <View
      style={[
        {
          flex: 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradients.primary}
        start={[0.3, 0]}
        end={[0.3, 1]}
        style={{
          flex: 1,
        }}
      >
        {otherProps.children}
      </LinearGradient>
    </View>
  );
}

export function Icon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
  style?: any;
  size?: number;
}) {
  return (
    <MaterialCommunityIcons size={props.size ? props.size : 24} {...props} />
  );
}
