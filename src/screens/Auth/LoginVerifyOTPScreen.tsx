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
import useTokenStore from "src/store/tokenStore";
import ProfileServices from "src/services/ProfileServices";
import useUserStore from "src/store/userStore";
import AuthHeader from "src/components/AuthHeader";
import BackButtonWithGradient from "src/components/BackButtonWithGradient";
import { LinearGradient } from "expo-linear-gradient";
import BigColoredButton from "src/components/BigColoredButton";
import { parseMobile } from "src/utils/PhoneNumber";
import { Loading, StatusCode } from "src/constants/enums";
import StrokeText from "src/components/StrokeText";
import analytics from "@react-native-firebase/analytics";

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

const LoginVerifyOTPScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"LoginVerifyOTP">) => {
  const { email, password, mobile } = route.params;

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [loading, setLoading] = useState<Loading>(Loading.idle);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpCorrect, setOtpCorrect] = useState<any>();

  const setIsFirstTime = useUserStore((state) => state.setIsFirstTime);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);

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
    setErrorMessage("");
    setTimer(90);
    try {
      const res = await AuthServices.getOtpLogin({
        email,
        password,
      });
    } catch (error: any) {
      Toast.error(error.response.data.message);
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

  const onSubmit = async () => {
    setErrorMessage("");
    setLoading(Loading.loading);
    try {
      const res = await AuthServices.login(email, password, value);
      setIsFirstTime(res.data[0].isFirstLogin);
      setAccessToken(res.data[0].accessToken);
      setRefreshToken(res.data[0].refreshToken);
      navigation.navigate("FetchProfile");
      analytics().logEvent("login");

      // setOtpCorrect(res?.data)

      Toast.success("Success! Your OTP has been verified");
      setLoading(Loading.idle);
    } catch (error: any) {
      setLoading(Loading.error);
      Toast.error(error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <SV style={{ flex: 1, gap: 16 }}>
      <AuthHeader logoCentered />
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* <BackButtonWithGradient /> */}

        <View
          style={{
            borderWidth: 1,
            marginVertical: 16,
            borderBottomWidth: 4,
            borderRadius: 8,
            borderColor: Colors.velvet,
            marginTop: "18%",
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

            <View style={{ marginTop: 20 }}>
              <StrokeText myText={`Verify OTP`} />
            </View>

            {errorMessage ? (
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.velvet,
                  lineHeight: 20,
                  textAlign: "center",

                  top: 10,
                }}
              >
                Heck, that code isn’t quite right.Please click below to resend &
                we’ll get you a fresh code.
              </Text>
            ) : (
              <View>
                <View style={{ alignItems: "center", gap: 8 }}>
                  <Text
                    textType="medium"
                    style={{
                      fontSize: 16,
                      color: Colors.velvet,
                      lineHeight: 25,
                      textAlign: "center",
                      marginTop: 5,
                    }}
                  >
                    We’ve sent a verification code to {`\n`}
                    {parseMobile(mobile)}
                  </Text>
                </View>

                {!otpCorrect && timer !== 0 ? (
                  <Text
                    textType="medium"
                    style={{
                      fontSize: 16,
                      color: Colors.velvet,
                      alignSelf: "center",
                    }}
                  >
                    Valid for {timer} seconds
                  </Text>
                ) : (
                  <View style={{ height: 21 }} />
                )}
              </View>
            )}

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

              <BigColoredButton
                style={{ width: "50%" }}
                onPress={() => (timer !== 0 ? onSubmit() : handleResendOTP())}
                disabled={
                  timer == 0
                    ? false
                    : (timer > 0 && value.length !== 4) ||
                      (timer > 0 && loading === "loading") ||
                      otpCorrect
                    ? true
                    : false
                }
                // disabled={timer !== 0}
                text={timer !== 0 ? "Confirm" : "Resend"}
              />
            </View>
          </LinearGradient>
        </View>

        {/* <View
          style={{
            paddingTop: 16,
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
          }}
        >
          <BigColoredButton
            onPress={() => {
              navigation.goBack();
            }}
            text="Previous"
          />
          <BigColoredButton
            onPress={() => {
              setIsFirstTime(otpCorrect[0].isFirstLogin);
              setAccessToken(otpCorrect[0].accessToken);
              setRefreshToken(otpCorrect[0].refreshToken);
            }}
            disabled={otpCorrect ? false : true}
            text="Next"
          />
        </View> */}
      </ScrollView>
    </SV>
  );
};

export default LoginVerifyOTPScreen;
