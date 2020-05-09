import React, { Component } from "react";
import {
  Item,
  Text,
  Toast,
  Left,
  Right
} from "native-base";
import {
  Layout,
  Card,
  Select,
  Spinner,
  List,
  Icon,
  Input,
  ListItem 
} from '@ui-kitten/components';
import { TouchableOpacity,StatusBar, Dimensions, Keyboard } from 'react-native';
import variables from "../../../theme/variables/commonColor";
import { getSalesman, formatMoney } from "../../../globalfunc";
import Header_Admin from "../../../theme/compontent/header_admin";
import SwipeablePanel from "../../../theme/compontent/swipeable/Panel";
import {AUTHEN_POST} from "../../../api/restful";
import { connect } from 'react-redux';
import styles from "./styles";
import moment from 'moment';

class SalesClient extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        swipeablePanelActive: false,
        store:null,
        selected: {'emp_id':'All', 'text':'ลูกค้าทั้งหมด'},
        selector:[],
        act:null,
        active:0,
        inactive:0,
        activebg:'rgba(46, 204, 113,0.5)',
        inactivebg:'rgba(192, 57, 43,0.5)',
        showdata:null,
        saleman:[],
        data :[]
    };
  }

  componentDidMount() {
    //this.openPanel();
    let store = [];
      this.props.store.forEach(element=>{
        if(element.selected){
          element.store.forEach(item =>{
            store.push(item);
          })
        }
      });
    getSalesman(store,(data)=>{
      let temp = [];
      temp.push({
        'emp_id':'All',
        'text':'ลูกค้าทั้งหมด'
      });
      data.forEach(item =>{
        temp.push({
          'emp_id':item.emp_id,
          'text':item.firstname + " " + item.lastname
        })
      });
      this.setState({
        selector:temp,   
        store:store,
        selected:temp[0],
        saleman:temp},()=>{
          this.__getSalesClient(temp[0]);
        });
      });
  }

  componentDidUpdate(prevProps){
    if(prevProps.selectedStore != this.props.selectedStore && this.props.selectedStore!=null){
      let store = [];
      this.props.store.forEach(element=>{
        if(element.selected){
          element.store.forEach(item =>{
            store.push(item);
          })
        }
      });
      getSalesman(store,(data)=>{
        let temp = [];
        temp.push({
          'emp_id':'All',
          'text':'ลูกค้าทั้งหมด'
        });
      data.forEach(item =>{
        temp.push({
          'emp_id':item.emp_id,
          'text':item.firstname + " " + item.lastname
        })
      });
        this.setState({        
        store:store,
        selected:temp[0],
        saleman:temp},()=>{
          this.__getSalesClient(temp[0]);
        });
      });
    }
    if(prevProps.reload != this.props.reload){
      let store = [];
      this.props.store.forEach(element=>{
        if(element.selected){
          element.store.forEach(item =>{
            store.push(item);
          })
        }
      });
      getSalesman(store,(data)=>{
        let temp = [];
        temp.push({
          'emp_id':'All',
          'text':'ลูกค้าทั้งหมด'
        });
      data.forEach(item =>{
        temp.push({
          'emp_id':item.emp_id,
          'text':item.firstname + " " + item.lastname
        })
      });
        this.setState({     
        store:store,    
        selected:temp[0],
        saleman:temp},()=>{
          this.__getSalesClient(temp[0]);
        });
      });
    }
  }

  handleClick = (item) =>{
    this.props.navigation.navigate("clientDetail",{Lastorder:item.Lastorder,CustName:item.AccountNameTH,CVNumber:item.CVNumber,route:"SalesClient"});
  }

  handleSalePicked = SaleCode => {
    this.setState({selected:SaleCode},()=>{
       this.__getSalesClient(this.state.selected);
    });
  };

  __getSalesClient = async (value)=>{
      this.setState({
        showdata:null,
        activebg:'rgba(46, 204, 113,0.5)',
        inactivebg:'rgba(192, 57, 43,0.5)',
        act:null,
        active:0,
        inactive:0,
        data:null,
        searchterm:null}); 
      let body = {
        SaleCode:value.emp_id,
        adm_store:this.state.store
      }
    AUTHEN_POST('/client/saleClient', body)
      .then(async (response)=>{
        if(response.data.length > 0){
          let active = 0, inactive = 0;
          response.data.forEach(element => {
            let calldate = new Date().getTime() - new Date(element.Lastorder).getTime();
            calldate = Math.floor((calldate / 1000) / (60 * 60));
            calldate /= 24;
            if(calldate < 30){
              active++;
              element.active = 1;
            }else{
              inactive++;
              element.active = 0;
            }
          });
          if(this.state.selected.emp_id == 'All'){
            response.data.sort((a,b) => new Date(a.Lastorder) - new Date(b.Lastorder));
            let temp = [{AccountNameTH:"ลูกค้า",net:"ออเดอร์ล่าสุด",header:true}].concat(response.data);
            this.setState({
              showdata:temp,
              data:response.data,
              active:active,
              inactive:inactive
            });
          }else{
            response.data.sort((a,b) => new Date(b.outstanding) - new Date(a.outstanding));
            let temp = [{AccountNameTH:"ลูกค้า",net:"ยอดค้างชำระ",header:true}].concat(response.data);
            this.setState({
              showdata:temp,
              data:response.data,
              active:active,
              inactive:inactive
            });
          }
       }
     })
      .catch((error)=>{
        Toast.show({text:error,type:'danger'});
    });
  }

  searchFilterFunction = (text) =>{
    this.setState({searchterm:text.toLowerCase()});
    const newData = this.state.data.filter(item => {      
      let itemData;
        itemData = `${item.AccountNameTH} ${item.CVNumber} `;
       const textData = text;
       if(this.state.act != null){
        if(item.active == this.state.act)
          return itemData.indexOf(textData) > -1;}
       else
        return itemData.indexOf(textData) > -1;
    });
    let temp = [];
    if(this.state.selected.emp_id == 'All'){
      temp = [{AccountNameTH:"ลูกค้า", net:"ออเดอร์ล่าสุด", header:true}].concat(newData);
    }else{
      temp = [{AccountNameTH:"ลูกค้า", net:"ยอดค้างชำระ", header:true}].concat(newData);
    }    
    this.setState({ showdata:  temp});
  }

  setActive = (act) =>{
    if(act == 0){
      this.setState({
        activebg:'rgba(149, 165, 166,0.3)',
        inactivebg:'rgba(192, 57, 43,0.5)',
      });
    }else{
      this.setState({
        activebg:'rgba(46, 204, 113,0.5)',
        inactivebg:'rgba(149, 165, 166,0.3)',
      });
    }
    this.setState({
      act:act,
      searchterm:null});
    const newData = this.state.data.filter(item => {      
      const itemData = 
      `${item.active} `;
       return itemData.indexOf(act) > -1;    
    });
    let temp = [];
    if(this.state.selected.emp_id == 'All'){
      temp = [{AccountNameTH:"ลูกค้า",net:"ออเดอร์ล่าสุด",header:true}].concat(newData);
    }else{
      temp = [{AccountNameTH:"ลูกค้า",net:"ยอดค้างชำระ",header:true}].concat(newData);
    }
    this.setState({ showdata: temp });
 }

renderCustomer = ({ item }) => {
  if(item.header){
    return (
      <ListItem 
        key={item.AccountNameTH}
        title={`${item.AccountNameTH} `}
        titleStyle={{color:variables.textUnit, fontWeight:'bold', fontSize:12}}
        accessory={()=>{return (<Text style={{ color:variables.textUnit, fontWeight:'bold', fontSize:12}}> {item.net} </Text>)}}
      />
    );
  }
  else if(this.state.selected.emp_id == 'All')
  return (
    <ListItem 
      key={item.AccountNameTH}
      onPress={() => this.handleClick(item)}
      title={`${item.AccountNameTH} `}
      titleStyle={{color:variables.textUnit, fontWeight:'bold', fontSize:12}}
      description={`${item.Salesman} `}
      accessory={()=>{if(item.active == 0) return (<Text style={{ color:variables.textRedflat, fontWeight:'bold', fontSize:12}}> {moment(item.Lastorder).format("DD-MMM-YYYY")} </Text>) 
      else return (<Text style={{ color:variables.textPrimary, fontWeight:'bold', fontSize:12}}> {moment(item.Lastorder).format("DD-MMM-YYYY")} </Text>)}}
    />
  );
  else
  return (
    <ListItem 
      key={item.AccountNameTH}
      onPress={() => this.handleClick(item)}
      title={`${item.AccountNameTH} `}
      titleStyle={{color:variables.textUnit, fontWeight:'bold', fontSize:12}}
      description={`${item.Salesman} `}
      accessory={()=>{if(item.outstanding > 0 ) return (<Text style={{ color:variables.textRedflat, fontWeight:'bold', fontSize:12}}> {formatMoney(item.outstanding)} </Text>) 
    else return (<Text style={{ color:variables.textPrimary9, fontWeight:'bold', fontSize:12}}> 0 </Text>)}}
  />
  );
};

openPanel = () => {
  this.setState({ swipeablePanelActive: true });
};

closePanel = () => {
  this.setState({ swipeablePanelActive: false });
};

render() {
    const {showdata, selected, active, inactive , searchterm} = this.state;
    return (
      <Layout style={{flex:1}}>
      <StatusBar barStyle="light-content" />
      <Header_Admin navigation={this.props.navigation}/>
        {(showdata != null) ?
        <Card style={{flex:1}}>
          <Select
            data={this.state.selector}
            style={{width:Dimensions.get("window").width/1.15, alignSelf:'flex-start', borderWidth:0}}
            labelStyle={{backgroundColor:variables.bgPrimary}}
            textStyle={{fontSize:12, color:variables.textPrimary}}
            selectedOption={selected}
            onSelect={(value)=>{this.handleSalePicked(value)}}
        />
      <TouchableOpacity style={[styles.active, {backgroundColor: this.state.activebg}]} underlayColor={variables.borderPrimary} onPress={()=>{this.setActive(1)}}>
            <Left>
                <Text style={{fontWeight:'bold', color: variables.textUnit, fontSize:15 }}>  Active :</Text>
            </Left>
            <Right>
              <Item style={{borderBottomWidth:0}}>
                <Text style={{marginRight: 10, color: variables.textPrimary, fontSize:15  }} >{active}</Text>
                <Text style={{marginRight:10, color: variables.textUnit, fontSize:15  }}> ราย</Text>
              </Item>
            </Right>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.inactive, {backgroundColor: this.state.inactivebg}]} underlayColor={variables.borderPrimary} onPress={()=>{this.setActive(0)}}>
            <Left>
                <Text style={{fontWeight:'bold', color: variables.textUnit, fontSize:15 }}>  Inactive :</Text>
            </Left>
            <Right>
              <Item style={{borderBottomWidth:0}}>
                <Text style={{marginRight: 10, color: variables.textPrimary, fontSize:15  }} >{inactive}</Text>
                <Text style={{marginRight:10, color: variables.textUnit, fontSize:15  }}> ราย</Text>
              </Item>
            </Right>
      </TouchableOpacity>
          <Input
                selectTextOnFocus={true} 
                icon={(style)=>{return (<Icon { ...style } name='search'/>)}}
                value={searchterm}
                onChangeText={text => this.searchFilterFunction(text)}
                style={{marginTop:20}}
                placeholder="ค้นหา" />
          <List
                style={{height:Dimensions.get("window").height/1.9,backgroundColor:variables.bgPrimary}}
                data={this.state.showdata}
                renderItem={this.renderCustomer}
                keyExtractor={item => item.AccountNameTH}
                stickyHeaderIndices={[0]}
                windowSize={5}
                initialListSize={8}
                initialNumToRender={8}
                onScrollBeginDrag={() => Keyboard.dismiss()}
              />
        </Card>
        : <Card style={{flex:1,justifyContent:'center', alignItems:'center'}}><Spinner /></Card>}
        <SwipeablePanel
          fullWidth
          isActive={this.state.swipeablePanelActive}
          onClose={this.closePanel}
          onPressCloseButton={this.closePanel}
        >
          <Spinner color={variables.Maincolor} />
        </SwipeablePanel>
      </Layout>
    );
  }
}

let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    token:state.userReducer.token,
    store:state.userReducer.store,
    selectedStore:state.userReducer.selectedStore,
    reload:state.userReducer.reload
  }
}

export default connect(
  mapStateToProps
)(SalesClient);