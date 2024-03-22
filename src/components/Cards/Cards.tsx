import { Pressable, View, Image, StyleSheet, Dimensions } from "react-native";
import * as Clipboard from "expo-clipboard";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, Colors } from "src/constants/Colors";
import { Text } from "../Themed";
import React, { Children, useState } from "react";
import BigColoredButton from "../BigColoredButton";
import IconButton from "../IconButton";
import { images } from "src/utils/Images";
import { useNavigation } from "@react-navigation/native";

type CardsProps = {
  imageCard?: boolean;
  buttonCard?: boolean;
  buttonTitle?: string;
  buttonSubHeading?: string;
  fontSize?: any;
  iconShow?: boolean;
  customStyles?: any;
  onPress?: () => void;
  refrenceCard?: boolean;
  headerTxt?: string;
  imageHeaderTxt?: string;
  bodyText?: string;
  // buttonTitle?: string;
  backNavigate?: boolean;
  bottomLabel?: string;
  children?: any;
  onNavClick?: () => void;
  width?: any;
  bottomButton?: boolean;
  disabled?: boolean;
  isIcon?: boolean;
  checked?: boolean;
  isTitle?: boolean;
  hideSecondaryIcon?: boolean;
  sourcedImage?: {};
  sourcedImageRight?: {};
  imageStyles?: {};
  headerCardContainer?: {};
  marginLeft?: number;
  iconStyle?: any;
  buttonsRow?: boolean;
  onDelete?: () => void;
  headerCard?: boolean;
  onClick?: () => void;
  onUpdatePassword?: () => void;
  onSave?: () => void;
  onBack?: () => void;
  textType?: string;
  textStyle?: any;
  height?: any;
  imageSource?: any
};

const width = Dimensions.get("window").width;
const Cards: React.FC<CardsProps> = (props) => {
  const navigation = useNavigation();
  return (
    <>
      {props.imageCard ? (
        <View style={[styles.cardMainContainer, { ...props.customStyles }]}>
          <Image
            style={props.imageStyles ? props.imageStyles : styles.cardImg}
            source={props.imageSource ? props.imageSource : images.cardImg}
          />
          {props.isTitle ? (
            <View style={styles.textContainer}>
              <Text
                textType={props.textType ? props.textType : "bold"}
                style={styles.imageHeaderTxt}
              >
                {props.imageHeaderTxt}
              </Text>
            </View>
          ) : null}
          <View style={styles.bodyTextContainer}>
            <Text
              style={[
                styles.mainCardLabel,
                {
                  fontSize: props.fontSize ? props.fontSize : RFPercentage(2.3),
                },
              ]}
            >
              {props.bodyText
                ? props.bodyText
                : `"A kinder at-home STI test that goes with you"\n- wherever you go`}
            </Text>
          </View>

          <View style={styles.btnView}>
            <IconButton
              checkedIcon
              width={props.width ? props.width : RFPercentage(15)}
              checked={props.checked}
              unCheckedLabel={props.buttonTitle}
              checkedLabel={
                props.buttonTitle ? props.buttonTitle : "Get tested"
              }
              onPress={props.onPress}
            />
          </View>
        </View>
      ) : props.buttonCard ? (
        <Pressable
          style={[
            styles.buttonCardContainer,
            { ...props.customStyles, opacity: props.disabled ? 0.5 : 1 },
          ]}
          onPress={props.onPress}
          disabled={props.disabled}
        >
          <View
            style={[
              styles.row,
              { marginLeft: props.marginLeft ? props.marginLeft : 0 },
            ]}
          >
            {props.iconShow && (
              <Image
                style={[styles.icon, { ...props.iconStyle }]}
                source={
                  props.sourcedImage ? props.sourcedImage : images.phoneIcon
                }
              />
            )}

            <Text textType="medium" style={styles.buttonTitle}>
              {props.buttonTitle}
            </Text>
            {props.iconShow && !props.hideSecondaryIcon ? (
              <Image
                style={[styles.icon1, { ...props.iconStyle }]}
                source={
                  props.sourcedImageRight
                    ? props.sourcedImageRight
                    : images.containerIcon
                }
              />
            ) : props.hideSecondaryIcon ? (
              <View
                style={{
                  height: 10,
                  width: 25,
                }}
              />
            ) : null}
          </View>

          <Text
            style={[
              styles.buttonSubHeading,
              { fontSize: props.fontSize ? props.fontSize : RFPercentage(2) },
            ]}
          >
            {props.buttonSubHeading}
          </Text>
        </Pressable>
      ) : props.refrenceCard ? (
        <View style={styles.refrenceCardContainer}>
          <View style={styles.header}>
            {props.backNavigate ? (
              <Pressable onPress={props.onBack ?? navigation.goBack}>
                <Image style={styles.backArrowIcon} source={images.backArrow} />
              </Pressable>
            ) : (
              <View style={styles.backArrowIcon} />
            )}

            <Text
              textType="LBRegular"
              style={[styles.headerTxt, { ...props.textStyle }]}
            >
              {props.headerTxt}
            </Text>
            <View style={{ height: 20, width: 20 }} />
          </View>

          {props.children}

          <View style={styles.bottom}>
            {props.bottomButton ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <IconButton
                  width={props.width ? props.width : RFPercentage(13)}
                  checked
                  checkedLabel="Checkout"
                  onPress={props.onPress}
                />
              </View>
            ) : props.buttonsRow ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 6,
                  paddingBottom: 6,
                }}
              >
                <Pressable
                  style={{
                    borderWidth: 1.5,
                    height: 50,
                    width: 50,
                    borderColor: Colors.primary,
                    borderRadius: 30,
                  }}
                  onPress={props.onDelete}
                >
                  <LinearGradient
                    colors={gradients.primary}
                    start={[0, 0.3]}
                    end={[0, 1]}
                    style={{
                      flex: 1,
                      borderRadius: 30,
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      flexDirection: "row",
                      padding: 9,
                    }}
                  >
                    <Image
                      style={{ height: 22, width: 22 }}
                      source={images.binIcon}
                    />
                  </LinearGradient>
                </Pressable>

                <IconButton
                  onPress={props.onUpdatePassword}
                  width={RFPercentage(21)}
                  height={RFPercentage(5.4)}
                  unCheckedLabel={"Update password"}
                />
                <IconButton
                  onPress={props.onSave}
                  width={props.width ? props.width : RFPercentage(9)}
                  checked
                  height={RFPercentage(5.4)}
                  checkedLabel={"Save"}
                />
              </View>
            ) : (
              <Pressable
                style={[
                  styles.btnRow,
                  {
                    width: props.width ? props.width : RFPercentage(29),
                    opacity: props.disabled ? 0.5 : 1,
                  },
                ]}
                disabled={props.disabled}
                onPress={props.onNavClick}
              >
                <Text textType="medium" style={styles.bottomLabel}>
                  {props.bottomLabel}
                </Text>
                <Image style={styles.nextArrowIcon} source={images.nextArrow} />
              </Pressable>
            )}
          </View>
        </View>
      ) : props.headerCard ? (
        <View style={[styles.refrenceCardContainer, props.headerCardContainer]}>
          <View style={styles.header}>
            {props.backNavigate ? (
              <Pressable onPress={props.onPress ?? navigation.goBack}>
                <Image style={styles.backArrowIcon} source={images.backArrow} />
              </Pressable>
            ) : (
              <View style={styles.backArrowIcon} />
            )}

            <Text
              textType="LBRegular"
              style={[
                styles.headerTxt,
                {
                  ...props.textStyle,
                },
              ]}
            >
              {props.headerTxt}
            </Text>
            <View style={{ height: 20, width: 20 }} />
          </View>

          {props.children}
        </View>
      ) : null}
    </>
  );
};
export default Cards;

const styles = StyleSheet.create({
  textContainer: {
    padding: 15,
  },
  imageHeaderTxt: {
    fontSize: 24,
    // fontWeight: "700",
    color: Colors.velvet,
    alignSelf: "center",
  },
  cardImg: {
    height: RFPercentage(20),
    // width: width / 1.055,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: "100%",
  },
  cardMainContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderBottomWidth: 6,
    borderRadius: 20,
    borderColor: Colors.primary,
  },
  bodyTextContainer: {
    paddingHorizontal: 2,
  },
  mainCardLabel: {
    textAlign: "center",
    color: Colors.black,
    fontSize: RFPercentage(2.3),
    marginVertical: 8,
    top: 4,
  },
  btnView: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 30,
    // paddingHorizontal: 10,
    top: 8,
  },
  buttonCardContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderBottomWidth: 6,
    borderRadius: 20,
    borderColor: Colors.primary,
    padding: 10,
  },
  buttonTitle: {
    color: Colors.black,
    fontSize: RFPercentage(3),
  },
  buttonSubHeading: {
    color: Colors.black,
    textAlign: "center",
    marginVertical: 3,
  },
  icon: {
    height: 30,
    width: 30,
  },
  icon1: {
    height: 30,
    width: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  refrenceCardContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderBottomWidth: 6,
    borderRadius: 20,
    borderColor: Colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 30,
  },
  bottom: {
    borderTopWidth: 1,
    borderColor: Colors.primary,
    padding: 8,
  },
  backArrowIcon: {
    height: 60,
    width: 60,
  },
  headerTxt: {
    color: Colors.black,
    fontSize: RFPercentage(2.5),
  },
  nextArrowIcon: {
    height: 55,
    width: 55,
  },
  bottomLabel: {
    color: Colors.black,
    fontSize: RFPercentage(2.2),
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    width: RFPercentage(29),
    justifyContent: "space-between",
  },
});
