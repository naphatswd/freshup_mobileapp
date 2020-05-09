import { Thumbnail, Container, Button, Text, Spinner, Header, Left, Right, Title, Card, Icon, CardItem } from "native-base";
import { StatusBar, View, Image, TouchableOpacity, Platform } from 'react-native';
import variables from "../../../theme/variables/commonColor";
import * as ImageManipulator from 'expo-image-manipulator';
import {ImagePicker, Permissions} from 'expo';
import SocketContext from '../../../socket-context';
import React, { Component } from 'react';
import { onSignIn } from "../../../storage";
import {AUTHEN_POST} from "../../../api/restful";
import styles from './styles';

const peoplelogo = require("../../../../assets/images/people.png");
class User extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:null,
      checked:null,
      email:null,
      uploading:true,
      image:null,
      avatar:null
    }
  }

  getPermissionAsync = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }else{
        this.pickImage();
      }
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
      .then(async (response)=>{
        this.setState({uploading:true});
      })
      .catch((error)=>{
        this.setState({uploading:true});
      });
    }
  }

  render() {
    const { avatar, uploading } =this.state;
    return (
      <Container >
      <StatusBar barStyle="light-content" />
      <Header style={{backgroundColor:variables.headerBGPrimary}}>
        <Left>
          <Title style={{ color:variables.headerTextPrimary}}>freshup</Title>
        </Left>
        <Right>
        </Right>
      </Header>
        <View style={{flex:1, justifyContent:'center', margin:10}}>
          {(uploading)?
          <Card style={{justifyContent:'center', alignItems:'center'}} >
          <Title style={{fontSize:22,marginBottom:20}}>ภาพโปรไฟล์</Title>
              <CardItem style={{marginBottom:20}}>
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
                  <Icon name='camera' style={{position: 'absolute',right: 0,bottom: 0, color:variables.textTrinary}}/>
              </View>
            </TouchableOpacity>
              : 
              <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.getPermissionAsync()}} transparent>
              <View>
                  <Thumbnail large source={peoplelogo}/>
                  <Icon name='camera' style={{position: 'absolute',right: 0,bottom: 0, color:variables.textTrinary}}/>
              </View>
            </TouchableOpacity>
            }
            </CardItem>
          </Card >
         : <Card style={styles.logo}><Spinner color={variables.mainColor} style={{alignSelf:'center'}} /></Card>}
         <Card>
         <CardItem style={{flexDirection:'row',alignSelf:'center'}}>
                <Button 
                    onPress = {()=>{ this.props.navigation.navigate("Changepass",{emp_id:this.state.data.emp_id,route:"Admin_Profile"})}}
                    transparent block>
                    <Text style={{ color: variables.textPrimary,fontWeight:'bold' }}>ยืนยัน</Text>
                </Button>
                <Button 
                    onPress = {()=>{ this.props.navigation.navigate("Changepass",{emp_id:this.state.data.emp_id,route:"Admin_Profile"})}}
                    transparent block>
                    <Text style={{ color: variables.textRedflat,fontWeight:'bold' }}>ข้าม</Text>
                </Button>
            </CardItem>
         </Card>
         </View>
      </Container>
    );
  }
}
const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <User {...props} socket={socket} />}
  </SocketContext.Consumer>
)
export default socketcontext;