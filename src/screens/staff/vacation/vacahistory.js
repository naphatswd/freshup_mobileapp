import React, { Component,  } from "react";
import moment from 'moment';
import {
  Content,
  Text,
  View,
  Left,
  Right
} from "native-base";
import variables from "../../../theme/variables/commonColor";
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Calendar  } from 'react-native-calendars';
import {AUTHEN_GET} from "../../../api/restful";
import styles from "./styles";

let newDaysObject = {};
class VacationHIstorytab extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        refreshing: false,
          spinner:false,
          selectdate:null,
          vacadate:[],
          newDaysObject:{},
          startDate:null,
          endDate:null,
          vactype:null,
          detail:null,
          status:null,
        };
      }
      
      setDay = async () =>{
        AUTHEN_GET('/vacation/vacationhistory')
        .then(async (response)=>{
        this.setState({spinner:false});
         if(response.data.length > 0){
             this.setState({vacadate:response.data});
          for(let i=0;i<response.data.length;i++){
              for(let j=0;j<response.data[i].date.length;j++){
                  if(response.data[i].date.length == 1){
                      newDaysObject = {
                          ...newDaysObject,
                          [moment(response.data[i].date[j]).format('YYYY-MM-DD')]: {
                          selected: true,startingDay: true, endingDay: true, color: variables.orangePrimary, textColor: variables.textSecondary
                          }
                      }; 
                  } else{
                  if(j==0){
                    newDaysObject = {
                      ...newDaysObject,
                      [moment(response.data[i].date[j]).format('YYYY-MM-DD')]: {
                      selected: true, startingDay: true, color: variables.orangePrimary, textColor: variables.textSecondary
                          }
                      }; 
                  }else if(j==response.data[i].date.length -1 ){
                      newDaysObject = {
                          ...newDaysObject,
                          [moment(response.data[i].date[j]).format('YYYY-MM-DD')]: {
                          selected: true, endingDay: true, color: variables.orangePrimary, textColor: variables.textSecondary
                          }
                      }; 
                  }else{
                      newDaysObject = {
                          ...newDaysObject,
                          [moment(response.data[i].date[j]).format('YYYY-MM-DD')]: {
                          selected: true, color: variables.orangePrimary, textColor: 'white'
                          }
                      }; 
                  }
               }
              }
          }
         } 
        })
        .catch((error)=>{
          this.setState({spinner:false});
        })
      }

      selectday = (day) =>{
        let result = false;
        const {vacadate} = this.state;
        for(let i=0;i<vacadate.length;i++){
            for(let j=0;j<vacadate[i].date.length;j++){
                if(moment(day.timestamp).format('YYYY-MM-DD') == moment(vacadate[i].date[j]).format('YYYY-MM-DD')){
                    result = true;
                    this.setState({startDate:moment(vacadate[i].date[0]).format('YYYY-MM-DD')});
                    this.setState({endDate:moment(vacadate[i].date[vacadate[i].date.length-1]).format('YYYY-MM-DD')});
                    this.setState({vactype:vacadate[i].vactype});
                    this.setState({detail:vacadate[i].detail})
                    this.setState({status:vacadate[i].status});
                }
            }
        }
        this.setState({selectdate:result});
      }

      render() {
        const {startDate,endDate,detail,vactype,status,spinner,selectdate} = this.state;
        return (
        <Content  >
        <ProgressDialog
        visible={spinner}
        title="กำลังดาวน์โหลด..."
        message="กรุณารอสักครู่..."
        activityIndicatorColor={variables.bgPrimary}
      />
        {(spinner)? null:
            <View
            style={{marginTop: 10, flex:1}}>
            <Calendar
              onDayPress={(day) => this.selectday(day)}
              markingType={'period'}
              markedDates={newDaysObject}
            />
          </View>
        }
        <View style={{ marginTop: 10, flex: 2 }}>
            <View style={{ position:"relative" ,flexDirection: 'row'}}>
                <View style={{flex:1, backgroundColor: variables.mainColor, marginLeft:30, marginRight:30,  height: 3, alignSelf: 'center'}} />
            </View>
        </View>
        {(selectdate) ?         
            <View style={{ flex: 3 }}>
                <Text style={{ marginTop: 10,marginLeft: 10, color: variables.grayScale }} >{startDate} / {endDate}</Text>
            <View
                style={styles.today}
                underlayColor={variables.borderPrimary}>
            <Left>
                <Text style={{marginLeft: 10, color: variables.grayScale }}>{vactype}</Text>
            </Left>
                <Text style={{marginLeft: 10, color: variables.grayScale }}>{detail}</Text>
            <Right>
                <Text style={{marginRight: 10, color: variables.mainColor }} >{status}</Text>
            </Right>
          </View> 
        </View>:null
        }
        </Content>
        );
    }
}
export default VacationHIstorytab;