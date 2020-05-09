import variables from "../theme/variables/commonColor"
const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
export default {
  container: {
    backgroundColor:'rgba(249, 244, 240, 1.0)'
  },
  bgcolor:{
    flex: 1,
    backgroundColor:'rgba(149, 165, 166,0.1)',
    justifyContent: 'space-between',
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary,
    height: deviceHeight/4, 
  },
  clock:{
    flex: 1,
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:'rgba(149, 165, 166,0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary,
    alignItems: 'center'
  },
  today:{
    flex: 1,
    marginTop:5,
    backgroundColor:'#1e824c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary
  },
  invlist:{
    flex:2 ,
    marginTop:10,
    backgroundColor:"#FFFFFF",
    marginRight:5,
    marginLeft:5,
    paddingBottom:10,
    borderColor: variables.borderPrimary, 
    borderWidth: 1,
  },
  revenue:{
    flexDirection: 'row',
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary
  },
  describe:{
    flex: 1,
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:'#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary
  },
  centerContainer:{
    flex: 1
  },
  leftContainer: {
    flex: 0.5,
    color: "#808080",
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  rightContainer: {
    flex: 0.5,
    color: "#808080",
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  logoContainer: {
    flex: 1,
    height: deviceHeight / 4
  },
  detailImgBG:{
    flex: 1,
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    position: "relative",
    backgroundColor:"#1e824c",
    justifyContent: 'space-between',
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary
  }
};
