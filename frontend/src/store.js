import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import{
    userReducer
}from './reducers/userReducer.js';
import { problemmDetailReducer, problemsReducer , newProblemReducer} from './reducers/problemReducer.js';

const reducer = combineReducers({
    user:userReducer,
    problems:problemsReducer,
    problemDetails:problemmDetailReducer,
    newProblem:newProblemReducer
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