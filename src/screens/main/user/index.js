import React, { Component } from "react";
import {
  Toast
} from "native-base";
import {
  Icon,
  TabView,
  Tab,
  Layout,
} from '@ui-kitten/components';
import Header_Second from "../../../theme/compontent/headersecond";
import SocketContext from '../../../socket-context';
import { StatusBar, Platform } from 'react-native';
import { AUTHEN_GET } from "../../../api/restful"
import AdminTab from './admintab';
import SaleTab from './saletab';

class User extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      userdata:[],
      admindata:[],
      salemandata:[],
      selectedIndex:0
    }
  }
  
  componentDidMount() {
    this.getUser();
  }

  getUser =  ()=>{
    this.setState({userdata:[]});
    AUTHEN_GET('/user/allusers')
      .then((response)=>{
        if(response.data){
        let admindata = [];
        let salemandata = [];
        if(response.data.length > 0){
          response.data.forEach(item => {
            if(item.role == "admin") admindata.push(item);
            else if(item.role == "saleman") salemandata.push(item);
          });
          this.setState({
              admindata:admindata,
              salemandata:salemandata});
        }
      }
      })
      .catch((error)=>{
        Toast.show({
          text:error,
          type:'danger'
        });
      })
  }

  render() {
    const { selectedIndex } = this.state;
    return (
      <Layout >
      <StatusBar barStyle="light-content" />
      <Header_Second title={"พนักงาน"} navigation={this.props.navigation} route={"Admin_Menu"}/>
      <TabView
        selectedIndex={selectedIndex}
        onSelect={(value)=>{this.setState({selectedIndex:value})}}>
      <Tab title='ทีมเถ้าแก่' titleStyle={{marginLeft:10}} style={{flexDirection:'row', justifyContent:'center', height:40}} icon={()=>{return (<Icon name="people-outline" />)}}>
              {(this.state.admindata.length > 0)? 
              <AdminTab style={{flex:1}} navigator={this.props.navigation} socket={this.props.socket} userdata={this.state.admindata}/> : null}
      </Tab>
      <Tab title='เถ้าแก่ขาย' titleStyle={{marginLeft:10}} style={{flexDirection:'row', justifyContent:'center', height:40}}  icon={()=>{return (<Icon name="person-outline" />)}}>
              {(this.state.salemandata.length > 0)? 
              <SaleTab style={{flex:1}} navigator={this.props.navigation} socket={this.props.socket} userdata={this.state.salemandata}/> : null}
      </Tab>
    </TabView>
      </Layout>
    );
  }
}
const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <User {...props} socket={socket} />}
  </SocketContext.Consumer>
)
export default socketcontext;