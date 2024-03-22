import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { RFPercentage } from "react-native-responsive-fontsize";
import BigColoredButton from "src/components/BigColoredButton";
import Cards from "src/components/Cards/Cards";
import { useModal } from "src/components/GlobalModal/GlobalModal";
import HomeHeader from "src/components/HomeScreen/Header";
import UserHeader from "src/components/HomeScreen/UserHeader";
import IconButton from "src/components/IconButton";
import { SV, Text } from "src/components/Themed";
import { Toast } from "src/components/ToastManager";
import FormGradient from "src/components/forms/FormGradient";
import { Colors, gradients } from "src/constants/Colors";
import { Loading } from "src/constants/enums";
import TestServices from "src/services/TestServices";
import useOrderStore from "src/store/orderStore";
import useSampleCollectionStore from "src/store/sampleCollectionStore";
import usesampleCollectionStore from "src/store/sampleCollectionStore";
import { RootStackScreenProps } from "src/types/NavigationTypes";
import { images } from "src/utils/Images";

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
              heading: "Heck yeah! You're all set.",
              body: "Mail the kit, the lab will do some science and you'll have your results shortly.",
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
      <UserHeader />
      <View style={{ padding: 10 }}>
        <Cards headerCard headerTxt="Complete Test" backNavigate>
          <View
            style={{
              margin: 8,
            }}
          >
            <Text textType="medium" style={styles.Text1}>
              Please provide the date and time of your knō kit sample
              collection. When did you pee in the cup?
            </Text>
          </View>

          <View
            style={{
              margin: 8,
            }}
          >
            <Text textType="bold" style={styles.Text2}>
              Date and time of sample collection*
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginVertical: 10,
            }}
          >
            <Pressable
              onPress={() => setOpen(true)}
              style={{
                width: "45%",
                height: 40,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.primary,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Text style={styles.Text3}>
                {date ? date.toLocaleDateString("en-US") : "Collection date"}
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

              <Image
                source={images.calenderIcon}
                style={{
                  width: 17,
                  height: 17,
                }}
              />
            </Pressable>

            <Pressable
              onPress={() => setOpenTime(true)}
              style={{
                width: "45%",
                height: 40,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.Text3}>
                {time
                  ? (time?.getHours()! < 10
                      ? "0" + time?.getHours()!
                      : time?.getHours()!) +
                    ":" +
                    (time?.getMinutes()! < 10
                      ? "0" + time?.getMinutes()!
                      : time?.getMinutes()!)
                  : "Collection time"}
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
          </View>

          <View
            style={{
              margin: 8,
            }}
          >
            <Text textType="medium" style={styles.Text4}>
              *Samples that do not have this information will not be able to be
              processed and test results will not be able to be provided.
            </Text>
          </View>

          <View
            style={{
              marginTop: 8,
              marginBottom: "4%",
              borderTopWidth: 2,
              alignItems: "center",
              borderTopColor: Colors.primary,
            }}
          >
            <View
              style={{
                width: 100,
                height: 40,
                marginTop: 8,
              }}
            >
              <IconButton
                checked
                checkedLabel="Confirm"
                height={RFPercentage(5.5)}
                disabled={
                  date === null || time === null || loading === Loading.loading
                }
                // loading={true}
                onPress={() => {
                  onSubmit();
                }}
              />
              {/* <LinearGradient
                colors={gradients.primary}
                start={[0.3, 0]}
                end={[1, 0]}
                style={{
                  flex: 1,
                  width: 100,
                  height: 40,
                  borderWidth: 1,
                  borderRadius: 100,
                }}
              >


                <Pressable
                  disabled={
                    date === null ||
                    time === null ||
                    loading === Loading.loading
                  }
                  isLoading={true}
                  text="Confirm"
                  onPress={() => {
                    onSubmit();
                  }}
                  style={{
                    width: 100,
                    height: 40,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: date === null || time === null ? 0.3 : 1,
                  }}
                >
                  <Text textType="medium" style={styles.Text5}>
                    Confirm
                  </Text>
                </Pressable>
              </LinearGradient> */}
            </View>
          </View>
        </Cards>
      </View>
    </SV>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    borderWidth: 1,
    borderBottomWidth: 5,
    borderRadius: 10,
    margin: 8,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  headingText: {
    color: Colors.velvet,
    textAlign: "center",
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  Text1: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  Text2: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  Text3: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.4,
    width: "70%",
  },
  Text4: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  Text5: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 1.5,
  },
});

export default SampleCollectionScreen;

// import { useEffect, useState } from "react";
// import {
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   View,
// } from "react-native";
// import DatePicker from "react-native-date-picker";
// import { RFPercentage } from "react-native-responsive-fontsize";
// import BigColoredButton from "src/components/BigColoredButton";
// import { useModal } from "src/components/GlobalModal/GlobalModal";
// import HomeHeader from "src/components/HomeScreen/Header";
// import UserHeader from "src/components/HomeScreen/UserHeader";
// import { SV, Text } from "src/components/Themed";
// import { Toast } from "src/components/ToastManager";
// import FormGradient from "src/components/forms/FormGradient";
// import { Colors } from "src/constants/Colors";
// import { Loading, OrderStatus } from "src/constants/enums";
// import TestServices from "src/services/TestServices";
// import useOrderStore from "src/store/orderStore";
// import useSampleCollectionStore from "src/store/sampleCollectionStore";
// import usesampleCollectionStore from "src/store/sampleCollectionStore";
// import {
//   HomeStackScreenProps,
//   RootStackScreenProps,
// } from "src/types/NavigationTypes";

// export type SampleCollectionData = {
//   orderId: number;
//   collectionDate: string;
// };

// const HomeSampleCollectionScreen = ({
//   navigation,
//   route,
// }: HomeStackScreenProps<"HomeSampleCollection">) => {
//   const order = useOrderStore((state) => state.order);
//   const setOrder = useOrderStore((state) => state.setOrder);
//   const [date, setDate] = useState<Date | null>(null);
//   const [open, setOpen] = useState<boolean>(false);
//   const [time, setTime] = useState<Date | null>(null);
//   const [openTime, setOpenTime] = useState<boolean>(false);
//   const { showModal, closeModal } = useModal();
//   const [loading, setLoading] = useState<Loading>(Loading.idle);

//   const navigate = () => {
//     closeModal();
//     navigation.reset({
//       index: 0,
//       routes: [{ name: "Dashboard" }],
//     });
//   };

//   const click = () => {
//     const timer = setTimeout(() => navigate(), 350);
//     return () => clearTimeout(timer);
//   };

//   const { SampleCollection, setSampleCollection } = useSampleCollectionStore(
//     (state) => ({
//       SampleCollection: state.sampleCollection,
//       setSampleCollection: state.setSampleCollection,
//     })
//   );

//   const fetchOrder = async () => {
//     try {
//       const res = await TestServices.fetchOrderStatus();
//       if (res?.data && res?.data?.data?.[0]) {
//         setOrder(res.data.data[0]);
//       }
//     } catch (error: any) {
//       console.log(error.response.data.message);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//   }, []);

//   const onSubmit = async () => {
//     const newDate = new Date(
//       date?.getFullYear()!,
//       date?.getMonth()!,
//       date?.getDate()!,
//       time?.getHours()!,
//       time?.getMinutes()!
//     );

//     try {
//       setLoading(Loading.loading);
//       if (order?.orderId) {
//         const res = await TestServices.updateSampleCollectionDate({
//           orderId: order?.orderId,
//           collectionDate: newDate.toISOString(),
//         });

//         if (res.status === 200) {
//           const orderResponse = await TestServices.fetchOrderStatus();

//           if (orderResponse.status === 200) {
//             setOrder(orderResponse.data.data[0]);
//             setSampleCollection(true);
//             setLoading(Loading.idle);
//             showModal({
//               isVisible: true,
//               heading: "Heck yeah! You’re all set.",
//               body: "Mail the kit, the lab will do some science and you’ll have your results shortly.",
//               buttonText: "Exit",
//               onClose: click,
//             });
//           }
//         }
//       }
//     } catch (error: any) {
//       setLoading(Loading.error);
//       console.log(error.response.data);
//       Toast.error(error.response.data.message);
//     }
//   };

//   const handleModel = () => {
//     showModal({
//       isVisible: true,
//       heading: `Alert!`,
//       body: "Please provide the details when you get the kit.",
//       buttonText: "Close",
//       onClose: () => {
//         closeModal();
//       },
//     });
//   };

//   return (
//     <SV style={{ flex: 1 }}>
//       <UserHeader />
//       <ScrollView
//         style={styles.container}
//         keyboardShouldPersistTaps="handled"
//         contentContainerStyle={{
//           paddingTop: 8,
//           paddingBottom:
//             Platform.OS === "ios"
//               ? RFPercentage(16) + 72
//               : RFPercentage(16) + 72,
//         }}
//       >
//         <View style={styles.f1g4}>
//           <Text textType="LBRegular" style={styles.label}>
//             Please provide the date and time of your knō kit sample collection.
//             When did you pee in the cup?
//           </Text>
//         </View>

//         <View style={styles.f1g4}>
//           <Text textType="LBBold" style={styles.labelBold}>
//             Date of Sample Collection
//             <Text style={{ color: Colors.velvet, justifyContent: "center" }}>
//               *
//             </Text>
//           </Text>
//         </View>

//         <View style={styles.f1g4}>
//           <FormGradient vertical>
//             <Pressable onPress={() => setOpen(true)}>
//               <Text
//                 textType="medium"
//                 style={{
//                   color: Colors.velvet,
//                   fontSize: 16,
//                   letterSpacing: 0.75,
//                 }}
//               >
//                 {date ? date.toLocaleDateString("en-US") : "Select Date"}
//               </Text>
//               <DatePicker
//                 modal
//                 theme="light"
//                 mode="date"
//                 open={open}
//                 maximumDate={date ? date : new Date()}
//                 date={date ? date : new Date()}
//                 onConfirm={(date) => {
//                   setOpen(false);
//                   setDate(date);
//                 }}
//                 onCancel={() => {
//                   setOpen(false);
//                 }}
//               />
//             </Pressable>
//           </FormGradient>
//         </View>

//         <View style={styles.f1g4}>
//           <Text textType="LBBold" style={styles.labelBold}>
//             Time of Sample Collection
//             <Text style={{ color: Colors.velvet, justifyContent: "center" }}>
//               *
//             </Text>
//           </Text>
//         </View>

//         <View style={styles.small}>
//           <FormGradient vertical disabled={date === null}>
//             <Pressable
//               onPress={() => setOpenTime(true)}
//               disabled={date === null}
//             >
//               <Text
//                 textType="medium"
//                 style={{
//                   color: Colors.velvet,
//                   fontSize: 16,
//                   letterSpacing: 0.75,
//                 }}
//               >
//                 {time
//                   ? (time?.getHours()! < 10
//                       ? "0" + time?.getHours()!
//                       : time?.getHours()!) +
//                     ":" +
//                     (time?.getMinutes()! < 10
//                       ? "0" + time?.getMinutes()!
//                       : time?.getMinutes()!)
//                   : "Select Time"}
//               </Text>
//               <DatePicker
//                 modal
//                 theme="light"
//                 mode="time"
//                 open={openTime}
//                 date={time ? time : new Date()}
//                 onConfirm={(time) => {
//                   setOpenTime(false);
//                   setTime(time);
//                 }}
//                 onCancel={() => {
//                   setOpenTime(false);
//                 }}
//               />
//             </Pressable>
//           </FormGradient>
//         </View>

//         <View style={styles.smallCenter}>
//           <BigColoredButton
//             disabled={
//               date === null || time === null || loading === Loading.loading
//             }
//             isLoading={loading === Loading.loading}
//             text="Confirm"
//             onPress={() => {
//               if (
//                 order?.status === OrderStatus.NotCreated ||
//                 order?.status === OrderStatus.Created ||
//                 order?.status === OrderStatus.NotApproved
//               ) {
//                 handleModel();
//               } else {
//                 onSubmit();
//               }
//             }}
//           />
//         </View>

//         <View style={styles.f1g4}>
//           <Text textType="regular" style={{ color: Colors.velvet }}>
//             *Samples that do not have this information will not be able to be
//             processed and test results will not be able to be provided.
//           </Text>
//         </View>
//       </ScrollView>
//     </SV>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column",
//     paddingHorizontal: 16,
//   },
//   nameRow: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   f1g4: {
//     flex: 1,
//     gap: 4,
//     marginTop: 16,
//   },
//   small: {
//     width: "50%",
//     gap: 4,
//     marginTop: 16,
//   },
//   smallCenter: {
//     flexDirection: "row",
//     flex: 1,
//     gap: 4,
//     marginTop: 32,
//     width: "50%",
//     alignSelf: "center",
//   },
//   label: {
//     fontSize: 14,
//     color: Colors.velvet,
//   },
//   labelBold: {
//     fontSize: 18,
//     color: Colors.velvet,
//   },
//   emailAndPhoneInput: {
//     fontFamily: "DMSans_500Medium",
//     color: Colors.velvet,
//   },
// });

// export default HomeSampleCollectionScreen;
