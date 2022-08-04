import React, { Component } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  getHerBets,
  getHerParlays,
  getHerGroupUsers,
  getHerGroupBets,
  getGroupParlays,
} from '../redux/actions/otherUser'
import { Ionicons } from 'react-native-vector-icons'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

import { betsGroupByWeek } from '../utils/functions'

import { jaune } from '../styles/colors'
import { gameString } from '../utils/functions'
class profileTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pts: 0,
      bets: [],
      nbParlay: 0,
      allBetsByWeek: [],
      stats: {
        powerGameWin: 0,
        bindingGameWin: 0,
        freeGameWin: 0,
        dogGameWin: 0,
        rankDivision: 0,
        chipsWin: 0,
        parlays: 0,
        perfecto: 0,
        stacks: 0,
      },
      allBetsByWeek: [],
      group: this.props.herInfoUser.group
        ? this.props.groups.filter(
            i => i.id === this.props.herInfoUser.group || i.id === this.props.herInfoUser.group.id,
          )[0]
        : null,
      conference: this.props.herInfoUser.conference
        ? this.props.conferences.filter(
            i => i.id === this.props.herInfoUser.conference || i.id === this.props.herInfoUser.conference.id,
          )[0]
        : null,
    }

    this.props.getHerParlays(this.props.herInfoUser._id, this.props.token)
  }
  componentDidMount() {
    if (this.props.players && this.props.players.length > 0) {
      let pnts = this.props.players.filter(a => a.user._id === this.props.herInfoUser._id)

      if (pnts && pnts.length > 0) {
        let weekGroup = betsGroupByWeek(pnts[0].results)

        let tab = []
        weekGroup.map(w => {
          let count = w.games.filter(a => a.canParlay === true && a.win === true).length
          let isParlayThisWeek = pnts[0].parlays.filter(f => f.week == w.week).length
          // console.log(isParlayThisWeek)

          tab.push({
            week: w.week,
            parlay: count === 3 && isParlayThisWeek === 1,
          })
        })

        //console.log(JSON.stringify(tab, null, 2));

        let rankingList = _.orderBy(this.props.players, ['total'], ['desc'])
        let userRanker = _.findIndex(rankingList, o => o.user._id === this.props.herInfoUser._id)

        let statsPlayerGames = rankingList.filter(i => i.user._id == this.props.herInfoUser._id)[0]

        if (this.props.herInfoUser._id) {
          this.setState({
            allBetsByWeek: pnts[0],
            pts: pnts.length > 0 ? pnts[0].total : 0,
            bets: statsPlayerGames.results,
            stats: {
              powerGameWin:
                statsPlayerGames.results.filter(a => a.betType.value === 'power game').length > 0
                  ? (statsPlayerGames.results.filter(a => a.win && a.betType.value === 'power game').length /
                      statsPlayerGames.results.filter(a => a.betType.value === 'power game').length) *
                    100
                  : 0,
              bindingGameWin:
                statsPlayerGames.results.filter(a => a.betType.value === 'binding game').length > 0
                  ? (statsPlayerGames.results.filter(a => a.win && a.betType.value === 'binding game').length /
                      statsPlayerGames.results.filter(a => a.betType.value === 'binding game').length) *
                    100
                  : 0,
              freeGameWin:
                statsPlayerGames.results.filter(a => a.betType.value.includes('pick')).length > 0
                  ? (statsPlayerGames.results.filter(a => a.win && a.betType.value.includes('pick')).length /
                      statsPlayerGames.results.filter(a => a.betType.value.includes('pick')).length) *
                    100
                  : 0,
              dogGameWin:
                statsPlayerGames.results.filter(a => a.betType.value === 'dog game').length > 0
                  ? (statsPlayerGames.results.filter(a => a.win && a.betType.value === 'dog game').length /
                      statsPlayerGames.results.filter(a => a.betType.value === 'dog game').length) *
                    100
                  : 0,
              rankDivision: userRanker + 1,
              chipsWin: 0,
              parlays: statsPlayerGames.resultsParlay.filter(f => f.point > 0).length,
              perfecto: statsPlayerGames.resultsPerfecto.filter(f => f.point > 0).length,
              stacks: 0,
            },
          })
        }
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {}

  render() {
    return (
      <ScrollView style={{}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 30,
            paddingHorizontal: 10,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: RFValue(70),
              height: RFValue(70),
              borderRadius: RFValue(35),
              borderColor: '#edd798',
              borderStyle: 'solid',
              borderWidth: 2,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={
                this.props.herInfoUser.avatar && this.props.herInfoUser.avatar.url
                  ? { uri: this.props.herInfoUser.avatar.url }
                  : {
                      uri: 'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
                    }
              }
              style={{
                width: RFValue(64),
                height: RFValue(64),
                borderRadius: 100,
              }}
            />
          </TouchableOpacity>

          <View style={{ flex: 2, marginLeft: 10 }}>
            <Text
              style={{
                color: '#edd798',
                //fontFamily: "Monda",
                fontSize: RFValue(15),
                fontWeight: '700',
              }}>
              {this.props.herInfoUser ? this.props.herInfoUser.username : 'MY NAME'}
            </Text>
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Arial',
                fontSize: RFValue(12),
                fontWeight: '400',
              }}>
              {this.props.herInfoUser ? this.props.herInfoUser.city : ''}
              {', '}
              {this.props.herInfoUser ? this.props.herInfoUser.state : ''}
            </Text>
            <View
              style={{
                width: '90%',
                height: 1,
                backgroundColor: '#edd798',
                marginVertical: 10,
              }}
            />
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Arial',
                fontSize: RFValue(13),
                fontWeight: '400',
              }}>
              {this.state.group && this.state.group.name ? this.state.group.name : ''}
            </Text>
          </View>
          <View style={{ flex: 2, marginRight: 10 }}>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
              <Text
                style={{
                  width: RFValue(55),
                  backgroundColor: '#191919',
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  padding: 10,
                }}>
                #{this.state.stats.rankDivision}
              </Text>
              <Text
                style={{
                  width: RFValue(80),
                  marginLeft: 5,
                  backgroundColor: '#191919',
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: RFValue(12),
                  fontWeight: '700',

                  padding: 10,
                }}>
                {this.state.pts}
                {' pts'}
              </Text>
            </View>
            <Text
              style={{
                width: RFValue(140),
                alignSelf: 'flex-end',
                marginTop: 5,
                backgroundColor: '#191919',
                color: '#edd798',
                fontSize: RFValue(12),
                fontWeight: '700',

                padding: 10,
                textAlign: 'center',
              }}>
              {'Power | '}
              {this.props.herInfoUser && this.props.herInfoUser.conferenceCFB
                ? this.props.herInfoUser.conferenceCFB.substring(0, 10)
                : ''}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#edd798',
          }}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {this.state.bets
            .filter(f => f.week === `${this.props.currentWeek}`)
            .map((item, index) => (
              <View
                key={index}
                style={{
                  height: 76,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRightWidth: 1,
                  borderRightColor: jaune,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Arial',
                      fontSize: RFValue(12),
                      fontWeight: '700',
                    }}>
                    {gameString(item.game.GameFull)}
                  </Text>
                  <View
                    style={{
                      height: 20,
                      borderWidth: 0.5,
                      borderColor: jaune,
                      marginHorizontal: 7,
                    }}></View>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Arial',
                      fontSize: RFValue(12),
                      fontWeight: '700',
                    }}>
                    {item.betMethod.value.toUpperCase()}
                  </Text>

                  {item.win ? (
                    <View
                      style={{
                        marginTop: -2,
                        marginLeft: 20,
                        marginRight: 10,
                      }}>
                      <Ionicons style={{}} name="ios-checkbox-outline" size={RFValue(24)} color={jaune} />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: RFValue(17),
                        height: RFValue(17),
                        borderColor: '#edd798',
                        borderStyle: 'solid',
                        borderWidth: 1.2,
                        borderRadius: 2,
                        marginTop: 2,
                        marginLeft: 20,
                        marginRight: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Ionicons style={{}} name="ios-close" size={RFValue(15)} color={jaune} />
                    </View>
                  )}
                </View>
              </View>
            ))}
        </ScrollView>
        <View
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#edd798',
          }}
        />
        <View style={{ flexDirection: 'row', backgroundColor: '#191919' }}>
          <Text
            style={{
              flex: 1,
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(14),
              fontWeight: '600',
              padding: 10,
            }}>
            Power Game %
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: 'right',
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(12),
              fontWeight: '400',
              padding: 10,
            }}>
            {this.state.stats.powerGameWin.toFixed(1)}%
          </Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#282828' }}>
          <Text
            style={{
              flex: 1,
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(14),
              fontWeight: '600',
              padding: 10,
            }}>
            Binding Game %
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: 'right',
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(12),
              fontWeight: '400',
              padding: 10,
            }}>
            {this.state.stats.bindingGameWin.toFixed(1)}%
          </Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#191919' }}>
          <Text
            style={{
              flex: 1,
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(14),
              fontWeight: '600',
              padding: 10,
            }}>
            Free Pick %
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: 'right',
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(12),
              fontWeight: '400',
              padding: 10,
            }}>
            {this.state.stats.freeGameWin.toFixed(1)}%
          </Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#282828' }}>
          <Text
            style={{
              flex: 1,
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(14),
              fontWeight: '600',
              padding: 10,
            }}>
            Dog Game %
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: 'right',
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(12),
              fontWeight: '400',
              padding: 10,
            }}>
            {this.state.stats.dogGameWin.toFixed(1)}%
          </Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#191919' }}>
          <Text
            style={{
              flex: 1,
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(14),
              fontWeight: '600',
              padding: 10,
            }}>
            Rank in Division
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: 'right',
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(12),
              fontWeight: '400',
              padding: 10,
            }}>
            {this.state.stats.rankDivision}
          </Text>
        </View>
        {/* <View style={{flexDirection: "row", backgroundColor: "#282828"}}>
          <Text
            style={{
              flex: 1,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 14,
              fontWeight: "600",
              padding: 10,
            }}>
            Chips Won (Working on)
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: "right",
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 12,
              fontWeight: "400",
              padding: 10,
            }}>
            {this.state.stats.chipsWin}
          </Text>
        </View>
         */}
        <View style={{ flexDirection: 'row', backgroundColor: '#282828' }}>
          <Text
            style={{
              flex: 1,
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(14),
              fontWeight: '600',
              padding: 10,
            }}>
            Parlays
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: 'right',
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(12),
              fontWeight: '400',
              padding: 10,
            }}>
            {this.state.stats.parlays}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#191919' }}>
          <Text
            style={{
              flex: 1,
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(14),
              fontWeight: '600',
              padding: 10,
            }}>
            Perfecto
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: 'right',
              color: '#edd798',
              fontFamily: 'Arial',
              fontSize: RFValue(12),
              fontWeight: '400',
              padding: 10,
            }}>
            {this.state.stats.perfecto}
          </Text>
        </View>
        <ScrollView horizontal style={{ backgroundColor: '#191919', height: 110 }}>
          <View style={{ paddingHorizontal: 4, alignSelf: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(a => (
                <View
                  style={{
                    backgroundColor: '#282828',
                    height: 40,
                    width: 100,
                    borderColor: jaune,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ color: jaune, fontSize: RFValue(10) }}>Week {a}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(a => (
                <View
                  style={{
                    backgroundColor: '#282828',
                    height: 55,
                    width: 100,
                    borderColor: jaune,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ color: jaune, fontSize: RFValue(10) }}>{this.getPointsByWeek(a.toString())}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <Text
          style={{
            color: '#585858',
            fontFamily: 'Arial',
            fontSize: 10,
            fontWeight: '700',
            alignSelf: 'center',
            marginTop: 50,
          }}>
          FOR THE GOOD OF THE LEAGUE
        </Text>
      </ScrollView>
    )
  }
  getPointsByWeek = week => {
    if (this.state.allBetsByWeek && this.state.allBetsByWeek.results && this.state.allBetsByWeek.results.length > 0) {
      return (
        this.state.allBetsByWeek.results.filter(f => f.week === week).reduce((a, b) => a + b.points, 0) +
        this.state.allBetsByWeek.resultsParlay.filter(f => f.week === week).reduce((a, b) => a + b.point, 0) +
        this.state.allBetsByWeek.resultsPerfecto.filter(f => f.week === week).reduce((a, b) => a + b.point, 0)
      )
    } else {
      return 0
    }
  }
}

const mapStateToProps = state => {
  const { herInfoUser, herBets, herParlays, herGroupUsers, herGroupBets, herGroupParlays } = state.otherUser
  const { players, currentWeek } = state.game
  const { token, conferences, groups } = state.user
  return {
    players,
    currentWeek,
    token,
    conferences,
    groups,
    herInfoUser,
  }
}
export default connect(mapStateToProps, {
  getHerParlays,
})(profileTab)
