import React from "react";
import {
  Container,
  Button,
  Text,
  View,
  Toast,
  CardItem,
  Card
} from "native-base";
import {
  Spinner,
  List,
  Icon,
  Input,
  ListItem
} from '@ui-kitten/components';
import Header_Admin from "../../../theme/compontent/header_admin";
import DateTimePicker from "react-native-modal-datetime-picker";
import {cvTypeColor,formatMoney } from "../../../globalfunc";
import variables from "../../../theme/variables/commonColor";
import {Text as ReactSVGText} from 'react-native-svg';
import { Appearance } from 'react-native-appearance';
import SocketContext from '../../../socket-context';
import { PieChart } from 'react-native-svg-charts';
import { StatusBar, Keyboard, Dimensions} from 'react-native';
import {AUTHEN_POST} from '../../../api/restful';
import numeral from "numeral";
import moment from 'moment';
import { connect } from 'react-redux';

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

class Invoice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date:moment(Date.now()).format('YYYY-MM-DD'),
      chartColor:cvTypeColor(),
      defaultStore:this.props.store,
      selectedStore:this.props.selectedStore,
      store:[],
      process:null,
      loading:false,
      didkeyboardopen:false,
      searchterm:null,
      data:null,
      visualdata:null,
      cvresult:null,
      showdata:null,
      revenue:0,
      isDateTimePickerVisible: false
    };
  }

  componentDidMount() {
    this.initData();
  }

  componentDidUpdate(prevProps){
    if(prevProps.selectedStore != this.props.selectedStore && this.props.selectedStore!=null){
      this.setState({
        defaultStore:this.props.store
      },()=>{
        this.initData();
      });
    }
    if(prevProps.reload != this.props.reload){
      this.initData();
    }
  }

  initData = () =>{
    let item;
    this.state.defaultStore.map(element =>{
          if(element.selected){
            item = element.store;
            return element.store;
          }
      });
    this.setState({
          store:item},()=>{
              this.__getInvoice();
      });
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
 
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
 
  handleDatePicked = date => {
    this.setState({date:moment(date).format('YYYY-MM-DD')},()=>{
      this.__getInvoice();
    });
  };
  
  __getInvoice = async ()=>{
    this.setState({
      isDateTimePickerVisible: false ,
      loading:true,
      visualdata:null,
      searchterm:null,
      process:null});
    let body = {
      store_id:this.state.store,
      date:this.state.date
    }
    AUTHEN_POST('/invoice/getInvoiceByDate', body)
      .then(async (response)=>{
        if(response.data.data.length>0){
        response.data.data.sort((a, b) => parseFloat(b.NetAmount)-parseFloat(a.NetAmount));
          this.setState({
            process:1,
            loading:false,
            data:response.data.data,
            showdata:response.data.data,
            cvresult:response.data.cvresult,
            revenue:formatMoney(Math.round(response.data.amount))},()=>{
              this.__setData();
            });
        }else{
          this.setState({
            loading:false,
            process:"ยังไม่มีข้อมูล",
          });
        }
     })
      .catch((error)=>{
        this.setState({
          loading:false,
          process:null,
        });
        Toast.show({text:error,type:'danger'});
    });
  }

  __setData(){
    const {cvresult,chartColor} =this.state;
    let sum = 0;
    let visualtemp =[];
    for(let i=0;i < cvresult.length;i++){
      let index = -1;
      if(visualtemp.length > 0){
            visualtemp.find( (item,j)=>{
                if(item.Code == cvresult[i].CVLabel){
                  index = j;
                  return ;
                }
            });
            if(index == -1){
                visualtemp.push({
                  key:i+1,
                  label:cvresult[i].CVLabel,
                  Code:cvresult[i].CVLabel,
                  net:cvresult[i].Chsum,
                  amount: 0
                });
            }else{
              visualtemp[index].net+=cvresult[i].Chsum;
            }
          }
      else{
            visualtemp.push({
              key:i+1,
              label:cvresult[i].CVLabel,
              Code:cvresult[i].CVLabel,
              net:cvresult[i].Chsum,
              amount: 0
            });
      }
      sum += cvresult[i].Chsum;
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
        }
        else{
          visualtemp[i].svg={fill:"#000000"};
        }
        visualtemp[i].amount = Math.round((visualtemp[i].net/sum)*100);
    }
    visualtemp.sort((a, b) => parseFloat(b.net)-parseFloat(a.net));
    if(visualtemp.length>0)
      this.setState({visualdata:visualtemp});
  }

  renderGraphItem = ({ item }) => {
    return (
        <ListItem 
          key={item.label} 
          title={`${item.label} `}
          titleStyle={{color:item.svg.fill, fontSize:10}}
          accessory={()=>{return (<Text style={{ color:item.svg.fill, fontSize: 10 }}>
            {numeral(Math.round(item.net)).format('0.00a')} ฿ </Text>)}}
        />
    );
};

searchFilterFunction = (text) =>{
  this.setState({searchterm:text.toLowerCase()});
  const newData = this.state.data.filter(item => {      
    const itemData = 
    `${item.Account.AccountNameTH} ${item.InvoiceNumber} 
     ${item.CVNumber} ${item.Account.CVLabel} ${item.Account.Salesman}`;
     const textData = text;
     return itemData.indexOf(textData) > -1;    
  });    
  this.setState({ showdata: newData },()=>{
    let temp=0;
    for(let i=0; i< newData.length; i++){
      temp+=newData[i].NetAmount;
    }
    this.setState({revenue:formatMoney(Math.round(temp))});  
  });
}


handleClick = (item) =>{
  this.props.navigation.navigate("invDetail",{data:item.InvoiceNumber,route:'Admin_Invoice'});
}

renderItem = ({ item }) => {
  if(item.Dncn)
    return (
      <ListItem
      key={item.InvoiceNumber} 
      onPress={() => this.handleClick(item)}
      title={`${item.Account.AccountNameTH} `}
      titleStyle={{color:variables.textRedflat}}
      description={`${item.Account.CVLabel} `}
      descriptionStyle={{fontSize:8, color:variables.textRedflat}}
      accessory={()=>{return (<Text style={{ color:variables.textRedflat, fontSize: 11 }}>
        {formatMoney(Math.round(item.NetAmount))} ฿ </Text>)}}
    />
    );
    else
    return (
        <ListItem 
          key={item.InvoiceNumber} 
          onPress={() => this.handleClick(item)}
          title={`${item.Account.AccountNameTH} `}
          description={`${item.Account.CVLabel} `}
          descriptionStyle={{fontSize:8}}
          accessory={()=>{return (<Text style={{ color: variables.textPrimary, fontSize: 11 }}>
            {formatMoney(Math.round(item.NetAmount))} ฿ </Text>)}}
        />
    );
};

  render() {
    const {isDateTimePickerVisible, visualdata, process, revenue, searchterm, loading} = this.state;
    return (
      <Container >  
      <DateTimePicker
          isDarkModeEnabled={(Appearance.getColorScheme()== 'light')? false:true}
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          date={new Date(this.state.date)}
          minimumDate={new Date("2019-01-01")}
          maximumDate={new Date(moment(Date.now()).format("YYYY-MM-DD"))}
        />
      <StatusBar barStyle="light-content" />
      <Header_Admin navigation={this.props.navigation}/>
      {(process!=null)?
        <Card style={{flex:1}}>
        {(visualdata != null) ?
          <View style={{flex:1}}>
            <Input
                selectTextOnFocus={true} 
                icon={(style)=>{return (<Icon { ...style } name='search'/>)}}
                value={searchterm}
                onChangeText={text => this.searchFilterFunction(text)}
                style={{marginLeft:20, marginRight:20, marginTop:20}}
                disabled={loading}
                placeholder="ค้นหา" />
          <CardItem style={{flex:1}}>
            <List
                style={{flex:1, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
                data={this.state.showdata}
                renderItem={this.renderItem}
                keyExtractor={item => item.InvoiceNumber}
                windowSize={5}
                initialListSize={8}
                initialNumToRender={8}
                onScrollBeginDrag={() => Keyboard.dismiss()}/>
        </CardItem>
        </View>: <CardItem style={{alignSelf:'center'}}><Text>{process}</Text></CardItem>}
      </Card> 
        : <Card style={{flex:1, justifyContent:'center', alignItems:'center'}}><Spinner /></Card>}
        {(process!=null)?
        <Card style={{flex:1}}>
        <CardItem>
              <Button  onPress={this.showDateTimePicker} style={{height:'auto', justifyContent:'center',width:Dimensions.get('window').width-35,backgroundColor:variables.bgPrimary, borderWidth:1, borderColor:variables.grayScale}}>
                      <Text style={{color:variables.textPrimary, fontSize:18, fontWeight:'bold'}}>
                        {this.state.date}
                      </Text>
              </Button>
        </CardItem>
          {(visualdata != null)?
          <CardItem style={{flex:1}}>
              <PieChart
                style={{flex:1, alignSelf: 'stretch'}}
                valueAccessor={({ item }) => item.amount}
                data={visualdata}
                innerRadius={80}
                outerRadius={'80%'}>
                <Labels/>
                <ReactSVGText
                      textAnchor={"middle"}
                      alignmentBaseline={"middle"}
                      style={{
                        shadowColor: variables.shadowColor,
                        fontSize:20,
                        fontWeight:'bold',
                     }}>
                    {'฿'+ revenue}
                </ReactSVGText>
              </PieChart>
              <List
                style={{flex:1, alignSelf: "flex-start", backgroundColor:variables.bgPrimary }}
                data={visualdata}
                renderItem={this.renderGraphItem}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                keyExtractor={item => item.label}/>
          </CardItem> : 
          <CardItem style={{alignSelf:'center'}}><Text>{process}</Text></CardItem>}
      </Card> : <Card style={{flex:1, justifyContent:'center', alignItems:'center'}}><Spinner /></Card>}
      </Container>
    );
  }
}

const socketcontext = props => (
    <SocketContext.Consumer>
    {socket => <Invoice {...props} socket={socket} />}
    </SocketContext.Consumer>
)

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
)(socketcontext);