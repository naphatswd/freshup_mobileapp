import React, { Component,  } from "react";
import {
    Card,
    Text,
    Layout
} from '@ui-kitten/components';

class StaffHome extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  
  render() {
    return (
      <Layout style={{flex:1, justifyContent:'center'}} >
          <Card style={{alignItems:'center',justifyContent:'center', margin:5}}>
              <Text style={{textAlign:'center', fontWeight:'bold'}}>ไม่ต้องใช้แอพลงเวลาแล้วนะครับ</Text>
              <Text style={{textAlign:'center', fontWeight:'bold'}}>ขอบคุณครับ ลบได้เลย</Text>
              <Text style={{textAlign:'right', fontWeight:'bold'}}>ฟาร์</Text>
          </Card>
        </Layout>
    );
  }
}

export default StaffHome;
