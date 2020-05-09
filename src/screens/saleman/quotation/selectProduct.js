import { Container, Button, Icon as NativeIcon, Header, Title, Left, Right, Body } from "native-base";
import React_Native, { StatusBar, View, Alert } from 'react-native';
import {
  ListItem,
  Spinner,
  ButtonGroup,
  Card,
  Icon,
  Input,
  Text,
  Select,
  Button as KittenButton,
  List
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import { StackActions } from 'react-navigation';
import {AUTHEN_POST} from "../../../api/restful";
import React from "react";

const { Dimensions } = React_Native;

class Selectproduct extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      loading:false,
      um_selected:{text:'กิโลกรัม'},
      product_data:null,
      quantity:0,
      price:0,
      cost:0,
      GP:0,
      data:[],
  };
 }

 componentDidMount(){
   this.__fetchPrice();
 }

  __fetchPrice = () =>{
    this.setState({loading:true});
    let body={
      ProductCode:this.props.navigation.state.params.productCode,
      classprice:this.props.navigation.state.params.data.CustomerPrice
    }
    AUTHEN_POST('/product/getProductByClassPrice', body)
      .then((response)=>{
        if(response.data != undefined){
          let umcode = [];
          if(response.data.Cost != undefined){
            response.data.Cost.forEach(item =>{
              umcode.push({
                text:item.UM_Thai,
                cost:item.GROSS_COST,
                value:item.UM_CODE
              });
            });
            if(response.data.price != undefined){
              let idk =-1;
              response.data.price.find((element,i) =>{
                if(element.UM_CODE == response.data.Cost[0].UM_CODE){
                  idk = i;
                  return;
                }
              });
              this.setState({
                loading:false,
                product_data:response.data,
                um_selected:{text:response.data.Cost[0].UM_Thai, value:response.data.Cost[0].UM_CODE},
                cost:response.data.Cost[0].GROSS_COST,
                price:(idk >-1)?  parseInt(response.data.price[idk].price):0,
                GP:((((idk >-1)?  parseInt(response.data.price[idk].price):0) -  parseInt(response.data.Cost[0].GROSS_COST))/((idk >-1)?  parseInt(response.data.price[idk].price):1))*100,
                data:[
                  {
                    key:"หน่วยขาย",
                    text:umcode
                  },
                  {
                    key:"รหัสสินค้า",
                    text:response.data.ProductCode,
                  },{
                    key:"ชื่อสินค้า",
                    text:response.data.ProductNameTH,
                  },{
                    key:"GP"
                  }
                ]
              });
            }else{
              this.setState({
                loading:false,
                product_data:response.data,
                cost:response.data.Cost[0].GROSS_COST,
                um_selected:{text:response.data.Cost[0].UM_Thai, value:response.data.Cost[0].UM_CODE},
                GP:((0 - response.data.Cost[0].GROSS_COST)/1)*100,
                price:0,
                data:[
                  {
                    key:"หน่วยขาย",
                    text:umcode
                  },
                  {
                    key:"รหัสสินค้า",
                    text:response.data.ProductCode,
                  },{
                    key:"ชื่อสินค้า",
                    text:response.data.ProductNameTH,
                  },{
                    key:"GP"
                  }
                ]
              });
            }
          }else{
            Alert.alert(
              'ไม่พบต้นทุน !',
              '',
              [
                {text: 'ยกเลิก', onPress: () => {this._onGoback()}},
              ]
            );
          }
        }
      })
      .catch((error)=>{
        this.setState({loading:false});
        this.setState({process:null});
      })
  }

  selectUM(value){
    let idk =-1;
    this.state.product_data.price.find((element,i) =>{
      if(element.UM_CODE == value.value){
        idk = i;
        return;
      }
    });
    this.setState({
      cost:value.cost,
      um_selected:{text:value.text,value:value.value},
      price:(idk >-1)?  this.state.product_data.price[idk].price:0,
      GP:((((idk >-1)?  this.state.product_data.price[idk].price:0) -  value.cost)/((idk >-1)?  this.state.product_data.price[idk].price:1))*100
    });
  }

  _onGoback(){
    this.props.navigation.goBack();
  }

  _goNextPage(){
    let body = this.props.navigation.state.params.data;
    let idk =-1;
    this.state.product_data.price.find((element,i) =>{
      if(element.UM_CODE == this.state.um_selected.value){
        idk = i;
        return;
      }
    });
    let saleprice = (idk >-1)?  this.state.product_data.price[idk].price:0;
    body.ProductData.lstQuotation.push({
      CV_CODE:body.CVNumber,
      COMPANY:body.company,
      OPERATION_CODE:body.operationCode,
      SUB_OPERATION:body.subOperation,
      CLASS_PRICE:"CLSPR"+body.CustomerPrice,
      EXT_NO:body.ProductData.lstQuotation.length+1,
      PRODUCT_CODE:this.props.navigation.state.params.productCode,
      PRODUCT_NAME:this.state.data[2].text,
      COST_PRICE:this.state.cost,
      SALES_PRICE:saleprice,
      PERCENT_PROFIT:((saleprice-this.state.cost)/((saleprice == 0)? 1:saleprice))*100,
      CONTRACT_PRICE:this.state.price,
      CONTRACT_PROFIT:this.state.GP,
      IS_CRITERIA:"Y",
      QTY_CONTRACT:this.state.quantity,
      UM_CONTRACT:this.state.um_selected.value,
      TOTAL_PRICE:this.state.price,
      TOTAL_PROFIT:this.state.GP,
      TOTAL_CRITERIA:"Y",
      STATUS:"A"
    });
    body.ProductData.lstContractPrice.push({
      COMPANY:body.company,
      OPERATION_CODE:body.operationCode,
      SUB_OPERATION:body.subOperation,
      EXT_NO:body.ProductData.lstContractPrice.length+1,
      CV_CODE:body.CVNumber,
      NAME_TO:body.AccountNameTH,
      PRODUCT_CODE:this.props.navigation.state.params.productCode,
      GROSS_PRICE: this.state.price,
      NET_PRICE_DIS: this.state.price,
      UM_ORDER: this.state.um_selected.value,
      NET_PRICE_FREE: this.state.price
    });
    this.props.navigation.state.params.onGoBack();
    const popAction = StackActions.pop({
      n: 2,
    });
    this.props.navigation.dispatch(popAction);
  }

  renderItem = ({ item }) => 
  {
    if(item.key == "หน่วยขาย" && this.state.um_selected != null)
      return(
        <ListItem
            title={`${item.key} `}
            titleStyle={{fontSize:14}}
            accessory={()=>{
              return (
              <Select  
                data={item.text}
                style={{width:Dimensions.get("window").width/3, marginBottom:5}}
                selectedOption={this.state.um_selected}
                textStyle={{fontSize:11, color:variables.textPrimary, textAlign:'right'}}
                onSelect={(value)=>{this.selectUM(value)}}/>)}}
        />)
    else if(item.key == "GP")
      return(
        <ListItem
          title={`${item.key} `}
          titleStyle={{fontSize:14}}
          accessory={()=>{return (<Text  style={{fontSize:11,color:(this.state.GP>5)? variables.mainColor:variables.textRedflat, flexWrap: 'wrap', alignItems: 'flex-start', fontWeight:'bold'}}>{this.state.GP.toFixed(2)}%</Text>)}}
        />)
    else
      return(
        <ListItem
          title={`${item.key} `}
          titleStyle={{fontSize:14}}
          accessory={()=>{return (<Text  style={{fontSize:11,color:variables.textPrimary, flexWrap: 'wrap', alignItems: 'flex-start'}}>{item.text}</Text>)}}
        />)
  };

  render() {
    const {loading, data, um_selected, price, cost, quantity} = this.state;
    return (
      <Container >
      <StatusBar barStyle="light-content" />
      <Header style={{backgroundColor:variables.headerBGPrimary}}>
            <Left>
              <Button transparent onPress={() => this._onGoback()} disabled={loading}>
                <NativeIcon  style={{color:variables.headerTextPrimary}} name="arrow-round-back" />
              </Button>
            </Left>
              <Body>
                 <Title style={{ color:variables.headerTextPrimary}}>ใบเสนอราคา</Title> 
              </Body>
            <Right />
      </Header>
        <View style={{flex:1, justifyContent:'center', margin:10}}>
        {(!loading)? 
          <Card style={{flex:1, marginTop:5}}>
             <List
                data={data}
                renderItem={this.renderItem}
                keyExtractor={item => item.key}
                style={{backgroundColor:variables.bgPrimary}}
                scrollEnabled={false}
              />

              <Input
                style={{marginTop:10,marginLeft:17, marginRight:17}}
                label={"ราคาที่ตกลง (บาท/"+um_selected.text+")"}
                labelStyle={{color:variables.textTrinary, fontSize:14}}
                textStyle={{textAlign:'right', fontWeight:'bold'}}
                keyboardType="number-pad"
                selectTextOnFocus={true} 
                value={String(price)}
                onChangeText={text => this.setState({price:(text!="")? parseInt(text):0, GP:((parseInt((text!="")? text:0) - cost)/((text!="")? parseInt(text):1))*100})}/>

              <ButtonGroup style={{marginLeft:17, marginRight:17, borderColor:variables.grayScale}}
                            appearance='outline' status='basic' size='small'>
                <KittenButton onPress={()=> this.setState({price:price+1, GP:(((price+1) - cost)/(price+1))*100})} style={{flex:1}} icon={(style) => <Icon {...style} name='plus-outline'/>}> 1 </KittenButton>
                <KittenButton onPress={()=> this.setState({price:price+5, GP:(((price+5) - cost)/(price+5))*100})} style={{flex:1}} icon={(style) => <Icon {...style}  name='plus-outline'/>}> 5 </KittenButton>
                <KittenButton onPress={()=> this.setState({price:price+10, GP:(((price+10) - cost)/(price+10))*100})} style={{flex:1}} icon={(style) => <Icon {...style}  name='plus-outline'/>}> 10 </KittenButton>
              </ButtonGroup>

              <Input
                style={{marginTop:10,marginLeft:17, marginRight:17}}
                label={"ปริมาณที่ตกลง ("+um_selected.text+")"}
                labelStyle={{color:variables.textTrinary, fontSize:14}}
                textStyle={{textAlign:'right', fontWeight:'bold'}}
                keyboardType="number-pad"
                selectTextOnFocus={true} 
                value={String(quantity)}
                onChangeText={text => this.setState({quantity:(text!="")? parseInt(text):0})}/>

              <ButtonGroup style={{marginLeft:17, marginRight:17, borderColor:variables.grayScale}}
                            appearance='outline' status='basic' size='small'>
                <KittenButton onPress={()=> this.setState({quantity:parseInt((quantity!="")? quantity:0)+1})} style={{flex:1}} icon={(style) => <Icon {...style} name='plus-outline'/>}> 1 </KittenButton>
                <KittenButton onPress={()=> this.setState({quantity:parseInt((quantity!="")? quantity:0)+10})} style={{flex:1}} icon={(style) => <Icon {...style}  name='plus-outline'/>}> 10 </KittenButton>
                <KittenButton onPress={()=> this.setState({quantity:parseInt((quantity!="")? quantity:0)+100})} style={{flex:1}} icon={(style) => <Icon {...style}  name='plus-outline'/>}> 100 </KittenButton>
              </ButtonGroup>
              <KittenButton onPress={()=>this._goNextPage()} disabled={(quantity>0 && price>0)? false:true} style={{marginTop:10, marginLeft:17, marginRight:17, borderColor:"#37C646"}} status='success'>
                ยืนยัน
              </KittenButton>
          </Card>:
          <Card style={{flex: 1, backgroundColor:variables.bgPrimary, justifyContent:'center', alignItems:'center'}}>
            <Spinner />
          </Card>
        }
       </View>
      </Container>
    );
  }
}

export default Selectproduct;
