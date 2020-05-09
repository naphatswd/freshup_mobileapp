import { Button, Header, Title, Icon, Left, Right, Body, Toast } from "native-base";
import { Layout, Button as KittenButton, Card, Input, Radio, ListItem, List, Icon as KittenIcon, Spinner} from "@ui-kitten/components";
import { BackHandler, Alert, Keyboard, Dimensions} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import variables from "../../../theme/variables/commonColor";
import { getAllStores } from "../../../globalfunc";
import appJson from "../../../../app.json";
import React, { Component } from "react";
import axios from 'axios';

class Register8 extends Component {
  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      spinner:false,
      stores:null,
      showdata:null,
      body:this.props.navigation.getParam('body'),
      searchterm:null,
      selected_store:[],
      shouldDisablePostButton: true
    };
    getAllStores((data)=>{
      this.setState({
        showdata:data,
        stores:data
      });
    });
  }

  addStore = (store) =>{
    let showdata = this.state.showdata;
    let stores_lst = [];
      stores_lst = this.state.selected_store;
      let idx = -1;
      stores_lst.find((item,j)=>{
         if(item == store.store_id){
             idx = j;
             return;
        }
      });
      if(idx ==-1){
        store.selected = true;
        stores_lst.push(store.store_id);
      }else{
        store.selected = false;
        stores_lst.splice(idx,1);
      }
   if(stores_lst.length > 0 ) this.setState({shouldDisablePostButton:false})
   else this.setState({shouldDisablePostButton:true});
   this.setState({selected_store:stores_lst});
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

  searchFilterFunction = (text) =>{
    this.setState({searchterm:text.toLowerCase()});
    const newData = this.state.stores.filter(item => {      
      const itemData = 
      `${item.store_id.toLowerCase()} ${item.name.toLowerCase()}`;
       const textData = text;
       return itemData.indexOf(textData) > -1;    
    });    
    newData.sort(function(x, y) {return (x.selected === y.selected)? 0 : x.selected? -1 : 1});
    this.setState({ showdata: newData });
  }
  
  CheckTextInput = async () => {
    this.setState({spinner:true});
    let body = this.props.navigation.getParam('body');
    body.admin_store = this.state.selected_store;
   await axios({
      method: 'post',
      url: appJson.url.prefix+'/signup',
      data: body
    }).catch(error => {
      Toast.show({
        text: "สงสัยเน็ตกาก ลองใหม่อีกทีน้าาา.",
        type: "danger"
      });
    }).then(response => {
      this.setState({spinner:false});
       if(response.data.status === "ok"){
        Toast.show({
          text: "ยินดีต้อนรับจ้า.",
          type: "success"
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton); 
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: "loginScreen" })
          ],
          });
          this.props.navigation.dispatch(resetAction);
       } else{          
        this.setState({spinner:false});
        Toast.show({
          text: "สงสัยเน็ตกาก ลองใหม่อีกทีน้าาา.",
          type: "danger"
        });
       }
    }); 
  };

  renderItem= ({item}) =>{
    if(item.status=="closed"){
      return (
        <ListItem 
          onPress={()=> this.addStore(item)}
          title={item.name+"\t(closed)"}
          titleStyle={{color: variables.textRedflat}}
          accessory={()=>{return (<Radio checked={item.selected}/>)}}
        />
      );
    }
    else{
      return (
        <ListItem 
          onPress={()=> this.addStore(item)}
          title={item.name}
          accessory={()=>{return (<Radio checked={item.selected}/>)}}
        />
      );
    }
  }

  render() {
    const { showdata, spinner} = this.state;
    return (
      <Layout style={{ flex: 1 }}>
      <Header style={{ backgroundColor: variables.headerBGPrimary }}>
        <Left>
          <Button transparent onPress={() => this._onGoback()}>
          <Icon
            style={{ color: variables.mainColor }}
            name="arrow-round-back"
          />
          </Button>
        </Left>
        <Body>
          <Title style={{ color: variables.mainColor }}>สมัครสมาชิก</Title>
        </Body>
        <Right />
      </Header>
      <Layout style={{ flex: 1, justifyContent: "center", margin: 10 }}>
        {(spinner)? 
        <Card style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Spinner/>
        </Card>: 
        <Card>
          <Input
            selectTextOnFocus={true}
            icon={(style)=>{return (<KittenIcon { ...style } name='search'/>)}}
            value={this.state.searchterm}
            onChangeText={text => this.searchFilterFunction(text)}
            placeholder="ค้นหา"
          />
          <List
            style={{ height: Dimensions.get('window').height/3, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
            data={showdata}
            renderItem={this.renderItem}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            keyExtractor={item => item.name}
          />
          <KittenButton
            block
            style={{ margin: 30 }}
            disabled={this.state.shouldDisablePostButton}
            onPress={this.CheckTextInput}
            >
            ยืนยัน
          </KittenButton>
        </Card>}
      </Layout>
      </Layout>
    );
  }
}

export default Register8;
