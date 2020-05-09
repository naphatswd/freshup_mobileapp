import { Content, Container, Spinner, Button, ListItem, Icon, Body, Text, Toast, Card, CardItem } from "native-base";
import { StatusBar, View, TouchableOpacity, TouchableHighlight, Clipboard, FlatList, Share, Keyboard } from 'react-native';
import SocketContext from '../../socket-context'
import Header_Second from "../../theme/compontent/headersecond";
import variables from "../../theme/variables/commonColor";
import React, { Component } from 'react';
import { getItem } from "../../storage";
import { formatMoney } from "../../globalfunc";
import Moment from 'moment';
import styles from "../../theme/mainstyles";
import {AUTHEN_POST} from '../../api/restful';

class InvoiceDetail extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      InvoiceNumber:null,
      data:null,
      route:null,
      itemList:null,
      show:false,
      fetchItem:false
    };
    this.props.socket.on('refresh',()=>{
      this.setState({
        InvoiceNumber:this.props.navigation.getParam('data')},()=>{
          this._fetchItemData();
      });
    })
  }

  componentDidMount() {
    this.setState({
      route:this.props.navigation.getParam('route'),
      InvoiceNumber:this.props.navigation.getParam('data')},()=>{
        this._fetchItemData();
    });
  }
  
  _shareMessage() {
    let text = "#"+this.state.InvoiceNumber+"\n"
              +"Issue Date \t" + Moment(this.state.data.IssueDate).format("YYYY-MM-DD")+"\n"
              +"CV: "+this.state.data.CVNumber+"\n"
              +this.state.data.CVName+"\n"
              +"Class Price: "+this.state.data.CustomerPrice+"\n"
              +"Product";
    for(let i=1;i<this.state.itemList.length;i++){
        text+="\n"+this.state.itemList[i].ProductName+"\n";
        text+=formatMoney(this.state.itemList[i].QuantitySales.toFixed(2)) +"\t" + this.state.itemList[i].QuantitySalesUOM+"|\t" 
        text+=formatMoney(this.state.itemList[i].WeightSales.toFixed(2)) +"\t" + this.state.itemList[i].WeightSalesUOM+"|\t" ;
        text+=formatMoney(Math.round(this.state.itemList[i].TotalNetPrice)) +"\t" + " ฿(Net)"
    }
    Share.share({
      message:
        text
    })
      .then(this._showResult)
      .catch(error => this.setState({result: 'error: ' + error.message}));
  }

  _setContent(text) {
    Clipboard.setString(text);
    Toast.show({
      text:'Copied',
      type:'warning'
    })
  }

  async _fetchItemData (){
    let obj = await getItem("token");
    let body ={
      InvoiceNumber:this.state.InvoiceNumber
    }
    if (obj !== null) {
      this.setState({
        fetchItem:false,
        show:false});
      AUTHEN_POST('/invoice/getInvoice', body)
        .then(async (response)=>{
          this.setState({fetchItem:true});
          if(response){
            this.setState({
              data:response.data[0]
            });
            let temp = response.data[0].LineItemList;
            temp.sort((a, b) => parseFloat(b.TotalNetPrice)-parseFloat(a.TotalNetPrice));
            temp = [{ProductName:"List Item",Quantity:"Quantity",WeightSum:"Weight",NetSum:"Net",header:true}].concat(temp);
            this.setState({itemList:temp},()=>{
            });
          }
       })
        .catch((error)=>{
          this.setState({
            fetchItem:false,
            show:false});
          this.props.navigation.navigate(this.state.route);
          Toast.show({text:"Error",type:'danger'});
      });
    }
  }

  renderItem = ({ item }) => {
    if (item.header) {
      return (
        <ListItem style={{backgroundColor:variables.bgPrimary}} itemDivider >
          <Body>
              <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 0,
                    borderColor: variables.borderPrimary}}
                    underlayColor={variables.borderPrimary}>
              <View style={{alignSelf: 'stretch',justifyContent: 'space-between', flexDirection: 'row', flex:1}}>
                    <View style={{flex: 2, alignSelf: 'stretch'}}>
                      <Text style={{fontWeight: 'bold', color: variables.textTrinary, fontSize:11 }} >{item.ProductName}</Text>
                    </View>
                    <View style={{flex: 2, alignSelf: 'stretch'}}>
                      <Text style={{ fontWeight: 'bold', color: variables.textTrinary, fontSize:11  }} >{item.Quantity}</Text>
                    </View>
                    <View
                        style={{borderLeftWidth: 0.7, borderLeftColor: variables.grayScale, margin:3}}/>
                    <View style={{flex: 1.8, alignSelf: 'stretch',}}>       
                      <Text style={{ fontWeight: 'bold', color: variables.textTrinary, fontSize:11  }} >{item.WeightSum}</Text>
                    </View>
                    <View
                        style={{borderLeftWidth: 0.7, borderLeftColor: variables.grayScale, margin:3}}/>
                    <View style={{flex: 1.2, alignSelf: 'stretch' }}>       
                      <Text style={{ fontWeight: 'bold', color: variables.textTrinary, fontSize:11  }} >{item.NetSum}</Text>
                    </View>
              </View>
            </View> 
          </Body>
        </ListItem>
      );
    }
    else
    return (
      <ListItem button={true} style={{ marginLeft: 0 }}>
        <Body>
            <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 0,
                  borderColor: variables.borderPrimary}}
                  underlayColor={variables.borderPrimary}>
            <View style={{alignSelf: 'stretch', flexDirection: 'row', flex:1}}>
                  <View style={{flex: 3, alignSelf: 'stretch' }}>
                    <Text style={{color: variables.textUnit, fontSize:11 }} >{item.ProductName}</Text>
                    <Text style={{color: variables.textUnit, fontSize:8 }} >PPU: {formatMoney(Math.round(item.NetPricePerUnit))} ฿</Text>
                  </View>
                  <View style={{flex: 1, alignSelf: 'stretch'}}>
                    <Text style={{ color: variables.textPrimary, fontSize:11  }} >{formatMoney(item.QuantitySales.toFixed(2))} {item.QuantitySalesUOM}</Text>
                  </View>
                  <View
                      style={{borderLeftWidth: 0.7, borderLeftColor: variables.grayScale, margin:3}}/>
                  <View style={{flex: 1, alignSelf: 'stretch',}}>       
                    <Text style={{ color: variables.textPrimary, fontSize:11  }} >{formatMoney(item.WeightSales.toFixed(2))} {item.WeightSalesUOM}</Text>
                  </View>
                  <View
                      style={{borderLeftWidth: 0.7, borderLeftColor: variables.grayScale, margin:3}}/>
                  <View style={{flex: 1.5, alignSelf: 'stretch' }}>       
                    <Text style={{ color: variables.textPrimary, fontSize:11  }} >{formatMoney(Math.round(item.TotalNetPrice))} ฿</Text>
                  </View>
            </View>
          </View> 
        </Body>
      </ListItem>
    );
};

  render() {
    const {fetchItem,data} = this.state;
    return (
      <Container  >
      {(fetchItem && data!=null) ?
      <Container >
        <StatusBar barStyle="light-content" />
        <Header_Second title={data.CVName} navigation={this.props.navigation} route={this.state.route}/>
        <Card >
          <CardItem>
            <Body style={styles.detailImgBG}>
              <View
                style={{flexDirection: 'row',
                  borderColor: variables.borderPrimary}}>
                <View style={styles.leftContainer}>
                  <Button small light style={{marginLeft:10}} onLongPress={() =>{this._setContent(this.state.InvoiceNumber)}}>
                    <Text style={{fontSize:14, color:variables.mainColor}}>#{this.state.InvoiceNumber}</Text>
                  </Button>
                </View>
                <View style={styles.rightContainer}>
                  <Icon onPress={()=>{this._shareMessage()}} name="share-alt" style={{fontSize: 25, color: 'white', marginRight:10}}/>
                </View>
              </View> 
              <View style={{position:"relative" ,flexDirection: 'row', marginRight:10}}>
                <View style={styles.leftContainer}>
                    <Text style={{fontSize:14, color:variables.textSecondary, marginLeft:10}}>{data.CVName}</Text>
                </View>
                <View style={styles.rightContainer} >
                      <Text style={{fontSize:14, marginTop:10, color:variables.textSecondary}}>{formatMoney(data.NetAmount)} ฿</Text>
                </View>
               </View>
            </Body>
          </CardItem>
        </Card>
        <Card style={{flex:2}}>
            <Content style={styles.invlist} padder>
            <View style={{alignSelf: 'stretch', flexDirection: 'row', flex:1}}>
                  <View style={{flex: 1, alignSelf: 'stretch' }}>
                    <TouchableHighlight
                      underlayColor="transparent"
                      onLongPress={() => {this._setContent(data.CVNumber)}}
                      style={{marginTop:8}}
                    >
                    <View >
                      <Text style={{fontSize:14}}>CV No.</Text>
                        {(this.state.data != null ) ?
                          <Text style={{fontSize:14,marginTop: 5,color:variables.textPrimary}}>{data.CVNumber}</Text>: null
                        }
                      <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                        <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                      </View>
                    </View>
                    </TouchableHighlight>
                  </View>
                  <View style={{borderLeftWidth: 0.7, borderLeftColor: variables.grayScale, margin:10}}/>
                  <View style={{flex: 1, alignSelf: 'stretch' }}>       
                    <TouchableHighlight
                      underlayColor="transparent"
                      onLongPress={() => {this._setContent(data.CustomerPrice)}}
                      style={{marginTop:8}}
                    >
                    <View >
                      <Text style={{fontSize:14}}>Customer Price</Text>
                        {(this.state.data != null ) ?
                          <Text style={{fontSize:14,marginTop: 5,color:variables.textPrimary}}>{data.CustomerPrice}</Text>: null
                        }
                      <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                        <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                      </View>
                    </View>
                    </TouchableHighlight>
                  </View>
            </View>
          <TouchableHighlight
              underlayColor="transparent"
              onLongPress={() => {this._setContent(data.CVName)}}
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:14}}>CV Name.</Text>
                {(this.state.data != null ) ?
                  <Text style={{fontSize:14,marginTop: 5,color:variables.textPrimary}}>{data.CVName}</Text>: null
                }
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
              underlayColor="transparent"
              onLongPress={() => {this._setContent(data.SaleName +" " + data.SaleLast)}}
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:14}}>Salesman Code.</Text>
                {(this.state.data != null ) ?
                  <Text style={{fontSize:14,marginTop: 5,color:variables.textPrimary}}>{data.SaleName +" " + data.SaleLast}</Text>: null
                }
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
              underlayColor="transparent"
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:14}}>Ship to.</Text>
                {(this.state.data != null ) ?
                  <Text style={{fontSize:14,marginTop: 5,color:variables.textPrimary}}>
                  {data.Shipto} </Text>: null
                }
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
              underlayColor="transparent"
              style={{marginTop:8}}
              >
              <View >
                <Text style={{fontSize:14}}>Bill to.</Text>
                {(this.state.data != null ) ?
                  <Text style={{fontSize:14,marginTop: 5,color:variables.textPrimary}}>
                  {data.Billto} </Text>: null
                }
                <View style={{position:"relative" ,flexDirection: 'row',marginTop:8}}>
                  <View style={{backgroundColor: variables.grayScale,  height: 1, flex: 1}} />
                </View>
              </View>
          </TouchableHighlight>
          {(this.state.show)? 
            <View underlayColor="transparent" style={{marginTop:8}}>
              <FlatList
                data={this.state.itemList}
                renderItem={this.renderItem}
                keyExtractor={item => item.ProductName}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                stickyHeaderIndices={[0]}
              />
            </View>: null }
          <TouchableOpacity style={styles.today} underlayColor={variables.borderPrimary} onPress={()=>{this.setState({show:!this.state.show})}} >
                <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{ fontWeight: 'bold',  color: variables.textSecondary, alignSelf: 'center', fontSize:14  }} >
                     {(this.state.show)? 'ซ่อนรายการสินค้า':'แสดงรายการสินค้า'} 
                    </Text>
                </View>
            </TouchableOpacity>
            </Content>
            </Card>
        </Container> 
        : <View style={{flex:3,justifyContent:'center'}}><Spinner color={variables.Maincolor} /></View>
      }
      </Container>
    );
  }
}

const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <InvoiceDetail {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default socketcontext;