import{
    RUN_REQUEST,
    RUN_SUCCESS,
    RUN_FAIL,
    CLEAR_ERROR
} from '../constants/submitContants.js';

export const runReducer = (state = {}, action) => {
    switch(action.type){
        case RUN_REQUEST:
            return{
                loading: true
            }
        case RUN_SUCCESS:
            return{
                loading: false,
                result: action.payload
            }
        case RUN_FAIL:
            return{
                loading: false,
                error: action.payload
            }
        case CLEAR_ERROR:
            return{
                ...state,
                error: null
            }
        default:
            return state
    }
}