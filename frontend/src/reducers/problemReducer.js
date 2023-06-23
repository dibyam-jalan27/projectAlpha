import {
  All_PROBLEMS_REQUEST,
  All_PROBLEMS_SUCCESS,
  All_PROBLEMS_FAIL,
  CLEAR_ERRORS,
  PROBLEM_DETAILS_REQUEST,
  PROBLEM_DETAILS_SUCCESS,
  PROBLEM_DETAILS_FAIL,
  NEW_PROBLEM_REQUEST,
  NEW_PROBLEM_SUCCESS,
  NEW_PROBLEM_RESET,
  NEW_PROBLEM_FAIL,
} from "../constants/problemConstants.js";

export const problemsReducer = (state = { problems: [] }, action) => {
  switch (action.type) {
    case All_PROBLEMS_REQUEST:
      return {
        loading: true,
        problems: [],
      };
    case All_PROBLEMS_SUCCESS:
      return {
        loading: false,
        problems: action.payload.problems,
        problemsCount: action.payload.problemsCount,
      };
    case All_PROBLEMS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const problemmDetailReducer = (state = { problem: {} }, action) => {
  switch (action.type) {
    case PROBLEM_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PROBLEM_DETAILS_SUCCESS:
      return {
        loading: false,
        problem: action.payload,
      };
    case PROBLEM_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const newProblemReducer = (state = { problem: {} }, action) => {
  switch (action.type) {
    case NEW_PROBLEM_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_PROBLEM_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        problem: action.payload.problem,
      };
    case NEW_PROBLEM_RESET:
      return {
        ...state,
        success: false,
      };
    case NEW_PROBLEM_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
