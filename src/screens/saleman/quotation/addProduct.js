import { Container, Button, Icon as NativeIcon, Toast, Header, Title, Left, Right, Body } from "native-base";
import React_Native, { StatusBar, Alert, Platform, Keyboard } from 'react-native';
import {
  ListItem,
  Spinner,
  Input,
  Icon,
  Card,
  Select,
  List
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as FileSystem from 'expo-file-system';
import {AUTHEN_POST} from "../../../api/restful";
import moment from 'moment';
import React from "react";

const { Dimensions } = React_Native;

class Addproduct extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {   
      loading:false,
      cats:[{text:"สินค้าทั้งหมด"}],
      items :[],
      cats_selected:{text:"สินค้าทั้งหมด"},
      showdata:null,
  };
 }

  componentDidMount() {
    new Promise.all([
        this.__getAllProduct(),
        this.__fetchCats()
    ]);
  }

  pickerChange = value => {
    this.setState({
      cats_selected:value,
      searchterm:"",
      items:[],
      showdata:null
    });
    if(value.text == "สินค้าทั้งหมด")
      this.__getAllProduct();
    else
      this.__getProductList(value.text);
  };

  __fetchCats = () =>{
    AUTHEN_POST('/product/getCat', '')
      .then((response)=>{
          let temp = [
              {
                text:"สินค้าทั้งหมด"
              }
          ];
          response.data.map(item =>{
            temp.push({
                text:item
            });
          });
          this.setState({
              cats:temp
          });
      })
      .catch((error)=>{
        this.setState({loading:false});
        this.setState({process:null});
        Toast.show({text:error,type:'danger'});
      });
  }

  __getAllProduct = async () =>{
    this.setState({loading:true});
    let testfile,readfile,productlength = null;
    testfile = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'products.json');
    if(testfile.exists){
    try{
        readfile = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+'products.json');}
      catch(error) {
        Toast.show({text:"error",type:'danger'});
      }
      productlength = JSON.parse(readfile).length;
    }else{
      productlength = 0;
    }
    let body = {
      productlength:productlength
    }
    this.setState({servererror:false});
    AUTHEN_POST('/product/checkallproduct',body)
    .then( async (response)=>{
      this.setState({loading:false});
      if(response.data.status){
        this.setState({
          items:JSON.parse(readfile),
          showdata:JSON.parse(readfile)
        });
      }else{
        if(response.data.length>0){
          let result = [];
          for(let i=0;i<response.data.length;i++){
            result.push({
              id:response.data[i].ProductCode,
              name:response.data[i].ProductNameTH
            })
          }
          try{
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'products.json', JSON.stringify(result));}
          catch(error) {
            Toast.show({text:"error",type:'danger'});
          }
          this.setState({
            items:result,
            showdata:result});
        }
      }
    })
    .catch((error)=>{
      this.setState({
        loading:false,
        servererror:true});
      Toast.show({text:"error",type:'danger'});
    });
  }

  __getProductList = async (item)=>{
    this.setState({loading:true});
      let body = {
        cats:item
      }
      AUTHEN_POST('/product/getproductbyCat', body)
      .then(async (response)=>{
        this.setState({loading:false});
        if(response.data.length>0){
          let result = [];
          for(let i=0;i<response.data.length;i++){
            result.push({
              id:response.data[i].ProductCode,
              name:response.data[i].ProductNameTH
            })
          }
          this.setState({
            items:result,
            showdata:result});
        }
     })
     .catch((error)=>{
      this.setState({loading:false});
        this.setState({servererror:true});
        Toast.show({text:"error",type:'danger'});
      });
  }

  _onGoback(){
    this.props.navigation.goBack();
  }

  searchFilterFunction = (text) =>{
    this.setState({searchterm:text.toLowerCase()});
    const newData = this.state.items.filter(item => {      
      let itemData;
        itemData = `${item.id} ${item.name} `;
       const textData = text.toLowerCase();
      return (itemData.replace(/\s/g,'').toLowerCase().indexOf(textData) > -1 || itemData.toLowerCase().indexOf(textData) > -1); 
    });
    this.setState({ showdata: newData });
  }

  _goNextPage = (item)=>{
    let body = this.props.navigation.state.params.data;
    let idk = -1;
    body.ProductData.lstQuotation.find((element,k)=>{
      if(element.PRODUCT_CODE == item.id){
        idk = k;
        return;
      }
    });
    if(idk == -1){
    let temp = {
      company:this.props.navigation.state.params.data.company,
      operationCode:this.props.navigation.state.params.data.operationCode,
      subOperation:this.props.navigation.state.params.data.subOperation,
      CVNumber:this.props.navigation.state.params.data.CVNumber,
      issueDate:moment(new Date(body.EFFECTIVE_DATE)).format("YYYYMMDD"),
      lstproduct:["'"+item.id+"'"]
    }
    AUTHEN_POST('/quatation/findDuplicate', temp)
      .then((response)=>{
        if(response.data.status){
          Alert.alert(
            'ทำรายการซ้ำ !',
            'มีใบเสนอราคาสินค้านี้แล้ว \nกรุณาเลือกวันที่อื่น หรือ สินค้าอื่น',
            [
              {text: 'ยกเลิก', onPress: () => {}},
            ]
          );
        }else{
          this.props.navigation.navigate("SelectProduct", {data:body, productCode:item.id, onGoBack: this.props.navigation.state.params.onGoBack.bind(this)});
        }
      })
      .catch((error)=>{
        this.setState({loading:false});
        this.setState({process:null});
      });
    }else{
      Alert.alert(
        'ทำรายการซ้ำ !',
        'เพิ่มสินค้านี้ไปแล้ว',
        [
          {text: 'ปืด', onPress: () => {}},
        ]
      );
    }
  }

  renderItem = ({ item }) => (
    <ListItem
      onPress={()=>{this._goNextPage(item)}}
      title={`${item.name} `}
      description={`${item.id} `}
      accessory={()=>{return (<NativeIcon  style={{fontSize: 14, color:variables.textInput }} name="arrow-forward" />)}}
    />
  );

  render() {
    const {loading, cats, cats_selected, showdata, searchterm} = this.state;
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
          <Card>
          <Select
                data={cats}
                style={{width:Dimensions.get("window").width/2.7, alignSelf:'flex-start', marginBottom:5}}
                textStyle={{fontSize:12, color:variables.textPrimary}}
                selectedOption={cats_selected}
                disabled={loading}
                onSelect={(value)=>{this.pickerChange(value)}}
                />
              <Input
                selectTextOnFocus={true} 
                icon={(style)=>{return (<Icon { ...style } name='search'/>)}}
                value={searchterm}
                disabled={loading}
                onChangeText={text => this.searchFilterFunction(text)}
                placeholder="ค้นหา" />
          </Card>
        {(!loading)? 
          <Card style={{flex:1, marginTop:5}}>
              <List
                data={showdata}
                renderItem={this.renderItem}
                keyExtractor={item => item.id}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                style={{backgroundColor:variables.bgPrimary}}
                windowSize={8}
                initialListSize={10}
                initialNumToRender={10}
                maxToRenderPerBatch={4}
              />
          </Card>:
          <Card style={{flex: 1, backgroundColor:variables.bgPrimary, justifyContent:'center', alignItems:'center'}}>
            <Spinner />
          </Card>
        }
                {Platform.OS === 'ios' ? <KeyboardSpacer /> : null }
      </Container>
    );
  }
}

export default Addproduct;
