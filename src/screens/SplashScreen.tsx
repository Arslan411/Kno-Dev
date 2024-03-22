import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native";
import { SV } from "src/components/Themed";
import { Colors } from "src/constants/Colors";

const SplashScreen = () => {
  return (
    <SV style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={Colors.velvet} size="large" />
      </View>
    </SV>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
