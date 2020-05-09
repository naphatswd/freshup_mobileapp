import variables from "../../../theme/variables/commonColor";
const React = require("react-native");
const { Dimensions } = React;

export default {
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
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:'#1e824c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary
  },
  centerContainer:{
    flex: 1
  }
};
