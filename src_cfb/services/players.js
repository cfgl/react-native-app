import axios from 'axios'
import { SERVER } from '../redux/actionTypes'

export const getAll = async () => {
  try {
    const { apiURL } = Constants.manifest.extra
    return axios.get(`${apiURL}/cars`, {
      headers: {},
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}

export const getAllPlayers2 = async (playerId, token) => {
  const data = await axios.post(
    API_URL,
    {
      query: `mutation updateUserCity($id: Int!, $city: String!) {
    updateUserCity(userID: $id, city: $city){
      id
      name
      age
      city
      knowledge{
        language
        frameworks
      }
    }
  }`,
      variables: {
        id: 2,
        city: 'Test',
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

export const getPlayerResults = (season, token) => {
  console.log('start getAllPlayers')
  try {
    const query = `${SERVER}/finalresults/myRank?season=${season}`
    return axios.get(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    console.log(error)
  }
}

export const getAllPlayers = (playerId, season, token) => {
  console.log('start getAllPlayers' + season)
  try {
    const query = !playerId
      ? `${SERVER}/finalresults/myRank?season=${season}`
      : `${SERVER}/betscfbs/players?user._id=${playerId}&season=${season}`
    return axios.get(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}

export const getAllPlayersStanding = (season, token) => {
  console.log('start getAllPlayers')
  try {
    const query = `${SERVER}/finalresults/myRank?season=${season}`
    return axios.get(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}
export const getAllPlayersPickSheet = (groupId, week, season, token) => {
  console.log('start getAllPlayers')

  try {
    const query = `${SERVER}/betscfbs/players?user.group=${groupId}&week=${week}&season=${season}`

    return axios.get(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}

export const getPlayer = (playerId, token) => {
  try {
    const query = `${SERVER}/users/${playerId}`

    return axios.get(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}
export const getPlayers = (data, token) => {
  try {
    const query = `${SERVER}/users?username_contains=${data}` //`_where[_or][0][username_contains]=${data}&_where[_or][1][fullname_contains]=${data}`

    return axios.get(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}
export const getAllPlayersByWeek = (week, season, token) => {
  try {
    const query = `${SERVER}/betscfbs/players?week=${week}&season=${season}`

    return axios.get(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}
export const myParlays = (id, token) => {
  try {
    const query = `${SERVER}/parlaycfbs?user._id=${id}`

    return axios.get(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}
export const deleteParlay = (parlayId, token) => {
  try {
    const query = `${SERVER}/parlaycfbs/${parlayId}`

    return axios.delete(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}
export const saveParlay = (parlay, token) => {
  try {
    const query = `${SERVER}/parlaycfbs`

    return axios.post(query, parlay, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}
export const updateUserFav = (data, id, token) => {
  try {
    return axios.put(`${SERVER}/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}

export const getUserFav = (id, token) => {
  try {
    return axios.get(`${SERVER}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}
