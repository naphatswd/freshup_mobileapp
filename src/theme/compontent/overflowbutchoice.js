import {
    Button,
    Text,
    Icon,
} from '@ui-kitten/components';
import React, { Component } from "react";
const ReactNT = require("react-native");
import { OverflowMenu } from "@ui-kitten/components";
import variables from "../variables/commonColor"
const { Dimensions } = ReactNT;

export default class OverFlowChoice extends React.PureComponent {

    constructor (props) {
        super(props);
        this.state={
            visible:false,
            selected:this.props.selected,
            items:this.props.items
        }
    }

    onBackdropPress = () => {
        this.setState({ visible: false });
    };
    
    onItemSelect = (idx) => {
        this.setState({ 
           selected: this.props.items[idx].title
          ,visible: false },()=>{
            this.props.selectOption(idx)
        });
    };
    
    onButtonPress = () => {
        this.setState({ visible: true });
    };

    render(){
      const { visible, items, selected } = this.state;
      return(
        <OverflowMenu
            visible={visible}
            data={items}
            placement={this.props.placement}
            style={{alignSelf:'stretch', borderWidth:1,borderColor:variables.borderInput}}
            onSelect={(idx)=>{this.onItemSelect(idx)}}
            onBackdropPress={()=>{this.onBackdropPress()}}>
            <Button
                size="small"
                textStyle={{color:variables.textPrimary}} 
                icon={()=>{return  <Icon name="arrow-ios-downward-outline"/>}} 
                onPress={()=>{this.onButtonPress()}} 
                style={{flexDirection: 'row-reverse', marginTop:5, height:'auto', backgroundColor:variables.bgPrimary, borderWidth:1, borderColor:variables.grayScale}}>
                {selected}
            </Button>
      </OverflowMenu>
      )
    }
} 