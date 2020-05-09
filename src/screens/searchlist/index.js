import React, { Component } from "react";
import {
  Card,
  List,
  Spinner,
  Input,
  Icon,
  Select,
  ListItem,
  Layout,
  CheckBox,
  Text,
  Button
} from '@ui-kitten/components';
import { Left , Right } from "native-base";
import variables from "../../theme/variables/commonColor";
import React_Native, {Keyboard} from "react-native";
import {AUTHEN_POST} from "../../api/restful";
import Header_Admin from "../../theme/compontent/header_admin";
import Header_Sale from "../../theme/compontent/header_sale";
import SocketContext from "../../socket-context";
import { connect } from 'react-redux';
import * as FileSystem from 'expo-file-system';

const { Dimensions } = React_Native;

class SearchList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        cats:[{text:"สินค้าทั้งหมด"}],
        cats_selected:{text:"สินค้าทั้งหมด"},
        recentproduct:[],
        recentproductShow:[],
        items :[],
        FavProduct:[],
        searchterm:"",
        showdata:null,
        loading:true,
        multiple:false,
        recentIndex:0,
        Header:this.getHeader(),
    };
  }

  componentDidMount = async () => {
    new Promise.all([
      this.__getAllProduct(),
      this.__fetchCats()
    ]);
    let testfile,readfile = null;
    let recentproduct = [];
      testfile = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'recentproduct.json');
      if(testfile.exists){
      try{
          readfile = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+'recentproduct.json');}
        catch(e) {
          Toast.show({text:"Error",type:'danger'});
        }
        recentproduct = JSON.parse(readfile);
      }
      this.setState({
        recentproduct:recentproduct,
        recentproductShow:recentproduct});
  }
  
  _onGoback(){
    this.props.navigation.navigate(this.state.route);
  }

  getHeader = () =>{
    if(this.props.role == "admin"){
      return (<Header_Admin navigation={this.props.navigation} radio2={variables.mainColor}/>);
    }else if(this.props.role == 'saleman'){
      return(<Header_Sale navigation={this.props.navigation} radio2={variables.mainColor} />);
    }
  }

  pickerChange = value => {
    this.setState({
      cats_selected:value,
      searchterm:"",
      items:[],
      showdata:null
    });
    if(value.text == "สินค้าทั้งหมด")
      this.__getAllProduct();
    else
      this.__getProductList(value.text);
  };

  __fetchCats = () =>{
    AUTHEN_POST('/product/getCat', '')
      .then((response)=>{
          let temp = [
              {
                text:"สินค้าทั้งหมด"
              }
          ];
          response.data.map(item =>{
            temp.push({
                text:item
            });
          });
          this.setState({
              cats:temp
          });
      })
      .catch((error)=>{
        this.setState({loading:false});
        Toast.show({text:error,type:'danger'});
      });
  }

  __getAllProduct = async () =>{
    this.setState({loading:true});
    let testfile, readfile, productlength, favTest, favfile;
    testfile = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'products.json');
    if(testfile.exists){
    try{
        readfile = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+'products.json');}
      catch(error) {
        Toast.show({text:"error",type:'danger'});
      }
      productlength = JSON.parse(readfile).length;
    }else{
      productlength = 0;
    }
    favTest = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'favoriteProduct.json');
    if(favTest.exists){
    try{
        favfile = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+'favoriteProduct.json');}
      catch(error) {
        Toast.show({text:"error",type:'danger'});
      }
      this.setState({FavProduct:JSON.parse(favfile)});
    }else{
      favfile = [];
    }
    let body = {
      productlength:productlength
    }
    this.setState({servererror:false});
    AUTHEN_POST('/product/checkallproduct',body)
    .then( async (response)=>{
      this.setState({loading:false});
      if(response.data.status){
        let temp = JSON.parse(readfile);
        temp.forEach(item =>{
          item.checked = false;
          item.fav = false;
        });
        if(favTest.exists){
          JSON.parse(favfile).forEach(element =>{
            let idk = -1;
            temp.find((item,j)=>{
              if(item.id == element.id){
                idk = j;
                return;
              }
            });
            if(idk > -1) temp[idk].fav = true;
          });
          temp.sort((a, b) => b.fav-a.fav);
        }
        this.setState({
          items:temp,
          showdata:temp
        });
      }else{
        if(response.data.length>0){
          let result = [];
          for(let i=0;i<response.data.length;i++){
            result.push({
              id:response.data[i].ProductCode,
              name:response.data[i].ProductNameTH,
              checked:false
            })
          }
          try{
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'products.json', JSON.stringify(result));}
          catch(error) {
            Toast.show({text:"error",type:'danger'});
          }
          if(favTest.exists){
            JSON.parse(favfile).forEach(element =>{
            let idk = -1;
            result.find((item,j)=>{
              if(item.id == element.id){
                idk = j;
                return;
              }
            });
            if(idk > -1) result[idk].fav = true;
          });
        }
        result.sort((a, b) => b.fav-a.fav);
          this.setState({
            items:result,
            showdata:result});
        }
      }
    })
    .catch((error)=>{
      this.setState({loading:false});
      this.setState({servererror:true});
      Toast.show({text:"error",type:'danger'});
    });
  }

  __getProductList = async (item)=>{
    let favTest = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'favoriteProduct.json');
    if(favTest.exists){
    try{
        favfile = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+'favoriteProduct.json');}
      catch(error) {
        Toast.show({text:"error",type:'danger'});
      }
      this.setState({FavProduct:JSON.parse(favfile)});
    }
    this.setState({loading:true});
    this.setState({servererror:false});
      let body = {
        cats:item
      }
      AUTHEN_POST('/product/getproductbyCat', body)
      .then(async (response)=>{
        this.setState({loading:false});
        if(response.data.length>0){
          let result = [];
          for(let i=0;i<response.data.length;i++){
            result.push({
              id:response.data[i].ProductCode,
              name:response.data[i].ProductNameTH,
              checked:false,
              fav:false
            })
          }
          if(favTest.exists){
            JSON.parse(favfile).forEach(element =>{
            let idk = -1;
            result.find((item,j)=>{
              if(item.id == element.id){
                idk = j;
                return;
              }
            });
            if(idk > -1) result[idk].fav = true;
          });
        }
          result.sort((a, b) => b.fav-a.fav);
          this.setState({
            items:result,
            showdata:result});
        }
     })
     .catch((error)=>{
      this.setState({loading:false});
        this.setState({servererror:true});
        Toast.show({text:"error",type:'danger'});
      });
  }

  onSelected = async (item) => {
    let idk = -1;
    let temp = this.state.recentproductShow;
    temp.find((element,j)=>{
      if(element.id == item.id){
        idk = j;
        return;
      }
    });
    if(idk > -1){
      temp[idk] = item;
    }
    else if(temp.length == 3){
      temp.splice(2,1)
      temp.unshift(item);
    }else{
      temp.push(item)
    }
    this.setState({recentproductShow:[]},()=>{
      this.setState({recentproductShow:temp})
    });
    try{
      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'recentproduct.json', JSON.stringify(temp));}
    catch(error) {
      Toast.show({text:"error",type:'danger'});
    }
    this.props.navigation.navigate("Admin_Products",{selected:item});
  }

  addFavorites = async (item) =>{
    if(item.fav) item.fav=false;
    else  item.fav = true;
    let temp = this.state.FavProduct;
    let idk = -1;
    temp.find((element,j)=>{
      if(element.id == item.id){
        idk = j;
        return;
      }
    });
    if(idk > -1){
      temp.splice(idk,1);
    }else{
      temp.push(item)
    }
      let result = this.state.items;
      temp.forEach(element =>{
        let idx = -1;
        result.find((item,j)=>{
          if(item.id == element.id){
            idx = j;
            return;
          }
        });
        if(idx > -1) result[idx].fav = true;
      });
      result.sort((a, b) => b.fav-a.fav);
      this.setState({items:[],showdata:[]},()=>{
        this.setState({
          items:result,
          showdata:result,
          FavProduct:temp});
      });
    try{
      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'favoriteProduct.json', JSON.stringify(temp));}
    catch(error) {
      Toast.show({text:"error",type:'danger'});
    }
  }

  addMultiproduct = (item) =>{
    item.checked = !item.checked;
    let result = this.state.items;
    this.setState({items:[],showdata:[]},()=>{
      this.setState({
        items:result,
        showdata:result});
    });
  }

  renderHeader = () =>{
    const {loading, searchterm} = this.state;
    return(
        <Card>
          <Input
                selectTextOnFocus={true} 
                icon={(style)=>{return (<Icon { ...style } name='search'/>)}}
                value={searchterm}
                onChangeText={text => this.searchFilterFunction(text)}
                disabled={loading}
                placeholder="ค้นหา" />
        </Card>
    );
  }

  renderItem = ({item}) => {
    const {multiple} = this.state;
    return (
      <ListItem
        onPress={(multiple)?  ()=>{this.addMultiproduct(item);}:() => {this.onSelected(item);}}
        title={`${item.name} `}
        description={`${item.id} `}
        accessory={(multiple)? ()=>{return (<CheckBox style={{flexDirection:'row-reverse'}} onChange={()=>{this.addMultiproduct(item);}} checked={item.checked} textStyle={{fontSize:12, color:variables.mainColor}}/>)}
          :()=>{return (<Button onPress={()=>{this.addFavorites(item);}} appearance='ghost' status='danger' icon={()=>{return (<Icon name={(item.fav)? "star":"star-outline"} fill ={(item.fav)? "#f1c40f":variables.grayScale}/>)}}/>)}}
      />
    );
  };

  renderRecent = ({item}) =>{
    return (
      <ListItem
        onPress={() => {this.onSelected(item);}}
      //  icon={()=>{return (<Icon name="close-circle-outline" fill={variables.textRedflat} />)}}
        title={`${item.name} `}
        description={`${item.id} `}
    />
    );
  }

  searchFilterFunction = (text) =>{
    this.setState({searchterm:text.toLowerCase()});
    const newData = this.state.items.filter(item => {      
      const itemData = 
      `${item.id} ${item.name}`;
       const textData = text.toLowerCase();
       return (itemData.replace(/\s/g,'').toLowerCase().indexOf(textData) > -1 || itemData.toLowerCase().indexOf(textData) > -1);    
    });    
    this.setState({ showdata: newData });
  }

  render() {
    const {loading , showdata, Header, recentproductShow, cats, cats_selected, multiple} = this.state;
    return (
      <Layout style={{flex:1}}>
        {Header}
          {this.renderHeader()}
          {(recentproductShow.length >0)?
          <Card> 
          <Text style={{fontSize:10, color:variables.textPrimary,fontWeight:'bold'}}>ล่าสุด</Text>
            <List
                style={{backgroundColor:variables.bgPrimary}}
                horizontal={true}
                data={recentproductShow}
                keyExtractor={item => item.id}
                renderItem={this.renderRecent}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                windowSize={5}
                initialListSize={8}
                initialNumToRender={8}
            /> 
          </Card>: null}
            <Card style={{flex:1}}>
              <Layout style={{flexDirection:'row'}}>
                <Left>
                <Select
                  data={cats}
                  size='small'
                  style={{width:Dimensions.get("window").width/2.7, alignSelf:'flex-start'}}
                  controlStyle={{backgroundColor:variables.bgPrimary, borderWidth:0}}
                  labelStyle={{backgroundColor:variables.bgPrimary}}
                  textStyle={{fontSize:12, color:variables.mainColor}}
                  selectedOption={cats_selected}
                  disabled={loading}
                  onSelect={(value)=>{this.pickerChange(value)}}
                />
                </Left>
              { /* <Right>
                  <CheckBox style={{flexDirection:'row-reverse'}} onChange={()=>{this.setState({multiple:!multiple})}} checked={multiple} textStyle={{fontSize:12, color:variables.mainColor}} text='เลือกหลายรายการ'/>
                </Right>*/}
              </Layout>
              {(!loading)? 
                <List
                  style={{backgroundColor:variables.bgPrimary}}
                  extraData={showdata}
                  data={showdata}
                  keyExtractor={item => item.id}
                  renderItem={this.renderItem}
                  onScrollBeginDrag={() => Keyboard.dismiss()}
                  windowSize={5}
                  initialListSize={8}
                  initialNumToRender={8}
                />: <Layout style={{alignItems:'center'}}><Spinner /></Layout>}
            </Card> 
      </Layout>
    );
  }
}
const socketcontext = props => (
  <SocketContext.Consumer>
    {socket => <SearchList {...props} socket={socket} />}
  </SocketContext.Consumer>
);

let mapStateToProps = state => {
  return {
    emp_id:state.userReducer.emp_id,
    token:state.userReducer.token,
    store:state.userReducer.store,
    selectedStore:state.userReducer.selectedStore,
    reload:state.userReducer.reload,
    role:state.userReducer.role
  }
}

export default connect(
  mapStateToProps,
)(socketcontext);

