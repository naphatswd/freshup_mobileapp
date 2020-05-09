import { Container, Spinner, Button, Text, Form, Item, Label, Input, Header, Title, Icon, Left, Right, Body,H3, Toast } from "native-base";
import { actionCreators as Profileaction } from '../../../reducers/profileReducer/actions';
import variables from "../../../theme/variables/commonColor";
import { AUTHEN_PUT } from "../../../api/restful";
import { StatusBar,View } from 'react-native';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./styles";

class editPhone extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      phonenumber:this.props.phone,
      shouldDisablePostButton: true,
      spinner:false,
      route:null
    };
  }

  componentDidMount() {
    this.setState({
      shouldDisablePostButton:true,
      route:this.props.navigation.getParam('route')
    });
    this.inputs['phonenumber']._root.focus();
  }
  
  onchangePhone = (phonenumber) => {
    phonenumber = this.normalizePhone(phonenumber);
    this.setState({phonenumber:phonenumber},() =>{
      if(this.state.phonenumber != '' && this.state.phonenumber.length ==10  && this.props.phone != phonenumber){
        this.setState({shouldDisablePostButton:false});
      }else{
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

  CheckTextInput = async () => {
    this.setState({spinner:true});
      let body = {
        old_emp_id:this.props.emp_id,
        phonenumber:this.state.phonenumber
      }
      AUTHEN_PUT('/user/updateUser', body)
      .then(async response => {
        this.setState({spinner:false});
        if(response.data.body){
          this.props.updatePhone(this.state.phonenumber)
          this.props.navigation.navigate(this.state.route);
        }
        else{
          Toast.show({text:"error, try again",type:'danger'});
        }
      }).catch(()=>{
        this.setState({spinner:false});
        Toast.show({text:"error, try again",type:'danger'});});     
  };

  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

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
                  <Title style={{ color:variables.headerTextPrimary}}>Phone</Title> 
              </Body>
            <Right />
      </Header>
      {(!spinner) ? 
        <View style={{flex:1, justifyContent:'center', margin:10}}>
        {(this.state.phonenumber != null) ?
          <View style={styles.name}>
            <Form>
            <H3 style={{fontSize:16,fontWeight: 'bold', alignSelf: 'center'}}>เบอร์โทรศัพท์</H3>
                <Item floatingLabel style={{alignSelf: 'center'}}>
                  <Label>Phone Number</Label>
                    <Input  
                        keyboardType="number-pad"
                        value={this.state.phonenumber}
                        getRef={input => { this.inputs['phonenumber'] = input }}
                        onChangeText={(phonenumber) => this.onchangePhone(phonenumber)}/>
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

let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    phone:state.profileReducer.Phone,
    token:state.userReducer.token
  }
}

let mapDispatchToProps = dispatch => {
  return{
    updatePhone: bindActionCreators(Profileaction.updatePhone, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(editPhone);