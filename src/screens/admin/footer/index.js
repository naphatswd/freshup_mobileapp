import { actionCreators as Routeaction } from '../../../reducers/routeReducer/actions';
import React, { Component } from 'react';
import {
    Text
  } from "native-base";
import {
    Icon,
    BottomNavigation,
    BottomNavigationTab,
  } from '@ui-kitten/components';
import { SafeAreaView } from 'react-navigation';
import variables from "../../../theme/variables/commonColor";
import IconBadge from 'react-native-icon-badge';
import SocketContext from '../../../socket-context';
import { AUTHEN_POST } from '../../../api/restful';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
class Footer_Prime extends Component{
    
  constructor(props){
    super(props);
    this.state = {
      page:(this.props.route != null)? this.props.route :0,
      BadgeCount:0
    };
    this.props.socket.on('unreadRefresh',()=>{
      this.getUnread();
    })
  }

  componentDidMount(){
    this.getUnread();
  }
  
  componentDidUpdate(prevProps){
    if(prevProps.route != this.props.route){
      this.setState({page:this.props.route});
    }
  }

  selectPage(value){
    this.props.updateRoute(value);
    this.setState({page:value});
    switch(value){
      case 0 :
        this.handleOnpress('Home');
        break;
      case 1:
        this.handleOnpress('Admin_Invoice');
        break;
      case 2:
        this.handleOnpress('frontStore');
        break;
      case 3:
        this.handleOnpress('SalesClient');
        break;
      case 4:
        this.handleOnpress('Admin_Menu');
        break;
      default:
        break;
    }
  }

  getUnread(){
    AUTHEN_POST('/user/getUnread','')
    .then(response =>{
      this.setState({BadgeCount:response.data.unread})
    })
  }

  handleOnpress = (route) =>{
    const { state, navigate } = this.props.navigation; 
    navigate(route, { go_back_key: state.key });
  }
  render(){
        return (
        <SafeAreaView forceInset={{ bottom: 'always' }}>
          <BottomNavigation
            selectedIndex={this.state.page}
            onSelect={(value)=>{this.selectPage(value)}} >
            <BottomNavigationTab title='overview' icon={(style)=>{return (<Icon { ...style } name='pie-chart-outline'/>)}}/>
            <BottomNavigationTab title='B2B' icon={(style)=>{return (<Icon { ...style } name='shopping-bag-outline'/>)}}/>
            <BottomNavigationTab title='B2C' icon={(style)=>{return (<Icon { ...style } name='briefcase-outline'/>)}}/>
            <BottomNavigationTab title='clients' icon={(style)=>{return (<Icon { ...style } name='people-outline'/>)}}/>
            <BottomNavigationTab title='menu' icon={(style)=>{return (
            <IconBadge
                  MainElement={
                    <Icon { ...style } name='menu-outline'/>
                  }
                  BadgeElement={
                    <Text style={{color:variables.bgPrimary,fontSize:9}}>{this.state.BadgeCount}</Text>
                  }
                  IconBadgeStyle={
                    {
                      height:9,
                      backgroundColor: variables.textRedflat,
                    }
                  }
                  Hidden={this.state.BadgeCount==0}
                />
            )}}/>
          </BottomNavigation>
        </SafeAreaView>
      )
    }
}

const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <Footer_Prime {...props} socket={socket} />}
  </SocketContext.Consumer>
)

let mapStateToProps = state => {
  return {
    route:state.routeReducer.route,
  }
}

let mapDispatchToProps = dispatch => {
  return{
    updateRoute: bindActionCreators(Routeaction.updateRoute, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(socketcontext);