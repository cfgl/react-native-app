import React, { Component } from 'react'
import { Text, View, Linking } from 'react-native'
import { jaune } from '../styles/colors'
import { connect } from 'react-redux'

import { setCurrentWeek, getCurrentWeekGame } from '../redux/actions/game'
import { RFValue } from 'react-native-responsive-fontsize'

import { TouchableOpacity } from 'react-native-gesture-handler'

class Notification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      week: 'Week ' + this.props.currentWeek,
      isSwitchOnDrak: false,
    }
  }

  showWeek = () => {
    this.ActionSheet.show()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentWeek !== this.props.currentWeek) {
      this.props.getCurrentWeekGame(this.props.currentYear, this.props.currentWeek)
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
            {'CFGL 2.0 BETA'}
          </Text>

          <Text
            style={{
              width: RFValue(300),
              color: '#edd798',
              fontFamily: 'Monda',
              fontSize: RFValue(17),
              fontWeight: '400',

              textAlign: 'center',
              marginTop: 20,
            }}>
            {
              'Duel with friends picking winners of college football games and testing your knowledge against other college football fans.'
            }
          </Text>

          <View
            style={{
              alignItems: 'center',
              width: '70%',
              marginVertical: 15,
              marginTop: 70,
            }}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://app.termly.io/document/terms-of-use-for-website/121d328d-33ee-4b0b-aa3d-e41119f3725f',
                ).catch(err => console.error('Error', err))
              }}>
              <Text
                style={{
                  color: jaune,
                  fontSize: RFValue(15),
                  marginBottom: 20,
                  fontWeight: '200',
                  textDecorationLine: 'underline',
                }}>
                {'Terms And Conditions'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://app.termly.io/document/privacy-policy/673e75cc-27e8-448c-bd1d-8f301995be2b',
                ).catch(err => console.error('Error', err))
              }}>
              <Text style={{ color: jaune, fontSize: RFValue(15), fontWeight: '200', textDecorationLine: 'underline' }}>
                {'Privacy Policy'}
              </Text>
            </TouchableOpacity>
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
  }
}
export default connect(mapStateToProps, {
  setCurrentWeek,
  getCurrentWeekGame,
})(Notification)
