import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { jaune } from '../styles/colors'
import { connect } from 'react-redux'
import { Switch } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

import { setCurrentWeek, getCurrentWeekGame, getMyGroupBets, getBets } from '../redux/actions/game'

import { setNotification } from '../redux/actions/user'

class Notification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      week: 'Week ' + this.props.currentWeek,
      isSwitchOnNot: this.props.enableNotification ? this.props.enableNotification : false,
      isSwitchOnDrak: false,
    }
  }

  showWeek = () => {
    this.ActionSheet.show()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentWeek !== this.props.currentWeek) {
      this.props.getCurrentWeekGame(this.props.currentYear, this.props.currentWeek)
      this.props.getMyGroupBets(this.props.user.group._id, this.props.token)
      // this.props.getBets(this.props.user.group._id, this.props.token);
    }
  }

  render() {
    return (
      <View>
        <View
          style={{
            backgroundColor: '#191919',

            width: '95%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            marginVertical: 20,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: '#edd798',
              fontSize: RFValue(20),
              fontWeight: '700',
            }}>
            {'Notification Settings'}
          </Text>

          <Text
            style={{
              width: RFValue(300),
              color: '#edd798',
              fontFamily: 'Monda',
              fontSize: 17,
              fontWeight: '400',

              textAlign: 'center',
              marginTop: 20,
            }}>
            {
              'Turn on notifications to receive updates when other players in your conference make their picks, reminders, and more…'
            }
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '70%',
              marginVertical: 15,
              marginTop: 70,
            }}>
            <Text style={{ color: jaune, fontSize: RFValue(15) }}>{'Notifications'}</Text>
            <Switch
              value={this.state.isSwitchOnNot}
              color={jaune}
              style={{}}
              onValueChange={() => {
                this.setState({ isSwitchOnNot: !this.state.isSwitchOnNot }, async () => {
                  try {
                    await AsyncStorage.setItem('notification', this.state.isSwitchOnNot === true ? 'ok' : 'no')

                    console.log(this.state.isSwitchOnNot === true ? 'ok' : 'no')
                  } catch (error) {
                    // Error saving data
                  }

                  this.props.setNotification(this.state.isSwitchOnNot)
                })
              }}
            />
          </View>
        </View>
      </View>
    )
  }
}
const mapStateToProps = state => {
  const { user, token, bowlSeason, enableNotification } = state.user
  const { currentWeek, currentYear } = state.game
  return {
    user,
    token,
    currentWeek,
    currentYear,
    enableNotification,
  }
}
export default connect(mapStateToProps, {
  setCurrentWeek,
  getCurrentWeekGame,
  getMyGroupBets,
  getBets,
  setNotification,
})(Notification)
