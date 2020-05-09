import React, { Component } from "react";
import {
  Text,
  Icon,
  Item,
  View,
  Container,
  Left,
  Right,
  Card,
  Toast,
} from "native-base";
import { Select, Tooltip, Spinner} from "@ui-kitten/components";
import { StatusBar, TouchableHighlight } from "react-native";
import variables from "../../../theme/variables/commonColor";
import Header_Second from "../../../theme/compontent/headersecond";
import ProductList from "../../../theme/compontent/productlist";
import SocketContext from '../../../socket-context';
import { getItem, onSignIn } from "../../../storage";
import {AUTHEN_POST} from '../../../api/restful';
import { connect } from 'react-redux';
import { getZone } from "../../../globalfunc";

class Products extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        role:this.props.role,
        selected:this.props.navigation.state.params.selected,
        servererror:false,
        loading:false,
        selectedZone: {text:"อีสานล่าง", value:'NELOWER'},
        zone: getZone(),
        visible:false,
        product: null,
        productlist: null,
      };
    }
    
    componentDidMount = async () =>{
      let obj = await getItem("classRegion");
      let idk = -1;
      this.state.zone.find((item,j) =>{
        if(item.value == obj){
          idk =j;
          return;
        }
      })
      if(idk > -1){
        this.setState({selectedZone:{text:this.state.zone[idk].text, value:obj}},()=>{
          this.__fetchData(this.state.selected, this.state.selectedZone.value);
        });
      }else{
        this.__fetchData(this.state.selected, this.state.selectedZone.value);
      }
    }

    __fetchData = async (item,zone) =>{
      let body = {
        ProductCode:item.id,
        zone:zone
      }
      this.setState({
        product:null,productlist:null,
        loading:true,servererror:false});
      await AUTHEN_POST('/product/getproduct',body)
      .then((response)=>{
        this.setState({loading:false});
        if(response.data.ProductCode != null){
          let product = response.data;
            if(product.products != undefined){
              product.products.sort((a, b) =>
                a.label > b.label ? 1 : b.label > a.label ? -1 : 0
              );
              this.setState({ product: product }, () => {
              let products_list = [];
                products_list.push(
                  <ProductList
                    key={0}
                    products={product.products}
                  ></ProductList>);
                this.setState({ productlist: products_list });
              });
        }else{
            this.setState({ product: product });
          }
        }
      })
      .catch((error)=>{
        this.setState({loading:false,servererror:true});
        Toast.show({text:"error",type:'danger'});
      })
    }
  
    onBackdropPress = () => {
      this.setState({ visible: false });
    };
  
    onButtonPress = () => {
      this.setState({ visible: true });
    };
  
    selectRegion = async (itemValue)=>{
      new Promise.all([
        await onSignIn("classRegion", itemValue.value),
        this.setState({ selectedZone: {text:itemValue.text, value:itemValue.value} }),
        this.__fetchData(this.state.selected, itemValue.value),
      ]);
    }
  
    calCostBI01 = (product) =>{
      let temp =[], temp2=[];
      if(product.classBI01.length>0){
        let i = 0; 
        product.classBI01 =product.classBI01.sort((a, b) => parseFloat(b.GROSS_COST) - parseFloat(a.GROSS_COST));
        product.classBI01.forEach(element => {
          i++;
          temp2.push(
            <Item key={String(i)} style={{borderBottomWidth:0}}>
                <Text style={{ fontSize: 14, marginTop: 5, color: variables.textRedflat }}>
                  {element.GROSS_COST} 
                </Text>
                <Text style={{ fontSize: 14,marginLeft:5, marginTop: 5, color: variables.textPrimary }}>
                    ฿/ {element.UM_Thai}
                </Text>
              </Item>
          )
        });
        temp.push(
          <Item key={0} style={{borderBottomWidth:0}}>
            <Left>
            <Text
             style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}
            >
              class BI01
            </Text>
            </Left>
            <Right style={{marginEnd:10}}>
              {temp2}
            </Right>
          </Item>);
        return(temp);
      }else{
        return (
          <Item style={{borderBottomWidth:0}}>
            <Left>
              <Text style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}>
                        ไม่พบต้นทุน
              </Text>
            </Left>
            <Right style={{marginEnd:10}}/>
          </Item>
        )
      }
    }
  
    calCostBI02 = (product) =>{
      let temp =[], temp2=[];
      if(product.classBI02.length>0){
        let i = 0;
        product.classBI02 =product.classBI02.sort((a, b) => parseFloat(b.GROSS_COST) - parseFloat(a.GROSS_COST));
        product.classBI02.forEach(element => {
          i++;
          temp2.push(
            <Item key={String(i)} style={{borderBottomWidth:0}}>
                <Text style={{ fontSize: 14, marginTop: 5, color: variables.textRedflat }}>
                  {element.GROSS_COST} 
                </Text>
                <Text style={{ fontSize: 14,marginLeft:5, marginTop: 5, color: variables.textPrimary }}>
                    ฿/ {element.UM_Thai}
                </Text>
              </Item>
          )
        });
        temp.push(
          <Item key={0} style={{borderBottomWidth:0}}>
            <Left>
            <Text
             style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}
            >
              class BI02
            </Text>
            </Left>
            <Right style={{marginEnd:10}}>
              {temp2}
            </Right>
          </Item>);
        return(temp);
      }else{
        return (
          <Item style={{borderBottomWidth:0}}>
            <Left>
              <Text style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}>
                        ไม่พบต้นทุน
              </Text>
            </Left>
            <Right style={{marginEnd:10}}/>
          </Item>
        )
      }
    }
  
    calCostA = (product) =>{
      let temp =[], temp2=[];
      if(product.classA.length>0){
        let i=0;
        product.classA =product.classA.sort((a, b) => parseFloat(b.GROSS_COST) - parseFloat(a.GROSS_COST));
        product.classA.forEach(element => {
          i++;
          temp2.push(
            <Item key={String(i)} style={{borderBottomWidth:0}}>
                <Text style={{ fontSize: 14, marginTop: 5, color: variables.textRedflat }}>
                  {element.GROSS_COST} 
                </Text>
                <Text style={{ fontSize: 14,marginLeft:5, marginTop: 5, color: variables.textPrimary }}>
                    ฿/ {element.UM_Thai}
                </Text>
              </Item>
          )
        });
        temp.push(
          <Item key={0} style={{borderBottomWidth:0}}>
            <Left>
            <Text
             style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}
            >
              class A
            </Text>
            </Left>
            <Right style={{marginEnd:10}}>
              {temp2}
            </Right>
          </Item>);
        return(temp);
      }else{
        return (
          <Item style={{borderBottomWidth:0}}>
            <Left>
              <Text style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}>
                        ไม่พบต้นทุน
              </Text>
            </Left>
            <Right style={{marginEnd:10}}/>
          </Item>
        )
      }
    }

    render() {
        const {product, selected, visible, loading, productlist, role, selectedZone, zone} = this.state;
        return (
          <Container>
          <Header_Second title={selected.name} navigation={this.props.navigation} route={""}/>
          <StatusBar barStyle="light-content" />
          {(product != null && !loading )? (
            <Card style={{flex:1, padding:20}}>
              <TouchableHighlight
                underlayColor="transparent"
                style={{ marginTop: 8 }}
              >
                <View>
                  <Text style={{ fontSize: 14 }}>รหัสสินค้า</Text>
                  <Text
                    style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}
                  >
                    {product.ProductCode}
                  </Text>
                  <View
                    style={{
                      position: "relative",
                      flexDirection: "row",
                      marginTop: 8
                    }}
                  >
                    <View
                      style={{ backgroundColor: variables.grayScale, height: 1, flex: 1 }}
                    />
                  </View>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor="transparent"
                style={{ marginTop: 8 }}
              >
                <View>
                  <Text style={{ fontSize: 14 }}>ชื่อสินค้า</Text>
                  <Text
                    style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}
                  >
                    {selected.name}
                  </Text>
                  <View
                    style={{
                      position: "relative",
                      flexDirection: "row",
                      marginTop: 8
                    }}
                  >
                    <View
                      style={{ backgroundColor: variables.grayScale, height: 1, flex: 1 }}
                    />
                  </View>
                </View>
              </TouchableHighlight>
              {(role == "admin")? 
              <TouchableHighlight
                underlayColor="transparent"
                style={{ marginTop: 8 }}
              >
                {(!product.classBI01.length>0 && !product.classBI02.length>0 && !product.classA.length>0)?
                  <View>
                      <Item style={{borderBottomWidth:0}}>
                      <Tooltip
                        visible={visible}
                        text={"หมูสด จะแสดงต้นทุน BI01 ถ้าไม่มีจะแสดง Class A \nไส้กรอก จะแสดงต้นทุน BI02 ถ้าไม่มีจะแสดง Class A \nอื่นๆ จะแสดง Class A ทั้งหมด\n**BI01&BI02 คือ ต้นทุนโอน\nClassA คือ ราคาตลาด"}
                        onBackdropPress={this.onBackdropPress}
                        placement='right start'>
                        <Icon name="information-circle-outline" style={{color:variables.grayScale}} onPress={this.onButtonPress} />
                      </Tooltip>
                        <Text style={{ fontSize: 14 }}>ต้นทุน </Text>
                    </Item>
                  <Item style={{borderBottomWidth:0}}>
                      <Left>
                      <Text style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}>
                        ไม่พบต้นทุน
                      </Text>
                      </Left>
                    <Right style={{marginEnd:10}}/>
                  </Item>
                  <View
                    style={{
                      position: "relative",
                      flexDirection: "row",
                      marginTop: 8
                    }}
                  >
                    <View
                      style={{ backgroundColor: variables.grayScale, height: 1, flex: 1 }}
                    />
                  </View>
                  </View>:
                  <View>
                    <Item style={{borderBottomWidth:0}}>
                      <Tooltip
                        style={{width: 228}}
                        visible={visible}
                        text={"หมูสดจะแสดงต้นทุน BI01 ถ้าไม่มีจะแสดง Class A \nไส้กรอกจะแสดงต้นทุน BI02 ถ้าไม่มีจะแสดง Class A \nอื่นๆ จะแสดง Class A ทั้งหมด\n**BI01&BI02 คือ ต้นทุนโอน\nClassA คือ ราคาตลาด"}
                        onBackdropPress={this.onBackdropPress}
                        placement='right start'>
                        <Icon name="information-circle-outline" style={{color:variables.grayScale}} onPress={this.onButtonPress} />
                      </Tooltip>
                        <Text style={{ fontSize: 14 }}>ต้นทุน </Text>
                    </Item>
                    {(product.classBI01.length>0)? this.calCostBI01(product):null}
                    {(product.classBI02.length>0)? this.calCostBI02(product):null}
                    {(product.classA.length>0)? this.calCostA(product):null}
                  <View
                    style={{
                      position: "relative",
                      flexDirection: "row",
                      marginTop: 8
                    }}
                  >
                    <View
                      style={{ backgroundColor: variables.grayScale, height: 1, flex: 1 }}
                    />
                  </View>
                </View>
                }
              </TouchableHighlight>: null}
              {(product.retail_Price != undefined) ?
                 <TouchableHighlight
                 underlayColor="transparent"
                 style={{ marginTop: 8 }}
               >
                 <View>
                   <Text style={{ fontSize: 14 }}>ราคาหน้าร้าน.</Text>
                   <Text
                     style={{ fontSize: 14, marginTop: 5, color: variables.textPrimary }}
                   >
                     {product.retail_Price} ฿
                   </Text>
                   <View
                     style={{
                       position: "relative",
                       flexDirection: "row",
                       marginTop: 8
                     }}
                   >
                     <View
                       style={{ backgroundColor: variables.grayScale, height: 1, flex: 1 }}
                     />
                   </View>
                 </View>
               </TouchableHighlight> : null
              }
              <Select
                data={zone}
                textStyle={{color:variables.textPrimary}}
                style={{marginTop:10}}
                selectedOption={selectedZone}
                onSelect={(value)=>{this.selectRegion(value)}}
              />
              {(productlist!=null)? productlist:null}
            </Card>
          ) : <Card style={{flex:1, backgroundColor: variables.bgPrimary, justifyContent:'center', alignItems:'center'}}>
            <Spinner />
        </Card>}
          </Container>
        );
    }
}

const socketcontext = props => (
    <SocketContext.Consumer>
      {socket => <Products {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
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
