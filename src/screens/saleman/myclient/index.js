import React, { Component } from "react";
import {
  Container,
  Item,
  Text,
  Body,
  View,
  Toast,
  Card,
  CardItem,
  Left,
  Right
} from "native-base";
import {
  Spinner,
  List,
  Icon,
  Input,
  ListItem 
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import Header_Sale from "../../../theme/compontent/header_sale";
import { formatMoney } from "../../../globalfunc";
import {TouchableOpacity, StatusBar, Keyboard} from 'react-native';
import { connect } from 'react-redux';
import styles from "./styles";
import {AUTHEN_GET} from "../../../api/restful";

class MyClient extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        act:null,
        active:0,
        activebg:'rgba(46, 204, 113,0.5)',
        inactivebg:'rgba(192, 57, 43,0.5)',
        inactive:0,
        showdata:null,
        data :[]
    };
  }

  componentDidMount(){
    this.__getMyClient();
  }

  componentDidUpdate(prevProps){
    if(prevProps.reload != this.props.reload){
      this.__getMyClient();
    }
  }

  handleClick = (item) =>{
    this.props.navigation.navigate("clientDetail",{Lastorder:item.Lastorder,CustName:item.AccountNameTH,CVNumber:item.CVNumber,route:"MyClient"});
  }

  __getMyClient = async ()=>{
    this.setState({
      showdata:null,
      activebg:'rgba(46, 204, 113,0.5)',
      inactivebg:'rgba(192, 57, 43,0.5)',
      act:null,
      active:0,
      inactive:0,
      data:null});
      AUTHEN_GET('/client/myClient')
      .then(async (response)=>{
        if(response.data.length > 0){
          response.data.sort((a,b) => new Date(b.outstanding) - new Date(a.outstanding));
          let active = 0, inactive = 0;
          response.data.forEach(element => {
            let calldate =new Date().getTime() - new Date(element.Lastorder).getTime();
            calldate = Math.floor((calldate / 1000) / (60 * 60));
            calldate/=24;
            if(calldate<30){
              active++;
              element.active = 1;
            }else{
              inactive++;
              element.active = 0;
            }
          });
          let temp = [{AccountNameTH:"ลูกค้า",net:"ยอดขาย",header:true}].concat(response.data);
          this.setState({
              showdata:temp,
              data:response.data,
              active:active,
              inactive:inactive
          });
         }else{
           this.setState({process:"ไม่มีข้อมูล"});
         }
      })
      .catch((error)=>{
        this.setState({process:null});
        Toast.show({text:error,type:'danger'});
      })
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
    let temp = [{AccountNameTH:"ลูกค้า",net:"ยอดขาย",header:true}].concat(newData);
    this.setState({ showdata: temp });
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
    let temp = [{AccountNameTH:"ลูกค้า",net:"ยอดขาย",header:true}].concat(newData);
    this.setState({ showdata: temp });
  }

  renderCustomer = ({ item }) => {
    if(item.header){
      return (
        <ListItem
          key={item.AccountNameTH} 
          title={"ลูกค้า"}
          titleStyle={{color:variables.textUnit, fontWeight:'bold', fontSize:12}}
          accessory={()=>{return (<Text style={{ color:variables.textUnit, fontWeight:'bold', fontSize:12}}> {"ยอดค้าง"} </Text>)}}
        />
      );
    }
    else
    return (
      <ListItem 
        key={item.AccountNameTH}
        onPress={() => this.handleClick(item)}
        title={`${item.AccountNameTH} `}
        titleStyle={{color:variables.textUnit, fontWeight:'bold', fontSize:12}}
        description={`${item.CVNumber} `}
        accessory={()=>{if(item.outstanding > 0 ) return (<Text style={{ color:variables.textRedflat, fontWeight:'bold', fontSize:12}}> {formatMoney(item.outstanding)} </Text>) 
        else return (<Text style={{ color:variables.textPrimary9, fontWeight:'bold', fontSize:12}}> 0 </Text>)}}
      />
    );
  };

  render() {
    const {showdata, active, inactive, searchterm} = this.state;
    return (
      <Container >
      <StatusBar barStyle="light-content" />
      <Header_Sale navigation={this.props.navigation}/>
        <View style={{flex:3}} padder>
        {(showdata != null) ?
        <View style={{flex:3}}>
        <Card>
        <CardItem>
          <Body>
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
      </Body>
        </CardItem>
      </Card>
      <Card style={{flex:1}}>
        <Input
          selectTextOnFocus={true} 
          icon={(style)=>{return (<Icon { ...style } name='search'/>)}}
          value={searchterm}
          onChangeText={text => this.searchFilterFunction(text)}
          style={{marginLeft:20, marginRight:20, marginTop:20}}
          placeholder="ค้นหา" />
        <List
          style={{backgroundColor:variables.bgPrimary}}
          data={this.state.showdata}
          renderItem={this.renderCustomer}
          keyExtractor={item => item.AccountNameTH}
          stickyHeaderIndices={[0]}
          onScrollBeginDrag={() => Keyboard.dismiss()} />
        </Card>
        </View>
         : <Card style={{flex:3,justifyContent:'center', alignItems:'center'}}><Spinner /></Card>}
      </View>
      </Container>
    );
  }
}

let mapStateToProps = state => {
  return {
    reload:state.userReducer.reload
  }
}

export default connect(
  mapStateToProps
)(MyClient);