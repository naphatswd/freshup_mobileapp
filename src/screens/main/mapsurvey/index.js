import React, { useState, Component } from "react";
import {
  Container,
  Card,
  View,
  Body,
  CardItem,
  Spinner,
  Icon,
  Text,
  Button,
  Item,
} from "native-base";
import { StatusBar, Animated, Dimensions, Image, TouchableOpacity } from "react-native";
import Header_Admin from "../../../theme/compontent/header_admin";
import Header_Sale from "../../../theme/compontent/header_sale";
import ClusteredMapView from 'react-native-maps-super-cluster';
import variables from "../../../theme/variables/commonColor";
import SocketContext from "../../../socket-context";
import { Marker, Callout } from 'react-native-maps';
import { FlatGrid } from 'react-native-super-grid';
import * as Permissions from 'expo-permissions';
import SaleFooter from "../../saleman/footer";
import AdminFooter from "../../admin/footer";
import {AUTHEN_POST} from "../../../api/restful";
import { getItem } from "../../../storage";
import * as Location from 'expo-location';
import { Linking } from "expo";

let Types = [{label:"ที่พัก", value:"Hotel (โรงแรม/ที่พัก)"},{label:"โรงพยาบาล", value:"Hospital (โรงพยาบาล)"},
             {label:"ร้านอาหาร", value:"Restaurants (ร้านอาหาร)"},{label:"แผงตลาด", value:"Wet Market (ตลาดสด)"},{label:"โรงเรียน", value:"School (โรงเรียน)"}];

FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0))  
  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
      }
    ).start();
  }, [])
  return (
    <Animated.View                 
      style={{
        ...props.style,
        opacity: fadeAnim,         
      }}
    >
      {props.children}
    </Animated.View>
  );
}

class MapSurvey extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      route:this.props.navigation.getParam('route'),
      selectedType:"Restaurants (ร้านอาหาร)",
      showmarkers:[],
      tempMarker:[],
      Header:null,
      Footer:null,
      selected:null,
      initialRegion:null,
      tempLocation:null,
      loading:true,
      region:false,
      locationPermission:false,
      showNavigate:false,
      openMap:false,
      marginBottom:1
    };
    this.renderMarker = this.renderMarker.bind(this)
    this.renderCluster = this.renderCluster.bind(this)
    this.getNearestPOI = this.getNearestPOI.bind(this)
  }
  
  componentDidMount(){
    setTimeout(()=>this.setState({marginBottom: 0}),500)
    this.getHeader();
    this._requestLocationPermission();
    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        if(this.props.navigation.getParam('refresh')){
          this.setState({openMap:false},()=>{
            this._requestLocationPermission();
          })
        }
      })
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  getHeader = async () =>{
    let role = await getItem("role");
    if(role == "admin"){
      this.setState({Header:<Header_Admin navigation={this.props.navigation} radio3={variables.mainColor} />,
                    Footer:<AdminFooter navigation={this.props.navigation} />});
    }else if(role == 'saleman'){
      this.setState({Header:<Header_Sale navigation={this.props.navigation} radio3={variables.mainColor} />,
      Footer:<SaleFooter navigation={this.props.navigation} />});
    }
  }

  _getMarkerLocation = async () =>{
    let body ={
      Type:this.state.selectedType,
      Latitude:this.state.initialRegion.latitude,
      Longitude:this.state.initialRegion.longitude
    }
    this.setState({loading:true,selected:null,showNavigate:false});
    AUTHEN_POST('/lead/getNearby', body)
      .then(async (response)=>{
        let markers = [];
        if(response.data.length > 0){
          response.data.forEach(element => {
            markers.push({
                _id:element._id,
                LatLng:{latitude:element.Latitude,longitude:element.Longitude},
                title:element.Name,
                Type:element.Type,
                cvnumber:element.CVNumber,
                Supplier:element.Supplier
              });
          });
       }
       this.setState({
         showmarkers:markers,
         loading:false
        });
      }).catch(e =>{this.setState({loading:false});});
  }

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
          coordinate = cluster.coordinate,
          clusterId = cluster.clusterId

    const clusteringEngine = this.map.getClusteringEngine(),
          clusteredPoints = clusteringEngine.getLeaves(clusterId, 100)

    return (
      <Marker coordinate={coordinate} onPress={onPress}>
        <View style={{ width: 30,height: 30,padding: 6,borderWidth: 1,borderRadius: 15,alignItems: 'center',borderColor: variables.mainColor,justifyContent: 'center',backgroundColor: variables.bgPrimary}}>
          <Text style={{fontSize: 13,color: variables.textPrimary9,fontWeight: '500',textAlign: 'center'}}>
            {pointCount}
          </Text>
        </View>
      </Marker>
    )
  }

  renderMarker = (marker) => {
    if(this.state.openMap){
      return (
        <Marker
          style={{zIndex:3}}
          coordinate={marker.location}
          title={marker.value.title}
          onPress={(event)=>{event.stopPropagation(); this.showNavigation(marker.value)}}>
            <Image source={require("../../../../assets/images/icon/pinIcon.png")} style={{height: 24, width:24 }} />
            <Callout width={(marker.value.title.length>11 && marker.value.title.length < 20)? marker.value.title.length*8:120} height={40}  onPress={() =>{this.showTooltips(marker.value)}}>
              <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16}}>{marker.value.title}</Text>
              <Text style={{textAlign:'center',fontSize:12,color:variables.grayScale,fontWeight:'bold'}}>รายละเอียด</Text>
            </Callout>
          </Marker>
        )
    }else{
      return (
        <Marker
          coordinate={marker.value.LatLng}
          title={marker.value.title}
          onPress={(event)=>{event.stopPropagation(); this.showNavigation(marker.value)}}>
            <Image source={this.setImage(marker.value)} style={{height: 24, width:24 }} />
            <Callout width={(marker.value.title.length>11 && marker.value.title.length < 20)? marker.value.title.length*8:120} height={40}  onPress={() =>{this.showTooltips(marker.value)}}>
              <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16}}>{marker.value.title}</Text>
              <Text style={{textAlign:'center',fontSize:12,color:variables.grayScale,fontWeight:'bold'}}>รายละเอียด</Text>
            </Callout>
        </Marker>
     )
    }
  };

  setImage = (marker) =>{
    if(marker.Supplier == "CP"){
    let filURI = require("../../../../assets/images/icon/cpcust/other.png");
        switch(marker.Type) {
            case 'CF(ตู้เย็นชุมชน)':
                filURI = require("../../../../assets/images/icon/cpcust/community_freezer.png");
                break;
            case 'Hotel (โรงแรม/ที่พัก)':
              filURI = require("../../../../assets/images/icon/cpcust/home.png");
                break;
            case 'Hospital (โรงพยาบาล)':
              filURI = require("../../../../assets/images/icon/cpcust/hospital.png");
                break;
            case 'Wet Market (ตลาดสด)':
              filURI = require("../../../../assets/images/icon/cpcust/mkt.png");
                break;
            case 'Restaurants (ร้านอาหาร)':
              filURI = require("../../../../assets/images/icon/cpcust/rest.png");
                break;
            case 'School (โรงเรียน)':
              filURI = require("../../../../assets/images/icon/cpcust/school.png");
                break;
            default:
              filURI = require("../../../../assets/images/icon/cpcust/other.png");
                break;          
        }
        return filURI;
      }else{
        let filURI = require("../../../../assets/images/icon/noncp/other_grey.png");
        switch(marker.Type) {
            case 'Hotel (โรงแรม/ที่พัก)':
              filURI = require("../../../../assets/images/icon/noncp/home_grey.png");
                break;
            case 'Hospital (โรงพยาบาล)':
              filURI = require("../../../../assets/images/icon/noncp/hospital_grey.png");
                break;
            case 'Wet Market (ตลาดสด)':
              filURI = require("../../../../assets/images/icon/noncp/mkt_grey.png");
                break;
            case 'Restaurants (ร้านอาหาร)':
              filURI = require("../../../../assets/images/icon/noncp/rest_grey.png");
                break;
            case 'School (โรงเรียน)':
              filURI = require("../../../../assets/images/icon/noncp/school_grey.png");
                break;
            default:
              filURI = require("../../../../assets/images/icon/noncp/other_grey.png");
                break;          
        }
        return filURI;
      }
  }

  _requestLocationPermission = async () => { 
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let result = await Location.hasServicesEnabledAsync();
    this.setState({
      showmarkers:[]
    });
    if (status !== 'granted' || !result) {
      this.setState({
        locationPermission: status === 'not grant',
        locationPermission:false
      });
      Toast.show({
        text: "Please enabled your location.",
        type: "danger"
      });
       return null;
    }
    else if (status == 'granted' && result){
      this.setState({
        locationPermission: status === 'granted',
        locationPermission:true
      });
        navigator.geolocation.watchPosition(
        (location) => {
          this.setState({
            initialRegion:{
              latitude:location.coords.latitude,
              longitude:location.coords.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02
            }
            ,location:location},()=>{
            if(!this.state.openMap)
              this._getMarkerLocation();
            else
              this.getNearestPOI(this.state.initialRegion);
           })
          },
          (error) => {this._requestLocationPermission()},
          { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        ); 
      return;
    }
    return null;
  };

  handleTypePicked = selectedType => {
    this.setState(
      {
        selectedType: selectedType
      },
      () => {
        this._requestLocationPermission();
      }
    );
  };

  onMapPress = () =>{
    this.setState({
      selected:null
   });
  }

  showNavigation = (marker) =>{
    this.setState({
      selected:marker.LatLng
   });
  }

  _onMapReady = () => {
    this.setState({marginBottom: 0})
  }

  showTooltips = (item) =>{
    if(item.cvnumber != undefined){
      this.props.navigation.navigate("clientDetail",{CustName:item.title,CVNumber:item.cvnumber,route:"MapSurvey"});}
    else
      this.props.navigation.navigate("editPlace",{marker:item,route:"MapSurvey"});
  }

  newPOI(){
    this.props.navigation.navigate("newPlace",{route:"MapSurvey",latlon:{latitude:this.state.region.latitude,longitude:this.state.region.longitude}});
  }

  openDirection = () =>{
    Linking.openURL('https://www.google.com/maps/search/?api=1&query='+this.state.selected.latitude+","+this.state.selected.longitude);
  }

  onRegionChangeComplete = region => {
    if(this.state.openMap){
      //this.getNearestPOI(region);
    }
  }

  getNearestPOI = (region) =>{
    this.setState({loading:true,selected:null,showNavigate:false,region:null});
    let body ={
      Latitude:region.latitude,
      Longitude:region.longitude
    }
    this.setState({showmarkers:[]});
    AUTHEN_POST('/clientLead/Nearest', body)
      .then(async (response)=>{
        if(response.data.length>0){
          this.setState({
            initialRegion:{
              latitude:response.data[0].Loc.coordinates[1],
              longitude:response.data[0].Loc.coordinates[0],
              latitudeDelta: 0.00001,
              longitudeDelta: 0.00001
            }
          },()=>{
            let marker = [];
            response.data.forEach(item =>{
              marker.push({
                location:{
                  latitude:item.Loc.coordinates[1],
                  longitude:item.Loc.coordinates[0]
                },
                LatLng:{
                  latitude:item.Loc.coordinates[1],
                  longitude:item.Loc.coordinates[0]
                },
                _id:item._id,
                Type:item.Type,
                Supplier:item.Supplier,
                title:item.Name,
                cvnumber:item.CVNumber
              })
            })
            this.setState({showmarkers:marker});
            this.map.getMapRef().animateToRegion(this.state.initialRegion);
            })
        }else{
          this.setState({
            initialRegion:{
              latitude:region.latitude,
              longitude:region.longitude,
              latitudeDelta: 0.00001,
              longitudeDelta: 0.00001
            }
          },()=>{
            this.map.getMapRef().animateToRegion(this.state.initialRegion);
          });
          this.setState({region:region});
        }
        this.setState({loading:false});
      }).catch(e =>{this.setState({loading:false});});
  }

  openNewMap = () =>{
    if(!this.state.openMap){
      this.setState({
        selected:null,
        tempLocation:this.state.initialRegion,
        tempMarker:this.state.showmarkers,
      },()=>{
        this.setState({
          showmarkers:[],
          openMap:true});
        this._requestLocationPermission();
      });
   }else{
    this.setState({
      initialRegion:this.state.tempLocation,
      showmarkers:this.state.tempMarker
    },()=>{
      this.map.getMapRef().animateToRegion(this.state.initialRegion);
      this.setState({tempMarker:[]});
      this.setState({openMap:false});
    });
   }
  }

  renderItem = ({ item, index }) => {
    switch(item.value) {
      case 'Hotel (โรงแรม/ที่พัก)':
        item.color = "#2980b9";
        item.Icon = "home"
          break;
      case 'Hospital (โรงพยาบาล)':
        item.color = "#c0392b";
        item.Icon = "heart"
          break;
      case 'Wet Market (ตลาดสด)':
        item.color = "#2c3e50";
        item.Icon = "basket"
          break;
      case 'Restaurants (ร้านอาหาร)':
        item.color = "#e67e22";
        item.Icon = "restaurant"
          break;
      case 'School (โรงเรียน)':
        item.color = "#27ae60";
        item.Icon = "school"
          break;
      default:
        item.color = "#c0392b";
        item.Icon = "home"
          break;                    
    }
    return (
        <View style={{flex:1,alignSelf:'center'}}>
            <TouchableOpacity style={{alignItems:'center'}} onPress={()=>{this.handleTypePicked(item.value)}}>
            {(item.value == this.state.selectedType)?  
            <Icon name={item.Icon} style={{color: item.color}}/>: 
            <Icon name={item.Icon} style={{color: variables.grayScale}}/>}
            {(item.value == this.state.selectedType)?  
            <Text style={{textAlign:'center',marginTop:5,fontSize:11, color:item.color, fontWeight:'bold'}}>{item.label}</Text>: 
            <Text style={{textAlign:'center',marginTop:5,fontSize:11, color:variables.grayScale, fontWeight:'bold'}}>{item.label}</Text>}
            </TouchableOpacity>
        </View>
    )};

  _convertPoints(data) {
      const results = {
        type: 'MapCollection',
        features: []
      };
      data.map(value => {
        array = {
          value,
          location: {
            latitude: value.LatLng.latitude,
            longitude: value.LatLng.longitude
          }
        };
        results.features.push(array);
      });
      return results.features;
    }

  render() {
    const {showmarkers, loading, initialRegion, openMap, locationPermission, selected, Header, Footer} = this.state;
    const data = this._convertPoints(showmarkers);
    return (
      <Container  padder>
        <StatusBar barStyle="light-content" />
        {Header} 
        <View style={{flex:1}}>
            {(locationPermission)?
          <View style={{flex:1}}>
            {(initialRegion !=null)?
              <FadeInView style={{flex: 1, paddingTop:this.state.marginBottom}}>
                <ClusteredMapView
                  style={{flex: 1,zIndex:1}}
                  data={data}
                  ref={(r) => { this.map = r }}
                  scrollEnabled={!openMap}
                  zoomEnabled={!openMap}
                  pitchEnabled={!openMap}
                  rotateEnabled={!openMap}
                  animateClusters={false}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  mapType="mutedStandard"
                  loadingEnabled={true}
                  onPress={()=>{this.onMapPress()}}
                  onRegionChangeComplete={this.onRegionChangeComplete}
                  initialRegion={initialRegion}
                  renderMarker={this.renderMarker}
                  renderCluster={this.renderCluster} />
                {(openMap)? 
                <View style={{left: '45%',position: 'absolute',top: '45%',zIndex:2}}>
                    <Icon style={{color:"#ff7675",fontSize:36}} name="pin"/>
                </View>:null}
              </FadeInView>
                :
              <Card style={{flex: 1}}><Spinner color={variables.mainColor} style={{flex:1, alignSelf: "center" }} /></Card>  
            }</View>
              :<Card style={{flex:1 ,alignItems:'center'}}>
                  <CardItem style={{flex:0.5}}>
                    <Text style={{fontSize:14,textAlignVertical:'center',color: variables.textPrimary9, textAlign:'center'}}> Please enable Location Service</Text>
                  </CardItem>  
                  <CardItem style={{flex:0.5}}>
                    <Button style={{ flex:1,backgroundColor:variables.bgButtonPrimary,justifyContent:'center'}}  onPress={()=>this._requestLocationPermission()}>
                      <Text style={{ textAlign:'center',fontWeight: 'bold', color: variables.textPrimary9, fontSize:20  }} >Try Again</Text>
                    </Button>
                  </CardItem>
              </Card>
            }
            {(selected != null)? 
            <Button onPress={()=>{this.openDirection()}} style={{backgroundColor:variables.bgButtonPrimary,shadowColor: variables.shadowColor, shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1, shadowRadius: 1,elevation: 2,flex:1,borderWidth:1,borderColor:variables.borderPrimary,borderRadius:200,position:'absolute',bottom:Dimensions.get('window').height/3.5,right:10}}>
              <Icon style={{color:variables.textSecondary}} name="navigate"/>
            </Button>:null }
            <Button disabled={loading} onPress={()=>{this.openNewMap()}} style={{shadowColor: variables.shadowColor, shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1, shadowRadius: 1,elevation: 2,flex:1,borderWidth:1,borderColor:variables.borderPrimary,borderRadius:200,position:'absolute',bottom:Dimensions.get('window').height/5.2,right:10,backgroundColor:variables.bgPrimary}}>
              {(openMap)? 
              <Icon style={{color:variables.textRedflat}} name="close"/>:
              <Icon style={{color:variables.textPrimary9}} name="add"/>}
            </Button>
            <Card style={{
              alignSelf:'center',
              width:Dimensions.get('window').width-5,
              height:Dimensions.get('window').height/6}}>
                <CardItem style={{flex:1}}>
                  {(openMap) ? 
                    <Body style={{alignItems:'center'}}>
                      {(loading)? 
                          <Spinner/>:
                            <View style={{flex:1,alignContent:'center'}}>
                              {(showmarkers.length>0)? 
                                <View style={{alignItems:'center'}}>
                                  <Item style={{borderBottomWidth:0, alignSelf:'stretch'}}>
                                    {(showmarkers[0].Supplier == "CP")?
                                    <Image style={{alignSelf:"flex-start",width:24,height:24}} source={require("../../../../assets/images/icon/cpfm.png")}/>:null}
                                    <Text style={{fontWeight:'bold',fontSize:14,textAlign:'center',alignSelf:'center'}}> {showmarkers[0].title}</Text>
                                  </Item>
                                  <Button onPress={()=>this.showTooltips(showmarkers[0])} style={{alignSelf:'center',marginTop:10, shadowColor: variables.shadowColor, shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1, shadowRadius: 1, borderWidth:1,borderRadius:20,borderColor:"#2980b9",backgroundColor:"#2980b9"}}>
                                    <Text style={{fontWeight:'bold',fontSize:12,color:"#FFF",textAlign:'center', width:Dimensions.get('window').width/2}}>แก้ไขจุด</Text>
                                  </Button>
                                </View>
                              :<Button onPress={()=>this.newPOI()} style={{alignSelf:'center',marginTop:10, shadowColor: variables.shadowColor, shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1, shadowRadius: 1, borderWidth:1,borderRadius:20,borderColor:"#9b59b6",backgroundColor:"#9b59b6"}}>
                                <Text style={{fontWeight:'bold',fontSize:18,color:"#FFF",textAlign:'center',width:Dimensions.get('window').width/2}}>เพิ่มจุดใหม่</Text>
                              </Button> }
                            </View>
                      }
                    </Body>:
                    <Body style={{alignItems:'center'}}>
                      <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center'}}>Explore Nearby (1 km)</Text>
                        {(loading)? 
                          <Spinner/>:
                          <FlatGrid
                            style={{marginTop:5}}
                            scrollEnabled={false}
                            itemDimension={Dimensions.get('window').width/7}
                            items={Types}
                            renderItem={this.renderItem}
                          />}
                    </Body>
                  }
                </CardItem>
            </Card>
        </View>
      </Container>
    );
  }
}
const socketcontext = props => (
  <SocketContext.Consumer>
    {socket => <MapSurvey {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default socketcontext;

