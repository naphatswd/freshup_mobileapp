import axios from 'axios';
import { getItem } from '../storage';
import URL_Prefix from '../../app.json'

export const AUTHEN_GET = async (path) =>{
  let obj = await getItem("token");
    if(obj != null){
      const AuthStr = 'Bearer '.concat(obj); 
      return await axios({
        headers : { Authorization: AuthStr},
        method: 'get',
        url: URL_Prefix.url.prefix + URL_Prefix.url.authen + path
      })
      .then(response => response)
      .catch(error => error)
    }
}

export const AUTHEN_POST = async (path, body) =>{
  let obj = await getItem("token");
  if (obj !== null) {
    const AuthStr = 'Bearer '.concat(obj);
    return await axios({
      headers : { Authorization: AuthStr},
      method: 'post',
      url: URL_Prefix.url.prefix + URL_Prefix.url.authen + path,
      data: body
    })
    .then(response => response)
    .catch(error => error);
  }
}

export const AUTHEN_PUT = async (path, body) =>{
  let obj = await getItem("token");
  if (obj !== null) {
    const AuthStr = 'Bearer '.concat(obj);
    return await axios({
      headers : { Authorization: AuthStr},
      method: 'put',
      url: URL_Prefix.url.prefix + URL_Prefix.url.authen + path,
      data: body
    })
    .then(response => response)
    .catch(error => error);
  }
}

export const GET = async (path) =>{
  return await axios({
    method: 'get',
    url: URL_Prefix.url.prefix + path
  })
  .then(response => response)
  .catch(error => error);
}

export const POST = async (path, body) =>{
  return await axios({
    method: 'post',
    url: URL_Prefix.url.prefix + path,
    data: body
  })
  .then(response => response)
  .catch(error=> error);
}