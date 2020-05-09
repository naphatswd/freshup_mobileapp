import {INITIAL_DATA, UPDATE_DATA, UPDATE_LOGIN,UPDATE_EMPID, INACTIVE_TIME, UPDATE_ROLE, UPDATE_TOKEN, UPDATE_STORE, UPDATE_IMGPROFILE, UPDATE_SELECTEDSTORE, DELETE_DATA} from './types';

const initialState = {
    inactiveTime:null,
    emp_id:null,
    token:null,
    role:null,
    selectedStore:null,
    store:null,
    imgprofile:null,
    login:false,
    reload:false
}

InitData = () =>{
    return{
        ...state,
        emp_id,
        token,
        role,
        selectedStore,
        store
    }
}

updateInactive = (state,action)=>{
    return{
        ...state,
        inactiveTime:action.data
    }
}

updateData = (state,action)=>{
    return{
        ...state,
        reload:action.data
    }
}

updateEmpID = (state,action)=> {
    return{
        ...state,
        emp_id:action.data
    }
}

updateRole = (state,action)=> {
    return{
        ...state,
        role:action.data
    }
}

updateToken = (state,action)=> {
    return{
        ...state,
        token:action.data
    }
}

updateStore = (state,action)=> {
    return{
        ...state,
        store:action.data
    }
}

updateselectedStore = (state,action) =>{
    return{
        ...state,
        selectedStore:action.data
    }
}

updateImgProfile = (state,action)=>{
    return{
        ...state,
        imgprofile:action.data
    }
}

updateLogin = (state,action)=>{
    return{
        ...state,
        login:action.data
    }
}

clearData = (state)=>{
    return{
        ...state,
        inactiveTime:null,
        emp_id:null,
        token:null,
        role:null,
        selectedStore:null,
        store:null,
        imgprofile:null,
        login:false,
        reload:false
    }
}

userReducer = (state = initialState, action) =>{
    switch(action.type){
        case INITIAL_DATA:
            return InitData();
        case UPDATE_EMPID:
            return updateEmpID(state,action);
        case INACTIVE_TIME:
            return updateInactive(state,action);
        case UPDATE_DATA:
            return updateData(state,action);
        case UPDATE_ROLE:
            return updateRole(state,action);
        case UPDATE_TOKEN:
            return updateToken(state,action);
        case UPDATE_STORE:
            return updateStore(state,action);
        case UPDATE_IMGPROFILE:
            return updateImgProfile(state,action);
        case UPDATE_SELECTEDSTORE:
            return updateselectedStore(state,action);
        case UPDATE_LOGIN:
            return updateLogin(state,action);
        case DELETE_DATA:
            return clearData(state);
        default:
            return state;
    }
}

export default userReducer;