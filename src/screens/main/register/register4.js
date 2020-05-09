import { Button, Header, Title, Icon, Left, Right, Body } from "native-base";
import { Layout, Button as KittenButton, Radio, ListItem, Card } from "@ui-kitten/components";
import React, { Component } from "react";
import { BackHandler, Alert} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import variables from "../../../theme/variables/commonColor";

class Register4 extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      radio1: true,
      radio2: false,
      radio3: false,
      role:null,
      shouldDisablePostButton: true
    };
  }

  componentDidMount = ()=>{
    this.toggleRadio1();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  toggleRadio1() {
    this.setState({
      radio1: true,
      radio2: false,
      radio3: false,
      role:"admin",
      shouldDisablePostButton:false
    });
  }
  toggleRadio2() {
    this.setState({
      radio1: false,
      radio2: true,
      radio3: false,
      role:"saleman",
      shouldDisablePostButton:false
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
    body.role = this.state.role;
    if(this.state.role =='saleman')
      this.props.navigation.navigate("Register5", {body:body});
    else
      this.props.navigation.navigate("Register6", {body:body});
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
            <ListItem 
                onPress={()=> this.toggleRadio1()}
                title={"ทีมเถ้าแก่ (FLP,PLP,LDP)"} 
                accessory={()=>{return (<Radio checked={this.state.radio1}/>)}}/>
            <ListItem 
                checked={this.state.radio2} onPress={()=> this.toggleRadio2()}
                title={"เถ้าแก่ขาย"} 
                accessory={()=>{return (<Radio checked={this.state.radio2}/>)}}/>
        <KittenButton block style={{ margin: 30, marginTop: 50 }} disabled={this.state.shouldDisablePostButton} onPress={this.CheckTextInput}>
        ต่อไป
        </KittenButton>
      </Card>
      </Layout>
    </Layout>
    );
  }
}

export default Register4;
