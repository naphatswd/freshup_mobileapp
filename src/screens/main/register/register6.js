import { Button, Header, Title, Icon, Left, Right, Body} from "native-base";
import { Layout, Button as KittenButton, Card, Input} from "@ui-kitten/components";
import { BackHandler, Alert, Platform} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import React, { Component } from "react";

class Register6 extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      firstname:(this.props.navigation.getParam('body').firstname != null)?  this.props.navigation.getParam('body').firstname:"",
      lastname:(this.props.navigation.getParam('body').lastname != null)?  this.props.navigation.getParam('body').lastname:"",
      nickname:"",
      shouldDisablePostButton: true,
    };
    }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this._onGoback();
    return true;
  };

  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  onchangeFirstName = (firstname) => {
    firstname = firstname.replace(/[^\D]/g, '');
    this.setState({firstname:firstname.trim()},() =>{
      if(this.state.firstname != '' && this.state.lastname != '' && this.state.nickname != ''){
        this.setState({shouldDisablePostButton:false});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }

  onchangeLastName = (lastname) => {
    lastname = lastname.replace(/[^\D]/g, '');
    this.setState({lastname:lastname.trim()},() =>{
      if(this.state.firstname != '' && this.state.lastname != '' && this.state.nickname != ''){
        this.setState({shouldDisablePostButton:false});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }

  onchangeNickName = (nickname) => {
    nickname = nickname.replace(/[^\D]/g, '');
    this.setState({nickname:nickname.trim()},() =>{
      if(this.state.firstname != '' && this.state.lastname != '' && this.state.nickname != ''){
        this.setState({shouldDisablePostButton:false});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }

  _onGoback(){
    Alert.alert(
      'ยกเลิกการสมัคร',
      'หากยกเลิกจะต้องกรอกข้อมูลใหม่',
      [
        {
          text: 'ปิด',
          style: 'cancel',
        },
        {text: 'ยืนยัน', onPress: () => {
          BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: "loginScreen" })
            ],
            });
            this.props.navigation.dispatch(resetAction);
          }},
      ],
      {cancelable: false},
    );
  }

  CheckTextInput = () => {
    const body = this.props.navigation.getParam('body');
    body.firstname = this.state.firstname;
    body.lastname = this.state.lastname,
    body.nickname = this.state.nickname
    this.props.navigation.navigate("Register7", {body:body});
  };

  render() {
    const {firstname, lastname, nickname} = this.state;
    return (
      <Layout style={{flex:1}}>
      <Header style={{backgroundColor:variables.headerBGPrimary}}>
            <Left>
              <Button transparent onPress={() => this._onGoback()}>
                <Icon style={{ color:variables.mainColor}} name="arrow-round-back" />
              </Button>
            </Left>
              <Body>
                  <Title style={{ color:variables.mainColor}}>สมัครสมาชิก</Title> 
              </Body>
            <Right />
      </Header>
        <Layout style={{flex:1, justifyContent:'center', margin:10}}>
        <Card>
                <Input  
                        onChangeText={(firstname) => this.onchangeFirstName(firstname)}
                        placeholder={"ชื่อจริง"}
                        value={firstname}
                        returnKeyType={ 'next' } 
                        blurOnSubmit={ false } 
                        onSubmitEditing={() => { this.focusTheField('lastname'); }}/>
                <Input 
                        onChangeText={(lastname) => this.onchangeLastName(lastname)}
                        style={{marginTop:5, marginBottom:5}} 
                        placeholder={"นามสกุล"}
                        value={lastname}
                        onSubmitEditing={() => { this.focusTheField('nickname'); }}
                        getRef={input => { this.inputs['lastname'] = input }} />
                <Input 
                        onChangeText={(nickname) => this.onchangeNickName(nickname)} 
                        placeholder={"ชื่อเล่น"}
                        value={nickname}
                        getRef={input => { this.inputs['nickname'] = input }} />
            <KittenButton 
                  block style={{ margin: 30, marginTop: 50 }}
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.CheckTextInput}>
              ต่อไป
            </KittenButton>
       </Card>
                {Platform.OS === 'ios' ? <KeyboardSpacer /> : null }
       </Layout>
      </Layout>
    );
  }
}

export default Register6;
