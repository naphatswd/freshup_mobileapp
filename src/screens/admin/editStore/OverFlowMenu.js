import { Icon } from "native-base";
import React, { Component } from "react";
import { OverflowMenu } from "@ui-kitten/components";
import variables from "../../../theme/variables/commonColor";

export default class OverFlow extends React.PureComponent {

    constructor (props) {
        super(props);
        this.state={
            visible:false,
            store:this.props.store,
            index:this.props.index,
            items:this.props.items
        }
    }

    onBackdropPress = () => {
        this.setState({ visible: false });
    };
    
    onItemSelect = (idx) => {
        this.setState({ visible: false },()=>{
            const { store,index } = this.state;
            this.props.selectOption(idx,store,index)
        });
    };
    
    onButtonPress = () => {
        this.setState({ visible: true });
    };

    render(){
      const { visible,items } = this.state;
      return(
        <OverflowMenu
            visible={visible}
            data={items}
            style={{borderWidth:1,borderColor:variables.borderInput}}
            onSelect={(idx)=>{this.onItemSelect(idx)}}
            onBackdropPress={()=>{this.onBackdropPress()}}>
        <Icon name="settings" style={{fontSize:25, color:variables.textTrinary}} onPress={()=>{this.onButtonPress()}}  />
      </OverflowMenu>
      )
    }
} 