import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { Children, FC, ReactElement, useEffect, useState } from "react";
import { Icon, Text } from "./Themed";
import { WebView } from "react-native-webview";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface props {
  link?: any;
  onClose?: () => void;
}
export const WebViewModal: FC<props> = ({
  link,
  onClose,
}: any): ReactElement => {
  const [load, setLoad] = useState(true);
  return (
    <Modal animationType={"slide"} visible={true} transparent>
      <View style={styles.container}>
        {/* <View style={{ marginTop: '10%' }}> */}
        <TouchableOpacity style={styles.crossBtn} onPress={onClose}>
          <Icon name="close" size={30} color={Colors.velvet} />
        </TouchableOpacity>
        <View style={styles.modalInnerContent}>
          <WebView
            onLoadEnd={() => setLoad(false)}
            source={{ uri: link }}
            style={{ borderRadius: 5, backgroundColor: "black" }}
          />

          {load && (
            <View style={styles.positionOfLoader}>
              <ActivityIndicator size={"small"} color={Colors.velvet} />
            </View>
          )}
        </View>
        {/* </View> */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(49, 49, 49, 0.8)",
    justifyContent: "center",
  },
  crossBtn: {
    alignSelf: "flex-end",
    marginRight: 10,
    marginBottom: 10,
  },
  crossImg: {
    tintColor: "blue",
  },
  modalInnerContent: {
    height: Platform.OS === "android" ? "90%" : "85%",
  },
  positionOfLoader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.7,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
