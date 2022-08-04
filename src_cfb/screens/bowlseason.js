import React, { Component } from 'react'
import { View, Modal, Alert, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Text } from 'react-native'
import { Ionicons } from 'react-native-vector-icons'
import { noir, jaune, gris } from '../styles/colors'
import { SERVER } from '../redux/actionTypes'
import { BOWLWEEK, SCREEN_WIDTH } from '../utils/variables'
import { gameString } from '../utils/functions'
import axios from 'axios'
import _ from 'lodash'

import { connect } from 'react-redux'
import { updateUserInfo } from '../redux/actions/user'
import ActionSheet from 'react-native-actionsheet'
import { setCurrentSeasonWeek, setWeekDate, getCurrentWeekGame } from '../redux/actions/game'
import GameItem from '../components/gameItem'
import { Searchbar } from 'react-native-paper'
import { getWeekGames, getMyBets, updateBet } from '../services/games'

const methods = [
  { type: 'spread', label: 'Spread fave', value: 'fave', category: 'bowl' },
  { type: 'spread', label: 'Spread dog', value: 'dog', category: 'bowl' },
  { type: 'total', label: 'Total over', value: 'over', category: 'bowl' },
  { type: 'total', label: 'Total under', value: 'under', category: 'bowl' },
  { type: 'moneyLine', label: 'MoneyLine $line', value: '$line' },

  { type: '', label: '', value: 'Cancel', category: '' },
]

let datas = []

class BowlSeason extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: -1,
      data: [],
      bowlGame: [],
      selected: -1,
      refreshing: false,
      visible: false,
      firstQuery: '',
      selected: -1,
      weekGames: [],
    }
  }
  months = index => {
    switch (index) {
      case 0:
        return 'JAN'
      case 1:
        return 'FEB'
      case 2:
        return 'MAR'
      case 3:
        return 'AVR'
      case 4:
        return 'MAY'
      case 5:
        return 'JUN'
      case 6:
        return 'JUL'
      case 7:
        return 'AUG'
      case 8:
        return 'SEP'
      case 9:
        return 'OCT'
      case 10:
        return 'NOV'
      case 11:
        return 'DEC'

      default:
        return ''
    }
  }
  async componentDidMount() {
    const self = this
    axios
      .get(`https://cfgl-prod.herokuapp.com/bowl-games`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      })
      .then(function (response) {
        response.data.filter(async f => {
          const games = await axios(
            `https://api.sportsdata.io/v3/cfb/scores/json/GamesByDate/${f.gamedatestring}?key=4c5a4820d77e434e889918adcda8770b`,
          )

          let weekGames_ = self.state.weekGames

          self.setState({
            weekGames: _.concat(weekGames_, games.data)
              .filter(f => f.Season + '' === self.props.currentYear + '')
              .sort((a, b) => new Date(a.Day) - new Date(b.Day)),
          })
        })

        self.getAll()
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error))
      })
  }

  getAll = () => {
    const self = this

    axios
      .get(`${SERVER}/betscfbs?user=${this.props.user.id}&season=${this.props.currentYear}&week=${BOWLWEEK}`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      })
      .then(function (response) {
        // handle success

        if (response && response.data.filter(f => f.method.category === 'bowl').length > 0) {
          console.log(response.data)

          self.setState({
            bowlGame: response.data
              .filter(f => f.method.category === 'bowl')
              .filter(f => f.Season.toString() === this.props.currentYear.toString()),
          })
          console.log('Data has been load')
        } else {
          self.setState({ bowlGame: [] })
        }
        self.props.getCurrentWeekGame(self.props.currentYear, self.props.currentWeek)
      })
      .catch(function (error) {
        // handle error
        console.log(JSON.stringify(error))
      })
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    this.getAll()
    this.props.setCurrentSeasonWeek()
    this.props.setWeekDate()

    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }
  showTypeBet = () => {
    this.methodBet.show()
  }

  _showModal = () => this.setState({ visible: true })
  _hideModal = () => this.setState({ visible: false })

  onChoose = (data, i) => {
    const self = this
    data.type = {
      value: 'Bowl Game ' + i,
      label: `Bowl Game-${i} | ${i} points`,
      point: i,
    }
    data.week = `${BOWLWEEK}`
    data.locked = false
    data.season = `${this.props.currentYear}`
    data.quickpick = false
    data.user = this.props.user._id
    data.gameKey = data.game && data.game.GameID ? data.game.GameID.toString() : ''

    if (data.game.GameID && data.method.value) {
      console.log(JSON.stringify(data, null, 2))

      if (data._id) {
        axios
          .put(`${SERVER}/betscfbs/${data._id}`, data, {
            headers: {
              Authorization: `Bearer ${this.props.token}`,
            },
          })
          .then(response => {
            // console.log(JSON.stringify(response.data.game, null, 2))
            self.getAll()
            console.log('has been Update')
          })
          .catch(error => {
            // Handle error.
            console.log('An error occurred:', error)
          })
      } else {
        axios
          .post(`${SERVER}/betscfbs`, data, {
            headers: {
              Authorization: `Bearer ${this.props.token}`,
            },
          })
          .then(response => {
            // console.log(JSON.stringify(response.data, null, 2))
            self.getAll()
            console.log('has been create')
          })
          .catch(error => {
            // Handle error.
            console.log('An error occurred:', error)
          })
      }
    }
    // if (data.game.GameID && data.method.value) {
    //   data.method.conference = data.conference
    //   // console.log(JSON.stringify(data.gameKey, null, 2));
    //   let be = this.hasTakeBet(
    //     this.props.bets,
    //     this.props.currentWeek,
    //     this.props.currentYear,
    //     item.value,
    //   )
    //   if (be.game && be.game.HomeTeam && be.game.AwayTeam) {
    //     // console.log("===================================");
    //     //console.log(JSON.stringify(data, null, 2));
    //     // console.log("===================================");
    //     console.log('Update')
    //     this.props.updateBet(be._id, data, this.props.user._id, this.props.token)
    //   } else {
    //     console.log('create')
    //     //console.log(JSON.stringify(data,null,2));
    //     this.props.saveBet(data, this.props.token)
    //   }
    // }
  }

  deletePick = id => {
    let self = this
    axios
      .delete(`${SERVER}/betscfbs/${id}`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      })
      .then(response => {
        // console.log(JSON.stringify(response.data, null, 2))
        self.getAll()
        alert('Pick has been remove')
        console.log('has been delete')
      })
      .catch(error => {
        self.getAll()

        // Handle error.
        console.log('An error occurred:', error)
      })
  }
  render() {
    const rankList = Array.from(new Array(38), (x, i) => `${i + 1}`).concat(['Cancel'])

    if (this.props.weekGames.length > 0 && this.state.data.length === 0) {
      this.setState({ data: this.props.weekGames })
    }

    const { visible, firstQuery } = this.state
    return (
      <View style={{ flex: 1, width: '100%', marginTop: 0 }}>
        <View
          style={{
            height: 40,

            width: '100%',
            backgroundColor: '#edd798',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              color: '#191919',
              fontSize: 17,
              fontWeight: '700',
              lineHeight: 24,
            }}>
            {`Picks made:  ${this.state.bowlGame.length} of ${this.state.weekGames.length}`}
          </Text>
        </View>

        <ScrollView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          style={{ flex: 1, marginTop: 0, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: noir,
              paddingVertical: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: 39,
                fontWeight: '400',
                lineHeight: 45,
                textAlign: 'center',
              }}>
              {'Start by ordering'}
            </Text>
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: 39,
                fontWeight: '400',
                lineHeight: 45,
                textAlign: 'center',
              }}>
              {'the games from'}
            </Text>
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: 39,
                fontWeight: '400',
                lineHeight: 45,
                textAlign: 'center',
              }}>
              {this.state.weekGames.length > 0 ? `1 to ${this.state.weekGames.length}` : ''}
            </Text>
          </View>

          <Text
            style={{
              color: '#edd798',
              fontFamily: 'Monda',
              fontSize: 16,
              fontWeight: '400',
              lineHeight: 22,
              textAlign: 'center',
              padding: 20,
              marginVertical: 20,
            }}>
            {`Remember, your “${this.state.weekGames.length}” game is worth ${this.state.weekGames.length} points and your “1” game is worth 1 point. Your “15” game is worth 15 points, and so on and so forth. Simply drag the game to the position you want them.`}
          </Text>
          {/* <Text>{JSON.stringify(this.props.weekGames) + 'ooooooo'}</Text> */}
          {this.state.weekGames.map((item, index) => {
            let game = this.state.bowlGame.filter(f => f.type && f.type.point === index + 1)
            return (
              <Game
                item={item}
                index={index}
                selectedBowl={game[0] || this.state.bowlGame[index] || {}}
                getGame={() => {
                  this.setState({ selected: index }, () => {
                    this._showModal()
                  })
                }}
                onClear={() => {
                  Alert.alert('Clear Game', 'Do you realy want clear this pick?', [
                    {
                      text: 'No',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => {
                        if (game && game[0] && game[0]._id) {
                          this.deletePick(game[0]._id)
                        } else {
                          console.log(game)
                        }
                      },
                    },
                  ])
                }}
                method={() => {
                  this.setState({ selected: index }, () => {
                    this.showTypeBet()
                  })
                }}
              />
            )
          })}
        </ScrollView>

        <ActionSheet
          ref={o => (this.methodBet = o)}
          title={'Select method.'}
          options={methods.map(i => i.value)}
          cancelButtonIndex={methods.map(i => i.value).length - 1}
          onPress={index => {
            if (index !== methods.map(i => i.value).length - 1) {
              let self = this

              let bowlgame = this.state.bowlGame[this.state.selected] || {}

              bowlgame.method = methods[index]
              this.state.bowlGame[this.state.selected] = bowlgame

              this.setState({ bowlGame: this.state.bowlGame }, () => {
                if (
                  this.state.bowlGame[this.state.selected] &&
                  this.state.bowlGame[this.state.selected].game &&
                  this.state.bowlGame[this.state.selected].game.GameID &&
                  this.state.bowlGame[this.state.selected].method &&
                  this.state.bowlGame[this.state.selected].method.value
                ) {
                  console.log(this.state.bowlGame)
                  this.onChoose(this.state.bowlGame[this.state.selected], this.state.selected + 1)
                  // if (this.state.id !== -1) {
                  //   axios
                  //     .put(
                  //       `${SERVER}/bowl-game-users/${this.state.id}`,
                  //       {
                  //         games: this.state.bowlGame,
                  //       },
                  //       {
                  //         headers: {
                  //           Authorization: `Bearer ${this.props.token}`,
                  //         },
                  //       },
                  //     )
                  //     .then(response => {
                  //       console.log('has been Update')
                  //     })
                  //     .catch(error => {
                  //       // Handle error.
                  //       console.log('An error occurred:', error)
                  //     })
                  // } else {
                  //   axios
                  //     .post(
                  //       `${SERVER}/bowl-game-users`,
                  //       {
                  //         season: this.props.currentYear,
                  //         user: this.props.user.id,
                  //         games: this.state.bowlGame,
                  //       },
                  //       {
                  //         headers: {
                  //           Authorization: `Bearer ${this.props.token}`,
                  //         },
                  //       },
                  //     )
                  //     .then(response => {
                  //       if (response && response.data._id) {
                  //         self.setState({ bowlGame: response.data.games, id: response.data._id })
                  //       }
                  //       console.log('has been created')
                  //     })
                  //     .catch(error => {
                  //       // Handle error.
                  //       console.log('An error occurred:', error)
                  //     })
                  // }
                }
              })
            }
          }}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={visible}
          onDismiss={this._hideModal}
          style={{ backgroundColor: 'transparent' }}>
          <View
            style={{
              width: SCREEN_WIDTH,
              flex: 1,
              backgroundColor: noir,
              paddingTop: Platform.OS === 'android' ? 0 : 20,
              paddingHorizontal: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomColor: jaune,
                borderBottomWidth: 1,
                height: 60,
              }}>
              <Text
                style={{
                  color: jaune,
                  fontSize: 15,
                  fontWeight: 'bold',
                  paddingTop: 20,
                }}>
                {''}
              </Text>
              <TouchableOpacity
                onPress={this._hideModal}
                style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    marginBottom: 0,
                    color: jaune,
                  }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>

            <Searchbar
              placeholder="Search"
              placeholderTextColor={jaune}
              style={{
                backgroundColor: gris,
                borderBottomColor: jaune,
                borderBottomWidth: 2,
              }}
              onChangeText={query => {
                this.setState({ firstQuery: query })
              }}
              value={firstQuery}
            />
            <ScrollView style={{ paddingTop: 20 }}>
              {/* favorites games */}

              {/* Games list */}
              {this.state.weekGames
                .filter(f => this.state.bowlGame.filter(j => j && j.game && j.game.GameID === f.GameID).length === 0)
                .filter(f => f.PointSpread !== null && f.OverUnder !== null)
                .map((item, index) => (
                  <GameItem
                    key={index}
                    color={index % 2}
                    stared={false}
                    game={item}
                    index={index}
                    onSelected={id => {
                      let bowlGame = this.state.bowlGame[this.state.selected] || {}

                      bowlGame.game = item
                      this.state.bowlGame[this.state.selected] = bowlGame

                      // alert(JSON.stringify(this.state.bowlGame))
                      this.setState({ bowlGame: this.state.bowlGame }, () => {
                        // alert(JSON.stringify(this.state.bowlGame))
                        if (
                          this.state.bowlGame[this.state.selected] &&
                          this.state.bowlGame[this.state.selected].game &&
                          this.state.bowlGame[this.state.selected].game.GameID &&
                          this.state.bowlGame[this.state.selected].method &&
                          this.state.bowlGame[this.state.selected].method.value
                        ) {
                          this.onChoose(this.state.bowlGame[this.state.selected], this.state.selected + 1)
                          // if (this.state.bowlGame.length > 0) {
                          //   axios
                          //     .put(
                          //       `${SERVER}/bowl-game-users/${this.state.id}`,
                          //       {
                          //         games: this.state.bowlGame,
                          //       },
                          //       {
                          //         headers: {
                          //           Authorization: `Bearer ${this.props.token}`,
                          //         },
                          //       },
                          //     )
                          //     .then(response => {
                          //       console.log('has been Update')
                          //     })
                          //     .catch(error => {
                          //       // Handle error.
                          //       console.log('An error occurred:', error)
                          //     })
                          // } else {
                          //   axios
                          //     .post(
                          //       `${SERVER}/bowl-game-users`,
                          //       {
                          //         season: this.props.currentYear,
                          //         user: this.props.user.id,
                          //         games: this.state.bowlGame,
                          //       },
                          //       {
                          //         headers: {
                          //           Authorization: `Bearer ${this.props.token}`,
                          //         },
                          //       },
                          //     )
                          //     .then(response => {
                          //       console.log('has been created')
                          //     })
                          //     .catch(error => {
                          //       // Handle error.
                          //       console.log('An error occurred:', error)
                          //     })
                          // }
                        }

                        this._hideModal()
                      })

                      // alert(JSON.stringify(this.state.bowlGame, null, 2))
                    }}
                  />
                ))}
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </Modal>
      </View>
    )
  }
}

function Game(props) {
  const { selectedBowl } = props

  let game_ = selectedBowl && selectedBowl.game ? selectedBowl.game : null
  let method_ = selectedBowl && selectedBowl.method ? selectedBowl.method : null

  return (
    <View
      style={{
        width: SCREEN_WIDTH - 40,

        backgroundColor: noir,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        alignSelf: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomColor: jaune,
          borderBottomWidth: 1,
          height: 30,
        }}>
        <Text
          style={{
            color: jaune,
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          {'Game ' + (props.index + 1)}
        </Text>
        {game_ && !game_._id && (
          <TouchableOpacity
            onPress={() => {
              props.onClear()
            }}>
            <Text
              style={{
                color: jaune,
                fontSize: 12,
                fontWeight: 'bold',
              }}>
              {'Clear X'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',

          marginVertical: 20,
        }}>
        <TouchableOpacity
          onPress={() => props.getGame()}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 30,
            width: '60%',
            backgroundColor: gris,
            alignItems: 'center',
            paddingHorizontal: 5,
          }}>
          <Text
            style={{
              color: jaune,
              fontSize: 10,
            }}>
            {game_ && game_.GameID ? gameString(game_) : 'SELECT GAME'}
          </Text>
          <Ionicons name={'ios-arrow-down'} color={jaune} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.method()
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 30,
            width: '35%',
            backgroundColor: gris,
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              color: jaune,
              fontSize: 10,
              fontWeight: '400',
              fontFamily: 'Monda',
              marginRight: 2,
            }}>
            {method_ && method_.value ? method_.value : 'PICK TYPE'}
          </Text>
          <Ionicons name={'ios-arrow-down'} color={jaune} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

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

const mapStateToProps = state => {
  const { user, token } = state.user
  const { weekGames, currentYear, currentWeek } = state.game
  return {
    user,
    token,
    currentYear,
    currentWeek,
    weekGames,
  }
}

export default connect(mapStateToProps, {
  updateUserInfo,
  setWeekDate,
  setCurrentSeasonWeek,
  getCurrentWeekGame,
})(BowlSeason)
