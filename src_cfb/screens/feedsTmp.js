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
import _ from 'lodash'
import moment from 'moment'
import { noir, jaune, gris } from '../styles/colors'
import { Ionicons } from 'react-native-vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { GroupByGroup, gameString } from '../utils/functions'
import { setHerInfoUser, getHerParlays } from '../redux/actions/otherUser'
import ProfileStats from './profileStats'
import { KEYAPI, SERVER } from '../redux/actionTypes'
import axios from 'axios'
//import BackgroundFetch from "react-native-background-fetch";

import BowlSeason from './bowlseason'
//import {Appearance} from "react-native-appearance";
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

// const weekStart = [
//   "2020-09-13T13:00:00",
//   "2020-09-17T20:20:00",
//   "2020-09-24T20:20:00",
//   "2020-10-01T20:20:00",
//   "2020-10-08T20:20:00",
//   "2020-10-15T20:20:00",
//   "2020-10-22T20:20:00",
//   "2020-10-29T20:20:00",
//   "2020-11-05T20:20:00",
//   "2020-11-12T20:20:00",
//   "2020-11-19T20:20:00",
//   "2020-11-26T12:30:00",
//   "2020-12-03T20:20:00",
//   "2020-12-10T20:20:00",
//   "2020-12-17T20:20:00",
//   "2020-12-25T16:30:00",
//   "2021-01-03T13:00:00"]

class feeds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,

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
    }

    this.props.setCurrentSeasonWeek()
    this.props.setWeekDate()

    if (this.props.user && this.props.user.profile) this.props.logoutUser()

    this.props.getWeekBets(this.props.currentYear, this.props.currentWeek, this.props.token)
    //alert(JSON.stringify(this.props.seasonStatus))
    this.execution()
  }

  componentDidMount() {
    //this.execution();
    this._retrieveData()
    this.props.setBowlSeason(false)

    if (this.props.players && this.props.players.length > 0) {
      this.preExecution()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.statusGame !== this.props.statusGame && this.props.statusGame === 'SUCCESS_BET_UPDATE') ||
      this.props.statusGame === 'SUCCESS_SAVE_PARLAY' ||
      this.props.statusGame === 'SUCCESS_DELETE_PARLAY'
      //|| this.props.statusGame === "SUCCESS_GET_PLAYERS"
    ) {
      this.props.setGameStatus('')
      this.props.getPlayers(null, this.props.token)
      let prevWeek = this.props.currentWeek - 1
      this.props.getPlayersByWeek(prevWeek, this.props.token)
    }

    if (prevProps.statusGame !== this.props.statusGame && this.props.statusGame === 'SUCCESS_GET_PLAYERS') {
      this.preExecution()
    }
  }

  preExecution = () => {
    let finalRange = _.orderBy(this.props.players, ['total'], ['desc'])

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
        range: {
          index: myRangeIndex + 1,
          points: myRangeData[0].total,
          win: myRangeWin.length,
        },
      })
    }

    //reset status
    this.props.setGameStatus('')

    ///set player
    if (this.props.seasonStatus === 'FINISHED') {
      this.topPlayerFunc('all')
    } else if (this.props.seasonStatus === 'STARTED') this.topPlayerFunc('week')

    ///set group

    if (this.props.seasonStatus === 'FINISHED') {
      this.topGroupFunc('all')
    } else if (this.props.seasonStatus === 'STARTED') this.topGroupFunc('week')
  }

  execution = () => {
    this.props.getConferences(this.props.token)
    this.props.getGroups(this.props.token)
    this.props.getPlayers(null, this.props.token)
    let prevWeek = this.props.currentWeek - 1
    this.props.getPlayersByWeek(prevWeek, this.props.token)
    this.props.getBets(this.props.user._id, this.props.currentWeek, this.props.token)

    console.log(this.props.seasonStatus)
    if (this.props.players && this.props.players.length > 0) {
      ///set player
      if (this.props.seasonStatus === 'FINISHED') {
        this.topPlayerFunc('all')
      } else if (this.props.seasonStatus === 'STARTED') this.topPlayerFunc('week')

      ///set group

      if (this.props.seasonStatus === 'FINISHED') {
        this.topGroupFunc('all')
      } else if (this.props.seasonStatus === 'STARTED') this.topGroupFunc('week')
    }
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if (value !== null) {
        // We have data!!
        console.log(value)
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
    let dd = this.props.weekBets
      .sort((a, b) => new Date(a.game.DateTime) - new Date(b.game.DateTime))
      .filter(a => {
        let h1 = moment(new Date('2019-01-01T' + a.game.DateTime.split('T')[1]))
        var d1 = moment(new Date('2019-01-01T' + x))
        var d2 = moment(new Date('2019-01-01T' + y))
        if (d1 < h1 && h1 < d2) return a
      })

    let res = dd.map(a => {
      return {
        game: a.game,
        nb: dd.filter(b => b.game.GameID === a.game.GameID).length,
      }
    })

    let popular = _.uniqBy(res, 'game.GameID').sort((a, b) => b.nb - a.nb)[0]

    return popular ? popular : {}
  }

  popularPick = (x, y) => {
    let dd = this.props.weekBets
      .sort((a, b) => new Date(a.game.DateTime) - new Date(b.game.DateTime))
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

    // console.log("====================================================");
    // console.log(
    //   JSON.stringify(
    //     _.uniqBy(res, "method.value").sort((a, b) => b.nb - a.nb)[0],
    //     null,
    //     2
    //   )
    // );

    let popular = _.uniqBy(res, 'method.value').sort((a, b) => b.nb - a.nb)[0]

    return popular ? popular : {}
  }

  topPlayerFunc = return_ => {
    // Top players stats/////////////////////////=======================

    if (return_ === 'week' && this.props.playersByWeek && this.props.players && this.props.players.length > 0) {
      let _topPlayer = _.orderBy(this.props.playersByWeek, ['total'], ['desc'])[0]

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
    if (return_ === 'all' && this.props.players && this.props.players.length > 0) {
      let _topPlayer = _.orderBy(this.props.players, ['total'], ['desc'])[0]

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
    if (return_ === 'week' && this.props.playersByWeek && this.props.players && this.props.players.length > 0) {
      let _playersByGroup = GroupByGroup(this.props.playersByWeek).map(i => {
        let groupTotalPnt = i.player.reduce((a, b) => a + b.total, 0)
        i.player.groupTotal = groupTotalPnt
        i.player.group = i.group
        return i.player
      })

      this.setState({ playersByGroup: GroupByGroup(this.props.players) })
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
    if (return_ === 'all' && this.props.players && this.props.players.length > 0) {
      let _playersByGroup = GroupByGroup(this.props.players).map(i => {
        let groupTotalPnt = i.player.reduce((a, b) => a + b.total, 0)
        i.player.groupTotal = groupTotalPnt
        i.player.group = i.group
        return i.player
      })

      this.setState({ playersByGroup: GroupByGroup(this.props.players) })
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
    this.setState({ refreshing: true })
    this.props.getPlayers(null, this.props.token)
    let prevWeek = this.props.currentWeek - 1
    this.props.getPlayersByWeek(prevWeek, this.props.token)

    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }

  render() {
    const { popular, popularPick, visible } = this.state
    return (
      <View style={{ flex: 1 }}>
        {/* ////////////////////////////////////////////////////////////////////////////// */}
        <StatusBar backgroundColor={gris} barStyle="light-content" />
        {/* {this.props.bowlSeason === true ? (
          <BowlSeason />
        ) : ( */}

        <ScrollView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          style={{ flex: 1, marginTop: 0, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}>
          {this.props.seasonStatus === 'STARTED' && (
            <View>
              {parseInt(
                (new Date(`${this.props.weekstartdate[this.props.currentWeek - 1].date}.000Z`).getTime() -
                  new Date().getTime()) /
                  (24 * 3600 * 1000),
              ) > 0 ? (
                <View
                  style={{
                    height: 73,

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
                      fontSize: 12,
                      fontWeight: '700',
                      lineHeight: 24,
                    }}>
                    {` WEEK ${this.props.currentWeek} STARTS IN ${parseInt(
                      (new Date(`${this.props.weekstartdate[this.props.currentWeek - 1].date}.000Z`).getTime() -
                        new Date().getTime()) /
                        (24 * 3600 * 1000),
                    )} DAY(S)`}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Scores')
                    }}
                    style={{
                      width: 132,
                      height: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#191919',
                    }}>
                    <Text
                      style={{
                        color: '#edd798',
                        fontFamily: 'monda',
                        fontSize: 10,
                        fontWeight: '700',
                        lineHeight: 12,
                      }}>
                      LIVE SCORES
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    height: 70,

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
                      fontSize: 12,
                      fontWeight: '700',
                      lineHeight: 24,
                    }}>
                    {` WEEK  ${this.props.currentWeek} HAS STARTED`}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Scores')
                    }}
                    style={{
                      width: 132,
                      height: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#191919',
                    }}>
                    <Text
                      style={{
                        color: '#edd798',
                        fontFamily: 'monda',
                        fontSize: 10,
                        fontWeight: '700',
                        lineHeight: 12,
                      }}>
                      LIVE SCORES
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {this.props.seasonStatus === 'FINISHED' && (
            <View
              style={{
                height: 70,

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
                  fontSize: 12,
                  fontWeight: '700',
                  lineHeight: 24,
                }}>
                {` SEASON  ${this.props.currentYear} HAS FINISHED`}
              </Text>
            </View>
          )}

          {/* Time wait for next saison ////////////////////////////////////////////////////////////////////////////// */}

          <WeekTiming isHeader={1} />
          {/* Final ranking////////////////////////////////////////////////////////////////////////////// */}
          <View
            style={{
              backgroundColor: noir,
              height: 150,
              marginVertical: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderRightColor: jaune,
                borderRightWidth: 2,
                height: 80,
                flex: 1,
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                {'FINAL RANK'}
              </Text>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: 40,
                    fontWeight: '800',
                    textAlign: 'center',
                  }}>
                  {this.state.range.index}
                </Text>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: 10,
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
                height: 80,
                flex: 1,
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                {'TOTAL POINTS'}
              </Text>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 40,
                  fontWeight: '800',
                  textAlign: 'center',
                }}>
                {this.state.range.points}
              </Text>
            </View>
            <View
              style={{
                height: 80,
                flex: 1,
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                {'WIN %'}
              </Text>

              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 40,
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
                height: 220,
                width: '95%',
                alignSelf: 'center',
                marginBottom: 40,
                marginTop: 40,
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: 32,
                  backgroundColor: '#edd798',
                }}>
                <Text
                  style={{
                    color: noir,
                    fontFamily: 'Monda',
                    fontSize: 14,
                    fontWeight: '700',
                  }}>
                  {'MOST PICKED MORNING GAME'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 30,
                  paddingHorizontal: 15,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: jaune,
                    fontWeight: '900',
                    lineHeight: 22,
                  }}>
                  <Text style={{ color: noir, fontSize: 15 }}>
                    {popular.morning.game.HomeTeamMoneyLine < 0
                      ? popular.morning.game.HomeTeam
                      : popular.morning.game.AwayTeam}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 0,
                  }}>
                  <Text
                    style={{
                      color: jaune,
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    {gameString(popular.morning.game)}
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: jaune,
                  }}>
                  <Text style={{ color: noir, fontSize: 15 }}>
                    {popular.morning.game.AwayTeamMoneyLine > 0
                      ? popular.morning.game.AwayTeam
                      : popular.morning.game.HomeTeam}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: jaune,
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: 30,
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
                height: 220,
                width: '95%',
                alignSelf: 'center',
                marginBottom: 40,
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: 32,
                  backgroundColor: '#edd798',
                }}>
                <Text
                  style={{
                    color: noir,
                    fontFamily: 'Monda',
                    fontSize: 14,
                    fontWeight: '700',
                  }}>
                  {'MOST PICKED AFTERNOON GAME'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 30,
                  paddingHorizontal: 15,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: jaune,
                    fontWeight: '900',
                    lineHeight: 22,
                  }}>
                  <Text style={{ color: noir, fontSize: 15 }}>
                    {popular.afternoon.game.HomeTeamMoneyLine < 0
                      ? popular.afternoon.game.HomeTeam
                      : popular.afternoon.game.AwayTeam}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 0,
                  }}>
                  <Text
                    style={{
                      color: jaune,
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    {gameString(popular.afternoon.game)}
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: jaune,
                  }}>
                  <Text style={{ color: noir, fontSize: 15 }}>
                    {popular.afternoon.game.AwayTeamMoneyLine > 0
                      ? popular.afternoon.game.AwayTeam
                      : popular.afternoon.game.HomeTeam}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: jaune,
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: 30,
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
                height: 220,
                width: '95%',
                alignSelf: 'center',
                marginBottom: 40,

                paddingVertical: 0,
                paddingHorizontal: 0,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: 32,
                  backgroundColor: '#edd798',
                }}>
                <Text
                  style={{
                    color: noir,
                    fontFamily: 'Monda',
                    fontSize: 14,
                    fontWeight: '700',
                  }}>
                  {'MOST PICKED NIGHT GAME'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 30,
                  paddingHorizontal: 15,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: jaune,
                    fontWeight: '900',
                    lineHeight: 22,
                  }}>
                  <Text style={{ color: noir, fontSize: 15 }}>
                    {popular.night.game.HomeTeamMoneyLine < 0
                      ? popular.night.game.HomeTeam
                      : popular.night.game.AwayTeam}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 0,
                  }}>
                  <Text
                    style={{
                      color: jaune,
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    {gameString(popular.night.game)}
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: jaune,
                  }}>
                  <Text style={{ color: noir, fontSize: 15 }}>
                    {popular.night.game.AwayTeamMoneyLine > 0
                      ? popular.night.game.AwayTeam
                      : popular.night.game.HomeTeam}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: jaune,
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: 30,
                }}>
                MOST POPULAR PICK:
                {popularPick.night && popularPick.night.method ? popularPick.night.method.value.toUpperCase() : ''}
              </Text>
            </View>
          ) : null}

          {/* ////////////////////////////////////////////////////////////////////////////// */}
          {this.props.user &&
          (!this.props.user.conference ||
            (this.props.user.conference.name !== 'West' &&
              this.props.user.conference.name !== 'North' &&
              this.props.user.conference.name !== 'South' &&
              this.props.user.conference.name !== 'East')) ? (
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
                  fontSize: 35,
                  fontWeight: '400',
                }}>
                {'It’s Game Time.'}
              </Text>

              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 16,
                  fontWeight: '700',
                  lineHeight: 28,
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
                  height: 50,
                  width: '100%',
                  backgroundColor: gris,
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    color: jaune,
                    fontSize: 15,
                    fontFamily: 'monda',
                    fontWeight: '400',
                    width: '90%',
                  }}>
                  {this.state.conference && this.state.conference.conferenceName
                    ? this.state.conference.conferenceName
                    : 'Select your Power Division'}
                </Text>
                <Ionicons name={'ios-arrow-down'} color={jaune} size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.updateUserInfo(
                    { conference: this.state.conference._id },
                    this.props.user.id,
                    this.props.token,
                  )
                }}
                style={{
                  height: 50,
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
                    fontSize: 19,
                    fontWeight: '700',
                  }}>
                  {'SUBMIT'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: '#191919',

                width: '95%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 50,
                paddingHorizontal: 10,
                marginVertical: 20,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 39,
                  fontWeight: '400',
                  lineHeight: 40,
                  textAlign: 'center',
                }}>
                {'You’ve been drafted.'}
              </Text>

              <Text
                style={{
                  width: 250,
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 16,
                  lineHeight: 30,
                  marginTop: 10,
                  textAlign: 'center',
                }}>
                {`YOU ARE NOW PART OF “${
                  this.props.user && this.props.user.group && this.props.user.group.name
                    ? this.props.user.group.name
                    : ''
                }”`}
              </Text>
              <Image
                source={
                  this.props.user && this.props.user.group && this.props.user.group.image
                    ? { uri: this.props.user.group.image.url }
                    : require('../images/groupima.png')
                }
                style={{ width: '80%', height: 200, resizeMode: 'contain' }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Conference')
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
                    fontSize: 13,
                    fontWeight: '700',
                  }}>
                  {'VIEW YOUR CFGL CONFERENCE'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PLAYER OF THE WEEK////////////////////////////////////////////////////////////////////////////// */}
          {this.props.seasonStatus !== 'PREPARING' && (
            <View>
              {this.props.seasonStatus === 'STARTED' && (
                <Text
                  style={{
                    width: 217,
                    height: 116,
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: 45,
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginVertical: 20,
                  }}>
                  Week {this.props.currentWeek - 1} Highlights
                </Text>
              )}
              {this.props.seasonStatus === 'FINISHED' && (
                <Text
                  style={{
                    width: 217,
                    height: 116,
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: 30,
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  SEASON {this.props.currentYear} Highlights
                </Text>
              )}

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
                    fontFamily: 'Monda',
                    fontSize: 14,
                    fontWeight: '700',
                    lineHeight: 22,
                    marginVertical: 20,
                  }}>
                  {this.props.seasonStatus === 'STARTED'
                    ? 'PLAYER OF THE WEEK'
                    : this.props.seasonStatus === 'FINISHED'
                    ? 'PLAYER OF THE SEASON'
                    : ''}
                </Text>

                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    borderColor: '#edd798',
                    borderStyle: 'solid',
                    borderWidth: 2,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={
                      this.state.topPlayer &&
                      this.state.topPlayer.user &&
                      this.state.topPlayer.user.avatar &&
                      this.state.topPlayer.user.avatar.url
                        ? {
                            uri: this.state.topPlayer.user.avatar.url,
                          }
                        : {
                            uri: 'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
                          }
                    }
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 342,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: 24,
                    marginTop: 10,
                    marginBottom: 5,
                  }}>
                  {this.state.topPlayer && this.state.topPlayer.user ? this.state.topPlayer.user.username : ''}
                </Text>
                {this.props.seasonStatus === 'FINISHED' && (
                  <Image
                    source={{
                      uri: 'https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/1024/cup-icon.png',
                    }}
                    style={{
                      width: 64,
                      height: 64,
                      marginBottom: 10,
                    }}
                  />
                )}

                <View style={{ flexDirection: 'row', paddingHorizontal: 50 }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View>
                      <Text
                        style={{
                          color: '#edd798',
                          fontFamily: 'Monda',
                          fontSize: 10,
                          fontWeight: '700',

                          textAlign: 'center',
                        }}>
                        {'TOTAL'}
                      </Text>
                      <Text
                        style={{
                          color: '#edd798',
                          fontFamily: 'Monda',
                          fontSize: 10,
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
                        fontSize: 25,
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
                          fontSize: 10,
                          fontWeight: '700',
                          width: 40,
                          textAlign: 'center',
                        }}>
                        {'WIN'}
                      </Text>
                      <Text
                        style={{
                          color: '#edd798',
                          fontFamily: 'Monda',
                          fontSize: 10,
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
                        fontSize: 25,
                        fontWeight: '700',
                      }}>
                      {this.state.topUserPercentGameWin}
                    </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View>
                      <Text
                        style={{
                          color: '#edd798',
                          fontFamily: 'Monda',
                          fontSize: 10,
                          fontWeight: '700',

                          textAlign: 'center',
                        }}>
                        {'PICKS'}
                      </Text>
                      <Text
                        style={{
                          color: '#edd798',
                          fontFamily: 'Monda',
                          fontSize: 10,
                          fontWeight: '700',
                          width: 40,
                          textAlign: 'center',
                        }}>
                        {'WIN'}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: '#edd798',
                        fontFamily: 'Monda',
                        fontSize: 25,
                        fontWeight: '700',
                      }}>
                      {this.state.topUserTotalGameWin}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          {/* TOP SCORING CFGL CONFERENCE////////////////////////////////////////////////////////////////////////////// */}
          {/* {this.props.seasonStatus === "STARTED" && } */}
          {this.props.seasonStatus !== 'PREPARING' && (
            <View
              style={{
                width: '95%',
                paddingVertical: 20,
                backgroundColor: '#191919',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 50,
              }}>
              {this.props.seasonStatus === 'STARTED' && (
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: 14,
                    fontWeight: '700',
                    marginVertical: 20,
                  }}>
                  TOP SCORING CFGL CONFERENCE WEEK
                </Text>
              )}

              {this.props.seasonStatus === 'FINISHED' && (
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Monda',
                    fontSize: 14,
                    fontWeight: '700',
                    textAlign: 'center',
                    marginVertical: 20,
                    marginHorizontal: 20,
                  }}>
                  TOP SCORING CFGL CONF. OF THE SEASON
                </Text>
              )}

              <Image
                source={
                  this.state.topGroup && this.state.topGroup.imag
                    ? { uri: this.state.topGroup.image.url }
                    : require('../images/HomeHeader.png')
                }
                style={{
                  width: '100%',
                  height: 130,
                  resizeMode: 'contain',
                }}
              />

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
                        fontSize: 10,
                        fontWeight: '700',

                        textAlign: 'center',
                      }}>
                      {'TOTAL'}
                    </Text>
                    <Text
                      style={{
                        color: '#edd798',
                        fontFamily: 'Monda',
                        fontSize: 10,
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
                      fontSize: 25,
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
                        fontSize: 10,
                        fontWeight: '700',
                        width: 40,
                        textAlign: 'center',
                      }}>
                      {'WIN'}
                    </Text>
                    <Text
                      style={{
                        color: '#edd798',
                        fontFamily: 'Monda',
                        fontSize: 10,
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
                      fontSize: 25,
                      fontWeight: '700',
                    }}>
                    {this.state.topGroupPercentWin}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View>
                    <Text
                      style={{
                        color: '#edd798',
                        fontFamily: 'Monda',
                        fontSize: 10,
                        fontWeight: '700',
                        width: 40,
                        textAlign: 'center',
                      }}>
                      {'PICKS'}
                    </Text>
                    <Text
                      style={{
                        color: '#edd798',
                        fontFamily: 'Monda',
                        fontSize: 10,
                        fontWeight: '700',
                        width: 40,
                        textAlign: 'center',
                      }}>
                      {'WIN'}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: 25,
                      fontWeight: '700',
                    }}>
                    {this.state.topGroupGamesWin}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {/* CFGL Conferences Winners ////////////////////////////////////////////////////////////////////////////// */}
          {this.props.seasonStatus !== 'PREPARING' && (
            <View>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 35,
                  fontWeight: '400',
                  lineHeight: 35,
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginVertical: 30,
                }}>
                CFGL Conferences Winners
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
                        fontSize: 14,
                        fontWeight: '400',
                        lineHeight: 24,
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
                              this.props.getHerParlays(item.user.id, this.props.token)
                              this.props.setHerInfoUser(item.user, this.props.token)
                              this.props.navigation.navigate('ProfileStatistics')
                            }}
                            key={index}
                            style={{
                              flexDirection: 'row',
                              height: 50,
                              alignItems: 'center',
                              borderBottomColor: 'rgba(255,255,255,0.2)',
                              borderBottomWidth: grp.player.length > 2 && index < 2 ? 1 : 0,
                              height: 70,
                            }}>
                            <Text
                              style={{
                                width: 40,
                                color: '#edd798',
                                fontFamily: 'Monda',
                                fontSize: 14,
                                fontWeight: '600',
                                padding: 10,
                              }}>
                              {index + 1}
                            </Text>
                            <Image
                              source={
                                item.user.avatar && item.user.avatar.url
                                  ? { uri: item.user.avatar.url }
                                  : {
                                      uri: 'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
                                    }
                              }
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: jaune,
                              }}
                            />
                            <Text
                              style={{
                                flex: 1,
                                color: '#edd798',
                                fontFamily: 'Monda',
                                fontSize: 14,
                                lineHeight: 24,
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
                                fontSize: 14,
                                fontWeight: '700',
                                lineHeight: 24,
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
              {this.props.seasonStatus === 'FINISHED' && (
                <View>
                  <Text
                    style={{
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: 35,
                      fontWeight: '400',
                      lineHeight: 35,
                      alignSelf: 'center',
                      textAlign: 'center',
                      marginVertical: 30,
                    }}>
                    TOP 10 SEASON WINNERS
                  </Text>
                  {_.orderBy(this.props.players, ['total'], ['desc']).map((item, index) => {
                    if (index < 10)
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.getHerParlays(item.user.id, this.props.token)
                            this.props.setHerInfoUser(item.user, this.props.token)
                            this.props.navigation.navigate('ProfileStatistics')
                          }}
                          key={index}
                          style={{
                            flexDirection: 'row',
                            height: 50,
                            alignItems: 'center',
                            borderBottomColor: 'rgba(255,255,255,0.2)',
                            borderBottomWidth: 1,
                            height: 70,
                          }}>
                          <Text
                            style={{
                              width: 40,
                              color: '#edd798',
                              fontFamily: 'Monda',
                              fontSize: 14,
                              fontWeight: '600',
                              padding: 10,
                            }}>
                            {index + 1}
                          </Text>
                          <Image
                            source={
                              item.user.avatar && item.user.avatar.url
                                ? { uri: item.user.avatar.url }
                                : {
                                    uri: 'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
                                  }
                            }
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              backgroundColor: jaune,
                            }}
                          />
                          <Text
                            style={{
                              flex: 1,
                              color: '#edd798',
                              fontFamily: 'Monda',
                              fontSize: 14,
                              lineHeight: 24,
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
                              fontSize: 14,
                              fontWeight: '700',
                              lineHeight: 24,
                              padding: 10,
                            }}>
                            {item.total} {'Pts'}
                          </Text>
                        </TouchableOpacity>
                      )
                  })}
                </View>
              )}
            </View>
          )}

          {/* How it Works ////////////////////////////////////////////////////////////////////////////// */}

          {this.props.seasonStatus === 'PREPARING' && (
            <View
              style={{
                backgroundColor: '#191919',
                height: 400,
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
                  fontFamily: 'Monda',
                  fontSize: 35,
                  fontWeight: '400',
                  lineHeight: 35,
                }}>
                {'How it Works'}
              </Text>

              <Text
                style={{
                  width: 300,
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 17,
                  fontWeight: '400',
                  lineHeight: 22,
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                {
                  'Each game has a set amount of points ranging from 5 to 25 pts. You can always re-assign those points value later on by  going to the Picks tab in the Pick Center. Note: Once a game has started, you can no longer change its point value.'
                }
              </Text>

              <TouchableOpacity
                onPress={() => {}}
                style={{
                  height: 50,
                  width: '50%',
                  backgroundColor: jaune,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  marginTop: 50,
                }}>
                <Text
                  style={{
                    color: '#191919',
                    fontFamily: 'Monda',
                    fontSize: 15,
                    fontWeight: '700',
                  }}>
                  {'UNDERTOOD'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Championship Week is here. ////////////////////////////////////////////////////////////////////////////// */}

          {/* <View
              style={{
                backgroundColor: "#191919",
                height: 500,
                width: "95%",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 20,
                paddingHorizontal: 10,
                marginVertical: 20,
                alignSelf: "center",
              }}>
              <Image
                source={require("../images/launch.png")}
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: "contain",
                }}
              />
              <Text
                style={{
                  color: "#edd798",
                  fontFamily: "Monda",
                  fontSize: 30,
                  fontWeight: "400",
                  lineHeight: 35,
                  textAlign: "center",
                  marginTop: 20,
                }}>
                {"Championship Week is here."}
              </Text>

              <Text
                style={{
                  width: 280,
                  color: "#edd798",
                  fontFamily: "Monda",
                  fontSize: 14,
                  fontWeight: "400",
                  lineHeight: 24,
                  lineHeight: 30,
                  marginTop: 10,
                  textAlign: "center",
                  marginTop: 20,
                }}>
                {
                  "WIt’s that time of the year. Now is the time to select 5 of the 10 conference championship games and assign them a point value."
                }
              </Text>

              <TouchableOpacity
                onPress={() => { }}
                style={{
                  height: 50,
                  width: "50%",
                  backgroundColor: jaune,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 20,
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    color: "#191919",
                    fontFamily: "Monda",
                    fontSize: 14,
                    fontWeight: "700",
                  }}>
                  {"CONTINUE"}
                </Text>
              </TouchableOpacity>
            </View> */}

          {/* The Bowl Season is starting soon. ////////////////////////////////////////////////////////////////////////////// */}
          {/* <View
              style={{
                backgroundColor: "#191919",
                height: 500,
                width: "95%",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 20,
                paddingHorizontal: 10,
                marginVertical: 20,
                alignSelf: "center",
              }}>
              <Image
                source={require("../images/stadium.png")}
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: "contain",
                }}
              />
              <Text
                style={{
                  color: "#edd798",
                  fontFamily: "Monda",
                  fontSize: 30,
                  fontWeight: "400",
                  lineHeight: 35,
                  textAlign: "center",
                  marginTop: 20,
                }}>
                {"The Bowl Season is starting soon."}
              </Text>

              <Text
                style={{
                  width: 270,
                  color: "#edd798",
                  fontFamily: "Monda",
                  fontSize: 14,
                  fontWeight: "400",
                  lineHeight: 24,
                  lineHeight: 30,
                  marginTop: 10,
                  textAlign: "center",
                  marginTop: 20,
                }}>
                {
                  "We wipe the scoreboard clean and all start from zero again for Bowl Season. Start making your picks today."
                }
              </Text>

              <TouchableOpacity
                onPress={() => { }}
                style={{
                  height: 50,
                  width: "50%",
                  backgroundColor: jaune,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 20,
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    color: "#191919",
                    fontFamily: "Monda",
                    fontSize: 14,
                    fontWeight: "700",
                  }}>
                  {"CONTINUE"}
                </Text>
              </TouchableOpacity>
            </View> */}

          {/*  How it Works////////////////////////////////////////////////////////////////////////////// */}

          {/* <View
              style={{
                backgroundColor: "#191919",
                height: 450,
                width: "95%",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 20,
                paddingHorizontal: 10,
                marginVertical: 20,
                alignSelf: "center",
              }}>
              <Text
                style={{
                  color: "#edd798",
                  fontFamily: "Monda",
                  fontSize: 35,
                  fontWeight: "400",
                  lineHeight: 35,
                }}>
                {"How it Works"}
              </Text>

              <Text
                style={{
                  color: "#edd798",
                  fontFamily: "Monda",
                  fontSize: 16,
                  fontWeight: "700",
                  lineHeight: 28,
                  marginTop: 10,
                }}>
                {"PICK YOUR POWER CONFERENCE"}
              </Text>
              <Text
                style={{
                  color: "#edd798",
                  fontFamily: "Monda",
                  fontSize: 15,
                  fontWeight: "400",
                  lineHeight: 22,
                  textAlign: "center",
                  marginTop: 20,
                }}>
                {
                  "There are 38 Bowl Games. You must pick all 38 games and then assign them a point value from 1 through 38. Your 38 game is worth 38 points and your 1 game is worth 1 point. Your 15 game is worth 15 points, and so on and so forth. You can only have one game of each value. You may pick the spread or the over/under. Yes, you can pick $lines but NO parlays or stacking."
                }
              </Text>

              <TouchableOpacity
                onPress={() => { }}
                style={{
                  height: 50,
                  width: "50%",
                  backgroundColor: jaune,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 20,
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    color: "#191919",
                    fontFamily: "Monda",
                    fontSize: 19,
                    fontWeight: "700",
                  }}>
                  {"SUBMIT"}
                </Text>
              </TouchableOpacity>
            </View>
         */}

          <ActionSheet
            ref={o => (this.selectedConference = o)}
            title={'PICK YOUR POWER DIVISION'}
            options={this.props.conferences.map(i => i.conferenceName).concat(['Cancel'])}
            cancelButtonIndex={4}
            // destructiveButtonIndex={1}
            onPress={index => {
              if (index !== 11)
                this.setState(
                  {
                    conference: this.props.conferences[index],
                  },
                  () => {},
                )
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

WeekTiming = props => {
  if (props.isHeader === 0) {
    // return (
    //   <View
    //     style={{
    //       // position: "absolute",
    //       // top: 0,
    //       // left: 0,
    //       height: 73,
    //       zIndex: 999,
    //       width: "100%",
    //       backgroundColor: "#edd798",
    //       justifyContent: "space-between",
    //       flexDirection: "row",
    //       alignItems: "center",
    //       paddingHorizontal: 10,
    //     }}>
    //     <Text
    //       style={{
    //         color: "#191919",
    //         fontFamily: "monda",
    //         fontSize: 12,
    //         fontWeight: "700",
    //         lineHeight: 24,
    //       }}>
    //       {` WEEK 1 STARTS IN ${parseInt(
    //         (new Date("2020-08-29T04:00:00.000Z").getTime() -
    //           new Date().getTime()) /
    //           (24 * 3600 * 1000)
    //       )} DAYS`}
    //     </Text>

    //     <TouchableOpacity
    //       style={{
    //         width: 132,
    //         height: 48,
    //         alignItems: "center",
    //         justifyContent: "center",
    //         backgroundColor: "#191919",
    //       }}>
    //       <Text
    //         style={{
    //           color: "#edd798",
    //           fontFamily: "monda",
    //           fontSize: 10,
    //           fontWeight: "700",
    //           lineHeight: 12,
    //         }}>
    //         MAKE YOUR PICKS
    //       </Text>
    //     </TouchableOpacity>
    //   </View>
    // );
    return null
  } else if (props.isHeader === 1) {
    return (
      <View
        style={{
          backgroundColor: noir,
          paddingVertical: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#edd798',
            fontFamily: 'Monda',
            fontSize: 30,
            fontWeight: '400',
            lineHeight: 40,
            textAlign: 'center',
          }}>
          {'Final'}
        </Text>
        <Text
          style={{
            color: '#edd798',
            fontFamily: 'Monda',
            fontSize: 30,
            fontWeight: '400',
            lineHeight: 40,
            textAlign: 'center',
          }}>
          {'Standings'}
        </Text>
      </View>
    )
  } else {
    return (
      <View>
        <Text
          style={{
            width: '100%',
            alignSelf: 'center',
            textAlign: 'center',
            color: '#edd798',
            fontFamily: 'monda',
            fontSize: 37,
            fontWeight: '400',
          }}>
          {'The season hasn’t started yet.\n Come back in'}
        </Text>
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <Text
            style={{
              margin: 10,
              maxWidth: 200,
              alignSelf: 'center',
              textAlign: 'center',
              color: '#edd798',
              fontFamily: 'Monda',
              fontSize: 40,
              fontWeight: '600',
              backgroundColor: noir,
              paddingHorizontal: 20,
            }}>
            {parseInt((new Date('2020-08-29T04:00:00.000Z').getTime() - new Date().getTime()) / (24 * 3600 * 1000))}
          </Text>
          <Text
            style={{
              margin: 10,
              alignSelf: 'center',
              textAlign: 'center',
              color: '#edd798',
              fontFamily: 'Monda',
              fontSize: 40,
              fontWeight: '600',
              backgroundColor: noir,
              paddingHorizontal: 20,
            }}>
            {'DAYS'}
          </Text>
        </View>
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
})(feeds)
