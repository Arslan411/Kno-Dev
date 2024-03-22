import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { RFPercentage } from "react-native-responsive-fontsize";
import BigColoredButton from "src/components/BigColoredButton";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import HomeHeader from "src/components/HomeScreen/Header";
import { SV, Text } from "src/components/Themed";
import { Toast } from "src/components/ToastManager";
import FormGradient from "src/components/forms/FormGradient";
import { Colors } from "src/constants/Colors";
import { Loading } from "src/constants/enums";
import TestServices from "src/services/TestServices";
import useOrderStore from "src/store/orderStore";
import useSampleCollectionStore from "src/store/sampleCollectionStore";
import usesampleCollectionStore from "src/store/sampleCollectionStore";
import { RootStackScreenProps } from "src/types/NavigationTypes";

export type SampleCollectionData = {
  orderId: number;
  collectionDate: string;
};

const SampleCollectionScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"SampleCollection">) => {
  const order = useOrderStore((state) => state.order);
  const setOrder = useOrderStore((state) => state.setOrder);
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [time, setTime] = useState<Date | null>(null);
  const [openTime, setOpenTime] = useState<boolean>(false);
  const { showModal, closeModal } = useModal();
  const [loading, setLoading] = useState<Loading>(Loading.idle);

  const navigate = () => {
    closeModal();
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

  const click = () => {
    const timer = setTimeout(() => navigate(), 350);
    return () => clearTimeout(timer);
  };

  const { SampleCollection, setSampleCollection } = useSampleCollectionStore(
    (state) => ({
      SampleCollection: state.sampleCollection,
      setSampleCollection: state.setSampleCollection,
    })
  );

  const onSubmit = async () => {
    const newDate = new Date(
      date?.getFullYear()!,
      date?.getMonth()!,
      date?.getDate()!,
      time?.getHours()!,
      time?.getMinutes()!
    );

    try {
      setLoading(Loading.loading);
      if (order?.orderId) {
        const res = await TestServices.updateSampleCollectionDate({
          orderId: order?.orderId,
          collectionDate: newDate.toISOString(),
        });

        if (res.status === 200) {
          const orderResponse = await TestServices.fetchOrderStatus();

          if (orderResponse.status === 200) {
            setOrder(orderResponse.data.data[0]);
            setSampleCollection(true);
            setLoading(Loading.idle);
            showModal({
              isVisible: true,
              heading: "Heck yeah! You’re all set.",
              body: "Mail the kit, the lab will do some science and you’ll have your results shortly.",
              buttonText: "Exit",
              onClose: click,
            });
          }
        }
      }
    } catch (error: any) {
      setLoading(Loading.error);
      console.log(error.response.data);
      Toast.error(error.response.data.message);
    }
  };

  return (
    <SV style={{ flex: 1 }}>
      <HomeHeader />
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom:
            Platform.OS === "ios"
              ? RFPercentage(16) + 72
              : RFPercentage(16) + 72,
        }}
      >
        <View style={styles.f1g4}>
          <Text textType="LBRegular" style={styles.label}>
            Please provide the date and time of your knō kit sample collection.
            When did you pee in the cup?
          </Text>
        </View>

        <View style={styles.f1g4}>
          <Text textType="LBBold" style={styles.labelBold}>
            Date of Sample Collection
            <Text style={{ color: Colors.velvet, justifyContent: "center" }}>
              *
            </Text>
          </Text>
        </View>

        <View style={styles.f1g4}>
          <FormGradient vertical>
            <Pressable onPress={() => setOpen(true)}>
              <Text
                textType="medium"
                style={{
                  color: Colors.velvet,
                  fontSize: 16,
                  letterSpacing: 0.75,
                }}
              >
                {date ? date.toLocaleDateString("en-US") : "Select Date"}
              </Text>
              <DatePicker
                modal
                theme="light"
                mode="date"
                open={open}
                maximumDate={date ? date : new Date()}
                date={date ? date : new Date()}
                onConfirm={(date) => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </Pressable>
          </FormGradient>
        </View>

        <View style={styles.f1g4}>
          <Text textType="LBBold" style={styles.labelBold}>
            Time of Sample Collection
            <Text style={{ color: Colors.velvet, justifyContent: "center" }}>
              *
            </Text>
          </Text>
        </View>

        <View style={styles.small}>
          <FormGradient vertical disabled={date === null}>
            <Pressable
              onPress={() => setOpenTime(true)}
              disabled={date === null}
            >
              <Text
                textType="medium"
                style={{
                  color: Colors.velvet,
                  fontSize: 16,
                  letterSpacing: 0.75,
                }}
              >
                {time
                  ? (time?.getHours()! < 10
                      ? "0" + time?.getHours()!
                      : time?.getHours()!) +
                    ":" +
                    (time?.getMinutes()! < 10
                      ? "0" + time?.getMinutes()!
                      : time?.getMinutes()!)
                  : "Select Time"}
              </Text>
              <DatePicker
                modal
                theme="light"
                mode="time"
                open={openTime}
                date={time ? time : new Date()}
                onConfirm={(time) => {
                  setOpenTime(false);
                  setTime(time);
                }}
                onCancel={() => {
                  setOpenTime(false);
                }}
              />
            </Pressable>
          </FormGradient>
        </View>

        <View style={styles.smallCenter}>
          <BigColoredButton
            disabled={
              date === null || time === null || loading === Loading.loading
            }
            isLoading={loading === Loading.loading}
            text="Confirm"
            onPress={() => {
              onSubmit();
            }}
          />
        </View>

        <View style={styles.f1g4}>
          <Text textType="regular" style={{ color: Colors.velvet }}>
            *Samples that do not have this information will not be able to be
            processed and test results will not be able to be provided.
          </Text>
        </View>
      </ScrollView>
    </SV>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
  },
  nameRow: {
    flexDirection: "row",
    gap: 8,
  },
  f1g4: {
    flex: 1,
    gap: 4,
    marginTop: 16,
  },
  small: {
    width: "50%",
    gap: 4,
    marginTop: 16,
  },
  smallCenter: {
    flexDirection: "row",
    flex: 1,
    gap: 4,
    marginTop: 32,
    width: "50%",
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    color: Colors.velvet,
  },
  labelBold: {
    fontSize: 18,
    color: Colors.velvet,
  },
  emailAndPhoneInput: {
    fontFamily: "DMSans_500Medium",
    color: Colors.velvet,
  },
});

export default SampleCollectionScreen;
