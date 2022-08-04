import React, { Component } from 'react'
import { View, Modal, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/variables'
import { jaune, noir, gris } from '../styles/colors'
import { Checkbox, Switch, Portal, Button, Provider } from 'react-native-paper'
import { Ionicons } from 'react-native-vector-icons'
import { gameString } from '../utils/functions'
export default class Match extends Component {
  render() {
    const { live, parlay, freePick, method, team2, type, pick, game } = this.props
    return (
      <View>
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
              height: 30,
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={{ color: jaune, fontSize: 15, fontWeight: 'bold' }}>{type.toUpperCase()}</Text>
              <Text style={{ color: jaune, fontSize: 15 }}>{parlay ? ' | PARLAY' : ''}</Text>
            </View>
            <Text
              style={{
                color: jaune,
              }}>
              {game.Status.toUpperCase()}
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
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#191919',
                fontWeight: '900',
                lineHeight: 22,
              }}>
              <Text style={{ color: jaune, fontSize: 15 }}>
                {game.HomeTeamMoneyLine < game.AwayTeamMoneyLine ? game.HomeTeam : game.AwayTeam}
              </Text>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 0,
                flex: 1,
              }}>
              {game && game.GameKey ? (
                <Text
                  style={{
                    color: noir,
                    fontSize: 26,
                    fontFamily: 'Monda',
                    fontWeight: 'bold',
                  }}>
                  {game.HomeTeamMoneyLine < game.AwayTeamMoneyLine ? game.HomeScore : game.AwayScore}
                  {' -  '}
                  {game.AwayTeamMoneyLine > game.HomeTeamMoneyLine ? game.AwayScore : game.HomeScore}
                </Text>
              ) : (
                <Text
                  style={{
                    color: noir,
                    fontSize: 26,
                    fontFamily: 'Monda',
                    fontWeight: 'bold',
                  }}>
                  {'0 -  0'}
                </Text>
              )}
              <Text
                style={{
                  color: noir,
                  fontSize: 12,
                  marginTop: 0,
                  textAlign: 'center',
                }}>
                {gameString(game)}
              </Text>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#191919',
              }}>
              <Text style={{ color: jaune, fontSize: 15 }}>
                {game.AwayTeamMoneyLine > game.HomeTeamMoneyLine ? game.AwayTeam : game.HomeTeam}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: noir,
              fontSize: 14,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            {'YOUR PICK | ' + method.value.toUpperCase()}
            {method.value.toUpperCase() === 'fave' || method.value.toUpperCase() === 'dog'
              ? `(${game.PointSpread && game.PointSpread})`
              : `(${game.OverUnder && game.OverUnder})`}
          </Text>
        </View>
      </View>
    )
  }
}
