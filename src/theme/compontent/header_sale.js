import { actionCreators as Routeaction } from '../../reducers/routeReducer/actions';
import variables from "../../theme/variables/commonColor";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Header,
    Right,
    Icon,
    Left
  } from "native-base";
import { bindActionCreators } from 'redux';
import {Image} from "react-native";
class Header_Sale extends Component{
    
    constructor (props) {
        super(props);
        this.state={
            radio1: this.props.radio1 || '#808080',
            radio2: this.props.radio2 || '#808080',
            radio3: this.props.radio3 || '#808080',
            navigation:this.props.navigation,
            avatar:this.props.imgprofile
        }
    }

    toggleRadio1() {
      this.props.updateRoute(-1);
        this.handleOnpress('SaleProfile');
      }
      
      toggleRadio2() {
        this.props.updateRoute(-1);
        this.handleOnpress('SaleProduct');
    }
    
    toggleRadio3() {
      this.props.updateRoute(-1);
      this.handleOnpress('MapSurvey');
    }

    handleOnpress = (route) =>{
        const { state, navigate } = this.props.navigation; 
        navigate(route, { go_back_key: state.key });
    }

    render(){
      const { avatar } = this.state;
      return (
        <Header style={{backgroundColor:variables.bgPrimary}}>
        <Left>
        <Button onPress={()=>{this.toggleRadio1()}}
              transparent>
                {(avatar != null) ?
                <Image
                  style={{
                    marginLeft:5,
                    width: 30,
                    height: 30,
                    borderRadius: 30/ 2
                  }}
                  source={{
                    uri:avatar,
                  }}
                />
                    :<Icon style={{ marginLeft:5,color: this.state.radio1}}  name='contact' />}
            </Button>
        </Left>
        <Right>
            <Button onPress={()=>{this.toggleRadio3()}}
              transparent>
                    <Icon style={{ color: this.state.radio3}}   name='pin' />
            </Button>
            <Button onPress={()=>{this.toggleRadio2()}}
              transparent>
                    <Icon style={{ color: this.state.radio2}}   name='basket' />
            </Button>
        </Right>
      </Header>
      )
  }
}

let mapStateToProps = state => {
  return {
    imgprofile:state.userReducer.imgprofile
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
)(Header_Sale);