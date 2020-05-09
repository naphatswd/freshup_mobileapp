import React, { Component } from "react";
import {
  View,
  Toast
} from "native-base";
import {
    Layout,
    Text,
    Spinner
} from '@ui-kitten/components';
import variables from "../../../theme/variables/commonColor";
import { Appearance } from 'react-native-appearance';
import { formatMoney } from "../../../globalfunc";
import { FlatGrid } from 'react-native-super-grid';
import { Image, Dimensions } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import PureChart from 'react-native-pure-chart';
import { AUTHEN_POST } from "../../../api/restful";
import moment from 'moment';
import { TouchableOpacity } from "react-native-gesture-handler";

class FrontDay extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state ={
          spinner:true,
          store:[],
          selectedStore:this.props.selectedStore,
          dateResult:null,
          catResult:null,
          data:null,
          sumdate:0,
          isDateTimePickerVisible: false,
          date:moment(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1)).format("DD-MMM-YYYY")
        };
    }

    componentDidMount(){
        this.getData();
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };
     
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
    
    handleDatePicked = date => {
        this.setState({date:moment(date).format("DD-MMM-YYYY")},()=>{
          this.getData();
        });
    };

    gotoDetail= (Cat) =>{
        let body = {
            store_id:this.state.selectedStore,
            startDate:this.state.date,
            endDate:this.state.date,
            cat:Cat
        }
      this.props.navigation.navigate("frontDetail",{data:body,route:'frontStore'});
    }

    renderItem = ({ item, index }) => {
        let filURI = require("../../../../assets/images/icon/NULL.png");
        switch(item.Cat) {
            case 'PORK & OTHER MEAT':
                filURI = require("../../../../assets/images/icon/PORK.png");
                break;
            case 'CHICKEN':
                filURI = require("../../../../assets/images/icon/CHICKEN.png");
                break;
            case 'DUCK':
                filURI = require("../../../../assets/images/icon/DUCK.png");
                break;
            case 'SAUSAGE':
                filURI = require("../../../../assets/images/icon/SAUSAGE.png");
                break;
            case 'FROZEN-RTE':
                filURI = require("../../../../assets/images/icon/FROZEN-RTE.png");
                break;
            case 'EGG':
                filURI = require("../../../../assets/images/icon/EGG.png");
                break;
            case 'FROZEN-RTC':
                filURI = require("../../../../assets/images/icon/FROZEN-RTC.png");
                break;
            case 'COOKING INGRED':
                filURI = require("../../../../assets/images/icon/COOKINGINGRED.png");
                break;
            case 'BEVERAGE':
                filURI = require("../../../../assets/images/icon/BEVERAGE.png");
                break;
            case 'RICE & STAPLES':
                filURI = require("../../../../assets/images/icon/RICE.png");
                break;
            case 'DAIRY':
                filURI = require("../../../../assets/images/icon/DAIRY.png");
                break;
            case 'FROZEN-OTHER':
                filURI = require("../../../../assets/images/icon/FROZEN-OTHER.png");
                break;
            case 'SEAFOOD':
                filURI = require("../../../../assets/images/icon/SEAFOOD.png");
                break;
            case 'INSTANT FOOD':
                filURI = require("../../../../assets/images/icon/INSTANTFOOD.png");
                break;
            case 'SUGAR':
                filURI = require("../../../../assets/images/icon/SUGAR.png");
                break;
            case 'LIQUOR & TOBACCO':
                filURI = require("../../../../assets/images/icon/LIQUOR.png");
                break;
            case 'HOUSEHOLD':
                filURI = require("../../../../assets/images/icon/HOUSEHOLD.png");
                break;
            case 'SNACK':
                filURI = require("../../../../assets/images/icon/SNACK.png");
                break;
            case 'CANNED & DRIED PRODUCT':
                filURI = require("../../../../assets/images/icon/CANNED.png");
                break;
            case 'BREAKFAST':
                filURI = require("../../../../assets/images/icon/BREAKFAST.png");
                break;
            case 'PET FOOD':
                filURI = require("../../../../assets/images/icon/PETFOOD.png");
                break;
            case 'FRUITS & VEGETABLE':
                filURI = require("../../../../assets/images/icon/FRUITS.png");
                break;
            case 'BAKERY':
                filURI = require("../../../../assets/images/icon/BAKERY.png");
                break;
            case 'BEEF':
                filURI = require("../../../../assets/images/icon/BEEF.png");
                break;
            case 'MUAN CHON COFFEE':
                filURI = require("../../../../assets/images/icon/MUANCHON.png");
                break;
            case 'COFFEE':
                filURI = require("../../../../assets/images/icon/COFFEE.png");
                break;
            default:
                filURI = require("../../../../assets/images/icon/NULL.png");
                break;          
        }
        return (
            <View style={{flex:1,alignSelf:'center'}}>
                <TouchableOpacity onPress={()=>{this.gotoDetail(item.Cat)}}>
                <Image source={filURI}/>
                <Text style={{textAlign:'center',marginTop:5,fontSize:14, color:variables.textPrimary, fontWeight:'bold'}}>{formatMoney(Math.round(item.sum))} ฿</Text>
                
                </TouchableOpacity>
            </View>
    )};

    getData = async ()=>{
        this.hideDateTimePicker();
        this.setState({
          spinner:true,
          sum:null,
          dateResult:null,
          catResult:null,
          data:null});
        let body ={
          store_id:this.state.selectedStore,
          startDate:this.state.date,
          endDate:this.state.date
        }
        AUTHEN_POST('/front/frontByDate', body)
          .then(async (response)=>{
            this.setState({spinner:false})
            if(response.data.dateResult.length>0){
                let sum = response.data.dateResult.reduce(function (sum, item) {
                    return sum + item.sum;
                }, 0);
            this.setState({
                sum:sum,
                catResult:response.data.catResult,
                data:response.data},()=>{
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
            this.state.data.dateResult.find((element,j)=>{
                if(element.Date ==i){
                    index = j;
                    return;
                }
            });
            if(index > -1){
                temp.push({
                    x:i.toString(),
                    y:Math.round(this.state.data.dateResult[index].sum)
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

    componentDidUpdate(prevProps) {
        if(prevProps.selectedStore != this.props.selectedStore && this.props.selectedStore!=null){
          this.setState({selectedStore:this.props.selectedStore},()=>{
              this.getData();
          });
        }
    }

    render() {
        const {isDateTimePickerVisible, date, spinner, dateResult, catResult, sum} = this.state;
        return(
            <View style={{flex:1, paddingTop:10}}>
                <DateTimePicker
                    isDarkModeEnabled={(Appearance.getColorScheme()== 'light')? false:true}
                    isVisible={isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    date={new Date(date)}
                    minimumDate={new Date("2019-01-01")}
                    maximumDate={new Date(moment(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1)).format("YYYY-MM-DD"))}/>
                {(!spinner)?
                <View style={{flex:1}}>
                <Text style={{fontWeight: 'bold',  color: variables.textUnit, textAlign: 'right', fontSize:12, marginRight:5 }} onPress={()=>{this.showDateTimePicker()}}>{this.state.date}</Text>
                    {(dateResult!=null)?
                        <View style={{flex:1}}>
                                <PureChart
                                    style={{width:Dimensions.get('window').width}} 
                                    defaultColumnWidth={11}
                                    defaultColumnMargin={10}
                                    data={dateResult} type={'bar'} />
                                <Layout style={{flexDirection:'row',justifyContent:'center'}}>
                                    <Text style={{textAlign:'center',fontWeight: 'bold',  color: variables.textPrimary9, fontSize:14, marginRight:5}}>{formatMoney(Math.round(sum))}</Text>
                                </Layout>
                                {(catResult != null) ? 
                                    <FlatGrid
                                        style={{marginTop:10}}
                                        itemDimension={100}
                                        items={catResult}
                                        renderItem={this.renderItem}/>:null 
                                }
                        </View>:<View style={{flex:1, justifyContent:'center'}}><Text style={{textAlign:'center'}}> ไม่มีข้อมูลการขาย </Text></View>
                    }           
                </View>:
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text style={{textAlign:'center'}}>{"รอนานหน่อยนะค้าบบ\nใจเย็นๆนะค้าบบ\n"}</Text><Spinner /></View>
                }
            </View>
        );
    }
}
export default FrontDay;