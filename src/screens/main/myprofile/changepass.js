import { Container, Button, Text, Form, Item, Label, Input, Toast } from "native-base";
import Header_Second from "../../../theme/compontent/headersecond";
import variables from "../../../theme/variables/commonColor";
import { StatusBar, View } from 'react-native';
import { AUTHEN_PUT } from '../../../api/restful';
import React, { Component } from "react";
import { getItem } from "../../../storage";
import styles from "./styles";

class ChangePass extends React.PureComponent {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      email:"",
      route:"MyProfile",
      password:"",
      labelcolor:variables.grayScale,
      confirm:"",
      route:this.props.navigation.getParam('route'),
      shouldDisablePostButton: true
    };
  }
  
  componentDidMount() {
    this.setState({password:"",confirm:""});
  }

  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  onchangePassword = (Password) => {
    this.setState({password:Password},() =>{
      if(this.state.password != ''){
        if(this.state.password.length>=8 && this.state.password == this.state.confirm)
          this.setState({shouldDisablePostButton:false});
        else
          this.setState({shouldDisablePostButton:true});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }

  onchangeConfirmPassword = (Password) =>{
    this.setState({confirm:Password},() =>{
      if(this.state.password != ''){
        if(this.state.password.length>=8 && this.state.password == this.state.confirm)
          this.setState({shouldDisablePostButton:false});
        else
          this.setState({shouldDisablePostButton:true});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }

  CheckTextInput = async () => {
    let obj = await getItem("token");
    if(obj != null){
    let body = {};
    body.emp_id = this.props.navigation.getParam('emp_id');
    body.password = this.state.password;
    AUTHEN_PUT('/user/changepass', body)
    .then(response => {
      if(response.data.body){
       Toast.show({
         text: "เปลี่ยนรหัสผ่านสำเร็จ.",
         type: "success"
       });
       this.props.navigation.navigate(this.state.route)
      }else{
       Toast.show({
         text: "กรุณาลองอีกครั้ง.",
         type: "danger"
       });
      }
   }).catch(error => {
    Toast.show({
      text: "Try again later.",
      type: "danger"
    });
  });
 }
 };

  render() {
    return (
      <Container >
      <StatusBar barStyle="light-content" />
      <Header_Second title="เปลี่ยนรหัสผ่าน" navigation={this.props.navigation} route={this.state.route}/>
        <View style={styles.name}>
          <Form>
              <Item floatingLabel last>
                <Label>New Password (อย่างน้อย 8 ตัวอักษร)</Label>
                <Input autoCapitalize= 'none' value={this.state.password} onChangeText={(password) => this.onchangePassword(password)} getRef={input => { this.inputs['password'] = input }} onSubmitEditing={() => { this.focusTheField('confirm'); }} secureTextEntry />
              </Item>
              <Item floatingLabel last>
                <Label>Confirm New Password (อย่างน้อย 8 ตัวอักษร)</Label>
                <Input autoCapitalize= 'none' value={this.state.confirm} onChangeText={(password) => this.onchangeConfirmPassword(password)} getRef={input => { this.inputs['confirm'] = input }} secureTextEntry />
              </Item>
            </Form>
            <Button 
                  block style={{ margin: 30, marginTop: 50 }}
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.CheckTextInput}>
              <Text>ยืนยัน</Text>
            </Button>
       </View>
      </Container>
    );
  }
}

export default ChangePass;
