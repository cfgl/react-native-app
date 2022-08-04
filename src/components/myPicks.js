import React, { Component } from 'react'
import { View, Modal, Text, Image, ScrollView, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import _ from 'lodash'
import { Searchbar } from 'react-native-paper'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/variables'
import { jaune, noir, gris } from '../styles/colors'
import { Checkbox, Switch, Portal, Button, Provider } from 'react-native-paper'
import { Ionicons } from 'react-native-vector-icons'
import ActionSheet from 'react-native-actionsheet'
import { connect } from 'react-redux'
import GameItem from './gameItem'
import { gameString } from '../utils/functions'
import { Popover, PopoverController } from 'react-native-modal-popover'
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
const methods = [
  { type: 'spread', label: 'Spread fave', value: 'fave' },
  { type: 'spread', label: 'Spread dog', value: 'dog' },
  // {type: "spread", label: "Spread push", value: "push"},
  { type: 'total', label: 'Total over', value: 'over' },
  { type: 'total', label: 'Total under', value: 'under' },
  { type: 'moneyLine', label: 'MoneyLine $line', value: '$line' },
  { type: '', label: '', value: 'Cancel' },
]
class MyPicks extends Component {
  constructor(props) {
    super(props)

    this.state = {
      off: false,
      visible: false,
      checked: this.props.savedValue.quickpick,
      isSwitchOn: this.props.savedValue.locked,
      game: this.props.savedValue.game,
      method: this.props.savedValue.method,
      firstQuery: '',
      conference: '',
    }
  }
  _showModal = () => this.setState({ visible: true })
  _hideModal = () => this.setState({ visible: false })

  showTypeBet = () => {
    this.methodBet.show()
  }

  merge = (weekList, favorites) => {
    let list = weekList ? weekList : []
    favorites = favorites
      ? favorites.filter(f => f.Season === this.props.currentYear && f.Week === this.props.currentWeek)
      : []
    for (let index = 0; index < favorites.length; index++) {
      const element = favorites[index]
      _.remove(list, n => {
        return n.GlobalGameID === element.GlobalGameID
      })
    }
    if (this.props.name === 'Power conference') {
      return list.filter(
        f =>
          this.props.user &&
          this.props.user.conference &&
          this.props.user.conference.name &&
          f.HomeTeamInfo &&
          f.HomeTeamInfo.Division === this.props.user.conference.name &&
          f.HomeTeamInfo.Conference === 'NFC',
      )
    } else if (this.props.name === 'Binding conference') {
      return list.filter(f => f.HomeTeamInfo.Conference === 'AFC')
    } else return list
  }
  favoritesF = favorites => {
    favorites = favorites
      ? favorites.filter(f => f.Season === this.props.currentYear && f.Week === this.props.currentWeek)
      : []

    if (this.props.name === 'Power conference') {
      return favorites.filter(
        f =>
          this.props.user &&
          this.props.user.conference &&
          this.props.user.conference.name &&
          f.HomeTeamInfo &&
          f.HomeTeamInfo.Division === this.props.user.conference.name &&
          f.HomeTeamInfo.Conference === 'NFC',
      )
    } else if (this.props.name === 'Binding conference') {
      return favorites.filter(f => f.HomeTeamInfo.Conference === 'AFC')
    } else return favorites
  }
  random = (a, b) => {
    // alert(JSON.stringify(b));
    //alert(JSON.stringify(b.filter(c => c.AwayTeam === "NYJ")));
    let list = a
      .filter(f => f.Season === this.props.currentYear && f.Week === this.props.currentWeek)
      .concat(b)
      .filter(f => f.PointSpread !== null && f.OverUnder !== null && f.Status === 'Scheduled')

    let ranGame = Math.floor(Math.random() * (list.length - 1) + 0)
    let ranMethod = this.props.name == 'dog game' ? 4 : Math.floor(Math.random() * (methods.length - 1) + 0)

    if (ranGame !== -1) {
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
      alert('No game found for type of bet')
    }
  }

  componentDidMount() {
    let day = new Date().getDay()
    let hour = new Date().getHours()

    if (day === 0 && hour > 10) {
      this.setState({ isSwitchOn: true, off: true })
    }

    if (day === 1) {
      this.setState({ isSwitchOn: true, off: true })
    }
  }

  render() {
    const { visible, checked, isSwitchOn, game, off, method, firstQuery } = this.state
    const { name, value, data, onChoose, favorites } = this.props

    return (
      <View
        style={{
          width: SCREEN_WIDTH - 40,
          height: 150,
          backgroundColor: noir,
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginBottom: 20,
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
                        this.random(favorites, this.merge(data, favorites))
                      }
                    })
                  }
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',

            marginVertical: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (isSwitchOn == false) {
                this._showModal()
              }
            }}
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
              {game.HomeTeam ? gameString(game) : 'select game'.toUpperCase()}
            </Text>
            <Ionicons name={'ios-arrow-down'} color={jaune} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isSwitchOn == false) {
                this.showTypeBet()
              }
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
              {method.value ? method.value.toUpperCase() : 'PICK TYPE'}
            </Text>
            <Ionicons name={'ios-arrow-down'} color={jaune} size={20} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (!off) {
              this.setState({ isSwitchOn: !isSwitchOn }, () => {
                onChoose({
                  game: this.state.game,
                  method: this.state.method,
                  locked: this.state.isSwitchOn,
                  quick: this.state.checked,
                })
              })
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 150,
          }}>
          <Switch
            value={isSwitchOn}
            color={'rgb(127,10,57)'}
            style={{}}
            onValueChange={() => {
              if (!off) {
                this.setState({ isSwitchOn: !isSwitchOn }, () => {
                  onChoose({
                    game: this.state.game,
                    method: this.state.method,
                    locked: this.state.isSwitchOn,
                    quick: this.state.checked,
                  })
                })
              }
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

        <ActionSheet
          ref={o => (this.methodBet = o)}
          title={'Select the pick method.'}
          options={
            name == 'dog game'
              ? [
                  { type: 'moneyLine', label: 'MoneyLine $line', value: '$line' },
                  { type: '', label: '', value: 'Cancel' },
                ].map(i => i.value)
              : methods.map(i => i.value)
          }
          cancelButtonIndex={name == 'dog game' ? 1 : 5}
          // destructiveButtonIndex={1}
          onPress={index => {
            let canc = name !== 'dog game' ? 5 : 1

            if (index !== canc)
              this.setState(
                {
                  method:
                    name == 'dog game'
                      ? [
                          {
                            type: 'moneyLine',
                            label: 'MoneyLine $line',
                            value: '$line',
                          },
                          { type: '', label: '', value: 'Cancel' },
                        ][index]
                      : methods[index],
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
              {this.favoritesF(this.props.favorites)
                .filter(
                  i => JSON.stringify(i).toLowerCase().includes(firstQuery.toLowerCase()) && i.Status === 'Scheduled',
                )
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
                          game: this.props.favorites.filter(i => i.GlobalGameID == item.GlobalGameID)[0],
                          conference:
                            this.props.value.toUpperCase() === 'POWER GAME' ||
                            this.props.value.toUpperCase() === 'BINDING GAME'
                              ? this.state.game.HomeTeamInfo.Conference
                              : '',
                        },
                        () => {
                          // alert(this.state.conference)
                          onChoose({
                            game: this.state.game,
                            method: this.state.method,
                            locked: this.state.isSwitchOn,
                            quick: this.state.checked,
                          })
                        },
                      )

                      this._hideModal()
                    }}
                    hour={'13:30am'}
                  />
                ))}
              <View style={{ height: 1, width: '100%', backgroundColor: jaune }} />
              {this.merge(data, this.props.favorites)
                .filter(
                  i => JSON.stringify(i).toLowerCase().includes(firstQuery.toLowerCase()) && i.Status === 'Scheduled',
                )
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
                          game: data.filter(i => i.GlobalGameID == item.GlobalGameID)[0],
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

const mapStateToProps = state => {
  const { user, token } = state.user
  const { currentYear, currentWeek } = state.game
  return { user, token, currentYear, currentWeek }
}
export default connect(mapStateToProps, {})(MyPicks)
