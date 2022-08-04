import React, { Component } from 'react'
import { Text, View, Image, ScrollView, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { Ionicons } from 'react-native-vector-icons'
import { gameString } from '../utils/functions'
import _ from 'lodash'
import { jaune } from '../styles/colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { getAllPlayers, getPlayer } from '../services/players'

class profileTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pts: 0,
      bets: [],
      nbParlay: 0,
      players: [],
      player: null,
      loading: true,

      allPlayers: [],
      refreshing: false,
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
    }
  }

  async componentDidMount() {
    this.playerInfo()
  }
  playerInfo = async () => {
    const respGetPlayer = await getPlayer(this.props.herInfoUser._id, this.props.token)
    if (respGetPlayer && respGetPlayer.data) {
      this.setState({ player: respGetPlayer.data })
    }

    const respGetPlayers2 = await getAllPlayers(null, this.props.currentYear, this.props.token)
    if (respGetPlayers2 && respGetPlayers2.data) {
      console.log('respGetPlayers2', respGetPlayers2.data.length)
      this.setState({ allPlayers: respGetPlayers2.data, loading: false })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.allPlayers !== this.state.allPlayers && this.state.allPlayers.length > 0) {
      const newPlayersList = this.state.allPlayers.filter(f => f.user._id === this.props.herInfoUser._id)

      if (newPlayersList.length > 0) {
        this.setState({ players: newPlayersList })
        const mine = newPlayersList[0]

        let rankingList = _.orderBy(this.state.allPlayers, ['total'], ['desc'])

        let userRanker = _.findIndex(rankingList, o => o.user._id === this.props.herInfoUser._id)

        let statsPlayerGames = rankingList.filter(i => i.user._id == this.props.herInfoUser._id)[0]

        if (this.props.user) {
          this.setState({
            pts: mine.total || 0,
            bets: statsPlayerGames.results,
            stats: {
              powerGameWin: statsPlayerGames.results.filter(a => a.betType.value === 'power game').length
                ? (statsPlayerGames.results.filter(a => a.win && a.betType.value === 'power game').length /
                    statsPlayerGames.results.filter(a => a.betType.value === 'power game').length) *
                  100
                : 0,
              bindingGameWin: statsPlayerGames.results.filter(a => a.betType.value === 'binding game').length
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

  chipsWon = () => {
    // Top players stats/////////////////////////=======================

    let rrrr = this.state.players.filter(f => f.user.group === this.props.herInfoUser.group._id)

    console.log(JSON.stringify(rrrr.length, null, 2))

    // if (this.state.players.length > 0) {
    //   let _topPlayer = _.orderBy(this.state.players, ["total"], ["desc"])[0];

    //   //List games
    //   let toPlayerGames = _topPlayer.results;
    //   // Total points win
    //   let _topUserTotalPnt = _topPlayer.total;
    //   //Total games win
    //   let _topUserTotalGameWin = toPlayerGames.filter((a) => a.win).length;
    //   //Percentage games win
    //   let _topUserPercentGameWin = _topUserTotalGameWin / toPlayerGames.length;

    //   // this.setState({
    //   //   topPlayer: _topPlayer,
    //   //   topUserTotalPnt: _topUserTotalPnt,
    //   //   topUserPercentGameWin: _topUserPercentGameWin.toFixed(1) * 100,
    //   //   topUserTotalGameWin: _topUserTotalGameWin,
    //   // });
    // }
  }

  onRefresh = () => {
    this.setState({ refreshing: true, loading: true })
    this.playerInfo()
    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }
  render() {
    return (
      <ScrollView
        style={{}}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 30,
            paddingHorizontal: 10,
          }}>
          <View
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
                this.state.player && this.state.player.avatar && this.state.player.avatar.url
                  ? { uri: this.state.player.avatar.url }
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
          </View>

          <View style={{ flex: 2, marginLeft: 10 }}>
            <Text
              style={{
                color: '#edd798',
                //fontFamily: "Monda",
                fontSize: RFValue(15),
                fontWeight: '700',
              }}>
              {this.state.player ? this.state.player.username : ''}
            </Text>
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Arial',
                fontSize: RFValue(12),
                fontWeight: '400',
              }}>
              {this.state.player && this.state.player.city ? this.state.player.city + ', ' : ''}
              {this.state.player && this.state.player.state ? this.state.player.state : ''}
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
              {this.state.player && this.state.player.group && this.state.player.group.name
                ? this.state.player.group.name
                : ''}
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
                #{this.state.stats && this.state.stats.rankDivision ? this.state.stats.rankDivision : '_'}
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
              {this.state.player && this.state.player.conferenceCFB
                ? this.state.player.conferenceCFB.substring(0, 10)
                : ''}
            </Text>
          </View>
        </View>
        {this.state.loading && (
          <Text style={{ color: jaune, alignSelf: 'center', marginBottom: 5 }}>{'Loading data...'}</Text>
        )}
        <View
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#edd798',
          }}
        />
        {this.props.seasonStatus !== 'PREPARING' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {this.state.bets
              .filter(f => f.week === this.props.currentWeek + '')
              .map((item, index) => (
                <View
                  key={index}
                  style={{
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderRightWidth: 0.2,
                    borderRightColor: jaune,
                    paddingVertical: 10,
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
                        <Ionicons style={{}} name="ios-checkbox-outline" size={24} color={jaune} />
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
        )}
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
                  key={a}
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
                  key={a}
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
            fontSize: RFValue(10),
            fontWeight: '700',
            alignSelf: 'center',
            marginVertical: 50,
          }}>
          FOR THE GOOD OF THE LEAGUE
        </Text>
      </ScrollView>
    )
  }
  getPointsByWeek = week => {
    if (this.state.players && this.state.players[0] && this.state.players[0].results) {
      return (
        this.state.players[0].results.filter(f => f.week === week).reduce((a, b) => a + b.points, 0) +
        this.state.players[0].resultsParlay.filter(f => f.week === week).reduce((a, b) => a + b.point, 0) +
        this.state.players[0].resultsPerfecto.filter(f => f.week === week).reduce((a, b) => a + b.point, 0)
      )
    } else {
      return 0
    }
  }
}

const mapStateToProps = state => {
  const { conference, user, token, userRanking } = state.user
  const { bets, myParlay, players, currentWeek, currentYear, seasonStatus } = state.game
  const { herInfoUser } = state.otherUser

  return {
    conference,
    user,
    userRanking,
    token,
    herInfoUser,
    bets,
    myParlay,
    players,
    currentWeek,
    currentYear,
    seasonStatus,
  }
}
export default connect(mapStateToProps, {})(profileTab)
