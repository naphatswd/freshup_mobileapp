import { Button, Header, Title, Icon, Left, Right, Body } from "native-base";
import { Card, List, ListItem, Spinner, Text, Radio, Layout, Icon as KittenIcon} from "@ui-kitten/components";
import { actionCreators as Useraction } from '../../../reducers/userReducer/actions'; 
import variables from "../../../theme/variables/commonColor";
import * as FileSystem from 'expo-file-system';
import { bindActionCreators } from 'redux';
import OverFlowMenu from "./OverFlowMenu";
import React, { Component } from "react";
import { connect } from 'react-redux';
import { AUTHEN_PUT } from '../../../api/restful';

class editStore extends Component {
  constructor(props){
    super(props);
    this.state = {
      spinner:false,
      showdata:this.props.store,
      visible:false
    };
  }

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        this.setState({showdata:this.props.store})
      })
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  newGroup = () =>{
    this.props.navigation.navigate("Group1", {data:""});
  }
  
  editGroup = (store,index) =>{
    this.props.navigation.navigate("Group1",{data:store,index:index});
  }

  selectOption = async (idx,store,index) =>{
    this.setState({ visible: false });
      if(idx == 0){
        this.editGroup(store,index);
      }else if(idx ==1){
        let temp = this.state.showdata;
        temp.splice(index,1);
        this.props.updateStore(temp);
        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'mystore.json', JSON.stringify(temp));
        this.setState({showdata:temp});
      }
  }

  submitStore = async (store) =>{
    let idk = -1;
    this.state.showdata.find((element,k) =>{
        if(element.selected){
            idk =k;
            return;
        }
    });
    if(idk >-1 ) this.state.showdata[idk].selected = false
    store.selected = true;
    this.props.updateSelectedStore(store.name);
    this.props.updateStore(this.state.showdata);
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'mystore.json', JSON.stringify(this.state.showdata));
    this.UpdateStore(store)
  }

  UpdateStore = async(stores)=>{
    this.setState({spinner:true});
    let body = {
      admin_store:stores.store
    }
    AUTHEN_PUT('/user/updateMyStore',body)
    .then(response => {
      this.setState({spinner:false});
      if(response.data.body){}
      else{
        Toast.show({text:"error, try again",type:'danger'});
      }
    })
    .catch(()=>{
      this.setState({spinner:false});
      Toast.show({text:"error, try again",type:'danger'});});    
  }

  renderItem= ({index,item}) =>{
    if(item.selected){
      return (
        <Layout style={{ alignItems:'center',flexDirection:'row'}}>
          <Radio checked={item.selected} />
          <ListItem
            style={{flex:1}}
            title={item.name}
            accessory={()=>{return (<OverFlowMenu items={[{title:'แก้ไข'}]} selectOption={this.selectOption} store={item} index={index}/>)}}
          />
        </Layout>
      );
    }
    else{
        return (
          <Layout style={{ alignItems:'center',flexDirection:'row'}}>
            <Radio checked={item.selected} onChange={()=> this.submitStore(item)}/>
            <ListItem
              onPress={()=> this.submitStore(item)}
              style={{flex:1}} 
              title={item.name}
              accessory={()=>{return (<OverFlowMenu items={[{title:'แก้ไข'},{title:'ลบ'}]} selectOption={this.selectOption} store={item} index={index}/>)}}
            />
          </Layout>
          );
    }
  }

  render() {
    const {spinner,showdata} = this.state;
    return (
      <Layout style={{flex:1}} >
        <Header style={{backgroundColor:variables.headerBGPrimary}}>
            <Left>
              <Button transparent onPress={()=>{this.props.navigation.goBack();}} >
                <Icon style={{ color:variables.headerTextPrimary}} name="arrow-round-back" />
              </Button>
            </Left>
              <Body>
                  <Title style={{ color:variables.headerTextPrimary}}>สาขาที่ดูแล</Title> 
              </Body>
            <Right />
      </Header>
      {(!spinner) ?
        <Card style={{flex:1}}>
          <ListItem
            onPress={()=>{this.newGroup()}}
            style={{marginLeft:-20}}  
            title={'สร้างกลุ่มใหม่'}
            icon={() => {return (<KittenIcon name="people-outline"/>)}}
            accessory={()=>{return (<Text>></Text>)}}
          />
            <Text style={{alignSelf:'flex-start' , fontSize:12, color:variables.textTrinary}}>กลุ่ม</Text>
                <List
                    style={{backgroundColor:variables.bgPrimary}}
                    data={showdata}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.name}/>
        </Card>:<Layout style={{flex:1, alignItems:'center',justifyContent:'center'}}><Spinner /></Layout>}
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
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(editStore);
