import variables from "../../../theme/variables/commonColor";
const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    flex: 1,
    backgroundColor:variables.containerBgColor
  },
  imageContainer: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: variables.bgPrimary
  },
  logoContainer: {
    height: deviceHeight / 4
  },
  logo: {
    width: deviceWidth,
    height: deviceHeight / 4
  },
  name:{
    flex: 1,
    backgroundColor:variables.bgPrimary,
    justifyContent:'center',
    borderRadius:10
  }
};
