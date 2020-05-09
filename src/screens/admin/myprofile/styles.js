import variables from "../../../theme/variables/commonColor";
const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  logo: {
    position: "relative",
    flex: 0.40,
    width: deviceWidth,
    height: deviceHeight / 4,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:variables.bgPrimary
  }
};
