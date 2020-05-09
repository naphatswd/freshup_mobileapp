import { Container, Button, Icon as NativeIcon, Header, Title, Left, Right, Body } from "native-base";
import { StatusBar, BackHandler, View, Platform} from 'react-native';
import {
  Text,
  Card
} from '@ui-kitten/components';
import { Calendar } from 'react-native-calendars';
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import StepIndicator from 'react-native-step-indicator';
import React from "react";
import moment from 'moment';

const XDate = require('xdate');

class Quotation3 extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {  
      startDate:"",
      endDate:"",
      isFromDatePicked:false,
      isToDatePicked: false,
      markedDates:{}
  };
 }

  confirmDate = (startDate, endDate) =>{
    this.setState({
      startDate:moment(startDate).format('DD-MMM-YYYY'),
      endDate:moment(endDate).format('DD-MMM-YYYY')},()=>{
        this._goNextPage();
      });
  }

  onDayPress = (day) => {
    if (!this.state.isFromDatePicked || (this.state.isFromDatePicked && this.state.isToDatePicked)) {
      this.setupStartMarker(day)
    } else if (!this.state.isToDatePicked) {
      let markedDates = {...this.state.markedDates}
      let [mMarkedDates, range] = this.setupMarkedDates(this.state.fromDate, day.dateString, markedDates)
      if (range >= 0) {
        this.setState({isFromDatePicked: true, isToDatePicked: true, markedDates: mMarkedDates});
        this.confirmDate(this.state.fromDate, day.dateString);
      } else {
        this.setupStartMarker(day);
      }
    }
  }

  setupStartMarker = (day) => {
    let markedDates = {[day.dateString]: {startingDay: true, color: variables.mainColor, textColor: variables.textSecondary}}
    this.setState({isFromDatePicked: true, isToDatePicked: false, fromDate: day.dateString, markedDates: markedDates})
  }

  setupMarkedDates = (fromDate, toDate, markedDates) => {
    let mFromDate = new XDate(fromDate)
    let mToDate = new XDate(toDate)
    let range = mFromDate.diffDays(mToDate)
    if (range >= 0) {
      if (range == 0) {
        markedDates = {[toDate]: {color: variables.mainColor, textColor: variables.textSecondary}}
      } else {
        for (var i = 1; i <= range; i++) {
          let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd')
          if (i < range) {
            markedDates[tempDate] = {color: variables.mainColor, textColor: variables.textSecondary}
          } else {
            markedDates[tempDate] = {endingDay: true, color: variables.mainColor, textColor: variables.textSecondary}
          }
        }
      }
    }
    return [markedDates, range]
  }

  _onGoback(){
    this.props.navigation.goBack();
  }

  _goNextPage = ()=>{
    let body = this.props.navigation.state.params.data;
    body.EFFECTIVE_DATE = new Date(this.state.startDate).toISOString();
    body.EXPIRY_DATE = new Date(this.state.endDate).toISOString();
    this.props.navigation.navigate("Quotation4", {data:body});
  }

  render() {
    const {startDate, endDate} = this.state;
    return (
      <Container>
      <StatusBar barStyle="light-content" />
      <Header style={{ backgroundColor: variables.headerBGPrimary }}>
      <Left>
        <Button transparent onPress={() => this._onGoback()}>
          <NativeIcon
            style={{ color: variables.headerTextPrimary }}
            name="arrow-round-back"
          />
        </Button>
      </Left>
      <Body>
        <Title style={{ color: variables.headerTextPrimary }}>ใบเสนอราคา</Title>
      </Body>
      <Right />
      </Header>
      <View style={{ flex: 1, justifyContent: "center", margin: 10 }}>
        <StepIndicator 
          currentPosition={1}
          stepCount={4}
          labels={["เลือกสาขา","วันที่มีผล","สินค้า","สรุป"]}/>
      <Card style={{flex:1, marginTop:5}}>
      <View style={{ flexDirection:'row', justifyContent:'flex-end'}}>
        <Text style={{ flex:1, textAlign:'left', fontSize:10, color:variables.grayScale }} >วันที่มีผล</Text>
        <Text style={{ flex:1, textAlign:'right', fontSize:10, color:variables.grayScale }} >วันสิ้นสุด</Text>
      </View>
      <View style={{ borderRadius: 4, borderColor: variables.mainColor, borderWidth:1, flexDirection:'row'}}>
        <Text style={{ flex:1, textAlign:'center', fontSize:14, color:variables.mainColor }} >{(startDate != "")? (startDate):"วันที่มีผล"}</Text>
        <Text style={{ flex:1, textAlign:'center', fontSize:14, color:variables.mainColor }} >/</Text>
        <Text style={{ flex:1, textAlign:'center', fontSize:14, color:variables.mainColor }} >{(endDate != "")? (endDate):"วันสิ้นสุด"}</Text>
      </View>
      <Calendar 
          minDate={moment(Date().now).format("YYYY-MM-DD")}
          style={{borderWidth:1, borderRadius:10, borderColor:variables.bgPrimary}}
          markingType={'period'}
          markedDates={this.state.markedDates}
          onDayPress={(day) => {this.onDayPress(day)}}/>
      </Card>
      {Platform.OS === "ios" ? <KeyboardSpacer /> : null}
      </View>
    </Container>
    );
  }
}

export default Quotation3;
