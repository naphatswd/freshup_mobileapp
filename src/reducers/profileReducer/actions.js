import { INITIAL_DATA, UPDATE_NICKNAME, UPDATE_FIRSTNAME, UPDATE_LASTNAME, UPDATE_EMAIL, UPDATE_PHONE, UPDATE_SELECTEDSTORE, DELETE_DATA } from './types';

InitData = () =>{
    return {
        type:INITIAL_DATA
    };
}

updateNickname = (data)=>{
    return{
        type:UPDATE_NICKNAME,
        data
    }
}

updateFirstName = (data) =>{
    return{
        type:UPDATE_FIRSTNAME,
        data
    }
}

updateLastName = (data) =>{
    return{
        type:UPDATE_LASTNAME,
        data
    }
}

updateEmail = (data) =>{
    return{
        type:UPDATE_EMAIL,
        data
    }
}

updatePhone = (data) =>{
    return{
        type:UPDATE_PHONE,
        data
    }
}

updateSelectedStore = (data) =>{
    return{
        type:UPDATE_SELECTEDSTORE,
        data
    }
}

deleteData = ()=>{
    return{
        type:DELETE_DATA
    }
}

const actionCreators = {
    InitData,
    updateNickname,
    updateFirstName,
    updateLastName,
    updateEmail,
    updatePhone,
    updateSelectedStore,
    deleteData
}

export {actionCreators}