import {
  SERVER,
  SET_GAMES,
  SET_GAME_STATUS,
  GET_BETS,
  GET_WEEK_BETS,
  GET_WEEK_GAMES,
  GET_GROUP_BETS,
  GET_MY_GROUP_BETS,
  SET_SEASON_WEEK,
  GET_MY_PARLAY,
  GET_GROUP_PARLAY,
  GET_MY_GROUP_PARLAY,
  GET_PLAYERS,
  GET_PLAYERS_BY_WEEK,
  KEYAPI,
  SET_WEEK_START,
} from '../actionTypes'

import axios from 'axios'
import { teams } from '../../datas/teams'
import { isNumber } from 'lodash'

getTeamById = id => {
  let res = teams.filter(f => f.TeamID === id)
  if (res.length > 0) return res[0]
  else return {}
}

export const setGameStatus = data => {
  return dispatch => {
    dispatch({
      type: SET_GAME_STATUS,
      data,
    })
  }
}

export const setWeekDate = () => {
  return dispatch => {
    axios.get(`${SERVER}/weekstartdatecfb`).then(function (response) {
      dispatch({
        type: SET_WEEK_START,
        data: response.data.startat,
      })
    })
  }
}
export const setCurrentSeasonWeek = () => {
  return dispatch => {
    axios.get(`${SERVER}/weekstartdatecfb`).then(function (response1) {
      axios.get(`https://api.sportsdata.io/v3/cfb/scores/json/CurrentWeek?key=${KEYAPI}`).then(function (response2) {
        // handle success
        // alert(response1.data.currentweek)
        const data = {
          season: response1.data.currentseason,
          seasonStatus: response1.data.status,
          week: response1.data.currentweek !== -1 ? response1.data.currentweek : response2.data, //isNumber(response2.data)
        }
        dispatch({
          type: SET_SEASON_WEEK,
          data,
        })
      })
    })
  }
}

export const getCurrentWeekGame = (season, week) => {
  return dispatch => {
    return axios
      .get(`https://api.sportsdata.io/v3/cfb/scores/json/GamesByWeek/${season}/${week}?key=${KEYAPI}`)
      .then(function (response) {
        if (response.data) {
          let datas = response.data.sort(function (a, b) {
            return new Date(a.Day) - new Date(b.Day)
          })
          console.log('Get Current Week Game')
          dispatch({ type: SET_GAMES, data: datas, lastUpdate: new Date() })
        }
      })
      .catch(function (error) {
        // handle error
        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED' })
      })
  }
}

export const getWeekGames = (season, week) => {
  return dispatch => {
    return axios
      .get(
        `https://api.sportsdata.io/v3/cfb/scores/json/GamesByWeek/${season}/${week}?key=${KEYAPI}`, //`https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/${season}/${week}?key=${KEYAPI}`
      )
      .then(function (response) {
        if (response.data) {
          let datas = response.data.map(m => {
            m.AwayTeamInfo = this.getTeamById(m.AwayTeamID)
            m.HomeTeamInfo = this.getTeamById(m.HomeTeamID)

            return m
          })

          //console.log(JSON.stringify(datas[0], null, 2));

          dispatch({ type: GET_WEEK_GAMES, data: datas })
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message))
        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED' })
      })
  }
}

export const saveBet = (game, token) => {
  // console.log(token);
  // console.log(JSON.stringify(game, null, 2));

  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED' })

    axios
      .get(`${SERVER}/betscfbs?user=${game.user}&week=${game.week}&season=${game.season}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          console.log('Get my week picks')

          if (response.data.length > 0) {
            let thegame = response.data.filter(f => f.type.value === game.type.value)
            if (thegame.length === 0) {
              axios
                .post(`${SERVER}/betscfbs`, game, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then(function (response) {
                  if (response.data) {
                    dispatch(getBets(game.user, game.week, token))
                    dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_BET_CREATE' })
                  }
                })
                .catch(function (error) {
                  // handle error
                  console.log(JSON.stringify(error, null, 2))
                  dispatch({ type: SET_GAME_STATUS, data: 'FAILLED' })
                })
            }
          } else {
            axios
              .post(`${SERVER}/betscfbs`, game, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then(function (response) {
                if (response.data) {
                  dispatch(getBets(game.user, game.week, token))
                  dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_BET_CREATE' })
                }
              })
              .catch(function (error) {
                // handle error
                console.log(JSON.stringify(error, null, 2))
                dispatch({ type: SET_GAME_STATUS, data: 'FAILLED' })
              })
          }
        }
      })
      .catch(function (error) {
        // handle error

        console.log(JSON.stringify(error, null, 2))
      })
  }
}
export const getBets = (id, week, token) => {
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED_GET_MY_BETS' })
    return axios
      .get(`${SERVER}/betscfbs?user_eq=${id}&&week_eq=${week + ''}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          console.log('Get my week picks')
          // alert(response.data.length)
          // console.log(response.data.length)
          dispatch({ type: GET_BETS, data: response.data })
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_GET_MY_BETS' })
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message))
        dispatch({ type: GET_BETS, data: [] })

        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED_GET_MY_BETS' })
      })
  }
}
export const getGroupBets = (idGroup, token) => {
  let query = ''
  return dispatch => {
    query = idGroup !== '' ? `${SERVER}/betscfbs?user.group._id=${idGroup}` : `${SERVER}/betscfbs`

    dispatch({ type: SET_GAME_STATUS, data: 'STARTED' })
    return axios
      .get(query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch({ type: GET_GROUP_BETS, data: response.data })
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS' })
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message))
        dispatch({ type: GET_GROUP_BETS, data: [] })

        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED' })
      })
  }
}
export const getMyGroupBets = (idGroup, token) => {
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED_GET_MY_GRP_BET' })
    return axios
      .get(`${SERVER}/betscfbs?user.group._id=${idGroup}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          // console.log(JSON.stringify(response.data, null, 2));

          dispatch({ type: GET_MY_GROUP_BETS, data: response.data })
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_GET_MY_GRP_BET' })
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message))
        dispatch({ type: GET_MY_GROUP_BETS, data: [] })

        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED_GET_MY_GRP_BET' })
      })
  }
}
export const getWeekBets = (season, week, token) => {
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED' })
    return axios
      .get(`${SERVER}/betscfbs?season_eq=${season}&week_eq=${week}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch({ type: GET_WEEK_BETS, data: response.data })
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS' })
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error.message))
        dispatch({ type: GET_WEEK_BETS, data: [] })

        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED' })
      })
  }
}
export const updateBet = (id, data, user, token) => {
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED_BET_UPDATE' })
    return axios
      .put(`${SERVER}/betscfbs/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        //alert(JSON.stringify(data));
        if (response.data) {
          dispatch(getBets(user, data.week, token))
          //dispatch(getWeekBets(2019, 1, token));
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_BET_UPDATE' })
        }
      })
      .catch(function (error) {
        // handle error

        //alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message))
        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED_BET_UPDATE' })
      })
  }
}

export const saveParlay = (parlay, token) => {
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED_SAVE_PARLAY' })
    return axios
      .post(`${SERVER}/parlaycfbs`, parlay, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch(myParlays(parlay.user, token))
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_SAVE_PARLAY' })
        }
      })
      .catch(function (error) {
        // handle error
        //alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message))
        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED_SAVE_PARLAY' })
      })
  }
}

export const myGroupParlays = (idGroup, token) => {
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED_MY_GET_GROUP_PARLAY' })
    return axios
      .get(`${SERVER}/parlaycfbs?user.group._id=${idGroup}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          //console.log(response);

          //alert(JSON.stringify(response.data));
          dispatch({ type: GET_MY_GROUP_PARLAY, data: response.data })
          dispatch({
            type: SET_GAME_STATUS,
            data: 'SUCCESS_MY_GET_GROUP_PARLAY',
          })
        }
      })
      .catch(function (error) {
        // handle error
        // alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message))
        dispatch({ type: GET_MY_GROUP_PARLAY, data: [] })

        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED_MY_GET_GROUP_PARLAY' })
      })
  }
}
export const groupParlays = (idGroup, token) => {
  let query = ''
  return dispatch => {
    query = idGroup !== '' ? `${SERVER}/parlaycfbs?user.group._id=${idGroup}` : `${SERVER}/parlaycfbs`
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED_GET_GROUP_PARLAY' })
    return axios
      .get(query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          //console.log(response);

          //alert(JSON.stringify(response.data));
          dispatch({ type: GET_GROUP_PARLAY, data: response.data })
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_GET_GROUP_PARLAY' })
        }
      })
      .catch(function (error) {
        // handle error
        // alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message))
        dispatch({ type: GET_GROUP_PARLAY, data: [] })

        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED_GET_GROUP_PARLAY' })
      })
  }
}
export const myParlays = (id, token) => {
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED_GET_MY_PARLAY' })
    return axios
      .get(`${SERVER}/parlaycfbs?user._id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          console.log('Get paylay data')
          // console.log(response.data.length)
          dispatch({ type: GET_MY_PARLAY, data: response.data })
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_GET_MY_PARLAY' })
        }
      })
      .catch(function (error) {
        // handle error

        console.log(JSON.stringify(error.message))
        dispatch({ type: GET_MY_PARLAY, data: [] })

        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED_GET_MY_PARLAY' })
      })
  }
}

export const deleteParlay = (parlayId, user, token) => {
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED_DELETE_PARLAY' })
    return axios
      .delete(`${SERVER}/parlaycfbs/${parlayId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          console.log('Remove paylay data')
          dispatch(myParlays(user, token))
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_DELETE_PARLAY' })
        }
      })
      .catch(function (error) {
        // handle error
        //alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message))
        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED_DELETE_PARLAY' })
      })
  }
}

export const getPlayers = (player, token) => {
  const query =
    player === null ? `${SERVER}/betscfbs/players?_limit=2000` : `${SERVER}/betscfbs/players?user._id=${player}`
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED' })
    return axios
      .get(query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch({ type: GET_PLAYERS, data: response.data })
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_GET_PLAYERS' })
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error, null, 2))
        dispatch({ type: GET_PLAYERS, data: [] })

        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED' })
      })
  }
}

export const getPlayersByWeek = (week, token) => {
  const query = `${SERVER}/betscfbs/players?week=${week}`
  return dispatch => {
    dispatch({ type: SET_GAME_STATUS, data: 'STARTED' })
    return axios
      .get(query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch({ type: GET_PLAYERS_BY_WEEK, data: response.data })
          dispatch({ type: SET_GAME_STATUS, data: 'SUCCESS_GET_PLAYERS_BY_WEEK' })
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error, null, 2))
        dispatch({ type: SET_GAME_STATUS, data: 'FAILLED' })
      })
  }
}
