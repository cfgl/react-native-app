import React, { Component } from 'react'
import { View, ScrollView, TouchableOpacity, RefreshControl, Text, StatusBar, StyleSheet } from 'react-native'
import { Switch } from 'react-native-paper'
import { Ionicons } from 'react-native-vector-icons'
import { MyChampionPicks, MyGames } from '../components'
import { connect } from 'react-redux'
import { logoutUser } from '../redux/actions/user'
import { Popover, PopoverController } from 'react-native-modal-popover'
import axios from 'axios'
import { getAllPlayers, myParlays, deleteParlay, saveParlay } from '../services/players'
import { getWeekGames, getMyBets, updateBet } from '../services/games'
import { ONSIGNAL_KEY, ONSIGNAL_REST_API_KEY } from '@env'
import {
  getCurrentWeekGame,
  saveBet,
  // updateBet,
  // saveParlay,
  // deleteParlay,
  // getBets,
  // myParlays,
  setGameStatus,
  setCurrentSeasonWeek,
} from '../redux/actions/game'
import { jaune, gris } from '../styles/colors'
import { gameString } from '../utils/functions'
import { CHAMIONSHIPWEEK } from '../utils/variables'
const styles = StyleSheet.create({
  app: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c2ffd2',
  },
  content: {
    padding: 16,
    backgroundColor: jaune,
    borderRadius: 8,
  },
  arrow: {
    borderTopColor: jaune,
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
})

const day = new Date().getDay()
const hour = new Date().getHours()

let CONF_ALREADY = ''
class Pick extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newBet: {},
      off: false,
      isSwitchOn:
        this.props.myParlay &&
        this.props.myParlay.filter(i => i.week === this.props.currentWeek && i.season === this.props.currentYear)
          .length === 1
          ? true
          : false,
      checked: false,
      visible: false,
      refreshing: false,
      types: [
        {
          value: 'game 1',
          label: 'Game 1 | 25 points',
          point: 25,
        },
        {
          value: 'game 2',
          label: 'Game 2 | 20 points',
          point: 20,
        },
        {
          value: 'game 3',
          label: 'Game 3 | 15 points',
          point: 15,
        },
        {
          value: 'game 4',
          label: 'Game 4 | 10 points',
          point: 10,
        },
        {
          value: 'game 5',
          label: 'Game 5 | 5 points',
          point: 5,
        },
      ],
      championshipGame: [],
      bets: [],
      weekGames: [],
      players: [],
      allMyParlays: [],
    }
    CONF_ALREADY = ''
  }

  async UNSAFE_componentWillMount() {
    if (day === 3 || day === 4 || day === 5 || day === 6) {
      this.timeInterval = setInterval(() => {
        this.gamesAndBets()
      }, 2 * 60 * 1000)
    }

    //this.props.setCurrentSeasonWeek()

    const respGetPlayers = await getAllPlayers(null, this.props.currentYear + '', this.props.token)
    if (respGetPlayers && respGetPlayers.data) {
      console.log(respGetPlayers.data.length)
      this.setState({ players: respGetPlayers.data })
    }
  }

  async componentDidMount() {
    this.gamesAndBets()
  }

  gamesAndBets = async () => {
    this.props.setCurrentSeasonWeek()
    this.props.getCurrentWeekGame(this.props.currentYear, this.props.currentWeek)
    const respGetWeekGames = await getWeekGames(this.props.currentYear, this.props.currentWeek)
    if (respGetWeekGames && respGetWeekGames.data) {
      let datas = respGetWeekGames.data.map(m => {
        m.AwayTeamInfo = getTeamById(m.AwayTeamID)
        m.HomeTeamInfo = getTeamById(m.HomeTeamID)

        return m
      })

      datas = datas.sort(function (a, b) {
        return new Date(a.Day) - new Date(b.Day)
      })
      this.setState({ weekGames: datas })
    }

    const respGetMyBets = await getMyBets(this.props.user._id, this.props.currentWeek, this.props.token)
    if (respGetMyBets && respGetMyBets.data) {
      console.log('respGetMyBets', respGetMyBets.data.length)

      this.setState({ bets: respGetMyBets.data })
    }

    const respMyParlays = await myParlays(this.props.user._id, this.props.token)
    if (respMyParlays && respMyParlays.data) {
      console.log('respMyParlays', JSON.stringify(respMyParlays.data, null, 2))

      this.setState({
        allMyParlays: respMyParlays.data,
        isSwitchOn:
          respMyParlays.data.filter(i => i.week === this.props.currentWeek && i.season === this.props.currentYear)
            .length === 1
            ? true
            : false,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.statusGame !== this.props.statusGame &&
      this.props.statusGame === 'SUCCESS_BET_CREATE' &&
      this.props.currentWeek !== CHAMIONSHIPWEEK
    ) {
      let action = this.props.statusGame

      let pushIds = this.state.players
        .filter(
          a =>
            a.user.group === this.props.user.group._id &&
            a.user.pushUserId &&
            a.user.pushUserId !== this.props.user.pushUserId,
        )
        .map(b => b.user.pushUserId)

      this.props.setGameStatus('')
      this.gamesAndBets()
      // alert(JSON.stringify(pushIds))
      if (this.state.newBet && this.state.newBet.game) {
        axios
          .post(
            `https://onesignal.com/api/v1/notifications`,
            {
              app_id: ONSIGNAL_KEY,
              //subtitle: { "en": `${this.props.user.username} last bet:` },
              contents: {
                en: `${gameString(this.state.newBet.game)} | ${this.state.newBet.type.value} | ${
                  this.state.newBet.method.label
                }`,
              },
              headings: {
                en: `${this.props.user.username} ${
                  action === 'SUCCESS_BET_CREATE' ? ' made a pick' : ' update a pick'
                }`,
              },
              include_player_ids: pushIds,
            },
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Basic ' + ONSIGNAL_REST_API_KEY,
              },
            },
          )
          .then(function (response) {
            // handle success
            console.log('Response:')
            // console.log(JSON.stringify(response));
          })
          .catch(function (error) {
            // handle error
            console.log(JSON.stringify(error))
          })
      }
    } else if (
      prevProps.statusGame !== this.props.statusGame &&
      this.props.statusGame === 'SUCCESS_BET_UPDATE' &&
      this.props.currentWeek !== CHAMIONSHIPWEEK
    ) {
      this.gamesAndBets()
    }
  }

  componentWillUnmount() {
    if (this.timeInterval) {
      console.log('Clear timeInterval ')
      clearInterval(this.timeInterval)
    }
  }

  hasTakeBet = (bets, week, year, type) => {
    bets = bets ? bets : []
    let bet = bets.filter(i => i.week == week && i.season === year && i.type.value == type)
    if (bet.length > 0) {
      let game_ = this.state.weekGames.filter(f => f.GameID === bet[0].game.GameID)
      //console.log(game_.AwayTeamScore)
      if (game_.length > 0) {
        game__ = game_[0]
        bet[0].game.AwayTeamScore = game__.AwayTeamScore
        bet[0].game.HomeTeamScore = game__.HomeTeamScore
        bet[0].game.Status = game__.Status
      }

      return bet[0]
    } else {
      return {
        game: {},
        method: {},
        locked: false,
        quickpick: false,
        saved: false,
      }
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.gamesAndBets()

    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
        }}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
        <StatusBar backgroundColor={gris} barStyle="light-content" />
        <View
          style={{
            backgroundColor: gris,

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
              lineHeight: 40,
              textAlign: 'center',
              marginTop: 20,
            }}>
            {'Select 5 \nChampionship Games'}
          </Text>

          <Text
            style={{
              width: '84%',
              color: '#edd798',
              fontFamily: 'Monda',
              fontSize: 14,
              lineHeight: 24,
              marginTop: 10,
              textAlign: 'center',
              marginTop: 20,
            }}>
            {
              'Each game has a set amount of points ranging from 5 to 25 pts. You can always re-assign those points value later on.'
            }
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            paddingTop: 20,
          }}>
          {this.state.types.map((item, index) => {
            const takeBet = this.hasTakeBet(this.state.bets, this.props.currentWeek, this.props.currentYear, item.value)

            CONF_ALREADY = CONF_ALREADY.concat(
              '-' + takeBet.method && takeBet.method.conference && !CONF_ALREADY.includes(takeBet.method.conference)
                ? takeBet.method.conference + '-'
                : '',
            )
            console.log(CONF_ALREADY)
            // console.log(
            //   JSON.stringify(takeBet.game.Status ? 'OK-' + takeBet.game.Status : 'NOT -' + item.value, null, 2),
            // )

            const gameShowed =
              takeBet && !takeBet.saved && takeBet.game && takeBet.game.Status && takeBet.game.Status !== 'Scheduled'

            const blockParlay =
              item.value.includes('game') &&
              takeBet &&
              takeBet.game &&
              takeBet.game.Status &&
              takeBet.game.Status !== 'Scheduled'

            // console.log(blockParlay)

            if (this.state.off === false && blockParlay === true) {
              this.setState({ off: true })
            }
            if (gameShowed) {
              //Verify if game is in parlay
              const parlay =
                item.value.includes('game') &&
                this.state.allMyParlays &&
                this.state.allMyParlays.filter(
                  i => i.week === this.props.currentWeek && i.season === this.props.currentYear,
                ).length === 1
              // console.log('on MyGames ' + index)
              return (
                <View key={index}>
                  <MyGames live={true} game={takeBet.game} parlay={parlay} type={item.label} method={takeBet.method} />
                  {item.value === 'game 5' && this.state.off === true && (
                    <View
                      style={{
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                        marginBottom: 30,
                      }}>
                      <Switch value={this.state.isSwitchOn} color={jaune} disabled />
                      <View>
                        <Text style={{ color: jaune, marginLeft: 10 }}>PARLAY CHAMIONSHIP WEEK</Text>
                      </View>

                      <PopoverController>
                        {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                          <React.Fragment>
                            <Ionicons
                              name="ios-information-circle-outline"
                              size={24}
                              style={{ marginLeft: 10 }}
                              color={jaune}
                              ref={setPopoverAnchor}
                              onPress={openPopover}
                            />
                            <Popover
                              placement="top"
                              contentStyle={styles.content}
                              arrowStyle={styles.arrow}
                              backgroundStyle={styles.background}
                              visible={popoverVisible}
                              onClose={closePopover}
                              fromRect={popoverAnchorRect}
                              supportedOrientations={['portrait', 'landscape']}>
                              <Text style={{ width: 140, fontSize: 10 }}>
                                Group free games together to win bonus points. Must win all games in parlay
                              </Text>
                            </Popover>
                          </React.Fragment>
                        )}
                      </PopoverController>
                    </View>
                  )}

                  {item.value === 'game 5' && this.state.off === false && (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 20,
                      }}>
                      <Switch
                        value={this.state.isSwitchOn}
                        color={jaune}
                        style={{}}
                        onValueChange={async () => {
                          this.setState({ isSwitchOn: !this.state.isSwitchOn }, async () => {
                            let ply = this.state.allMyParlays.filter(
                              i => i.week === this.props.currentWeek && i.season === this.props.currentYear,
                            )
                            if (this.state.allMyParlays && ply.length === 1) {
                              const respDeleteParlay = await deleteParlay(ply[0]._id, this.props.token)
                              if (respDeleteParlay) {
                                console.log('respMyParlays', JSON.stringify(respDeleteParlay.data, null, 2))
                                this.gamesAndBets()
                              }
                            } else {
                              const respSaveParlay = await saveParlay(
                                {
                                  week: this.props.currentWeek,
                                  season: this.props.currentYear,
                                  user: this.props.user._id,
                                  uniqueId: `${this.props.user._id}-${this.props.currentWeek}`,
                                },
                                this.props.token,
                              )
                              if (respSaveParlay) {
                                console.log('respSaveParlay', JSON.stringify(respSaveParlay.data, null, 2))
                                this.gamesAndBets()
                              }
                            }
                          })
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ isSwitchOn: !this.state.isSwitchOn }, async () => {
                            let ply = this.state.allMyParlays.filter(
                              i => i.week === this.props.currentWeek && i.season === this.props.currentYear,
                            )
                            if (this.state.allMyParlays && ply.length === 1) {
                              const respDeleteParlay = await deleteParlay(ply[0]._id, this.props.token)
                              if (respDeleteParlay) {
                                console.log('respMyParlays', JSON.stringify(respDeleteParlay.data, null, 2))
                                this.gamesAndBets()
                              }
                            } else {
                              const respSaveParlay = await saveParlay(
                                {
                                  week: this.props.currentWeek,
                                  season: this.props.currentYear,
                                  user: this.props.user._id,
                                  uniqueId: `${this.props.user._id}-${this.props.currentWeek}`,
                                },
                                this.props.token,
                              )
                              if (respSaveParlay) {
                                console.log('respSaveParlay', JSON.stringify(respSaveParlay.data, null, 2))
                                this.gamesAndBets()
                              }
                            }
                          })
                        }}>
                        <Text style={{ color: jaune, marginLeft: 10 }}>PARLAY CHAMIONSHIP WEEK</Text>
                      </TouchableOpacity>
                      <PopoverController>
                        {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                          <React.Fragment>
                            <Ionicons
                              name="ios-information-circle-outline"
                              size={24}
                              style={{ marginLeft: 10 }}
                              color={jaune}
                              ref={setPopoverAnchor}
                              onPress={openPopover}
                            />
                            <Popover
                              placement="top"
                              contentStyle={styles.content}
                              arrowStyle={styles.arrow}
                              backgroundStyle={styles.background}
                              visible={popoverVisible}
                              onClose={closePopover}
                              fromRect={popoverAnchorRect}
                              supportedOrientations={['portrait', 'landscape']}>
                              <Text style={{ width: 140, fontSize: 10 }}>
                                Group free games together to win bonus points. Must win all free games to win parlay
                              </Text>
                            </Popover>
                          </React.Fragment>
                        )}
                      </PopoverController>
                    </TouchableOpacity>
                  )}
                </View>
              )
            } else {
              return (
                <View key={index}>
                  <MyChampionPicks
                    index={index}
                    name={item.label}
                    timeOver={this.state.weekGames.length === 0 || this.state.sending === true ? true : false}
                    favorites={
                      this.props.user && this.props.user.favoritesCFB
                        ? this.props.user.favoritesCFB.filter(
                            i => i.Week === this.props.currentWeek && this.props.currentYear.includes(i.Season + ''),
                          )
                        : []
                    }
                    hasTakeBet={takeBet}
                    //

                    game={takeBet.game}
                    method={takeBet.method}
                    quickpick={takeBet.quickpick}
                    locked={takeBet.locked}
                    //
                    data={this.state.weekGames}
                    selectedConf={CONF_ALREADY}
                    onChoose={async data => {
                      data.type = item
                      data.week = `${this.props.currentWeek}`
                      data.season = `${this.props.currentYear}`
                      data.quickpick = data.quick
                      data.user = this.props.user._id
                      data.gameKey = data.game && data.game.GameID ? data.game.GameID.toString() : ''
                      data.method.conference = data.conference
                      console.log('Key', data.gameKey)
                      console.log('method', data.method)
                      console.log('type', data.type)

                      this.setState({ newBet: data })

                      if (data.game.GameID && data.method.value) {
                        let be = this.hasTakeBet(
                          this.state.bets,
                          this.props.currentWeek,
                          this.props.currentYear,
                          item.value,
                        )

                        if (be.game && be.game.HomeTeam && be.game.AwayTeam) {
                          this.setState({ sending: true })

                          const respUpdateBet = await updateBet(be._id, data, this.props.token)

                          if (respUpdateBet && respUpdateBet.data._id) {
                            this.setState({ sending: false })
                            this.gamesAndBets()
                          }
                        } else {
                          console.log('create')
                          this.setState({ sending: true })
                          //console.log(JSON.stringify(data,null,2));
                          this.setState({ sending: false })
                          this.props.saveBet(data, this.props.token)
                          // setTimeout(() => {
                          //   this.gamesAndBets()
                          // }, 3000)
                        }
                      }
                    }}
                  />
                  {item.value === 'game 5' ? (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 20,
                      }}>
                      <Switch
                        value={this.state.isSwitchOn && this.props.seasonStatus !== 'PREPARING'}
                        color={jaune}
                        style={{}}
                        onValueChange={async () => {
                          if (!this.state.off) {
                            this.setState({ isSwitchOn: !this.state.isSwitchOn }, async () => {
                              let ply = this.state.allMyParlays.filter(
                                i => i.week === this.props.currentWeek && i.season === this.props.currentYear,
                              )
                              if (this.state.allMyParlays && ply.length === 1) {
                                const respDeleteParlay = await deleteParlay(ply[0]._id, this.props.token)
                                if (respDeleteParlay) {
                                  console.log('respMyParlays', JSON.stringify(respDeleteParlay.data, null, 2))
                                  this.gamesAndBets()
                                }
                              } else {
                                const respSaveParlay = await saveParlay(
                                  {
                                    week: this.props.currentWeek,
                                    season: this.props.currentYear,
                                    user: this.props.user._id,
                                    uniqueId: `${this.props.user._id}-${this.props.currentWeek}`,
                                  },
                                  this.props.token,
                                )
                                if (respSaveParlay) {
                                  console.log('respSaveParlay', JSON.stringify(respSaveParlay.data, null, 2))
                                  this.gamesAndBets()
                                }
                              }
                            })
                          }
                        }}
                      />
                      <TouchableOpacity
                        onPress={async () => {
                          if (!this.state.off) {
                            this.setState({ isSwitchOn: !this.state.isSwitchOn }, async () => {
                              let ply = this.state.allMyParlays.filter(
                                i => i.week === this.props.currentWeek && i.season === this.props.currentYear,
                              )
                              if (this.state.allMyParlays && ply.length === 1) {
                                const respDeleteParlay = await deleteParlay(ply[0]._id, this.props.token)
                                if (respDeleteParlay) {
                                  console.log('respMyParlays', JSON.stringify(respDeleteParlay.data, null, 2))
                                  this.gamesAndBets()
                                }
                              } else {
                                const respSaveParlay = await saveParlay(
                                  {
                                    week: this.props.currentWeek,
                                    season: this.props.currentYear,
                                    user: this.props.user._id,
                                    uniqueId: `${this.props.user._id}-${this.props.currentWeek}`,
                                  },
                                  this.props.token,
                                )
                                if (respSaveParlay) {
                                  console.log('respSaveParlay', JSON.stringify(respSaveParlay.data, null, 2))
                                  this.gamesAndBets()
                                }
                              }
                            })
                          }
                        }}>
                        <Text style={{ color: jaune, marginLeft: 10 }}>PARLAY CHAMIONSHIP WEEK</Text>
                      </TouchableOpacity>
                      <PopoverController>
                        {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                          <React.Fragment>
                            <Ionicons
                              name="ios-information-circle-outline"
                              size={24}
                              style={{ marginLeft: 10 }}
                              color={jaune}
                              ref={setPopoverAnchor}
                              onPress={openPopover}
                            />
                            <Popover
                              placement="top"
                              contentStyle={styles.content}
                              arrowStyle={styles.arrow}
                              backgroundStyle={styles.background}
                              visible={popoverVisible}
                              onClose={closePopover}
                              fromRect={popoverAnchorRect}
                              supportedOrientations={['portrait', 'landscape']}>
                              <Text style={{ width: 140, fontSize: 10 }}>
                                Group free games together to win bonus points. Must win all free games to win parlay
                              </Text>
                            </Popover>
                          </React.Fragment>
                        )}
                      </PopoverController>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )
            }
          })}
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  const { user, token, logged, bowlSeason } = state.user
  const { weekGames, bets, currentYear, players, currentWeek, myParlay, statusGame, weekstartdate, seasonStatus } =
    state.game
  return {
    user,
    bowlSeason,
    token,
    logged,
    weekGames,
    players,
    bets,
    currentYear,
    currentWeek,
    myParlay,
    statusGame,
    weekstartdate,
    seasonStatus,
  }
}
export default connect(mapStateToProps, {
  logoutUser,
  getCurrentWeekGame,
  saveBet,
  updateBet,
  saveParlay,
  deleteParlay,
  // getBets,
  myParlays,
  setGameStatus,
  setCurrentSeasonWeek,
})(Pick)
