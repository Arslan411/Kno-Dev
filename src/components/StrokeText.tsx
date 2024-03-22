import { Text, View, StyleSheet } from "react-native";
import { Colors, gradients } from "src/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const StrokeText = ({
  myText,
  fontSize,
}: {
  myText?: string;
  fontSize?: any;
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text
          style={[styles.paragraph, { fontSize: fontSize ? fontSize : 28 }]}
        >
          {myText}
        </Text>
        <Text
          style={[
            styles.paragraph,
            styles.abs,
            {
              textShadowOffset: { width: -1, height: -2 },
              fontSize: fontSize ? fontSize : 28,
            },
          ]}
        >
          {myText}
        </Text>
        <Text
          style={[
            styles.paragraph,
            styles.abs,
            {
              textShadowOffset: { width: -1, height: 2 },
              fontSize: fontSize ? fontSize : 28,
            },
          ]}
        >
          {myText}
        </Text>
        <Text
          style={[
            styles.paragraph,
            styles.abs,
            {
              textShadowOffset: { width: 1, height: -1 },
              fontSize: fontSize ? fontSize : 28,
            },
          ]}
        >
          {myText}
        </Text>
        <Text
          style={[
            styles.paragraph,
            styles.abs,
            {
              textShadowOffset: { width: 1.5, height: 5 },
              fontSize: fontSize ? fontSize : 28,
            },
          ]}
        >
          {myText}
        </Text>
      </View>
    </View>
  );
};

export default StrokeText;
const styles = StyleSheet.create({
  container: {},
  paragraph: {
    fontSize: 28,
    // color: "rgba(220, 230, 179, 1)",
    color: "#d7d4c7",

    // color: "transparent",
    textShadowColor: Colors.velvet,
    textShadowRadius: 1,
    textShadowOffset: {
      width: 3.5,
      height: 5,
    },
    fontFamily: "TitanOne_400Regular",
    textAlign: "center",
    lineHeight: 35,
  },
  abs: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
