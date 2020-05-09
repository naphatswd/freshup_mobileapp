import { Thumbnail, Container,Content, Text, Toast, Spinner, Card, Right, CheckBox } from "native-base";
import { StatusBar, View, Image, TouchableOpacity, Alert  } from 'react-native';
import Header_Second from "../../../theme/compontent/headersecond";
import variables from "../../../theme/variables/commonColor";
import SocketContext from '../../../socket-context';
import { AUTHEN_POST, AUTHEN_PUT } from '../../../api/restful';
import React, { Component } from 'react';
import styles from './styles';

const launchscreenLogo = require("../../../../assets/images/people.png");
class UserProfile extends React.PureComponent {
  static navigationOptions = {
    drawerLockMode: 'locked-closed'
  };

  constructor(props) {
    super(props);
    this.state = {
      data:null,
      checked:null,
      email:null,
      route:"User",
      avatar:null
    };
    this.props.socket.on('refhresh',()=>{
      this.setState({data:this.props.navigation.getParam('data')},()=>{
        if(this.state.data.status == 'waiting' || this.state.data.status == 'closed' || this.state.data.status == 'banned'){
           this.setState({checked:false});
        }else{
          this.setState({checked:true});
        }
      });
    })
  }

  componentDidMount() {
    this.setState({data:this.props.navigation.getParam('data')},()=>{
      this.getAvatar();
      if(this.state.data.status == 'waiting' || this.state.data.status == 'closed' || this.state.data.status == 'banned'){
         this.setState({checked:false});
      }else{
        this.setState({checked:true});
      }
    });
  }

  getAvatar(){
    AUTHEN_POST('/user/userAvatar',{emp_id:this.state.data.emp_id})
    .then((response)=>{
      if(response.data.length>0){
        this.setState({avatar:"data:image/png;base64,"+response.data});
      }
   });
  }

  _editNickName(){
  //  this.props.navigation.navigate("editNickName",{data:this.state.data,route:"UserProfile"});
  }
  _editEmpID(){
    // this.props.navigation.navigate("editEmpid",{data:this.state.data,route:"UserProfile"});
  }
  _editEmpName(){
    // this.props.navigation.navigate("editName",{data:this.state.data,route:"UserProfile"});
  }
  _editEmail(){
   // this.props.navigation.navigate("editEmail",{data:this.state.data,route:"UserProfile"});
  }
  _editPhone(){
   // this.props.navigation.navigate("editPhone",{data:this.state.data,route:"UserProfile"});
  }
  _editRole(){
  //  this.props.navigation.navigate("editRole",{data:this.state.data,route:"UserProfile"});
  }
  _editStore(){
  //  this.props.navigation.navigate("editStore",{data:this.state.data,route:"UserProfile"});
  }
  _editVerified(){
    const status = this.state.data.status;
    if( status != 'waiting' && status != 'closed' && status != 'banned' && status != null )
    Alert.alert(
      'ยกเลิกบัญชีนี้',
      'ต้องการยกเลิกบัญชีผู้ใช้ ?',
      [
        {
          text: 'NO',
          style: 'cancel',
        },
        {text: 'YES', onPress: () => {
          this.CheckTextInput('banned');
          this.setState({checked:false});
          this.props.socket.emit('banned',this.state.data.emp_id);
        }},
      ],
      {cancelable: false},
    );
    else
    Alert.alert(
      'ยืนยันตัวตนผู้ใช้',
      'ต้องการยืนยันตัวผู้ใช้ ?',
      [
        {
          text: 'NO',
          style: 'cancel',
        },
        {text: 'YES', onPress: () => {
          this.verifiy_user('offline');
          this.setState({checked:true});
          this.props.socket.emit('refresh',this.state.data.emp_id);
        }},
      ],
      {cancelable: false},
    );
  }

  verifiy_user = async (status) => {
      let body = {
        old_emp_id:this.state.data.emp_id,
        status:status
      }
      AUTHEN_PUT('/user/verify', body)
      .then( response =>{
        if(response.data.body){
          let temp = this.state.data;
          temp.status = status;
        }
        else{
          Toast.show({text:"error, try again",type:'danger'});
        }
      }).catch(()=>{
        Toast.show({text:"error, try again",type:'danger'});})   
  };

  CheckTextInput = async (status) => {
    let body = {
      old_emp_id:this.state.data.emp_id,
      status:status
    }
    AUTHEN_PUT('/user/updateUser', body)
    .then( response =>{
      if(response.data.body){
        let temp = this.state.data;
        temp.status = status;
      }
      else{
        Toast.show({text:"error, try again",type:'danger'});
      }
    }).catch(()=>{
      Toast.show({text:"error, try again",type:'danger'});})  
  };

  render() {
    const {data,checked,avatar} = this.state;
    return (
      <View style={{flex:1}}>
        {(data != null ) ?
        <Container>
        <StatusBar barStyle="light-content" />
        <Header_Second title={data.firstname + " " + data.lastname} navigation={this.props.navigation} route={this.state.route}/>
          <Card style={styles.logo} >
            {(avatar != null)?
            <TouchableOpacity style={{alignSelf:'center'}}  transparent>
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
              </View>
            </TouchableOpacity>
              : 
              <TouchableOpacity style={{alignSelf:'center'}}transparent>
              <View>
                  <Thumbnail large source={launchscreenLogo} style={styles.circleimg}/>
              </View>
            </TouchableOpacity>
            }
          </Card >
          <Card style={{flex:1, marginTop:10, marginLeft:8}}>
          <Content style={{flex:3, marginTop:10, marginLeft:8}}>
          <TouchableOpacity
              underlayColor="transparent"
              onPress={() => this._editEmpID()}
              >
              <View >
                <Text style={{fontSize:16}}>Employee ID</Text>
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{data.emp_id}</Text>
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              underlayColor="transparent"
              onPress={()=>{this._editNickName()}}
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:16}}>Nickname</Text>
                {(this.state.data != null ) ?
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{this.state.data.nickname}</Text>: 
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
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:16}}>Fullname</Text>
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{data.firstname + " " + data.lastname}</Text>
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              underlayColor="transparent"
              onPress={()=>{this._editEmail()}}
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:16}}>Email</Text>
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{data.email}</Text>
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              underlayColor="transparent"
              onPress={() => {this._editPhone()}}
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:16}}>Phone Number</Text>
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{data.phonenumber}</Text>
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              underlayColor="transparent"
              onPress={() => {this._editRole()}}
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:16}}>Role</Text>
                  <Text style={{fontSize:16,marginTop: 5,color:variables.textPrimary}}>{data.role}</Text>
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              underlayColor="transparent"
              onPress={()=>{this._editVerified()}}
              style={{marginTop:8}}
              >
              <View >
                <View style={{position:"relative", flexDirection:'row'}} >
                    <View style={{alignSelf:'center'}}>
                    <Text style={{fontSize:16}}>Verified</Text>
                        <Text style={{fontSize:13,marginTop: 5,color:variables.textUnit}}>verify user to use this app.</Text>
                    </View>
                    <Right>
                    <View style={{alignSelf:'center'}}>
                    {(checked != null) ?<CheckBox disabled = {true} checked={checked}></CheckBox> : null }
                    </View>
                    </Right>
                  </View>
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableOpacity>
          </Content>
          </Card>
        </Container> : <View style={{flex:3,justifyContent:'center'}}><Spinner color={variables.Maincolor} /></View>}
      </View>
    );
  }
}

const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <UserProfile {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default socketcontext;