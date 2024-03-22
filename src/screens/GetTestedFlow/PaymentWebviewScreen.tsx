import { SV } from "src/components/Themed";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import { WebView } from "react-native-webview";
import { Alert, Platform, StatusBar } from "react-native";
import Constants from "expo-constants";

const PaymentWebViewScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"PaymentWebView">) => {
  const { IntakeForm, url } = route.params;

  const fetchStatusBarHeight = () => {
    if (Platform.OS === "android") {
      if (StatusBar.currentHeight) return StatusBar.currentHeight;
    } else {
      return Constants.statusBarHeight;
    }
  };

  navigation.addListener("beforeRemove", (e) => {
    if (e.data.action.type === "GO_BACK") {
      e.preventDefault();
    }
  });

  return (
    <SV>
      <WebView
        source={{ uri: url }}
        style={{ marginTop: fetchStatusBarHeight(), flex: 1 }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("/success")) {
            navigation.navigate("PaymentSuccess");
          } else if (navState.url.includes("/cancel")) {
            navigation.navigate("IntakeOptions", {
              IntakeForm: route.params.IntakeForm,
            });
          }
        }}
      />
    </SV>
  );
};

export default PaymentWebViewScreen;
