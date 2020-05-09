import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Header,
    Title,
    Right,
    Icon,
    Left,
    Text,
    Body
  } from "native-base";
export default class Header_Webview extends Component{
    static propTypes = {
        title: PropTypes.string,
        navigation: PropTypes.function
    }
    constructor (props) {
        super(props);
        this.state={
            title:this.props.title,
            navigation:this.props.navigation,
            route:this.props.route
        }
    }

    _onGoback(){
        this.state.navigation.navigate(this.state.route);
    }

    render(){
        const {title} = this.state;
        return (
        <Header style={{backgroundColor:variables.headerBGPrimary}}>
            <Left>
              <Button transparent onPress={() => this._onGoback()}>
                <Icon style={{ color:"#FFF"}} name="close" />
              </Button>
            </Left>
              <Body>
                  <Title style={{ color:variables.headerTextPrimary}}>{title}</Title> 
              </Body>
            <Right />
          </Header>
        )
    }
}