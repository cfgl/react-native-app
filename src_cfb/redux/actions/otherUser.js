import {
  SERVER,
  SET_HER_INFO_USER,
  SET_HER_USER_BETS,
  SET_HER_USER_PARLAYS,
  SET_HER_GROUP_USERS,
  SET_HER_GROUP_BETS,
  SET_HER_GROUP_PARLAYS,
  KEYAPI,
} from "../actionTypes";
import axios from "axios";
export const setHerUserStatus = (data) => {
  return (dispatch) => {
    dispatch({
      type: SET_USER_STATUS,
      data,
    });
  };
};

export const setHerInfoUser = (data) => {
  return (dispatch) => {
    dispatch({
      type: SET_HER_INFO_USER,
      data,
    });
  };
};

export const getHerGroupUsers = (groupId, token) => {
  return (dispatch) => {
    return axios
      .get(`${SERVER}/users?group_eq=${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        // handle success
        //console.log("Her group Users");
        //console.log(response.data.length);
        //alert(JSON.stringify(response.data));
        dispatch({ type: SET_HER_GROUP_USERS, data: response.data });
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message));
        //dispatch({type: SET_USER, user: user});
      });
  };
};

export const getGroupParlays = (groupId, token) => {
  return (dispatch) => {
    return axios
      .get(`${SERVER}/parlaycfbs?user.group._id=${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          // console.log("Her group parlays");
          // console.log(response.data.length);

          dispatch({ type: SET_HER_GROUP_PARLAYS, data: response.data });
        }
      })
      .catch(function (error) {
        // handle error
        // alert(JSON.stringify(error.message));
        console.log(JSON.stringify(error.message));
      });
  };
};

export const getHerGroupBets = (groupId, token) => {
  return (dispatch) => {
    return axios
      .get(`${SERVER}/betscfbs?user.group._id=${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          // console.log("Her group Bets");
          // console.log(response.data.length);

          //console.log(JSON.stringify(response.data, null, 2));

          dispatch({ type: SET_HER_GROUP_BETS, data: response.data });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message));
      });
  };
};
export const getHerBets = (user, token) => {
  return (dispatch) => {
    dispatch({ type: SET_HER_USER_BETS, data: [] });
    return axios
      .get(`${SERVER}/betscfbs?user_eq=${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          // console.log("Her  Bets");
          // console.log(response.data.length);
          dispatch({ type: SET_HER_USER_BETS, data: response.data });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message));
      });
  };
};

export const getHerParlays = (id, token) => {
  return (dispatch) => {
    dispatch({ type: SET_HER_USER_PARLAYS, data: [] });
    return axios
      .get(`${SERVER}/parlaycfbs?user._id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          // console.log("Her  parlays");
          // console.log(response.data.length);

          dispatch({ type: SET_HER_USER_PARLAYS, data: response.data });
        }
      })
      .catch(function (error) {
        // handle error

        console.log(JSON.stringify(error.message));
      });
  };
};

export const getHerGroupParlay = (idGroup, token) => {
  return (dispatch) => {
    return axios
      .get(`${SERVER}/parlaycfbs?user.group._id=${idGroup}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          // console.log("Her  parlays");
          // console.log(response.data.length);
          dispatch({ type: SET_HER_GROUP_PARLAYS, data: response.data });
        }
      })
      .catch(function (error) {
        // handle error

        console.log(JSON.stringify(error.message));
      });
  };
};
