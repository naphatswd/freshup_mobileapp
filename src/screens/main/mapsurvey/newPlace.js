import { Container, Text, Header, Title, Left, Right,  Form, Item, Label, Input, Icon, ListItem, Body, Segment, Button } from "native-base";
import { StatusBar, View, TouchableOpacity, Dimensions, Alert, Platform, Keyboard} from "react-native";
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { FlatList } from "react-native-gesture-handler";
import { GiftedChat } from "react-native-gifted-chat";
import SocketContext from '../../../socket-context';
import { FlatGrid } from 'react-native-super-grid';
import { AUTHEN_POST } from '../../../api/restful'
import React, { Component } from "react";
import { connect } from 'react-redux';

let Types = [{label:"ที่พัก", value:"Hotel (โรงแรม/ที่พัก)"},{label:"โรงพยาบาล", value:"Hospital (โรงพยาบาล)"},
             {label:"ร้านอาหาร", value:"Restaurants (ร้านอาหาร)"},{label:"แผงตลาด", value:"Wet Market (ตลาดสด)"},{label:"โรงเรียน", value:"School (โรงเรียน)"}];

class NewPlace extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
        emp_id:null,
        location:this.props.navigation.getParam('latlon'),
        route:this.props.navigation.getParam('route'),
        navigation:this.props.navigation,
        newPlace:{
            Name:"",
            Type:"",
            Supplier:"",
            Latitude:this.props.navigation.getParam('latlon').latitude,
            Longitude:this.props.navigation.getParam('latlon').longitude
        },
        client:[],
        itemShow:[],
        messages: [],
        searchterm:null,
        seg:1
      };
  }

  componentDidMount = async () => {
    this.setState({emp_id:this.props.emp_id});
    let item = [];
        this.props.store.map(element => {
          if(element.selected){
            item = element.store;
            return;
          }
        });
        this.setState({
            store:item},()=>{
            this.getCVName();
        });
  }

  getCVName = ()=>{
    let {store} = this.state;
    let body = {
      store_id:store
    }
    AUTHEN_POST('/cvname/cvname',body)
    .then(async (response)=>{
      if(response.data.length>0){
          this.setState({client:response.data,itemShow:response.data});
      }else{
        this.setState({client:[]});
      }
    })
    .catch(e =>{
        this.setState({client:[]});
   });
  }

  renderItem = ({ item, index }) => {
    switch(item.value) {
      case 'Hotel (โรงแรม/ที่พัก)':
        item.color = "#2980b9";
        item.Icon = "home"
          break;
      case 'Hospital (โรงพยาบาล)':
        item.color = "#c0392b";
        item.Icon = "heart"
          break;
      case 'Wet Market (ตลาดสด)':
        item.color = "#2c3e50";
        item.Icon = "basket"
          break;
      case 'Restaurants (ร้านอาหาร)':
        item.color = "#e67e22";
        item.Icon = "restaurant"
          break;
      case 'School (โรงเรียน)':
        item.color = "#27ae60";
        item.Icon = "school"
          break;
      default:
        item.color = "#c0392b";
        item.Icon = "home"
          break;           
    }
      return (
        <View style={{flex:1,alignSelf:'center'}}>
            <TouchableOpacity style={{alignItems:'center'}} onPress={()=>{this.onChangeType(item)}}>
            {(item.value == this.state.newPlace.Type)?  
            <Icon name={item.Icon} style={{color: item.color}}/>: 
            <Icon name={item.Icon} style={{color: variables.grayScale}}/>}
            {(item.value == this.state.newPlace.Type)?  
            <Text style={{textAlign:'center',marginTop:5,fontSize:12, color:item.color, fontWeight:'bold'}}>{item.label}</Text>: 
            <Text style={{textAlign:'center',marginTop:5,fontSize:12, color:variables.grayScale, fontWeight:'bold'}}>{item.label}</Text>}
            </TouchableOpacity>
        </View>
      )
  };

  renderFlatList = ({item}) => {
      return (
          <ListItem
            style={{ borderBottomWidth: 0 }}
            button={true}
            onPress={() => {
              this.onSelected(item);
            }}
          >
            <Body>
              <View
                style={{ flex: 1, flexDirection: "row" }}
                underlayColor={variables.borderPrimary}>
                  <Text style={{ fontSize: 12, color: variables.textTrinary }}>
                    {item.CVNumber} | {item.Name}
                  </Text>
              </View>
            </Body>
          </ListItem>
      );
  };

  renderSupplier = ({item}) =>{
    return (
      <View style={{flex:1,alignSelf:'center', }}>
          <TouchableOpacity style={{alignItems:'center'}} onPress={()=>{this.onSupplierChange(item);}}>
            {(item.value == this.state.newPlace.Supplier)? 
                <Text style={{textAlign:'center',marginTop:5,fontSize:12, color:variables.textPrimary, fontWeight:'bold'}}>{item.value}</Text>:
                <Text style={{textAlign:'center',marginTop:5,fontSize:12, color:variables.grayScale, fontWeight:'bold'}}>{item.value}</Text>
            } 
          </TouchableOpacity>
      </View>
    );
  };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),()=>{
        let newPlace = this.state.newPlace;
            newPlace.Description = this.state.messages;
        this.setState({
            newPlace:newPlace
        },()=>{
            this.setState({newPlace:newPlace},()=>{
                this.onCheckReady()
            });
        });
    })
  }

  searchFilterFunction = (text) =>{
    this.setState({searchterm:text.toLowerCase()});
    const newData = this.state.client.filter(item => {      
      const itemData = 
      `${item.CVNumber} ${item.Name}`;
       const textData = text;
       return itemData.indexOf(textData) > -1;    
    });    
    this.setState({ itemShow: newData });
  }

  onSelected = (item) =>{
    Alert.alert(
      'ยืนยัน อัพเดท CV?',
      item.CVNumber+" | "+item.Name,
      [
        {
          text: 'ปิด',
          style: 'cancel',
        },
        {text: 'ยืนยัน', onPress: () => {
          let body={
            CVNumber:item.CVNumber,
            Name:item.Name,
            Type:item.Type,
            Latitude:this.state.location.latitude,
            Longitude:this.state.location.longitude,
            Supplier:"CP"
          };
         AUTHEN_POST('/clientLead/NewPlaceCP',body)
          .then(async (response)=>{
          })
          this.state.navigation.navigate(this.state.route,{refresh:true});
        }},
      ],
      {cancelable: false},
    )
  }

  onSupplierChange = (item) =>{
    let newPlace = this.state.newPlace;
      newPlace.Supplier = item.value;
      this.setState({
        newPlace:newPlace
      },()=>{
          this.onCheckReady();
      });
  }

  onChangeName = (item) =>{
      let newPlace = this.state.newPlace;
      newPlace.Name = item;
      this.setState({
        newPlace:newPlace
      },()=>{
          this.onCheckReady();
      });
  }

  onChangeType = (item)=>{
    let newPlace = this.state.newPlace;
    newPlace.Type = item.value;
    this.setState({
        newPlace:newPlace
      },()=>{
          this.onCheckReady();
      });
  }

  onCheckReady = ()=>{
      const {newPlace} = this.state;
      if(newPlace.Name != "" && newPlace.Type != "" && newPlace.Supplier != ""){
        this.setState({showSend:true})
      }else{
        this.setState({showSend:false})
      }
  }

  PostNewPOI =()=>{
    AUTHEN_POST('/clientLead/NewPlace',this.state.newPlace)
    .then(async (response)=>{
    })
    this.state.navigation.navigate(this.state.route,{refresh:true});
  }

  render(){
      const {newPlace, seg, itemShow, emp_id, showSend} = this.state;
      return(
        <Container  padder>
            <StatusBar barStyle="light-content" />
            <Header style={{backgroundColor:variables.headerBGPrimary}}>
            <Left style={{flexDirection:'row',position:"relative" }}>
              <View style={{alignSelf: 'stretch'}}>
              <Button transparent onPress={() => this.state.navigation.navigate(this.state.route)} >
                <Icon style={{ color:variables.headerTextPrimary}} name="arrow-round-back" />
              </Button>
              </View>
              <View style={{alignSelf: 'stretch',justifyContent:'center'}}>
                <Title style={{ color:variables.headerTextPrimary}} >เพิ่มสถานที่</Title> 
              </View>
            </Left>
            <Right >
                {(showSend)? 
                <Button transparent onPress={() => this.PostNewPOI()} >
                    <Icon style={{ color:variables.headerTextPrimary}} name="send" />
                </Button>:null}
            </Right>
          </Header>
            <View style={{flex:1, backgroundColor:variables.bgPrimary}}>
            <Segment style={{backgroundColor:variables.bgPrimary}}>
            <Button
                first
                active={this.state.seg === 1 ? true : false}
                onPress={() => this.setState({ seg: 1 })}
              >
                <Text>เพิ่มสถานที่</Text>
              </Button>
              <Button
                active={this.state.seg === 2 ? true : false}
                last
                onPress={() => this.setState({ seg: 2 })}
              >
                <Text>มี CV อยู่แล้ว</Text>
              </Button>
            </Segment>
            {(seg === 1) ? 
            <View style={{flex:1}}>
            <Form style={{width:Dimensions.get('window').width/1.1,alignSelf:'center'}}>
                <Item floatingLabel style={{ borderColor:variables.borderGreen }}>
                    <Label style={{fontSize:12}}> <Icon style={{fontSize:16}} name='home'/> Name</Label>
                    <Input
                        style={{fontSize:16}}
                        autoCapitalize= 'none'
                        value={newPlace.Name}
                        onChangeText={(text)=>{this.onChangeName(text)}} 
                        blurOnSubmit={ false } />
                </Item>
                <Item style={{ borderColor:variables.borderGreen }}>
                    <Label style={{fontSize:12}}> <Icon style={{fontSize:16}} name='cube' /> Category</Label>
                    <FlatGrid
                        style={{marginTop:10}}
                        itemDimension={60}
                        items={Types}
                        renderItem={this.renderItem}
                    />
                </Item>
                <Item style={{ borderColor:variables.borderGreen }}>
                    <Label style={{fontSize:12}}> <Icon style={{fontSize:16}} name='pulse' /> Supplier</Label>
                    <FlatGrid
                      style={{marginTop:10}}
                      itemDimension={60}
                      items={[{value:"Betagro"},{value:"Other"}]}
                      renderItem={this.renderSupplier}
                    />
                </Item>
              </Form>
              <View style={{flex: 1,marginLeft:10,marginRight:10}}>
                <Label style={{fontSize:12,marginTop:10,marginLeft:20}}> <Icon style={{fontSize:16}} name='bookmark' /> Description</Label>
                <GiftedChat
                    renderUsernameOnMessage={true}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: emp_id,
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
              </View>
              </View>:
              <View style={{flex:1}}>
                <View style={{width:Dimensions.get('window').width/1.1,marginLeft:20}}> 
                <Item>
                    <Icon active name="search" style={{color:variables.mainColor}}/>
                    <Input
                     selectTextOnFocus={true} 
                     onChangeText={text => this.searchFilterFunction(text)}
                     placeholder="ค้นหาที่นี่"></Input>
                </Item>
                <FlatList
                  style={{margin:5}}
                  data={itemShow}
                  keyExtractor={item => item.CVNumber}
                  onScrollBeginDrag={() => Keyboard.dismiss()}
                  renderItem={this.renderFlatList}
                />
                </View>
              </View>}
            </View>
          </Container>
      );
  }
}

const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <NewPlace {...props} socket={socket} />}
  </SocketContext.Consumer>
)
let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    store:state.userReducer.store,
    selectedStore:state.userReducer.selectedStore
  }
}
export default connect(
  mapStateToProps
)(socketcontext);