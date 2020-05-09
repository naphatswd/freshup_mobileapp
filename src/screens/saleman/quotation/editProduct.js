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
import {AUTHEN_POST} from "../../../api/restful";
import React from "react";

const { Dimensions } = React_Native;

class Editproduct extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      loading:false,
      um_selected:{text:'กิโลกรัม'},
      product_data:null,
      quantity:this.props.navigation.state.params.item.QTY_CONTRACT,
      price:this.props.navigation.state.params.item.CONTRACT_PRICE,
      cost:this.props.navigation.state.params.item.COST_PRICE,
      GP:this.props.navigation.state.params.item.CONTRACT_PROFIT,
      data:[],
  };
 }

 componentDidMount(){
   this.__fetchPrice();
 }

  __fetchPrice = () =>{
    this.setState({loading:true});
    let body={
      ProductCode:this.props.navigation.state.params.item.PRODUCT_CODE,
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
            let idk =-1;
              response.data.Cost.find((element,i) =>{
                if(element.UM_CODE == this.props.navigation.state.params.item.UM_CONTRACT){
                  idk = i;
                  return;
                }
              });
            if(response.data.price != undefined){
              this.setState({
                loading:false,
                product_data:response.data,
                um_selected:{text:response.data.Cost[idk].UM_Thai, value:response.data.Cost[idk].UM_CODE},
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
                um_selected:{text:response.data.Cost[idk].UM_Thai, value:response.data.Cost[idk].UM_CODE},
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
      GP:((((idk >-1)?  this.state.product_data.price[idk].price:0) -  value.cost)/((idk >-1)?  this.state.product_data.price[idk].price:0))*100
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
    body.ProductData.lstQuotation[this.props.navigation.state.params.item.EXT_NO-1].SALES_PRICE = saleprice;
    body.ProductData.lstQuotation[this.props.navigation.state.params.item.EXT_NO-1].PERCENT_PROFIT = ((saleprice-this.state.cost)/((saleprice == 0)? 1:saleprice))*100;
    body.ProductData.lstQuotation[this.props.navigation.state.params.item.EXT_NO-1].COST_PRICE = this.state.cost;
    body.ProductData.lstQuotation[this.props.navigation.state.params.item.EXT_NO-1].CONTRACT_PRICE = this.state.price;
    body.ProductData.lstQuotation[this.props.navigation.state.params.item.EXT_NO-1].CONTRACT_PROFIT = this.state.GP;
    body.ProductData.lstQuotation[this.props.navigation.state.params.item.EXT_NO-1].QTY_CONTRACT = this.state.quantity;
    body.ProductData.lstQuotation[this.props.navigation.state.params.item.EXT_NO-1].UM_CONTRACT = this.state.um_selected.value;
    body.ProductData.lstContractPrice[this.props.navigation.state.params.item.EXT_NO-1].GROSS_PRICE = this.state.price;
    body.ProductData.lstContractPrice[this.props.navigation.state.params.item.EXT_NO-1].NET_PRICE_DIS = this.state.price;
    body.ProductData.lstContractPrice[this.props.navigation.state.params.item.EXT_NO-1].UM_ORDER = this.state.um_selected.value;
    body.ProductData.lstContractPrice[this.props.navigation.state.params.item.EXT_NO-1].NET_PRICE_FREE = this.state.price;
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
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
              <Button transparent onPress={() => this._onGoback()}>
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
                onChangeText={text => this.setState({price:(text!="")? parseInt(text):0, GP:((parseInt((text!="")? text:0) - cost)/((text!="")? parseInt(text):0))*100})}/>

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

export default Editproduct;
