import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Values } from './values';
import { Users } from './users';
import { Auth } from './auth';
import thunk from 'redux-thunk';
import logger from "redux-logger";

// const ConfigureStore = () => {
//     return createStore(
//         combineReducers({
//             values: Values,
//             auth: Auth,
//             users: Users
//         }),
//         applyMiddleware(thunk, logger)
//     );
// }

export const store = createStore(
    combineReducers({
        values: Values,
        auth: Auth,
        users: Users
    }),
    applyMiddleware(thunk, logger)
);