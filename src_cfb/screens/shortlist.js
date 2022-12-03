import React, { Component } from 'react'
import { Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native'
import _ from 'lodash'
import { Ionicons } from 'react-native-vector-icons'
import { connect } from 'react-redux'
import { jaune, gris } from '../styles/colors'
import { Header } from '../components'
import { updateUserInfo } from '../redux/actions/user'
import { gameString } from '../utils/functions'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

class Shortlist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      list: [
        {
          value: 'power game',
          label: 'POWER CONFERENCE GAMES (AAC)',
        },
        {
          value: 'binding game',
          label: 'BINDING CONFERENCE GAMES',
        },
        { value: 'pick', label: 'FREE GAMES' },
      ],
      favorites:
        this.props.user && this.props.user.favoritesCFB
          ? this.props.user.favoritesCFB.filter(f => f.Season.toString() === this.props.currentYear.toString())
          : [],
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.favoritesCFB !== this.props.user.favoritesCFB) {
      this.setState({
        favorites: this.props.user.favoritesCFB.filter(f => f.Season.toString() === this.props.currentYear.toString()),
      })
    }
  }

  betList = (bets, type) => {
    let bet = bets.filter(i => i.type.value.includes(type))
    if (bet.length > 0) {
      return bet
    } else {
      return []
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    //alert("ll");

    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }
  render() {
    let bindingConf = this.props.currentWeek < 14 && this.props.weekstartdate[this.props.currentWeek - 1].conference
    bindingConf = bindingConf === 'Power Conf' ? this.props.user.conferenceCFB : bindingConf

    return (
      <ScrollView
        refreshControl={
          <RefreshControl tintColor={'#fff'} refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
        }>
        <Header
          title={`POWER CONFERENCE GAMES (${
            this.props.user && this.props.user.conferenceCFB ? this.props.user.conferenceCFB : ''
          })`}
        />

        {this.state.favorites
          .filter(f => f.Season.toString() === this.props.currentYear.toString() && f.Week === this.props.currentWeek)
          .map((item, index) => {
            if (
              (item.HomeTeamInfo &&
                item.HomeTeamInfo.Conference &&
                item.HomeTeamInfo.Conference.toLowerCase().includes(this.props.user.conferenceCFB.toLowerCase())) ||
              (item.AwayTeamInfo &&
                item.AwayTeamInfo.Conference &&
                item.AwayTeamInfo.Conference.toLowerCase().includes(this.props.user.conferenceCFB.toLowerCase()))
            ) {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: gris,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                  }}>
                  <Text
                    style={{
                      width: '60%',
                      color: jaune,
                      color: '#edd798',
                      fontFamily: 'Arial',
                      fontSize: RFValue(12),
                      fontWeight: '600',
                    }}>
                    {gameString(item)}
                  </Text>
                  <Text
                    style={{
                      color: jaune,
                      color: '#edd798',
                      fontFamily: 'Arial',
                      fontSize: RFValue(12),
                      fontWeight: '600',
                    }}>
                    {new Date(item.DateTime).toLocaleTimeString()}
                  </Text>

                  <TouchableOpacity
                    style={{ paddingHorizontal: 10 }}
                    onPress={() => {
                      _.remove(this.state.favorites, n => {
                        return n.GlobalGameID === item.GlobalGameID
                      })

                      this.setState({ favorites: this.state.favorites }, () => {
                        this.props.updateUserInfo(
                          {
                            favoritesCFB: this.state.favorites,
                          },
                          this.props.user.id,
                          this.props.token,
                        )
                      })
                    }}>
                    <Ionicons
                      size={RFValue(26)}
                      name={'ios-star'}
                      style={{}}
                      color={
                        this.state.favorites.filter(a => a.GlobalGameID === item.GlobalGameID).length > 0
                          ? jaune
                          : 'rgb(127,10,57)'
                      }
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            }
          })}
        <Header title={`BINDING CONFERENCE GAMES (${bindingConf ? bindingConf : ''})`} />
        {this.state.favorites
          .filter(f => f.Season.toString() === this.props.currentYear.toString() && f.Week === this.props.currentWeek)

          .map((item, index) => {
            if (
              bindingConf &&
              ((item.HomeTeamInfo &&
                item.HomeTeamInfo.Conference &&
                item.HomeTeamInfo.Conference.toLowerCase().includes(bindingConf.toLowerCase())) ||
                (item.AwayTeamInfo &&
                  item.AwayTeamInfo.Conference &&
                  item.AwayTeamInfo.Conference.toLowerCase().includes(bindingConf.toLowerCase())))
            ) {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: gris,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                  }}>
                  <Text
                    style={{
                      width: '60%',
                      color: jaune,
                      color: '#edd798',
                      fontFamily: 'Arial',
                      fontSize: RFValue(12),
                      fontWeight: '600',
                    }}>
                    {gameString(item)}
                  </Text>
                  <Text
                    style={{
                      color: jaune,
                      color: '#edd798',
                      fontFamily: 'Arial',
                      fontSize: RFValue(12),
                      fontWeight: '600',
                    }}>
                    {new Date(item.DateTime).toLocaleTimeString()}
                  </Text>

                  <TouchableOpacity
                    style={{ paddingHorizontal: 10 }}
                    onPress={() => {
                      _.remove(this.state.favorites, n => {
                        return n.GlobalGameID === item.GlobalGameID
                      })

                      this.setState({ favorites: this.state.favorites }, () => {
                        this.props.updateUserInfo(
                          {
                            favoritesCFB: this.state.favorites,
                          },
                          this.props.user.id,
                          this.props.token,
                        )
                      })
                    }}>
                    <Ionicons
                      size={RFValue(26)}
                      name={'ios-star'}
                      style={{}}
                      color={
                        this.state.favorites.filter(a => a.GlobalGameID === item.GlobalGameID).length > 0
                          ? jaune
                          : 'rgb(127,10,57)'
                      }
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            }
          })}
        <Header title={'FREE GAMES'} />
        {this.state.favorites
          .filter(f => f.Season.toString() === this.props.currentYear.toString() && f.Week === this.props.currentWeek)

          .map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: gris,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  width: '60%',
                  color: jaune,
                  color: '#edd798',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '600',
                }}>
                {gameString(item)}
              </Text>
              <Text
                style={{
                  color: jaune,
                  color: '#edd798',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '600',
                }}>
                {new Date(item.DateTime).toLocaleTimeString()}
              </Text>

              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={() => {
                  _.remove(this.state.favorites, n => {
                    return n.GlobalGameID === item.GlobalGameID
                  })

                  this.setState({ favorites: this.state.favorites }, () => {
                    this.props.updateUserInfo(
                      {
                        favoritesCFB: this.state.favorites,
                      },
                      this.props.user.id,
                      this.props.token,
                    )
                  })
                }}>
                <Ionicons
                  size={RFValue(26)}
                  name={'ios-star'}
                  style={{}}
                  color={
                    this.state.favorites.filter(a => a.GlobalGameID === item.GlobalGameID).length > 0
                      ? jaune
                      : 'rgb(127,10,57)'
                  }
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  const { user, token } = state.user
  const { bets, weekstartdate, currentWeek, currentYear } = state.game
  return { user, bets, token, weekstartdate, currentWeek, currentYear }
}
export default connect(mapStateToProps, { updateUserInfo })(Shortlist)
