import React, { Component } from 'react'
import {
  Animated,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import axios from 'axios'
import { CHAMIONSHIPWEEK, BOWLWEEK } from '../utils/variables'
import { jaune, noir, gris } from '../styles/colors'
import { Ionicons } from 'react-native-vector-icons'
import ActionSheet from 'react-native-actionsheet'
import { connect } from 'react-redux'
import { setGameStatus } from '../redux/actions/game'
import { getGroups } from '../services/games'
import { getAllPlayersPickSheet } from '../services/players'
import { SERVER } from '../redux/actionTypes'

import { setHerInfoUser, getHerParlays } from '../redux/actions/otherUser'

import { gameString } from '../utils/functions'
const HEADER_MAX_HEIGHT = 300
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 73
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
const weekList = [
  'Week 1',
  'Week 2',
  'Week 3',
  'Week 4',
  'Week 5',
  'Week 6',
  'Week 7',
  'Week 8',
  'Week 9',
  'Week 10',
  'Week 11',
  'Week 12',
  'Week 13',
  'Week 14',
  'Cancel',
]

class PickSheet extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      refreshing: false,
      week: this.props.currentWeek,
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      ),
      refreshing: false,
      usersGroup: [],
      group: this.props.user.group,
      groupId: this.props.user.group._id || '',

      groupsCfgl: [],
      players: [],
      bowlList: [],
    }
  }
  componentDidUpdate(prevProps, prevState) {}

  componentDidMount() {
    const { currentWeek, currentYear, user, token } = this.props
    this.getAllGroup()
    this.getAllPlayersAndGroup(user.group._id, currentWeek, currentYear + '', token)
    this.getAllBowlGames()
  }

  getAllPlayersAndGroup = async (group, currentWeek, currentYear, token) => {
    this.setState({ refreshing: true })

    const respGetPlayers = await getAllPlayersPickSheet(group, currentWeek, currentYear, token)
    if (respGetPlayers && respGetPlayers.data) {
      console.log('respGetPlayers', respGetPlayers.data.length)

      this.setState({
        players: respGetPlayers.data,
        usersGroup: respGetPlayers.data.filter(p => p.user.group === this.props.user.group._id),
      })
    }

    this.setState({ refreshing: false })
  }

  getAllGroup = async () => {
    const respGetGroups = await getGroups(this.props.token)
    if (respGetGroups && respGetGroups.data) {
      console.log('respGetGroups', respGetGroups.data.length)

      this.setState({ groupsCfgl: respGetGroups.data })
    }
  }
  showGroup = () => {
    this.group_.show()
  }
  showWeek = () => {
    this.week_.show()
  }
  game = (bets, type, week) => {
    let bet = bets.filter(i => i.betType.value == type)
    if (bet.length > 0) {
      return `${gameString(bet[0].game.GameFull)}- ${bet[0].betMethod.value.toUpperCase()} \nScore : ${
        bet[0].game.FavoriteScore || 0
      } - ${bet[0].game.UnderdogScore || 0} `
    } else {
      return ''
    }
  }

  gameBowl = (bets, title, week) => {
    let bet = bets.filter(i => i.week == week && i.game && i.game.GameFull && i.game.GameFull.Title === title)

    if (bet.length > 0) {
      console.log(bet[0], title)
      return `${bet[0].betMethod && bet[0].betMethod.value.toUpperCase()} (${bet[0].betType && bet[0].betType.point})`
    } else {
      return ''
    }
    return 0
  }
  isGameWin = (bets, type, week) => {
    let bet = bets.filter(i => i.week == week && i.betType.value === type)
    if (bet.length > 0) {
      if (bet[0].game.GameFull.Status === 'Final' || bet[0].game.GameFull.Status === 'F/OT') {
        if (bet[0].win == true && bet[0].game.rats !== 'PUSH') {
          return 'green'
        } else if (bet[0].win == true && bet[0].game.rats === 'PUSH') {
          return 'orange'
        } else if (bet[0].win == false) {
          return 'red'
        }
      } else {
        return jaune
      }
    } else {
      return '#fff'
    }
  }
  isGameWinBowl = (bets, title, week) => {
    let bet = bets.filter(i => i.week == week && i.game && i.game.GameFull && i.game.GameFull.Title === title)
    if (bet.length > 0) {
      if (bet[0].game.GameFull.Status === 'Final' || bet[0].game.GameFull.Status === 'F/OT') {
        if (bet[0].win == true && bet[0].game.rats !== 'PUSH') {
          return 'green'
        } else if (bet[0].win == true && bet[0].game.rats === 'PUSH') {
          return 'orange'
        } else if (bet[0].win == false) {
          return 'red'
        }
      } else {
        return jaune
      }
    } else {
      return '#fff'
    }
  }
  getGameResult = (bets, type, week) => {
    let bet = bets.filter(i => i.week == week && i.betType.value === type)
    if (bet.length > 0) {
      return bet[0]
    } else {
      return {}
    }
  }

  getGameResultBowl = (bets, title, week) => {
    let bet = bets.filter(i => i.week == week && i.game && i.game.GameFull && i.game.GameFull.Title === title)

    if (bet.length > 0) {
      return bet[0]
    } else {
      return null
    }
  }
  _showModal = () => this.setState({ visible: true })
  _hideModal = () => this.setState({ visible: false })

  onRefresh = () => {
    this.setState({ refreshing: true })
    const { currentWeek, currentYear, user, token } = this.props

    this.getAllPlayersAndGroup(this.state.group._id, this.state.week, currentYear + '', token)

    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }

  getAllBowlGames = () => {
    const self = this

    axios
      .get(`${SERVER}/betscfbs?&season=${this.props.currentYear}&week=${BOWLWEEK}`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      })
      .then(function (response) {
        // handle success
        // alert(response.data.length)
        // console.log(response.data.map(m => m.game.Title))
        self.setState({ bowlList: response.data.map(m => m.game.Title) })
        // if (response && response.data.filter(f => f.method.category === 'bowl').length > 0) {
        //   console.log(response.data)
        //   // alert(response.data.length)
        //   self.setState({ bowlGame: response.data.filter(f => f.method.category === 'bowl') })
        //   console.log('Data has been load')
        // } else {
        //   self.setState({ bowlGame: [] })
        // }
        // self.props.getCurrentWeekGame(self.props.currentYear, self.props.currentWeek)
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error))
      })
  }

  render() {
    const { group, week } = this.state
    // Because of content inset the scroll value will be negative on iOS so bring
    // it back to 0.
    const scrollY = Animated.add(this.state.scrollY, Platform.OS === 'ios' ? 1 : 0)
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    })

    return (
      <ScrollView
        style={{}}
        refreshControl={
          <RefreshControl tintColor={'#fff'} refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
        }>
        <MyPicks
          name="CFGL CONFERENCE"
          group={group && group.name ? group.name : 'SELECT CFGL CONFERENCE'}
          week={week ? week : 'SELECT WEEK'}
          showGroup={() => this.showGroup()}
          showWeek={() => this.showWeek()}
        />
        {this.props.seasonStatus !== 'PREPARING' && (
          <View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  marginRight: 10,
                }}>
                <View style={{ width: RFValue(8), height: RFValue(8), backgroundColor: jaune }} />
                <Text style={{ margin: 10, fontSize: RFValue(10), color: '#fff' }}>Scheduled</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View style={{ width: RFValue(8), height: RFValue(8), backgroundColor: 'red' }} />
                <Text style={{ margin: RFValue(10), fontSize: RFValue(10), color: '#fff' }}>Loss</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 0,
                  flex: 1,
                }}>
                <View style={{ width: RFValue(8), height: RFValue(8), backgroundColor: 'orange' }} />
                <Text style={{ margin: RFValue(10), fontSize: RFValue(10), color: '#fff' }}>Tie</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View style={{ width: RFValue(8), height: RFValue(8), backgroundColor: 'green' }} />
                <Text style={{ margin: 10, fontSize: RFValue(10), color: '#fff' }}>Win</Text>
              </View>
            </View>

            {this.props.seasonStatus === 'STARTED' ? (
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: noir,
                  borderBottomWidth: 1,
                }}>
                <Animated.ScrollView
                  // pointerEvents="none"
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={[styles.fill, { transform: [{ translateY: headerTranslate }] }]}
                  bounces={false}
                  contentInset={{
                    top: 0,
                  }}
                  contentOffset={{
                    y: 0,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 0.4,
                      alignItems: 'center',
                      height: 60,
                    }}>
                    <Text
                      style={{
                        width: 0,
                        height: 50,
                        color: '#edd798',
                        fontFamily: 'Arial',
                        fontSize: RFValue(14),
                        fontWeight: '400',
                        marginLeft: 10,
                      }}></Text>
                    <Text
                      style={{
                        width: RFValue(150),
                        color: '#edd798',
                        fontFamily: 'Arial',
                        fontSize: RFValue(11),
                        fontWeight: '500',
                        marginLeft: 0,
                      }}>
                      PLAYERS
                    </Text>
                  </View>
                  {this.state.usersGroup.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this.props.setHerInfoUser({
                          _id: item.user._id,
                        })
                        this.props.navigation.navigate('ProfileStatistics')
                      }}
                      style={{
                        //borderRightColor: "rgba(255,255,255,0.05)",
                        //borderRightWidth: 4,
                        alignItems: 'center',
                        backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      {Platform.OS === 'ios' && (
                        <View
                          style={{
                            width: RFValue(125),
                            position: 'absolute',
                            top: 0,
                            left: -10,
                            backgroundColor: index % 2 == 0 ? '#191919' : '#282828',

                            shadowColor: '#000',
                            shadowOffset: {
                              width: 5,
                              height: 8,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            height: 60,
                            elevation: 7,
                          }}
                        />
                      )}
                      <Text
                        style={{
                          width: RFValue(150),
                          color: jaune,
                          fontFamily: 'Arial',
                          fontSize: RFValue(10),
                          fontWeight: '400',
                          marginLeft: RFValue(40),
                          paddingVertical: 5,
                        }}>
                        #{item.user.username.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.ScrollView>
                <Animated.ScrollView
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  style={styles.fill}
                  scrollEventThrottle={1}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
                    useNativeDriver: true,
                  })}
                  // iOS offset for RefreshControl
                  contentInset={{
                    top: 0,
                  }}
                  contentOffset={{
                    y: 0,
                  }}>
                  <View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={this.state.visible}
                      onRequestClose={() => {
                        this._hideModal()
                      }}>
                      <View
                        style={{
                          alignSelf: 'center',
                          marginTop: 50,
                          height: this.state.selected && this.state.selected.game ? 550 : 100,
                          width: 300,
                          backgroundColor: '#fff',
                        }}>
                        <TouchableOpacity
                          onPress={this._hideModal}
                          style={{ padding: 10, position: 'absolute', top: 10, right: 10, zIndex: 999 }}>
                          <Text style={{ color: 'red' }}>Close</Text>
                        </TouchableOpacity>
                        {this.state.selected && !this.state.selected.game && (
                          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 20 }}>{'No Game Found'}</Text>
                          </View>
                        )}
                        {this.state.selected && this.state.selected.game && (
                          <View style={{ padding: 20, marginTop: 30 }}>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: '#eee',
                                padding: 10,
                                marginBottom: 10,
                              }}>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Game '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Game}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Spread '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Spread}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Over/Under '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.ou}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Away Team '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.AwayTeam}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Home Team '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.HomeTeam}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Fave '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.Fave}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Dog '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.Dog}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: '#eee',
                                padding: 10,
                              }}>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Bet on '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.betMethod.value.toUpperCase()}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Fav. Score '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.FavoriteScore}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Dog Score '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.UnderdogScore}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'O/U result '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.ou_score}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Score diff. '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.FavoriteScore - this.state.selected.game.UnderdogScore}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Win'}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.win ? 'Yes' : 'No'}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Points'}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.points}
                                </Text>
                              </View>
                            </View>
                            <Text
                              style={{
                                fontSize: 10,
                                marginTop: 10,
                                color: 'orange',
                              }}>{`NB: Favorite or Dog team is based on the spread.\nif spread is negative (<0) Home team is favorite else Away team is favorite\n\nSource: https://sportsdata.io`}</Text>
                          </View>
                        )}
                      </View>
                    </Modal>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 60,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            width: RFValue(40),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(10),
                            fontWeight: '900',
                            marginLeft: 20,
                          }}>
                          {'POINTS'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(10),
                            fontWeight: '900',
                            marginLeft: 20,
                          }}>
                          {'POWER GAME (10 pts)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'BINDING GAME (10 pts)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'FREE PICK 1 (7 pts)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'FREE PICK 2 (7 pts)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'FREE PICK 3 (7 pts)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {' DOG GAME ($Line)'}
                        </Text>
                      </View>
                      <FlatList
                        style={{ marginTop: -0.1 }}
                        bounces={false}
                        data={this.state.usersGroup}
                        renderItem={({ item, index }) => {
                          let rest = this.state.usersGroup[index].results
                          return (
                            <View
                              onPress={() => {}}
                              style={{
                                flexDirection: 'row',
                                height: 60,
                                alignItems: 'center',
                                backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                              }}>
                              <View
                                style={{
                                  backgroundColor: 'rgba(0,0,0,.0)',
                                  width: 10,
                                  height: 40,
                                  shadowColor: '#000',
                                  shadowOffset: {
                                    width: 1,
                                    height: 1,
                                  },
                                  shadowOpacity: 0.58,
                                  shadowRadius: 16.0,

                                  elevation: 24,
                                }}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'power game', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(60),
                                    color: '#fff',
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '600',
                                    marginLeft: 12,
                                  }}>
                                  {item.total}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'power game', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'power game', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'power game', this.state.week)}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'binding game', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'binding game', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'binding game', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'pick1', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'pick1', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'pick1', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'pick2', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'pick2', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'pick2', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'pick3', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'pick3', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'pick3', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'dog game', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'dog game', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'dog game', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )
                        }}
                        keyExtractor={item => JSON.stringify(item)}
                      />
                    </View>
                  </View>
                </Animated.ScrollView>
              </View>
            ) : this.props.seasonStatus === 'CHAMPIONSHIP' ? (
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: noir,
                  borderBottomWidth: 1,
                }}>
                {/* players */}
                <Animated.ScrollView
                  // pointerEvents="none"
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={[styles.fill, { transform: [{ translateY: headerTranslate }] }]}
                  bounces={false}
                  contentInset={{
                    top: 0,
                  }}
                  contentOffset={{
                    y: 0,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 0.4,
                      alignItems: 'center',
                      height: 60,
                    }}>
                    <Text
                      style={{
                        width: 0,
                        height: 50,
                        color: '#edd798',
                        fontFamily: 'Arial',
                        fontSize: RFValue(14),
                        fontWeight: '400',
                        marginLeft: 10,
                      }}></Text>
                    <Text
                      style={{
                        width: RFValue(150),
                        color: '#edd798',
                        fontFamily: 'Arial',
                        fontSize: RFValue(11),
                        fontWeight: '500',
                        marginLeft: 0,
                      }}>
                      PLAYERS
                    </Text>
                  </View>
                  {/* this.state.usersGroup */}
                  {this.state.usersGroup.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this.props.getHerParlays(item.user._id, this.props.token)
                        this.props.setHerInfoUser(item.user)
                        this.props.navigation.navigate('ProfileStatistics')
                      }}
                      style={{
                        //borderRightColor: "rgba(255,255,255,0.05)",
                        //borderRightWidth: 4,
                        alignItems: 'center',
                        backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      {Platform.OS === 'ios' && (
                        <View
                          style={{
                            width: RFValue(125),
                            position: 'absolute',
                            top: 0,
                            left: -10,
                            backgroundColor: index % 2 == 0 ? '#191919' : '#282828',

                            shadowColor: '#000',
                            shadowOffset: {
                              width: 5,
                              height: 8,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            height: 60,
                            elevation: 7,
                          }}
                        />
                      )}
                      <Text
                        style={{
                          width: RFValue(150),
                          color: jaune,
                          fontFamily: 'Arial',
                          fontSize: RFValue(10),
                          fontWeight: '400',
                          marginLeft: RFValue(40),
                          paddingVertical: 5,
                        }}>
                        {/* {`Game ${index + 1} (${25 - index * 5})`} */}
                        {item.user.username.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.ScrollView>

                <Animated.ScrollView
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  style={styles.fill}
                  scrollEventThrottle={1}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
                    useNativeDriver: true,
                  })}
                  // iOS offset for RefreshControl
                  contentInset={{
                    top: 0,
                  }}
                  contentOffset={{
                    y: 0,
                  }}>
                  <View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={this.state.visible}
                      onRequestClose={() => {
                        this._hideModal()
                      }}>
                      <View
                        style={{
                          alignSelf: 'center',
                          marginTop: 50,
                          height: this.state.selected && this.state.selected.game ? 550 : 100,
                          width: 300,
                          backgroundColor: '#fff',
                        }}>
                        <TouchableOpacity
                          onPress={this._hideModal}
                          style={{ padding: 10, position: 'absolute', top: 10, right: 10, zIndex: 999 }}>
                          <Text style={{ color: 'red' }}>Close</Text>
                        </TouchableOpacity>
                        {this.state.selected && !this.state.selected.game && (
                          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 20 }}>{'No Game Found'}</Text>
                          </View>
                        )}
                        {this.state.selected && this.state.selected.game && (
                          <View style={{ padding: 20, marginTop: 30 }}>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: '#eee',
                                padding: 10,
                                marginBottom: 10,
                              }}>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Game '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Game}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Spread '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Spread}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Over/Under '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.ou}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Away Team '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.AwayTeam}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Home Team '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.HomeTeam}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Fave '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.Fave}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Dog '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.Dog}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: '#eee',
                                padding: 10,
                              }}>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Bet on '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.betMethod.value.toUpperCase()}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Fav. Score '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.FavoriteScore}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Dog Score '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.UnderdogScore}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'O/U result '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.ou_score}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Score diff. '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.FavoriteScore - this.state.selected.game.UnderdogScore}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Win'}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.win ? 'Yes' : 'No'}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Points'}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.points}
                                </Text>
                              </View>
                            </View>
                            <Text
                              style={{
                                fontSize: 10,
                                marginTop: 10,
                                color: 'orange',
                              }}>{`NB: Favorite or Dog team is based on the spread.\nif spread is negative (<0) Home team is favorite else Away team is favorite\n\nSource: https://sportsdata.io`}</Text>
                          </View>
                        )}
                      </View>
                    </Modal>

                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 60,
                          alignItems: 'center',
                        }}>
                        {/*    {this.state.usersGroup.map((item, index) => (
                          <View>
                          <Text
                              style={{
                                width: RFValue(150),
                                color: '#edd798',
                                fontFamily: 'Arial',
                                fontSize: RFValue(10),
                                fontWeight: '900',
                                marginLeft: 20,
                              }}>
                              {item.user.username.toUpperCase()}
                            </Text>

                     <View
                              onPress={() => {}}
                              style={{
                                height: 60,
                                alignItems: 'center',
                                backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 1', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 1', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 1', this.state.week)}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 2', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 2', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 2', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 3', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 3', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 3', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 4', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 4', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 4', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 5', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 5', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 5', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                            </View> 
                          </View>
                        ))}
*/}
                        <Text
                          style={{
                            width: RFValue(60),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(10),
                            fontWeight: '900',
                            marginLeft: 20,
                          }}>
                          {'POINTS'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(10),
                            fontWeight: '900',
                            marginLeft: 20,
                          }}>
                          {'GAME 1 (25)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'GAME 2 (20)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'GAME 3 (15)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'GAME 4 (10)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'GAME 5 (5)'}
                        </Text>
                      </View>
                      {/* <FlatList
                        style={{ marginTop: -0.1 }}
                        bounces={false}
                        data={this.state.usersGroup[index]}
                        renderItem={({ item, index }) => {
                          let rest = this.state.usersGroup[index].results
                          return (
                            <View
                              onPress={() => {}}
                              style={{
                                flexDirection: 'row',
                                height: 60,
                                alignItems: 'center',
                                backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                              }}>
                              <View
                                style={{
                                  backgroundColor: 'rgba(0,0,0,.0)',
                                  width: 10,
                                  height: 40,
                                  shadowColor: '#000',
                                  shadowOffset: {
                                    width: 1,
                                    height: 1,
                                  },
                                  shadowOpacity: 0.58,
                                  shadowRadius: 16.0,

                                  elevation: 24,
                                }}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 1', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 1', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 1', this.state.week)}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 2', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 2', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 2', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 3', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 3', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 3', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 4', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 4', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 4', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 5', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 5', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 5', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )
                        }}
                        keyExtractor={item => JSON.stringify(item)}
                      /> */}

                      {this.state.usersGroup.map((item, index) => {
                        let rest = this.state.usersGroup[index].results
                        return (
                          <View
                            onPress={() => {}}
                            style={{
                              height: 60,
                              alignItems: 'center',
                              flexDirection: 'row',
                              backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                            }}>
                            <View
                              style={{
                                backgroundColor: 'rgba(0,0,0,.0)',
                                width: 10,
                                height: 40,
                                shadowColor: '#000',
                                shadowOffset: {
                                  width: 1,
                                  height: 1,
                                },
                                shadowOpacity: 0.58,
                                shadowRadius: 16.0,

                                elevation: 24,
                              }}
                            />
                            {/* <Text>{item.user.username.toUpperCase()}</Text> */}
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ selected: this.getGameResult(rest, 'game 1', this.state.week) }, () => {
                                  this._showModal()
                                })
                              }}>
                              <Text
                                style={{
                                  width: RFValue(60),
                                  color: '#fff',
                                  fontFamily: 'Arial',
                                  fontSize: RFValue(9),
                                  fontWeight: '600',
                                  marginLeft: 12,
                                }}>
                                {item.total}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ selected: this.getGameResult(rest, 'game 1', this.state.week) }, () => {
                                  this._showModal()
                                })
                              }}>
                              <Text
                                style={{
                                  width: RFValue(150),
                                  color: this.isGameWin(item.results, 'game 1', this.state.week),
                                  fontFamily: 'Arial',
                                  fontSize: RFValue(9),
                                  fontWeight: '400',
                                  marginLeft: 10,
                                }}>
                                {this.game(item.results, 'game 1', this.state.week)}
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ selected: this.getGameResult(rest, 'game 2', this.state.week) }, () => {
                                  this._showModal()
                                })
                              }}>
                              <Text
                                style={{
                                  width: RFValue(150),
                                  color: this.isGameWin(item.results, 'game 2', this.state.week),
                                  fontFamily: 'Arial',
                                  fontSize: RFValue(9),
                                  fontWeight: '400',
                                  marginLeft: 10,
                                }}>
                                {this.game(item.results, 'game 2', this.state.week)}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ selected: this.getGameResult(rest, 'game 3', this.state.week) }, () => {
                                  this._showModal()
                                })
                              }}>
                              <Text
                                style={{
                                  width: RFValue(150),
                                  color: this.isGameWin(item.results, 'game 3', this.state.week),
                                  fontFamily: 'Arial',
                                  fontSize: RFValue(9),
                                  fontWeight: '400',
                                  marginLeft: 10,
                                }}>
                                {this.game(item.results, 'game 3', this.state.week)}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ selected: this.getGameResult(rest, 'game 4', this.state.week) }, () => {
                                  this._showModal()
                                })
                              }}>
                              <Text
                                style={{
                                  width: RFValue(150),
                                  color: this.isGameWin(item.results, 'game 4', this.state.week),
                                  fontFamily: 'Arial',
                                  fontSize: RFValue(9),
                                  fontWeight: '400',
                                  marginLeft: 10,
                                }}>
                                {this.game(item.results, 'game 4', this.state.week)}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ selected: this.getGameResult(rest, 'game 5', this.state.week) }, () => {
                                  this._showModal()
                                })
                              }}>
                              <Text
                                style={{
                                  width: RFValue(150),
                                  color: this.isGameWin(item.results, 'game 5', this.state.week),
                                  fontFamily: 'Arial',
                                  fontSize: RFValue(9),
                                  fontWeight: '400',
                                  marginLeft: 10,
                                }}>
                                {this.game(item.results, 'game 5', this.state.week)}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                </Animated.ScrollView>
              </View>
            ) : this.props.seasonStatus === 'BOWLSEASON' ? (
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: noir,
                  borderBottomWidth: 1,
                }}>
                {/* players */}
                <Animated.ScrollView
                  // pointerEvents="none"
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={[styles.fill, { transform: [{ translateY: headerTranslate }] }]}
                  bounces={false}
                  contentInset={{
                    top: 0,
                  }}
                  contentOffset={{
                    y: 0,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 0.4,
                      alignItems: 'center',
                      height: 60,
                    }}>
                    <Text
                      style={{
                        width: 0,
                        height: 50,
                        color: '#edd798',
                        fontFamily: 'Arial',
                        fontSize: RFValue(14),
                        fontWeight: '400',
                        marginLeft: 10,
                      }}></Text>
                    <Text
                      style={{
                        width: RFValue(150),
                        color: '#edd798',
                        fontFamily: 'Arial',
                        fontSize: RFValue(11),
                        fontWeight: '500',
                        marginLeft: 0,
                      }}>
                      PLAYERS
                    </Text>
                  </View>
                  {/* this.state.usersGroup */}
                  {this.state.usersGroup.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this.props.getHerParlays(item.user._id, this.props.token)
                        this.props.setHerInfoUser(item.user)
                        this.props.navigation.navigate('ProfileStatistics')
                      }}
                      style={{
                        //borderRightColor: "rgba(255,255,255,0.05)",
                        //borderRightWidth: 4,
                        alignItems: 'center',
                        backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      {Platform.OS === 'ios' && (
                        <View
                          style={{
                            width: RFValue(125),
                            position: 'absolute',
                            top: 0,
                            left: -10,
                            backgroundColor: index % 2 == 0 ? '#191919' : '#282828',

                            shadowColor: '#000',
                            shadowOffset: {
                              width: 5,
                              height: 8,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            height: 60,
                            elevation: 7,
                          }}
                        />
                      )}
                      <Text
                        style={{
                          width: RFValue(150),
                          color: jaune,
                          fontFamily: 'Arial',
                          fontSize: RFValue(10),
                          fontWeight: '400',
                          marginLeft: RFValue(40),
                          paddingVertical: 5,
                        }}>
                        {/* {`Game ${index + 1} (${25 - index * 5})`} */}
                        {item.user.username.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.ScrollView>

                <Animated.ScrollView
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  style={styles.fill}
                  scrollEventThrottle={1}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
                    useNativeDriver: true,
                  })}
                  // iOS offset for RefreshControl
                  contentInset={{
                    top: 0,
                  }}
                  contentOffset={{
                    y: 0,
                  }}>
                  <View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={this.state.visible}
                      onRequestClose={() => {
                        this._hideModal()
                      }}>
                      <View
                        style={{
                          alignSelf: 'center',
                          marginTop: 50,
                          height: this.state.selected && this.state.selected.game ? 550 : 100,
                          width: 300,
                          backgroundColor: '#fff',
                        }}>
                        <TouchableOpacity
                          onPress={this._hideModal}
                          style={{ padding: 10, position: 'absolute', top: 10, right: 10, zIndex: 999 }}>
                          <Text style={{ color: 'red' }}>Close</Text>
                        </TouchableOpacity>
                        {this.state.selected && !this.state.selected.game && (
                          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 20 }}>{'No Game Found'}</Text>
                          </View>
                        )}
                        {this.state.selected && this.state.selected.game && (
                          <View style={{ padding: 20, marginTop: 30 }}>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: '#eee',
                                padding: 10,
                                marginBottom: 10,
                              }}>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Game '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Game}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Spread '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Spread}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Over/Under '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.ou}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Away Team '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.AwayTeam}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Home Team '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.HomeTeam}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Fave '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.Fave}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Dog '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.Dog}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: '#eee',
                                padding: 10,
                              }}>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Bet on '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.betMethod.value.toUpperCase()}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Fav. Score '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.FavoriteScore}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Dog Score '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.UnderdogScore}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'O/U result '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.ou_score}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Score diff. '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.FavoriteScore - this.state.selected.game.UnderdogScore}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Win'}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.win ? 'Yes' : 'No'}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Points'}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.points}
                                </Text>
                              </View>
                            </View>
                            <Text
                              style={{
                                fontSize: 10,
                                marginTop: 10,
                                color: 'orange',
                              }}>{`NB: Favorite or Dog team is based on the spread.\nif spread is negative (<0) Home team is favorite else Away team is favorite\n\nSource: https://sportsdata.io`}</Text>
                          </View>
                        )}
                      </View>
                    </Modal>

                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 60,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            width: RFValue(60),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(12),
                            fontWeight: '900',
                            marginLeft: 20,
                          }}>
                          {'Points'}
                        </Text>
                        {this.state.bowlList.map((m, i) => {
                          return (
                            <Text
                              style={{
                                width: 165,
                                color: '#edd798',
                                fontFamily: 'Arial',
                                fontSize: RFValue(12),
                                fontWeight: '900',
                                marginRight: 4,
                                // backgroundColor: '#fff',
                                textAlign: 'center',
                              }}>
                              {`${m.substring(0, 20)}`}
                            </Text>
                          )
                        })}
                      </View>

                      {this.state.usersGroup.map((item, index) => {
                        let rest = this.state.usersGroup[index].results
                        return (
                          <View
                            onPress={() => {}}
                            style={{
                              height: 60,
                              alignItems: 'center',
                              flexDirection: 'row',
                              backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                            }}>
                            <View
                              style={{
                                backgroundColor: 'rgba(0,0,0,.0)',
                                width: 10,
                                height: 40,
                                shadowColor: '#000',
                                shadowOffset: {
                                  width: 1,
                                  height: 1,
                                },
                                shadowOpacity: 0.58,
                                shadowRadius: 16.0,

                                elevation: 24,
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ selected: this.getGameResult(rest, 'game 1', this.state.week) }, () => {
                                  this._showModal()
                                })
                              }}>
                              <Text
                                style={{
                                  width: RFValue(60),
                                  color: '#fff',
                                  fontFamily: 'Arial',
                                  fontSize: RFValue(12),
                                  fontWeight: '600',
                                  marginLeft: 12,
                                }}>
                                {item.total}
                              </Text>
                            </TouchableOpacity>

                            {this.state.bowlList.map((m, i) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.setState({ selected: this.getGameResultBowl(rest, m, BOWLWEEK) }, () => {
                                      this._showModal()
                                    })
                                  }}
                                  style={{ marginRight: 4 }}>
                                  <Text
                                    style={{
                                      width: 150,
                                      color: this.isGameWinBowl(item.results, m, BOWLWEEK),
                                      fontFamily: 'Arial',
                                      fontSize: RFValue(12),
                                      fontWeight: '600',
                                      marginLeft: 15,

                                      textAlign: 'center',
                                    }}>
                                    {this.gameBowl(item.results, m, BOWLWEEK)}
                                  </Text>
                                </TouchableOpacity>
                              )
                            })}
                          </View>
                        )
                      })}
                    </View>
                  </View>
                </Animated.ScrollView>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: noir,
                  borderBottomWidth: 1,
                }}>
                <Animated.ScrollView
                  // pointerEvents="none"
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={[styles.fill, { transform: [{ translateY: headerTranslate }] }]}
                  bounces={false}
                  contentInset={{
                    top: 0,
                  }}
                  contentOffset={{
                    y: 0,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 0.4,
                      alignItems: 'center',
                      height: 60,
                    }}>
                    <Text
                      style={{
                        width: 0,
                        height: 50,
                        color: '#edd798',
                        fontFamily: 'Arial',
                        fontSize: RFValue(14),
                        fontWeight: '400',
                        marginLeft: 10,
                      }}></Text>
                    <Text
                      style={{
                        width: RFValue(150),
                        color: '#edd798',
                        fontFamily: 'Arial',
                        fontSize: RFValue(11),
                        fontWeight: '500',
                        marginLeft: 0,
                      }}>
                      PLAYERS
                    </Text>
                  </View>
                  {this.state.usersGroup.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this.props.getHerParlays(item.user._id, this.props.token)
                        this.props.setHerInfoUser(item.user)
                        this.props.navigation.navigate('ProfileStatistics')
                      }}
                      style={{
                        //borderRightColor: "rgba(255,255,255,0.05)",
                        //borderRightWidth: 4,
                        alignItems: 'center',
                        backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      {Platform.OS === 'ios' && (
                        <View
                          style={{
                            width: RFValue(125),
                            position: 'absolute',
                            top: 0,
                            left: -10,
                            backgroundColor: index % 2 == 0 ? '#191919' : '#282828',

                            shadowColor: '#000',
                            shadowOffset: {
                              width: 5,
                              height: 8,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            height: 60,
                            elevation: 7,
                          }}
                        />
                      )}
                      <Text
                        style={{
                          width: RFValue(150),
                          color: jaune,
                          fontFamily: 'Arial',
                          fontSize: RFValue(10),
                          fontWeight: '400',
                          marginLeft: RFValue(40),
                          paddingVertical: 5,
                        }}>
                        #{item.user.username.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.ScrollView>
                <Animated.ScrollView
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  style={styles.fill}
                  scrollEventThrottle={1}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
                    useNativeDriver: true,
                  })}
                  // iOS offset for RefreshControl
                  contentInset={{
                    top: 0,
                  }}
                  contentOffset={{
                    y: 0,
                  }}>
                  <View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={this.state.visible}
                      onRequestClose={() => {
                        this._hideModal()
                      }}>
                      <View
                        style={{
                          alignSelf: 'center',
                          marginTop: 50,
                          height: this.state.selected && this.state.selected.game ? 550 : 100,
                          width: 300,
                          backgroundColor: '#fff',
                        }}>
                        <TouchableOpacity
                          onPress={this._hideModal}
                          style={{ padding: 10, position: 'absolute', top: 10, right: 10, zIndex: 999 }}>
                          <Text style={{ color: 'red' }}>Close</Text>
                        </TouchableOpacity>
                        {this.state.selected && !this.state.selected.game && (
                          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 20 }}>{'No Game Found'}</Text>
                          </View>
                        )}
                        {this.state.selected && this.state.selected.game && (
                          <View style={{ padding: 20, marginTop: 30 }}>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: '#eee',
                                padding: 10,
                                marginBottom: 10,
                              }}>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Game '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Game}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Spread '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Spread}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Over/Under '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.ou}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Away Team '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.AwayTeam}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Home Team '}</Text>
                                <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.HomeTeam}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Fave '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.Fave}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Dog '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.Dog}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: '#eee',
                                padding: 10,
                              }}>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Bet on '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.betMethod.value.toUpperCase()}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Fav. Score '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.FavoriteScore}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Dog Score '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.UnderdogScore}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'O/U result '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.ou_score}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Score diff. '}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.game.FavoriteScore - this.state.selected.game.UnderdogScore}
                                </Text>
                              </View>

                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Win'}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.win ? 'Yes' : 'No'}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 12 }}>{'Points'}</Text>
                                <Text style={{ flex: 3, fontSize: 12, fontWeight: '700' }}>
                                  : {this.state.selected.points}
                                </Text>
                              </View>
                            </View>
                            <Text
                              style={{
                                fontSize: 10,
                                marginTop: 10,
                                color: 'orange',
                              }}>{`NB: Favorite or Dog team is based on the spread.\nif spread is negative (<0) Home team is favorite else Away team is favorite\n\nSource: https://sportsdata.io`}</Text>
                          </View>
                        )}
                      </View>
                    </Modal>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 60,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(10),
                            fontWeight: '900',
                            marginLeft: 20,
                          }}>
                          {'GAME 1 (25)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'GAME 2 (20)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'GAME 3 (15)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'GAME 4 (10)'}
                        </Text>
                        <Text
                          style={{
                            width: RFValue(150),
                            color: '#edd798',
                            fontFamily: 'Arial',
                            fontSize: RFValue(11),
                            fontWeight: '900',
                            marginLeft: 10,
                          }}>
                          {'GAME 5 (5)'}
                        </Text>
                      </View>
                      <FlatList
                        style={{ marginTop: -0.1 }}
                        bounces={false}
                        data={this.state.usersGroup}
                        renderItem={({ item, index }) => {
                          let rest = this.state.usersGroup[index].results
                          return (
                            <View
                              onPress={() => {}}
                              style={{
                                flexDirection: 'row',
                                height: 60,
                                alignItems: 'center',
                                backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                              }}>
                              <View
                                style={{
                                  backgroundColor: 'rgba(0,0,0,.0)',
                                  width: 10,
                                  height: 40,
                                  shadowColor: '#000',
                                  shadowOffset: {
                                    width: 1,
                                    height: 1,
                                  },
                                  shadowOpacity: 0.58,
                                  shadowRadius: 16.0,

                                  elevation: 24,
                                }}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 1', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 1', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 1', this.state.week)}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 2', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 2', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 2', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 3', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 3', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 3', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 4', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 4', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 4', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    { selected: this.getGameResult(rest, 'game 5', this.state.week) },
                                    () => {
                                      this._showModal()
                                    },
                                  )
                                }}>
                                <Text
                                  style={{
                                    width: RFValue(150),
                                    color: this.isGameWin(item.results, 'game 5', this.state.week),
                                    fontFamily: 'Arial',
                                    fontSize: RFValue(9),
                                    fontWeight: '400',
                                    marginLeft: 10,
                                  }}>
                                  {this.game(item.results, 'game 5', this.state.week)}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )
                        }}
                        keyExtractor={item => JSON.stringify(item)}
                      />
                    </View>
                  </View>
                </Animated.ScrollView>
              </View>
            )}
          </View>
        )}

        {this.props.seasonStatus === 'PREPARING' && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 100,
            }}>
            <Text style={{ color: jaune, fontSize: 16 }}>SEASON {this.props.currentYear} IS NOT STARTED YET</Text>
          </View>
        )}

        <ActionSheet
          ref={o => (this.group_ = o)}
          title={'Select the conference.'}
          options={this.state.groupsCfgl.map(i => i.name).concat(['Cancel'])}
          cancelButtonIndex={this.state.groupsCfgl.length}
          // destructiveButtonIndex={1}
          onPress={index => {
            if (index != this.state.groupsCfgl.length) {
              this.setState({ group: this.state.groupsCfgl[index], players: [] }, () => {
                this.setState({
                  usersGroup: this.state.players.filter(p => p.user.group === this.state.group._id),
                })

                this.getAllPlayersAndGroup(
                  this.state.group._id,
                  this.state.week,
                  this.props.currentYear + '',
                  this.props.token,
                )
              })
            }
          }}
        />
        <ActionSheet
          ref={o => (this.week_ = o)}
          title={'Select week.'}
          options={weekList.map(i => i)}
          cancelButtonIndex={weekList.length - 1}
          // destructiveButtonIndex={1}
          onPress={index => {
            if (index != weekList.length - 1)
              this.setState({
                week: index + 1,
                players: [],
              })
            this.getAllPlayersAndGroup(
              this.props.user.group._id,
              `${index + 1}`,
              this.props.currentYear + '',
              this.props.token,
            )
          }}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  fill: {
    //height: 1300
    //backgroundColor: "blue"
  },
  fill2: {
    flex: 1,
    backgroundColor: 'red',
  },
  content: {
    flex: 1,
  },
  header: {
    flex: 1,
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // backgroundColor: "#03A9F4",
    // overflow: "hidden",
    //height: HEADER_MAX_HEIGHT
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 28 : 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    // paddingTop: Platform.OS !== "ios" ? HEADER_MAX_HEIGHT : 0
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

class MyPicks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      isSwitchOn: false,
    }
  }
  render() {
    const { name, group, showGroup, showWeek, week } = this.props
    return (
      <View
        style={{
          width: '90%',

          backgroundColor: noir,
          paddingVertical: 20,
          padding: 20,
          margin: 20,
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: jaune,
            borderBottomWidth: 1,
          }}>
          <Text style={{ color: jaune, fontSize: RFValue(15), fontWeight: 'bold' }}>{name.toUpperCase()}</Text>
        </View>

        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={showGroup}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',

              marginVertical: 20,
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',

                backgroundColor: gris,
                alignItems: 'center',

                marginHorizontal: 5,
                paddingLeft: 10,
                paddingRight: 10,
                height: RFValue(50),
              }}>
              <Text style={{ color: jaune, fontSize: RFValue(12), fontWeight: '400' }}>
                {group.length > 15 ? group.substring(0, 15) + '.' : group}
              </Text>
              <Ionicons name={'ios-arrow-down'} color={jaune} size={RFValue(20)} style={{ marginRight: 10 }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showWeek}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',

              marginVertical: 20,
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',

                marginHorizontal: 5,
                backgroundColor: gris,
                alignItems: 'center',
                paddingLeft: 10,
                paddingRight: 10,
                height: RFValue(50),
              }}>
              <Text style={{ color: jaune, fontSize: RFValue(12), fontWeight: '400' }}>{'Week ' + week}</Text>
              <Ionicons name={'ios-arrow-down'} color={jaune} size={RFValue(20)} style={{ marginLeft: 10 }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { user, token } = state.user
  const { currentYear, currentWeek, statusGame, weekstartdate, seasonStatus } = state.game
  return {
    user,
    token,
    statusGame,
    currentYear,
    currentWeek,
    weekstartdate,
    seasonStatus,
  }
}
export default connect(mapStateToProps, {
  setGameStatus,
  setHerInfoUser,
  getHerParlays,
})(PickSheet)
