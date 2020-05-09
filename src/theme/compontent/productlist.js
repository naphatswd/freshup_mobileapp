import React, { Component } from "react";
import variables from "../../theme/variables/commonColor";
import {
  Text,
  View,
  Item,
  Left,
  Right
} from "native-base";
import {
  ListItem,
  List
} from '@ui-kitten/components';

class ProductList extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        products:this.props.products
      };
    }

    renderItem= ({item}) =>{
        let temp2 = [];
            item.price = item.price.sort((a, b) => a.UM_Text > b.UM_Text ? 1 : b.UM_Text > a.UM_Text ? -1 : 0);
            item.price.forEach(element=>{
                temp2.push(
                    <Item key={element.UM_Text} style={{borderBottomWidth:0}}>    
                        <Text style={{ fontSize: 14, marginTop: 5, color: variables.mainColor }}>
                            {element.price}
                        </Text>
                        <Text style={{ fontSize: 12,marginLeft:5, marginTop: 5, color: variables.textPrimary }}>
                            ฿/ {element.UM_Thai}
                        </Text>
                    </Item>
                );
            });
        return (
          <ListItem
            key={item.class}
            title={`${item.label} `}
            titleStyle={{fontSize:12}}
            description={`${item.class} `}
            descriptionStyle={{fontSize:9}}
            accessory={()=>{return (<View>{temp2}</View>)}}
        />
        );
    }

    render() {
        const {products} = this.state;
        let temp = [];
        products.forEach(element => {
            let temp2 = [];
            let i = 0;
            element.price = element.price.sort((a, b) => a.UM_Text > b.UM_Text ? 1 : b.UM_Text > a.UM_Text ? -1 : 0);
            element.price.forEach(item=>{
                i++;
                temp2.push(
                    <Item key={String(i)} style={{borderBottomWidth:0}}>    
                        <Text style={{ fontSize: 14, marginTop: 5, color: variables.mainColor }}>
                            {item.price}
                        </Text>
                        <Text style={{ fontSize: 14,marginLeft:5, marginTop: 5, color: variables.textPrimary }}>
                            ฿/ {item.UM_Thai}
                        </Text>
                    </Item>
                );
            });
            temp.push(
            <View>
                <Item key={element.class} style={{borderBottomWidth:0}}>
                    <Left style={{flex: 1, alignSelf: 'stretch' ,justifyContent:'center' }}>
                        <Text style={{fontSize:13,marginTop: 10,marginBottom:5,textAlignVertical:'center'}}>{element.class+" ("+element.label+") "}</Text>
                    </Left>
                    <Right>
                        {temp2}
                    </Right>
                </Item>
            </View>);
        });
        return (
            <List
                style={{flex:1, alignSelf: "stretch", backgroundColor:variables.bgPrimary }}
                data={products}
                keyExtractor={item => item.class}
                renderItem={this.renderItem}
                windowSize={5}
                initialListSize={8}
                initialNumToRender={8}
            />
        );
    }
}
export default ProductList;