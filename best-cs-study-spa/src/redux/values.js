import * as ActionTypes from './ActionTypes';

export const Values = (
    state = { 
        isLoading: true, 
        errMess: null, 
        values: []
    }, 
    action) => {
    switch(action.type) {
        case ActionTypes.VALUES_LOADING:
            return {...state, isLoading: true, errMess: null, values: []};
        case ActionTypes.ADD_VALUES:
            return {...state, isLoading: false, errMess: null, values: action.payload};
        case ActionTypes.VALUES_FAILED:
            return {...state, isLoading: false, errMess: action.payload, values: []};
        default:
            return state;
    }
}