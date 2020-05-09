import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Header,
    Title,
    Right,
    Icon,
    Left,
    View
  } from "native-base";
import variables from "../../theme/variables/commonColor";

class Header_Second extends Component{

    constructor (props) {
        super(props);
        this.state={
            title:this.props.title,
            navigation:this.props.navigation,
            route:(this.props.route!=null)? this.props.route:""
        }
    }

    _onGoback(){
      if(this.state.route != "")
        this.props.navigation.navigate(this.state.route)
      else
        this.props.navigation.goBack();
    }

    render(){
        const {title} = this.state;
        return (
          <Header style={{backgroundColor:variables.headerBGPrimary}}>
            <Left style={{flexDirection:'row',position:"relative" }}>
              <View style={{alignSelf: 'stretch'}}>
              <Button transparent onPress={() => this._onGoback()} >
                <Icon style={{ color:variables.headerTextPrimary}} name="arrow-back" />
              </Button>
              </View>
              <View style={{alignSelf: 'stretch',justifyContent:'center'}}>
                <Title style={{ color:variables.headerTextPrimary}} >{title}</Title> 
              </View>
            </Left>
            <Right />
          </Header>
        )
    }
}

export default Header_Second