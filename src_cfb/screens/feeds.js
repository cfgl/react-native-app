import React, { Component } from 'react'
import { View, Text } from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'
import FeedsPreparing from './feedsPreparing'
import FeedsStarded from './feedsStarded'
import FeedsFinished from './feedsFinished'
import Bowlseason from './bowlseason'
import Championship from './championship'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { setCurrentSeasonWeek, setWeekDate } from '../redux/actions/game'
import { updateUserInfo } from '../redux/actions/user'

import { BOWLWEEK } from '../utils/variables'

class feeds extends Component {
  constructor(props) {
    super(props)
    this.props.setCurrentSeasonWeek()
    this.props.setWeekDate()
  }

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem('userId')
      if (value !== null) {
        // We have data!!
        // alert(value)

        // console.log(value)
        if (this.props.user.pushUserId !== value)
          this.props.updateUserInfo({ pushUserId: value }, this.props.user._id, this.props.token)
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  componentDidUpdate(prevProps) {}

  render() {
    const { seasonStatus, currentYear, currentWeek } = this.props
    return (
      <View style={{ flex: 1 }}>
        {seasonStatus === 'PREPARING' && <FeedsPreparing props={this.props} />}

        {seasonStatus !== 'PREPARING' && <FeedsStarded props={this.props} />}
        {/* 
        {seasonStatus === 'STARTED' && currentWeek === BOWLWEEK && <Bowlseason props={this.props} />}

        {seasonStatus === 'STARTED' && currentWeek === BOWLWEEK && <Bowlseason props={this.props} />} */}

        {/* {seasonStatus === 'FINISHED' && <FeedsFinished props={this.props} />} */}

        {/* <Text>{currentYear}</Text>
        <Text>{currentWeek}</Text>
        <Text>{seasonStatus}</Text> */}
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { user, token } = state.user

  const { statusGame, currentYear, currentWeek, seasonStatus } = state.game

  return {
    user,
    token,
    statusGame,
    currentYear,
    currentWeek,
    seasonStatus,
  }
}

export default connect(mapStateToProps, {
  setCurrentSeasonWeek,
  setWeekDate,
  updateUserInfo,
})(feeds)
