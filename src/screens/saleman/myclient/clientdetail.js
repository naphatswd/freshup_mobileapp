import {
  Spinner,
  Container,
  ListItem,
  Body,
  Text,
  Toast,
  Card,
  Left,
  Right,
  Item
} from "native-base";
import { StatusBar, View, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import Header_Second from "../../../theme/compontent/headersecond";
import numeral from 'numeral';
import SocketContext from "../../../socket-context";
import { formatMoney } from "../../../globalfunc";
import React, { Component } from "react";
import variables from "../../../theme/variables/commonColor";
import {AUTHEN_POST} from "../../../api/restful";
import styles from "./styles";
import moment from "moment";

class ClientDetail extends React.PureComponent {

  constructor(props) {
    super(props);
    let date = new Date(this.props.navigation.getParam("Lastorder"));
    this.state = {
      sum_remain:0,
      process: null,
      data: null,
      detail: null,
      sumtotal: null,
      productsum: null,
      CVNumber: null,
      CustName: null,
      order:null,
      route: null,
      startDate: moment(new Date(date.getTime() - 6 * 24 * 60 * 60 * 1000)).format("YYYY-MM-DD"),
      endDate: moment(date).format("YYYY-MM-DD")
    };
  }

  componentDidMount = () => {
    let date = new Date(this.props.navigation.getParam("Lastorder"));
        this.setState(
          {
            startDate: moment(
              new Date(date.getTime() - 6 * 24 * 60 * 60 * 1000)
            ).format("YYYY-MM-DD"),
            endDate: moment(date).format("YYYY-MM-DD"),
            CVNumber: this.props.navigation.getParam("CVNumber"),
            route: this.props.navigation.getParam("route"),
            CustName: this.props.navigation.getParam("CustName")
          },
          () => {
            this.__ClientDetail();
          });
  };
  
  __ClientDetail = async () => {
    this.setState({ detail: null }, async () => {
      let body = {
        CVNumber: this.state.CVNumber
      };
      AUTHEN_POST("/client/clientdetail", body)
        .then(async response => {
          if (response.data) {
            response.data.order.sort((a, b) => parseFloat(b.LAST_REMAINING_AMOUNT)-parseFloat(a.LAST_REMAINING_AMOUNT));
            let temp = [{DOC_NUMBER:"เลขที่",DUE_DATE:"Due Date",LAST_REMAINING_AMOUNT:"ยอดค้างชำระ",header:true}].concat(response.data.order);
            this.setState({
              detail: response.data.data,
              order: temp,
              sum_remain:response.data.order.reduce(function (sum, item) {return sum + item.LAST_REMAINING_AMOUNT},0)
            });
          } else {
            this.setState({ process: "ไม่พบข้อมูล" });
          }
        })
        .catch(() => {
          Toast.show({ text: "Error", type: "danger" });
        });
    });
  };

  goToDetail = (DOC_NUMBER) =>{
    this.props.navigation.navigate("invDetail",{data:DOC_NUMBER,route:'clientDetail'});
  }

  renderOrder = ({ item }) => {
    if(item.header)
    return (
      <ListItem button={true} >
        <Body>
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              borderRadius: 10,
              borderWidth: 0,
              borderColor: variables.borderPrimary
            }}
            underlayColor={variables.borderPrimary}
          >
          <View style={{ flex: 1, alignSelf: "stretch" }}>
              <Text style={{ color: variables.textTrinary, fontSize: 14 ,textAlign:'center' }}>
                {item.DOC_NUMBER}
              </Text>
            </View>
            <View style={{ flex: 1, alignSelf: "stretch" }}>
              <Text style={{ color: variables.textTrinary, fontSize: 14 ,textAlign:'center' }}>
                {item.DUE_DATE}
              </Text>
            </View>
            <View style={{ flex: 1, alignSelf: "stretch" }}>
              <Text style={{ color: variables.textTrinary, fontSize: 14 ,textAlign:'center' }}>
                {item.LAST_REMAINING_AMOUNT} 
              </Text>
            </View>
          </View>
        </Body>
      </ListItem>
    );
    else if(moment(new Date(item.DUE_DATE)).format("DD-MM-YYYY") < moment(new Date()).format("DD-MM-YYYY"))
    return (
      <ListItem button={true} onPress={()=>{this.goToDetail(item.DOC_NUMBER)}}>
        <Body>
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              borderRadius: 10,
              borderWidth: 0,
              borderColor: variables.borderPrimary
            }}
            underlayColor={variables.borderPrimary}
          >
          <View style={{ flex: 1, alignSelf: "stretch" }}>
              <Text style={{ color: variables.textTrinary, fontSize: 10 ,textAlign:'center' }}>
                {item.DOC_NUMBER}
              </Text>
            </View>
            <View style={{ flex: 1, alignSelf: "stretch" }}>
              <Text style={{ color: variables.textTrinary, fontSize: 10 ,textAlign:'center' }}>
                {moment(new Date(item.DUE_DATE)).format("DD-MMM-YYYY")}
              </Text>
            </View>
            <View style={{ flex: 1, alignSelf: "stretch" }}>
              <Text style={{ color: variables.textTrinary, fontSize: 10 ,textAlign:'center' }}>
                {formatMoney(Math.round(item.LAST_REMAINING_AMOUNT))} ฿
              </Text>
            </View>
          </View>
        </Body>
      </ListItem>
    );
    else 
    return (
      <ListItem button={true} onPress={()=>{this.goToDetail(item.DOC_NUMBER)}}>
        <Body>
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              borderRadius: 10,
              borderWidth: 0,
              borderColor: variables.borderPrimary
            }}
            underlayColor={variables.borderPrimary}
          >
            <View style={{ flex: 1, alignSelf: "stretch" }}>
              <Text
                style={{
                  color: variables.textTrinary,
                  fontSize: 10,
                  fontWeight: "bold",
                  textAlign:'center'
                }}
              >
                {item.DOC_NUMBER}
              </Text>
            </View>
            <View style={{ flex: 1, alignSelf: "stretch" }}>
              <Text
                style={{
                  color: variables.textTrinary,
                  fontSize: 10,
                  fontWeight: "bold",
                  textAlign:'center'
                }}
              >
              {moment(new Date(item.DUE_DATE)).format("DD-MMM-YYYY")}
              </Text>
            </View>
            <View style={{ flex: 1, alignSelf: "stretch" }}>
              <Text style={{ color: variables.textPrimary, fontSize: 10, textAlign:'center' }}>
                {formatMoney(Math.round(item.LAST_REMAINING_AMOUNT))} ฿
              </Text>
            </View>
          </View>
        </Body>
      </ListItem>
    );
  };

  renderGraphItem = ({ item }) => {
    return (
      <ListItem button={true}>
        <Body>
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              borderRadius: 10,
              borderWidth: 0,
              borderColor: variables.borderPrimary
            }}
            underlayColor={variables.borderPrimary}
          >
            <Left>
              <Text
                style={{
                  color: item.svg.fill,
                  fontSize: 10,
                  fontWeight: "bold"
                }}
              >
                {item.label}
              </Text>
            </Left>
            <Right>
              <Item style={{borderBottomWidth:0}}>
              <Text style={{ color: variables.textPrimary, fontSize: 10 }}>
                {formatMoney(Math.round(item.net))}
              </Text>
              <Text style={{ color: variables.textUnit, fontSize: 10 }}> ฿</Text>
              </Item>
            </Right>
          </View>
        </Body>
      </ListItem>
    );
  };

  render() {
    const {
      order,
      detail,
      sum_remain
    } = this.state;
    return (
      <Container  padder>
        <StatusBar barStyle="light-content" />
        {(order != null) ? 
          <Header_Second
            title="โปรไฟล์ลูกค้า"
            navigation={this.props.navigation}
            route={this.state.route}
          />
         : null}
        <Card style={{ flex: 3, elevation: 3 }}>
            {detail != null ? 
              <View
                style={{
                  flex: 2,
                  backgroundColor: variables.bgPrimary,
                  borderRadius: 10,
                  margin: 10,
                  justifyContent: "center"
                }}
              >
                <View style={{ flex: 1, marginTop: 5 }} padder>
                  <View style={{ alignSelf: "stretch", flexDirection: "row" }}>
                    <View style={{ flex: 1, alignSelf: "stretch" }}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        style={{ marginTop: 8 }}
                      >
                        <View>
                          <Text style={{ fontSize: 10,
                                color:variables.grayScale, }}>CV No.</Text>
                          {this.state.detail != null ? (
                            <Text
                              style={{
                                fontSize: 14,
                                marginTop: 5,
                                color: variables.textPrimary
                              }}
                            >
                              {detail.CVNumber}
                            </Text>
                          ) : null}
                          <View
                            style={{
                              position: "relative",
                              flexDirection: "row",
                              marginTop: 8
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: variables.grayScale,
                                height: 1,
                                flex: 1
                              }}
                            />
                          </View>
                        </View>
                      </TouchableHighlight>
                    </View>
                    <View
                      style={{
                        borderLeftWidth: 0.7,
                        borderLeftColor: variables.grayScale,
                        margin: 10
                      }}
                    />
                    <View style={{ flex: 1, alignSelf: "stretch" }}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        style={{ marginTop: 8 }}
                      >
                        <View>
                          <Text style={{ fontSize: 10,
                                color:variables.grayScale, }}>Customer Price</Text>
                          {this.state.detail != null ? (
                            <Text
                              style={{
                                fontSize: 14,
                                marginTop: 5,
                                color: variables.textPrimary
                              }}
                            >
                              {detail.CustomerPrice}
                            </Text>
                          ) : null}
                          <View
                            style={{
                              position: "relative",
                              flexDirection: "row",
                              marginTop: 8
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: variables.grayScale,
                                height: 1,
                                flex: 1
                              }}
                            />
                          </View>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </View>
                  <TouchableHighlight
                    underlayColor="transparent"
                    style={{ marginTop: 8 }}
                  >
                    <View>
                      <Text style={{ fontSize: 10,
                                color:variables.grayScale, }}>CV Name.</Text>
                      {this.state.detail != null ? (
                        <Text
                          style={{
                            fontSize: 14,
                            marginTop: 5,
                            color: variables.textPrimary
                          }}
                        >
                          {detail.AccountNameTH}
                        </Text>
                      ) : null}
                      <View
                        style={{
                          position: "relative",
                          flexDirection: "row",
                          marginTop: 8
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: variables.grayScale,
                            height: 1,
                            flex: 1
                          }}
                        />
                      </View>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor="transparent"
                    style={{ marginTop: 8 }}
                  >
                    <View>
                      <Text style={{ fontSize: 10,
                                color:variables.grayScale, }}>CV Type.</Text>
                      {this.state.detail != null ? (
                        <Text
                          style={{
                            fontSize: 14,
                            marginTop: 5,
                            color: variables.textPrimary
                          }}
                        >
                          {detail.CVType}{" "}
                        </Text>
                      ) : null}
                      <View
                        style={{
                          position: "relative",
                          flexDirection: "row",
                          marginTop: 8
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: variables.grayScale,
                            height: 1,
                            flex: 1
                          }}
                        />
                      </View>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor="transparent"
                    style={{ marginTop: 8 }}
                  >
                    <View>
                      <Text style={{ fontSize: 10,
                                color:variables.grayScale, }}>Phone.</Text>
                      {this.state.detail != null ? (
                        <Text
                          style={{
                            fontSize: 14,
                            marginTop: 5,
                            color: variables.textPrimary
                          }}
                        >
                          {detail.Phone}
                        </Text>
                      ) : null}
                      <View
                        style={{
                          position: "relative",
                          flexDirection: "row",
                          marginTop: 8
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: variables.grayScale,
                            height: 1,
                            flex: 1
                          }}
                        />
                      </View>
                    </View>
                  </TouchableHighlight>
                  <View style={{ alignSelf: "stretch", flexDirection: "row" }}>
                  <View style={{ flex: 1, alignSelf: "stretch" }}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        style={{ marginTop: 8 }}
                      >
                        <View>
                          <Text style={{ fontSize: 10,
                                color:variables.grayScale, }}>Credit Limit.</Text>
                          {this.state.detail != null ? (
                            <Text
                              style={{
                                fontSize: 14,
                                marginTop: 5,
                                color: variables.textPrimary
                              }}
                            >
                            {formatMoney(detail.CreditLimit)}
                            </Text>
                          ) : null}
                        </View>
                      </TouchableHighlight>
                    </View>
                    <View
                      style={{
                        borderLeftWidth: 0.7,
                        borderLeftColor: variables.grayScale,
                        margin: 10
                      }}
                    />
                    <View style={{ flex: 1, alignSelf: "stretch" }}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        style={{ marginTop: 8 }}
                      >
                        <View>
                          <Text style={{ fontSize: 10,
                                color:variables.grayScale, }}>Credit คงเหลือ</Text>
                          {this.state.detail != null ? (
                            <Text
                              style={{
                                fontSize: 14,
                                marginTop: 5,
                                color: variables.textPrimary
                              }}
                            >
                              {(detail.remaining != undefined)? formatMoney(detail.remaining):0}
                            </Text>
                          ) : null}
                        </View>
                      </TouchableHighlight>
                    </View>
                    </View>
                    <View
                            style={{
                              position: "relative",
                              flexDirection: "row",
                              marginTop: 8
                            }}>
                    <View
                            style={{
                              backgroundColor: variables.grayScale,
                              height: 1,
                              flex: 1 
                            }}/>
                    </View>
          <TouchableOpacity style={styles.today} underlayColor={variables.borderPrimary}>
                <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{ fontWeight: 'bold',  color: variables.textSecondary, alignSelf: 'center', fontSize:14  }} >
                     รายการค้างชำระ
                    </Text>
                </View>
            </TouchableOpacity>
                  <View style={{ alignSelf: "stretch", flexDirection: "row" }}>
                  <View style={{ flex: 1, alignSelf: "stretch" }}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        style={{ marginTop: 8 }}
                      >
                        <View>
                          <Text style={{ fontSize: 14,
                                textAlign:'center', }}>ค้างชำระ.</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                    <View style={{ flex: 1, alignSelf: "stretch" }}>
                      <TouchableHighlight
                        underlayColor="transparent"
                        style={{ marginTop: 8 }}
                      >
                          <Text style={{ fontSize: 14,
                                textAlign:'center',
                                color: variables.textPrimary }}>
                                {(sum_remain != undefined)? formatMoney(numeral(sum_remain).format('0.00')):0} ฿</Text>
                      </TouchableHighlight>
                    </View>
                    </View>
                    <View
                            style={{
                              position: "relative",
                              flexDirection: "row",
                              marginTop: 8
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: variables.grayScale,
                                height: 1,
                                flex: 1
                              }}
                            />
                    </View>
                    <View style={{ flex: 1, justifyContent:'center' }} padder>
                      {(order!=null && order.length>0)?
                        <FlatList
                          style={{ flex: 0.5, alignSelf: "stretch", marginRight: 5 }}
                          data={order}
                          renderItem={this.renderOrder}
                          keyExtractor={item => item.DOC_NUMBER}
                        /> :
                        <Spinner color={variables.Maincolor} />}
                    </View>
                </View>
              </View> : 
              <View  
                style={{
                  flex: 2,
                  backgroundColor: variables.bgPrimary,
                  borderRadius: 10,
                  margin: 10,
                  justifyContent: "center"
                }}>
                  <Spinner color={variables.Maincolor} />
              </View>}
        </Card>
      </Container>
    );
  }
}

const socketcontext = props => (
  <SocketContext.Consumer>
    {socket => <ClientDetail {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default socketcontext;

