import React, { Component } from 'react';
import { Platform } from 'react-native';
import {
  Picker,
  View,
  Card
} from "native-base";
import { getMonth } from "../../globalfunc";
import moment from 'moment';

export default class Compare_Pick extends Component{
    constructor (props) {
        super(props);
        this.state={
            selectedMonth:getMonth(new Date().getMonth()-1)[new Date().getMonth()-1].value,
        }
    }

    handleMonthPicked = (selectedMonth) =>{
        this.props.__getCompare(selectedMonth,moment(Date.now()).format('YYYY'));
    }

    componentDidUpdate(prevProps) {
      if(prevProps.comparemonth!==this.props.comparemonth){
        this.setState({
        selectedMonth: getMonth(this.props.comparemonth)[this.props.comparemonth].value});
      }
    }

    render(){
        return (
        <View>
            {(Platform.OS === 'ios') ?
        <View style={{alignSelf:'center'}}>
                    <View style={{flexDirection:'row', marginTop:10 }}>
                      <Picker
                        selectedValue={getMonth(this.props.comparemonth)[this.props.comparemonth].value}
                        style={{textAlign:'center',borderBottomWidth:1, borderColor:"#39569c" }}
                        textStyle={{ color: "#000",fontWeight: 'bold' ,textAlign:'center',fontSize:16}}
                        onValueChange={(itemValue) => this.handleMonthPicked(itemValue)}>{
                          getMonth(new Date().getMonth()-1).map( (v)=>{
                            return <Picker.Item label={v.label} value={v.value} />})}
                      </Picker>
                    </View>
        </View>:
          <Card >
            <Picker
              selectedValue={getMonth(this.props.comparemonth)[this.props.comparemonth].value}
              onValueChange={(itemValue) => this.handleMonthPicked(itemValue)}>{
                getMonth(new Date().getMonth()-1).map( (v)=>{
                  return <Picker.Item label={v.label} value={v.value} color="#000" />
                })}
            </Picker>
          </Card>}
       </View>
        )
    }
}