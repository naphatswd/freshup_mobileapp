import { actionCreators as action } from '../../../reducers/userReducer/actions'; 
import { SafeAreaView, ImageBackground, BackHandler, Animated, Keyboard, Dimensions, ScrollView } from "react-native";
import { Toast } from "native-base";
import {
  Button,
  Spinner,
  Text,
  Input,
  Layout
} from '@ui-kitten/components';
import { StackActions, NavigationActions } from 'react-navigation';
import variables from "../../../theme/variables/commonColor";
import SocketContext from '../../../socket-context';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { getAvatarSave } from '../../../globalfunc';
import {onSignIn } from "../../../storage";
import { POST } from '../../../api/restful';
import { bindActionCreators } from 'redux';
import React, { Component } from "react";
import Constants  from 'expo-constants';
import { connect } from 'react-redux';
import { Notifications } from 'expo';
import styles from "./styles";

const launchscreenLogo = require("../../../../assets/images/logo-kitchen-sink.png");

class Login extends React.PureComponent {
  inputs = {};

  constructor(props){
    super(props);
    this.state = {
      email:"",
      password:"",
      labelcolor:variables.grayScale,
      mystore:false,
      spinner:false,
      shouldDisablePostButton: true
    };
    this.springValue = new Animated.Value(100);
  }

  componentDidMount = async() =>{
    let testfile
        testfile = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'mystore.json');
        if(testfile.exists){
          this.setState({mystore:true})
        }else{
          this.setState({mystore:false})
        }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }  
  
  handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  onchangeEmail = (Email) => {
    this.setState({email:Email},() =>{
      if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)){
        this.setState({labelcolor:variables.textRedflat});
        this.checkField();
      }
      else{
        this.setState({labelcolor:variables.grayScale});
        this.checkField();
      }
    });
  }

  checkField = () =>{
    if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email) && this.state.password != ''){
      if(this.state.password.length>=8)
          this.setState({shouldDisablePostButton:false});
        else
          this.setState({shouldDisablePostButton:true});
    }
    else{
      this.setState({shouldDisablePostButton:true});
    }
  }

  onchangePassword = (Password) => {
    this.setState({password:Password},() =>{
      this.checkField();
    });
  }

  CheckTextInput = async () => {
    this.setState({shouldDisablePostButton:true});
    //this.__login(""); 
    this.registerForPushNotificationsAsync();
  };

  async registerForPushNotificationsAsync() {
    this.setState({spinner:true});
    let token = "";
    if(Constants.isDevice){
      const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      Toast.show({text:"สามารถเปิดการแจ้งเตือนอีกครั้งได้ในการ login ครั้งต่อไป",type:'warning'});
      this.__login(""); 
    }else if(finalStatus == 'granted'){
      token = await Notifications.getExpoPushTokenAsync();
      this.__login(token); 
    }
   }else{
    this.__login(""); 
   }
  }
  
  __login = async (token) => {
    if (this.state.email != '' && this.state.password != '') {
      const body = {
        email: this.state.email,
        password: this.state.password,
        pushnoti: token
      };
      POST('/login',body)
      .then(async response => {
        if(response.data.token != null){
           this.props.socket.emit('login', response.data.token);
           this.props.updateEmpId(response.data.emp_id);
           this.props.updateToken(response.data.token);
           await onSignIn("emp_id", response.data.emp_id);
           await onSignIn("token", response.data.token);
         if(response.data.status == 'waiting'){
           BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
           this.props.navigation.navigate("Waiting");
         }
         else{
           this.props.updateRole(response.data.role);
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
             this.props.updateStore(mystore);
             this.props.updateSelectedStore("Default");
               await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'mystore.json', JSON.stringify(mystore));}
               catch(e) {Toast.show({text:"Error",type:'danger'});}
           }
           let route = response.data.role;
           BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
           const resetAction = StackActions.reset({
             index: 0,
             actions: [
             NavigationActions.navigate({ routeName: route })
           ],
           });
           getAvatarSave((data)=>{
             this.props.updateImgProfile(data);
             this.props.navigation.dispatch(resetAction);
           });
        }
       }else{
        this.props.deleteData();
        this.onchangeEmail("");
        this.onchangePassword("");
        this.setState({
         shouldDisablePostButton:true,
         spinner:false});
           Toast.show({
             text: "เกิดข้อผิดพลาดกรุณาติดต่อผู้ดูแลระบบ !",
             type: "danger"
           });
        }
     })
     .catch(error => {
      this.props.deleteData();
      this.onchangeEmail("");
      this.onchangePassword("");
      this.setState({
        shouldDisablePostButton:true,
        spinner:false});
      Toast.show({
        text: "Error !",
        type: "danger"
      });
    });
    }
  }

  render() {
    const {spinner,shouldDisablePostButton} = this.state;
    return (
      <SafeAreaView style={{flex:1}}>
        <ImageBackground source={launchscreenLogo} style={styles.logo} />
        {(!spinner)?
        <ScrollView style={{ flex: 1}} contentContainerStyle={{justifyContent:'center'}} onScroll={()=>{Keyboard.dismiss()}}>
        <Layout>
                <Input  
                        style={{marginStart:10, marginEnd:10,marginTop:10}}
                        keyboardType="email-address"
                        placeholder='Email'
                        autoCapitalize= 'none'
                        onChangeText={(email) => this.onchangeEmail(email)}
                        blurOnSubmit={ false } />
                <Input 
                        style={{marginStart:10, marginEnd:10,marginTop:10}}
                        autoCapitalize='none'
                        placeholder='password'
                        secureTextEntry={true} 
                        onChangeText={(password) => this.onchangePassword(password)} 
                        blurOnSubmit={ false } />
            <Button
                  style={{marginStart:10, marginEnd:10,marginTop:10, borderWidth:0}}
                  disabled={shouldDisablePostButton}
                  onPress={this.CheckTextInput}>
                  เข้าสู่ระบบ
            </Button>
           <Button 
                    appearance="ghost"
                    onPress ={()=>{this.props.navigation.navigate("RequestPass")}}
                    style={{marginTop:10}}
                    transparent block>
                ลืมรหัสผ่าน ?
           </Button>
            <Layout style={{width:Dimensions.get('window').width-50,alignSelf:'center', position:"relative" ,flexDirection: 'row'}}>
              <Layout style={{backgroundColor: variables.grayScale, marginLeft:25,  height: 1, flex: 1, alignSelf: 'center'}} />
                <Text style={{ alignSelf:'center', color:variables.textPrimary9 ,paddingHorizontal:5, fontSize: 16 }}>หรือ</Text>
              <Layout style={{backgroundColor: variables.grayScale, marginRight:25, height: 1, flex: 1, alignSelf: 'center'}} />
            </Layout>
            <Layout style={{marginBottom:1}}>
            <Button 
                  block style={{ margin: 30,  backgroundColor: variables.bgButtonSecondary}}
                  onPress={() => {this.props.navigation.navigate("Register1");}}>
                  สมัครสมาชิก
            </Button>
            </Layout>
            </Layout> 
      </ScrollView>: <Layout style={{flex:1,justifyContent:'center', alignItems:'center'}}><Spinner /></Layout>}
      </SafeAreaView>
    );
  }
}

const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <Login {...props} socket={socket} />}
  </SocketContext.Consumer>
)

let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    token:state.userReducer.token,
    role:state.userReducer.role,
    store:state.userReducer.store,
    imgprofile:state.userReducer.imgprofile
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
    updateSelectedStore: bindActionCreators(action.updateSelectedStore, dispatch),
    deleteData: bindActionCreators(action.deleteData, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(socketcontext);

