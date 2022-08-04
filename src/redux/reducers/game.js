import {
  SET_GAMES,
  SET_GAME_STATUS,
  GET_BETS,
  GET_WEEK_BETS,
  GET_WEEK_GAMES,
  GET_GROUP_BETS,
  GET_MY_GROUP_BETS,
  SET_CURRENT_WEEK,
  GET_MY_PARLAY,
  GET_GROUP_PARLAY,
  GET_MY_GROUP_PARLAY,
  GET_PLAYERS,
  SET_SEASON_WEEK,
  GET_PLAYERS_BY_WEEK,
  SET_WEEK_START
} from "../actionTypes";

const INTIAL_STATE = {
  players: [],
  playersByWeek: [],
  games: [],
  weekGames: [],
  bets: [],
  weekBets: [],
  groupBets: [],
  mygroupBets: [],
  myParlay: [],
  groupParlay: [],
  myGroupParlay: [],
  currentYear: 2020,
  currentWeek: 1,
  statusGame: "",
  lastUpdate: new Date(),
  weekstartdate: [],
  seasonStatus: "PREPARING"
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SET_SEASON_WEEK:
      return {
        ...state,
        currentYear: action.data.season,
        currentWeek: action.data.week,
        seasonStatus: action.data.seasonStatus
      };
    case SET_GAMES:
      return { ...state, games: action.data, lastUpdate: action.lastUpdate };
    case GET_BETS:
      return { ...state, bets: action.data };
    case GET_WEEK_BETS:
      return { ...state, weekBets: action.data };
    case GET_GROUP_BETS:
      return { ...state, groupBets: action.data };
    case GET_MY_GROUP_BETS:
      return { ...state, mygroupBets: action.data };
    case GET_WEEK_GAMES:
      return { ...state, weekGames: action.data };
    case GET_MY_PARLAY:
      return { ...state, myParlay: action.data };
    case GET_PLAYERS:
      return { ...state, players: action.data };
    case GET_PLAYERS_BY_WEEK:
      return { ...state, playersByWeek: action.data };
    case GET_GROUP_PARLAY:
      return { ...state, groupParlay: action.data };
    case GET_MY_GROUP_PARLAY:
      return { ...state, myGroupParlay: action.data };
    case SET_GAME_STATUS:
      return { ...state, statusGame: action.data };
    case SET_WEEK_START:
      return { ...state, weekstartdate: action.data };
    default:
      return state;
  }
};
