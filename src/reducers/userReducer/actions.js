import {INITIAL_DATA, UPDATE_EMPID, INACTIVE_TIME, UPDATE_ROLE, UPDATE_DATA, UPDATE_TOKEN, UPDATE_STORE, UPDATE_IMGPROFILE, UPDATE_SELECTEDSTORE, UPDATE_LOGIN, DELETE_DATA} from './types';

InitData = () =>{
    return {
        type:INITIAL_DATA
    };
}

updateData = (data)=>{
    return{
        type:UPDATE_DATA,
        data
    }
}

updateInactive = (data)=>{
    return{
        type:INACTIVE_TIME,
        data
    }
}

updateEmpId = (data)=>{
    return{
        type:UPDATE_EMPID,
        data
    }
}

updateRole = (data) =>{
    return{
        type:UPDATE_ROLE,
        data
    }
}

updateToken = (data) =>{
    return{
        type:UPDATE_TOKEN,
        data
    }
}

updateStore = (data) =>{
    return{
        type:UPDATE_STORE,
        data
    }
}

updateSelectedStore = (data)=>{
    return{
        type:UPDATE_SELECTEDSTORE,
        data
    }
}

updateImgProfile =(data)=>{
    return{
        type:UPDATE_IMGPROFILE,
        data
    }
}

updateLogin = (data)=>{
    return{
        type:UPDATE_LOGIN,
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
    updateInactive,
    updateEmpId,
    updateData,
    updateRole,
    updateToken,
    updateStore,
    updateImgProfile,
    updateSelectedStore,
    updateLogin,
    deleteData
}

export {actionCreators}