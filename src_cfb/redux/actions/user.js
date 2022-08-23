import {
  SERVER,
  SET_USER,
  SET_CONFERENCES,
  SET_USER_OUT,
  SET_USER_INTRO,
  SET_USER_CONFERENCE,
  SET_GROUPS,
  SET_USERS_GROUP,
  SET_MY_USERS_GROUP,
  SET_USERS,
  SET_USER_STATUS,
  SET_CONFERENCES_TEAMS,
  SET_BOWL_SEASON,
  KEYAPI,
  SET_NOTIFICATION,
  SET_USER_RANK,
} from '../actionTypes'
import axios from 'axios'

export const setUserStatus = data => {
  return dispatch => {
    dispatch({
      type: SET_USER_STATUS,
      data,
    })
  }
}

export const setBowlSeason = data => {
  return dispatch => {
    dispatch({
      type: SET_BOWL_SEASON,
      data,
    })
  }
}

export const setNotification = data => {
  return dispatch => {
    dispatch({
      type: SET_NOTIFICATION,
      data,
    })
  }
}

export const setUserRank = data => {
  return dispatch => {
    dispatch({
      type: SET_USER_RANK,
      data,
    })
  }
}

export const createUser = data => {
  return async dispatch => {
    dispatch(setUserStatus('STARTED_CREATE'))

    let selectedGroup = null
    const groups = await axios.get(`${SERVER}/groups`)

    if (groups && groups.data && groups.data.length > 0) {
      const selectedTmp = await groups.data
        .map(m => {
          return { id: m._id, name: m.name, countUsers: m.users.length }
        })
        .filter(f => f.countUsers < 12)

      if (selectedTmp.length > 0) {
        selectedGroup = selectedTmp[0]

        data.group = selectedGroup.id
        axios
          .post(`${SERVER}/auth/local/register`, data)
          .then(response => {
            // Handle success.
            if (response.data && response.data.user) {
              // dispatch({
              //   type: SET_USER,
              //   data: {token: response.data.jwt, user: response.data.user},
              // });
              dispatch(setUserStatus('SUCCESSED_CREATE'))

              alert('Your account has been created. Please confirm your email to be able to connect')
            }
          })
          .catch(error => {
            // Handle error.
            dispatch(setUserStatus('FAILLED_CREATE'))
            console.log(error)
          })
      } else {
        alert('We are sorry, All groups are full. Please Try later')
      }
    } else {
      alert('We are sorry, we not found any  group for you')
    }
  }
}
export const getUserInfo = (id, token) => {
  return dispatch => {
    axios
      .get(`${SERVER}/users/${id}`)
      .then(response => {
        dispatch({
          type: SET_USER,
          user: { jwt: token, profile: response.data[0] },
        })
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error)
      })
  }
}
export const updateUserInfo = (data, id, token) => {
  return dispatch => {
    axios
      .put(`${SERVER}/users/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        dispatch({
          type: SET_USER,
          data: { token: token, user: response.data },
        })

        var size = Object.keys(data).length

        if (response.data && data.conferenceCFB && size === 1) {
          alert('Conference Successful update')
        }
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error)
      })
  }
}
export const forgetPassword = email => {
  return dispatch => {
    dispatch(setUserStatus('STARTED_FORGOT'))
    axios
      .post(`${SERVER}/auth/forgot-password`, {
        email: email,
      })
      .then(response => {
        // Handle success.

        if (response.data && response.data.ok === true) {
          dispatch(setUserStatus('SUCCESSED_FORGOT'))
        }
        //console.log(JSON.stringify(response, null, 2));
      })
      .catch(error => {
        // Handle error.
        dispatch(setUserStatus('FAILLED_FORGOT'))
        console.log(JSON.stringify(error, null, 2))
      })
  }
}
export const sendConfirmationEmail = email => {
  return dispatch => {
    dispatch(setUserStatus('STARTED_SEND_CONF_EMAIL'))
    axios
      .post(`${SERVER}/auth/send-email-confirmation`, {
        email: email,
      })
      .then(response => {
        // Handle success.
        //console.log(response.data)
        if (response.data && response.data.sent === true) {
          dispatch(setUserStatus('SUCCESSED_SEND_CONF_EMAIL'))
        }
        //console.log(JSON.stringify(response, null, 2));
      })
      .catch(error => {
        // Handle error.
        dispatch(setUserStatus('FAILLED_SEND_CONF_EMAIL'))
        console.log(JSON.stringify(error, null, 2))
      })
  }
}
export const resetPassword = data => {
  return dispatch => {
    dispatch(setUserStatus('STARTED_FORGOT'))
    axios
      .post(`${SERVER}/auth/reset-password`, data)
      .then(response => {
        // Handle success.
        // alert(JSON.stringify(response));
        dispatch({
          type: SET_USER,
          data: { user: response.data.user, token: response.data.jwt },
        })
        dispatch(setUserStatus('SUCCESSED_LOGIN'))
        //console.log(JSON.stringify(response, null, 2));
      })
      .catch(error => {
        // Handle error.

        alert('Bad code or code has already used')
        dispatch(setUserStatus('FAILLED_FORGOT'))
        console.log(JSON.stringify(error, null, 2))
      })
  }
}
export const loginUser = (email, password) => {
  return dispatch => {
    dispatch(setUserStatus('STARTED_LOGIN'))
    axios
      .post(`${SERVER}/auth/local/`, {
        identifier: email,
        password: password,
      })
      .then(function (response) {
        dispatch({
          type: SET_USER,
          data: { user: response.data.user, token: response.data.jwt },
        })

        dispatch(setUserStatus('SUCCESSED_LOGIN'))
      })
      .catch(function (error) {
        // handle error
        //alert(JSON.stringify(error))
        if (error.response.data.message[0].messages[0].message === 'Your account email is not confirmed')
          dispatch(setUserStatus(error.response.data.message[0].messages[0].message))
        else dispatch(setUserStatus('FAILLED_LOGIN'))
        // alert(error.response.data.message[0].messages[0].message)
        console.log(JSON.stringify(error.response.data.message[0].messages[0].message))
      })
  }
}
export const setUserConference = data => {
  return dispatch => {
    dispatch({ type: SET_USER_CONFERENCE, data })
  }
}
export const logoutUser = () => {
  return dispatch => {
    dispatch({ type: SET_USER_OUT, log: false })
  }
}
export const introUser = val => {
  return dispatch => {
    dispatch({ type: SET_USER_INTRO, hasBoarded: val })
  }
}
export const getConferences = () => {
  return dispatch => {
    return axios
      .get(`${SERVER}/conferences`)
      .then(function (response) {
        // alert(JSON.stringify(response.data.filter(i => i.name === "West" || i.name === "South" || i.name === "North" || i.name === "East")))
        // handle success
        dispatch({
          type: SET_CONFERENCES,
          data: response.data.filter(
            i => i.name === 'West' || i.name === 'South' || i.name === 'North' || i.name === 'East',
          ),
        })
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message))
        //dispatch({type: SET_USER, user: user});
      })
  }
}
export const getConferencesTeams = (confer, token) => {
  return dispatch => {
    //if (confer !== "") {
    return axios
      .get(`https://api.sportsdata.io/v3/nfl/scores/json/Teams?key=${KEYAPI}`)
      .then(function (response) {
        // handle success
        if (response.data) {
          let arr = []
          // West South North East
          if (confer == 'West')
            arr = [
              {
                ConferenceName: 'West',
                Teams: response.data.filter(f => f.Division === 'West'),
              },
            ]
          else if (confer == 'South')
            arr = [
              {
                ConferenceName: 'South',
                Teams: response.data.filter(f => f.Division === 'South'),
              },
            ]
          else if (confer == 'North')
            arr = [
              {
                ConferenceName: 'North',
                Teams: response.data.filter(f => f.Division === 'North'),
              },
            ]
          else if (confer == 'East')
            arr = [
              {
                ConferenceName: 'East',
                Teams: response.data.filter(f => f.Division === 'East'),
              },
            ]
          else
            arr = [
              {
                ConferenceName: 'ALL',
                Teams: response.data,
              },
            ]

          //alert(arr.length);
          // let conf = [];
          // if (confer !== "ALL") {
          //   conf = arr.filter(
          //     (i) => JSON.stringify(i.Teams).indexOf(confer) > -1
          //     //=== ConferenceID
          //   );
          // } else {
          //   conf = arr;
          // }

          let conference = arr.length > 0 ? arr[0] : {}
          dispatch({ type: SET_CONFERENCES_TEAMS, data: conference })
        }
      })
      .catch(function (error) {
        // handle error
        // console.log(JSON.stringify(error.message));
        //dispatch({type: SET_USER, user: user});
      })
    // } else {
    //   dispatch({type: SET_CONFERENCES_TEAMS, data: {Teams: []}});
    // }
  }
}
export const getGroups = token => {
  return dispatch => {
    return axios
      .get(`${SERVER}/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        // handle success
        dispatch({ type: SET_GROUPS, data: response.data })
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message))
        //dispatch({type: SET_USER, user: user});
      })
  }
}
export const getUsersGroup = (groupId, token) => {
  let query = ''
  return dispatch => {
    query = groupId !== '' ? `${SERVER}/users?group_eq=${groupId}` : `${SERVER}/users`
    return axios
      .get(query, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        // handle success
        //console.log(groupId);
        //alert(JSON.stringify(response.data));
        dispatch({ type: SET_USERS_GROUP, data: response.data })
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message))
        //dispatch({type: SET_USER, user: user});
      })
  }
}
export const getMyGroupUsers = (groupId, token) => {
  return dispatch => {
    return axios
      .get(`${SERVER}/users?group_eq=${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        //console.log(response);
        dispatch({ type: SET_MY_USERS_GROUP, data: response.data })
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message))
        //dispatch({type: SET_USER, user: user});
      })
  }
}
export const getSearchUsers = token => {
  return dispatch => {
    return axios
      .get(`${SERVER}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        // handle success
        //console.log(response);
        dispatch({ type: SET_USERS, data: response.data })
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error.message))
        //dispatch({type: SET_USER, user: user});
      })
  }
}
