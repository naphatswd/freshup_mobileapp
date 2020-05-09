import React, { Component } from "react";
import {
  Container,
  ListItem,
  Item,
  Text,
  Input,
  Body,
  Button,
  View,
  Content,
  Card,
  CardItem,
  Toast,
  Spinner,
  Left,
  Right
} from "native-base";
import { StatusBar, FlatList, Keyboard} from 'react-native';
import {cvTypeColor,formatMoney } from "../../../globalfunc";
import variables from "../../../theme/variables/commonColor";
import Header_Second from "../../../theme/compontent/headersecond";
import {Text as ReactSVGText} from 'react-native-svg';
import { PieChart } from 'react-native-svg-charts';
import {AUTHEN_POST} from "../../../api/restful";
import DateRangePicker from "../../../theme/compontent/dateRange";
import numeral from 'numeral';
import styles from "./styles";
import moment from 'moment';

const Labels = ({slices}) => {
      return slices.map((slice, index) => {
        const { pieCentroid, data } = slice;
          return (
            <ReactSVGText
              key={index}
              x={pieCentroid[ 0 ]}
              y={pieCentroid[ 1 ]}
              fill={'black'}
              textAnchor={'middle'}
              alignmentBaseline={'middle'}
              fontSize={12}
            >
            {formatMoney(data.amount)}%
            </ReactSVGText>
          )
      })
}

let today = 0;
class Saleperf extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        startDate:moment(new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1)).format("YYYY-MM-DD"),
        endDate:moment(Date.now()).format('YYYY-MM-DD'),
        route:this.props.navigation.getParam('route'),
        salename:this.props.navigation.getParam('data').label,
        avg:0,
        dncn:0,
        saleman:[],
        chartColor:cvTypeColor(),
        selected: null,
        showdata:null,
        visualdata:null,
        process:null,
        image:null,
        data :[],
        sumtotal:0
    };
    this.__getInvoiceBySale = this.__getInvoiceBySale.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  componentDidMount = () =>{
    this.__getInvoiceBySale({startDate:moment(new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1)).format("YYYY-MM-DD"),endDate:Date.now()});
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  handleClick = (item) =>{
    this.props.navigation.navigate("invDetail",{data:item.InvoiceNumber,route:"Saleperf"});
  }

  __getInvoiceBySale = async ({startDate, endDate}) =>{
      this.setState({
        process:null,
        visualdata:null,
        avg:0,
        dncn:0,
        data:null,
        startDate:moment(startDate).format("YYYY-MM-DD"),
        endDate:moment(endDate).format("YYYY-MM-DD"),
        sumtotal:0
      });
      let body = {
        SalesmanCode:this.props.navigation.getParam('data').salecode,
        startDate:moment(startDate).format("YYYY-MM-DD"),
        endDate:moment(endDate).format("YYYY-MM-DD")
    }
    AUTHEN_POST('/invoice/getInvoiceBySaleCode', body)
      .then(async (response)=>{
        this.setState({process:1});
          if(response.data.data.length>0){
            response.data.data.sort((a, b) => parseFloat(b.NetAmount)-parseFloat(a.NetAmount));
            response.data.data.sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.IssueDate) - new Date(a.IssueDate);
            });
            response.data.data.find( (item,j)=>{
              if(moment(item.IssueDate).format("DD-MM-YY") == moment(Date.now()).format("DD-MM-YY")){
                today = 0;
                return ;
              }
          });
              let lookup = {};
              let items = response.data.data;
              let result = [];
              for (let item, i = 0; item = items[i++];) {
                let date = item.IssueDate;
                if (!(date in lookup)) {
                  lookup[date] = 1;
                  result.push({header:true,IssueDate:moment(date).format("DD-MMM-YY")});
                  result.push(item);
                }else{
                  item.header = false;
                  result.push(item);
                }
                if(moment(date).format("DD-MM-YY") == moment(Date.now()).format("DD-MM-YY"))
                  today += item.NetAmount;
              }
            this.setState({
                showdata:result,
                data:response.data.data,
                image:"data:image/png;base64,"+response.data.avatar,
                avg:response.data.avg,
                dncn:response.data.dncn,
                sumtotal:response.data.sum
            },()=>{
                this.__setData();
            });
         }else{
           this.setState({process:"ไม่มีข้อมูล"});
         }
     })
      .catch((error)=>{
        this.setState({process:null});
        Toast.show({text:error,type:'danger'});
    });
  }

  __setData(){
    const {chartColor,data, sumtotal} =this.state;
    let visualtemp =[];
    for(let i=0;i<data.length;i++){
        if(visualtemp.length > 0){
            let index = -1;
            visualtemp.find( (item,j)=>{
                if(item.Code == data[i].Account.CVLabel){
                  item.net+=data[i].NetAmount;
                  index = j;
                  return ;
                }
            });
            if(index == -1){
                visualtemp.push({
                    key:i+1,
                    label: data[i].Account.CVLabel,
                    Code: data[i].Account.CVLabel,
                    net:data[i].NetAmount,
                    amount: 0
                });
            }
            }else{
                visualtemp.push({
                    key:i+1,
                    label: data[0].Account.CVLabel,
                    Code: data[0].Account.CVLabel,
                    net:data[0].NetAmount,
                    amount: 0
            });
        }
    }
    for(let i=0;i<visualtemp.length;i++){
        let index = -1;
        chartColor.find( (item,j)=>{
            if(visualtemp[i].Code == item.Code){
                index =j;
                return;
            }
        });
        if(index > -1){
            visualtemp[i].svg = {fill:chartColor[index].color};
        }else{
          visualtemp[i].svg = {fill:"#000000"}
        }
        visualtemp[i].amount = Math.round((visualtemp[i].net/sumtotal)*100);
    }
    visualtemp.sort((a, b) => parseFloat(b.net)-parseFloat(a.net));
    this.setState({
        visualdata:visualtemp});
  }

  
  searchFilterFunction = (text) =>{
    this.setState({searchterm:text.toLowerCase()});
    const newData = this.state.data.filter(item => {      
      const itemData = 
      `${item.Account.AccountNameTH} ${item.InvoiceNumber} 
       ${item.CVNumber} ${item.Account.CVLabel}`;
       const textData = text;
       return itemData.indexOf(textData) > -1;    
    });
    newData.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.IssueDate) - new Date(a.IssueDate);
    });
      let lookup = {};
      let items = newData;
      let result = [];
      for (let item, i = 0; item = items[i++];) {
        let date = item.IssueDate;
        if (!(date in lookup)) {
          lookup[date] = 1;
          result.push({header:true,IssueDate:moment(date).format("DD-MMM-YY")});
          result.push(item);
        }else{
          item.header = false;
          result.push(item);
        }
    }    
    this.setState({ showdata: result });
  }


  renderItem = ({ item }) => {
    return (
      <ListItem button={true} style={{borderBottomWidth: 0  }} >
        <Body>
            <View
                style={{flex: 0.5,
                  flexDirection: 'row',
                  borderRadius:10,
                  borderWidth: 0,
                  borderColor: variables.borderPrimary}}
                  underlayColor={variables.borderPrimary}>
            <Left>
                <Text style={{color: item.svg.fill, fontSize:10, fontWeight: 'bold'}} >{item.label}</Text>
            </Left>
            <Right>
              <Item style={{borderBottomWidth:0}}>
                <Text style={{ color: variables.textPrimary, fontSize:10  }} >{numeral(Math.round(item.net)).format('0.00a')}</Text>
                <Text style={{ color: variables.textUnit, fontSize:10 }}> ฿</Text>
              </Item>
            </Right>
          </View> 
        </Body>
      </ListItem>
    );
};

renderInvoice = ({ item }) => {
  if(item.header)
  return (
    <ListItem>
      <Body>
            <Text style={{textAlign:'center', fontWeight: "bold" }}>
              {item.IssueDate}
            </Text>
      </Body>
    </ListItem>
  );
  else if(item.Dncn.length > 0)
    return (
      <ListItem button={true} onPress={() => this.handleClick(item)} style={{ marginLeft: 0, borderBottomWidth: 0 }}>
      <Body>
          <View
              style={{flex: 1,
                flexDirection: 'row',
                borderColor: variables.borderPrimary}}
                underlayColor={variables.borderPrimary}>
          <Left>
              <Text style={{color: variables.textRedflat, fontSize:13 }} >{item.Account.AccountNameTH}</Text>
          </Left>
          <Right>
              <Item style={{borderBottomWidth:0}}>
                <Text style={{ color: variables.textPrimary, fontSize:13  }} >{formatMoney(Math.round(item.NetAmount))}</Text>
                <Text style={{ color: variables.textUnit, fontSize:13 }}> ฿</Text>
              </Item>
          </Right>
        </View> 
      </Body>
    </ListItem>
    );
    else
    return (
      <ListItem button={true} onPress={() => this.handleClick(item)} style={{ marginLeft: 0, borderBottomWidth: 0 }}>
      <Body>
          <View
              style={{flex: 1,
                flexDirection: 'row',
                borderColor: variables.borderPrimary}}
                underlayColor={variables.borderPrimary}>
          <Left>
              <Text style={{color: variables.textTrinary, fontSize:13 }} >{item.Account.AccountNameTH}</Text>
          </Left>
          <Right>
              <Item style={{borderBottomWidth:0}}>
                <Text style={{ color: variables.textPrimary, fontSize:13  }} >{formatMoney(Math.round(item.NetAmount))}</Text>
                <Text style={{ color: variables.textUnit, fontSize:13 }}> ฿</Text>
              </Item>
          </Right>
        </View> 
      </Body>
    </ListItem>
    );
};

  render() {
    const {visualdata, process,startDate,endDate,dncn,avg,sumtotal,image} = this.state;
    return (
      <Container >
      <DateRangePicker
                ref={(calendar) => {this.calendar = calendar;}}
                initialRange={[startDate, endDate]}
                minDate={moment('2019-01-01').format('YYYY-MM-DD')}
                maxDate={moment(Date().now).format('YYYY-MM-DD')}
                onSuccess={(s, e) => this.__getInvoiceBySale({startDate:s,endDate:e})}/>
      <StatusBar barStyle="light-content" />
            <Header_Second title={this.state.salename} navigation={this.props.navigation} image={image} route={this.state.route}/>
           <Card>
          <CardItem>
            {(process!=null)?
              <Button style={{ flex:1,backgroundColor:variables.bgButtonPrimary,justifyContent:'center'}}  onPress={this.openCalendar}>
                      <Text style={{ textAlign:'center',fontWeight: 'bold', color: variables.textPrimary, fontSize:20  }} >{(startDate != null&&endDate != null)? startDate+" / "+endDate:"ระบุวันที่"}</Text>
              </Button>
              :<Body><Spinner color={variables.mainColor} style={{alignSelf:'center'}} /></Body>}
          </CardItem>
        </Card>
        <Content style={{flex:3}}>
          <Card>
        {(process!=null)?
        <CardItem style={{flex:1}}>
        {(this.state.sumtotal != null)?
         <View style={{
          flex: 1}}>   
          <View style={styles.revenue}>
            <Left>
                <Text style={{marginLeft: 10, color: variables.textUnit, fontSize:15 }}> ลดหนี้ (ทั้งหมด) :</Text>
            </Left>
            <Right>
               <Item style={{borderBottomWidth:0}}>
                <Text style={{marginRight: 10, color: variables.textPrimary, fontSize:15  }} >{formatMoney(Math.round(dncn))}</Text>
                <Text style={{marginRight:10, color: variables.textUnit, fontSize:15  }}> ฿</Text>
               </Item>
            </Right>
          </View> 
          <View style={styles.revenue}>
            <Left>
                <Text style={{marginLeft: 10, color: variables.textUnit, fontSize:15 }}> ขายเฉลี่ยต่อวัน :</Text>
            </Left>
            <Right>
               <Item style={{borderBottomWidth:0}}>
                <Text style={{marginRight: 10, color: variables.textPrimary, fontSize:15  }} >{formatMoney(Math.round(avg))}</Text>
                <Text style={{marginRight:10, color: variables.textUnit, fontSize:15  }}> ฿</Text>
               </Item>
            </Right>
          </View> 
          <View style={styles.revenue}>
            <Left>
                <Text style={{marginLeft: 10, color: variables.textUnit, fontSize:15 }}> ทั้งหมด(หักลดหนี้) :</Text>
            </Left>
            <Right>
               <Item style={{borderBottomWidth:0}}>
                <Text style={{marginRight: 10, color: variables.textPrimary, fontSize:15  }} >{formatMoney(Math.round(sumtotal))}</Text>
                <Text style={{marginRight:10, color: variables.textUnit, fontSize:15  }}> ฿</Text>
               </Item>
            </Right>
          </View>
          <View style={styles.revenue}>
            <Left>
                <Text style={{marginLeft: 10, color: variables.textUnit, fontSize:15 }}> วันนี้ :</Text>
            </Left>
            <Right>
               <Item style={{borderBottomWidth:0}}>
                <Text style={{marginRight: 10, color: variables.textPrimary, fontSize:15  }} >{formatMoney(Math.round(today))}</Text>
                <Text style={{marginRight:10, color: variables.textUnit, fontSize:15  }}> ฿</Text>
               </Item>
            </Right>
          </View>    
          </View>: <Text style={{textAlign:'center'}}>{process}</Text>}
       </CardItem> : <Body ><Spinner color={variables.mainColor} style={{alignSelf:'center'}} /></Body>}
        </Card>
        <Card>
        {(process!=null)?
         <CardItem style={{flex:1}}>
          {(visualdata != null)?
          <Body style={{flexDirection: 'row'}}>
              <PieChart
                style={{flex:1, alignSelf: 'stretch'}}
                valueAccessor={({ item }) => item.amount}
                data={visualdata}
                innerRadius={10}
                outerRadius={'100%'}>
                <Labels/>
              </PieChart> 
              <FlatList
                style={{backgroundColor:variables.bgPrimary, alignSelf: 'flex-end'}}
                data={visualdata}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                renderItem={this.renderItem}/>
          </Body> : <Body style={{alignSelf:'center'}}><Text style={{textAlign:'center'}}>{process}</Text></Body>}
        </CardItem> : <CardItem style={{flex:1}}><Body ><Spinner color={variables.mainColor} style={{alignSelf:'center'}} /></Body></CardItem>}
        </Card>
        <Card >
        {(process!=null)?
        <View style={{flex:1}}>
        {(visualdata != null) ?
          <View>
          <CardItem >
            <Body>
            <Item rounded>
            <Input
                selectTextOnFocus={true} 
                value={this.state.searchterm}
                onChangeText={text => this.searchFilterFunction(text)}
                style={{textAlign:'center', fontSize:15 , height:30}} placeholder="ค้นหา" >
              </Input>
            </Item>
            </Body>
          </CardItem>
        <CardItem >
          <Body style={{flexDirection: 'row'}}>
            <FlatList
                style={{backgroundColor:variables.bgPrimary}}
                data={this.state.showdata}
                renderItem={this.renderInvoice}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                keyExtractor={item => item.name}/>
          </Body>
        </CardItem>
        </View>: <Text style={{textAlign:'center'}}>{process}</Text>}
      </View> 
        : <View style={{flex:1}}><CardItem style={{flex:1}}><Body ><Spinner color={variables.mainColor} style={{alignSelf:'center'}} /></Body></CardItem></View>}
      </Card> 
      </Content>
      </Container>
    );
  }
}

export default Saleperf;
