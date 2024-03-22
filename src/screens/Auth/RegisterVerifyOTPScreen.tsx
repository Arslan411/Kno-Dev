import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SV, Text } from "src/components/Themed";
import { RootStackScreenProps } from "src/types/NavigationTypes";

import {
  CodeField,
  Cursor,
  MaskSymbol,
  isLastFilledCell,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { Colors, gradients } from "src/constants/Colors";
import IconIphone from "src/assets/IconIphone";
import { Toast } from "src/components/ToastManager";
import AuthServices from "src/services/AuthServices";
import AuthHeader from "src/components/AuthHeader";
import { LinearGradient } from "expo-linear-gradient";
import BigColoredButton from "src/components/BigColoredButton";
import { CommonActions } from "@react-navigation/native";

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    gap: 16,
    flexDirection: "row",
  },
  cell: {
    width: 44,
    height: 44,
    lineHeight: 40,
    fontSize: 26,
    borderRadius: 8,
    fontFamily: "monospace",
    color: Colors.velvet,
    textAlign: "center",
  },
  focusCell: {
    borderColor: Colors.primary,
  },
});

const CELL_COUNT = 4;

const RegisterVerifyOTPScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"RegisterVerifyOTP">) => {
  const { form } = route.params;
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const [timer, setTimer] = useState(90);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === 0) {
        clearInterval(interval);
      } else {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOTP = async () => {
    setTimer(90);
    try {
      const res = await AuthServices.getOtpRegister({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobile: form.mobile,
        referringEmail: form.referringEmail ? form.referringEmail : null,
        password: form.password,
      });
    } catch (error: any) {
      Toast.error(error.response.data.message);
    }
  };

  const handleNext = async () => {
    setLoading("loading");

    if (value.length >= 4) {
      try {
        const res = await AuthServices.register({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          referringEmail: form.referringEmail ? form.referringEmail : null,
          password: form.password,
          mobile: `+1${form.mobile}`,
          allowCommunication: true,
        });
        if (res.status === 201) {
          setLoading("idle");
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "RegistrationSuccess" }],
            })
          );
        }
      } catch (error: any) {
        setLoading("idle");
        Toast.error(error.response.data.message);
      }
    }
  };

  const renderCell = ({
    index,
    symbol,
    isFocused,
  }: {
    index: number;
    symbol: string;
    isFocused: boolean;
  }) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="•"
          isLastFilledCell={isLastFilledCell({ index, value })}
        >
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <View
        key={index}
        style={{
          width: 44,
          height: 44,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: Colors.velvet,
          borderBottomWidth: 4,
        }}
      >
        <LinearGradient
          colors={gradients.primary}
          style={{
            flex: 1,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {textChild}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SV style={{ flex: 1, gap: 16 }}>
      <AuthHeader text="Step 3/3" subText="Verify your info" />
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            borderWidth: 1,
            marginVertical: 16,
            borderBottomWidth: 4,
            borderRadius: 8,
            borderColor: Colors.velvet,
          }}
        >
          <LinearGradient
            colors={gradients.primary}
            start={[0.3, 0]}
            end={[1, 0.5]}
            style={{
              borderRadius: 8,
              padding: 16,
            }}
          >
            <View
              style={{
                alignSelf: "center",
              }}
            >
              <IconIphone />
            </View>
            <Text
              textType="LBBold"
              style={{
                fontSize: 24,
                color: Colors.velvet,
                paddingVertical: 16,
                textAlign: "center",
              }}
            >
              Verify OTP
            </Text>

            <View style={{ alignItems: "center", gap: 8 }}>
              <Text
                textType="medium"
                style={{
                  fontSize: 16,
                  color: Colors.velvet,
                  lineHeight: 25,
                  textAlign: "center",
                }}
              >
                We’ve sent a OTP to {`\n`}
                {form.mobile}
              </Text>
            </View>
            <View
              style={{
                marginTop: 16,
                gap: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CodeField
                ref={ref}
                {...props}
                autoFocus={true}
                value={value.trim()}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={renderCell}
              />

              {timer !== 0 && (
                <Text
                  textType="medium"
                  style={{ fontSize: 16, color: Colors.velvet }}
                >
                  {timer} seconds remaining
                </Text>
              )}

              <BigColoredButton
                onPress={handleResendOTP}
                disabled={timer !== 0}
                text=" Resend"
              />
            </View>
          </LinearGradient>
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingVertical: 16,
            gap: 8,
          }}
        >
          <BigColoredButton
            onPress={() => {
              navigation.goBack();
            }}
            text="Previous"
          />
          <BigColoredButton
            disabled={value.length !== 4 || loading === "loading"}
            onPress={handleNext}
            isLoading={loading === "loading"}
            text="Verify"
          />
        </View>
      </ScrollView>
    </SV>
  );
};

export default RegisterVerifyOTPScreen;
