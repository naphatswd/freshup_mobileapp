import { actionCreators as action } from '../../../reducers/userReducer/actions';
import React, { Component } from "react";
import {
  Left,
  Right,
} from "native-base";
import {
    Button,
    Card,
    Spinner,
    Text,
    Icon,
    List,
    ListItem,
    Layout
} from '@ui-kitten/components';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getMonth, formatMoney } from "../../../globalfunc";
import OverFlowChoice from "../../../theme/compontent/overflowbutchoice";
import MonthPick from "../../../theme/components/yearMonthPicker";
import Header_Sale from "../../../theme/compontent/header_sale";
import variables from "../../../theme/variables/commonColor";
import { StatusBar, Dimensions} from 'react-native';
import SocketContext from '../../../socket-context';
import * as FileSystem from 'expo-file-system';
import { AUTHEN_POST, AUTHEN_PUT } from "../../../api/restful";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';

class SaleHome extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      percentage:0,
      selectedGroup:this.props.selectedStore,
      selectedStore:null,
      store:this.props.store,
      allStore:null,
      avg:null,
      rr:null,
      today:null,
      loading:false,
      servererror:false,
      selectedMonth:new Date().getMonth(),
      selectedYear:new Date().getFullYear(),
      data:null,
      flatdata:null,
      sumtotal:null
    };
    this.showPicker = this.showPicker.bind(this);
  }

  componentDidMount() {
    this.prePareData();
    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        if(this.state.selectedGroup!=null)
        if(this.state.selectedGroup != this.props.selectedStore && this.props.selectedStore!=null){
          this.setState({
            store:this.props.store,
            selectedGroup:this.props.selectedStore,
            groupStore:null,
            allStore:null
          },()=>{
            this.prePareData();
          });
        }
        if(this.state.groupStore!=null)
        if(this.state.groupStore.length != this.props.store.length){
          this.setState({
            store:this.props.store,
            groupStore:null,
            allStore:null
          },()=>{
            let groupName = [], allStore = [{'title':"ทั้งหมด"}];
            this.state.store.forEach(element=>{
              groupName.push({
                'title':element.name,
                'store':element.store,
                'selected':element.selected
              });
              if(element.selected){
              this.setState({
                selectedGroup:element.title,
                selectedStore:"ทั้งหมด"})
                element.store.forEach(item =>{
                  allStore.push({
                    'title':item
                  });
                })
              }
            });
            groupName = groupName.sort((a, b) => (b.selected)-(a.selected));
            this.setState({groupStore:groupName,allStore:allStore});
          });
        }
      })
    ];
  }

  prePareData = () =>{
    let groupName =[],allStore = [{'title':"ทั้งหมด"}];
    this.state.store.forEach(element=>{
      groupName.push({
        'title':element.name,
        'store':element.store,
        'selected':element.selected
      });
      if(element.selected){
        this.setState({
          selectedGroup:element.title,
          selectedStore:"ทั้งหมด"})
        element.store.forEach(item =>{
          allStore.push({
            'title':item
          });
        })
      }
    })
    groupName = groupName.sort((a, b) => (b.selected)-(a.selected));
    this.setState({groupStore:groupName,allStore:allStore},()=>{
      this.__getStoreTotal(this.state.selectedMonth,this.state.selectedYear, allStore);
    });
  }

  componentDidUpdate(prevProps){
    if(prevProps.reload != this.props.reload){
      this.__getStoreTotal(this.state.selectedMonth,this.state.selectedYear);
    }
  }
  
  showPicker = ()=> {
    const { selectedYear, selectedMonth } = this.state;
    this.picker.show({selectedYear, selectedMonth})
    .then(({year, month}) => {
    this.__getStoreTotal(month,year,(this.state.selectedStore=="ทั้งหมด")? this.state.allStore:[{title:this.state.selectedStore}])
    this.setState({
                selectedYear: year,
                selectedMonth: month
              })
    })
  }

  handleGroupStorePick = (value)=>{
    let temp = [{'title':"ทั้งหมด"}];
    this.setState({
      selectedGroup:this.state.groupStore[value].title,
      selectedStore:"ทั้งหมด"
    })
    this.state.groupStore[value].selected = true;
    this.state.groupStore[value].store.forEach(element=>{
      temp.push({
        title:element
      })
    })
    let temp_2 = [];
    this.state.groupStore.forEach(element =>{
      temp_2.push({
        'title':element.title,
        'name':element.title,
        'store':element.store,
        'selected':(element.title == this.state.groupStore[value].title)? true:false
      })
    });
    this.setState({groupStore:temp_2})
    this.props.updateStore(temp_2);
    this.props.updateSelectedStore(this.state.groupStore[value].title);
    new Promise.all([
      this.setState({allStore:temp})
      ,
      this.__getStoreTotal(
        this.state.selectedMonth,
        this.state.selectedYear,
        temp
      ),
      this.submitStore(temp_2),
      this.UpdateStore(this.state.groupStore[value].store)]
    )
  }

  handleStorePick = (value)=>{
    this.setState({selectedStore:this.state.allStore[value].title})
    if(this.state.allStore[value].title == "ทั้งหมด"){
      this.__getStoreTotal(
        this.state.selectedMonth,
        this.state.selectedYear,
        this.state.allStore
      )
    }else{
      this.__getStoreTotal(
        this.state.selectedMonth,
        this.state.selectedYear,
        [this.state.allStore[value]]
      )
    }
  }

  submitStore = async (store) =>{
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'mystore.json', JSON.stringify(store));
  }

  UpdateStore = async(stores)=>{
       let body = {
         admin_store:stores
       }
       AUTHEN_PUT('/user/updateMyStore',body)
       .then(response => {
        if(response.data.body){
        }
        else{
          Toast.show({text:"error, try again",type:'danger'});
        }
      })
      .catch(()=>{
        Toast.show({text:"error, try again",type:'danger'});})
   }

  async __getStoreTotal(month, year, adm_store){
    let store =[];
    adm_store.map(element =>{
      if(element.title != "ทั้งหมด")
        store.push(element.title)
    })
    let body = {
      month: getMonth(month)[month].value,
      year: year.toString(),
      adm_store:store
    };
    this.setState({
      loading:true,
      servererror:false,
      flatdata:[]
    });
    AUTHEN_POST('/invoice/sumofB2B', body)
      .then(async (response)=>{
        if(response.data.data.length>0)
        {
          if(this.state.selectedMonth == new Date().getMonth())this.setState({today:response.data.today})
            this.setState({
            data:response.data.data,
            avg:response.data.avg,
            rr:response.data.rr,
            servererror:false,
            loading:false,
            percentage:(((response.data.amount)/response.data.rr)*100),
            sumtotal:response.data.amount},()=>{
              this.__setData();
          });
        }
        else if(response.data.data.length == 0){
          this.setState({
            data:[],
            avg:0,
            rr:0,
            servererror:false,
            loading:false,
            sumtotal:0});
        }
        else
          this.setState({
            loading:false,servererror:true});
     })
      .catch((error)=>{
        this.setState({
          loading:false,servererror:true});
      });
  }

  __setData(){
    const { data } = this.state;
    let other = [];
    let visualtemp = [];
    data.sort((a, b) => parseFloat(b.Chsum) - parseFloat(a.Chsum));
    if(data.length > 2){
        let temp = {
            key:3,
            label:'กลุ่มอื่นๆ',
            Code:'กลุ่มอื่นๆ',
            net:0
        }
        let j = 0;
        let i =0;
        data.forEach((element) => {
          let index = -1;
          if(j <= 2){
          if (visualtemp.length > 0) {
            visualtemp.find((item, j) => {
              if (item.Code == element.CVLabel) {
                index = j;
                return;
              }
            });
            if (index == -1) {
              visualtemp.push({
                key: j,
                label: element.CVLabel,
                Code: element.CVLabel,
                net: element.Chsum,
              });
              j++;
              i++;
            } else {
              visualtemp[index].net += element.Chsum;
            }
          } else {
            visualtemp.push({
              key: j,
              label: element.CVLabel,
              Code: element.CVLabel,
              net: element.Chsum,
            });
            j++;
            i++;
          }
         }else{
          let kindex = -1;
          other.find((item, j) => {
            if (item.Code == element.CVLabel) {
              kindex = j;
              return;
            }
          });
          if (kindex == -1) {
            other.push({
              key: i,
              label: element.CVLabel,
              Code: element.CVLabel,
              net: element.Chsum,
            });
            i++;
          } else {
            other[kindex].net += element.Chsum;
          }
          temp.net += element.Chsum;
         }
        });
        visualtemp[0].color = "#D4AF37";
        visualtemp[1].color = "#6C7A86";
        visualtemp[2].color = "#A97142";
        visualtemp.push(temp);
        visualtemp[3].color = "#000";
    }else{
        for (let i = 0; i < data.length; i++) {
            visualtemp.push({
                key: i,
                label: data[i].CVLabel,
                Code: data[i].CVLabel,
                net: data[i].Chsum,
                color: "#D4AF37"
            });
        }
    }
    this.setState({ loading:false, otherData:other,flatdata: visualtemp});
  }

  openCVType = (item) =>{
    this.props.navigation.navigate("Cvtype",{data:item,route:'SaleHome'});
  }

  renderHeader = () =>{
    const {
        sumtotal,
        selectedMonth,
        rr,
        today,
        avg,
        selectedGroup,
        selectedStore,
        percentage
    } = this.state;
        return(
            <Card>
                  <Layout style={{alignItems:'center'}}>
                  <Button 
                        size="small"
                        onPress={this.showPicker}
                        textStyle={{color:variables.textPrimary}} 
                        style={{justifyContent:'center', width:Dimensions.get('window').width/1.15, backgroundColor:variables.bgPrimary, borderWidth:1, borderColor:variables.grayScale}}>
                        {getMonth(selectedMonth)[selectedMonth].label} {this.state.selectedYear}
                      </Button>
                      <Layout style={{flexDirection:'row'}}>
                          {(this.state.groupStore != null)? 
                          <Left>
                           <OverFlowChoice selectOption={this.handleGroupStorePick} items={this.state.groupStore} placement='bottom start' selected={selectedGroup}/> 
                           </Left>
                         : null}
                          {(this.state.allStore != null)? 
                          <Right>
                            <OverFlowChoice selectOption={this.handleStorePick} items={this.state.allStore} placement='bottom end' selected={selectedStore}/> 
                          </Right>
                          : null}
                    </Layout>
                    <AnimatedCircularProgress
                          style={{marginTop:5, marginBottom:5}}
                          size={Dimensions.get('window').width/2}
                          width={Dimensions.get('window').width/23}
                          fill={percentage}
                          rotation={0}
                          lineCap="round"
                          tintColor="#2359ff"
                          backgroundColor="#e1e1e1">
                      {() => (
                          <Layout>
                              <Text style={{fontWeight:'bold', fontSize:20, textAlign:'center'}}>
                                  {formatMoney(Math.round(sumtotal)) +' ฿'}
                              </Text>
                              {(this.state.selectedMonth == new Date().getMonth() && this.state.selectedYear == new Date().getFullYear())? 
                               <Text style={{color:"#808080", fontSize:11,  textAlign:'right'}}>
                               {'ประมาณการ '+formatMoney(Math.round(rr)) +' ฿'}
                              </Text>:null  
                              }
                          </Layout>)}
                      </AnimatedCircularProgress>
                      <Layout style={{flexDirection:'row'}}>
                        <Left>
                        <Layout>
                          <Text style={{fontSize: 12, color: variables.b2cColorPrimary }}>เฉลี่ยต่อวัน</Text>
                          <Text style={{color:variables.textTrinary}}>{'฿'+formatMoney(Math.round(avg))}</Text>
                        </Layout>
                        </Left>
                        <Right>
                        <Layout>
                          <Text style={{fontSize: 12, color: variables.rrColorPrimary }}>วันนี้</Text>
                          <Text style={{color:variables.textTrinary}}>{'฿'+formatMoney(Math.round(today))}</Text>
                        </Layout>
                        </Right>
                      </Layout>
                    </Layout>
            </Card>
        );
  }

  renderCVType = ({ item }) => {
    return (
        <ListItem
          key={String(item.key)}
          onPress={()=>{this.openCVType(item);}}
          title={`${item.label} `}
          titleStyle={{fontSize:14 }}
          description={(this.state.selectedMonth == new Date().getMonth() && this.state.selectedYear == new Date().getFullYear())? "ประมาณการ: " +  formatMoney(Math.round((item.net/new Date().getDate())*(new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()))) +' ฿' : ""}
          descriptionStyle={{fontSize:10}}
          accessory={()=>{return (<Text style={{fontSize: 12,  color:variables.textPrimary}}>
            {formatMoney(Math.round(item.net))} ฿
          </Text>)}}
        />
      );
  };
  
  renderCard = ({item}) =>{
    return (
        <Card>
        {(item.key == 3) ? 
        <Layout>
            {(this.state.openOther)? 
            <Layout>
                <Button 
                        appearance={'ghost'}
                        textStyle={{color:variables.textRedflat}} 
                        onPress={()=>{this.setState({openOther:false})}}  
                        icon={()=>{return (<Icon name='close-circle-outline' fill={variables.textRedflat} />)}}>
                    ปิด</Button>
                <List
                      style={{flex:1, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
                      data={this.state.otherData}
                      renderItem={this.renderCVType}
                      keyExtractor={item => String(item.key)}
                />
            </Layout>   
               :
            <ListItem
                onPress={()=>{this.setState({openOther:true})}}
                title={`${item.label} `}
                titleStyle={{fontSize:14}}
                description={(this.state.selectedMonth == new Date().getMonth() && this.state.selectedYear == new Date().getFullYear())? "ประมาณการ: " +  formatMoney(Math.round((item.net/new Date().getDate())*(new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()))) +' ฿' : ""}
                descriptionStyle={{fontSize:10}}
                accessory={()=>{return (<Text style={{fontSize:12, color:variables.textPrimary}}>
                {formatMoney(Math.round(item.net))} ฿ </Text>)}}/> 
            }
        </Layout>:
        <ListItem
            title={`${item.label} `}
            titleStyle={{fontSize:14}}
            onPress={()=>{this.openCVType(item);}}
            description={(this.state.selectedMonth == new Date().getMonth() && this.state.selectedYear == new Date().getFullYear())? "ประมาณการ: " +  formatMoney(Math.round((item.net/new Date().getDate())*(new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()))) +' ฿' : ""}
            descriptionStyle={{fontSize:10}}
            icon={(style) =>{return (<Icon {...style} name='award' fill={item.color} />)}}
            accessory={()=>{return (<Text style={{fontSize:12, color:variables.textPrimary}}>
            {formatMoney(Math.round(item.net))} ฿ </Text>)}}
        />
        }
        </Card>
    );
  }

  render() {
    const {
      loading,
      flatdata,
      servererror
  } = this.state;

  return (
    <Layout style={{ flex: 1,}}>
      <StatusBar barStyle="light-content" />
      <Header_Sale navigation={this.props.navigation}/>
      {(servererror)? 
        <Card style={{flex:1 ,alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontSize:14,textAlignVertical:'center', textAlign:'center'}}>ก็เครื่องมันแฮงค์ ไม่อย่างงั้นก็เน็ตกาก 🎵🎵🎵 </Text>
          <Button style={{marginTop:10 ,backgroundColor:variables.mainColor}}  onPress={()=>this.__getStoreTotal(this.state.selectedMonth,this.state.selectedYear,this.state.allStore)}>
          เชื่อมต่ออีกครั้ง
          </Button>
        </Card> : 
        <Layout style={{ flex: 1,}}>
          {(loading) ? 
          <Card style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Spinner/>
          </Card> :
              <List
                  style={{flex:1, backgroundColor:variables.bgPrimary }}
                  contentContainerStyle={{paddingBottom: 8,}}
                  data={flatdata}
                  renderItem={this.renderCard}
                  ListHeaderComponent={this.renderHeader}
              />
          }
      </Layout> }
      <MonthPick ref={(picker) => this.picker=picker}/>
    </Layout>
  );
  }
}
const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <SaleHome {...props} socket={socket} />}
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

let mapDispatchToProps = dispatch => {
  return{
    updateStore: bindActionCreators(action.updateStore, dispatch),
    updateSelectedStore: bindActionCreators(action.updateSelectedStore, dispatch),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(socketcontext);