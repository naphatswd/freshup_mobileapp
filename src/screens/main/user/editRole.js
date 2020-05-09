import { Container, Spinner, Button,Toast, Text, Form, ListItem, Radio, Header, Title, Icon, Left, Right, Body,H3 } from "native-base";
import variables from "../../../theme/variables/commonColor";
import { AUTHEN_PUT } from "../../../api/restful";
import { StatusBar,View } from 'react-native';
import React, { Component } from "react";
class editRole extends React.PureComponent {
  static navigationOptions = {
    drawerLockMode: 'locked-closed'
  };

  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      data:null,
      role:null,
      radio1: false,
      radio2: false,
      radio3: false,
      shouldDisablePostButton: true,
      spinner:false,
      route:null
    };
  }

  componentDidMount() {
    this.setState({
      shouldDisablePostButton:true,
      data:this.props.navigation.getParam('data')
    },()=>{
       if(this.state.data.role == "admin") this.toggleRadio1();
       else if(this.state.data.role == "saleman") this.toggleRadio2();
       this.setState({route:this.props.navigation.getParam('route')});
    });
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

  onchangePhone = (role) => {
    this.setState({role:role},() =>{
      if(this.state.role != '' && this.state.data.role != role){
        this.setState({shouldDisablePostButton:false});
      }else{
        this.setState({shouldDisablePostButton:true});
        }
    });
  }

  CheckTextInput = async () => {
    this.setState({spinner:true});
      let body = {
        old_emp_id:this.state.data.emp_id,
        role:this.state.role
      }
      AUTHEN_PUT('/user/updateUser', body)
      .then(async response => {
        this.setState({spinner:false});
        if(response.data.body){
          let temp = this.state.data;
          temp.role = this.state.role;
          this.props.navigation.navigate(this.state.route);
        }
        else{
          Toast.show({text:"error, try again",type:'danger'});
        }
      }).catch(()=>{
        this.setState({spinner:false});
        Toast.show({text:"error, try again",type:'danger'});});    
  };

  render() {
    const {spinner} = this.state;
    return (
      <Container >
        <StatusBar barStyle="light-content" />
        <Header style={{backgroundColor:variables.headerBGPrimary}}>
            <Left>
              <Button transparent onPress={()=>{this.props.navigation.navigate(this.state.route);}} >
                <Icon style={{ color:variables.headerTextPrimary}} name="arrow-round-back" />
              </Button>
            </Left>
              <Body>
                  <Title style={{ color:variables.headerTextPrimary}}>Role</Title> 
              </Body>
            <Right />
      </Header>
      {(!spinner) ? 
        <View style={{flex:1, justifyContent:'center', margin:10}}>
        {(this.state.role != null) ?
          <View style={{ flex: 0.7,
            backgroundColor:"#FFF",
            justifyContent:'center',
            borderRadius:10}}>
        <Form>
          <H3 style={{fontSize:16,fontWeight: 'bold', alignSelf: 'center'}}>หน้าที่รับผิดชอบ</H3>
            <ListItem selected={this.state.radio1} onPress={()=> this.toggleRadio1()} >
                <Left>
                    <Text>ทีมเถ้าแก่ (FLP,PLP,LDP)</Text>
                </Left>
                <Right>
                    <Radio selected={this.state.radio1} onPress={()=> this.toggleRadio1()} />
                </Right>
            </ListItem>
            <ListItem selected={this.state.radio2} onPress={()=> this.toggleRadio2()} >
                <Left>
                    <Text>เถ้าแก่ขาย</Text>
                </Left>
                <Right>
                    <Radio selected={this.state.radio2} onPress={()=> this.toggleRadio2()} />
                </Right>
            </ListItem>
        </Form>
              <Button 
                  block style={{ margin: 30, marginTop: 50 }}
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.CheckTextInput}>
                  <Text>SAVE</Text>
              </Button>
          </View>
                : null
              }
              </View> : 
              <View style={{flex:1,justifyContent:'center'}}><Spinner color={variables.Maincolor} /></View>}
      </Container>
    );
  }
}

export default editRole;
