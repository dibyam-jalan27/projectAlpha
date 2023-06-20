import{
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    CLEAR_ERRORS,
  } from "../constants/userConstants.js";
import axios from "axios";

// Login
export const login = (email, password) => async (dispatch) => {
    try{
        dispatch({type: LOGIN_REQUEST});

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const {data} = await axios.post("/api/v1/login", {email, password}, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user,
        });
    }
    catch(error){
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message,
        });
    }
};

//Register User
export const register = (name,email,password) => async (dispatch) => {
    try{
        dispatch({type: REGISTER_USER_REQUEST});

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const {data} = await axios.post("/api/v1/register", {name,email,password}, config);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        });
    }
    catch(error){
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message,
        });
    }
}

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    });
}