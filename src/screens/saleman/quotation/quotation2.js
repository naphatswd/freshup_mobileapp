import { Container, Button, Icon as NativeIcon, Toast, Header, Title, Left, Right, Body } from "native-base";
import { StatusBar, BackHandler, View, Platform, Keyboard, Dimensions} from 'react-native';
import {
  ListItem,
  Spinner,
  Input,
  Icon,
  Card,
  List
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import StepIndicator from 'react-native-step-indicator';
import {AUTHEN_POST} from "../../../api/restful";
import React from "react";

class Quotation2 extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {   
      loading:false,
      showdata:null,
      data :[],
      body:{
        Salescode:this.props.navigation.state.params.Salescode,
        AccountNameTH:this.props.navigation.state.params.data.AccountNameTH,
        CVNumber:this.props.navigation.state.params.data.CVNumber,
        CustomerPrice:this.props.navigation.state.params.data.CustomerPrice,
        Store:this.props.navigation.state.params.data.Store,
        ProductData:{
          lstQuotation:[],
          lstContractPrice:[]
        }
      }
  };
 }

  componentDidMount() {
    this.__getFactory();
  }

  __getFactory = async ()=>{
    this.setState({
      loading:true,
      showdata:null,
      data:null});
    let body ={
      cvnumber:this.props.navigation.getParam('data').CVNumber
    }
      AUTHEN_POST('/quatation/getFactoryCV', body)
      .then(async (response)=>{
        this.setState({loading:false});
        this.setState({
          showdata:response.data,
          data:response.data,
        });
      })
      .catch((error)=>{
        this.setState({loading:false});
        this.setState({process:null});
        Toast.show({text:error,type:'danger'});
      })
  }

  _onGoback(){
    this.props.navigation.goBack();
  }

  searchFilterFunction = (text) =>{
    this.setState({searchterm:text.toLowerCase()});
    const newData = this.state.data.filter(item => {      
      let itemData;
        itemData = `${item.OPERATION_NAME} ${item.SUB_OPERATION} ${item.OPERATION_CODE} `;
       const textData = text.toLowerCase();
      return (itemData.replace(/\s/g,'').toLowerCase().indexOf(textData) > -1 || itemData.toLowerCase().indexOf(textData) > -1); 
    });
    this.setState({ showdata: newData });
  }

  _goNextPage = (item)=>{
    item.checked = true;
    let body = this.state.body;
    body.company = item.COMPANY,
    body.operationCode = item.OPERATION_CODE,
    body.subOperation = item.SUB_OPERATION,
    this.props.navigation.navigate("Quotation3", {data:body});
  }

  renderItem = ({ item }) => (
    <ListItem
      onPress={()=>{this._goNextPage(item)}}
      title={`${item.OPERATION_NAME} `}
      description={`${item.SUB_OPERATION} `}
      accessory={()=>{return (<NativeIcon  style={{fontSize: 14, color:variables.textInput }} name="arrow-forward" />)}}
    />
  );

  render() {
    const {loading, showdata, searchterm} = this.state;
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
        <StepIndicator
          currentPosition={0}
          stepCount={4}
          labels={["เลือกสาขา","วันที่มีผล","สินค้า","สรุป"]}
        />
        {(!loading)? 
          <Card style={{flex:1, marginTop:5}}>
              <Input
                selectTextOnFocus={true} 
                icon={(style)=>{return (<Icon { ...style } name='search'/>)}}
                value={searchterm}
                onChangeText={text => this.searchFilterFunction(text)}
                placeholder="ค้นหา" />
              <List
                data={showdata}
                renderItem={this.renderItem}
                keyExtractor={item => item.OPERATION_CODE}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                style={{height:Dimensions.get('window').height/1.9, backgroundColor:variables.bgPrimary}}
              />
          </Card>:
          <Card style={{flex: 1, backgroundColor:variables.bgPrimary, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
            <Spinner />
          </Card>
        }
                {Platform.OS === 'ios' ? <KeyboardSpacer /> : null }
       </View>
      </Container>
    );
  }
}

export default Quotation2;
