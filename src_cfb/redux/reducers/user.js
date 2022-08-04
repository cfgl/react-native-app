import {
  SET_USER,
  SET_USER_OUT,
  SET_CONFERENCES,
  SET_USER_INTRO,
  SET_USER_CONFERENCE,
  SET_GROUPS,
  SET_USERS_GROUP,
  SET_USERS,
  SET_USER_STATUS,
  SET_CONFERENCES_TEAMS,
  SET_MY_USERS_GROUP,
  SET_BOWL_SEASON,
  SET_NOTIFICATION,
  SET_USER_RANK,
} from '../actionTypes'

const INTIAL_STATE = {
  user: {},
  token: '',
  bowlSeason: false,
  users: [],
  userRanking: 0,
  conference: {},
  conferences: [],
  conferenceTeams: {},
  groups: [],
  usersgroup: [],
  mygroupusers: [],
  logged: false,
  hasBoarded: false,
  statusUser: '',
  enableNotification: true,
}

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.data.user,
        token: action.data.token,
        logged: true,
        hasBoarded: true,
      }
    case SET_USER_OUT:
      return {
        ...state,
        logged: false,
        conference: {},
        conferences: [],
        groups: [],
        usersgroup: [],
      }
    case SET_USER_CONFERENCE:
      return { ...state, conference: action.data }
    case SET_USER_RANK:
      return { ...state, userRanking: action.data }
    case SET_NOTIFICATION:
      return { ...state, enableNotification: action.data }
    case SET_BOWL_SEASON:
      return { ...state, bowlSeason: action.data }
    case SET_USER_STATUS:
      return { ...state, statusUser: action.data }
    case SET_CONFERENCES:
      return { ...state, conferences: action.data }
    case SET_CONFERENCES_TEAMS:
      return { ...state, conferenceTeams: action.data }
    case SET_GROUPS:
      return { ...state, groups: action.data }
    case SET_USERS_GROUP:
      return { ...state, usersgroup: action.data }
    case SET_MY_USERS_GROUP:
      return { ...state, mygroupusers: action.data }
    case SET_USER_INTRO:
      return { ...state, hasBoarded: action.hasBoarded }
    case SET_USERS:
      return { ...state, users: action.data }
    default:
      return state
  }
}
