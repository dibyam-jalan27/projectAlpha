import axios from "axios";
import{
    All_PROBLEMS_REQUEST,
    All_PROBLEMS_SUCCESS,
    All_PROBLEMS_FAIL,
    CLEAR_ERRORS,
} from "../constants/problemConstants.js";

// Get all problems
export const getProblems = () => async (dispatch) => {
    try{
        dispatch({type: All_PROBLEMS_REQUEST});

        const {data} = await axios.get("/api/v1/problems");

        dispatch({
            type: All_PROBLEMS_SUCCESS,
            payload: data,
        });
    }
    catch(error){
        dispatch({
            type: All_PROBLEMS_FAIL,
            payload: error.response.data.message,
        });
    }
}

//Clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    });
}