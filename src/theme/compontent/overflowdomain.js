import { Icon, Button, Text } from "native-base";
import React, { Component } from "react";
const ReactNT = require("react-native");
import { OverflowMenu } from "@ui-kitten/components";
import variables from "../variables/commonColor"
const { Dimensions } = ReactNT;

export default class OverFlowDomain extends React.PureComponent {

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
            this.props.selectOption(this.props.items[idx].title)
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
            style={{alignSelf:'stretch', borderWidth:1,borderColor:variables.borderInput, justifyContent:'center'}}
            onSelect={(idx)=>{this.onItemSelect(idx)}}
            onBackdropPress={()=>{this.onBackdropPress()}}>
            <Button onPress={()=>{this.onButtonPress()}} style={{height:'auto'}} transparent>
              <Text style={{color:variables.textPrimary, fontSize:14}}>{selected}</Text>
              <Icon name="arrow-dropdown" style={{color:variables.textPrimary, fontSize:14}}/>
            </Button>
      </OverflowMenu>
      )
    }
} 