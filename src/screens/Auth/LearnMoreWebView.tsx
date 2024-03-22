import { SV } from "src/components/Themed";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import { WebView } from "react-native-webview";
import { Alert, Platform, StatusBar } from "react-native";
import Constants from "expo-constants";

const LearnMoreWebView = ({
  navigation,
  route,
}: RootStackScreenProps<"PaymentWebView">) => {
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
        source={{ uri: "https://kno.co/collections/frontpage" }}
        style={{ marginTop: fetchStatusBarHeight(), flex: 1 }}
        onNavigationStateChange={(navState) => {
          if (navState?.canGoBack) {
            navigation?.navigate("Login");
          }
        }}
      />
    </SV>
  );
};

export default LearnMoreWebView;
