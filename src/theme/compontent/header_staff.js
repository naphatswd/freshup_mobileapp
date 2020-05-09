import { actionCreators as Routeaction } from '../../reducers/routeReducer/actions';
import variables from "../../theme/variables/commonColor";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Header,
    Title,
    Right,
    Icon,
    Left
  } from "native-base";
  import { bindActionCreators } from 'redux';
import {Image} from "react-native";
class Header_Staff extends Component{
    
    constructor (props) {
        super(props);
        this.state={
            radio1: this.props.radio1 || '#808080',
            radio2: this.props.radio2 || '#808080',
            navigation:this.props.navigation,
            avatar:this.props.imgprofile
        }
    }

    toggleRadio1() {
      this.props.updateRoute(-1);
        this.handleOnpress('StaffProfile');
    }

    handleOnpress = (route) =>{
        const { state, navigate } = this.props.navigation; 
        navigate(route, { go_back_key: state.key });
    }

    render(){
      const {avatar} = this.state;
      return (
        <Header style={{backgroundColor:variables.bgPrimary}}>
        <Left>
          <Title style={{ color:"#1e824c"}}>freshup</Title>
        </Left>
        <Right>
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
                    :<Icon style={{ color: this.state.radio1}}  name='contact' />}
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
)(Header_Staff);