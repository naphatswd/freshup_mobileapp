import { INITIAL_DATA, UPDATE_ROUTE, DELETE_DATA } from './types';

InitData = () =>{
    return {
        type:INITIAL_DATA
    };
}

updateRoute = (data)=>{
    return{
        type:UPDATE_ROUTE,
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
    updateRoute,
    deleteData
}

export {actionCreators}