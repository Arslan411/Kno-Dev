import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },

  mainContainer: {
    borderRadius: 10,
    position: "absolute",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  hideButton: {
    position: "absolute",
    top: RFPercentage(0.5),
    right: RFPercentage(0.5),
  },

  textStyle: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    flex: 1,
  },

  progressBarContainer: {
    flexDirection: "row",
    position: "absolute",
    height: 4,
    width: "100%",
    bottom: 0,
  },

  content: {
    width: "100%",
    // padding: RFPercentage(1.5),
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapper: {
    marginRight: RFPercentage(0.7),
  },
});

export default styles;
