import React, { Component } from "react";
import {
  Container,
  ListItem,
  Text,
  View,
  Button,
  Toast,
  Card,
} from "native-base";
import {
  Spinner,
  List,
  Icon,
  Input,
  ListItem as KittenListItem
} from '@ui-kitten/components';
import DateRangePicker from "../../../theme/compontent/dateRange";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Header_Sale from "../../../theme/compontent/header_sale";
import { cvTypeColor, formatMoney } from "../../../globalfunc";
import variables from "../../../theme/variables/commonColor";
import {Text as ReactSVGText} from 'react-native-svg';
import { StatusBar, Keyboard} from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import {AUTHEN_POST} from "../../../api/restful";
import Swiper from "react-native-swiper";
import { connect } from 'react-redux';
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
              fontSize={9}
            >
            {formatMoney(data.amount)}%
            </ReactSVGText>
          )
      })
}

let today = 0;
class MyPerf extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        startDate:moment(new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1)).format("YYYY-MM-DD"),
        endDate:moment(Date.now()).format('YYYY-MM-DD'),
        chartColor:cvTypeColor(),
        showdata:null,
        visualdata:null,
        process:null,
        data :[],
        saleperf:[],
        sumtotal:0
    };
    this.__getInvoiceBySale = this.__getInvoiceBySale.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  componentDidMount = () =>{
    this.__getInvoiceBySale({startDate:moment(new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1)).format("YYYY-MM-DD"),endDate:Date.now()});
  }

  componentDidUpdate(prevProps){
    if(prevProps.reload != this.props.reload){
      this.__getInvoiceBySale({startDate:moment(new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1)).format("YYYY-MM-DD"),endDate:Date.now()});
    }
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  handleClick = (item) =>{
    this.props.navigation.navigate("invDetail",{data:item.InvoiceNumber,route:"MyPerf"});
  }

  __getInvoiceBySale = async ({startDate, endDate}) =>{
      this.setState({
        process:null,
        visualdata:null,
        data:null,
        startDate:moment(startDate).format("YYYY-MM-DD"),
        endDate:moment(endDate).format("YYYY-MM-DD"),
        sumtotal:0
      });
      let body = {
        startDate:moment(startDate).format("YYYY-MM-DD"),
        endDate:moment(endDate).format("YYYY-MM-DD")
    }
    AUTHEN_POST('/user/myperformance', body)
      .then(async (response)=>{
        this.setState({process:1});
          if(response.data.data.length>0){
            response.data.data.sort((a, b) => parseFloat(b.NetAmount)-parseFloat(a.NetAmount));
            response.data.data.sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.IssueDate) - new Date(a.IssueDate);
            });
              let lookup = {};
              let items = response.data.data;
              let result = [];
              for (let item, i = 0; item = items[i++];) {
                let date = item.IssueDate;
                if (!(date in lookup)) {
                  lookup[date] = 1;
                  result.push({header:true,IssueDate:moment(date).format("DD-MMM-YY"),InvoiceNumber:moment(date).format("DD-MMM-YY")});
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
                saleperf:[{
                  text:"ลดหนี้ (ทั้งหมด)",
                  value:response.data.dncn
                },{
                  text:"ขายเฉลี่ยนต่อวัน",
                  value:response.data.avg
                },{
                  text:"ทั้งหมดหักลดหนี้",
                  value:response.data.sum
                },{
                  text:"วันนี้",
                  value:today
                }],
                data:response.data.data,
                sumtotal:response.data.sum
            },()=>{
                this.__setData();
            });
         }else{
           this.setState({process:"ไม่มีข้อมูล"});
         }
      })
     .catch(()=>{
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
       ${item.CVNumber} ${item.Account.CVLabel} ${item.Account.Salesman}`;
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
      <KittenListItem
        key={item.label}
        title={item.label}
        titleStyle={{fontSize:10, fontWeight:'bold', color: item.svg.fill}}
        accessory={()=>{return (<Text style={{ color: item.svg.fill, fontSize:10, fontWeight:'bold' }}>
          {formatMoney(Math.round(item.net))} ฿
        </Text>)}}
      />
    );
};

renderInvoice = ({ item }) => {
  if(item.header)
  return (
    <ListItem key={item.InvoiceNumber} style={{alignItems:'flex-start'}}>
            <Text style={{textAlign:'left', fontWeight: "bold", fontSize:10, color:variables.mainColor }}>
              {item.IssueDate}
            </Text>
    </ListItem>
  );
  else if(item.Dncn.length > 0)
    return (
      <KittenListItem
        key={item.InvoiceNumber}
        onPress={() => this.handleClick(item)} 
        title={item.Account.AccountNameTH}
        titleStyle={{fontSize:12, fontWeight:'bold', color: variables.textRedflat}}
        description={`${item.Account.CVLabel} `}
        descriptionStyle={{fontSize:8}}
        accessory={()=>{return (<Text style={{ color: variables.textPrimary, fontSize:12, fontWeight:'bold' }}>
        {formatMoney(Math.round(item.NetAmount))} ฿
      </Text>)}} />
    );
    else
    return (
      <KittenListItem
        key={item.InvoiceNumber}
        onPress={() => this.handleClick(item)} 
        title={item.Account.AccountNameTH}
        titleStyle={{fontSize:12, fontWeight:'bold', color: variables.textUnit}}
        description={`${item.Account.CVLabel} `}
        descriptionStyle={{fontSize:8}}
        accessory={()=>{return (<Text style={{ color: variables.textPrimary, fontSize:12, fontWeight:'bold' }}>
        {formatMoney(Math.round(item.NetAmount))} ฿
      </Text>)}} />
    )
};

  renderSaleperf = ({ item }) => {
    return (
      <KittenListItem
        key={item.text}
        title={item.text}
        titleStyle={{fontSize:14, fontWeight:'bold', color: variables.textTrinary}}
        accessory={()=>{return (<Text style={{ color: variables.textPrimary, fontSize:14, fontWeight:'bold' }}>
          {formatMoney(Math.round(item.value))} ฿
        </Text>)}}
      />
    );
  }

  render() {
    const {visualdata, process, startDate, endDate, searchterm, saleperf} = this.state;
    return (
      <Container >
      <DateRangePicker
                ref={(calendar) => {this.calendar = calendar;}}
                initialRange={[startDate, endDate]}
                minDate={moment('2019-01-01').format('YYYY-MM-DD')}
                maxDate={moment(Date().now).format('YYYY-MM-DD')}
                onSuccess={(s, e) => this.__getInvoiceBySale({startDate:s,endDate:e})}/>
      <StatusBar barStyle="light-content" />
      <Header_Sale navigation={this.props.navigation}/>
        <Card style={{flex:1, padding:20}}>
          {(process != null) ?
          <View style={{flex:1}}>
            {(visualdata != null) ?
            <View style={{flex:1}}>
              <Input
                selectTextOnFocus={true} 
                icon={(style)=>{return (<Icon { ...style } name='search'/>)}}
                value={searchterm}
                onChangeText={text => this.searchFilterFunction(text)}
                placeholder="ค้นหา" />
              <List
                style={{flex:1, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
                data={this.state.showdata}
                renderItem={this.renderInvoice}
                keyExtractor={item => item.InvoiceNumber}
                onScrollBeginDrag={() => Keyboard.dismiss()}
              /></View> : <View style={{alignSelf:'center'}}><Text>{process}</Text></View>} 
              </View> :(
                <View style={{ flex: 1, paddingBottom: 15,  justifyContent:'center', alignItems:'center' }}> 
                  <Spinner />
                </View>)}
          </Card>
        <Card style={{flex:1, padding:20}}>
            <Button disabled={(process!=null)? false:true} style={{height:'auto', justifyContent:'center', backgroundColor:variables.bgPrimary, borderWidth:1, borderColor:variables.grayScale}}  onPress={this.openCalendar}>
              <Text style={{ textAlign:'center',fontWeight: 'bold', color: variables.textPrimary, fontSize:20  }} >{(startDate != null&&endDate != null)? startDate+" / "+endDate:"ระบุวันที่"}</Text>
            </Button>
          {(process != null) ?
          <View style={{flex:1}}>
          {(visualdata != null)?
            <Swiper autoplay={false}>
            <View style={{flex:1, flexDirection: 'row'}}>
              <List
                  style={{alignSelf: "flex-start", backgroundColor:variables.bgPrimary }}
                  data={visualdata}
                  keyExtractor={item => item.label}
                  renderItem={this.renderItem} />
              </View>
              <View style={{flex:1}}>
              <List
                  style={{flex:1, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
                  data={saleperf}
                  renderItem={this.renderSaleperf}
                  keyExtractor={item => item.text}/> 
              </View>
            </Swiper> : <View style={{alignSelf:'center'}}><Text>{process}</Text></View>} 
            </View> :(
              <View style={{ flex: 1, paddingBottom: 15,  justifyContent:'center', alignItems:'center' }}> 
                <Spinner />
              </View>)}
        </Card>
      </Container>
    );
  }
}

let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    token:state.userReducer.token,
    store:state.userReducer.store,
    selectedStore:state.userReducer.selectedStore,
    reload:state.userReducer.reload
  }
}
export default connect(
  mapStateToProps
)(MyPerf);
