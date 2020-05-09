import { INITIAL_DATA, UPDATE_NICKNAME, UPDATE_FIRSTNAME, UPDATE_LASTNAME, UPDATE_EMAIL, UPDATE_PHONE, UPDATE_SELECTEDSTORE, DELETE_DATA } from './types';

const initialState = {
    SelectedStore:null,
    Nickname:null,
    FirstName:null,
    LastName:null,
    Email:null,
    Phone:null
}

InitData = () =>{
    return{
        ...state,
        emp_id,
        token,
        role,
        store
    }
}

updateNickname = (state,action)=> {
    return{
        ...state,
        Nickname:action.data
    }
}

updateFirstName = (state,action)=> {
    return{
        ...state,
        FirstName:action.data
    }
}

updateLastName = (state,action)=> {
    return{
        ...state,
        LastName:action.data
    }
}

updateEmail = (state,action)=> {
    return{
        ...state,
        Email:action.data
    }
}

updatePhone = (state,action)=> {
    return{
        ...state,
        Phone:action.data
    }
}

updateSelectedStore = (state,action)=> {
    return{
        ...state,
        SelectedStore:action.data
    }
}

deleteData = (state)=>{
    return{
        ...state,
        SelectedStore:null,
        Nickname:null,
        FirstName:null,
        LastName:null,
        Email:null,
        Phone:null
    }
}

profileReducer = (state = initialState, action) =>{
    switch(action.type){
        case INITIAL_DATA:
            return InitData()
        case UPDATE_NICKNAME:
            return updateNickname(state,action);
        case UPDATE_FIRSTNAME:
            return updateFirstName(state,action);
        case UPDATE_LASTNAME:
            return updateLastName(state,action);
        case UPDATE_EMAIL:
            return updateEmail(state,action);
        case UPDATE_PHONE:
            return updatePhone(state,action);
        case UPDATE_SELECTEDSTORE:
            return updateSelectedStore(state,action);
        case DELETE_DATA:
            return deleteData(state);
        default:
            return state;
    }
}

export default profileReducer;