import React, { Component,  } from "react";
import moment from 'moment';
import {
    Content,
    Text,
    Button,
    View,
    Toast,
    Left,
    Right
} from "native-base";
import variables from "../../../theme/variables/commonColor";
import { TouchableOpacity, Picker, TextInput } from 'react-native';
import { ProgressDialog } from 'react-native-simple-dialogs';
import DateRangePicker from "../../../theme/compontent/dateRange";
import styles from "./styles";
import {AUTHEN_POST} from '../../../api/restful';

let ViewComponents;

class vacahome extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          spinner:false,
          disabled:true,
          startDate:null,
          endDate:null,
          detail:null,
          dupdate:null,
          vactype:"vacation"
        };
        this.confirmDate = this.confirmDate.bind(this);
        this.openCalendar = this.openCalendar.bind(this);
    }

    confirmDate = async ({startDate, endDate}) =>{
      this.setState({dupdate:null});
      ViewComponents = null;
      let body = {};
      body.startDate = startDate;
      body.endDate = endDate;
      AUTHEN_POST('/vacation/checkvacation', body)
      .then(async (response)=>{
        if(response.data.length > 0){
         Toast.show({
           text: "You already booked these date.",
           type: 'danger'
         });
         ViewComponents = response.data.map((type)=> 
               <View style={styles.clock} key={type.date}>
                 <Left>
                   <Text style={{marginLeft: 10, color: variables.grayScale }}>{type.date}</Text>
                  </Left>
                  <Right>
                   <Text style={{marginRight: 10, color: variables.mainColor }} >{type.status}</Text>
                  </Right>
             </View>);
             
         this.setState({dupdate:response.data});
        } else{
         this.setState({startDate:moment(startDate).format('YYYY-MM-DD')});
         this.setState({endDate:moment(endDate).format('YYYY-MM-DD')});
         if(startDate != null && endDate !=null && this.state.vactype!=null && this.state.detail!=null){
           this.setState({disabled:false});
         }else {
           this.setState({disabled:true});
         }
        }
      })
      .catch(()=>{
        Toast.show({text: "Error !", type: "danger"});
        this.setState({spinner: false});
      });
    }

    selectedvactype(itemValue, itemIndex){
      this.setState({vactype: itemValue});
      if(this.state.startDate != null && this.state.endDate !=null && itemValue!=null && this.state.detail!=null){
        this.setState({disabled:false});
      }else {
        this.setState({disabled:true});
      }
    }

    ondetail(text){
      if(text.trim() != "")
        this.setState({detail:text});
      else
        this.setState({detail:null});

      if(this.state.startDate != null && this.state.endDate !=null && this.state.vactype!=null && text.trim() != ""){
        this.setState({disabled:false});
      }else {
        this.setState({disabled:true});
      }
    }

    openCalendar() {
      this.calendar && this.calendar.open();
    }

    submitVacation = async () =>{
      this.setState({
        spinner:true,
        disabled:true});
      let body = {};
          body.startDate = this.state.startDate;
          body.endDate = this.state.endDate;
          body.vactype = this.state.vactype;
          body.detail = this.state.detail;
      AUTHEN_POST('/vacation/newvacation', body)
      .then(async (response)=>{
        this.setState({spinner:false});
         if(response.data){
          Toast.show({
            text: "Success wait for approve",
            type: "success"
          });
          this.setState({
              startDate:null,
              endDate:null,
              detail:null,
              vactype:"vacation"});
          this.props.socket.emit('vacarefresh',obj);
         }
      })
      .catch(()=>{
        this.setState({
          spinner:false,
          disabled:false});
      });
    }

    render() {
        const {startDate,endDate,vactype,spinner,disabled,dupdate,detail} = this.state;
        return (
        <Content  >
          <ProgressDialog
        visible={spinner}
        title="กำลังดาวน์โหลด..."
        message="กรุณารอสักครู่..."
        activityIndicatorColor={variables.bgPrimary}
      />
          <View
            style={{marginTop: 5, flex:1}}>
            <Text style={{ marginLeft: 10, color: variables.grayScale}} >เลือกวันลา</Text>
            <TouchableOpacity style={styles.today} underlayColor={variables.borderPrimary} onPress={this.openCalendar}>
            <View style={{flex:1}}>
              <Text style={{ fontWeight: 'bold',  color: variables.textSecondary, alignSelf: 'center', fontSize:25  }} >{(startDate != null&&endDate != null)? startDate+" / "+endDate:"เลือกวันลา"}</Text>
            </View>
            </TouchableOpacity>
            <DateRangePicker
                ref={(calendar) => {this.calendar = calendar;}}
                minDate={moment(Date().now).format('YYYY-MM-DD')}
                onSuccess={(s, e) => this.confirmDate({startDate:s,endDate:e})}/>
          </View>
          <View 
            style={{ marginTop: 10, flex: 3 }}>
            <Text style={{ marginLeft: 10, color: variables.grayScale }} >เลือกรูปแบบการลา</Text>
             <View style={styles.clock}>
              <Picker
                selectedValue={vactype}
                style={styles.centerContainer}
                onValueChange={(itemValue, itemIndex) => this.selectedvactype(itemValue, itemIndex)}>
                <Picker.Item label="ลาพักร้อน" value="vacation" />
                <Picker.Item label="ลากิจ" value="business" />
                <Picker.Item label="ลาป่วย" value="sick" />
                <Picker.Item label="อื่น ๆ" value="other" />
              </Picker>
             </View>
             <Text style={{ marginLeft: 10, color: variables.grayScale }} >หมายเหตุ</Text>
             <View style={{marginTop:10}}>
             <TextInput 
                  style={{ flex:1, marginRight:10,marginLeft:10,borderRadius:10,paddingLeft:10,paddingTop:2,paddingBottom:2, borderWidth: 1, fontSize:20 }}
                  blurOnSubmit = {true}
                  maxLength = {180}
                  clearButtonMode = 'while-editing'
                  multiline = {true}
                  value = {detail}
                  onChangeText = {(text) => this.ondetail(text)}
                  />
             </View>
        </View>
        <View 
            style={{ flex: 3 }}>
             <Button 
                  block style={{ margin: 30, marginTop: 10 }}
                  disabled={disabled}
                  onPress={() => this.submitVacation()}>
              <Text>ยืนยัน</Text>
            </Button>
        </View>            
          {(!dupdate) ? null:  
          <View style={{ marginTop: 10,marginBottom:10, flex: 3 }}>
              <Text style={{ marginLeft: 10, color: variables.grayScale }} >วันที่ลาไปแล้ว</Text>{ViewComponents}</View>}
        </Content>
        );
    }
}
export default vacahome;