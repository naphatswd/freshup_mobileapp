import React, { Component,  } from "react";
import {
  Container,
  Text,
  Icon,
  Tabs,
  Tab,
  TabHeading
} from "native-base";
import Header_Staff from "../../../theme/compontent/header_staff";
import variables from "../../../theme/variables/commonColor";
import { StatusBar} from 'react-native';
import Vacatab from './vacahome';
import VacaHistorytab from './vacahistory';
import SocketContext from '../../../socket-context';

class Vacation extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container >
      <StatusBar barStyle="light-content" />
      <Header_Staff navigation={this.props.navigation}/>
      <Tabs style={{ elevation: 2 }}>
          <Tab
            heading={
              <TabHeading>
                <Icon name="pulse" />
                <Text style={{alignSelf: 'center', fontSize:10}}>แจ้งลางาน</Text>
              </TabHeading>
            }
          >
          <Vacatab socket={this.props.socket} />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Icon name="calendar" />
                <Text style={{alignSelf: 'center', fontSize:10}}>ประวัติการลา</Text>
              </TabHeading>
            }
          >
          <VacaHistorytab  socket={this.props.socket} />
          </Tab>
        </Tabs> 
      </Container>
    );
  }
}
const socketcontext = props => (
  <SocketContext.Consumer>
  {socket => <Vacation {...props} socket={socket} />}
  </SocketContext.Consumer>
)
export default socketcontext;