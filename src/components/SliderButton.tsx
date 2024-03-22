import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import IconCheck from "src/assets/IconCheck";
import { Colors, gradients } from "src/constants/Colors";

const SliderButton = () => {
  return (
    <View
      style={{
        width: 48,
        height: 48,
        marginTop: 3,
        borderWidth: 1,
        borderColor: Colors.velvet,
        borderRadius: 50,
      }}
    >
      <LinearGradient
        colors={gradients.primary}
        start={[1, 0]}
        end={[1, 1]}
        style={{
          flex: 1,
          borderRadius: 50,
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconCheck />
      </LinearGradient>
    </View>
  );
};

export default SliderButton;
