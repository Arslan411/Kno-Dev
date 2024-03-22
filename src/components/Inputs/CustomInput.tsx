import {
  Pressable,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, Colors } from "src/constants/Colors";
import { Text } from "../Themed";
import React, { Children, useState } from "react";
import BigColoredButton from "../BigColoredButton";
import IconButton from "../IconButton";
import { images } from "src/utils/Images";

type InputProps = {
  value?: string;
  onChangeText?: (key: string) => void;
  placeholderTxt?: string;
  width?: any;
  customStyles?: any;
  inputIcon?: boolean;
  source?: { uri: string } | any;
  customIconStyle?: any;
  onIconPress?: () => void;
  editable?: boolean;
  keyboardType?: any;
  secureTextEntry?: any;
};

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholderTxt,
  width,
  customStyles,
  inputIcon,
  source,
  customIconStyle,
  onIconPress,
  editable,
  keyboardType,
  secureTextEntry,
}) => {
  return (
    <View
      style={[
        styles.inputContainer,
        { width: width ? width : "100%", ...customStyles },
      ]}
    >
      <TextInput
        editable={editable}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholderTxt}
        placeholderTextColor={Colors.primary}
        keyboardType={keyboardType}
      />
      {inputIcon ? (
        <Pressable onPress={onIconPress}>
          <Image
            style={[styles.icon, { ...customIconStyle }]}
            source={source}
          />
        </Pressable>
      ) : null}
    </View>
  );
};
export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1.2,
    borderColor: Colors.primary,
    height: RFPercentage(5.5),
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: RFPercentage(1.8),
    width: "100%",
  },
  icon: {
    height: 20,
    width: 20,
  },
});
