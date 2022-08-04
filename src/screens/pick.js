import React, { Component } from 'react'
import { View, ScrollView, TouchableOpacity, RefreshControl, Text, StatusBar, StyleSheet } from 'react-native'
import { Switch } from 'react-native-paper'
import { Ionicons } from 'react-native-vector-icons'
import { MyPicks, MyGames } from '../components'
import { connect } from 'react-redux'
import { logoutUser } from '../redux/actions/user'
import { Popover, PopoverController } from 'react-native-modal-popover'
import Championship from './championship'
import { KEYAPI, SERVER } from '../redux/actionTypes'
import axios from 'axios'
import { ONSIGNAL_KEY, ONSIGNAL_REST_API_KEY } from '@env'
import {
  getCurrentWeekGame,
  saveBet,
  updateBet,
  saveParlay,
  deleteParlay,
  getBets,
  myParlays,
  setGameStatus,
} from '../redux/actions/game'
import { jaune, gris } from '../styles/colors'
import { gameString } from '../utils/functions'
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

let day = new Date().getDay()
let hour = new Date().getHours()

// axios
//   .post(`https://onesignal.com/api/v1/notifications`, {
//     app_id: "74416f38-2669-4995-901b-b1a23849a885",
//     contents: { "en": "English Message" },
//     include_player_ids: ["f04a80df-5fff-425c-b906-91aa86d86014"]
//   }, {
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//       "Authorization": "Basic NDg1MzUyNjQtNTIxMC00NTQ0LWI4YmUtNTY1YjVhNDBmMDMx"
//     },
//   })
//   .then(function (response) {
//     // handle success
//     console.log("Response:");
//     console.log(JSON.stringify(response));
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(JSON.stringify(error));
//     //dispatch({type: SET_USER, user: user});
//   });

class Pick extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newBet: {},
      off: false,
      isSwitchOn:
        this.props.myParlay && this.props.myParlay.filter(i => i.week === this.props.currentWeek).length == 1
          ? true
          : false,
      checked: false,
      visible: false,
      refreshing: false,
      types: [
        {
          value: 'power game',
          label: 'Power conference',
          point: 10,
        },
        {
          value: 'binding game',
          label: 'Binding conference',
          point: 10,
        },
        { value: 'pick1', label: 'Free pick #1', point: 7 },
        { value: 'pick2', label: 'Free pick #2', point: 7 },
        { value: 'pick3', label: 'Free pick #3', point: 7 },
        { value: 'dog game', label: 'dog game', point: 0 },
      ],
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.statusGame !== this.props.statusGame &&
      this.props.statusGame === 'SUCCESS_BET_CREATE'
      //|| this.props.statusGame === "SUCCESS_BET_UPDATE"
    ) {
      this.props.getBets(this.props.user._id, this.props.currentWeek, this.props.token)
      let action = this.props.statusGame

      let pushIds = this.props.players
        .filter(
          a =>
            a.user.group === this.props.user.group._id &&
            a.user.pushUserId &&
            a.user.pushUserId !== this.props.user.pushUserId,
        )
        .map(b => b.user.pushUserId)

      this.props.setGameStatus('')

      //console.log(JSON.stringify(this.state.newBet, null, 2));
      if (this.state.newBet && this.state.newBet.game) {
        axios
          .post(
            `https://onesignal.com/api/v1/notifications`,
            {
              app_id: '74416f38-2669-4995-901b-b1a23849a885',
              //subtitle: { "en": `${this.props.user.username} last bet:` },
              contents: {
                en: `${gameString(this.state.newBet.game)} | ${this.state.newBet.type.value} | ${
                  this.state.newBet.method.label
                }`,
              },
              headings: {
                en: `${this.props.user.username} ${
                  action === 'SUCCESS_BET_CREATE' ? 'place a new bet' : ' update a bet'
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
            console.log(JSON.stringify(response))
          })
          .catch(function (error) {
            // handle error
            console.log(JSON.stringify(error))
            //dispatch({type: SET_USER, user: user});
          })
      }
    }
  }

  componentDidMount() {
    if (day === 0 || day === 1 || day === 4 || day === 5 || day === 6) {
      setInterval(() => {
        this.props.getBets(this.props.user._id, this.props.currentWeek, this.props.token)
      }, 30000)
    }

    this.props.getCurrentWeekGame(this.props.currentYear, this.props.currentWeek)

    this.props.getBets(this.props.user._id, this.props.currentWeek, this.props.token)
    this.props.myParlays(this.props.user._id, this.props.token)

    //console.log(JSON.stringify(this.props.bets.map(a => a.game.AwayScore), null, 2));

    if (day === 0 && hour > 10) {
      this.setState({ off: true })
    }

    if (day === 1) {
      this.setState({ off: true })
    }
  }

  saved = (bets, week, year, type) => {
    bets = bets ? bets : []
    let bet = bets.filter(i => i.week == week && i.season == year && i.type.value == type)
    if (bet.length > 0) {
      return bet[0]
    } else {
      return {
        game: {},
        method: {},
        locked: false,
        quickpick: false,
        saved: true,
      }
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    this.props.getCurrentWeekGame(this.props.currentYear, this.props.currentWeek)
    this.props.getBets(this.props.user._id, this.props.currentWeek, this.props.token)
    this.props.myParlays(this.props.user._id, this.props.token)
    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }

  render() {
    if (this.props.bowlSeason === false) {
      return (
        <ScrollView
          style={{
            flex: 1,
          }}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
          <StatusBar backgroundColor={gris} barStyle="light-content" />

          <View
            style={{
              alignItems: 'center',
              paddingTop: 20,
            }}>
            {/* <View
              style={{
                flexDirection: "row",
              }}>
              <Text style={{ color: jaune }}>
                {"Show as final or Live(For test)"}
              </Text>
              <View style={{ marginTop: -10 }}>
                <Checkbox.Android
                  status={this.state.checked ? "checked" : "unchecked"}
                  uncheckedColor={jaune}
                  color={"#fff"}
                  onPress={() => {
                    this.setState({ checked: !this.state.checked }, () => { });
                  }}
                />
              </View>
            </View> */}

            {this.state.types.map((item, index) => {
              this.save = this.saved(
                this.props.bets,
                this.props.currentWeek + '',
                this.props.currentYear + '',
                item.value,
              )

              if (
                this.save &&
                !this.save.saved &&
                this.save.game &&
                this.save.game.Status &&
                (this.save.game.Status === 'Final' || this.save.game.Status === 'InProgress')
                //this.state.checked == true
              ) {
                return (
                  <View key={index}>
                    <MyGames
                      live={true}
                      game={this.save.game}
                      parlay={
                        (item.value === 'pick1' || item.value === 'pick2' || item.value === 'pick3') &&
                        this.props.myParlay &&
                        this.props.myParlay.filter(i => i.week === this.props.currentWeek).length == 1
                      }
                      type={item.label}
                      method={this.save.method}
                      team2={this.save.game.AwayTeam}
                      pick={''}
                    />
                    {item.value === 'pick3' ? (
                      <TouchableOpacity
                        style={{
                          alignSelf: 'center',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 20,
                          marginBottom: 30,
                        }}>
                        <Switch value={this.state.isSwitchOn} color={jaune} style={{}} />
                        <TouchableOpacity onPress={() => {}}>
                          <Text style={{ color: jaune, marginLeft: 10 }}>PARLAY FREE PICKS</Text>
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
                                  Group free games together to win bonus points. Must win all games in parlay
                                </Text>
                              </Popover>
                            </React.Fragment>
                          )}
                        </PopoverController>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                )
              } else {
                return (
                  <View key={index}>
                    <MyPicks
                      key={index}
                      index={index}
                      name={item.label}
                      value={item.value}
                      favorites={
                        this.props.user && this.props.user.favorites
                          ? this.props.user.favorites.filter(i => i.Week === this.props.currentWeek)
                          : []
                      }
                      savedValue={this.saved(
                        this.props.bets,
                        this.props.currentWeek,
                        this.props.currentYear,
                        item.value,
                      )}
                      data={this.props.weekGames}
                      onChoose={data => {
                        data.type = item
                        data.week = `${this.props.currentWeek}`
                        data.season = `${this.props.currentYear}`
                        data.quickpick = data.quick
                        data.user = this.props.user._id
                        data.gameKey = data.game.GameKey

                        this.setState({ newBet: data })

                        if (data.game.GameKey && data.method.value) {
                          let be = this.saved(
                            this.props.bets,
                            this.props.currentWeek,
                            this.props.currentYear,
                            item.value,
                          )
                          if (be.game && be.game.HomeTeam && be.game.AwayTeam) {
                            // console.log("===================================");
                            //console.log(JSON.stringify(data, null, 2));
                            // console.log("===================================");

                            this.props.updateBet(be._id, data, this.props.user._id, this.props.token)
                            console.log('Update')
                          } else {
                            console.log('create')
                            //console.log(JSON.stringify(data,null,2));

                            this.props.saveBet(data, this.props.token)
                          }
                        }
                      }}
                    />
                    {item.value === 'pick3' ? (
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
                          onValueChange={() => {
                            if (!this.state.off) {
                              this.setState({ isSwitchOn: !this.state.isSwitchOn }, () => {
                                let ply = this.props.myParlay.filter(i => i.week === this.props.currentWeek)
                                if (this.props.myParlay && ply.length === 1) {
                                  this.props.deleteParlay(ply[0]._id, this.props.user._id, this.props.token)
                                } else {
                                  this.props.saveParlay(
                                    {
                                      week: this.props.currentWeek,
                                      user: this.props.user._id,
                                      uniqueId: `${this.props.user._id}-${this.props.currentWeek}`,
                                    },
                                    this.props.token,
                                  )
                                }
                              })
                            }
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            if (!this.state.off) {
                              this.setState({ isSwitchOn: !this.state.isSwitchOn }, () => {
                                let ply = this.props.myParlay.filter(i => i.week === this.props.currentWeek)
                                if (this.props.myParlay && ply.length === 1) {
                                  this.props.deleteParlay(ply[0]._id, this.props.user._id, this.props.token)
                                } else {
                                  this.props.saveParlay(
                                    {
                                      week: this.props.currentWeek,
                                      user: this.props.user._id,
                                      uniqueId: `${this.props.user._id}-${this.props.currentWeek}`,
                                    },
                                    this.props.token,
                                  )
                                }
                              })
                            }
                          }}>
                          <Text style={{ color: jaune, marginLeft: 10 }}>PARLAY FREE PICKS</Text>
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
    } else {
      return <Championship />
    }
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
  getBets,
  myParlays,
  setGameStatus,
})(Pick)
