import {
  SET_HER_INFO_USER,
  SET_HER_USER_BETS,
  SET_HER_USER_PARLAYS,
  SET_HER_GROUP_USERS,
  SET_HER_GROUP_BETS,
  SET_HER_GROUP_PARLAYS,
} from "../actionTypes";

const INTIAL_STATE = {
  herInfoUser: {},

  herBets: [],
  herParlays: [],

  herGroupParlays: [],
  herGroupUsers: [],
  herGroupBets: [],

  status: "",
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SET_HER_INFO_USER: //
      return {
        ...state,
        herInfoUser: action.data,
      };
    case SET_HER_USER_BETS: //
      return {
        ...state,
        herBets: action.data,
      };
    case SET_HER_USER_PARLAYS: //
      return {
        ...state,
        herParlays: action.data,
      };
    case SET_HER_GROUP_USERS: //
      return {...state, herGroupUsers: action.data};

    case SET_HER_GROUP_BETS: //
      return {...state, herGroupBets: action.data};

    case SET_HER_GROUP_PARLAYS: //
      return {...state, herGroupParlays: action.data};

    default:
      return state;
  }
};
