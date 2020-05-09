import { Container, Button, Icon as NativeIcon, Header, Title, Left, Right, Toast, Body} from "native-base";
import { StatusBar, View, Dimensions} from 'react-native';
import {
  ListItem,
  List,
  Button as KittenButton,
  Card,
  Icon,
  Spinner,
  Text
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import StepIndicator from 'react-native-step-indicator';
import {AUTHEN_POST} from "../../../api/restful";
import React from "react";

class ReQuot3 extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      loading:false,  
      showdata:this.props.navigation.state.params.data.ProductData.lstQuotation
  };
  this._addProduct = this._addProduct.bind(this);
 }
 
 componentDidMount(){
  this._getNewCost();
 }

 _getNewCost = async ()=>{
  let ProductCode = [];
  this.props.navigation.state.params.data.ProductData.lstQuotation.forEach(element => {
    ProductCode.push(element.PRODUCT_CODE)
  });
  this.setState({loading:true});
  let body ={
    ProductCode:ProductCode,
    classprice:this.props.navigation.state.params.data.CustomerPrice
  }
  AUTHEN_POST('/product/getProductCostGroupID', body)
    .then(async (response)=>{
      this.setState({loading:false});
      let productDetail = response.data;
      this.setData(productDetail);
    })
    .catch((error)=>{
      this.setState({loading:false});
      Toast.show({text:"error",type:'danger'});
    })
 }

 setData = async (productDetail)=>{
   productDetail.forEach(item =>{
        let idk = -1;
        this.props.navigation.state.params.data.ProductData.lstQuotation.find((element,j) =>{
            if(element.PRODUCT_CODE == item.ProductCode){
              idk = j;
              return;
            }
        });
        let CostIdk = -1;
        let priceIdk = -1;
        if(idk > -1){
          if(item.Cost.length > 0)
          item.Cost.find((element,j) =>{
            if(element.UM_CODE == this.props.navigation.state.params.data.ProductData.lstQuotation[idk].UM_CONTRACT){
              CostIdk = j;
              return;
            }
          });
          if(item.price.length > 0)
          item.price.find((element,j) =>{
            if(element.UM_CODE == this.props.navigation.state.params.data.ProductData.lstQuotation[idk].UM_CONTRACT){
              priceIdk = j;
              return;
            }
          });
        }
        if(CostIdk > -1){
          this.props.navigation.state.params.data.ProductData.lstQuotation[idk].COST_PRICE = item.Cost[CostIdk].GROSS_COST;
          this.props.navigation.state.params.data.ProductData.lstQuotation[idk].CONTRACT_PROFIT = (( this.props.navigation.state.params.data.ProductData.lstQuotation[idk].CONTRACT_PRICE -  parseInt(item.Cost[CostIdk].GROSS_COST))/this.props.navigation.state.params.data.ProductData.lstQuotation[idk].CONTRACT_PRICE)*100
        }
        if(priceIdk > -1){
          this.props.navigation.state.params.data.ProductData.lstQuotation[idk].SALES_PRICE = item.price[priceIdk].price;
        }else{
          this.props.navigation.state.params.data.ProductData.lstQuotation[idk].SALES_PRICE = 0;
        }
      });
      this.refresh();
 }

  _onGoback(){
    this.props.navigation.goBack();
  }

  _addProduct = ()=>{
    if(this.state.showdata.length == 20){
      Alert.alert(
        'สินค้าเกินกำหนด!',
        'จำกัดไม่เกิน 20 สินค้าต่อหนึ่งใบเสนอราคาครับ',
        );
    }else{
      this.props.navigation.navigate("AddProduct", {data:this.props.navigation.state.params.data, onGoBack: this.refresh.bind(this)});
    }
  }

  refresh() {
    let totalprice = this.props.navigation.state.params.data.ProductData.lstQuotation.reduce((a,b) => {return a + b.CONTRACT_PRICE}, 0);
    let totalcost = this.props.navigation.state.params.data.ProductData.lstQuotation.reduce((a,b) => {return a + b.COST_PRICE}, 0);
    let totalProfit = ((totalprice-totalcost)/totalprice) *100;
    this.props.navigation.state.params.data.ProductData.lstQuotation.map(element =>{
      element.EFFECTIVE_DATE = this.props.navigation.state.params.data.EFFECTIVE_DATE
      element.EXPIRY_DATE = this.props.navigation.state.params.data.EXPIRY_DATE
      element.TOTAL_PRICE = totalprice;
      element.TOTAL_PROFIT = totalProfit;
      element.PERCENT_PROFIT = ((element.SALES_PRICE - element.COST_PRICE)/((element.SALES_PRICE ==0)? 1:element.SALES_PRICE))*100;
    });
    this.props.navigation.state.params.data.ProductData.lstContractPrice.map(element =>{
      element.EFFECTIVE_DATE = this.props.navigation.state.params.data.EFFECTIVE_DATE
      element.EXPIRY_DATE = this.props.navigation.state.params.data.EXPIRY_DATE
      element.TOTAL_PRICE = totalprice;
      element.TOTAL_PROFIT = totalProfit;
    });
    this.setState({
      showdata:[]
    },()=>{
      this.setState({showdata:this.props.navigation.state.params.data.ProductData.lstQuotation});
    });
  }

  _goNextPage = ()=>{
    this.props.navigation.navigate("SumQuot", {data:this.props.navigation.state.params.data});
  }

  deleteItem = (item)=>{
    this.props.navigation.state.params.data.ProductData.lstQuotation.splice(item.EXT_NO-1,1);
    this.props.navigation.state.params.data.ProductData.lstContractPrice.splice(item.EXT_NO-1,1);
    this.setState({
      showdata:[]
    },()=>{
      this.setState({showdata:this.props.navigation.state.params.data.ProductData.lstQuotation});
    });
  }

  editItem = (item)=>{
    this.props.navigation.navigate("EditProduct", {data:this.props.navigation.state.params.data, item:item, onGoBack: this.refresh.bind(this)});
  }

  renderItem = ({ item }) => (
    <ListItem
      onPress={()=>{this.editItem(item)}} 
      key={item.PRODUCT_CODE}
      icon={(style)=>{return (<Icon { ...style } name='trash-2-outline' onPress={()=>{this.deleteItem(item)}}/>)}}
      title={`${item.PRODUCT_NAME} `}
      description={`${item.PRODUCT_CODE} `}
      accessory={()=>{return (<Text  style={{fontSize:11,color:(item.CONTRACT_PROFIT>5)? variables.mainColor:variables.textRedflat, flexWrap: 'wrap', alignItems: 'flex-start', fontWeight:'bold'}}>{item.CONTRACT_PROFIT.toFixed(2)}%</Text>)}}
    />
  );

  render() {
    const { loading, showdata } = this.state;
    return (
      <Container>
      <StatusBar barStyle="light-content" />
      <Header style={{ backgroundColor: variables.headerBGPrimary }}>
      <Left>
        <Button transparent onPress={() => this._onGoback()}>
          <NativeIcon
            style={{ color: variables.headerTextPrimary }}
            name="arrow-round-back"
          />
        </Button>
      </Left>
      <Body>
        <Title style={{ color: variables.headerTextPrimary }}>ใบเสนอราคา</Title>
      </Body>
      <Right />
      </Header>
      <View style={{ flex: 1, justifyContent: "center", margin: 10 }}>
        <StepIndicator 
          currentPosition={1}
          stepCount={3}
          labels={["วันที่มีผล","สินค้า","สรุป"]}/>
      {(!loading)? 
        <Card style={{flex:1, marginTop:5}}>
        <List
          style={{height:Dimensions.get('window').height/2.2, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
          data={showdata}
          renderItem={this.renderItem}
          keyExtractor={item => item.PRODUCT_CODE}
        />
        <KittenButton appearance='ghost' status='primary'
                icon={(style)=>{return (<Icon { ...style } name='plus-circle-outline'/>)}}
                onPress={this._addProduct}>เพิ่มสินค้า</KittenButton>
        {(showdata.length>0)? 
        <KittenButton onPress={()=>this._goNextPage()} style={{marginTop:10, marginLeft:17, marginRight:17, borderColor:"#37C646"}} status='success'>
          สรุปยอด
        </KittenButton>:null}
      </Card> :
          <Card style={{flex: 1, backgroundColor:variables.bgPrimary, justifyContent:'center', alignItems:'center'}}>
            <Spinner />
          </Card>
        }
      </View>
    </Container>
    );
  }
}

export default ReQuot3;
