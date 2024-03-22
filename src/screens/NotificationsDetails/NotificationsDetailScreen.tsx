import React from "react";
import { View, Pressable, StyleSheet, Image } from "react-native";
import { HomeStackScreenProps } from "src/types/NavigationTypes";
import LoginForm from "src/components/forms/LoginForm";
import { SV, Text } from "src/components/Themed";
import AuthHeader from "src/components/AuthHeader";
import { Colors } from "src/constants/Colors";
import { CommonActions } from "@react-navigation/native";
import { images } from "src/utils/Images";
import Cards from "src/components/Cards/Cards";
import UserHeader from "src/components/HomeScreen/UserHeader";

const NotificationDetailScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<"NotificationDetailScreen">) => {
  const notification: any = route.params;

  // const navigationBack = () => {
  //     navigation.dispatch(
  //         CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: "Notification" }],
  //         })
  //     );
  // };

  // console.log("notifi===->", notification)

  const convertDateTime = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SV
      style={{
        flex: 1,
      }}
    >
      {/* <AuthHeader logoCentered /> */}
      <UserHeader />
      <View style={{ padding: 10 }}>
        <Cards
          backNavigate
          headerCard
          headerTxt="Notifications Detail"
          onPress={() => navigation.navigate("Notifications")}
        >
          <View>
            <View style={styles.InnerCard}>
              <View style={{ margin: 8, alignItems: "center" }}>
                <Image
                  source={require("../../assets/lorem.png")}
                  style={styles.boxImage}
                />
              </View>

              <Text textType="bold" style={styles.messageText}>
                {notification.Message}
              </Text>

              <Text style={styles.randomText}>Lorem ipsum dolar sit amet</Text>

              <Text style={styles.LocalTime}>
                {convertDateTime(notification.CreatedOn)}
              </Text>
            </View>

            <View
              style={{
                marginVertical: 8,
                alignItems: "center",
              }}
            >
              <Pressable
                style={styles.CloseBtn}
                onPress={() => navigation.navigate("Notifications")}
              >
                <Text textType="medium" style={styles.CloseText}>
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </Cards>
      </View>
    </SV>
  );
};

export default NotificationDetailScreen;

const styles = StyleSheet.create({
  SplashCard: {
    borderWidth: 1,
    borderBottomWidth: 4,
    borderRadius: 10,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  headingText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  InnerCard: {
    borderWidth: 1,
    borderColor: "#BDC99C",
    margin: 8,
    borderRadius: 5,
  },
  boxImage: {
    width: 110,
    height: 55,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  messageText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  randomText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  LocalTime: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  CloseBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    width: 100,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  CloseText: {
    color: Colors.velvet,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.5,
  },
});
