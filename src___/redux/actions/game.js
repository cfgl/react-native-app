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
} from "../actionTypes";

import axios from "axios";
import { teams } from '../../datas/teams'


getTeamById = (id) => {
  let res = teams.filter(f => f.TeamID === id);
  if (res.length > 0)
    return res[0]
  else
    return {}
}

export const setGameStatus = (data) => {
  return (dispatch) => {
    dispatch({
      type: SET_GAME_STATUS,
      data,
    });
  };
};
export const setWeekDate = () => {
  // let day = new Date().getDay();
  // alert(day)
  // UpcomingWeek
  return (dispatch) => {
    axios
      .get(
        `${SERVER}/weekstartdate`
      )
      .then(function (response) {
        //alert(JSON.stringify(response.data.startat, null, 2))
        dispatch({
          type: SET_WEEK_START,
          data: response.data.startat,
        });
      });
  };
};
export const setCurrentSeasonWeek = () => {
  // let day = new Date().getDay();
  // alert(day)
  // UpcomingWeek
  return (dispatch) => {
    axios
      .get(
        `${SERVER}/weekstartdate`
      )
      .then(function (response1) {
        axios
          .get(
            `https://api.sportsdata.io/v3/nfl/scores/json/UpcomingWeek?key=${KEYAPI}`
          )
          .then(function (response2) {
            // handle success
            //alert(response1.data.currentseason)
            dispatch({
              type: SET_SEASON_WEEK,
              data: {
                season: response1.data.currentseason,
                seasonStatus: response1.data.status,
                week: response2.data + 1,
              },
            });
          });
      });
  };
};
export const getCurrentWeekGame = (season, week) => {

  return (dispatch) => {
    return axios
      .get(
        `https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/${season}/${week}?key=${KEYAPI}`
      )
      .then(function (response) {
        if (response.data) {
          // console.log(JSON.stringify(response.data.filter(f => f.GameKey === "202010804"), null, 2));
          //alert(response.data.length)
          //alert(JSON.stringify(response.data));
          //dispatch({type: SET_GAME_STATUS, data: "SUCCESS"});
          dispatch({ type: SET_GAMES, data: response.data, lastUpdate: new Date() });
        }
      })
      .catch(function (error) {
        // handle error
        // console.log(JSON.stringify(error.message));
        // console.log("failled");
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED" });
      });
  };
};
export const getWeekGames = (season, week) => {

  return (dispatch) => {
    return axios
      .get(
        `https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/${season}/${week}?key=${KEYAPI}`
      )
      .then(function (response) {

        if (response.data) {
          //alert(JSON.stringify(response.data));
          // dispatch({type: SET_GAME_STATUS, data: "SUCCESS"});

          let datas = response.data.map(m => {
            m.AwayTeamInfo = this.getTeamById(m.AwayTeamID);
            m.HomeTeamInfo = this.getTeamById(m.HomeTeamID);
            return m
          });



          dispatch({ type: GET_WEEK_GAMES, data: datas });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED" });
      });
  };
};

export const saveBet = (game, token) => {
  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED" });

    axios
      .post(`${SERVER}/bets`, game, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {


          dispatch(getBets(game.user, game.week, token));

          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_BET_CREATE" });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED" });
      });

  };
};
export const getBets = (user, week, token) => {

  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED_GET_MY_BETS" });
    return axios
      .get(`${SERVER}/bets?user_eq=${user}&&week_eq=${week + ""}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {

          dispatch({ type: GET_BETS, data: response.data });
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_GET_MY_BETS" });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED_GET_MY_BETS" });
      });
  };
};
export const getGroupBets = (idGroup, token) => {
  let query = "";
  return (dispatch) => {
    query =
      idGroup !== ""
        ? `${SERVER}/bets?user.group._id=${idGroup}`
        : `${SERVER}/bets`;

    dispatch({ type: SET_GAME_STATUS, data: "STARTED" });
    return axios
      .get(query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          // console.log(JSON.stringify(response.data, null, 2));
          dispatch({ type: GET_GROUP_BETS, data: response.data });
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS" });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED" });
      });
  };
};
export const getMyGroupBets = (idGroup, token) => {
  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED_GET_MY_GRP_BET" });
    return axios
      .get(`${SERVER}/bets?user.group._id=${idGroup}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          // console.log(JSON.stringify(response.data, null, 2));

          dispatch({ type: GET_MY_GROUP_BETS, data: response.data });
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_GET_MY_GRP_BET" });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED_GET_MY_GRP_BET" });
      });
  };
};
export const getWeekBets = (season, week, token) => {
  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED" });
    return axios
      .get(`${SERVER}/bets?season_eq=${season}&week_eq=${week}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch({ type: GET_WEEK_BETS, data: response.data });
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS" });
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED" });
      });
  };
};
export const updateBet = (id, data, user, token) => {

  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED_BET_UPDATE" });
    return axios
      .put(`${SERVER}/bets/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        //alert(JSON.stringify(data));
        if (response.data) {
          dispatch(getBets(user, data.week, token));
          //dispatch(getWeekBets(2019, 1, token));
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_BET_UPDATE" });
        }
      })
      .catch(function (error) {
        // handle error

        //alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED_BET_UPDATE" });
      });
  };
};

export const saveParlay = (parlay, token) => {
  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED_SAVE_PARLAY" });
    return axios
      .post(`${SERVER}/parlays`, parlay, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch(myParlays(parlay.user, token));
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_SAVE_PARLAY" });
        }
      })
      .catch(function (error) {
        // handle error
        //alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED_SAVE_PARLAY" });
      });
  };
};
export const myParlays = (id, token) => {
  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED_GET_MY_PARLAY" });
    return axios
      .get(`${SERVER}/parlays?user._id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch({ type: GET_MY_PARLAY, data: response.data });
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_GET_MY_PARLAY" });
        }
      })
      .catch(function (error) {
        // handle error
        //alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED_GET_MY_PARLAY" });
      });
  };
};
export const myGroupParlays = (idGroup, token) => {
  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED_MY_GET_GROUP_PARLAY" });
    return axios
      .get(`${SERVER}/parlays?user.group._id=${idGroup}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          //console.log(response);

          //alert(JSON.stringify(response.data));
          dispatch({ type: GET_MY_GROUP_PARLAY, data: response.data });
          dispatch({
            type: SET_GAME_STATUS,
            data: "SUCCESS_MY_GET_GROUP_PARLAY",
          });
        }
      })
      .catch(function (error) {
        // handle error
        // alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED_MY_GET_GROUP_PARLAY" });
      });
  };
};
export const groupParlays = (idGroup, token) => {
  let query = "";
  return (dispatch) => {
    query =
      idGroup !== ""
        ? `${SERVER}/parlays?user.group._id=${idGroup}`
        : `${SERVER}/parlays`;
    dispatch({ type: SET_GAME_STATUS, data: "STARTED_GET_GROUP_PARLAY" });
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
          dispatch({ type: GET_GROUP_PARLAY, data: response.data });
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_GET_GROUP_PARLAY" });
        }
      })
      .catch(function (error) {
        // handle error
        // alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED_GET_GROUP_PARLAY" });
      });
  };
};
export const deleteParlay = (parlayId, user, token) => {
  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED_DELETE_PARLAY" });
    return axios
      .delete(`${SERVER}/parlays/${parlayId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch(myParlays(user, token));
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_DELETE_PARLAY" });
        }
      })
      .catch(function (error) {
        // handle error
        //alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED_DELETE_PARLAY" });
      });
  };
};

export const getPlayers = (player, token) => {


  const query =
    player === null
      ? `${SERVER}/bets/players?_limit=2000`
      : `${SERVER}/bets/players?user._id=${player}`;
  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED" });
    return axios
      .get(query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch({ type: GET_PLAYERS, data: response.data });
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_GET_PLAYERS" });
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error, null, 2));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED" });
      });
  };
};


export const getPlayersByWeek = (week, token) => {
  const query = `${SERVER}/bets/players?week=${week}`
  return (dispatch) => {
    dispatch({ type: SET_GAME_STATUS, data: "STARTED" });
    return axios
      .get(query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch({ type: GET_PLAYERS_BY_WEEK, data: response.data });
          dispatch({ type: SET_GAME_STATUS, data: "SUCCESS_GET_PLAYERS_BY_WEEK" });
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error, null, 2));
        dispatch({ type: SET_GAME_STATUS, data: "FAILLED" });
      });
  };
};