import { Container,Spinner, Button, Text, Form, Item, Label, Input, Header, Title, Icon, Left, Right, Body,H3, Toast } from "native-base";
import { actionCreators as Profileaction } from '../../../reducers/profileReducer/actions';
import variables from "../../../theme/variables/commonColor";
import { AUTHEN_PUT } from "../../../api/restful";
import { StatusBar,View } from 'react-native';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./styles";

class editNickname extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      nickname:this.props.Nickname,
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
    this.inputs['nickname']._root.focus();
  }


  onchangeNickname = (nickname) => {
    nickname = nickname.replace(/[^\D]/g, '');
    this.setState({nickname:nickname},() =>{
      if(nickname != '' && this.props.NickName != nickname){
        this.setState({shouldDisablePostButton:false});
      }else{
        this.setState({shouldDisablePostButton:true});
        }
    });
  }

  CheckTextInput = async () => {
    this.setState({spinner:true});
      let body = {
        nickname:this.state.nickname,
        old_emp_id:this.props.emp_id
      }
      AUTHEN_PUT('/user/updateUser', body)
      .then(async response => {
        this.setState({spinner:false});
        if(response.data.body){
          this.props.updateNickName(this.state.nickname);
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
                  <Title style={{ color:variables.headerTextPrimary}}>ชื่อเล่น</Title> 
              </Body>
            <Right />
      </Header>
      {(!spinner) ? 
        <View style={{flex:1, justifyContent:'center', margin:10}}>
        {(this.state.nickname != null) ?
          <View style={styles.name}>
            <Form>
            <H3 style={{fontSize:16,fontWeight: 'bold', alignSelf: 'center'}}>ชื่อเล่น</H3>
                <Item floatingLabel style={{alignSelf: 'center'}}>
                  <Label>ชื่อเล่น</Label>
                    <Input  
                        value={this.state.nickname}
                        getRef={input => { this.inputs['nickname'] = input }}
                        onChangeText={(nickname) => this.onchangeNickname(nickname)}/>
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
    Nickname:state.profileReducer.Nickname,
    token:state.userReducer.token
  }
}

let mapDispatchToProps = dispatch => {
  return{
    updateNickName: bindActionCreators(Profileaction.updateNickname, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(editNickname);