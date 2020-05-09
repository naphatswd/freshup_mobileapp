import { Container,Spinner, Button, Text, Form, Item, Label, Input, Header, Title, Icon, Left, Right, Body,H3, Toast } from "native-base";
import variables from "../../../theme/variables/commonColor";
import { AUTHEN_PUT } from "../../../api/restful";
import { StatusBar,View } from 'react-native';
import React, { Component } from "react";
import styles from "./styles";

class editemp_id extends React.PureComponent {
  static navigationOptions = {
    drawerLockMode: 'locked-closed'
  };

  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      data:null,
      emp_id:"",
      shouldDisablePostButton: true,
      spinner:false,
      route:null
    };
  }

  componentDidMount() {
    this.setState({data:this.props.navigation.getParam('data')},()=>{
      this.setState({emp_id:this.state.data.emp_id},()=>{
        this.inputs['emp_id']._root.focus();
        this.setState({route:this.props.navigation.getParam('route')});
      });
    });
  }
  
  onchangeEmp_id = (emp_id) => {
    emp_id = emp_id.replace(/[^\d]/g, '');
    this.setState({emp_id:emp_id},() =>{
      if(emp_id != '' && this.state.data.emp_id != emp_id){
        this.setState({shouldDisablePostButton:false});
      }else{
        this.setState({shouldDisablePostButton:true});
        }
    });
  }

  CheckTextInput = async () => {
    this.setState({spinner:true});
      let body = {
        emp_id:this.state.emp_id,
        old_emp_id:this.state.data.emp_id
      }
      AUTHEN_PUT('/user/updateUser', body)
      .then(async response => {
        this.setState({spinner:false});
        if(response.data.body){
          let temp = this.state.data;
          temp.emp_id = this.state.emp_id;
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
                  <Title style={{ color:variables.headerTextPrimary}}>Employee ID</Title> 
              </Body>
            <Right />
      </Header>
      {(!spinner) ? 
        <View style={{flex:1, justifyContent:'center', margin:10}}>
        {(this.state.emp_id != null) ?
          <View style={styles.name}>
            <Form>
            <H3 style={{fontSize:16,fontWeight: 'bold', alignSelf: 'center'}}>รหัสพนักงาน</H3>
                <Item floatingLabel style={{alignSelf: 'center'}}>
                  <Label>Employee ID</Label>
                    <Input  
                        keyboardType="number-pad"
                        value={this.state.emp_id}
                        getRef={input => { this.inputs['emp_id'] = input }}
                        onChangeText={(emp_id) => this.onchangeEmp_id(emp_id)}/>
                </Item>
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

export default editemp_id;
