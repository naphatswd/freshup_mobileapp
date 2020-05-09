import { Button, Toast, Header, Title, Icon, Left, Right, Body } from "native-base";
import { Layout, Card, Input, Button as KittenButton} from "@ui-kitten/components";
import { actionCreators as Useraction } from '../../../reducers/userReducer/actions';
import variables from "../../../theme/variables/commonColor";
import * as FileSystem from 'expo-file-system';
import { StackActions } from 'react-navigation';
import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AUTHEN_PUT } from '../../../api/restful';

class group2 extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
        groupdata:null,
        groupname:null,
        showname:null,
        index:null,
        selected:false,
        shouldDisablePostButton: true
    };
  }

  componentDidMount(){
    this.setState({
      shouldDisablePostButton:(this.props.navigation.state.params.data.name != undefined)? false:true,
      groupdata:this.props.navigation.state.params.data,
      index:(this.props.navigation.state.params.index!=null)? this.props.navigation.state.params.index:null,
      groupname:(this.props.navigation.state.params.data.name != undefined)? this.props.navigation.state.params.data.name:null,
      showname:(this.props.navigation.state.params.data.name != undefined)? this.props.navigation.state.params.data.name:null,
      selected:(this.props.navigation.state.params.data.selected)? true:false
    });
  }
  
  focusTheField = (id) => {
    this.inputs[id]._root.focus();
  }

  onchangeName = (showname) => {
    this.setState({showname:showname.trim()},() =>{
      if(this.state.showname != '' ){
        this.setState({shouldDisablePostButton:false});
      }
      else{
        this.setState({shouldDisablePostButton:true});
      }
    });
  }

  _onGoback(){
    this.props.navigation.goBack();
  }

  CheckTextInput = async () => {   
      let body = this.state.groupdata;
      body.name = this.state.showname;
      body.title = this.state.showname;
      body.selected = this.state.selected;
      let readfile;
      try{readfile = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+'mystore.json');}
      catch(e) {Toast.show({text:"Error",type:'danger'});}
      let JSONresult = JSON.parse(readfile);
      if(this.state.index != null){
        if(body.selected){
            JSONresult[this.state.index] = body;
            this.props.updateStore(JSONresult);
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'mystore.json', JSON.stringify(JSONresult));
            this.props.updateSelectedStore(body.name);
            if(this.props.navigation.state.params.data.name == body.name) this.props.updateData(true);
            this.UpdateStore(body);
        }else{
          JSONresult.splice(this.state.index,1);
          this.props.updateStore(JSONresult);
          await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'mystore.json', JSON.stringify(JSONresult));
          JSONresult.push(body);
          this.props.updateStore(JSONresult);
          await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'mystore.json', JSON.stringify(JSONresult));
          const popAction = StackActions.pop({
            n: 2,
          });
          this.props.navigation.dispatch(popAction);
        }
      }
      else {
        JSONresult.push(body);
        this.props.updateStore(JSONresult);
        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'mystore.json', JSON.stringify(JSONresult));
        const popAction = StackActions.pop({
          n: 2,
        });
        this.props.navigation.dispatch(popAction);
      }
  };

  UpdateStore = async(stores)=>{
    this.setState({spinner:true});
    let body = {
      admin_store:stores.store
    }
    AUTHEN_PUT('/user/updateMyStore',body)
    .then(response => {
      this.setState({spinner:false});
      if(response.data.body){
        const popAction = StackActions.pop({
          n: 2,
        });
        this.props.navigation.dispatch(popAction);
      }
      else{
        Toast.show({text:"error, try again",type:'danger'});
      }
    })
    .catch(()=>{
      this.setState({spinner:false});
      Toast.show({text:"error, try again",type:'danger'});});
  }

  render() {
    return (
    <Layout style={{flex:1}}>
    <Header style={{backgroundColor:variables.headerBGPrimary}}>
            <Left>
              <Button transparent onPress={() => this._onGoback()}>
                <Icon style={{ color:variables.headerTextPrimary}} name="arrow-round-back" />
              </Button>
            </Left>
              <Body>
                  <Title style={{ color:variables.headerTextPrimary}}>สาขาที่ดูแล</Title> 
              </Body>
            <Right />
      </Header>
        <Layout style={{flex:1, justifyContent:'center', margin:10}}>
          <Card>
                <Input  
                        style={{color:variables.textInput}}
                        value={this.state.showname}
                        placeholder={"ชื่อกลุ่มสาขา"}
                        onChangeText={(showname) => this.onchangeName(showname)}/>
            <KittenButton 
                  block style={{ margin: 30, marginTop: 50 }}
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.CheckTextInput}>
              ยืนยัน
            </KittenButton>
          </Card>
       </Layout>
      </Layout>
    );
  }
}

let mapStateToProps = state => {
  return {
    token:state.userReducer.token,
    store:state.userReducer.store
  }
}

let mapDispatchToProps = dispatch => {
  return{
    updateStore: bindActionCreators(Useraction.updateStore, dispatch),
    updateSelectedStore: bindActionCreators(Useraction.updateSelectedStore, dispatch),
    updateData: bindActionCreators(Useraction.updateData, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(group2);