import { Button, Header, Title, Icon, Left, Right, Body} from "native-base";
import { Layout, Button as KittenButton, Card, Input} from "@ui-kitten/components";
import { StatusBar, BackHandler, Alert, Platform} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import React, { Component } from "react";

class Register4 extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      phonenumber:"",
      shouldDisablePostButton: true
    };
  }
  
  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  onchangePhonenumber = (phonenumber) => {
    phonenumber = this.normalizePhone(phonenumber);
    this.setState({phonenumber:phonenumber},() =>{
      if(this.state.phonenumber != '' && this.state.phonenumber.length ==10 ){
        this.setState({shouldDisablePostButton:false});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }

  normalizePhone = (value) => {
    if (!value) {
      return value
    }
    const onlyNums = value.replace(/[^\d]/g, '')
    if (onlyNums.length <= 3) {
      return onlyNums
    }
    if (onlyNums.length <= 7) {
      return `${onlyNums.slice(0, 3)}${onlyNums.slice(3)}`
    }
    return `${onlyNums.slice(0, 3)}${onlyNums.slice(3, 6)}${onlyNums.slice(6, 10)}`
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
    body.phonenumber = this.state.phonenumber;
    this.props.navigation.navigate("Register8", {body:body});
  };

  render() {
    return (
      <Layout style={{flex:1}} >
      <StatusBar barStyle="light-content" />
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
              <Input    keyboardType="numeric"
                        placeholder="เบอร์โทรศัพท์มือถือ"
                        value={this.state.phonenumber} 
                        onChangeText={(phonenumber) => this.onchangePhonenumber(phonenumber)} 
                        getRef={input => { this.inputs['phonenumber'] = input }} />
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

export default Register4;
