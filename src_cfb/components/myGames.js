import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { SCREEN_WIDTH } from '../utils/variables'
import { jaune, noir } from '../styles/colors'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

export default class Match extends Component {
  render() {
    const { parlay, method, type, game } = this.props
    return (
      <View
        style={{
          width: SCREEN_WIDTH - 40,
          backgroundColor: jaune,
          paddingVertical: 20,
          paddingHorizontal: 20,
          marginBottom: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#950338',

            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={{ color: jaune, fontSize: RFValue(11), fontWeight: 'bold' }}>{type.toUpperCase()}</Text>
            <Text style={{ color: jaune, fontSize: RFValue(11) }}>{parlay ? ' | PARLAY' : ''}</Text>
          </View>
          <Text
            style={{
              color: jaune,
              fontSize: RFValue(12),
            }}>
            {game.Status && game.Status.toUpperCase()}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: RFValue(70),
              height: RFValue(70),
              borderRadius: 100,
              backgroundColor: '#191919',
              fontWeight: '900',
            }}>
            <Text style={{ color: jaune, fontSize: RFValue(12) }}>
              {game.PointSpread && game.PointSpread < 0 ? game.HomeTeam : game.AwayTeam}
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 0,
              flex: 1,
            }}>
            {game && game.Status !== 'Scheduled' ? (
              <Text
                style={{
                  color: noir,
                  fontSize: RFValue(25),
                  // fontFamily: "Monda",
                  fontWeight: 'bold',
                }}>
                {game.PointSpread && game.PointSpread < 0 ? game.HomeTeamScore : game.AwayTeamScore}
                {' - '}
                {game.PointSpread && game.PointSpread < 0 ? game.AwayTeamScore : game.HomeTeamScore}
              </Text>
            ) : (
              <Text
                style={{
                  color: noir,
                  fontSize: RFValue(30),
                  // fontFamily: "Monda",
                  fontWeight: 'bold',
                }}>
                {'VS'}
              </Text>
            )}
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: RFValue(70),
              height: RFValue(70),
              borderRadius: 100,
              backgroundColor: '#191919',
            }}>
            <Text style={{ color: jaune, fontSize: RFValue(12) }}>
              {game.PointSpread && game.PointSpread < 0 ? game.AwayTeam : game.HomeTeam}
            </Text>
          </View>
        </View>

        {method && method.value && (
          <Text
            style={{
              color: noir,
              fontSize: RFValue(14),
              fontWeight: 'bold',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            {'YOUR PICK | ' + method.value.toUpperCase()}
          </Text>
        )}

        {method && method.conference && (
          <Text
            style={{
              color: noir,
              fontSize: 14,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            {method.conference.toUpperCase()}
          </Text>
        )}
      </View>
    )
  }
}
