import React, { Component } from "react";
import { Alert ,Platform, BackHandler} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Button, Header, Title, Icon, Left, Right, Body, H3} from "native-base";
import { Layout, Button as KittenButton, Input, Card} from "@ui-kitten/components";
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';

class Register3 extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      password:"",
      labelcolor:"#bdc3c7",
      confirm:"",
      shouldDisablePostButton: true
    };
  }
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  onchangePassword = (Password) => {
    this.setState({password:Password},() =>{
      if(this.state.password != ''){
        if(this.state.password.length>=8 && this.state.password == this.state.confirm)
          this.setState({shouldDisablePostButton:false});
        else
          this.setState({shouldDisablePostButton:true});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }

  onchangeConfirmPassword = (Password) =>{
    this.setState({confirm:Password},() =>{
      if(this.state.password != ''){
        if(this.state.password.length>=8 && this.state.password == this.state.confirm)
          this.setState({shouldDisablePostButton:false});
        else
          this.setState({shouldDisablePostButton:true});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }
  

  handleBackButton = () => {
    this._onGoback();
    return true;
  };

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
    let body = this.props.navigation.getParam('body');
    body.password = this.state.password;
    this.props.navigation.navigate("Register4", {body:body});
  };

  render() {
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
                <Input placeholder={"Password (อย่างน้อย 8 ตัวอักษร)"} autoCapitalize= 'none' onChangeText={(password) => this.onchangePassword(password)} getRef={input => { this.inputs['password'] = input }} onSubmitEditing={() => { this.focusTheField('confirm'); }} secureTextEntry={true}/>
                <Input placeholder={"Confirm Password (อย่างน้อย 8 ตัวอักษร)"} autoCapitalize= 'none' style={{marginTop:10}} onChangeText={(password) => this.onchangeConfirmPassword(password)} getRef={input => { this.inputs['confirm'] = input }} secureTextEntry={true}/>
            <KittenButton 
                  block style={{ margin: 30, marginTop: 50 }}
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.CheckTextInput}>ต่อไป
            </KittenButton>
       </Card>
                {Platform.OS === 'ios' ? <KeyboardSpacer /> : null }
       </Layout>
      </Layout>
    );
  }
}

export default Register3;
