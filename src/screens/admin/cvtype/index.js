import React, { Component } from "react";
import {
  Container,
  Button,
  Text,
  View,
  ListItem,
  Toast
} from "native-base";
import {
  Spinner,
  Input,
  Icon,
  Card,
  List,
  ListItem as KittenListItem
} from '@ui-kitten/components';
import Header_Second from "../../../theme/compontent/headersecond";
import DateRangePicker from "../../../theme/compontent/dateRange";
import variables from "../../../theme/variables/commonColor";
import {cvTypeColor,formatMoney } from "../../../globalfunc";
import { StatusBar, Dimensions} from 'react-native';
import { AUTHEN_POST } from "../../../api/restful";
import moment from 'moment';

let unmount = false;
class Cvtype extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        startDate:moment(new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1)).format("YYYY-MM-DD"),
        endDate:moment(Date.now()).format('YYYY-MM-DD'),
        route:this.props.navigation.getParam('route'),
        cvtype:null,
        saleman:[],
        data :[],
        chartColor:cvTypeColor(),
        servererror:false,
        selected: null,
        showdata:null,
        visualdata:null,
        process:null,
        image:null,
        sumtotal:0,
        avg:0,
        dncn:0,
    };
    this.__getInvoiceBySale = this.__getInvoiceBySale.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  componentDidMount = () =>{
    this.unmount = false;
    this.__getInvoiceBySale({startDate:moment(new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1)).format("YYYY-MM-DD"),endDate:Date.now()});
    this.setState({cvtype:this.props.navigation.getParam('data').label})
  }

  componentDidUpdate(prevProps) {
    if(prevProps.navigation.getParam('data').label != this.props.navigation.getParam('data').label){
      new Promise.all([
        this.setState({
          cvtype:this.props.navigation.getParam('data').label
        }),
        this.__getInvoiceBySale({startDate:moment(new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1)).format("YYYY-MM-DD"),endDate:Date.now()})
      ]); 
    }
  }

  componentWillUnmount(){
    this.unmount = true;
  }

  openCalendar() {
    this.calendar && this.calendar.open();
  }

  handleClick = (item) =>{
    this.props.navigation.navigate("invDetail",{data:item.InvoiceNumber,route:"Cvtype"});
  }

  __getInvoiceBySale = async ({startDate, endDate}) =>{
      this.setState({
        process:null,
        visualdata:null,
        data:null,
        servererror:false,
        startDate:moment(startDate).format("YYYY-MM-DD"),
        endDate:moment(endDate).format("YYYY-MM-DD"),
        avg:0,
        dncn:0,
        sumtotal:0
      });
      let body = {
        CVLabel:this.props.navigation.getParam('data').Code,
        startDate:moment(startDate).format("YYYY-MM-DD"),
        endDate:moment(endDate).format("YYYY-MM-DD")
    }
    AUTHEN_POST('/invoice/getInvoiceByCV', body)
      .then(async (response)=>{
          if(response.data.length > 0 && !this.unmount){
            this.setState({process:1});
            response.data.sort((a, b) => parseFloat(b.NetAmount)-parseFloat(a.NetAmount));
            response.data.sort(function(a,b){
              return new Date(b.IssueDate) - new Date(a.IssueDate);
            });
            response.data.find( (item,j)=>{
              if(moment(item.IssueDate).format("DD-MM-YY") == moment(Date.now()).format("DD-MM-YY")){
                today = 0;
                return ;
              }
          });
              let lookup = {};
              let items = response.data;
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
              }
            this.setState({
                showdata:result,
                data:response.data,
                servererror:false
            });
         }else if(!this.unmount){
           this.setState({process:"ไม่มีข้อมูล",servererror:true});
         }
     })
      .catch((error)=>{
        this.setState({process:null,servererror:true});
        Toast.show({text:error,type:'danger'});
    });
  }

  searchFilterFunction = (text) =>{
    this.setState({searchterm:text.toLowerCase()});
    const newData = this.state.data.filter(item => {      
      const itemData = 
      `${item.AccountNameTH} ${item.InvoiceNumber} 
       ${item.CVNumber}`;
       const textData = text;
       return itemData.indexOf(textData) > -1;    
    });
    newData.sort(function(a,b){
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
        title={item.AccountNameTH}
        titleStyle={{fontSize:12, fontWeight:'bold', color: variables.textRedflat}}
        description={`${item.CVNumber} `}
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
        title={item.AccountNameTH}
        titleStyle={{fontSize:12, fontWeight:'bold', color: variables.textUnit}}
        description={`${item.CVNumber} `}
        descriptionStyle={{fontSize:8}}
        accessory={()=>{return (<Text style={{ color: variables.textPrimary, fontSize:12, fontWeight:'bold' }}>
        {formatMoney(Math.round(item.NetAmount))} ฿
      </Text>)}} />
    )
};

  render() {
    const {cvtype, showdata, process, startDate, endDate, servererror, searchterm, loading} = this.state;
    return (
      <Container >
        <StatusBar barStyle="light-content" />
        <DateRangePicker
                ref={(calendar) => {this.calendar = calendar;}}
                initialRange={[startDate, endDate]}
                minDate={moment('2019-01-01').format('YYYY-MM-DD')}
                maxDate={moment(Date().now).format('YYYY-MM-DD')}
                onSuccess={(s, e) => this.__getInvoiceBySale({startDate:s,endDate:e})}/>
        <Header_Second title={cvtype} navigation={this.props.navigation} image={this.state.image} route={this.state.route}/>
        <Card>
          <Button  onPress={this.openCalendar} style={{height:'auto', justifyContent:'center',backgroundColor:variables.bgPrimary, borderWidth:1, borderColor:variables.grayScale}}>
                      <Text style={{color:variables.textPrimary, fontSize:18, fontWeight:'bold'}}>
                      {(startDate != null&&endDate != null)? startDate+" / "+endDate:"ระบุวันที่"}
                      </Text>
          </Button>
        </Card>
        {(servererror)? 
        <Card style={{flex:1, justifyContent:'center', alignItems:'center'  }}>
            <Text style={{fontSize:14,textAlignVertical:'center', textAlign:'center'}}>ก็เครื่องมันแฮงค์ ไม่อย่างงั้นก็เน็ตกาก 🎵🎵🎵 </Text>
            <Button style={{height:'auto', marginTop:10, justifyContent:'center',backgroundColor:variables.mainColor,justifyContent:'center'}}  onPress={()=>this.__getInvoiceBySale({startDate:moment(new Date(new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),1)).format("YYYY-MM-DD"),endDate:Date.now()})}>
              <Text style={{ textAlign:'center',fontWeight: 'bold', color: variables.textSecondary, fontSize:20  }} >เชื่อมต่ออีกครั้ง</Text>
            </Button>
        </Card> :
        <View style={{flex:1}}>
        {(process!=null)?
        <Card style={{flex:1}}>
            <Input
                selectTextOnFocus={true} 
                icon={(style)=>{return (<Icon { ...style } name='search'/>)}}
                value={searchterm}
                onChangeText={text => this.searchFilterFunction(text)}
                disabled={loading}
                placeholder="ค้นหา" />
            <List
                style={{height:Dimensions.get('window').height/1.9, backgroundColor:variables.bgPrimary }}
                data={showdata}
                renderItem={this.renderInvoice}
                windowSize={5}
                initialListSize={8}
                initialNumToRender={8}
                keyExtractor={item => item.InvoiceNumber}/>
      </Card> 
        : (
          <Card style={{ flex: 1, justifyContent:'center', alignItems:'center' }}> 
            <Spinner />
          </Card>)}
      </View>}
      </Container>
    );
  }
}

export default Cvtype;
