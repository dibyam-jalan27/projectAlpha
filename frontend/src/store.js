import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import{
    userReducer
}from './reducers/userReducer.js';
import { problemsReducer } from './reducers/problemReducer.js';

const reducer = combineReducers({
    user:userReducer,
    problems:problemsReducer,
});

let initialState = {

};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;