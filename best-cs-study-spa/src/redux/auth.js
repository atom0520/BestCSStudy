import * as ActionTypes from './ActionTypes';
import JwtDecode from 'jwt-decode';
import { store } from './store';

const initAuthState = ()=>{
    var initAuthState = {
        isRequestingLogin: false,
        errMessLogin: null,
        isAuthenticated: false,
        token: null,
        decodedToken: null,
        user: null,
        isRequestingLogout: false
    };

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if(token != null && user != null){
        const decodedToken = JwtDecode(token);
        if (typeof decodedToken.exp === 'undefined' || decodedToken.exp > Date.now().valueOf() / 1000) {
            initAuthState.token = token;
            initAuthState.decodedToken = decodedToken;
            initAuthState.isAuthenticated = true;
            initAuthState.user = user;

        }
        else{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    return initAuthState;
};

export const Auth = (state = initAuthState(), action) => {
    switch(action.type){
        case ActionTypes.LOGIN_REQUEST:
            return {...state,
                isRequestingLogin: true,
                errMessLogin:null,
                isAuthenticated: false,
                token: null,
                decodedToken: null,
                user: null
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {...state,
                isRequestingLogin: false,
                errMessLogin:null,
                isAuthenticated: true,
                token: action.token,
                decodedToken: JwtDecode(action.token),
                user: action.user,
            };
        case ActionTypes.LOGIN_FAILURE:
            return {...state,
                isRequestingLogin: false,
                errMessLogin:action.message,
                isAuthenticated: false,
                token: null,
                decodedToken: null,
                user: null
            };
        case ActionTypes.LOGOUT_REQUEST:
            return {...state,
                isRequestingLogout: true
            };
        case ActionTypes.LOGOUT_SUCCESS:
            return {...state,
                isRequestingLogout: false,
                isAuthenticated: false,
                token: null,
                decodedToken: null
            };
        case ActionTypes.SET_USER_MAIN_PHOTO_URL:
            return {...state,
                user: {...state.user, photoUrl: action.url}
            };
        case ActionTypes.ADD_AUTH_USER:
            return {...state,
                user: action.user
            };
        // case ActionTypes.SIGNUP_REQUEST:
        //     return {...state,
        //         isLoadingSignup: true
        //     };
        // case ActionTypes.SIGNUP_SUCCESS:
        //     return {...state,
        //         isLoadingSignup: false,
        //         errMess: '',
        //     };
        // case ActionTypes.SIGNUP_FAILURE:
        //     return {...state,
        //         isLoadingSignup: false,
        //         errMess: action.message
        //     };
        default:
            return state;
    }
};