import React, { Component } from "react";
import { StatusBar, ImageBackground, BackHandler, AppState } from "react-native";
import { Container, Toast, Spinner, View, Text, Button } from "native-base";
import variables from "../../../theme/variables/commonColor";
import { getAvatar } from '../../../globalfunc';
import styles from "./styles";
import {getItem,onSignIn, onSignOut } from "../../../storage";
import { StackActions, NavigationActions } from 'react-navigation';
import SocketContext from '../../../socket-context';
import { AUTHEN_GET } from "../../../api/restful";
import * as FileSystem from 'expo-file-system';
const splashscreen = require("../../../../assets/images/splashscreen.png");

class SplashPage extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      appState: AppState.currentState,
      mystore:false,
      serverDown:false
    };
       this.checklogin();
  }

  componentDidMount = async()=>{
    let testfile
        testfile = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'mystore.json');
        if(testfile.exists){
          this.setState({mystore:true})
        }else{
          this.setState({mystore:false})
        }
  }

  checklogin = async () => {
    let obj = await getItem("token");
    if (obj == null) {
      await onSignOut('token');
      await onSignOut('role');
      await onSignOut('emp_id');
      await onSignOut('avatar');
      await onSignOut("store:key");
      const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: "loginScreen" })
      ],
      });
      this.props.navigation.dispatch(resetAction);
    }
    else{
      AUTHEN_GET('/checktoken')
      .then(async (response)=>{
        if(response.data.body && response.data.role != undefined){
          this.props.socket.emit('logout');
          this.props.socket.emit('login', obj);
          await onSignIn("emp_id", response.data.emp_id);
          await onSignIn("role", response.data.role);
          if(!this.state.mystore)
         {
            try{
              let mystore =
              [{
                'title':'Default',
                'name':'Default',
                'store':response.data.store,
                'selected':true
              }]
              await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'mystore.json', JSON.stringify(mystore));}
            catch(e) {
              Toast.show({text:"Error",type:'danger'});
            }
          }
          getAvatar();
          let route = response.data.role;
          BackHandler.addEventListener('hardwareBackPress', this.handleHomeBackButton);
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: route})
            ],
            });
            this.props.navigation.dispatch(resetAction);
        }
        else if(response.data.body && response.data.status == 'waiting'){
          BackHandler.addEventListener('hardwareBackPress', this.handleHomeBackButton);
          Toast.show({
            text: "กรุณาติดต่อผู้ดูแลระบบ",
            type: "danger"
          });
          this.props.navigation.navigate("Waiting");
        }else{
          await onSignOut('token');
          await onSignOut('role');
          await onSignOut('emp_id');
          await onSignOut('avatar');
          await onSignOut("store:key");
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: "loginScreen" })
              ],
              });
              this.props.navigation.dispatch(resetAction);
        }
      })
      .catch(async()=>{
        Toast.show({
          text: "เชื่อมต่อไม่สำเร็จ กรุณาลองอีกครั้ง หรือติดต่อ Dev",
          type: "danger"
        });
        this.setState({serverDown:true});
      });
   }
  }

  handleHomeBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  render() {
    const { serverDown } = this.state;
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground
        source={splashscreen}
        style={styles.imageContainer}>
      {(serverDown)? 
      <View style={styles.spinner}>
        <Button style={{ flex:1,backgroundColor:variables.bgButtonPrimary,justifyContent:'center'}}  onPress={()=>this.checklogin()}>
              <Text style={{ textAlign:'center',fontWeight: 'bold', color: variables.textPrimary9, fontSize:20  }} >เชื่อมต่ออีกครั้ง</Text>
        </Button>
      </View>:
      <View style={styles.spinner}>
          <Spinner color="#FFF" />
          <Text  style={{ color: "#FFF" }}>Loading...</Text> 
          {/*<Text style={{ color: '#ecf0f1' ,textAlign:'center'}}> ปิดปรับปรุงระบบชั่วคราว 10.00 - 12.00</Text>
          <Text style={{ color: '#ecf0f1', textAlign:'center'}}>ขออภัยในความไม่สะดวกครับ</Text>*/}
      </View>}
      </ImageBackground>
      </Container>
    );
  }
}

const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <SplashPage {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default socketcontext;
