import variables from "../../../theme/variables/commonColor";
const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;

export default {
  container: {
    flex: 1,backgroundColor:variables.containerBgColor
  },
  logoContainer: {
    flex: 1,
    height: deviceHeight / 4
  }
};
