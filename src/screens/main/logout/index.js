import { actionCreators as action } from '../../../reducers/userReducer/actions'; 
import { actionCreators as Routeaction } from '../../../reducers/routeReducer/actions';
import { StatusBar, ImageBackground, BackHandler } from "react-native";
import { Container, Toast, View, Text } from "native-base";
import {Spinner
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import * as FileSystem from 'expo-file-system';
import {onSignOut } from "../../../storage";
import { bindActionCreators } from 'redux';
import { AUTHEN_GET } from "../../../api/restful";
import React from "react";
import { connect } from 'react-redux';
import styles from "./styles";
import { StackActions, NavigationActions } from 'react-navigation';
import SocketContext from '../../../socket-context'

const splashscreen = require("../../../../assets/images/splashscreen.png");

class Logout extends React.PureComponent {
  constructor(props){
    super(props);
    this.props.deleteData();
    this.props.RoutedeleteData();
  }

  componentDidMount() {
    this.logout();
  }

  logout = async () =>{
    AUTHEN_GET('/logout')
      .then(async (response)=>{
          this.props.socket.emit('logout',this.props.emp_id);
          new Promise.all([
            await onSignOut('role'),
            await onSignOut('emp_id'),
            await onSignOut('avatar'),
            await onSignOut("store:key"),
            await FileSystem.deleteAsync(FileSystem.documentDirectory+'mystore.json')
          ])
            Toast.show({
                text: "ออกจากระบบ",
                type: "danger"
            });
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton); 
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: "loginScreen" })
              ],
              });
              this.props.navigation.dispatch(resetAction);
      });
  }

  handleBackButton = async () => {
    await onSignOut('token');
    BackHandler.exitApp();
    return true;
  };

  render() {
    return (
      <Container  >
        <StatusBar barStyle="light-content" />
        <ImageBackground
        source={splashscreen}
        style={styles.imageContainer}>
      <View style={styles.spinner}>
          <Spinner color={variables.mainColor} />
          <Text  style={{ color: variables.mainColor }}>ออกจากระบบ...</Text>
      </View>
      </ImageBackground>
      </Container>
    );
  }
}

const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <Logout {...props} socket={socket} />}
  </SocketContext.Consumer>
)

let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    token:state.userReducer.token,
    role:state.userReducer.role,
    imgprofile:state.userReducer.imgprofile,
    store:state.userReducer.store
  }
}

let mapDispatchToProps = dispatch => {
  return{
    InitData: bindActionCreators(action.InitData, dispatch),
    updateEmpId: bindActionCreators(action.updateEmpId, dispatch),
    updateRole: bindActionCreators(action.updateRole, dispatch),
    updateToken: bindActionCreators(action.updateToken, dispatch),
    updateStore: bindActionCreators(action.updateStore, dispatch),
    updateImgProfile: bindActionCreators(action.updateImgProfile, dispatch),
    deleteData: bindActionCreators(action.deleteData, dispatch),
    RoutedeleteData: bindActionCreators(Routeaction.updateRoute, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(socketcontext);

