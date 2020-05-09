import React, { Component } from "react";
import variables from "../../../theme/variables/commonColor";
import { Alert, Platform} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Button, Header, Title, Icon, Left, Right, Body, H3, Toast} from "native-base";
import { Layout, Button as KittenButton, Text, Input, Card, Spinner} from "@ui-kitten/components";
import appJson from "../../../../app.json";
import axios from 'axios';

let count;

class Register2 extends React.PureComponent {
  _isMounted = false;
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
        spinner:false,
        validcode:"",
        minute:"10",
        second:"00",
        email:this.props.navigation.getParam('body').email,
        shouldDisablePostButton: true
    };
    let time=10*60,tmp=time;
    count = setInterval(()=>{
      let c=tmp--,m=(c/60)>>0,s=(c-m*60)+'';
      this.setState({
        minute:m,
        second:(s.length>1?'':'0')+s
      })
      tmp!=0||(tmp=time);
      if(c <= 1){
        clearInterval(count);
        if (this._isMounted) {
          Alert.alert(
            'หมดเวลาทำรายการ',
            'กรุณาลองใหม่อีกครั้ง',
            [
            {text: 'ปิด', onPress: () => {
                this._onGoback();
            }},
            ]
          );
        }
      }
    },1000);
  }

  
  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onchangeValidcode = (validcode) => {
    validcode = this.normalizeNumber(validcode);
    this.setState({validcode:validcode},() =>{
      if(this.state.validcode != '' && this.state.validcode.length == 6 ){
        this.setState({shouldDisablePostButton:false});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }

  normalizeNumber = (value) => {
    if (!value) {
      return value
    }
    const onlyNums = value.replace(/[^\d]/g, '')
    if (onlyNums.length <=6) {
      return onlyNums
    }
    return `${onlyNums.slice(0, 6)}`
  }

  handleBackButton = () => {
    this._onGoback();
    return true;
  };

  checkOTP = async () =>{
    this.setState({spinner:true});
    let body = this.props.navigation.getParam('body');
    body.email = this.state.email;
    body.otp = this.state.validcode;
    await axios({
      method: 'post',
      url: appJson.url.prefix+ '/checkOTP',
      data: body
    }).catch(error => {
      this.setState({spinner:false});
      Toast.show({
        text: "สงสัยเน็ตกาก ลองใหม่อีกทีน้าาา.",
        type: "danger"
      });
    }).then(response => {
      this.setState({spinner:false});
      if (this._isMounted) {
        if(response.data.status){
            this.CheckTextInput();
        }else{
            Alert.alert(
                'Code ไม่ถูกต้อง',
                'กรุณาลองใหม่อีกครั้ง',
                [
                  {
                    text: 'ปิด',
                    style: 'cancel',
                  }
                ],
                {cancelable: false},
              );
        }
      }
    });
  }

  _onGoback(){
    clearInterval(count);
    this.props.navigation.goBack();
  }

  CheckTextInput = () => {
    clearInterval(count);
    let body = this.props.navigation.getParam('body');
    this.props.navigation.navigate("Register3", {body:body});
  };

  render() {
      const { email, minute, second, spinner} = this.state;
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
        {(spinner)? <Card style={{flex:1, justifyContent:'center', alignItems:'center'}}><Spinner/></Card>:
        <Card>
              <H3 style={{fontSize:16,fontWeight: 'bold', alignSelf: 'center'}}>กรุณาตรวจสอบ Email</H3>
              <Layout style={{alignSelf: 'center'}}>
                  <Text style={{color:variables.grayScale, justifyContent:'center', fontSize:12}}>{email}</Text>
              </Layout>
              <Layout style={{marginTop:10}}>
                <Input  keyboardType="numeric"
                        value={this.state.validcode} 
                        placeholder={"รหัสยืนยันตัวตน"}
                        onChangeText={(validcode) => this.onchangeValidcode(validcode)} 
                        getRef={input => { this.inputs['validcode'] = input }} />
              </Layout>
              <Layout style={{alignSelf: 'center'}}>
                  <Text style={{color:variables.textRedflat, justifyContent:'center', fontSize:12}}>{"Code will expire in "+ minute+":"+second}</Text>
              </Layout>
            <KittenButton 
                  block style={{ margin: 30, marginTop: 50 }}
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.checkOTP}>
              ต่อไป
            </KittenButton>
        </Card>}
        {Platform.OS === 'ios' ? <KeyboardSpacer /> : null }
       </Layout>
      </Layout>
    );
  }
}

export default Register2;
