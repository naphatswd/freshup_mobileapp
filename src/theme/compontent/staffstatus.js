import React, { Component } from 'react';
import PropTypes from 'prop-types';
import variables from "../../theme/variables/commonColor";
import {
    CardItem,
    Text,
    View
  } from "native-base";
export default class Header_Second extends Component{
    static propTypes = {
        status: PropTypes.string,
        date: PropTypes.string
    }
    constructor (props) {
        super(props);
        this.state={
            status:this.props.status,
            date:this.props.date
        }
    }

    render(){
        const {status,date} = this.state;
        return (
            <CardItem
                style={{  
                    flex: 1,
                    margin:10,
                    paddingTop:20,
                    paddingBottom:20,
                    backgroundColor:'rgba(149, 165, 166,0.3)',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderRadius:10,
                    borderWidth: 1,
                    borderColor: variables.borderPrimary}}
                underlayColor={variables.borderPrimary}>
                <View style={styles.leftContainer}>
                    <Text style={{marginLeft: 10, color: "#808080" }}>{status}</Text>
                </View>
                <View style={styles.rightContainer}>
                    <Text style={{marginRight: 10, color: "#1e824c" }} >{date}</Text>
                </View>
            </CardItem> 
        )
    }
}