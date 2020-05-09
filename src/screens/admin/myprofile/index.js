import { actionCreators as Profileaction } from '../../../reducers/profileReducer/actions'; 
import { actionCreators as Useraction } from '../../../reducers/userReducer/actions'; 
import { Thumbnail, Container, Button,Content, Text, Toast, Spinner, Card, Icon } from "native-base";
import { StatusBar, View, Image, TouchableOpacity } from 'react-native';
import Header_Admin from "../../../theme/compontent/header_admin";
import variables from "../../../theme/variables/commonColor";
import * as ImageManipulator from 'expo-image-manipulator';
import SocketContext from '../../../socket-context';
import { AUTHEN_GET, AUTHEN_POST } from "../../../api/restful";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { onSignIn } from "../../../storage";
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles';

const launchscreenLogo = require("../../../../assets/images/people.png");
class User extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:null,
      nickName:this.props.nickName,
      firstName:this.props.firstName,
      lastName:this.props.lastName,
      email:this.props.email,
      phone:this.props.phone,
      avatar:this.props.imgprofile,
      selectedStore:this.props.selectedStore,
      store:this.props.store,
      uploading:true,
    }
    this.getUser();
  }

  componentDidUpdate(prevProps){
    if(prevProps.nickName != this.props.nickName && this.props.nickName!=null)
      this.setState({nickName:this.props.nickName});
    if(prevProps.firstName != this.props.firstName && this.props.firstName!=null)
      this.setState({firstName:this.props.firstName});
    if(prevProps.lastName != this.props.lastName && this.props.lastName!=null)
      this.setState({lastName:this.props.lastName});
    if(prevProps.email != this.props.email && this.props.email!=null)
      this.setState({email:this.props.email});
    if(prevProps.phone != this.props.phone && this.props.phone!=null)
      this.setState({phone:this.props.phone});
    if(prevProps.imgprofile != this.props.imgprofile && this.props.imgprofile!=null)
      this.setState({avatar:this.props.imgprofile});
    if(prevProps.store != this.props.store && this.props.store!=null)
      this.setState({store:this.props.store});
    if(prevProps.selectedStore != this.props.selectedStore && this.props.selectedStore!=null)
      this.setState({selectedStore:this.props.selectedStore});
  }

  _editNickName(){
    this.props.navigation.navigate("editNickName",{route:"Admin_Profile"});
  }

  _editEmpName(){
    this.props.navigation.navigate("editName",{route:"Admin_Profile"});
  }

  _editPhone(){
    this.props.navigation.navigate("editPhone",{route:"Admin_Profile"});
  }

  _editStore(){
    this.props.navigation.navigate("Admin_Store",{data:this.state.data,route:"Admin_Profile"});
  }

  getUser = ()=>{
    AUTHEN_GET('/user/me')
      .then((response)=>{
        if(response.data){
          this.props.updateNickname(response.data.nickname);
          this.props.updateEmail(response.data.email);
          this.props.updateFirstName(response.data.firstname);
          this.props.updateLastName(response.data.lastname);
          this.props.updatePhone(response.data.phonenumber);
          this.setState({data:response.data});
        }
      })
      .catch((error)=>{
        Toast.show({
          text:error,
          type:'danger'
        });
      })
  }

  getPermissionAsync = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }else{
        this.pickImage();
      }
  }

  pickImage= async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({uploading:false,avatar:"data:image/png;base64,"+result.base64});
      this.props.updateImgProfile("data:image/png;base64,"+result.base64);
      await onSignIn("avatar", "data:image/png;base64,"+result.base64);
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 120, height: 120 } }],
        { format: ImageManipulator.SaveFormat.PNG, base64:true }
      );
      let body = {
        img : manipResult.base64
      }
      AUTHEN_POST('/user/imageProfile', body)
      .then((response)=>{
        this.setState({uploading:true});
      })
      .catch((error)=>{
        this.setState({uploading:true});
      });
    }
  }

  render() {
    const {
      uploading, 
      nickName,
      firstName,
      lastName,
      email,
      phone,
      selectedStore,
      avatar } =this.state;
    return (
      <Container >
      <StatusBar barStyle="light-content" />
      <Header_Admin navigation={this.props.navigation} radio1={variables.mainColor}/>
          {(uploading)?
          <Card style={styles.logo} >
            {(avatar != null)?
            <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.getPermissionAsync()}} transparent>
              <View>
                <Image
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 120/ 2
                  }}
                  source={{
                    uri:avatar,
                  }}
                />
                  <Icon name='camera' style={{position: 'absolute',right: 0,bottom: 0, color:variables.textUnit}}/>
              </View>
            </TouchableOpacity>
              : 
              <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.getPermissionAsync()}} transparent>
              <View>
                  <Thumbnail large source={launchscreenLogo}/>
                  <Icon name='camera' style={{position: 'absolute',right: 0,bottom: 0, color:variables.textUnit}}/>
              </View>
            </TouchableOpacity>
            }
          </Card >: <Card style={styles.logo}><Spinner color={variables.mainColor} style={{alignSelf:'center'}} /></Card>}
          <Card style={{ flex:1 }}>
          <Content  style={{marginTop:10, marginLeft:10}}>
          <TouchableOpacity
              underlayColor="transparent"
              onPress={()=>{this._editNickName()}}
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:16}}>Nickname</Text>
                {(this.state.data != null ) ?
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{nickName}</Text>: 
                  <Spinner color={variables.mainColor} style={{alignSelf:'center'}} />
                }
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              underlayColor="transparent"
              onPress={()=>{this._editEmpName()}}
              style={{marginTop:5}}
              >
              <View >
                <Text style={{fontSize:16}}>Fullname</Text>
                {(this.state.data != null ) ?
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{firstName + " " + lastName}</Text>: 
                  <Spinner color={variables.mainColor} style={{alignSelf:'center'}} />
                }
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              underlayColor="transparent"
              style={{marginTop:5}}
              >
              <View >
                <Text style={{fontSize:16}}>Email</Text>
                {(this.state.data != null ) ?
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{email}</Text>: 
                  <Spinner color={variables.mainColor} style={{alignSelf:'center'}} />
                }
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              underlayColor="transparent"
              onPress={() => {this._editPhone()}}
              style={{marginTop:5}}
              >
              <View >
                <Text style={{fontSize:16}}>Phone Number</Text>
                {(this.state.data != null ) ?
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{phone}</Text>: 
                  <Spinner color={variables.mainColor} style={{alignSelf:'center'}} />
                }
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          {(this.state.data != null)? <View>{(this.state.data.role != 'saleman')?           
            <TouchableOpacity
              underlayColor="transparent"
              onPress={() => {this._editStore()}}
              style={{marginTop:5}}
              >
              <View >
                <Text style={{fontSize:16}}>โมเดล</Text>
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}} >{selectedStore}</Text>
                 </View>
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          :null}</View>:null}
              <Button 
                onPress = {()=>{ this.props.navigation.navigate("Changepass",{emp_id:this.props.emp_id,route:"Admin_Profile"})}}
                transparent block>
              <Text style={{ color: variables.mainColor }}>เปลี่ยนรหัสผ่าน</Text>
           </Button>
          </Content>
          </Card>
      </Container>
    );
  }
}

const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <User {...props} socket={socket} />}
  </SocketContext.Consumer>
)

let mapStateToProps = state => {
  return {
    selectedStore:state.userReducer.selectedStore,
    nickName:state.profileReducer.Nickname,
    firstName:state.profileReducer.FirstName,
    lastName:state.profileReducer.LastName,
    email:state.profileReducer.Email,
    phone:state.profileReducer.Phone,
    emp_id:state.userReducer.emp_id,
    store:state.userReducer.store,
    imgprofile:state.userReducer.imgprofile
  }
}

let mapDispatchToProps = dispatch => {
  return{
    InitData: bindActionCreators(Profileaction.InitData, dispatch),
    updateNickname: bindActionCreators(Profileaction.updateNickname, dispatch),
    updateFirstName: bindActionCreators(Profileaction.updateFirstName, dispatch),
    updateLastName: bindActionCreators(Profileaction.updateLastName, dispatch),
    updateEmail: bindActionCreators(Profileaction.updateEmail, dispatch),
    updatePhone: bindActionCreators(Profileaction.updatePhone, dispatch),
    updateImgProfile: bindActionCreators(Useraction.updateImgProfile, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(socketcontext);