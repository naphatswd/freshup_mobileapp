import { Container, Toast, Button, Icon as NativeIcon, Header, Title, Left, Right, Body, View} from "native-base";
import { StatusBar, Dimensions, Alert} from 'react-native';
import { Linking} from 'expo';
import {
  ListItem,
  List,
  Button as KittenButton,
  Card,
  Spinner,
  Text
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import StepIndicator from 'react-native-step-indicator';
import appJson from "../../../../app.json";
import {AUTHEN_POST} from "../../../api/restful";
import moment from 'moment';
import React from "react";

class SumQuot extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {  
      loading:false,
      data:[],
      productData:[],
      submit:false,
      quotationid:null
  };
 }
 
 componentDidMount(){
    let data = [
        {
            key:"ลูกค้า",
            value:this.props.navigation.state.params.data.AccountNameTH,
            cvcode:this.props.navigation.state.params.data.CVNumber
        },
        {
            key:"วันที่ส่งผล",
            value:moment(new Date(this.props.navigation.state.params.data.EFFECTIVE_DATE)).format("DD MMMM YYYY")
        },
        {
            key:"วันที่หมดอายุ",
            value:moment(new Date(this.props.navigation.state.params.data.EXPIRY_DATE)).format("DD MMMM YYYY")
        },
        {
            key:"GP รวม",
            value:this.props.navigation.state.params.data.ProductData.lstQuotation[0].TOTAL_PROFIT
        },
    ];
    this.setState({data:data, productData:this.props.navigation.state.params.data.ProductData.lstQuotation});
 }

  _onGoback(){
    this.props.navigation.goBack();
  }

  _SubmitQuotation = ()=>{
    this.setState({loading:true});
    let body = this.props.navigation.state.params.data;
    AUTHEN_POST('/quatation/submitQuatation', body)
      .then((response)=>{
            this.setState({loading:false});
            if(response.data.status){
              this.setState({submit:true,
                quotationid:response.data.status});
            }else{
              Alert.alert(
              'ทำรายการไม่สำเร็จ !',
              'เกิดข้อผิดพลาดในการสร้างใบเสนอราคา'
              );
            }
      })
      .catch((error)=>{
        this.setState({loading:false});
        this.setState({process:null});
        Toast.show({text:"error",type:'danger'});
      });
  }

  renderItem = ({ item }) => {
    if(item.key == "GP รวม"){
        return(
            <ListItem
                title={`${item.key} `}
                titleStyle={{fontSize:14}}
                accessory={()=>{return (<Text  style={{fontSize:11,color:(item.value>5)? variables.mainColor:variables.textRedflat, flexWrap: 'wrap', alignItems: 'flex-start', fontWeight:'bold'}}>{item.value.toFixed(2)}%</Text>)}}
            />)
    }
    else{
        return (
            <ListItem
              title={`${item.key} `}
              titleStyle={{fontSize:14}}
              accessory={()=>{return (<Text  style={{fontSize:11,color:variables.textPrimary, flexWrap: 'wrap', alignItems: 'flex-start'}}>{item.value}</Text>)}} />)
        }
    };
    
   renderProduct = ({item}) =>{
    return (
        <ListItem
            key={item.PRODUCT_CODE}
            title={`${item.PRODUCT_NAME} `}
            description={`${item.PRODUCT_CODE} `}
            accessory={()=>{return (<Text  style={{fontSize:11,color:(item.CONTRACT_PROFIT>5)? variables.mainColor:variables.textRedflat, flexWrap: 'wrap', alignItems: 'flex-start', fontWeight:'bold'}}>{item.CONTRACT_PROFIT.toFixed(2)}%</Text>)}} />)
    };

  render() {
    const { data, productData, loading, submit, quotationid} = this.state;
    return (
      <Container>
      <StatusBar barStyle="light-content" />
      <Header style={{ backgroundColor: variables.headerBGPrimary }}>
      <Left>
        {(!submit) ? 
        <Button transparent onPress={() => this._onGoback()} disabled={loading}>
        <NativeIcon
          style={{ color: variables.headerTextPrimary }}
          name="arrow-round-back"
        />
      </Button>:null}
      </Left>
      <Body>
        <Title style={{ color: variables.headerTextPrimary }}>ใบเสนอราคา</Title>
      </Body>
      <Right />
      </Header>
      <View style={{ flex: 1, justifyContent: "center", margin: 10 }}>
        <StepIndicator 
          currentPosition={3}
          stepCount={4}
          labels={["เลือกสาขา","วันที่มีผล","สินค้า","สรุป"]} />
        {(!loading)?
      <Card style={{flex:1, marginTop:5}}>
        <List
            data={data}
            renderItem={this.renderItem}
            keyExtractor={item => item.key}
            style={{backgroundColor:variables.bgPrimary}}
            scrollEnabled={false}
        />
        <Text style={{textAlign:'center', fontSize:14, fontWeight:'bold'}}>รายการสินค้า</Text>
        <List
          style={{height:Dimensions.get('window').height/5, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
          data={productData}
          renderItem={this.renderProduct}
          keyExtractor={item => item.PRODUCT_CODE}
        />
        {(!submit)? 
        <View>
          <KittenButton onPress={()=>this._SubmitQuotation()} style={{marginTop:10, marginLeft:17, marginRight:17, borderColor:"#37C646"}} status='success'>
          ยืนยัน
          </KittenButton>  
        </View>
        :
        <View>
        <KittenButton onPress={()=> Linking.openURL(appJson.url.prefix+"/quotation/"+quotationid).catch((err) => {})} style={{ marginTop:10 }} appearance='ghost' status='primary'>
                  ดาวน์โหลดไฟล์ PDF
        </KittenButton>
        <KittenButton onPress={()=>{this.props.navigation.navigate("Quotation1");}} style={{marginTop:10, borderColor:"#37C646"}} status='success'>
                  ปิด
        </KittenButton>
        </View> 
        }
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

export default SumQuot;
