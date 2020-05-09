import variables from "../../../theme/variables/commonColor";
const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  logo: {
    position: "relative",
    flex: 0.40,
    width: deviceWidth,
    height: deviceHeight / 4,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  name:{
    flex: 1,
    marginTop: deviceHeight / 8,
    marginBottom: 30
  }
};
