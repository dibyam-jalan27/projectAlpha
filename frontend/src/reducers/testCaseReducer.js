import{
    NEW_TESTCASE_REQUEST,
    NEW_TESTCASE_SUCCESS,
    NEW_TESTCASE_RESET,
    NEW_TESTCASE_FAIL,
    CLEAR_ERRORS
} from '../constants/testcaseConstants'

export const newTestCaseReducer = (state = {testCase: {}}, action) => {
    switch(action.type){
        case NEW_TESTCASE_REQUEST:
            return{
                ...state,
                loading: true
            }
        case NEW_TESTCASE_SUCCESS:
            return{
                loading: false,
                success: action.payload.success,
                testCase: action.payload.testCase
            }
        case NEW_TESTCASE_FAIL:
            return{
                ...state,
                error: action.payload
            }
        case NEW_TESTCASE_RESET:
            return{
                ...state,
                success: false
            }
        case CLEAR_ERRORS:
            return{
                ...state,
                error: null
            }
        default:
            return state;
    }
}