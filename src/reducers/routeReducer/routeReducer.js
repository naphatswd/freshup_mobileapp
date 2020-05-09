import { INITIAL_DATA, UPDATE_ROUTE, DELETE_DATA } from './types';

const initialState = {
    route:null,
}

InitData = () =>{
    return{
        ...state,
        route
    }
}

updateRoute = (state,action)=> {
    return{
        ...state,
        route:action.data
    }
}

deleteData = (state)=>{
    return{
        ...state,
        route:null,
    }
}

routeReducer = (state = initialState, action) =>{
    switch(action.type){
        case INITIAL_DATA:
            return InitData()
        case UPDATE_ROUTE:
            return updateRoute(state,action);
        case DELETE_DATA:
            return deleteData(state);
        default:
            return state;
    }
}

export default routeReducer;