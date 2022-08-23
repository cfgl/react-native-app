import React, { Component } from 'react'
import { View, Modal, Text, ScrollView, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import _ from 'lodash'
import { Searchbar } from 'react-native-paper'
import { SCREEN_WIDTH } from '../utils/variables'
import { jaune, noir, gris } from '../styles/colors'
import { Checkbox, Switch } from 'react-native-paper'
import { Ionicons } from 'react-native-vector-icons'
import ActionSheet from 'react-native-actionsheet'
import { connect } from 'react-redux'
import GameItem from './gameItem'
import { gameString } from '../utils/functions'
import { Popover, PopoverController } from 'react-native-modal-popover'
import { conferenceGroup } from '../datas/conference'
import { getWeekGames, getMyBets, updateBet } from '../services/games'

const methods = [
  { type: 'spread', label: 'Spread fave', value: 'fave' },
  { type: 'spread', label: 'Spread dog', value: 'dog' },
  { type: 'total', label: 'Total over', value: 'over' },
  { type: 'total', label: 'Total under', value: 'under' },
  { type: 'moneyLine', label: 'MoneyLine $line', value: '$line' },
  { type: '', label: '', value: 'Cancel' },
]

class MyPicks extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      checked: this.props.hasTakeBet.quickpick,
      isSwitchOn: this.props.hasTakeBet.locked,
      game: this.props.hasTakeBet.game,
      method: this.props.hasTakeBet.method,
      firstQuery: '',
      conferenceCFB:
        this.props.hasTakeBet.method && this.props.hasTakeBet.method.conference
          ? this.props.hasTakeBet.method.conference
          : 'PICK CONFER.',
    }
    // console.log(this.props.hasTakeBet);
    // console.log(
    //   this.props.hasTakeBet.method && this.props.hasTakeBet.method.conference
    //     ? this.props.hasTakeBet.method.conference
    //     : 'PICK CONFER.',
    // )
    // alert(this.props.currentYear)
  }
  _showModal = () => this.setState({ visible: true })
  _hideModal = () => this.setState({ visible: false })

  showTypeBet = () => {
    this.methodBet.show()
  }

  async componentWillMount() {
    const respGetMyBets = await getMyBets(this.props.user._id, this.props.currentWeek, this.props.token)
    if (respGetMyBets && respGetMyBets.data) {
      console.log('respGetMyBets', respGetMyBets.data.length)

      let d = this.hasTakeBet(respGetMyBets.data, this.props.currentWeek, this.props.currentYear, this.props.name)
      if (d) {
        // alert(d.method.conference)
        // console.log(d.game)
        this.setState({
          game: d.game,
          method: d.method,
          checked: d.quickpick,
          isSwitchOn: d.locked,
        })
      }
    }
  }
  hasTakeBet = (bets, week, year, type) => {
    bets = bets ? bets : []
    let bet = bets.filter(i => i.week == week && i.season === year && i.type.label == type)

    // this.setState({ off: true })
    if (bet.length > 0) {
      let game_ = this.props.data.filter(f => f.GameID === bet[0].game.GameID)
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
  merge = (weekList, fav) => {
    let list = weekList ? weekList : []
    const favorites = fav
      ? fav.filter(f => f.Season === this.props.currentYear && f.Week === this.props.currentWeek)
      : []

    let bindingConf = this.props.weekstartdate[this.props.currentWeek - 1].conference
    bindingConf = bindingConf === 'Power Conf' ? this.props.user.conferenceCFB : bindingConf

    //Remove all favorites game in the main list
    for (let index = 0; index < favorites.length; index++) {
      const element = favorites[index]
      _.remove(list, n => {
        return n.GlobalGameID === element.GlobalGameID
      })
    }

    return list.filter(
      f => {
        if (
          this.props.name.toUpperCase() === 'POWER CONFERENCE' &&
          ((f.HomeTeamInfo &&
            f.HomeTeamInfo.Conference &&
            f.HomeTeamInfo.Conference.toLowerCase().includes(this.props.user.conferenceCFB.toLowerCase())) ||
            (f.AwayTeamInfo &&
              f.AwayTeamInfo.Conference &&
              f.AwayTeamInfo.Conference.toLowerCase().includes(this.props.user.conferenceCFB.toLowerCase())))
        ) {
          return f
        } else if (
          this.props.name.toUpperCase() === 'BIND. CONFERENCE' &&
          ((f.HomeTeamInfo &&
            f.HomeTeamInfo.Conference &&
            f.HomeTeamInfo.Conference.toLowerCase().includes(bindingConf.toLowerCase())) ||
            (f.AwayTeamInfo &&
              f.AwayTeamInfo.Conference &&
              f.AwayTeamInfo.Conference.toLowerCase().includes(bindingConf.toLowerCase())))
        ) {
          return f
        } else if (
          this.props.name.toUpperCase() !== 'POWER CONFERENCE' &&
          this.props.name.toUpperCase() !== 'BIND. CONFERENCE'
        ) {
          return f
        }

        // this.state.conferenceCFB
      },
      // &&
      // ((f.HomeTeamInfo &&
      //   f.HomeTeamInfo.Conference &&
      //   f.HomeTeamInfo.Conference.toLowerCase().includes(this.state.conferenceCFB.toLowerCase())) ||
      //   (f.AwayTeamInfo &&
      //     f.AwayTeamInfo.Conference &&
      //     f.AwayTeamInfo.Conference.toLowerCase().includes(this.state.conferenceCFB.toLowerCase()))),
    )
  }

  favoritesF = fav => {
    const favorites = fav
      ? fav.filter(f => this.props.currentYear.includes(f.Season.toString()) && f.Week === this.props.currentWeek)
      : []

    return favorites.filter(
      f =>
        this.state.conferenceCFB &&
        ((f.HomeTeamInfo &&
          f.HomeTeamInfo.Conference &&
          f.HomeTeamInfo.Conference.toLowerCase().includes(this.state.conferenceCFB.toLowerCase())) ||
          (f.AwayTeamInfo &&
            f.AwayTeamInfo.Conference &&
            f.AwayTeamInfo.Conference.toLowerCase().includes(this.state.conferenceCFB.toLowerCase()))),
    )
  }

  random = a => {
    let ranConf = Math.floor(Math.random() * (this.state.conferenceCFB.length - 1) + 0)

    let con = this.state.conferenceCFB[ranConf]

    let list = a
      .filter(f => this.props.currentYear.includes(f.Season + '') && f.Week === this.props.currentWeek)
      .filter(f => f.PointSpread !== null && f.OverUnder !== null)
      // .filter(
      //   f =>
      //     f.Status !== 'Final' && //comment for testing
      //     f.Status === 'Scheduled', //comment for testing
      // )
      .filter(
        f =>
          con &&
          ((f.HomeTeamInfo &&
            f.HomeTeamInfo.Conference &&
            f.HomeTeamInfo.Conference.toLowerCase().includes(con.toLowerCase())) ||
            (f.AwayTeamInfo &&
              f.AwayTeamInfo.Conference &&
              f.AwayTeamInfo.Conference.toLowerCase().includes(con.toLowerCase()))),
      )

    //Get one game from the list
    let ranGame = Math.floor(Math.random() * (list.length - 1) + 0)

    let ranMethod = 0
    if (this.props.name.toUpperCase() !== 'DOG GAME') {
      //Get one of the method type
      ranMethod = Math.floor(Math.random() * (methods.length - 1) + 0)
    } else {
      ranMethod = 4
    }

    //It's Time to place your Bet
    if (ranGame !== -1 && ranMethod !== -1 && ranConf !== -1) {
      this.setState(
        {
          game: list[ranGame],
          method: methods[ranMethod],
          isSwitchOn: true,
        },
        () => {
          this.props.onChoose({
            game: this.state.game,
            method: this.state.method,
            locked: this.state.isSwitchOn,
            quick: this.state.checked,
          })
        },
      )
    } else {
      alert('No game found for this pick')
    }
  }

  render() {
    const { visible, checked, isSwitchOn, game, off, method, firstQuery } = this.state
    const { name, data, onChoose } = this.props

    return (
      <View style={styles.container}>
        {off === true && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.3)',
              width: SCREEN_WIDTH - 40,
              height: 150,
              zIndex: 9,
            }}
          />
        )}
        {/* card Header */}
        <View style={styles.headContainer}>
          <Text
            style={{
              color: jaune,
              fontSize: 15,
              fontWeight: 'bold',
              fontFamily: 'Monda',
            }}>
            {name.toUpperCase()}
          </Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={{ color: jaune, fontFamily: 'Monda' }}>Quick Pick</Text>
            <View style={{ marginTop: -10 }}>
              <Checkbox.Android
                status={checked ? 'checked' : 'unchecked'}
                uncheckedColor={jaune}
                color={'#fff'}
                onPress={() => {
                  if (isSwitchOn == false) {
                    this.setState({ checked: !checked }, () => {
                      if (this.state.checked) {
                        this.random(data)
                      }
                    })
                  }
                }}
              />
            </View>
          </View>
        </View>

        {/* Card middle */}

        <View style={styles.middleContainer}>
          <TouchableOpacity
            onPress={() => {
              if (isSwitchOn == false) {
                this._showModal()
              }
            }}
            style={styles.middleGameSelected}>
            <Text
              style={{
                color: jaune,
                fontSize: 10,
              }}>
              {game.HomeTeam ? gameString(game) : 'SELECT GAME'}
            </Text>
            <Ionicons name={'ios-arrow-down'} color={jaune} size={20} />
          </TouchableOpacity>
          {name.toUpperCase() === 'DOG GAME' ? (
            <View style={styles.middleTypeSelectedWrapper}>
              <Text style={styles.middleTypeSelected}>{'$LINE'}</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (isSwitchOn == false) {
                  this.showTypeBet()
                }
              }}
              style={styles.middleTypeSelectedWrapper}>
              <Text style={styles.middleTypeSelected}>{method.value ? method.value.toUpperCase() : 'PICK TYPE'}</Text>
              <Ionicons name={'ios-arrow-down'} color={jaune} size={20} />
            </TouchableOpacity>
          )}
        </View>

        {/* card Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ isSwitchOn: !isSwitchOn }, () => {
                onChoose({
                  game: this.state.game,
                  method: this.state.method,
                  locked: this.state.isSwitchOn,
                  quick: this.state.checked,
                })
              })
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '50%',
            }}>
            <Switch
              value={isSwitchOn}
              color={'rgb(127,10,57)'}
              style={{}}
              onValueChange={() => {
                this.setState({ isSwitchOn: !isSwitchOn }, () => {
                  onChoose({
                    game: this.state.game,
                    method: this.state.method,
                    locked: this.state.isSwitchOn,
                    quick: this.state.checked,
                  })
                })
              }}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                left: 150,
                fontFamily: 'Monda',
              }}>
              <PopoverController>
                {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                  <React.Fragment>
                    <Ionicons
                      name="ios-information-circle-outline"
                      size={24}
                      color={jaune}
                      ref={setPopoverAnchor}
                      onPress={openPopover}
                    />
                    <Popover
                      placement="right"
                      contentStyle={styles.content}
                      arrowStyle={styles.arrow}
                      backgroundStyle={styles.background}
                      visible={popoverVisible}
                      onClose={closePopover}
                      fromRect={popoverAnchorRect}
                      supportedOrientations={['portrait', 'landscape']}>
                      {!off ? (
                        <Text style={{ width: 140, fontSize: 10, fontFamily: 'Monda' }}>
                          {this.state.isSwitchOn == true
                            ? 'Your pick is now locked. To change it before kickoff, unlock it, repick, and lock it again.'
                            : 'Your pick is not locked. Lock it afer pick and unlock it again to repick.  '}
                        </Text>
                      ) : (
                        <Text style={{ width: 140, fontSize: 10, fontFamily: 'Monda' }}>
                          {'Your pick is now locked until the final game of this week. It will automaticaly unlock.  '}
                        </Text>
                      )}
                    </Popover>
                  </React.Fragment>
                )}
              </PopoverController>
            </TouchableOpacity>
            <Text style={{ color: jaune, marginLeft: 10, fontFamily: 'Monda' }}> Lock Pick</Text>
          </TouchableOpacity>
        </View>

        {/* type for bets */}
        <ActionSheet
          ref={o => (this.methodBet = o)}
          title={'Select the pick method.'}
          options={
            name === 'dog game'
              ? [
                  { type: 'moneyLine', label: 'MoneyLine $line', value: '$line' },
                  { type: '', label: '', value: 'Cancel' },
                ].map(i => i.value)
              : methods.map(i => i.value)
          }
          cancelButtonIndex={name == 'dog game' ? 1 : methods.length - 1}
          // destructiveButtonIndex={1}
          onPress={index => {
            let canc = name !== 'dog game' ? methods.length - 1 : 1

            if (index !== canc) {
              if (name === 'dog game') {
                onChoose({
                  game: this.state.game,
                  method: {
                    type: 'moneyLine',
                    label: 'MoneyLine $line',
                    value: '$line',
                  },
                  locked: this.state.isSwitchOn,
                  quick: this.state.checked,
                })
              } else {
                this.setState(
                  {
                    method: methods[index],
                  },
                  () => {
                    onChoose({
                      game: this.state.game,
                      method: this.state.method,
                      locked: this.state.isSwitchOn,
                      quick: this.state.checked,
                    })
                  },
                )
              }
            }
          }}
        />

        {/* Game list Modal*/}
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
              {/* <Text> {this.props.favorites.length}</Text> */}
              {/* favorites games */}
              {this.favoritesF(this.props.favorites)
                .filter(i => JSON.stringify(i).toLowerCase().includes(firstQuery.toLowerCase()))
                // .filter(
                //   i =>
                //     f.Status !== 'Final' && //comment for testing
                //     i.Status === 'Scheduled', //comment for testing
                // )
                .filter(f => f.PointSpread !== null && f.OverUnder !== null)
                .map((item, index) => (
                  <GameItem
                    key={index}
                    color={index % 2}
                    stared={true}
                    game={item}
                    index={index}
                    onSelected={id => {
                      this.setState(
                        {
                          game: data.filter(i => i.GlobalGameID == item.GlobalGameID)[0],
                        },
                        () => {
                          if (name === 'dog game') {
                            onChoose({
                              game: this.state.game,
                              method: {
                                type: 'moneyLine',
                                label: 'MoneyLine $line',
                                value: '$line',
                              },
                              locked: this.state.isSwitchOn,
                              quick: this.state.checked,
                            })
                          } else {
                            onChoose({
                              game: this.state.game,
                              method: this.state.method,
                              locked: this.state.isSwitchOn,
                              quick: this.state.checked,
                            })
                          }
                        },
                      )

                      this._hideModal()
                    }}
                    hour={'13:30am'}
                  />
                ))}
              <View style={{ height: 1, width: '100%', backgroundColor: jaune }} />
              {/* Games list */}
              {this.merge(data, this.props.favorites)
                .filter(i => JSON.stringify(i).toLowerCase().includes(firstQuery.toLowerCase()))
                // .filter(
                //   i => i.Status !== 'Final' && //comment for testing
                //     i.Status === 'Scheduled', //comment for testing
                // )
                .filter(f => f.PointSpread !== null && f.OverUnder !== null)

                .map((item, index) => (
                  <GameItem
                    key={index}
                    color={index % 2}
                    stared={false}
                    game={item}
                    index={index}
                    onSelected={id => {
                      this.setState(
                        {
                          game: data.filter(i => i.GameID === item.GameID)[0],
                        },
                        () => {
                          if (name === 'dog game') {
                            onChoose({
                              game: this.state.game,
                              method: {
                                type: 'moneyLine',
                                label: 'MoneyLine $line',
                                value: '$line',
                              },
                              locked: this.state.isSwitchOn,
                              quick: this.state.checked,
                            })
                          } else {
                            onChoose({
                              game: this.state.game,
                              method: this.state.method,
                              locked: this.state.isSwitchOn,
                              quick: this.state.checked,
                            })
                          }
                        },
                      )

                      this._hideModal()
                    }}
                  />
                ))}
            </ScrollView>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 40,
    height: 150,
    backgroundColor: noir,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: jaune,
    borderBottomWidth: 1,
    height: 30,
  },
  middleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  middleGameSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
    width: '50%',
    backgroundColor: gris,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  middleTypeSelectedWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
    width: '45%',
    backgroundColor: gris,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  middleTypeSelected: {
    color: jaune,
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Monda',
    marginRight: 2,
  },
  footerTypeSelected: {
    width: 80,
    color: jaune,
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Monda',
    marginRight: 2,
  },
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
  const { currentYear, weekstartdate, currentWeek, seasonStatus } = state.game
  return { user, token, currentYear, currentWeek, seasonStatus, weekstartdate }
}
export default connect(mapStateToProps, {})(MyPicks)
