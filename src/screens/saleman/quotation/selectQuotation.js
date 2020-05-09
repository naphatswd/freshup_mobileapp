import { Container, Button, Icon as NativeIcon, Header, Title, Left, Right, Body } from "native-base";
import React_Native, { StatusBar, View, Alert } from 'react-native';
import {
  ListItem,
  Spinner,
  Card,
  Icon,
  Text,
  Button as KittenButton,
  List
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import {AUTHEN_POST} from "../../../api/restful";
import moment from 'moment';
import React from "react";

const { Dimensions } = React_Native;

class SelectQuot extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      loading:false,
      data:this.props.navigation.state.params.data,
  };
 }

 componentDidMount(){

 }

  _onGoback(){
    this.props.navigation.goBack();
  }

  _goNextPage(){

  }

  _fetchQuotation = (item) =>{
    this.setState({loading:true});
    let body={
      QUOTATION_ID:item.QUOTATION_ID,
    }
    AUTHEN_POST('/quatation/getQuotationByID', body)
      .then((response)=>{
        this.setState({loading:false});
        if(response.data.length > 0){
          response.data[0].CustomerPrice = this.props.navigation.state.params.CV.CustomerPrice;
          this.props.navigation.navigate("ReQuot", {data:response.data[0]});
        }
      })
      .catch((error)=>{
        this.setState({loading:false});
        this.setState({process:null});
      })
  }

  renderItem = ({ item }) => 
  {
    return(
      <ListItem onPress={()=>{this._fetchQuotation(item)}}
        key={String(item.QUOTATION_ID)}
        icon={()=>{return (<Icon height="16" width="16" fill={variables.grayScale} name='file-outline'/>)}}
        title={"GP: "+`${item.TOTAL_PROFIT.toFixed(2)} `}
        titleStyle={{color:(item.TOTAL_PROFIT > 5)? variables.mainColor:variables.textRedflat}}
        description={"วันที่มีผล: "+`${moment(new Date(item.EFFECTIVE_DATE)).format("DD MMMM YYYY")} `}
        accessory={()=>{return (<NativeIcon style={{fontSize: 16, color:variables.grayScale }} name='search'/>)}}
      />);
  };

  render() {
    const {loading, data} = this.state;
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
            <Text style={{ color:variables.textTrinary, textAlign:'left', fontSize:12, fontWeight:'bold'}}>ใบเสนอราคา: {this.props.navigation.state.params.CV.AccountNameTH}</Text>
            <List
                data={data}
                renderItem={this.renderItem}
                keyExtractor={item => String(item.QUOTATION_ID)}
                style={{height:Dimensions.get('window').height/1.9, backgroundColor:variables.bgPrimary}}
              />
            <KittenButton appearance='ghost' status='primary'
                icon={(style)=>{return (<Icon { ...style } name='plus-circle-outline'/>)}}
                onPress={()=>{this.props.navigation.navigate("Quotation2", {Salescode:this.props.navigation.state.params.Salescode ,data:this.props.navigation.state.params.CV})}}>สร้างใบใหม่
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

export default SelectQuot;
