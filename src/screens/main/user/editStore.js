import { Container, Spinner, Button, Text, ListItem, Radio, Header, Title, Icon, Left, Right, Body, Item, Input, Card } from "native-base";
import variables from "../../../theme/variables/commonColor";
import { StatusBar, View, FlatList, Keyboard} from 'react-native';
import { getAllStores } from "../../../globalfunc";
import { AUTHEN_PUT } from "../../../api/restful";
import React, { Component } from "react";

class editStore extends React.PureComponent {
  static navigationOptions = {
    drawerLockMode: 'locked-closed'
  };

  inputs = {};
  constructor(props){
    super(props);
    this.state = {
      data:null,
      radio1: false,
      radio2: false,
      store_id:null,
      store_name:null,
      shouldDisablePostButton: true,
      spinner:false,
      stores:null,
      showdata:null,
      searchterm:null,
      selected_store:[],
      route:null
    };
  }

  componentDidMount() {
    this.setState({
      shouldDisablePostButton:true,
      data:this.props.navigation.getParam('data'),
      route:this.props.navigation.getParam('route'),
      selected_store:this.props.navigation.getParam('data').admin_store
    },()=>{
      getAllStores((data)=>{
        this.setState({
          showdata:data,
          stores:data
        },()=>{
          for(let i=0;i<this.state.showdata.length;i++){ 
          this.state.selected_store.find((item,j)=>{
            if(item == this.state.showdata[i].store_id){
              this.state.showdata[i].selected = true;
              return;
            }
          })
         }
         this.state.showdata.sort(function(x, y) {return (x.selected === y.selected)? 0 : x.selected? -1 : 1});
        });
      });
    });
  }

  CheckTextInput = async () => {
    this.setState({spinner:true});
      let body = {
        old_emp_id:this.state.data.emp_id,
        admin_store:this.state.selected_store
      }
      AUTHEN_PUT('/user/updateUser', body)
      .then(async response => {
        this.setState({spinner:false});
        if(response.data.body){
          this.props.navigation.navigate(this.state.route);
        }
        else{
          Toast.show({text:"error, try again",type:'danger'});
        }
      }).catch(()=>{
        this.setState({spinner:false});
        Toast.show({text:"error, try again",type:'danger'});});   
  };

  addStore = (store) =>{
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

  renderItem= ({item}) =>{
    if(item.status=="closed"){
      return (
        <ListItem  onPress={()=> this.addStore(item)} >
            <Left>
                <Text style={{fontSize:14,color:"#c0392b"}}>{item.name+"\t(closed)"}</Text>
            </Left>
            <Right>
                <Radio selected={item.selected} onPress={()=> this.addStore(item)} />
            </Right>
        </ListItem>
      );
    }
    else{
      return (
        <ListItem  onPress={()=> this.addStore(item)} >
          <Left>
              <Text style={{fontSize:14}}>{item.name}</Text>
          </Left>
          <Right>
              <Radio selected={item.selected} onPress={()=> this.addStore(item)} />
          </Right>
        </ListItem>
      );
    }
  }

  render() {
    const {spinner,showdata} = this.state;
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
                  <Title style={{ color:variables.headerTextPrimary}}>สาขาที่ดูแล</Title> 
              </Body>
            <Right />
      </Header>
      {(!spinner) ?
        <Card style={{flex:3, justifyContent:'center', margin:10}}>
           <Item style={{margin:10,marginLeft:10 }} rounded>
              <Input
                selectTextOnFocus={true} 
                value={this.state.searchterm}
                onChangeText={text => this.searchFilterFunction(text)}
                style={{textAlign:'center', fontSize:15 , height:30}} placeholder="ค้นหา" >
              </Input>
            </Item>
                <FlatList
                    style={{height:300, margin:10, alignSelf: 'stretch'}}
                    data={showdata}
                    renderItem={this.renderItem}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                    keyExtractor={item => item.name}/>
              <Button 
                  block style={{ margin: 30}}
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.CheckTextInput}>
                  <Text>SAVE</Text>
              </Button>
              </Card> : 
              <View style={{flex:1,justifyContent:'center'}}><Spinner color={variables.Maincolor} /></View>}
      </Container>
    );
  }
}

export default editStore;
