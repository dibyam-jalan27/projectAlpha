import{
    NEW_TESTCASE_REQUEST,
    NEW_TESTCASE_SUCCESS,
    NEW_TESTCASE_FAIL,
    CLEAR_ERRORS
} from '../constants/testcaseConstants'
import axios from 'axios';

export const newTestCase = (testCase) => async (dispatch) => {
    try{
        dispatch({type: NEW_TESTCASE_REQUEST})

        const config = {
            headers:{
                'Content-Type': 'application/json',
            }
        }

        const {data} = await axios.post('/api/v1/admin/testcase/new',testCase,config);

        dispatch({
            type: NEW_TESTCASE_SUCCESS,
            payload: data
        })
    }catch(error){
        dispatch({
            type: NEW_TESTCASE_FAIL,
            payload: error.response.data.message
        })
    }
}

//Clear error
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}