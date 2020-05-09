import { Container, Button, Text, Form, Item, Label, Input, Header, Title, Icon, Left, Right, Body,H3, Toast, Spinner } from "native-base";
import { actionCreators as Profileaction } from '../../../reducers/profileReducer/actions';
import variables from "../../../theme/variables/commonColor";
import { StatusBar,View } from 'react-native';
import { bindActionCreators } from 'redux';
import { AUTHEN_PUT } from "../../../api/restful";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./styles";

class editEmail extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      email:this.props.email,
      shouldDisablePostButton: true,
      spinner:false,
      route:null
    };
  }

  componentDidMount() {
    this.setState({
      shouldDisablePostButton:true
    });
    this.inputs['email']._root.focus();
    this.setState({route:this.props.navigation.getParam('route')});
  }

  onchangeEmail = (email) => {
    this.setState({email:email},() =>{
      if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) && this.props.email != email){
        this.setState({shouldDisablePostButton:false});
      }else{
        this.setState({shouldDisablePostButton:true});
        }
    });
  }

  CheckTextInput = async () => {
      let body = {
        old_emp_id:this.props.emp_id,
        email:this.state.email
      }
      AUTHEN_PUT('/user/updateUser', body)
      .then(async response => {
        this.setState({spinner:false});
        if(response.data.body){
          this.props.updateEmail(this.state.email);
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
              <Button transparent onPress={()=>{this.props.navigation.navigate(this.state.route);}}>
                <Icon style={{ color:variables.headerTextPrimary}} name="arrow-round-back" />
              </Button>
            </Left>
              <Body>
                  <Title style={{ color:variables.headerTextPrimary}}>EMAIL</Title> 
              </Body>
            <Right />
      </Header>
      {(!spinner) ? 
        <View style={{flex:1, justifyContent:'center', margin:10}}>
        {(this.state.email != null) ?
          <View style={styles.name}>
            <Form >
            <H3 style={{fontSize:16,fontWeight: 'bold', alignSelf: 'center'}}>Email</H3>
                <Item floatingLabel style={{alignSelf: 'center'}}>
                  <Label>Email</Label>
                  <Input  keyboardType="email-address"
                        value={this.state.email}
                        getRef={input => { this.inputs['email'] = input }}
                        onChangeText={(email) => this.onchangeEmail(email)}/>
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
    email:state.profileReducer.Email,
    token:state.userReducer.token
  }
}

let mapDispatchToProps = dispatch => {
  return{
    updateEmail: bindActionCreators(Profileaction.updateEmail, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(editEmail);
