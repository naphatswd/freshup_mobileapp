import { AUTHEN_POST, AUTHEN_GET, GET} from "./api/restful";
import { onSignIn } from "./storage";

export const formatMoney =  (inum) =>{
  let s_inum=new String(inum);
  let num2=s_inum.split(".");
  let n_inum="";  
  if(num2[0]!=undefined){
      let l_inum=num2[0].length;  
      for(i=0;i<l_inum;i++){  
          if(parseInt(l_inum-i)%3==0){  
              if(i==0){  
                  n_inum+=s_inum.charAt(i);         
              }else{  
                  n_inum+=","+s_inum.charAt(i);         
              }     
          }else{  
              n_inum+=s_inum.charAt(i);  
          }  
      }  
  }else{
      n_inum=inum;
  }
  if(num2[1]!=undefined){
      n_inum+="."+num2[1];
  }
  return n_inum;
};

export const getMonth = (num) =>{
    let Month = [{label:"มกราคม", value:"January"},{label:"กุมภาพันธ์", value:"February"},{label:"มีนาคม", value:"March"}
                ,{label:"เมษายน", value:"April"},{label:"พฤษภาคม", value:"May"},{label:"มิถุนายน", value:"June"}
                ,{label:"กรกฎาคม", value:"July"},{label:"สิงหาคม", value:"August"},{label:"กันยายน", value:"September"}
                ,{label:"ตุลาคม", value:"October"},{label:"พฤศจิกายน", value:"November"},{label:"ธันวาคม", value:"December"}];
    let temp = [];
    for(let i=0;i<=num;i++){
        temp.push(Month[i]);
    }
    return temp;
}

export const getSalesman = (data,callback) =>{
    let body ={
      adm_store:data
    }
    AUTHEN_POST('/sale/getMysale', body)
      .then((response)=>{
        callback(response.data);
     });
}

export const getAllStores = async (callback) =>{
  GET('/store/registStore','')
      .then(async (response)=>{
        callback(response.data);
     });
}

export const getAvatarSave = async (callback) =>{
  AUTHEN_GET('/user/avatar','')
      .then(async (response)=>{
        if(response.data.length > 0){
            await onSignIn("avatar", "data:image/png;base64,"+response.data);
            callback("data:image/png;base64,"+response.data);
        }
     });
}

export const getAvatar = async () =>{
  AUTHEN_GET('/user/avatar','')
      .then(async (response)=>{
        if(response.data.length > 0){
            await onSignIn("avatar", "data:image/png;base64,"+response.data);
            return ("data:image/png;base64,"+response.data);
        }
     });
}

export const getZone = () =>{
    let zone =  [{text:"อีสานล่าง", value:"NELOWER"},{text:"อีสานบน", value:"NEUPPER"},{text:"ใต้", value:"SOUTH"}
    ,{text:"กรุงเทพฯ", value:"BKK"},{text:"เหนือบน", value:"NOUPPER"},{text:"เหนือล่าง", value:"NOLOWER"}
    ,{text:"กลาง/ตะวันตก", value:"CENTRAL/WEST"},{text:"ตะวันออก", value:"EAST"}];
    return zone;
}

export const cvTypeColor =()=>{ 
    let chart = [
        {
          Code: 'Agent',
          color: '#DB182E'
        },
        {
          Code: 'จัดเลี้ยง',
          color: '#E69D40'
        },
        {
          Code: 'Fresh Shop',
          color: '#4D930B'
        },
        {
          Code: 'โรงแรม',
          color: '#9D0C37'
        },
        {
          Code: 'Industry',
          color: '#E94D50'
        },
        {
          Code: 'Pork Shop',
          color: '#2B6905'
        },
        {
          Code: 'อื่นๆ',
          color: '#B85805'
        },
        {
          Code: 'ตลาดสด',
          color: '#004f49'
        },
        {
          Code: 'ตู้เย็นชุมชน',
          color: '#003783'
        },
        {
          Code: 'ในเครือ',
          color: '#004B9D'
        },
        {
          Code: 'ร้านค้าปลีก',
          color: '#0061B7'
        },
        {
          Code: 'ร้านอาหาร',
          color: '#006f51'
        },
        {
          Code: 'โรงพยาบาล',
          color: "#3491D3"
        },
        {
          Code: 'โรงเรียน',
          color: '#FECD74'
        },
        {
          Code: 'สถาบัน-ราชการ',
          color: '#9A4204'
        },
        {
          Code: "หน่วยงานเอกชน-ปรุงอาหารขาย",
          color: "#BC1134"
        },
        {
          Code: "ธุรกิจอาหารพร้อมทาน",
          color: "#54d398"
        },
        {
          Code: "ตู้หมู",
          color: "#D67208"
        }
      ];
    return chart;
};