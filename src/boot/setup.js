import { actionCreators as action } from '../reducers/userReducer/actions'; 
import { ApplicationProvider, IconRegistry, Spinner, Layout, Text, Button } from '@ui-kitten/components';
import { AppState, Alert , BackHandler, Platform, ImageBackground} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { AppLoading, Notifications, Updates, Linking} from 'expo';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { getAvatarSave } from '../globalfunc';
import { bindActionCreators } from 'redux';
import { mapping } from '@eva-design/eva';
import React from "react";
import Route from "../screens/router/route";
import SocketContext from '../socket-context'
import SocketIOClient from 'socket.io-client';
import {getItem, onSignOut } from "../storage";
import { connect } from 'react-redux';
import { AUTHEN_GET, GET, POST } from "../api/restful";
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import {
  Toast
} from "native-base";
import variables from "../theme/variables/commonColor";
let LightTheme = require('../theme/variables/light.json');
let DarkTheme = require('../theme/variables/dark.json');
let appJSON = require('../../app.json');

const splashscreen = require("../../assets/images/splashscreen.png");

let cacheImages = (images) => {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

let cacheFonts = (fonts) => {
  return fonts.map(font => Font.loadAsync(font));
}

class Setup extends React.PureComponent {

  constructor(props) {
    super(props);
    //(new Date().getHours() >= 2 && new Date().getHours() <=4)? true:false
    this.state = {
      appState: AppState.currentState,
      showReloadDialog: false,
      serverclosed:false,
      servererror:false,
      isReady: false,
      mystore:false,
      night:false,
      loading:false,
      notification: {},
    };
    this.socket = SocketIOClient(appJSON.url.prefix);
  }

  componentDidMount = async () =>{
    AppState.addEventListener('change', this._handleAppStateChange);
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    NetInfo.fetch().then(state => {
      this.handleFirstConnectivityChange(state.isConnected)
    });
    let testfile
        testfile = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'mystore.json');
        if(testfile.exists){
          this.setState({mystore:true})
          let readfile;
            try{readfile = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+'mystore.json');}
            catch(e) {Toast.show({text:"Error",type:'danger'});}
            let jsonStore =  JSON.parse(readfile);
            this.props.updateStore(jsonStore)
            jsonStore.map((item)=>{
              if(item.selected){
                this.props.updateSelectedStore(item.name);}
            })
        }else{
          this.setState({mystore:false})
        }
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };

  _handleAppStateChange =async (nextAppState) => {
    let obj = await getItem("token");
    if (nextAppState.match(/inactive/)){
      if(this.props.inactiveTime == null || 
        new Date(new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate(),
                  new Date().getHours(),0,0) - new Date(this.props.inactiveTime) > 1)
      {
        this.props.updateInactive(
          new Date(new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            new Date().getHours(),0,0));
        this.props.updateData(false);
      }
      this.props.updateLogin(false);
      this.socket.emit('logout',this.props.emp_id);
    }
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active' && obj != null
    ) {
      if(this.props.inactiveTime != null && 
        new Date(new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate(),
                  new Date().getHours(),0,0) - new Date(this.props.inactiveTime) > 1)
      {
        this.props.updateData(true);
      }
      this._checkUpdates();
    }
    this.setState({appState: nextAppState});
  };

  checkVersion = async () =>{
    this.setState({loading:true});
    POST('/appversion',{ version: appJSON.expo.version})
    .then(response =>{
      if(response.data.status){
        this.checkServerAvailable();
      }else{
        this.setState({servererror:false,  isReady: false ,loading:false});  
        Alert.alert(
          'New Version !',
          'Please update to newer version.',
          [
            {text: 'OK', onPress: () => {
              if(Platform.OS === "ios"){
                Linking.openURL("https://apps.apple.com/us/app/freshup/id1459951111?ls=1").catch((err) => {});
              }else{
                Linking.openURL("https://play.google.com/store/apps/details?id=com.cpfthailand.pakchongmodel").catch((err) => {});
              }BackHandler.exitApp()  
            }},
          ],
          {cancelable: false},
        );
      }
    }).catch((error)=>{
      this.setState({servererror:true, isReady: false ,loading:false});
      Toast.show({text:"Error",type:'danger'});
    });
  }

  checkServerAvailable = async () =>{
    GET('/checkserver')
    .then(response =>{
      if(response.data.status){
        this.onStart();
      }else{
        this.setState({servererror:false, isReady: false });    
        Alert.alert(
          'Server is closed !',
          'กำลังพัฒนาระบบ เดี๋ยวกลับมาใหม่น้าาาาา ~~~~',
          [
            {text: 'OK', onPress: () => {
              BackHandler.exitApp()  
            }},
          ],
          {cancelable: false},
        );
      }
    }).catch(()=>{
      this.setState({servererror:true, isReady: false ,loading:false});
      Toast.show({text:"Error",type:'danger'});
    });
  }

  onStart = async () =>{
    let obj = await getItem("token");
    if (obj == null) {
      new Promise.all([
        await onSignOut('token'),
        await onSignOut('role'),
        await onSignOut('emp_id'),
        await onSignOut('avatar'),
        await onSignOut("store:key"),
      ])
      this.setState({isReady: true });
    }else{
    AUTHEN_GET('/checktoken')
    .then(async (response)=>{
      if(response.data.body && response.data.role != undefined){
        if(!this.props.login) this.socket.emit('login', obj);
        this.props.updateLogin(true);
        this.props.updateEmpId(response.data.emp_id);
        this.props.updateRole(response.data.role);
        this.props.updateToken(obj);
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
            catch(e) {
              Toast.show({text:"Error",type:'danger'});
            }
        }
        getAvatarSave((data)=>{
          this.props.updateImgProfile(data);
          this.setState({loading:false, servererror:false, isReady:true});
        });
      }else{
        this.props.deleteData();
        new Promise.all([
          await onSignOut('token'),
          await onSignOut('role'),
          await onSignOut('emp_id'),
          await onSignOut('avatar'),
          await onSignOut("store:key"),
        ])
        this.setState({loading:false, servererror:false, isReady:true});
      }
    }).catch(()=>{
      this.setState({loading:false, servererror:true, isReady:true});
      });
    }
  }

  componentDidUpdate(prevState) {
    const {
      showReloadDialog,
    } = this.state;
    if (showReloadDialog === true && showReloadDialog !== prevState.showReloadDialog) {
      Updates.reloadFromCache();
      this.loadFonts();
    }
  }

  _connectSocket = async () =>{
    this.socket.on('getlogout',async ()=>{
      await onSignOut('token');
      await onSignOut('role');
      await onSignOut('emp_id');
      await onSignOut('avatar');
      await onSignOut("store:key");
      Alert.alert(
        'มีการเข้าใช้งานซ้ำ',
        'บัญชีของคุณถูกเข้าถึงโดยบุคคลอื่น',
        [
          {text: 'OK', onPress: () => {
            this.setState({ isReady: false });
            }},
        ],
        {cancelable: false},
      );
    });
    this.socket.on('getbanned', async ()=>{
      await onSignOut('token');
      await onSignOut('role');
      await onSignOut('emp_id');
      await onSignOut('avatar');
      await onSignOut("store:key");
      Alert.alert(
        'คุณโดนระงับการใช้งาน',
        'กรุณาติดต่อผู้ดูแลระบบ',
        [
          {text: 'OK', onPress: () => {
            this.setState({ isReady: false });
            }},
        ],
        {cancelable: false},
      );
    });
  }

  _checkUpdates = async () => {
    if (this._checking_update !== true) {
      this._checking_update = true;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Updates.reloadFromCache();
          this.setState({showReloadDialog:true});
        } else {
          this.setState({showReloadDialog:false});
          this.loadFonts();
        }
      } catch (e) {
      }
      delete this._checking_update;
    }
  }

  _checkInternet = async () => {
    NetInfo.fetch().then(state => {
      if(state.isConnected){
        this._connectSocket();
        //this._checkUpdates();
        this.loadFonts();
      } else{
        this.setState({ isReady: false });
      }
    });
  }

  handleFirstConnectivityChange = (isConnected) => {
    if(isConnected){
      this._connectSocket();
      //this._checkUpdates();
      this.loadFonts();
    } else{
      this.setState({ isReady: false });
    }
  }

  async loadFonts() {
    const fontAssets = cacheFonts([{
      'Roboto': require("../../node_modules/native-base/Fonts/Roboto.ttf"),
      'Roboto_medium': require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
      'Ionicons':require("../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
      'Entypo': require("../../node_modules/native-base/Fonts/Entypo.ttf"),
      'Feather': require("../../node_modules/native-base/Fonts/Feather.ttf"),
      'FontAwesome': require("../../node_modules/native-base/Fonts/FontAwesome.ttf"),
      'Octicons': require("../../node_modules/native-base/Fonts/Octicons.ttf"),
    }]);

    const imageAssets = cacheImages([
      require("../../assets/images/drawer-cover.png"),
      require("../../assets/images/icon.png"),
      require("../../assets/images/logo.png"),
      require("../../assets/images/nblogo.png"),
      require("../../assets/images/people.png"),
      require("../../assets/images/splashscreen.png"),
      require("../../assets/images/logo-kitchen-sink.png"),
    ]);

    await Promise.all([...imageAssets, ...fontAssets]);
    //this.setState({ isReady: true });
    this.setState({showReloadDialog:false});
    this.checkVersion();
  }

  render() {
    const {isReady, serverclosed, loading, servererror} = this.state;
    if (!isReady) {
      return (
      <AppLoading //startAsync = {this._checkInternet()}
      />);
    }
    else if(isReady && !serverclosed && !servererror){
      return (
        <React.Fragment>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider mapping={mapping} theme={LightTheme}>
        <SocketContext.Provider value={this.socket}>
          <Route />
          </SocketContext.Provider>
        </ApplicationProvider>
        </React.Fragment>
      );
    }else if(isReady && serverclosed && !servererror){
      return(
        <ApplicationProvider mapping={mapping} theme={LightTheme}>
          <ImageBackground
            source={splashscreen}
              style={{flex: 1,
                width: null,
                height: null,
                backgroundColor: "#FFF"}}>
          <Layout style={{flex:2,
            position: "absolute",
            bottom: 150,
            alignSelf: 'center'}}>
            <Text style={{ color: variables.mainColor ,textAlign:'center'}}>ปิดปรับปรุงชั่วคราว</Text>
          <Text style={{ color: variables.mainColor, textAlign:'center'}}>ขอบคุณครับ</Text>
      </Layout>
      </ImageBackground>
      </ApplicationProvider>)
    }else if(isReady && !serverclosed && servererror){
      return(
        <ApplicationProvider mapping={mapping} theme={LightTheme}>
      <ImageBackground
        source={splashscreen}
        style={{flex: 1,
          width: null,
          height: null,
          backgroundColor: "#FFF"}}>
      <Layout style={{flex:1,
        position: "absolute",
        bottom: 150,
        alignItems: 'center',
        alignSelf:'center'}}>
          <Text>ไม่สามารถเชื่อมต่อ server ได้ </Text>
          {(loading) ? <Spinner /> :<Button style={{marginTop:10}} onPress={()=>this.checkVersion()}>เชื่อมต่ออีกครั้ง</Button>}
      </Layout>
      </ImageBackground>
      </ApplicationProvider>)
    }
  }
}

let mapStateToProps = state => {
  return {
    inactiveTime:state.userReducer.inactiveTime,
    emp_id:state.userReducer.emp_id,
    token:state.userReducer.token,
    role:state.userReducer.role,
    imgprofile:state.userReducer.imgprofile,
    store:state.userReducer.store,
    login:state.userReducer.login
  }
}

let mapDispatchToProps = dispatch => {
  return{
    InitData: bindActionCreators(action.InitData, dispatch),
    updateInactive: bindActionCreators(action.updateInactive, dispatch),
    updateEmpId: bindActionCreators(action.updateEmpId, dispatch),
    updateRole: bindActionCreators(action.updateRole, dispatch),
    updateData: bindActionCreators(action.updateData, dispatch),
    updateToken: bindActionCreators(action.updateToken, dispatch),
    updateStore: bindActionCreators(action.updateStore, dispatch),
    updateImgProfile: bindActionCreators(action.updateImgProfile, dispatch),
    updateSelectedStore: bindActionCreators(action.updateSelectedStore, dispatch),
    updateLogin: bindActionCreators(action.updateLogin, dispatch),
    deleteData: bindActionCreators(action.deleteData, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setup);
