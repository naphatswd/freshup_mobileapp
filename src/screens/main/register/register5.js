import { Button, Header, Title, Icon, Left, Right, Body, Toast} from "native-base";
import { Layout, Button as KittenButton, Input, Card, Spinner } from "@ui-kitten/components";
import { BackHandler, Alert, Platform} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {POST} from '../../../api/restful';
import React, { Component } from "react";

class Register5 extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      empid:"",
      spinner:false,
      shouldDisablePostButton: true
    };
  }
  
  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  onchangeEmpid = (empid) => {
    empid = empid.replace(/[^\d]/g, '');
    this.setState({empid:empid},() =>{
      if(this.state.empid != '' ){
        this.setState({shouldDisablePostButton:false});
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

  checkSaleCode = ()=>{
    this.setState({spinner:true});
    let body = this.props.navigation.getParam('body');
    body.salecode = this.state.empid;
    POST('/checksalename', body)
    .then(response => {
      this.setState({spinner:false});
      if(response.data.salename != null){
        let temp = response.data.salename.split(" ");
        this.CheckTextInput(temp[0],temp[1]);
      }else if(response.data.status == 'exist'){
        Alert.alert(
          'SalesCode ซ้ำในระบบ Freshup',
          '',
          [
            {
              text: 'ปิด',
              style: 'cancel',
            }
          ],
          {cancelable: false},
        );
      }else{
        Alert.alert(
          'ไม่พบ SalesCode นี้',
          'กรุณาตรวจสอบ SmartOne',
          [
            {
              text: 'ปิด',
              style: 'cancel',
            }
          ],
          {cancelable: false},
        );
      }
  }).catch(error => {
    this.setState({spinner:false});
    Toast.show({
      text: "สงสัยเน็ตกาก ลองใหม่อีกทีน้าาา.",
      type: "danger"
    });
    });
  }

  CheckTextInput = (firstname,lastname) => {    
    let body = this.props.navigation.getParam('body');
    body.emp_id = this.state.empid;
    body.firstname = firstname;
    body.lastname = lastname;
    this.props.navigation.navigate("Register6", {body:body});
  };

  render() {
    const { spinner } = this.state;
    return (
      <Layout style={{flex:1}} >
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
        {(spinner)? <Card style={{flex:1, alignItems:'center', justifyContent:'center'}}><Spinner/></Card> : 
        <Card>
                <Input
                        placeholder="Salescode"
                        keyboardType="number-pad"
                        value={this.state.empid}
                        onChangeText={(empid) => this.onchangeEmpid(empid)}/>
            <KittenButton 
                  block style={{ margin: 30, marginTop: 50 }}
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.checkSaleCode}>
              ต่อไป
            </KittenButton>
       </Card>
       }
                {Platform.OS === 'ios' ? <KeyboardSpacer /> : null }
       </Layout>
      </Layout>
    );
  }
}

export default Register5;
