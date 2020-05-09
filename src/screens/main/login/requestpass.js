import { Container, Button, Form, Item, Label, Header, Title, Icon, Left, Right, Body, H3, Toast } from "native-base";
import { Layout, Button as KittenButton, Text, Input, Card, Select, Spinner} from "@ui-kitten/components";
import { StackActions, NavigationActions } from 'react-navigation';
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { StatusBar, View, Platform} from 'react-native';
import appJson from "../../../../app.json";
import React, { Component } from "react";
import styles from "./styles";
import axios from 'axios';

class requestPass extends React.PureComponent {

  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      data:null,
      email:"",
      shouldDisablePostButton: true,
      spinner:false,
      route:null
    };
  }

  onchangeEmail = (email) => {
    this.setState({email:email.toLowerCase()},() =>{
      if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
        this.setState({shouldDisablePostButton:false});
      }else{
        this.setState({shouldDisablePostButton:true});
        }
    });
  }

  CheckTextInput = async () => {
    this.setState({spinner:true});
      let body = {
        email:this.state.email
      }
      await axios({
        method: 'post',
        url: appJson.url.prefix+'/requestpassword',
        data: body
      }).catch(()=>{
        this.setState({spinner:false});
        Toast.show({text:"error, try again",type:'danger'});})
      .then(async response => {
        this.setState({spinner:false});
        if(response.data.body){
          Toast.show({
              text:"รหัสผ่านถูกส่งไปยัง " + this.state.email,
              type:"success"
          });
          this._onGoBack();
        }
        else{
          Toast.show({text:"ไม่พบ email นี้ในระบบ",type:'danger'});
        }
      });  
  };

  _onGoback = () =>{
    const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: "loginScreen" })
        ],
        });
        this.props.navigation.dispatch(resetAction);
  }

  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  render() {
    const {spinner} = this.state;
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
                  <Title style={{ color:variables.mainColor}}>ขอรหัสผ่านใหม่</Title> 
              </Body>
            <Right />
      </Header>
        {(!spinner) ?
        <Layout style={{flex:1, justifyContent:'center', margin:10}}>
          <Card>
                  <Input  
                        placeholder="Email"
                        keyboardType="email-address"
                        value={this.state.email}
                        getRef={input => { this.inputs['email'] = input }}
                        onChangeText={(email) => this.onchangeEmail(email)}/>
              <KittenButton 
                  block style={{ margin: 30, marginTop: 50 }}
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.CheckTextInput}>
                  ยืนยัน
              </KittenButton>
          </Card>
        {Platform.OS === 'ios' ? <KeyboardSpacer /> : null }</Layout>
               : <Card style={{flex:1, alignItems:"center", justifyContent:'center'}}><Spinner /></Card>
        }
      </Layout>
    );
  }
}

export default requestPass;
