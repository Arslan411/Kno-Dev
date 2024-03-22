import { ScrollView, TextInput, View } from "react-native";
import { SV, Text } from "src/components/Themed";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import React from "react";
import { Colors } from "src/constants/Colors";
import { Controller, useForm } from "react-hook-form";
import {
  ForgotPasswordDataType,
  ForgotPasswordFormSchema,
} from "src/types/AuthTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthServices from "src/services/AuthServices";
import { Toast } from "src/components/ToastManager";
import AuthHeader from "src/components/AuthHeader";
import FormGradient from "src/components/forms/FormGradient";
import BigColoredButton from "src/components/BigColoredButton";
import BackButtonWithGradient from "src/components/BackButtonWithGradient";
import { Loading, StatusCode } from "src/constants/enums";

const ForgotPasswordScreen = ({
  navigation,
}: RootStackScreenProps<"ForgotPassword">) => {
  const [loading, setLoading] = React.useState<Loading>(Loading.idle);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordDataType>({
    resolver: yupResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (email: ForgotPasswordDataType) => {
    setLoading(Loading.loading);
    try {
      const res = await AuthServices.forgotPassword(email);
      setLoading(Loading.idle);
      Toast.success(res.data.message);
      if (res.status === 200) {
        navigation.navigate("OpenEmail", {
          email: email.email,
        });
        reset();
      }
    } catch (error: any) {
      setLoading(Loading.error);
      Toast.error(error.response.data.message);
    }
  };

  return (
    <SV
      style={{
        flex: 1,
        gap: 16,
      }}
    >
      <AuthHeader text="forgot something" subText="Reset Your Password" />

      <ScrollView
        style={{ flex: 1, marginHorizontal: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <BackButtonWithGradient />

        <View
          style={{
            gap: 16,
          }}
        >
          <Text
            textType="LBRegular"
            style={{
              fontSize: 14,
              color: Colors.velvet,
            }}
          >
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormGradient vertical>
                <TextInput
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoComplete="email"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value.trim()}
                  style={{
                    fontFamily: "DMSans_500Medium",
                    color: Colors.velvet,
                  }}
                />
              </FormGradient>
            )}
          />
          {errors.email && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
              }}
            >
              {errors.email.message}
            </Text>
          )}

          <BigColoredButton
            onPress={handleSubmit(onSubmit)}
            text="Reset Password"
            isLoading={loading === Loading.loading}
            disabled={loading === Loading.loading}
          />
        </View>
      </ScrollView>
    </SV>
  );
};

export default ForgotPasswordScreen;
