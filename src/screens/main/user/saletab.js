import variables from "../../../theme/variables/commonColor";
import TimeAgo from 'react-native-timeago';
import React, { Component,  } from "react";
import appJson from "../../../../app.json";
import {
    Avatar,
    Spinner,
    Text,
    List,
    ListItem,
    Layout
} from '@ui-kitten/components';

class adminhome extends React.PureComponent {
  constructor(props) {
      super(props);
      this.state = {
          spinner:true,
          data: []
      };
  }

  componentDidMount = () =>{
      this.checkdata();
  }

  handleClick(email){
      let index = -1;
      this.props.userdata.find((item,j)=>{
          if(item.email == email){
              index = j;
              return;
          }
      }); 
      this.props.navigator.navigate("UserProfile", {data:this.props.userdata[index],route:"User"});
  }

  checkdata = () =>{
      if(this.props.userdata.length > 0){
          let array=[];
          this.props.userdata.sort(function(a, b) {
              return ((a.status == b.status) ? 0 : ((a.status > b.status) ? 1 : -1));
          });
          for(let i=0;i<this.props.userdata.length;i++){
              array.push({
                  name:this.props.userdata[i].firstname + " " +this.props.userdata[i].lastname,
                  nickname:this.props.userdata[i].nickname,
                  status:this.props.userdata[i].status,
                  offline:this.props.userdata[i].offline,
                  email:this.props.userdata[i].email,
                  imageprofile:this.props.userdata[i].imageprofile
              });
          }
          this.setState({data:array});
          this.setState({spinner:false});
      }
  }

  renderItem = ({ item }) => {
    if(item.imageprofile == undefined) item.imageprofile = "blankprofile"
    if (item.status == 'active') {
        return (
          <Layout style={{marginLeft:5, alignItems:'center',flexDirection:'row'}}>
            <Avatar shape='round' size='small' source={{ uri: appJson.url.prefix+'/user/userImage/'+item.imageprofile }}/>
            <ListItem 
              onPress={() => this.handleClick(item.email)} style={{flex:1, marginLeft: 0, borderBottomWidth: 0 }}
              title={`${item.nickname} `}
              description={`${item.name} `}
              accessory={()=>{return (<Text style={{fontSize:12, color:'#27ae60'}}>&#9679;</Text>)}}
            />
            </Layout>
        );
      }else if (item.status == 'offline') {
        return (
          <Layout style={{marginLeft:5, alignItems:'center',flexDirection:'row'}}>
            <Avatar shape='round' size='small' source={{ uri: appJson.url.prefix+'/user/userImage/'+item.imageprofile }}/>
            <ListItem 
              onPress={() => this.handleClick(item.email)} style={{flex:1, marginLeft: 0, borderBottomWidth: 0 }}
              title={`${item.nickname} `}
              description={`${item.name} `}
              accessory={()=>{return (<TimeAgo style={{fontSize:12}} time={item.offline} />)}}
            />
            </Layout>
        );
      }
      else if (item.status == 'banned') {
        return (
          <Layout style={{marginLeft:5, alignItems:'center',flexDirection:'row'}}>
            <Avatar shape='round' size='small' source={{ uri: appJson.url.prefix+'/user/userImage/'+item.imageprofile }}/>
            <ListItem 
              onPress={() => this.handleClick(item.email)} style={{flex:1, marginLeft: 0, borderBottomWidth: 0 }}
              title={`${item.nickname} `}
              description={`${item.name} `}
              accessory={()=>{return (<Text style={{color:variables.textRedflat}}>Banned</Text>)}}
            />
            </Layout>
        );
      }
    };

  render() {
      const {spinner} = this.state;
      return (
      <Layout style={{backgroundColor:variables.bgPrimary}} >
            {(spinner)? <Layout style={{flex:1, justifyContent:'center', alignItems:'center'}}><Spinner/></Layout>:
            <List
                data={this.state.data}
                style={{backgroundColor:variables.bgPrimary}}
                renderItem={this.renderItem}
                keyExtractor={item => item.name}
            />
            }
        </Layout>
      );
  }
}
export default adminhome;