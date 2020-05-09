import React, { Component } from "react";
import {
  Container,
  Text,
  Card,
  View,
} from "native-base";
import {
  Spinner,
  List,
  ListItem
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import Header_Second from "../../../theme/compontent/headersecond";
import DateTimePicker from "react-native-modal-datetime-picker";
import {StatusBar, Dimensions, Keyboard} from 'react-native';
import PureChart from 'react-native-pure-chart';
import SocketContext from '../../../socket-context';
import {AUTHEN_POST} from "../../../api/restful";
import { formatMoney } from "../../../globalfunc";
import moment from 'moment';

class FrontDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        data:null,
        route:null,
        spinner:true,
        sum:null,
        dateResult:null,
        pdResult:null,
        rawData:null
    };
  }
  
  componentDidMount() {
    this.setState({
      route:this.props.navigation.getParam('route'),
      data:this.props.navigation.getParam('data')},()=>{
          this.fetchData();
    });
  }

  fetchData = async ()=>{
    this.setState({
        spinner:true,
        sum:null,
        rawData:null,
        dateResult:null,
        pdResult:null
    });
      let body = this.state.data;
      AUTHEN_POST('/fron/dateCatTran', body)
        .then(async (response)=>{
          this.setState({spinner:false})
          if(response.data.dateResult.length>0){
              let sum = response.data.dateResult.reduce(function (sum, item) {
                  return sum + item.sum;
              }, 0);
          this.setState({
              sum:sum,
              pdResult:response.data.pdResult,
              rawData:response.data},()=>{
                  this.setData();
              });
          }
       })
        .catch((error)=>{
          this.setState({
            spinner:false});
          Toast.show({text:"Error",type:'danger'});
        });
  }

  setData = ()=>{
        let temp = []
        for (let i=6;i<=22;i++){
            let index =-1;
            this.state.rawData.dateResult.find((element,j)=>{
                if(element.Date ==i){
                    index = j;
                    return;
                }
            });
            if(index > -1){
                temp.push({
                    x:i.toString(),
                    y:Math.round(this.state.rawData.dateResult[index].sum)
                })
            }else{
                temp.push({
                    x:i.toString(),
                    y:0
                })
            }
        }
        this.setState({
            dateResult:[{
                data:temp,
                color: variables.barColor}
            ]
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
    this.hideDateTimePicker();
  };

renderItem = ({ item }) => {
    return (
      <ListItem 
          key={item.Product_Name}
          title={`${item.Product_Name} `}
          description={`${item.PRODUCT_CODE} `}
          titleStyle={{fontSize:11}}
          accessory={()=>{return (<Text style={{ color: variables.textPrimary, fontSize: 11 }}>
          {formatMoney(Math.round(item.sum))} ฿</Text>)}}          
      />
    );
};

  render() {
    const {isDateTimePickerVisible, data,dateResult,pdResult, spinner, sum} = this.state;
    return (
      <Container padder> 
      {(data != null)? 
      <View style={{flex:1}}>
      <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          date={new Date(data.startDate)}
          minimumDate={new Date("2019-01-01")}
          maximumDate={new Date(moment(Date.now()).format("YYYY-MM-DD"))}
        />
        <StatusBar barStyle="light-content" />
        <Header_Second title={data.cat} navigation={this.props.navigation} route={this.state.route}/>
        {(!spinner)?
            <Card style={{flex:1}}>
            {(dateResult!=null)?
            <View style={{flex:1}}>
                <PureChart
                    style={{width:Dimensions.get('window').width}} 
                    defaultColumnWidth={11}
                    defaultColumnMargin={10}
                    data={dateResult} type={'bar'} />
                <Text style={{textAlign:'center',fontWeight: 'bold',  color: variables.textPrimary9, fontSize:14, marginRight:5}}>{formatMoney(Math.round(sum))}</Text>
                <List
                    style={{alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
                    data={this.state.pdResult}
                    keyExtractor={item => item.Product_Name}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                    renderItem={this.renderItem}/>
            </View>
                :<View style={{flex:1, justifyContent:'center'}}><Text style={{textAlign:'center'}}> ไม่มีข้อมูลการขาย </Text></View>
            }
            </Card>:<Card style={{flex:1, justifyContent:'center', alignItems:'center'}}><Spinner /></Card>
        }  
        </View> : null}
      </Container>
    );
  }
}

const socketcontext = props => (
    <SocketContext.Consumer>
    {socket => <FrontDetail {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
export default socketcontext;
