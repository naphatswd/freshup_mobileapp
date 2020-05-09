import { Container,Spinner, Button, Text, Form, Item, Label, Input, Header, Title, Icon, Left, Right, Body,H3, Toast } from "native-base";
import { actionCreators as Profileaction } from '../../../reducers/profileReducer/actions';
import variables from "../../../theme/variables/commonColor";
import { AUTHEN_PUT } from "../../../api/restful";
import { StatusBar,View } from 'react-native';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./styles";

class editName extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      firstname:this.props.FirstName,
      lastname:this.props.LastName,
      fullname:this.props.FirstName + " " +this.props.LastName,
      shouldDisablePostButton: true,
      spinner:false,
      route:null
    };
  }

  componentDidMount() {
    this.setState({
      shouldDisablePostButton:true
    });
    this.inputs['lastname']._root.focus();
    this.inputs['firstname']._root.focus();
    this.setState({route:this.props.navigation.getParam('route')});
  }

  onchangeFirstName = (firstname) => {
    firstname = firstname.replace(/[^\D]/g, '');
    this.setState({firstname:firstname},() =>{
      if(firstname != '' && this.state.fullname != firstname+":"+this.state.lastname){
        this.setState({shouldDisablePostButton:false});
      }else{
        this.setState({shouldDisablePostButton:true});
        }
    });
  }
  
  onchangeLastName = (lastname) => {
    lastname = lastname.replace(/[^\D]/g, '');
    this.setState({lastname:lastname},() =>{
      if(lastname != '' && this.state.fullname != this.state.firstname+":"+lastname){
        this.setState({shouldDisablePostButton:false});
      }else{
        this.setState({shouldDisablePostButton:true});
        }
    });
  }

  CheckTextInput = async () => {
      let body = {
        old_emp_id:this.props.emp_id,
        firstname:this.state.firstname,
        lastname:this.state.lastname
      }
      AUTHEN_PUT('/user/updateUser', body)
      .then(async response => {
        this.setState({spinner:false});
        if(response.data.body){
          this.props.updateFirstName(this.state.firstname);
          this.props.updateLastName(this.state.lastname);
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
                  <Title style={{ color:variables.headerTextPrimary}}>Name</Title> 
              </Body>
            <Right />
      </Header>
      {(!spinner) ? 
        <View style={{flex:1, justifyContent:'center', margin:10}}>
        {(this.state.firstname != null) ?
          <View style={styles.name}>
            <Form>
            <H3 style={{fontSize:16,fontWeight: 'bold', alignSelf: 'center'}}>ชื่อ - นามสกุล</H3>
              <View style={{position:"relative" ,flexDirection: 'row'}}>
              <Item floatingLabel style={{marginLeft:25, flex: 1, alignSelf: 'center'}}>
                <Label>First Name</Label>
                <Input  
                        onChangeText={(firstname) => this.onchangeFirstName(firstname)}
                        getRef={input => { this.inputs['firstname'] = input }}
                        value={this.state.firstname}
                        returnKeyType={ 'next' } 
                        blurOnSubmit={ false } 
                        onSubmitEditing={() => { this.focusTheField('lastname'); }}/>
              </Item>
              <Item floatingLabel last style={{marginLeft:25, flex: 1, alignSelf: 'center'}}>
                <Label>Last Name</Label>
                <Input 
                        onChangeText={(lastname) => this.onchangeLastName(lastname)} 
                        value={this.state.lastname}
                        getRef={input => { this.inputs['lastname'] = input }} />
              </Item>
            </View>
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
    FirstName:state.profileReducer.FirstName,
    LastName:state.profileReducer.LastName,
    token:state.userReducer.token
  }
}

let mapDispatchToProps = dispatch => {
  return{
    updateFirstName: bindActionCreators(Profileaction.updateFirstName, dispatch),
    updateLastName: bindActionCreators(Profileaction.updateLastName, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(editName);
