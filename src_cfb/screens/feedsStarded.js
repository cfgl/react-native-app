import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import _ from 'lodash'

import moment from 'moment'
import { noir, jaune, gris } from '../styles/colors'
import { Ionicons } from 'react-native-vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { GroupByGroup, gameString } from '../utils/functions'
import { setHerInfoUser, getHerParlays } from '../redux/actions/otherUser'
import { setUserRank } from '../redux/actions/user'

import ProfileStats from './profileStats'
import { conferenceGroup } from '../datas/conference'
import { RFValue } from 'react-native-responsive-fontsize'
import { getAllPlayersByWeek, getPlayerResults } from '../services/players'
import { getAllWeekBets } from '../services/games'

import {
  getConferences,
  setUserConference,
  getGroups,
  updateUserInfo,
  logoutUser,
  setBowlSeason,
} from '../redux/actions/user'

import {
  setGameStatus,
  getPlayers,
  getPlayersByWeek,
  getWeekBets,
  getBets,
  setCurrentSeasonWeek,
  getCurrentWeekGame,
  setWeekDate,
} from '../redux/actions/game'

import ActionSheet from 'react-native-actionsheet'

class feeds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      conferenceCFB: '',
      isBowlSeason: this.props.bowlSeason,
      refreshing: false,
      //player state
      topPlayer: {},
      topUserTotalPnt: 0,
      topUserPercentGameWin: 0,
      topUserTotalGameWin: 0,

      //group state
      topGroup: {},
      topGroupGamesWin: 0,
      topGroupPercentWin: 0,
      topGroupTotaltWin: 0,

      playersByGroup: [],

      popular: {
        morning: {},
        afternoon: {},
        night: {},
      },
      popularPick: {
        morning: {},
        afternoon: {},
        night: {},
      },
      range: {
        index: 0,
        points: 0,
        win: 0,
      },
      //user conference
      conference: this.props.user && this.props.user.conference ? this.props.user.conference : {},
      players: [],
      playersByWeek: [],
      weekBets: [],
    }
  }
  UNSAFE_componentWillMount() {
    this.props.setCurrentSeasonWeek()
    this.props.setWeekDate()
    this.props.getConferences(this.props.token)
    this.props.getGroups(this.props.token)

    this.execution()
  }

  componentDidMount() {
    this.setNotificationToken()
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.statusGame !== this.props.statusGame && this.props.statusGame === 'SUCCESS_BET_UPDATE') ||
      this.props.statusGame === 'SUCCESS_SAVE_PARLAY' ||
      this.props.statusGame === 'SUCCESS_DELETE_PARLAY'
    ) {
      this.execution()
    }
    if (
      prevProps.herInfoUser !== this.props.herInfoUser ||
      this.props.statusGame === 'SUCCESS_SAVE_PARLAY' ||
      this.props.statusGame === 'SUCCESS_DELETE_PARLAY'
    ) {
      this.execution()
    }
  }

  // preExecution = () => {
  //   let finalRange = _.orderBy(this.state.players, ['total'], ['desc'])
  //   let myRangeData = _.filter(finalRange, o => {
  //     return o.user._id === this.props.user._id
  //   })
  //   let myRangeIndex = _.findIndex(finalRange, o => {
  //     return o.user._id === this.props.user._id
  //   })
  //   if (myRangeData && myRangeData.length > 0) {
  //     let myRangeWin = _.filter(myRangeData[0].results, o => {
  //       return o.win === true
  //     })
  //     // this.props.setUserRank(myRangeIndex + 1)

  //     this.popularPick('08:00:00', '12:59:00')
  //     this.popularPick('13:00:00', '18:59:00')
  //     this.popularPick('19:00:00', '23:59:00')
  //     this.setState({
  //       popular: {
  //         morning: this.popularGames('08:00:00', '12:59:00'),
  //         afternoon: this.popularGames('12:59:59', '18:59:00'),
  //         night: this.popularGames('18:59:59', '23:59:00'),
  //       },
  //       popularPick: {
  //         morning: this.popularPick('08:00:00', '12:59:00'),
  //         afternoon: this.popularPick('12:59:59', '18:59:00'),
  //         night: this.popularPick('18:59:59', '23:59:00'),
  //       },
  //     })
  //   }
  //   //reset status
  //   this.props.setGameStatus('')
  //   ///set player
  //   if (this.props.seasonStatus === 'FINISHED') {
  //     this.topPlayerFunc('all')
  //   } else if (this.props.seasonStatus === 'STARTED') this.topPlayerFunc('week')
  //   ///set group
  //   if (this.props.seasonStatus === 'FINISHED') {
  //     this.topGroupFunc('all')
  //   } else if (this.props.seasonStatus === 'STARTED') this.topGroupFunc('week')
  // }

  execution = async () => {
    this.props.setCurrentSeasonWeek()
    this.props.setWeekDate()
    this.props.getConferences(this.props.token)
    this.props.getGroups(this.props.token)

    let prevWeek = this.props.currentWeek - 1

    const respGetPlayers = await getPlayerResults(this.props.currentYear, this.props.token)
    if (respGetPlayers && respGetPlayers.data) {
      this.setState({ players: respGetPlayers.data }, () => {
        let finalRange = _.orderBy(this.state.players, ['total'], ['desc'])
        let myRangeData = _.filter(finalRange, o => {
          return o.user._id === this.props.user._id
        })
        let myRangeIndex = _.findIndex(finalRange, o => {
          return o.user._id === this.props.user._id
        })
        if (myRangeData && myRangeData.length > 0) {
          let myRangeWin = _.filter(myRangeData[0].results, o => {
            return o.win === true
          })
          this.props.setUserRank(myRangeIndex + 1)
          this.setState({
            range: {
              index: myRangeIndex + 1,
              points: myRangeData[0].total,
              win: myRangeWin.length,
            },
          })
        }
      })
    }

    const respGetAllWeekBets = await getAllWeekBets(this.props.currentYear, this.props.currentWeek, this.props.token)
    if (respGetAllWeekBets && respGetAllWeekBets.data) {
      this.setState({ weekBets: respGetAllWeekBets.data }, () => {
        this.popularPick('08:00:00', '12:59:00')
        this.popularPick('13:00:00', '18:59:00')
        this.popularPick('19:00:00', '23:59:00')
        this.setState({
          popular: {
            morning: this.popularGames('08:00:00', '12:59:00'),
            afternoon: this.popularGames('12:59:59', '18:59:00'),
            night: this.popularGames('18:59:59', '23:59:00'),
          },
          popularPick: {
            morning: this.popularPick('08:00:00', '12:59:00'),
            afternoon: this.popularPick('12:59:59', '18:59:00'),
            night: this.popularPick('18:59:59', '23:59:00'),
          },
        })
      })
    }

    const respGetAllPlayersByWeek = await getAllPlayersByWeek(prevWeek, this.props.currentYear, this.props.token)
    if (respGetAllPlayersByWeek && respGetAllPlayersByWeek.data) {
      this.setState({ playersByWeek: respGetAllPlayersByWeek.data }, () => {
        if (this.state.players && this.state.players.length > 0) {
          this.topPlayerFunc('all')
          this.topPlayerFunc('week')
          this.topGroupFunc('all')
          this.topGroupFunc('week')
        }
      })
    }
  }

  setNotificationToken = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if (value !== null) {
        // We have data!!

        if (this.props.user && (!this.props.user.pushUserId || this.props.user.pushUserId === '')) {
          this.props.updateUserInfo({ pushUserId: value }, this.props.user.id, this.props.token)
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  _showModal = () => this.setState({ visible: true })

  _hideModal = () => this.setState({ visible: false })

  popularGames = (x, y) => {
    let dd = this.state.weekBets
      .sort((a, b) => a.game && b.game && new Date(a.game.DateTime) - new Date(b.game.DateTime))
      .filter(a => {
        let h1 = moment(new Date('2019-01-01T' + a.game.DateTime.split('T')[1]))
        var d1 = moment(new Date('2019-01-01T' + x))
        var d2 = moment(new Date('2019-01-01T' + y))
        if (d1 < h1 && h1 < d2) return a
      })

    let res = dd.map(a => {
      return {
        game: a.game,
        nb: dd.filter(b => a.game && b.game && b.game.GameID === a.game.GameID).length,
      }
    })

    let popular = _.uniqBy(res, 'game.GameID').sort((a, b) => b.nb - a.nb)[0]

    return popular ? popular : {}
  }

  popularPick = (x, y) => {
    let dd = this.state.weekBets
      .sort((a, b) => a.game && b.game && new Date(a.game.DateTime) - new Date(b.game.DateTime))
      .filter(a => {
        let h1 = moment(new Date('2019-01-01T' + a.game.DateTime.split('T')[1]))
        var d1 = moment(new Date('2019-01-01T' + x))
        var d2 = moment(new Date('2019-01-01T' + y))
        if (d1 < h1 && h1 < d2) return a
      })

    let res = dd.map(a => {
      return {
        method: a.method,
        nb: dd.filter(b => b.method.value === a.method.value).length,
      }
    })

    let popular = _.uniqBy(res, 'method.value').sort((a, b) => b.nb - a.nb)[0]

    return popular ? popular : {}
  }

  topPlayerFunc = return_ => {
    // Top players stats/////////////////////////=======================

    if (return_ === 'week' && this.state.playersByWeek && this.state.players && this.state.players.length > 0) {
      let _topPlayer = _.orderBy(this.state.playersByWeek, ['total'], ['desc'])[0]

      if (_topPlayer && _topPlayer.results) {
        //List games
        let toPlayerGames = _topPlayer.results
        // Total points win
        let _topUserTotalPnt = _topPlayer.total
        //Total games win
        let _topUserTotalGameWin = toPlayerGames.filter(a => a.win).length
        //Percentage games win
        let _topUserPercentGameWin = _topUserTotalGameWin / toPlayerGames.length

        this.setState({
          topPlayer: _topPlayer,
          topUserTotalPnt: _topUserTotalPnt,
          topUserPercentGameWin: _topUserPercentGameWin.toFixed(1) * 100,
          topUserTotalGameWin: _topUserTotalGameWin,
        })
      }
    }
    if (return_ === 'all' && this.state.players && this.state.players.length > 0) {
      let _topPlayer = _.orderBy(this.state.players, ['total'], ['desc'])[0]

      if (_topPlayer && _topPlayer.results) {
        //List games
        let toPlayerGames = _topPlayer.results
        // Total points win
        let _topUserTotalPnt = _topPlayer.total
        //Total games win
        let _topUserTotalGameWin = toPlayerGames.filter(a => a.win).length
        //Percentage games win
        let _topUserPercentGameWin = _topUserTotalGameWin / toPlayerGames.length

        this.setState({
          topPlayer: _topPlayer,
          topUserTotalPnt: _topUserTotalPnt,
          topUserPercentGameWin: _topUserPercentGameWin.toFixed(1) * 100,
          topUserTotalGameWin: _topUserTotalGameWin,
        })
      }
    }
  }

  topGroupFunc = return_ => {
    // Top group stats/////////////////////////////////===========================
    if (return_ === 'week' && this.state.playersByWeek && this.state.players && this.state.players.length > 0) {
      let _playersByGroup = GroupByGroup(this.state.playersByWeek).map(i => {
        let groupTotalPnt = i.player.reduce((a, b) => a + b.total, 0)
        i.player.groupTotal = groupTotalPnt
        i.player.group = i.group
        return i.player
      })

      this.setState({ playersByGroup: GroupByGroup(this.state.players) })
      if (_playersByGroup) {
        let topGroup = _.orderBy(_playersByGroup, ['groupTotal'], ['desc'])[0]

        if (topGroup) {
          // List of games
          let _topGroupGames = topGroup.map(i => i.results)

          // Total games wins
          let _topGroupGamesWin = _.flattenDeep(_topGroupGames).filter(a => a.win).length
          // Total points win
          let _topGroupTotaltWin = topGroup.groupTotal

          // Percentage games win
          let _topGroupPercentWin = _topGroupGamesWin / _.flattenDeep(_topGroupGames).length

          //Set stats to state
          this.setState({
            topGroup: this.groupByIdFunc(topGroup.group),
            topGroupGamesWin: _topGroupGamesWin,
            topGroupPercentWin: _topGroupPercentWin.toFixed(1) * 100,
            topGroupTotaltWin: _topGroupTotaltWin,
          })
        }
      }
    }
    if (return_ === 'all' && this.state.players && this.state.players.length > 0) {
      let _playersByGroup = GroupByGroup(this.state.players).map(i => {
        let groupTotalPnt = i.player.reduce((a, b) => a + b.total, 0)
        i.player.groupTotal = groupTotalPnt
        i.player.group = i.group
        return i.player
      })

      this.setState({ playersByGroup: GroupByGroup(this.state.players) })
      if (_playersByGroup) {
        let topGroup = _.orderBy(_playersByGroup, ['groupTotal'], ['desc'])[0]

        if (topGroup) {
          // List of games
          let _topGroupGames = topGroup.map(i => i.results)

          // Total games wins
          let _topGroupGamesWin = _.flattenDeep(_topGroupGames).filter(a => a.win).length
          // Total points win
          let _topGroupTotaltWin = topGroup.groupTotal

          // Percentage games win
          let _topGroupPercentWin = _topGroupGamesWin / _.flattenDeep(_topGroupGames).length

          //Set stats to state
          this.setState({
            topGroup: this.groupByIdFunc(topGroup.group),
            topGroupGamesWin: _topGroupGamesWin,
            topGroupPercentWin: _topGroupPercentWin.toFixed(1) * 100,
            topGroupTotaltWin: _topGroupTotaltWin,
          })
        }
      }
    }
  }

  groupByIdFunc = id => {
    return this.props.groups.filter(i => i._id == id)[0]
  }

  onRefresh = () => {
    this.props.setCurrentSeasonWeek()
    this.props.setWeekDate()
    this.props.getConferences(this.props.token)
    this.props.getGroups(this.props.token)

    this.setState({ refreshing: true })
    this.execution()
    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }

  render() {
    const { popular, popularPick, visible } = this.state
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={gris} barStyle="light-content" />

        {this.props.weekstartdate && this.props.weekstartdate[this.props.currentWeek - 1] && (
          <View>
            {parseFloat(
              (new Date(`${this.props.weekstartdate[this.props.currentWeek - 1].date}.000Z`).getTime() -
                new Date().getTime()) /
                (24 * 3600 * 1000),
            ) > 0 ? (
              <View
                style={{
                  paddingVertical: 10,
                  width: '100%',
                  backgroundColor: '#edd798',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    color: '#191919',
                    fontFamily: 'monda',
                    fontSize: RFValue(12),
                    fontWeight: '700',
                  }}>
                  {`WEEK ${this.props.currentWeek} STARTS IN ${
                    parseInt(
                      (new Date(`${this.props.weekstartdate[this.props.currentWeek - 1].date}.000Z`).getTime() -
                        new Date().getTime()) /
                        (24 * 3600 * 1000),
                    ) < 1
                      ? parseInt(
                          (new Date(`${this.props.weekstartdate[this.props.currentWeek - 1].date}.000Z`).getTime() -
                            new Date().getTime()) /
                            (3600 * 1000),
                        ) + ' HOURS'
                      : parseInt(
                          (new Date(`${this.props.weekstartdate[this.props.currentWeek - 1].date}.000Z`).getTime() -
                            new Date().getTime()) /
                            (24 * 3600 * 1000),
                        ) + 'DAY(S)'
                  } `}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.props.navigation.navigate('Scores')
                  }}
                  style={{
                    width: RFValue(132),
                    height: RFValue(30),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#191919',
                  }}>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',
                    }}>
                    LIVE SCORES
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#edd798',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    color: '#191919',
                    fontFamily: 'monda',
                    fontSize: RFValue(12),
                    fontWeight: '700',
                  }}>
                  {`WEEK  ${this.props.currentWeek} HAS STARTED`}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    this.props.props.navigation.navigate('Scores')
                  }}
                  style={{
                    width: RFValue(132),
                    height: RFValue(30),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#191919',
                  }}>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',
                    }}>
                    LIVE SCORES
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <ScrollView
          refreshControl={
            <RefreshControl tintColor={'#fff'} refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
          style={{ flex: 1, marginTop: 0, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}>
          {/* <WeekTiming isHeader={1} /> */}
          {/* Final ranking////////////////////////////////////////////////////////////////////////////// */}
          <View
            style={{
              backgroundColor: noir,

              marginVertical: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 20,
            }}>
            <View
              style={{
                borderRightColor: jaune,
                borderRightWidth: 2,

                flex: 1,
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontSize: RFValue(12),
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                {'FINAL RANK'}
              </Text>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: RFValue(30),
                    fontWeight: '800',
                    textAlign: 'center',
                  }}>
                  {this.state.range.index}
                </Text>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: RFValue(9),
                    marginTop: 15,
                  }}>
                  {this.state.range.index === 1
                    ? 'ST'
                    : this.state.range.index === 2
                    ? 'ND'
                    : this.state.range.index === 3
                    ? 'RD'
                    : 'TH'}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderRightColor: jaune,
                borderRightWidth: 2,

                flex: 1,
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontSize: RFValue(12),
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                {'TOTAL POINTS'}
              </Text>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: RFValue(30),
                  fontWeight: '800',
                  textAlign: 'center',
                }}>
                {this.state.range.points}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontSize: RFValue(12),
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                {'CORRECT PICKS'}
              </Text>

              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: RFValue(30),
                  fontWeight: '800',
                  textAlign: 'center',
                }}>
                {this.state.range.win}
              </Text>
            </View>
          </View>

          {popular && popular.morning && popular.morning.game ? (
            <View
              style={{
                backgroundColor: noir,

                width: '95%',
                alignSelf: 'center',

                marginTop: 40,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: '#edd798',
                }}>
                <Text
                  style={{
                    color: noir,
                    fontFamily: 'Monda',
                    fontSize: RFValue(12),
                    fontWeight: '700',
                  }}>
                  {'MOST PICKED MORNING GAME'}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    color: jaune,
                    fontSize: RFValue(11),
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {gameString(popular.morning.game)}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  paddingTop: 30,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: RFValue(70),
                    height: RFValue(70),
                    borderRadius: 100,
                    backgroundColor: jaune,
                    fontWeight: '900',
                  }}>
                  <Text style={{ color: noir, fontSize: RFValue(14) }}>
                    {popular.morning.game.HomeTeamMoneyLine < 0
                      ? popular.morning.game.HomeTeam
                      : popular.morning.game.AwayTeam}
                  </Text>
                </View>
                <View style={{ width: 150, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 20, color: jaune }}>VS</Text>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: RFValue(70),
                    height: RFValue(70),
                    borderRadius: 100,
                    backgroundColor: jaune,
                  }}>
                  <Text style={{ color: noir, fontSize: RFValue(14) }}>
                    {popular.morning.game.AwayTeamMoneyLine > 0
                      ? popular.morning.game.AwayTeam
                      : popular.morning.game.HomeTeam}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: jaune,
                  fontSize: RFValue(12),
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginVertical: 30,
                }}>
                MOST POPULAR PICK:
                {popularPick.morning && popularPick.morning.method
                  ? popularPick.morning.method.value.toUpperCase()
                  : ''}
              </Text>
            </View>
          ) : null}

          {popular && popular.afternoon && popular.afternoon.game ? (
            <View
              style={{
                backgroundColor: noir,

                width: '95%',
                alignSelf: 'center',

                marginTop: 40,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: '#edd798',
                }}>
                <Text
                  style={{
                    color: noir,
                    fontFamily: 'Monda',
                    fontSize: RFValue(12),
                    fontWeight: '700',
                  }}>
                  {'MOST PICKED AFTERNOON GAME'}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    color: jaune,
                    fontSize: RFValue(11),
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {gameString(popular.afternoon.game)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  paddingTop: 30,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: RFValue(70),
                    height: RFValue(70),
                    borderRadius: 100,
                    backgroundColor: jaune,
                    fontWeight: '900',
                  }}>
                  <Text style={{ color: noir, fontSize: RFValue(14) }}>
                    {popular.afternoon.game.HomeTeamMoneyLine < 0
                      ? popular.afternoon.game.HomeTeam
                      : popular.afternoon.game.AwayTeam}
                  </Text>
                </View>
                <View style={{ width: 150, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 20, color: jaune }}>VS</Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: RFValue(70),
                    height: RFValue(70),
                    borderRadius: 100,
                    backgroundColor: jaune,
                  }}>
                  <Text style={{ color: noir, fontSize: RFValue(14) }}>
                    {popular.afternoon.game.AwayTeamMoneyLine > 0
                      ? popular.afternoon.game.AwayTeam
                      : popular.afternoon.game.HomeTeam}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: jaune,
                  fontSize: RFValue(12),
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginVertical: 30,
                }}>
                MOST POPULAR PICK:
                {popularPick.afternoon && popularPick.afternoon.method
                  ? popularPick.afternoon.method.value.toUpperCase()
                  : ''}
              </Text>
            </View>
          ) : null}

          {popular && popular.night && popular.night.game ? (
            <View
              style={{
                backgroundColor: noir,

                width: '95%',
                alignSelf: 'center',
                marginBottom: 40,
                marginTop: 40,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',

                  backgroundColor: '#edd798',
                }}>
                <Text
                  style={{
                    color: noir,
                    fontFamily: 'Monda',
                    fontSize: RFValue(12),
                    fontWeight: '700',
                  }}>
                  {'MOST PICKED NIGHT GAME'}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    color: jaune,
                    fontSize: RFValue(11),
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {gameString(popular.night.game)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  paddingTop: 30,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: RFValue(70),
                    height: RFValue(70),
                    borderRadius: 100,
                    backgroundColor: jaune,
                    fontWeight: '900',
                    lineHeight: 22,
                  }}>
                  <Text style={{ color: noir, fontSize: RFValue(14) }}>
                    {popular.night.game.HomeTeamMoneyLine < 0
                      ? popular.night.game.HomeTeam
                      : popular.night.game.AwayTeam}
                  </Text>
                </View>
                <View style={{ width: 150, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 20, color: jaune }}>VS</Text>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: RFValue(70),
                    height: RFValue(70),
                    borderRadius: 100,
                    backgroundColor: jaune,
                  }}>
                  <Text style={{ color: noir, fontSize: RFValue(14) }}>
                    {popular.night.game.AwayTeamMoneyLine > 0
                      ? popular.night.game.AwayTeam
                      : popular.night.game.HomeTeam}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: jaune,
                  fontSize: RFValue(12),
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginVertical: 30,
                }}>
                MOST POPULAR PICK:
                {popularPick.night && popularPick.night.method ? popularPick.night.method.value.toUpperCase() : ''}
              </Text>
            </View>
          ) : null}

          {/* ////////////////////////////////////////////////////////////////////////////// */}
          {this.props.user && (!this.props.user.conferenceCFB || this.props.user.conferenceCFB === '') && (
            <View
              style={{
                backgroundColor: '#191919',
                paddingVertical: 47,
                paddingHorizontal: 20,
                width: '95%',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: RFValue(35),
                  fontWeight: '400',
                }}>
                {'It’s Game Time.'}
              </Text>

              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: RFValue(16),
                  fontWeight: '700',

                  marginTop: 10,
                }}>
                {'PICK YOUR POWER CONFERENCE'}
              </Text>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'monda',
                  fontSize: 17,
                  fontWeight: '400',
                  lineHeight: 22,
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                {
                  'The regular season is starting next week. That means it’s time for you to select your Power Conference. This selection cannot be changed once done Pick Wisely.'
                }
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.selectedConference.show()
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  width: '100%',
                  backgroundColor: gris,
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  marginTop: 30,
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    color: jaune,
                    fontSize: RFValue(15),
                    fontFamily: 'monda',
                    fontWeight: '400',
                    width: '90%',
                  }}>
                  {this.state.conferenceCFB ? this.state.conferenceCFB : 'Select your Power Conference'}
                </Text>
                <Ionicons name={'ios-arrow-down'} color={jaune} size={RFValue(20)} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.updateUserInfo(
                    { conferenceCFB: this.state.conferenceCFB },
                    this.props.user.id,
                    this.props.token,
                  )
                }}
                style={{
                  height: RFValue(50),
                  width: '50%',
                  backgroundColor: jaune,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    color: '#191919',
                    fontFamily: 'monda',
                    fontSize: RFValue(20),
                    fontWeight: '700',
                  }}>
                  {'SUBMIT'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              backgroundColor: '#191919',

              width: '95%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 50,
              paddingHorizontal: 10,
              marginVertical: 30,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: RFValue(25),
                fontWeight: '400',

                textAlign: 'center',
              }}>
              {'You’ve been drafted.'}
            </Text>

            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: RFValue(16),

                marginTop: 10,
                textAlign: 'center',
              }}>
              {`YOU ARE NOW PART OF \n${
                this.props.user && this.props.user.group && this.props.user.group.name ? this.props.user.group.name : ''
              }`}
            </Text>
            <Image
              source={
                this.props.user && this.props.user.group && this.props.user.group.image
                  ? { uri: this.props.user.group.image.url }
                  : require('../images/groupima.png')
              }
              style={{ width: '70%', height: RFValue(130), resizeMode: 'contain' }}
            />
            <TouchableOpacity
              onPress={() => {
                this.props.props.navigation.navigate('Conference')
              }}
              style={{
                height: 50,
                width: '90%',
                backgroundColor: jaune,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Monda',
                  fontSize: RFValue(13),
                  fontWeight: '700',
                }}>
                {'VIEW YOUR CFGL CONFERENCE'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* PLAYER OF THE WEEK////////////////////////////////////////////////////////////////////////////// */}

          <Text
            style={{
              color: '#edd798',
              fontFamily: 'Monda',
              fontSize: RFValue(35),
              alignSelf: 'center',
              textAlign: 'center',
              marginBottom: 20,
            }}>
            {` Week ${this.props.currentWeek - 1}\n Highlights`}
          </Text>

          <View
            style={{
              width: '95%',

              backgroundColor: '#191919',
              alignSelf: 'center',
              alignItems: 'center',
              paddingVertical: 30,
            }}>
            {/* {this.props.seasonStatus === "STARTED" &&  } */}
            <Text
              style={{
                color: '#edd798',
                fontSize: RFValue(14),
                fontWeight: '700',

                marginVertical: 20,
              }}>
              {'PLAYER OF THE WEEK'}
            </Text>

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
                  this.state.topPlayer && this.state.topPlayer.user && this.state.topPlayer.user.avatar
                    ? {
                        uri: this.state.topPlayer.user.avatar,
                      }
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
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: RFValue(24),
                marginTop: 10,
                marginBottom: 25,
              }}>
              {this.state.topPlayer && this.state.topPlayer.user ? this.state.topPlayer.user.username : ''}
            </Text>

            <View style={{ flexDirection: 'row', paddingHorizontal: 50 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'TOTAL'}
                  </Text>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'POINTS'}
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: RFValue(25),
                    fontWeight: '700',
                  }}>
                  {this.state.topUserTotalPnt}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'WON'}
                  </Text>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',
                      width: 40,
                      textAlign: 'center',
                    }}>
                    {'%'}
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: RFValue(25),
                    fontWeight: '700',
                  }}>
                  {this.state.topUserPercentGameWin}
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',
                      width: 40,
                      textAlign: 'center',
                    }}>
                    {'%'}
                  </Text>
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'PICKS'}
                  </Text>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'WON'}
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: RFValue(25),
                    fontWeight: '700',
                  }}>
                  {this.state.topUserTotalGameWin}
                </Text>
              </View>
            </View>
          </View>

          {/* TOP SCORING CFGL CONFERENCE////////////////////////////////////////////////////////////////////////////// */}

          <View
            style={{
              width: '95%',
              paddingVertical: 20,
              backgroundColor: '#191919',
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <Text
              style={{
                color: '#edd798',
                fontSize: RFValue(12),
                fontWeight: '700',
                marginVertical: 20,
                textAlign: 'center',
              }}>
              {'Top scoring cfgl conference of the week'.toUpperCase()}
            </Text>

            <Image
              source={
                this.state.topGroup && this.state.topGroup.image
                  ? { uri: this.state.topGroup.image.url }
                  : require('../images/HomeHeader.png')
              }
              style={{
                width: '70%',
                height: RFValue(130),
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                color: '#edd798',
                fontSize: RFValue(17),
                fontWeight: '700',

                textAlign: 'center',
              }}>
              {this.state.topGroup && this.state.topGroup.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 30,
                paddingHorizontal: 50,
              }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'TOTAL'}
                  </Text>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'POINTS'}
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: RFValue(25),
                    fontWeight: '700',
                  }}>
                  {this.state.topGroupTotaltWin}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'WIN'}
                  </Text>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',
                      width: 40,
                      textAlign: 'center',
                    }}>
                    {'%'}
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: RFValue(25),
                    fontWeight: '700',
                  }}>
                  {this.state.topGroupPercentWin}
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',
                      width: 40,
                      textAlign: 'center',
                    }}>
                    {'%'}
                  </Text>
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'PICKS'}
                  </Text>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(10),
                      fontWeight: '700',

                      textAlign: 'center',
                    }}>
                    {'WON'}
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: RFValue(25),
                    fontWeight: '700',
                  }}>
                  {this.state.topGroupGamesWin}
                </Text>
              </View>
            </View>
          </View>

          {/* CFGL Conferences Winners ////////////////////////////////////////////////////////////////////////////// */}
          {this.state.playersByGroup && this.state.playersByGroup.length > 0 && (
            <View style={{}}>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: RFValue(20),
                  fontWeight: '400',

                  alignSelf: 'center',
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                {'CFGL Conferences Winners'}
              </Text>

              {this.state.playersByGroup.map((grp, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '95%',
                      marginTop: 20,
                      backgroundColor: '#191919',
                      alignSelf: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingBottom: 20,
                    }}>
                    <Text
                      style={{
                        color: '#edd798',
                        fontFamily: 'Monda',
                        fontSize: RFValue(14),
                        fontWeight: '400',

                        marginVertical: 10,
                      }}>
                      {this.groupByIdFunc(grp.group) && this.groupByIdFunc(grp.group).name
                        ? this.groupByIdFunc(grp.group).name
                        : ''}
                    </Text>
                    {_.orderBy(grp.player, ['total'], ['desc']).map((item, index) => {
                      if (index < 3)
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              const data = {
                                _id: item.user._id,
                              }
                              this.props.setHerInfoUser(data)
                              this.props.props.navigation.navigate('ProfileStatistics')
                            }}
                            key={index}
                            style={{
                              flexDirection: 'row',
                              paddingVertical: 10,
                              alignItems: 'center',
                              borderBottomColor: 'rgba(255,255,255,0.2)',
                              borderBottomWidth: grp.player.length > 2 && index < 2 ? 1 : 0,
                            }}>
                            <Text
                              style={{
                                width: 40,
                                color: '#edd798',
                                fontFamily: 'Monda',
                                fontSize: RFValue(14),
                                fontWeight: '600',
                                padding: 10,
                              }}>
                              {index + 1}
                            </Text>
                            <Image
                              source={
                                item.user.avatar && item.user.avatar
                                  ? { uri: item.user.avatar }
                                  : {
                                      uri: 'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
                                    }
                              }
                              style={{
                                width: RFValue(40),
                                height: RFValue(40),
                                borderRadius: RFValue(20),
                                backgroundColor: jaune,
                              }}
                            />
                            <Text
                              style={{
                                flex: 1,
                                color: '#edd798',
                                fontFamily: 'Monda',
                                fontSize: RFValue(14),

                                padding: 10,
                              }}>
                              {item.user.username}
                            </Text>
                            <Text
                              style={{
                                flex: 1,
                                marginLeft: 5,
                                textAlign: 'right',
                                color: '#edd798',
                                fontFamily: 'Monda',
                                fontSize: RFValue(14),
                                fontWeight: '700',

                                padding: 10,
                              }}>
                              {item.total} {'Pts'}
                            </Text>
                          </TouchableOpacity>
                        )
                    })}
                  </View>
                )
              })}
            </View>
          )}
          <View style={{ marginBottom: 30 }}></View>
          <ActionSheet
            ref={o => (this.selectedConference = o)}
            title={`\nPICK YOUR POWER CONFERENCE`}
            options={conferenceGroup()
              .filter(f => f.ConferenceName !== 'All')
              .map(i => i.ConferenceName || '')}
            cancelButtonIndex={conferenceGroup().filter(f => f.ConferenceName !== 'All').length - 1}
            // destructiveButtonIndex={1}
            onPress={index => {
              if (index !== conferenceGroup().filter(f => f.ConferenceName !== 'All').length - 1)
                this.setState({
                  conferenceCFB: conferenceGroup().filter(f => f.ConferenceName !== 'All')[index].ConferenceName,
                })
            }}
          />
        </ScrollView>

        {/* )} */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={visible}
          onDismiss={this._hideModal}
          style={{ backgroundColor: 'transparent', paddingTop: 0 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={gris} barStyle={'dark-content'} />
            <View
              style={{
                width: '100%',
                flex: 1,
                backgroundColor: gris,
              }}>
              <ImageBackground
                source={require('../images/cfglheader.png')}
                style={{
                  height: 65,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                resizeMode={'contain'}>
                <Text
                  style={{
                    marginLeft: 60,
                    color: jaune,

                    fontFamily: 'Monda',
                    fontSize: 15,
                    fontWeight: '700',
                    lineHeight: 22,
                  }}></Text>
                <Ionicons
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 25,
                    paddingRight: 50,
                    paddingLeft: 3,
                  }}
                  name="ios-arrow-back"
                  size={24}
                  color={jaune}
                  onPress={() => this._hideModal()}
                />
              </ImageBackground>
              <ProfileStats />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const {
    user,
    conferences,
    conference,
    groups,
    bowlSeason,

    token,
  } = state.user
  const { statusGame, weekBets, players, playersByWeek, currentYear, currentWeek, seasonStatus, weekstartdate } =
    state.game
  return {
    user,
    token,
    conferences,
    weekBets,
    conference,
    statusGame,
    currentYear,
    currentWeek,
    groups,
    players,
    playersByWeek,
    bowlSeason,
    weekstartdate,
    seasonStatus,
  }
}

export default connect(mapStateToProps, {
  getCurrentWeekGame,
  getConferences,
  setUserConference,
  getGroups,
  getWeekBets,
  updateUserInfo,
  logoutUser,
  setGameStatus,
  getPlayers,
  getPlayersByWeek,
  setBowlSeason,
  getBets,
  setCurrentSeasonWeek,
  getHerParlays,
  setHerInfoUser,
  setWeekDate,
  setUserRank,
})(feeds)
