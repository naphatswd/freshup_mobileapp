import { Button, Header, Title, Icon, Left, Right, Body } from "native-base";
import { List, ListItem, Spinner, Radio, Layout, Icon as KittenIcon, Card, Input, Button as KittenButton} from "@ui-kitten/components";
import variables from "../../../theme/variables/commonColor";
import { Dimensions, Keyboard } from 'react-native';
import { getAllStores } from "../../../globalfunc";
import React, { Component } from "react";

class group1 extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected:(this.props.navigation.state.params.data.selected)? true:false,
      groupname:(this.props.navigation.state.params.data != "") ? this.props.navigation.state.params.data.name : null,
      shouldDisablePostButton: (this.props.navigation.state.params.data != "")? false:true,
      spinner:false,
      stores:null,
      showdata:null,
      searchterm:null,
      selected_store:(this.props.navigation.state.params.data != "") ? this.props.navigation.state.params.data.store : []
    };
  }

  componentDidMount() {
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
  }
  
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

  submitGroup = async () => {
    let body = {
        name:this.state.groupname,
        store:this.state.selected_store,
        selected:this.state.selected
    };
    this.props.navigation.navigate("Group2", {data:body,index:this.props.navigation.state.params.index});  
  };

  renderItem= ({item}) =>{
    if(item.status=="closed"){
      return (
        <ListItem 
          onPress={()=> this.addStore(item)}
          title={item.name+"\t(closed)"}
          titleStyle={{color: variables.textRedflat}}
          accessory={()=>{return (<Radio checked={item.selected} onChange={()=> this.addStore(item)}/>)}}
        />
      );
    }
    else{
      return (
        <ListItem 
          onPress={()=> this.addStore(item)}
          title={item.name}
          accessory={()=>{return (<Radio checked={item.selected} onChange={()=> this.addStore(item)}/>)}}
        />
      );
    }
  }

  render() {
    const {spinner,showdata} = this.state;
    return (
      <Layout style={{ flex: 1 }}>
        <Header style={{backgroundColor:variables.headerBGPrimary}}>
            <Left>
              <Button transparent onPress={()=>{this.props.navigation.goBack();}} >
                <Icon style={{ color:variables.mainColor}} name="arrow-round-back" />
              </Button>
            </Left>
              <Body>
                  <Title style={{ color:variables.mainColor}}>สาขาที่ดูแล</Title> 
              </Body>
            <Right />
      </Header>
      {(!spinner) ?
        <Card style={{flex:1}}>
              <Input
                selectTextOnFocus={true}
                icon={(style)=>{return (<KittenIcon { ...style } name='search'/>)}}
                value={this.state.searchterm}
                onChangeText={text => this.searchFilterFunction(text)}
                placeholder="ค้นหา"/>
                <List
                    style={{ height: Dimensions.get('window').height/1.5, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
                    data={showdata}
                    renderItem={this.renderItem}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                    keyExtractor={item => item.name}/>
              {(this.state.shouldDisablePostButton)? null:
              <KittenButton 
                  disabled={this.state.shouldDisablePostButton}
                  onPress={this.submitGroup}>
                  ยืนยัน
              </KittenButton>}
              </Card> : 
              <Layout style={{flex:1, alignItems:'center',justifyContent:'center'}}><Spinner /></Layout>}
      </Layout>
    );
  }
}

export default group1;
