import React, { Component } from 'react'
import { View, ScrollView, RefreshControl, Image, Text, StatusBar, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { logoutUser } from '../redux/actions/user'
import { KEYAPI } from '../redux/actionTypes'
import axios from 'axios'
import { getCurrentWeekGame, saveBet, updateBet, saveParlay, deleteParlay, myParlays } from '../redux/actions/game'
import { jaune, noir, gris } from '../styles/colors'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { getWeekGames } from '../services/games'
import { SCREEN_WIDTH } from '../utils/variables'
import { Searchbar } from 'react-native-paper'
import { getTeamById } from '../utils/functions'

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

class Pick extends Component {
  constructor(props) {
    super(props)
    this.state = {
      off: false,
      isSwitchOn:
        this.props.myParlay && this.props.myParlay.filter(i => i.week === this.props.currentWeek).length == 1
          ? true
          : false,
      checked: false,
      visible: false,
      refreshing: true,
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
      games: [],
      firstQuery: '',
    }
  }

  async componentDidMount() {
    const response = await getWeekGames(this.props.currentYear, this.props.currentWeek)
    if (response && response.data) {
      let datas = response.data.sort(function (a, b) {
        return new Date(a.Day) - new Date(b.Day)
      })
      this.setState({ games: datas })
    }
    this.setState({ refreshing: false })
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    // this.props.getCurrentWeekGame(this.props.currentYear, this.props.currentWeek)

    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }

  componentDidUpdate(prevProps) {
    if (this.props.route.name !== prevProps.route.name) console.log(JSON.stringify(this.props.route, null, 2))
  }

  formatTime = date => {
    const c = new Date(date)
    const h = c.getHours() > 9 ? c.getHours() : `0${c.getHours()}`
    const m = c.getMinutes() > 9 ? c.getMinutes() : `0${c.getMinutes()}`

    return h + ':' + m
  }

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          paddingVertical: 20,
        }}
        refreshControl={
          <RefreshControl tintColor={'#fff'} refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
        }>
        <StatusBar backgroundColor={gris} barStyle="light-content" />

        <Searchbar
          placeholder="Search"
          placeholderTextColor={jaune}
          fontSize={RFValue(14)}
          style={{
            backgroundColor: gris,
            borderBottomColor: jaune,
            borderBottomWidth: 2,
            marginBottom: 20,
          }}
          onChangeText={async query => {
            this.setState({ firstQuery: query }, async () => {})
          }}
          value={this.state.firstQuery}
        />
        <Text style={{ color: '#fff', marginHorizontal: 20, marginBottom: 10, alignSelf: 'center' }}>
          {'Last update: '}
          {this.props.lastUpdate
            ? new Date(this.props.lastUpdate).toLocaleDateString() + ' ' + this.formatTime(this.props.lastUpdate)
            : new Date(this.props.lastUpdate).toLocaleString()}{' '}
          {/* {this.props.lastUpdate.toLocaleString()} */}
        </Text>
        {this.state.games
          .map(m => {
            m.AwayTeamInfo = getTeamById(m.AwayTeamID)
            m.HomeTeamInfo = getTeamById(m.HomeTeamID)

            return m
          })
          .filter(f => JSON.stringify(f).toLocaleLowerCase().includes(this.state.firstQuery.toLocaleLowerCase()))

          .map(game => {
            return (
              <View>
                <View
                  style={{
                    width: '96%',

                    backgroundColor: jaune,
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    marginBottom: 20,
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: '#950338',
                      height: 30,
                      alignItems: 'center',
                      paddingHorizontal: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text style={{ color: jaune, fontSize: 15, fontWeight: 'bold' }}>
                        {game.DateTime
                          ? new Date(game.DateTime).toLocaleDateString() + ' ' + this.formatTime(game.DateTime)
                          : new Date(game.Day).toLocaleString()}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: jaune,
                      }}>
                      {game.Status.toUpperCase()}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: RFValue(80),
                        height: RFValue(80),
                        borderRadius: 100,
                        backgroundColor: '#fff',
                        fontWeight: '900',
                      }}>
                      <Image
                        source={{
                          uri: game.PointSpread < 0 ? game.HomeTeamInfo.TeamLogoUrl : game.AwayTeamInfo.TeamLogoUrl,
                        }}
                        style={{
                          width: RFValue(35),
                          height: RFValue(35),
                          borderRadius: 100,
                        }}
                      />
                      {/* <Text style={{ color: noir, fontSize: RFValue(10) }}>
                        {game.PointSpread && game.PointSpread < 0 ? game.HomeTeam : game.AwayTeam}
                      </Text> */}
                    </View>

                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 0,
                        flex: 1,
                      }}>
                      {game && game.Status !== 'Scheduled' ? (
                        <Text
                          style={{
                            color: noir,
                            fontSize: RFValue(25),
                            // fontFamily: "Monda",
                            fontWeight: 'bold',
                          }}>
                          {game.PointSpread && game.PointSpread < 0 ? game.HomeTeamScore : game.AwayTeamScore}
                          {' - '}
                          {game.PointSpread && game.PointSpread < 0 ? game.AwayTeamScore : game.HomeTeamScore}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: noir,
                            fontSize: RFValue(25),
                            // fontFamily: "Monda",
                            fontWeight: 'bold',
                          }}>
                          {'VS'}
                        </Text>
                      )}
                    </View>

                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: RFValue(80),
                        height: RFValue(80),
                        borderRadius: RFValue(40),
                        backgroundColor: '#fff',
                      }}>
                      <Image
                        source={{
                          uri: game.PointSpread < 0 ? game.AwayTeamInfo.TeamLogoUrl : game.HomeTeamInfo.TeamLogoUrl,
                        }}
                        style={{
                          width: RFValue(35),
                          height: RFValue(35),
                          borderRadius: 100,
                        }}
                      />
                      {/* <Text style={{ color: noir, fontSize: RFValue(10) }}>
                        {game.PointSpread && game.PointSpread < 0 ? game.AwayTeam : game.HomeTeam}
                      </Text> */}
                    </View>
                  </View>
                </View>
              </View>
            )
          })}

        <View style={{ height: 20 }} />
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  const { user, token, logged, bowlSeason } = state.user
  const { weekGames, bets, currentYear, currentWeek, myParlay, games, lastUpdate } = state.game
  return {
    user,
    bowlSeason,
    token,
    logged,
    weekGames,
    bets,
    currentYear,
    currentWeek,
    myParlay,
    games,
    lastUpdate,
  }
}
export default connect(mapStateToProps, {
  logoutUser,
  getCurrentWeekGame,
  saveBet,
  updateBet,
  saveParlay,
  deleteParlay,

  myParlays,
})(Pick)
