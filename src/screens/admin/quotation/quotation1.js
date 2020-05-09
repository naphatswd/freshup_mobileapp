import { Container,Button, Icon as NativeIcon, Toast, Header, Title, Left, Right, Body } from "native-base";
import { StatusBar, View, Platform, Keyboard, Dimensions} from 'react-native';
import {
  Icon,
  Input,
  ListItem,
  List,
  Card,
  Spinner
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { AUTHEN_POST } from "../../../api/restful";
import { connect } from 'react-redux';
import React from "react";

class Quotation1 extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {   
        store:null,
        loading:false,
        showdata:null,
        data :[]
  };
 }

  componentDidMount() {
    let store = [];
    this.props.store.forEach(element=>{
      if(element.selected){
        element.store.forEach(item =>{
          store.push(item);
        })
      }
    });
    this.setState({store:store},()=>{
        this.__getMyClient();
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
      this.setState({store:store},()=>{
        this.__getMyClient();
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
      this.setState({store:store},()=>{
        this.__getMyClient();
        });
    }
  }

  __getMyClient = async ()=>{
    this.setState({
      loading:true,
      showdata:null,
      data:null});
      let body = {
        SaleCode:"All",
        adm_store:this.state.store
      }
      AUTHEN_POST('/client/saleClient',body)
      .then(async (response)=>{
        this.setState({loading:false});
        if(response.data.length > 0){
          response.data.sort((a,b) => a.CVNumber - b.CVNumber);
          this.setState({
            showdata:response.data,
            data:response.data,
          });
        }else{
           this.setState({process:"ไม่มีข้อมูล"});
         }
      })
      .catch((error)=>{
        this.setState({loading:false});
        this.setState({process:null});
        Toast.show({text:'error',type:'danger'});
      })
  }

  __getQuotationByCV= async (item)=>{
    this.setState({loading:true});
      AUTHEN_POST('/quatation/getQuotationByCV',{CVNumber:item.CVNumber})
      .then(async (response)=>{
        this.setState({loading:false});
        if(response.data.length > 0){
          this.props.navigation.navigate("SelectQuot", {Salescode:item.Salesman ,CV:item,data:response.data});
        }else{
          this.props.navigation.navigate("Quotation2", {Salescode:item.Salesman ,data:item});
        }
      })
      .catch((error)=>{
        this.setState({loading:false});
        Toast.show({text:error,type:'danger'});
      })
  }

  _onGoback(){
    this.props.navigation.navigate("Admin_Menu")
  }

  searchFilterFunction = (text) =>{
    this.setState({searchterm:text.toLowerCase()});
    const newData = this.state.data.filter(item => {      
      let itemData;
        itemData = `${item.AccountNameTH} ${item.CVNumber} `;
       const textData = text.toLowerCase();
      return (itemData.replace(/\s/g,'').toLowerCase().indexOf(textData) > -1 || itemData.toLowerCase().indexOf(textData) > -1); 
    });
    newData.sort((a,b) => a.CVNumber - b.CVNumber);
    this.setState({ showdata: newData });
  }

  renderItem = ({ item }) => {
    return(
    <ListItem
      onPress={()=>{this.__getQuotationByCV(item)}}
      title={`${item.AccountNameTH} `}
      description={`${item.CVNumber} `}
      accessory={()=>{return (<NativeIcon  style={{fontSize: 14, color:variables.textInput }} name="arrow-forward" />)}}
    />)
  };

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
                keyExtractor={item => item.CVNumber}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                style={{height:Dimensions.get('window').height/1.7, backgroundColor:variables.bgPrimary}}
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

let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    role:state.userReducer.role,
    token:state.userReducer.token,
    store:state.userReducer.store,
    selectedStore:state.userReducer.selectedStore,
    reload:state.userReducer.reload
  }
}

export default connect(
  mapStateToProps
)(Quotation1);
