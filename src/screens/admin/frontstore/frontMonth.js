import React, { Component } from "react";
import {
  Spinner,
  Text,
  View,
  Toast,
  Button
} from "native-base";
import MonthPick from "../../../theme/components/yearMonthPicker";
import variables from "../../../theme/variables/commonColor";
import { formatMoney,getMonth } from "../../../globalfunc";
import { FlatGrid } from 'react-native-super-grid';
import { Image, Dimensions, Platform } from 'react-native';
import PureChart from 'react-native-pure-chart';
import {AUTHEN_POST} from "../../../api/restful";
import moment from 'moment';
import { TouchableOpacity } from "react-native-gesture-handler";

class FrontMonth extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state ={
          spinner:true,
          store:[],
          selectedStore:this.props.selectedStore,
          Month:new Date().getMonth(),
          Year:moment(new Date()).format("YYYY"),
          dateResult:null,
          catResult:null,
          data:null,
          sumdate:0,
        };
        this.showPicker = this.showPicker.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    showPicker(){
        const { selectedYear, selectedMonth } = this.state;
        this.picker.show({selectedYear, selectedMonth})
        .then(({year, month}) => {
            this.setState({
                Year: String(year),
                Month: month
            },()=>{
                this.getData();
            })
        });
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
                <TouchableOpacity>
                <Image source={filURI}/>
                <View style={{flexDirection:'row'}}>
                    <Text style={{textAlign:'center',marginTop:5,fontSize:14, color:variables.textPrimary, fontWeight:'bold'}}>{formatMoney(Math.round(item.sum))} ฿</Text>
                </View>
                </TouchableOpacity>
            </View>
    )};

    getData = async ()=>{
        this.setState({
          spinner:true,
          sum:null,
          dateResult:null,
          catResult:null,
          data:null});
        let body ={
          store_id:this.state.selectedStore,
          Month: getMonth(this.state.Month)[this.state.Month].value,
          Year:this.state.Year
        }
        AUTHEN_POST('/front/frontByMonth', body)
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
        this.state.data.dateResult.forEach(element => {
            temp.push({
                x:moment(new Date(element.Date)).format("DD/MM").toString(),
                y:Math.round(element.sum)
            });
        });
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
        const {Month, spinner, dateResult, catResult, sum} = this.state;
        return(
            <View style={{flex:1, paddingTop:10}} >
                {(!spinner)?
                <View style={{flex:1}}>
                    <Button  onPress={this.showPicker} style={{height:'auto', justifyContent:'center', alignSelf:'right',backgroundColor:variables.bgPrimary, borderWidth:0}}>
                                <Text style={{color:variables.textPrimary, fontSize:18, fontWeight:'bold', textAlign:'right'}}>
                                    {getMonth(Month)[Month].label}
                                </Text>
                    </Button>
                    {(dateResult!=null)?
                        <View style={{flex:1}}>    
                                <PureChart 
                                    defaultColumnWidth={25}
                                    defaultColumnMargin={22}
                                    data={dateResult} type={'bar'} />
                                <Text style={{textAlign:'center',fontWeight: 'bold',  color: variables.textPrimary9, fontSize:14, marginRight:5}} >{formatMoney(Math.round(sum))}</Text>
                                {(catResult != null) ? 
                                    <FlatGrid
                                        style={{marginTop:10}}
                                        itemDimension={100}
                                        items={catResult}
                                        renderItem={this.renderItem}/>:null 
                                }
                        </View>:<View style={{flex:1, justifyContent:'center'}}><Text style={{textAlign:'center'}}> ไม่มีข้อมูลการขาย </Text></View>
                    }           
                </View>:<View style={{flex:1,justifyContent:'center'}}><Spinner color={variables.Maincolor} /></View>
                }
                <MonthPick ref={(picker) => this.picker=picker}/>
            </View>
        );
    }
}
export default FrontMonth;