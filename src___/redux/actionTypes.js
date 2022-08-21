import { SERVER_URL, SPORTDATA_API_TOKEN } from "@env"

//USER
export const SET_USER = "SET_USER";
export const SET_USER_OUT = "SET_USER_OUT";
export const SET_USER_INTRO = "SET_USER_INTRO";
export const SET_CONFERENCES = "SET_CONFERENCES";
export const SET_USER_CONFERENCE = "SET_USER_CONFERENCE";
export const SET_GROUPS = "SET_GROUPS";
export const SET_USERS_GROUP = "SET_USERS_GROUP";
export const SET_USERS = "SET_USERS";
export const SET_USER_STATUS = "SET_USER_STATUS";
export const SET_CONFERENCES_TEAMS = "SET_CONFERENCES_TEAMS";
export const SET_MY_USERS_GROUP = "SET_MY_USERS_GROUP";

//GAME
export const SET_GAMES = "SET_GAMES";
export const GET_GAMES = "GET_GAMES";
export const SET_GAME_STATUS = "SET_GAME_STATUS";
export const GET_WEEK_GAMES = "GET_WEEK_GAMES";
export const GET_GROUP_BETS = "GET_GROUP_BETS";
export const GET_MY_GROUP_BETS = "GET_MY_GROUP_BETS";
export const SET_CURRENT_WEEK = "SET_CURRENT_WEEK";
export const GET_MY_PARLAY = "GET_MY_PARLAY";
export const GET_GROUP_PARLAY = "GET_GROUP_PARLAY";
export const GET_MY_GROUP_PARLAY = "GET_MY_GROUP_PARLAY";
export const SET_SEASON_WEEK = "SET_SEASON_WEEK";

export const SET_BET = "SET_BET";
export const GET_ONE_BET = "GET_ONE_BET";
export const GET_ALL_BET = "GET_ONE_BET";
export const GET_BETS = "GET_BETS";
export const GET_WEEK_BETS = "GET_WEEK_BETS";
export const SAVE_BET = "SAVE_BET";
export const GET_PLAYERS = "GET_PLAYERS";
export const GET_PLAYERS_BY_WEEK = "GET_PLAYERS_BY_WEEK";
//Her USER

export const SET_HER_INFO_USER = "SET_HER_INFO_USER";
export const SET_HER_USER_BETS = "SET_HER_USER_BETS";
export const SET_HER_USER_PARLAYS = "SET_HER_USER_PARLAYS";
export const SET_HER_GROUP_USERS = "SET_HER_GROUP_USERS";
export const SET_HER_GROUP_BETS = "SET_HER_GROUP_BETS";
export const SET_HER_GROUP_PARLAYS = "SET_HER_GROUP_PARLAYS";
export const SET_BOWL_SEASON = "SET_BOWL_SEASON";
export const SET_NOTIFICATION = "SET_NOTIFICATION";
export const SET_WEEK_START = "SET_WEEK_START";

//PROCESS
export const PROCCESS_START = "PROCCESS_START";
export const PROCCESS_SUCCESSED = "PROCCESS_SUCCESSED";
export const PROCCESS_FAILLED = "PROCCESS_FAILLED";

export const SERVER = "http://192.168.1.15:1337";
//export const SERVER = "https://cfgl-staging.herokuapp.com";
//export const SERVER = SERVER_URL;
export const KEYAPI = SPORTDATA_API_TOKEN;


