import variables from "../../../theme/variables/commonColor";

export default {
  today:{
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    backgroundColor:variables.textPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius:10,
    borderWidth: 1,
    borderColor: variables.borderPrimary
  },
  active:{
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:variables.textPrimary,
    borderRadius:15,
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
