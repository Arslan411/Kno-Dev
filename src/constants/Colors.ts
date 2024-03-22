import { Theme } from "@react-navigation/native";

export const gradients = {
  primaryDark: ["rgba(213, 187, 234, 1)", "rgba(222, 244, 159, 1)"],
  primary: ["rgba(215, 199, 220, 1)", "rgba(220, 230, 179, 1)"],
  primaryLight: ["rgba(215, 199, 220, 1)", "rgba(220, 230, 179, 1)"],
};

export const Colors = {
  primary: "#8E186D",
  primaryDark1: "#420A32",
  velvet: "#37051A",
  primaryLight: "#DABAEE",
  primaryLightWithOpacity: "rgba(218, 186, 238, 0.5)",
  gray: "rgba(213, 210, 216, 1)",
  primaryDark: "#580E43",
  white: "#FFFFFF",
  black: "#000000",
  greige: "rgba(242, 242, 239, 1)",
  mediumGreige: "#C8C8C8",
  deepGreige: "#726E6C",
  green50: "rgba(240, 253, 244, 1)",
  green200: "#BBF7D0",
  green600: "#16A34A",
  sliderGreen: "#133F26",
  selfReportedPink: "#D5BBEA",
  negativeResult: "rgba(19, 63, 38, 1)",
  red50: "rgba(254, 242, 242, 1)",
  red600: "rgba(220, 38, 38, 1)",
};

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.velvet,
    background: Colors.white,
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)",
  },
};
