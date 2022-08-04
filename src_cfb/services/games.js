import axios from 'axios'
import { KEYAPI, SERVER } from '../redux/actionTypes'

export const getWeekGames = async (currentYear, currentWeek) => {
  try {
    return axios.get(
      `https://api.sportsdata.io/v3/cfb/scores/json/GamesByWeek/${currentYear}/${currentWeek}?key=${KEYAPI}`,
    )
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}

export const getAllWeekBets = async (season, week, token) => {
  try {
    return axios.get(`${SERVER}/betscfbs?season_eq=${season}&week_eq=${week}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}

export const getMyBets = (id, week, token) => {
  try {
    return axios.get(`${SERVER}/betscfbs?user_eq=${id}&week_eq=${week + ''}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}

export const updateBet = (id, data, token) => {
  try {
    return axios.put(`${SERVER}/betscfbs/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}

export const getWeekBets = (season, week, token) => {
  try {
    return axios.get(`${SERVER}/betscfbs?season_eq=${season}&week_eq=${week}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}

export const getGroups = token => {
  try {
    return axios.get(`${SERVER}/groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // Handle erros
    // console.log(error)
  }
}
