import React, { Component } from 'react'
import { View, Text, RefreshControl, TouchableOpacity, ScrollView, Modal } from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { SCREEN_WIDTH } from '../utils/variables'
import { jaune, noir, gris } from '../styles/colors'
import { Ionicons } from 'react-native-vector-icons'
import { connect } from 'react-redux'
import { getConferencesTeams } from '../redux/actions/user'
import { updateUserInfo } from '../redux/actions/user'
import { gameString, getTeamById } from '../utils/functions'
import { conferenceGroup } from '../datas/conference'
import { RFValue } from 'react-native-responsive-fontsize'
import { getWeekGames } from '../services/games'

import _ from 'lodash'
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
  'Week 15',
  'Cancel',
]
const confrenceList = ['Conf 1', 'Conf 2', 'Conf 3', 'Conf 4', 'Conf 5', 'Conf 6', 'Cancel']
class Spreads extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      ConferenceName: 'ALL',
      week: 'Week ' + (this.props.seasonStatus && this.props.seasonStatus === 'STARTED' ? this.props.currentWeek : 1),
      bets: [],
      refreshing: false,
      favorites: this.props.user.favoritesCFB ? this.props.user.favoritesCFB : [],
      weekSelected: this.props.currentWeek,
      weekGames: [],
    }
  }
  async componentDidMount() {
    if (this.props.user.conference) {
      this.props.getConferencesTeams('ALL', this.props.token)
    }

    this.getWeekG()
  }

  getWeekG = async (week = this.props.currentWeek) => {
    const respGetWeekGames = await getWeekGames(this.props.currentYear, week)
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
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.favoritesCFB !== this.props.user.favoritesCFB) {
      this.setState({ favorites: this.props.user.favoritesCFB })
    }
  }

  _showModal = () => this.setState({ visible: true })
  _hideModal = () => this.setState({ visible: false })

  showWeek = () => {
    this.ActionSheet.show()
  }
  showConference = () => {
    this.conference.show()
  }

  bestGroupBy(bets, conference) {
    let data =
      conference !== 'ALL'
        ? bets.filter(
            f =>
              JSON.stringify(f.HomeTeamInfo).indexOf(conference) > -1 ||
              JSON.stringify(f.AwayTeamInfo).indexOf(conference) > -1,
          )
        : bets

    const groups = data.reduce((groups, game) => {
      const date = game.Day
      if (!groups[date]) {
        groups[date] = []
      }

      groups[date].push(game)

      return groups
    }, {})

    // Edit: to add it in the array format instead
    let groupArrays = Object.keys(groups).map(date => {
      return {
        date,
        games: groups[date],
      }
    })

    //console.log(JSON.stringify(groupArrays, null, 2));
    console.log('===================')

    groupArrays = groupArrays.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date)
    })
    return groupArrays
  }

  onRefresh = () => {
    this.setState({ refreshing: true })

    this.getWeekG(this.state.weekSelected)
    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }
  render() {
    const { visible, week, conference } = this.state

    return (
      <View style={{ flex: 1, paddingBottom: 150 }}>
        <MyPicks
          name="SELECT A WEEK AND A CONFERENCE"
          week={week}
          conference={this.state.ConferenceName}
          showWeek={() => this.showWeek()}
          showConf={() => this.showConference()}
        />
        {this.props.seasonStatus === 'STARTED' && (
          <View style={{}}>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}>
                  <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 17, marginBottom: 3 }}>
                    {this.state.week + ' refreshing...'}
                  </Text>
                </RefreshControl>
              }>
              {this.bestGroupBy(this.state.weekGames, this.state.ConferenceName).map((item, index) => (
                <View key={index}>
                  <View
                    style={{
                      height: 31,
                      backgroundColor: '#edd798',
                      justifyContent: 'center',
                      paddingHorizontal: 10,
                      marginBottom: 20,
                    }}>
                    <Text
                      style={{
                        color: '#191919',
                        fontSize: 11,
                        fontWeight: '700',
                      }}>
                      {item.date}
                    </Text>
                  </View>
                  {item.games
                    //.filter(i => i.Status === "Scheduled")
                    .map((item2, index2) => {
                      return (
                        <TouchableOpacity
                          key={index2}
                          style={{
                            paddingVertical: 5,
                            backgroundColor: gris,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingHorizontal: 15,
                          }}>
                          <Text
                            style={{
                              width: '60%',
                              color: jaune,
                              color: '#edd798',
                              fontFamily: 'Arial',
                              fontSize: RFValue(11),
                              fontWeight: '600',
                            }}>
                            {gameString(item2)}
                          </Text>
                          <Text
                            style={{
                              color: jaune,
                              color: '#edd798',
                              fontFamily: 'Arial',
                              fontSize: RFValue(11),
                              fontWeight: '600',
                            }}>
                            {new Date(item2.DateTime).toLocaleTimeString()}
                          </Text>

                          <TouchableOpacity
                            style={{ paddingHorizontal: 10 }}
                            onPress={() => {
                              if (this.props.user && this.props.user.conferenceCFB) {
                                if (
                                  this.state.favorites.filter(a => a.GlobalGameID === item2.GlobalGameID).length == 0
                                ) {
                                  if (this.props.user.conferenceCFB === this.props.conferenceTeams.Conference) {
                                    item2.power = true
                                  } else {
                                    item2.power = false
                                  }
                                  if (item2.AwayTeamMoneyLine !== null && item2.HomeTeamMoneyLine !== null)
                                    this.state.favorites.push(item2)
                                  else alert("You can't put this game on favorite yet. No spread or no over/under.")
                                } else {
                                  _.remove(this.state.favorites, n => {
                                    return n.GlobalGameID === item2.GlobalGameID
                                  })
                                }
                                this.setState({ favoritesCFB: this.state.favorites }, () => {
                                  this.props.updateUserInfo(
                                    {
                                      favoritesCFB: this.state.favorites,
                                    },
                                    this.props.user.id,
                                    this.props.token,
                                  )
                                })
                              } else {
                                alert('Please select your conference in the feeds')
                              }
                            }}>
                            <Ionicons
                              size={RFValue(26)}
                              name={'ios-star'}
                              style={{}}
                              color={
                                this.state.favorites.filter(a => a.GlobalGameID === item2.GlobalGameID).length > 0
                                  ? jaune
                                  : 'rgb(127,10,57)'
                              }
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      )
                    })}
                </View>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        )}
        {this.props.seasonStatus === 'PREPARING' && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 100,
            }}>
            <Text style={{ color: jaune, fontSize: RFValue(16) }}>
              SEASON {this.props.currentYear} IS NOT STARTED YET
            </Text>
          </View>
        )}
        {this.props.seasonStatus === 'FINISHED' && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 100,
            }}>
            <Text style={{ color: jaune, fontSize: RFValue(16) }}>SEASON {this.props.currentYear} IS FINISHED</Text>
          </View>
        )}

        {this.props.seasonStatus === 'BOWLSEASON' && (
          <View
            style={{
              // backgroundColor: noir,
              paddingVertical: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: RFValue(20),
                fontWeight: '400',
                lineHeight: 45,
                textAlign: 'center',
              }}>
              {'BOWL GAME STARTED'}
            </Text>
            <View
              style={{
                backgroundColor: noir,
                width: SCREEN_WIDTH - 40,
                paddingVertical: 50,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 15,
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: RFValue(39),
                  fontWeight: '400',
                  lineHeight: 45,
                  textAlign: 'center',
                }}>
                {'All Set? \nDon’t Forget \nto Make \nYour Picks.'}
              </Text>
            </View>
          </View>
        )}

        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={'Select the week'}
          options={weekList}
          cancelButtonIndex={15}
          // destructiveButtonIndex={1}
          onPress={index => {
            if (index !== weekList.length - 1)
              if (index + 1 >= this.props.currentWeek) {
                this.setState(
                  {
                    week: weekList[index],
                    weekSelected: index + 1,
                  },
                  () => {
                    this.getWeekG(index + 1)
                  },
                )
              } else {
                alert('You can only select the current week or the next')
              }
          }}
        />

        <ActionSheet
          ref={o => (this.conference = o)}
          title={'Select the conference.'}
          options={conferenceGroup().map(i => i.ConferenceName)}
          cancelButtonIndex={conferenceGroup().length - 1}
          //destructiveButtonIndex={1}
          onPress={index => {
            if (index === 0) {
              this.setState(
                {
                  ConferenceName: 'ALL',
                },
                () => {
                  this.props.getConferencesTeams('ALL', this.props.token)
                },
              )
            } else if (index > 0 && index < conferenceGroup().length - 1) {
              this.setState(
                {
                  ConferenceName: conferenceGroup()[index].ConferenceName,
                },
                () => {
                  this.props.getConferencesTeams(conferenceGroup()[index].ConferenceName, this.props.token)
                },
              )
            }
          }}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={visible}
          onDismiss={this._hideModal}
          style={{ backgroundColor: 'red' }}>
          <View
            style={{
              width: SCREEN_WIDTH - 100,
              flex: 1,
              backgroundColor: noir,
              paddingTop: 30,
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomColor: jaune,
                borderBottomWidth: 1,
                height: 40,
              }}>
              <Text style={{ color: jaune, fontSize: 15, fontWeight: 'bold' }}>{'Modal'}</Text>
              <Text
                style={{
                  marginBottom: 20,
                  color: jaune,
                }}
                onPress={this._hideModal}>
                Close
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

class MyPicks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      isSwitchOn: false,
    }
  }
  render() {
    const { checked, isSwitchOn } = this.state
    const { name, week, conference, showWeek, showConf } = this.props
    return (
      <View
        style={{
          width: '96%',
          backgroundColor: noir,
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginVertical: 20,
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',

            marginVertical: 20,
          }}>
          <TouchableOpacity
            onPress={showWeek}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',

              width: '49%',
              backgroundColor: gris,
              alignItems: 'center',
              paddingHorizontal: 20,
              height: RFValue(50),
            }}>
            <Text style={{ color: jaune, fontSize: RFValue(12), fontWeight: '400' }}>{week}</Text>
            <Ionicons name={'ios-arrow-down'} color={jaune} size={RFValue(20)} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showConf}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 7,
              width: '49%',
              backgroundColor: gris,
              alignItems: 'center',
              paddingHorizontal: 20,
              height: RFValue(50),
            }}>
            <Text style={{ color: jaune, fontSize: RFValue(12), fontWeight: '400' }}>
              {conference ? conference : ''}
            </Text>
            <Ionicons name={'ios-arrow-down'} color={jaune} size={RFValue(20)} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { user, conferenceTeams, conferences, token } = state.user
  const { bets, weekGames, currentYear, currentWeek, weekstartdate, seasonStatus } = state.game
  return {
    user,
    bets,
    weekGames,
    conferenceTeams,
    conferences,
    currentYear,
    currentWeek,
    token,

    weekstartdate,
    seasonStatus,
  }
}
export default connect(mapStateToProps, {
  getConferencesTeams,
  updateUserInfo,
})(Spreads)
