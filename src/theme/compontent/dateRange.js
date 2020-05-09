import React, { Component } from 'react';
import { View } from "native-base";
import { Modal,TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

const XDate = require('xdate');

export default class DateRangePicker extends Component{

    constructor (props) {
        super(props);
        this.state={
            isFromDatePicked:false,
            isToDatePicked: false,
            isModalVisible: false,
            markedDates:{}
        }
        this.open = this.open.bind(this);
    }

  componentDidMount() { this.setupInitialRange() }

  close () {
    this.setState({
      isModalVisible: false
    });
  }

  open () {
    this.setState({
      isModalVisible: true
    });
  }

  onDayPress = (day) => {
    if (!this.state.isFromDatePicked || (this.state.isFromDatePicked && this.state.isToDatePicked)) {
      this.setupStartMarker(day)
    } else if (!this.state.isToDatePicked) {
      let markedDates = {...this.state.markedDates}
      let [mMarkedDates, range] = this.setupMarkedDates(this.state.fromDate, day.dateString, markedDates)
      if (range >= 0) {
        this.setState({isFromDatePicked: true, isToDatePicked: true, markedDates: mMarkedDates})
        this.props.onSuccess(this.state.fromDate, day.dateString)
        this.close();
      } else {
        this.setupStartMarker(day)
      }
    }
  }

  setupStartMarker = (day) => {
    let markedDates = {[day.dateString]: {startingDay: true, color: this.props.theme.markColor, textColor: this.props.theme.markTextColor}}
    this.setState({isFromDatePicked: true, isToDatePicked: false, fromDate: day.dateString, markedDates: markedDates})
  }

  setupMarkedDates = (fromDate, toDate, markedDates) => {
    let mFromDate = new XDate(fromDate)
    let mToDate = new XDate(toDate)
    let range = mFromDate.diffDays(mToDate)
    if (range >= 0) {
      if (range == 0) {
        markedDates = {[toDate]: {color: this.props.theme.markColor, textColor: this.props.theme.markTextColor}}
      } else {
        for (var i = 1; i <= range; i++) {
          let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd')
          if (i < range) {
            markedDates[tempDate] = {color: this.props.theme.markColor, textColor: this.props.theme.markTextColor}
          } else {
            markedDates[tempDate] = {endingDay: true, color: this.props.theme.markColor, textColor: this.props.theme.markTextColor}
          }
        }
      }
    }
    return [markedDates, range]
  }

  setupInitialRange = () => {
    if (!this.props.initialRange) return
    let [fromDate, toDate] = this.props.initialRange
    let markedDates = {[fromDate]: {startingDay: true, color: this.props.theme.markColor, textColor: this.props.theme.markTextColor}}
    let [mMarkedDates] = this.setupMarkedDates(fromDate, toDate, markedDates)
    this.setState({markedDates: mMarkedDates, fromDate: fromDate})
  }

  render() {
    return (
        <Modal
            animationType={'none'}
            transparent={true}
            hardwareAccelerated={true}
            visible={this.state.isModalVisible} >
            <TouchableOpacity style={{flex:1,backgroundColor: 'rgba(0,0,0,0.4)'}} onPress={()=>{this.close()}}>
            <View style={{flex:1, margin:10, overflow: 'hidden', justifyContent:'center'}}>
                <Calendar {...this.props}
                style={{borderWidth:1,borderRadius:10,borderColor:"#FFF"}}
                markingType={'period'}
                markedDates={this.state.markedDates}
                onDayPress={(day) => {this.onDayPress(day)}}/>
            </View>
            </TouchableOpacity>
        </Modal>
    )
  }
}

DateRangePicker.defaultProps = {
  theme: { markColor: '#1e824c', markTextColor: '#808080' }
};