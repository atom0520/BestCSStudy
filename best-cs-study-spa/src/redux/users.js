import * as ActionTypes from './ActionTypes';

export const Users = (
    state = { 
        isLoading: false,
        errMess: null,
        users: [],
        usersDetails: [],
    }, 
    action) => {
    switch(action.type) {
        case ActionTypes.USERS_LOADING:
            return {...state, isLoading: true, errMess: null, users: []};
        case ActionTypes.ADD_USERS:
            return {...state, isLoading: false, errMess: null, users: action.payload};
        case ActionTypes.USERS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, users: []};
        case ActionTypes.ADD_USER:{
            var usersDetails = state.usersDetails;
            var userDetailsIndex = usersDetails.findIndex(userDetails=>userDetails.id == action.user.id);
            if(userDetailsIndex==-1){
                usersDetails.push(action.user);
            }
            else{
                usersDetails[userDetailsIndex]=action.user;
            }
            return {...state, usersDetails: usersDetails};
        }
        default:
            return state;
    }
}