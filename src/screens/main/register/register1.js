import { Button, Header, Title, Icon, Left, Right, Body, H3, Toast} from "native-base";
import { Layout, Button as KittenButton, Text, Input, Card, Select, Spinner} from "@ui-kitten/components";
import { BackHandler, Alert, Platform } from 'react-native';
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import React, { Component } from "react";
import appJson from "../../../../app.json";
import axios from 'axios';

class Register1 extends React.PureComponent {
  _isMounted = false;
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      email:"",
      spinner:false,
      selected:{text:"@cpmail.in.th"},
      domains:[
            {
                text:'@cpmail.in.th'
            },
            {
                text:'@cpf.co.th'
            },
            {
                text:'@cpcrop.co.th'
            },
            {
                text:'@cptrading.co.th'
            },
            {
                text:'@cpall.co.th'
            },
            {
                text:'@truecorp.co.th'
            }
        ,],
      shouldDisablePostButton: true,
    };
 }

  componentDidMount() {
    this._isMounted = true;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleBackButton = () => {
    this._onGoback();
    return true;
  };

  handleSelectDomain = (value)=>{
    this.setState({selected:value});
  }

  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  onchangeEmail = (Email) => {
    this.setState({email:Email},() =>{
      this.setState({labelcolor:variables.textRedflat});
      if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(Email+this.state.selected.text)){
         this.setState({shouldDisablePostButton:true});
      }
      else{
        this.setState({shouldDisablePostButton:false});
      }
    });
  }

  _onGoback(){
    this.props.navigation.goBack();
  }

  requestOTP = async ()=>{
    this.setState({spinner:true});
    let body = {
      email: this.state.email + this.state.selected.text
    }
    await axios({
      method: 'post',
      url: appJson.url.prefix + '/requestOTP',
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
        if(response.data.status == true){
            this.CheckTextInput();
        }else if(response.data.status == 'exist'){
            Alert.alert(
                'Email ซ้ำในระบบ Freshup',
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
                'เกิดข้อผิดพลาด',
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

  CheckTextInput = () => {
    let body = {
        email: this.state.email + this.state.selected.text
      }
      this.props.navigation.navigate("Register2", {body:body});
  };
  render() {
    const { email, spinner } = this.state;
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
          {(spinner)? <Card style={{flex:1, justifyContent:'center', alignItems:'center'}}><Spinner/></Card>
            :<Card>
            <Layout style={{flexDirection:'row', justifyContent:'center', marginTop:10}}>
                  <Input  
                      keyboardType="email-address"
                      style={{flex:1, marginRight:10}}
                      autoCapitalize= 'none'
                      placeholder={"Email"}
                      value={email}
                      onChangeText={(email) => this.onchangeEmail(email)}
                      returnKeyType={ 'next' } />
                  <Select style={{flex:1, alignSelf:'stretch'}} textStyle={{fontSize:10, color:variables.mainColor}} selectedOption={this.state.selected} data={this.state.domains} onSelect={(value)=>{this.handleSelectDomain(value)}}/>
           </Layout>
           <Layout>
              {(this.state.email != '')? 
              <Text style={{color:variables.grayScale}}>{this.state.email + this.state.selected.text}</Text>:
              <Text style={{color:variables.grayScale}}>{"example" + this.state.selected.text}</Text>}
           </Layout> 
          <KittenButton 
                block style={{ margin: 30, marginTop: 50 }}
                disabled={this.state.shouldDisablePostButton}
                onPress={this.requestOTP}>
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

export default Register1;
