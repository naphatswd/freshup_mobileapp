import React, { Component } from "react";
import {
  TabHeading,
  Container,
  CardItem,
  Spinner,
  Card,
  Tab,
  Tabs,
  Picker,
  Text,
  View
} from "native-base";
import Header_Admin from "../../../theme/compontent/header_admin";
import { StatusBar, Platform, Dimensions} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import variables from "../../../theme/variables/commonColor";
import { Appearance } from 'react-native-appearance';
import SocketContext from '../../../socket-context';
import FrontDay from "./frontDay";
import FrontWeek from "./frontWeek";
import FrontMonth from "./frontMonth";
import { connect } from 'react-redux';
import moment from 'moment';

class FrontStore extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state ={
      spinner:false,
      store:[],
      selectedStore:null,
      Header:null,
      Footer:null,
      role:this.props.role,
      attendee:null,
      isDateTimePickerVisible: false,
      servererror:false,
      date:moment(new Date()).format("YYYY-MM-DD")
    };
  }

  componentDidMount = ()=> {
    this.getHeader();
    this.setState({store:this.props.store},()=>{
      this.initData();
    });
  }

  componentDidUpdate(prevProps){
    if(prevProps.selectedStore != this.props.selectedStore && this.props.selectedStore!=null)
      this.setState({store:this.props.store},()=>{
        this.initData();
      });
    if(prevProps.reload != this.props.reload){
      this.initData();
    }
  }

  initData = () =>{
    let item = [];
    this.state.store.forEach(element =>{
      if(element.selected){
        element.store.forEach(store =>{
          item.push({
            label:store,
            value:store,
          })
        });
      }
    });
    this.setState({
      selectedStore:item[item.length-1].value,
      store:item},()=>{
      });
  }

  getHeader = () =>{
    if(this.state.role == "admin"){
      this.setState({Header:<Header_Admin navigation={this.props.navigation}/>});
    }
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
 
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({date:moment(date).format('YYYY-MM-DD')},()=>{
    });
    this.hideDateTimePicker();
  };

  handleStorePicked(itemValue){
    this.setState({selectedStore:itemValue},()=>{
    })
  }

  render() {
    const {store, selectedStore, isDateTimePickerVisible, spinner, role, date, Header, Footer}  = this.state;
    return(
      <Container  padder>
        <DateTimePicker
          isDarkModeEnabled={(Appearance.getColorScheme()== 'light')? false:true}
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          date={new Date(date)}
          minimumDate={new Date("2019-01-01")}
          maximumDate={new Date(moment(Date.now()).format("YYYY-MM-DD"))}
        />
        <StatusBar barStyle="light-content" />
        {Header}
        {(!spinner)? 
        <Card>
        {(Platform.OS === 'ios')?     
      <CardItem>
            <Picker
                selectedValue={selectedStore}
                style={{
                  width:Dimensions.get('window').width-50,
                  shadowColor: 'rgba(0,0,0, .4)', shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1, shadowRadius: 1,elevation: 2,
                  backgroundColor: variables.bgPrimary,
                  paddingTop:10,paddingBottom:10, marginLeft:10, marginRight:10
                }}
                textStyle={{
                  width:Dimensions.get('window').width-50,
                  color: variables.textPrimary,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 18
                }}
                onValueChange={(itemValue) => this.handleStorePicked(itemValue)}>{
                  store.map( (v)=>{
                   return <Picker.Item key={v.value} label={v.label} value={v.value} />
                  })
                 }
            </Picker>
           </CardItem>:
        <CardItem>
            <Picker
                selectedValue={selectedStore}
                onValueChange={(itemValue) => this.handleStorePicked(itemValue)}>{
                  store.map( (v)=>{
                   return <Picker.Item key={v.value} label={v.label} value={v.value} />
                  })
                 }
           </Picker>
           </CardItem>}
          </Card>
          :<Card><Spinner color={variables.mainColor} style={{alignSelf:'center'}} /></Card>}
            {(role != null)?
            <Card style={{flex:3}}>
                <View style={{ flex: 3, paddingBottom: 15, justifyContent:'center' }}>
                <Tabs 
                locked={true}
                style={{ elevation: 2, backgroundColor:variables.bgPrimary}}>
                  <Tab
                    heading={
                      <TabHeading
                        style={{backgroundColor:variables.bgPrimary}}>
                        <Text style={{color:variables.textPrimary ,alignSelf: 'center', fontSize:14, fontWeight:'bold'}}>Day</Text>
                      </TabHeading>
                    }
                  >
                    <FrontDay selectedStore={selectedStore} navigation={this.props.navigation}/>
                  </Tab>
                  <Tab
                    heading={
                      <TabHeading
                        style={{backgroundColor:variables.bgPrimary}}>
                        <Text style={{color:variables.textPrimary, alignSelf: 'center', fontSize:14, fontWeight:'bold'}}>Week</Text>
                      </TabHeading>
                    }
                  >
                    <FrontWeek selectedStore={selectedStore}/>
                  </Tab>
                  <Tab
                    heading={
                      <TabHeading
                        style={{backgroundColor:variables.bgPrimary}}>
                        <Text style={{color:variables.textPrimary, alignSelf: 'center', fontSize:14, fontWeight:'bold'}}>Month</Text>
                      </TabHeading>
                    }
                  >
                    <FrontMonth selectedStore={selectedStore}/>
                  </Tab>
                  </Tabs> 
                </View>
              </Card> :null}
      </Container>
    );
  }

}

const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <FrontStore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    token:state.userReducer.token,
    store:state.userReducer.store,
    role:state.userReducer.role,
    selectedStore:state.userReducer.selectedStore,
    reload:state.userReducer.reload
  }
}
export default connect(
  mapStateToProps
)(socketcontext);