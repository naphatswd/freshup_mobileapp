import React, { Component } from "react";
import {
  Container,
  View
} from "native-base";
import Header_Second from "../../../theme/compontent/headersecond";
import variables from "../../../theme/variables/commonColor";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import SocketContext from '../../../socket-context';
import { GiftedChat } from "react-native-gifted-chat";
import { StatusBar, Platform } from "react-native";
import {AUTHEN_POST} from "../../../api/restful";
import { getItem } from '../../../storage';
import { connect } from 'react-redux';

class Problem_report extends Component{
    constructor(props){
        super(props);
        this.state = {
            emp_id:null,
            messages: [],
            route:this.props.navigation.getParam('route')
        };
        this.props.socket.on('newfeed',(messages)=>{
            if(messages[0].user._id != this.state.emp_id){
                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, messages),
                  }));
            }
          });
    }

    componentDidMount = async () => {
        this.setState({emp_id:this.props.emp_id},()=>{
            AUTHEN_POST('/feedback/getFeed','')
            .then(async (response)=>{
                if(response.data!= null){
                    this.setState({
                        messages:response.data.data
                    })
                }
            })
            this.props.socket.emit('joinfeedback',this.state.emp_id);
        });
    }
    

  componentWillUnmount() {
    this.props.socket.emit('exitfeedback',this.state.emp_id);
  }


    onSend(messages = []) {
        this.props.socket.emit('feedbackMessage',messages)
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }),()=>{
            AUTHEN_POST('/feedback/newFeed',this.state.messages)
        })
    }

    render() {
        const {emp_id} = this.state;
        return(
            <Container style={{backgroundColor:variables.bgPrimary}} padder>
                <StatusBar barStyle="light-content" />
                <Header_Second title={"แจ้งปัญหา / ข้อเสนอแนะ"} navigation={this.props.navigation} route={this.state.route}/>
                <View style={{flex: 1}}>
                <GiftedChat
                    renderUsernameOnMessage={true}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: emp_id,
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
                </View>
            </Container>
        );
    }
}


const socketcontext = props => (
    <SocketContext.Consumer>
    {socket => <Problem_report {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
let mapStateToProps = state => {
    return {
      emp_id:state.userReducer.emp_id,
    }
  }

  export default connect(
    mapStateToProps
  )(socketcontext);