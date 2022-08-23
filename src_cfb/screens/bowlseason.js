import React, { Component } from 'react'
import { View, Modal, Alert, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Text } from 'react-native'
import { Ionicons } from 'react-native-vector-icons'
import { noir, jaune, gris } from '../styles/colors'
import { SERVER } from '../redux/actionTypes'
import { BOWLWEEK, SCREEN_WIDTH } from '../utils/variables'
import { gameString } from '../utils/functions'
import axios from 'axios'
import _ from 'lodash'
import { ActivityIndicator } from 'react-native-paper'

import { connect } from 'react-redux'
import { updateUserInfo } from '../redux/actions/user'
import ActionSheet from 'react-native-actionsheet'
import { setCurrentSeasonWeek, setWeekDate, getCurrentWeekGame } from '../redux/actions/game'
import GameItem from '../components/gameItem'
import { Searchbar } from 'react-native-paper'

const methods = [
  { type: 'spread', label: 'Spread fave', value: 'fave', category: 'bowl' },
  { type: 'spread', label: 'Spread dog', value: 'dog', category: 'bowl' },
  { type: 'total', label: 'Total over', value: 'over', category: 'bowl' },
  { type: 'total', label: 'Total under', value: 'under', category: 'bowl' },
  { type: 'moneyLine', label: 'MoneyLine $line', value: '$line', category: 'bowl' },
  { type: '', label: '', value: 'Cancel', category: '' },
]

class BowlSeason extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: -1,
      data: [],
      bowlGame: [],
      betsGame: [],
      selectedGame: null,
      selected: -1,
      refreshing: false,
      visible: false,
      searchText: '',
      selected: -1,
      weekGames: [],
      send: false,
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
      .get(`${SERVER}/bowl-games`, {
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

          const list = _.concat(weekGames_, games.data)
            .filter(f => f.Season + '' === self.props.currentYear + '' && f.PointSpread)
            .sort((a, b) => new Date(a.Day) - new Date(b.Day))
          self.setState(
            {
              weekGames: _.unionBy(list, 'Title'),
            },
            () => {
              console.log(JSON.stringify(_.unionBy(self.state.weekGames, 'Title').length, null, 2))
            },
          )
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

        if (response && response.data) {
          self.setState({ bowlGame: [] }, () => {
            self.setState(
              {
                betsGame: response.data.filter(f => f.method.category === 'bowl'),
              },
              () => {},
            )
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

    const isBet = this.state.betsGame.filter(f => f.gameKey + '' === data.gameKey + '')

    if (data.game.GameID && data.method.value) {
      this.setState({ send: true })
      if (data._id) {
        axios
          .put(`${SERVER}/betscfbs/${data._id}`, data, {
            headers: {
              Authorization: `Bearer ${this.props.token}`,
            },
          })
          .then(response => {
            if (response && response.data && response.data._id) {
              self.getAll()
              console.log('has been Update')
            }
            this.setState({ send: false })
          })
          .catch(error => {
            this.setState({ send: false })
            // Handle error.
            console.log('An error occurred:', error)
          })
      } else {
        // alert('create')
        if (isBet.length === 0) {
          axios
            .post(`${SERVER}/betscfbs`, data, {
              headers: {
                Authorization: `Bearer ${this.props.token}`,
              },
            })
            .then(response => {
              if (response && response.data && response.data._id) {
                self.getAll()
                console.log('has been create')
              }
              this.setState({ send: false })
            })
            .catch(error => {
              this.setState({ send: false })
              // Handle error.
              console.log('An error occurred:', error)
            })
        }
      }
    }
  }

  deletePick = (id, gameId) => {
    let self = this
    this.setState({ send: true })

    axios
      .delete(`${SERVER}/betscfbs/${id}`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      })
      .then(response => {
        if (response && response.data && response.data._id) {
          // alert('Pick has been remove')
          self.getAll()
          let new_ = self.state.bowlGame.filter(f => f.game.GameID !== gameId)
          self.setState({ bowlGame: new_ })
          console.log('has been delete')
        }
        this.setState({ send: false })
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error)
        this.setState({ send: false })
      })
  }
  render() {
    if (this.props.weekGames.length > 0 && this.state.data.length === 0) {
      this.setState({ data: this.props.weekGames })
    }

    const { visible, searchText } = this.state
    return (
      <View style={{ flex: 1, width: '100%', marginTop: 0 }}>
        {this.state.send === true && (
          <View
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
              zIndex: 999,
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'absolute',
            }}>
            <ActivityIndicator style={{ marginTop: 250 }} />
          </View>
        )}

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
            {`Picks made:  ${this.state.betsGame.length} of ${this.state.weekGames.length}`}
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
            {`Remember, your “${this.state.weekGames.length}” game is worth ${this.state.weekGames.length} points and your “1” game is worth 1 point. Your “15” game is worth 15 points, and so on and so forth.`}
          </Text>

          {this.state.weekGames.map((item, index) => {
            let game = {}
            const dat = this.state.betsGame.filter(f => f.type && f.type.point === index + 1)[0]
            const dat2 = this.state.bowlGame[index]
            // if (dat || dat2) {
            //   console.log(JSON.stringify(dat, null, 2))
            // }

            game = dat ? dat : {}
            if (dat2 && dat2.game) {
              game.game = dat2.game
            }
            if (dat2 && dat2.method) {
              game.method = dat2.method
            }
            if (dat2 && dat2.type) {
              game.type = dat2.type
            }

            return (
              <Game
                item={item}
                index={index}
                selectedBowl={game || {}}
                getGame={() => {
                  if (!this.state.send) {
                    this.setState({ selected: index, selectedGame: game }, () => {
                      this._showModal()
                    })
                  }
                }}
                onClear={(id, gameId) => {
                  Alert.alert('Clear Game', 'Do you realy want clear this pick?', [
                    {
                      text: 'No',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => {
                        if (id) {
                          this.deletePick(id, gameId)
                        }
                      },
                    },
                  ])
                }}
                method={() => {
                  if (!this.state.send) {
                    this.setState({ selected: index, selectedGame: game }, () => {
                      this.showTypeBet()
                    })
                  }
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
              let bowlgame = this.state.selectedGame || {}

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
                  this.onChoose(this.state.bowlGame[this.state.selected], this.state.selected + 1)
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
              autoCapitalize={'none'}
              onChangeText={query => {
                this.setState({ searchText: query })
              }}
              value={searchText}
            />
            <ScrollView style={{ paddingTop: 20 }}>
              {this.state.weekGames
                .filter(f => JSON.stringify(f).toLowerCase().includes(this.state.searchText.toLowerCase()))
                .filter(f => this.state.betsGame.filter(j => j && j.game && j.game.GameID === f.GameID).length === 0)
                .filter(f => this.state.bowlGame.filter(j => j && j.game && j.game.GameID === f.GameID).length === 0)

                .filter(f => f.PointSpread !== null && f.OverUnder !== null)
                .map((item, index) => (
                  <GameItem
                    key={index}
                    color={index % 2}
                    stared={false}
                    game={item}
                    index={index}
                    onSelected={() => {
                      let bowlGame = this.state.selectedGame || {}
                      bowlGame.game = item
                      this.state.bowlGame[this.state.selected] = bowlGame
                      this.setState({ bowlGame: this.state.bowlGame }, () => {
                        if (
                          this.state.bowlGame[this.state.selected] &&
                          this.state.bowlGame[this.state.selected].game &&
                          this.state.bowlGame[this.state.selected].game.GameID &&
                          this.state.bowlGame[this.state.selected].method &&
                          this.state.bowlGame[this.state.selected].method.value
                        ) {
                          this.onChoose(this.state.bowlGame[this.state.selected], this.state.selected + 1)
                        }
                        this._hideModal()
                      })
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
  let id = selectedBowl && selectedBowl._id ? selectedBowl._id : null
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
        borderLeftColor: id ? jaune : noir,
        borderLeftWidth: 2,
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
        {id && (
          <TouchableOpacity
            onPress={() => {
              props.onClear(id, game_.GameID)
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
