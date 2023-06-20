import{
    All_PROBLEMS_REQUEST,
    All_PROBLEMS_SUCCESS,
    All_PROBLEMS_FAIL,
    CLEAR_ERRORS,
} from "../constants/problemConstants.js";

export const problemsReducer = (state = {problems: []}, action) => {
    switch(action.type){
        case All_PROBLEMS_REQUEST:
            return{
                loading: true,
                problems: [],
            }
        case All_PROBLEMS_SUCCESS:
            return{
                loading: false,
                problems: action.payload.problems,
                problemsCount: action.payload.problemsCount,
            }
        case All_PROBLEMS_FAIL:
            return{
                loading: false,
                error: action.payload,
            }
        case CLEAR_ERRORS:
            return{
                ...state,
                error: null,
            }
        default:
            return state;
    }
}