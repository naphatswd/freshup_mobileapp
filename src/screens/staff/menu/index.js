import React from "react";
import { Image } from "react-native";
import {
  Container
} from "native-base";
import {
  Icon,
  List,
  ListItem
} from '@ui-kitten/components';
import styles from "./style";
import variables from "../../../theme/variables/commonColor";

const drawerCover = require("../../../../assets/images/drawer-cover.png");


class Menu extends React.PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      datas:
        [ 
          {
            name: "แจ้งปัญหา / ข้อเสนอแนะ",
            route: "Problems",
            icon: "question-mark-circle-outline"
          },
          {
            name: "ออกจากระบบ",
            route: "Logout",
            icon: "log-out-outline"
          }
        ]
    };
  }

  handleOnpress = (data) =>{
    const { state, navigate } = this.props.navigation;
    navigate(data.route, { go_back_key: state.key, route:"StaffMenu" });
  }
  
  renderItem = ({ item }) => {
    return(
      <ListItem 
          onPress={() => this.handleOnpress(item)}
          icon={(style)=>{return (<Icon { ...style } name={item.icon}/>)}}
          title={`${item.name} `}
          titleStyle={{fontSize:14, fontWeight:'bold', color: variables.textTrinary}}
      />
    );
  };

  render() {
    const {datas} = this.state;
    return (
        <Container>
        <Image source={drawerCover} style={styles.drawerCover} />
          <List
            style={{flex:1, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
            data={datas}
            renderItem={this.renderItem}
            keyExtractor={item => item.name}/>
      </Container>
    );
  }
}

export default Menu;
