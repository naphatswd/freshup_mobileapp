import { Container, Button, Icon as NativeIcon, Header, Title, Left, Right, Body} from "native-base";
import { StatusBar, View, Dimensions} from 'react-native';
import {
  ListItem,
  List,
  Button as KittenButton,
  Card,
  Icon,
  Text
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import StepIndicator from 'react-native-step-indicator';
import React from "react";

class Quotation4 extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {  
      showdata:this.props.navigation.state.params.data.ProductData.lstQuotation
  };
  this._addProduct = this._addProduct.bind(this);
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
    const { showdata } = this.state;
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
          currentPosition={2}
          stepCount={4}
          labels={["เลือกสาขา","วันที่มีผล","สินค้า","สรุป"]} />
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
      </Card>
      </View>
    </Container>
    );
  }
}

export default Quotation4;
