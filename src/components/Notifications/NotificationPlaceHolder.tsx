import HomeHeader from "src/components/HomeScreen/Header";
import { Icon, SV, Text } from "src/components/Themed";
import {
  HomeStackScreenProps,
  RootTabScreenProps,
} from "src/types/NavigationTypes";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, gradients } from "src/constants/Colors";
import { Platform, Pressable, ScrollView, View, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import FormGradient from "src/components/forms/FormGradient";
import { Path, Svg } from "react-native-svg";
import SliderCheck from "src/components/Notifications/SliderCheck";
import SliderAccordion from "./SliderAccordion";
import useOrderStore from "src/store/orderStore";
import StrokeText from "../StrokeText";
import { OrderStatus } from "src/constants/enums";
import NotifiDetail from "./NotifiDetail";
import { useNavigation } from "@react-navigation/native";
import { images } from "src/utils/Images";
import Cards from "../Cards/Cards";
export type PlaceholderType = {
  id: number;
  title: string;
  subText: React.ReactNode;
};
const NotificationPlaceHolder = ({
  navigation,
}: RootTabScreenProps<"Notifications">) => {
  const order = useOrderStore((state) => state.order);
  const setOrder = useOrderStore((state) => state.setOrder);
  const [current, setCurrent] = useState<number>(0);
  const Navigation = useNavigation();
  console.log("current---", current);
  useEffect(() => {
    const status = order?.status;
    switch (status) {
      case OrderStatus.Created:
      case OrderStatus.NotCreated:
        setCurrent(1);
        break;
      case OrderStatus.PendingReceipt:
      case OrderStatus.Shipped:
      case OrderStatus.CustomerInTransit:
      case OrderStatus.CustomerOutForDelivery:
        setCurrent(2);
        break;
      case OrderStatus.CustomerDelivered:
        setCurrent(3);
        break;
      case OrderStatus.LabInTransit:
      case OrderStatus.LabOutForDelivery:
      case OrderStatus.LabDelivered:
        setCurrent(4);
        break;
      case OrderStatus.InLab:
      case OrderStatus.InMroReview:
      case OrderStatus.PendingMroCcf:
      case OrderStatus.PendingAffidavit:
      case OrderStatus.Retest:
      case OrderStatus.LabReview:
      case OrderStatus.ResultsReady:
        setCurrent(5);
        break;
      case OrderStatus.Released:
        setCurrent(6);
        break;
      default:
        setCurrent(0);
        break;
    }
  }, [order]);
  const data: PlaceholderType[] = [
    {
      id: 1,
      title: "Ordered",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          Heck yeah, you just took the first step towards better knowing your
          sexual wellness. Your kno kit has been ordered and should ship within
          24 hours. Keep an eye out for a notification to let you know when it’s
          en route.
        </Text>
      ),
    },
    {
      id: 2,
      title: "knō kit is En Route",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          This is kind of a big deal, your kno kit is headed your way.
        </Text>
      ),
    },
    {
      id: 3,
      title: "knō kit was Delivered",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          Pssst....the mail’s here. Your kno kit has been delivered to wherever
          it is that you get mail - mailbox, PO box, your office (no judgement),
          or whatever. Important thing being that it’s arrived.
        </Text>
      ),
    },
    {
      id: 4,
      title: "knō kit En Route to Lab",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          We’re impressed. You completed your knō kit all by yourself (or maybe
          your partner helped? Who knows?) What matters is you did it, and it’s
          on its way to the lab. You did remember to complete your
        </Text>
      ),
    },
    {
      id: 5,
      title: "Lab is Processing knō kit",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          Good news everyone, your knō kit has reached our lab partners and is
          being processed as we speak - or text...whatever. We’ll let you know
          as soon as your results are ready for you.
        </Text>
      ),
    },
    {
      id: 6,
      title: "knō kit Results are Ready",
      subText: (
        <Text
          textType="regular"
          style={{
            fontSize: 14,
            color: Colors.velvet,
          }}
        >
          The results are in. We know that this can be a stressful step, but we
          want you to remember that - no matter what the results say - knowing
          is the best thing you can do for your sexual wellness.
        </Text>
      ),
    },
  ];
  return (
    <ScrollView
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingBottom:
          Platform.OS === "ios" ? RFPercentage(16) + 64 : RFPercentage(16) + 64,
      }}
    >
      <View style={{ padding: 10 }}>
        <Cards headerCard backNavigate headerTxt="Testing Process Updates">
          {data.map((item) => (
            <NotifiDetail key={item.id} item={item} current={current} />
          ))}
        </Cards>
      </View>
    </ScrollView>
  );
};
export default NotificationPlaceHolder;
const Styles = StyleSheet.create({
  headingText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
});

// import HomeHeader from "src/components/HomeScreen/Header";
// import { Icon, SV, Text } from "src/components/Themed";
// import { RootTabScreenProps } from "src/types/NavigationTypes";
// import React, { useEffect, useState } from "react";
// import { Colors, gradients } from "src/constants/Colors";
// import { Platform, Pressable, ScrollView, View } from "react-native";
// import { RFPercentage } from "react-native-responsive-fontsize";
// import { LinearGradient } from "expo-linear-gradient";
// import FormGradient from "src/components/forms/FormGradient";
// import { Path, Svg } from "react-native-svg";
// import SliderCheck from "src/components/Notifications/SliderCheck";
// import SliderAccordion from "./SliderAccordion";
// import useOrderStore from "src/store/orderStore";
// import StrokeText from "../StrokeText";
// import { OrderStatus } from "src/constants/enums";

// export type PlaceholderType = {
//   id: number;
//   title: string;
//   subText: React.ReactNode;
// };

// const NotificationPlaceHolder = () => {
//   const order = useOrderStore((state) => state.order);
//   const setOrder = useOrderStore((state) => state.setOrder);
//   const [current, setCurrent] = useState<number>(0);

//   console.log("current---", current);

//   useEffect(() => {
//     const status = order?.status;
//     switch (status) {
//       case OrderStatus.Created:
//       case OrderStatus.NotCreated:
//         setCurrent(1);
//         break;
//       case OrderStatus.PendingReceipt:
//       case OrderStatus.Shipped:
//       case OrderStatus.CustomerInTransit:
//       case OrderStatus.CustomerOutForDelivery:
//         setCurrent(2);
//         break;
//       case OrderStatus.CustomerDelivered:
//         setCurrent(3);
//         break;
//       case OrderStatus.LabInTransit:
//       case OrderStatus.LabOutForDelivery:
//       case OrderStatus.LabDelivered:
//         setCurrent(4);
//         break;
//       case OrderStatus.InLab:
//       case OrderStatus.InMroReview:
//       case OrderStatus.PendingMroCcf:
//       case OrderStatus.PendingAffidavit:
//       case OrderStatus.Retest:
//       case OrderStatus.LabReview:
//       case OrderStatus.ResultsReady:
//         setCurrent(5);
//         break;
//       case OrderStatus.Released:
//         setCurrent(6);
//         break;
//       default:
//         setCurrent(0);
//         break;
//     }
//   }, [order]);

//   const data: PlaceholderType[] = [
//     {
//       id: 1,
//       title: "Ordered",
//       subText: (
//         <Text
//           textType="regular"
//           style={{
//             fontSize: 14,
//             color: Colors.velvet,
//           }}
//         >
//           Heck yeah, you just took the first step towards better knowing your
//           sexual wellness. Your kno kit has been ordered and should ship within
//           24 hours. Keep an eye out for a notification to let you know when it’s
//           en route.
//         </Text>
//       ),
//     },
//     {
//       id: 2,
//       title: "knō kit is En Route",
//       subText: (
//         <Text
//           textType="regular"
//           style={{
//             fontSize: 14,
//             color: Colors.velvet,
//           }}
//         >
//           This is kind of a big deal, your kno kit is headed your way.
//         </Text>
//       ),
//     },
//     {
//       id: 3,
//       title: "knō kit was Delivered",
//       subText: (
//         <Text
//           textType="regular"
//           style={{
//             fontSize: 14,
//             color: Colors.velvet,
//           }}
//         >
//           Pssst....the mail’s here. Your kno kit has been delivered to wherever
//           it is that you get mail - mailbox, PO box, your office (no judgement),
//           or whatever. Important thing being that it’s arrived.
//         </Text>
//       ),
//     },
//     {
//       id: 4,
//       title: "knō kit En Route to Lab",
//       subText: (
//         <Text
//           textType="medium"
//           style={{
//             fontSize: 14,
//             color: Colors.velvet,
//           }}
//         >
//           We’re impressed. You completed your knō kit all by yourself (or maybe
//           your partner helped? Who knows?) What matters is you did it, and it’s
//           on its way to the lab. You did remember to complete your
//         </Text>
//       ),
//     },
//     {
//       id: 5,
//       title: "Lab is Processing knō kit",
//       subText: (
//         <Text
//           textType="regular"
//           style={{
//             fontSize: 14,
//             color: Colors.velvet,
//           }}
//         >
//           Good news everyone, your knō kit has reached our lab partners and is
//           being processed as we speak - or text...whatever. We’ll let you know
//           as soon as your results are ready for you.
//         </Text>
//       ),
//     },
//     {
//       id: 6,
//       title: "knō kit Results are Ready",
//       subText: (
//         <Text
//           textType="regular"
//           style={{
//             fontSize: 14,
//             color: Colors.velvet,
//           }}
//         >
//           The results are in. We know that this can be a stressful step, but we
//           want you to remember that - no matter what the results say - knowing
//           is the best thing you can do for your sexual wellness.
//         </Text>
//       ),
//     },
//   ];

//   return (
//     <ScrollView
//       style={{ flex: 1 }}
//       keyboardShouldPersistTaps="handled"
//       contentContainerStyle={{
//         paddingBottom:
//           Platform.OS === "ios" ? RFPercentage(16) + 64 : RFPercentage(16) + 64,
//       }}
//     >
//       <View
//         style={{
//           flex: 1,
//           borderWidth: 1,
//           borderBottomWidth: 4,
//           borderColor: Colors.velvet,
//           margin: 10,
//           borderRadius: 12,
//         }}
//       >
//         <LinearGradient
//           colors={gradients.primary}
//           start={[0, 0]}
//           end={[1, 1]}
//           style={{
//             flex: 1,
//             borderRadius: 10,
//             overflow: "hidden",
//           }}
//         >
//           {order === null && (
//             <FormGradient
//               style={{
//                 borderTopWidth: 0,
//                 borderStartWidth: 0.25,
//                 borderEndWidth: 0.25,
//               }}
//             >
//               <View
//                 style={{
//                   alignItems: "center",
//                 }}
//               >
//                 <StrokeText
//                   fontSize={20}
//                   myText={"New to knō?\nHere’s what to expect..."}
//                 />
//               </View>
//             </FormGradient>
//           )}

//           {data.map((item) => (
//             <SliderAccordion key={item.id} item={item} current={current} />
//           ))}
//         </LinearGradient>
//       </View>
//     </ScrollView>
//   );
// };

// export default NotificationPlaceHolder;
