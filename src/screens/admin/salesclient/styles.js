import variables from "../../../theme/variables/commonColor";

export default {
  container: {
    flex: 1,backgroundColor:variables.containerBgColor
  },
  active:{
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:variables.mainColor,
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary
  },
  inactive:{
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:variables.inactiveColor,
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary
  }
};
