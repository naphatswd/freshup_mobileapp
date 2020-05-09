import React from "react";
import { Root } from "native-base";
import { connect } from 'react-redux';
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from "react-navigation-stack";
import Admin_Profile from "../admin/myprofile";
import Admin_Products from "../admin/products";
import Admin_Menu from "../admin/menu";
import Admin_Invoice from "../admin/invoice";
import Admin_Store from "../admin/editStore";
import Group1 from "../admin/editStore/group1";
import Group2 from "../admin/editStore/group2";
import AddImage from "../main/myprofile/addImageProfile";
import clientDetail from "../saleman/myclient/clientdetail";
import Changepass from "../main/myprofile/changepass";
import Cvtype from "../admin/cvtype";
import editEmpid from "../main/user/editempid";
import editNickName from "../main/user/editNickName";
import editName from "../main/user/editName";
import editEmail from "../main/user/editEmail";
import editPhone from "../main/user/editPhone";
import editRole from "../main/user/editRole";
import editPlace from "../main/mapsurvey/editPlace";
import frontStore from "../admin/frontstore";
import frontDetail from "../admin/frontstore/frontDetail";
import Home from "../admin/home";
import invDetail from "../invoice/invoicedetail";
import MapSurvey from "../main/mapsurvey";
import Login from "../main/login";
import Logout from "../main/logout";
import MyClient from "../saleman/myclient";
import MyPerf from "../saleman/myperformance";
import newPlace from "../main/mapsurvey/newPlace";
import Problems from "../main/problem";
import RequestPass from "../main/login/requestpass";
import Register1 from "../main/register/register1";
import Register2 from "../main/register/register2";
import Register3 from "../main/register/register3";
import Register4 from "../main/register/register4";
import Register5 from "../main/register/register5";
import Register6 from "../main/register/register6";
import Register7 from "../main/register/register7";
import Register8 from "../main/register/register8";
import Adm_Quotation1 from "../admin/quotation/quotation1";
import Quotation1 from "../saleman/quotation/quotation1";
import Quotation2 from "../saleman/quotation/quotation2";
import Quotation3 from "../saleman/quotation/quotation3";
import Quotation4 from "../saleman/quotation/quotation4";
import AddProduct from "../saleman/quotation/addProduct";
import ReQuot from "../saleman/quotation/reQuot";
import ReQuot2 from "../saleman/quotation/reQuot2";
import ReQuot3 from "../saleman/quotation/reQuot3";
import SelectProduct from "../saleman/quotation/selectProduct";
import SelectQuot from "../saleman/quotation/selectQuotation";
import EditProduct from "../saleman/quotation/editProduct";
import SumQuot from "../saleman/quotation/sumQuot";
import SearchList from "../searchlist";
import StaffMenu from "../staff/menu";
import Saleperf from "../admin/saleperf";
import SaleHome from "../saleman/home";
import Sale_Menu from "../saleman/menu";
import SaleProfile from "../saleman/myprofile";
import SalesClient from "../admin/salesclient";
import StaffHome from "../staff/staffhome";
import User from "../main/user";
import UserProfile from "../main/user/userprofile";
import Admin_Footer from "../admin/footer";
import Sale_Footer from "../saleman/footer";
import Staff_Footer from "../staff/footer";

const loginScreen = createStackNavigator(
  {
    Login: { screen: Login },
    AddImage:{ screen:AddImage},
    RequestPass:{ screen:RequestPass},
    Register1: { screen: Register1 },
    Register2: { screen: Register2 },
    Register3: { screen: Register3 },
    Register4: { screen: Register4 },
    Register5: { screen: Register5 },
    Register6: { screen: Register6 },
    Register7: { screen: Register7 },
    Register8: { screen: Register8 }
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

const AdminQuotation = createStackNavigator(
  {
    Quotation1:{screen: Adm_Quotation1},
    Quotation2:{screen: Quotation2},
    Quotation3:{screen: Quotation3},
    Quotation4:{screen: Quotation4},
    AddProduct:{screen: AddProduct},
    SelectProduct:{screen: SelectProduct},
    SelectQuot:{screen: SelectQuot},
    EditProduct:{screen: EditProduct},
    SumQuot:{screen:SumQuot},
    ReQuot:{screen:ReQuot},
    ReQuot2:{screen:ReQuot2},
    ReQuot3:{screen:ReQuot3}
  },
  {
    initialRouteName: "Quotation1",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    }
  }
);

const adminHome = createStackNavigator(
  {
    Home: { screen: Home },
    Cvtype:{screen:Cvtype},
    Saleperf:{screen:Saleperf},
    invDetail:{screen:invDetail},
  }, 
  {
    initialRouteName: "Home",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);
adminHome.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const adminB2B = createStackNavigator(
  {
    Admin_Invoice:{screen: Admin_Invoice},
    invDetail:{screen:invDetail}
  }, 
  {
    initialRouteName: "Admin_Invoice",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);
adminB2B.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const adminB2C = createStackNavigator(
  {
    frontStore:{screen:frontStore},
    frontDetail:{screen:frontDetail},
  }, 
  {
    initialRouteName: "frontStore",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);
adminB2C.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const adminSaleClient = createStackNavigator(
  {
    SalesClient:{screen:SalesClient},
    clientDetail:{screen:clientDetail},
    invDetail:{screen:invDetail},
  }, 
  {
    initialRouteName: "SalesClient",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);
adminSaleClient.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const adminUser = createStackNavigator(
  {
    User: { screen :User},
    UserProfile: {screen:UserProfile},
    editEmpid:{screen:editEmpid},
    editNickName:{screen:editNickName},
    editName:{screen: editName},
    editEmail:{screen: editEmail},
    editPhone:{screen: editPhone},
    editRole:{screen: editRole},
  }, 
  {
    initialRouteName: "User",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);
adminUser.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const adminMenu = createStackNavigator(
  {
    Admin_Menu:{screen:Admin_Menu},
    AdminQuotation:{screen:AdminQuotation},
    Problems:{ screen:Problems},
    User: { screen :adminUser},
    Logout: {screen: Logout}
  }, 
  {
    initialRouteName: "Admin_Menu",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);
adminMenu.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const adminProfile = createStackNavigator(
  {
    Admin_Profile:{screen:Admin_Profile },
    Admin_Store:{screen:Admin_Store},
    Group1:{screen:Group1},
    Group2:{screen:Group2},
    editEmpid:{screen:editEmpid },
    editNickName:{screen:editNickName },
    editName:{screen: editName},
    editEmail:{screen: editEmail},
    editPhone:{screen: editPhone},
    Changepass:{screen:Changepass},
  }, 
  {
    initialRouteName: "Admin_Profile",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);
adminProfile.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const adminMap = createStackNavigator(
  {
    MapSurvey:{screen:MapSurvey },
    editPlace:{screen:editPlace},
    newPlace:{screen:newPlace},
    clientDetail:{screen:clientDetail },
    invDetail:{screen:invDetail },
  }, 
  {
    initialRouteName: "MapSurvey",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);
adminMap.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const adminProduct = createStackNavigator(
  {
    Admin_Products:{screen:Admin_Products},
    SearchList:{screen:SearchList},
  }, 
  {
    initialRouteName: "SearchList",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);
adminProduct.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const admin = createBottomTabNavigator(
  {
    Admin_Profile:{screen:adminProfile},
    Admin_Products:{screen:adminProduct},
    Admin_Invoice:{screen: adminB2B},
    Admin_Menu:{screen:adminMenu },
    frontStore:{screen:adminB2C},
    Admin_Home: { screen: adminHome },
    SalesClient:{screen:adminSaleClient},
    MapSurvey:{screen:adminMap}
  },
  {
    tabBarComponent: Admin_Footer,
    initialRouteName: "Admin_Home",
    headerMode: "none",
  }
);

const saleHome = createStackNavigator(
  {
    SaleHome: { screen: SaleHome },
    Cvtype:{screen:Cvtype },
    invDetail:{screen:invDetail },
  }, 
  {
    initialRouteName: "SaleHome",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 1,  // Set the animation duration time as 0 !!
      },
    })
  }
)

const saleB2B = createStackNavigator(
  {
    MyPerf:{screen:MyPerf },
    invDetail:{screen:invDetail },
  }, 
  {
    initialRouteName: "MyPerf",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 1,  // Set the animation duration time as 0 !!
      },
    })
  }
)

const saleClient = createStackNavigator(
  {
    MyClient:{screen:MyClient },
    clientDetail:{screen:clientDetail },
    invDetail:{screen:invDetail },
  }, 
  {
    initialRouteName: "MyClient",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 1,  // Set the animation duration time as 0 !!
      },
    })
  }
)

const saleProfile = createStackNavigator(
  {
    SaleProfile:{screen:SaleProfile },
    editEmpid:{screen:editEmpid },
    editNickName:{screen:editNickName },
    editName:{screen: editName },
    editEmail:{screen: editEmail },
    editPhone:{screen: editPhone },
    Admin_Store:{screen:Admin_Store},
    Group1:{screen:Group1},
    Group2:{screen:Group2},
    Changepass:{screen:Changepass },
  }, 
  {
    initialRouteName: "SaleProfile",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 1,  // Set the animation duration time as 0 !!
      },
    })
  }
)

const saleMap= createStackNavigator(
  {
    MapSurvey:{screen:MapSurvey },
    editPlace:{screen:editPlace },
    newPlace:{screen:newPlace },
    clientDetail:{screen:clientDetail },
    invDetail:{screen:invDetail },
  }, 
  {
    initialRouteName: "MapSurvey",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 1,  // Set the animation duration time as 0 !!
      },
    })
  }
)

const SaleQuotation = createStackNavigator(
  {
    Quotation1:{screen: Quotation1},
    Quotation2:{screen: Quotation2},
    Quotation3:{screen: Quotation3},
    Quotation4:{screen: Quotation4},
    AddProduct:{screen: AddProduct},
    SelectProduct:{screen: SelectProduct},
    SelectQuot:{screen: SelectQuot},
    EditProduct:{screen: EditProduct},
    SumQuot:{screen:SumQuot},
    ReQuot:{screen:ReQuot},
    ReQuot2:{screen:ReQuot2},
    ReQuot3:{screen:ReQuot3}
  },
  {
    initialRouteName: "Quotation1",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    }
  }
)

const saleMenu = createStackNavigator(
  {
    Sale_Menu:{screen:Sale_Menu },
    SaleQuotation:{screen:SaleQuotation},
    Problems:{ screen:Problems },
  }, 
  {
    initialRouteName: "Sale_Menu",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 1,  // Set the animation duration time as 0 !!
      },
    })
  }
)

const saleProduct = createStackNavigator(
  {
    Admin_Products:{screen:Admin_Products},
    SearchList:{screen:SearchList},
  }, 
  {
    initialRouteName: "SearchList",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);

const saleman = createBottomTabNavigator(
  {
    SaleHome: { screen: saleHome  },
    SaleProfile:{screen:saleProfile },
    MyPerf:{screen:saleB2B },
    Sale_Menu:{screen:saleMenu },
    MyClient:{screen:saleClient },
    MapSurvey:{screen:saleMap },
    SaleProduct:{screen:saleProduct },
    SaleQuotation:{screen:SaleQuotation},
    Logout: {screen: Logout , navigationOptions:{tabBarVisible: false} }
  }, 
  {
    tabBarComponent: Sale_Footer,
    initialRouteName: "SaleHome",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);

const staffHome = createStackNavigator(
  {
    StaffHome: { screen: StaffHome }
  }, 
  {
    initialRouteName: "StaffHome",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);

const staffMenu = createStackNavigator(
  {
    StaffMenu:{screen:StaffMenu },
    Problems:{ screen:Problems }
  }, 
  {
    initialRouteName: "StaffMenu",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
)

const staffB2C = createStackNavigator(
  {
    frontStore:{screen:frontStore },
    frontDetail:{screen:frontDetail },
  }, 
  {
    initialRouteName: "frontStore",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
)

const staff = createBottomTabNavigator(
  {
    StaffHome: { screen: staffHome  },
    StaffMenu:{screen:staffMenu },
    frontStore:{screen:staffB2C },
    Logout: {screen: Logout , navigationOptions:{tabBarVisible: false} }
  }, 
  {
    tabBarComponent: Staff_Footer,
    initialRouteName: "StaffHome",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    })
  }
);

let AppContainer = null;

class Route extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      login:this.props.login
    };
    AppContainer = createAppContainer(
      createStackNavigator(
        {
          loginScreen: { screen: loginScreen},
          admin: { screen: admin },
          staff: { screen: staff},
          saleman: { screen: saleman }
        },
        {
          initialRouteName: (this.props.role != null)? this.props.role:"loginScreen",
          headerMode: "none"
        }
      )
    );
  }

  render(){
    return (
      <Root>
        <AppContainer />
      </Root>
    )
  }
}

let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    token:state.userReducer.token,
    role:state.userReducer.role,
    store:state.userReducer.store
  }
}

export default connect(
  mapStateToProps
)(Route);