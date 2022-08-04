import React, { Component } from 'react'
import { View, RefreshControl, Text, ScrollView, TouchableOpacity } from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { SCREEN_WIDTH } from '../utils/variables'
import { jaune, noir, gris } from '../styles/colors'
import { Ionicons } from 'react-native-vector-icons'
import { connect } from 'react-redux'
import { getWeekBets, getGroupBets, groupParlays, setGameStatus } from '../redux/actions/game'
import { getUsersGroup } from '../redux/actions/user'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { getAllPlayersStanding } from '../services/players'

import { setHerInfoUser, getHerParlays } from '../redux/actions/otherUser'
import { points, parleyPoints, perfectoPoints } from '../utils/functions'

class standings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      allPlayers: [],
      group: this.props.user.group ? this.props.user.group : {},
    }
  }

  componentDidMount() {
    this.playerInfo(this.props.user.group._id)
    // this.props.getWeekBets(this.props.currentYear, this.props.currentWeek, this.props.token)
    // this.props.getGroupBets(this.props.user.group._id, this.props.token)
    // this.props.getUsersGroup(this.props.user.group._id, this.props.token)
    // this.props.groupParlays(this.props.user.group._id, this.props.token)
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.statusGame !== this.props.statusGame &&
      (this.props.statusGame === 'SUCCESS_BET_UPDATE' ||
        this.props.statusGame === 'SUCCESS_SAVE_PARLAY' ||
        this.props.statusGame === 'SUCCESS_DELETE_PARLAY')
    ) {
      console.log('ppppp')

      this.props.setGameStatus('')
      // this.props.getGroupBets(this.state.group._id, this.props.token)
      // this.props.getUsersGroup(this.state.group._id, this.props.token)
      // this.props.groupParlays(this.state.group._id, this.props.token)
    }
  }
  showGroup = () => {
    this.group_.show()
  }
  playerInfo = async id => {
    const respGetPlayers2 = await getAllPlayersStanding(id, this.props.token)
    if (respGetPlayers2 && respGetPlayers2.data) {
      console.log('respGetPlayers2', respGetPlayers2.data.length)
      this.setState({ allPlayers: respGetPlayers2.data })
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    // this.props.getGroupBets(this.state.group._id, this.props.token)
    // this.props.getUsersGroup(this.state.group._id, this.props.token)
    // this.props.groupParlays(this.state.group._id, this.props.token)

    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }

  render() {
    const { group } = this.state
    return (
      <View style={{ flex: 1 }}>
        <MyPicks
          name="CFGL CONFERENCE"
          group={group && group.name ? group.name : 'SELECT CFGL CONFERENCE'}
          showGroup={() => this.showGroup()}
        />
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{}}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
            {this.state.allPlayers
              .filter(i => i.user.group === this.state.group.id || this.state.group.name === 'All')
              .sort((a, b) => b.total > a.total)
              .map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.setHerInfoUser({
                      _id: item.user._id,
                    })
                    this.props.navigation.navigate('ProfileStatistics')
                  }}
                  key={index}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: index % 2 == 0 ? '#191919' : '#282828',
                    height: 50,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      width: 40,
                      color: '#edd798',
                      fontFamily: 'Arial',
                      fontSize: RFValue(14),
                      fontWeight: '600',
                      padding: 10,
                    }}>
                    {index < 9 ? '0' + (index + 1) : index + 1}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: '#edd798',
                      fontFamily: 'Arial',
                      fontSize: RFValue(14),
                      fontWeight: '300',
                      padding: 10,
                      marginLeft: 4,
                    }}>
                    #{item.user.username}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 5,
                      textAlign: 'right',
                      color: '#edd798',
                      fontFamily: 'Monda',
                      fontSize: RFValue(11),
                      fontWeight: '700',
                      padding: 10,
                    }}>
                    {item.total}
                    {' pts'}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
        <ActionSheet
          ref={o => (this.group_ = o)}
          title={'Select the conference.'}
          options={[{ name: 'All' }]
            .concat(this.props.groups)
            .concat([{ name: 'Cancel' }])
            .map(i => i.name)}
          cancelButtonIndex={this.props.groups.concat([{ name: 'All' }, { name: 'Cancel' }]).length - 1}
          // destructiveButtonIndex={1}
          onPress={index => {
            if (index > 0 && index < this.props.groups.concat([{ name: 'All' }, { name: 'Cancel' }]).length - 1) {
              this.setState({ group: this.props.groups[index - 1] }, () => {
                this.playerInfo(this.props.groups[index - 1]._id)
              })
            } else if (index == 0) {
              this.setState({ group: { name: 'All' } }, () => {})
            }
          }}
        />
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
    const { name, group, showGroup } = this.props
    return (
      <View
        style={{
          width: SCREEN_WIDTH - 40,

          backgroundColor: noir,
          paddingVertical: 20,
          paddingHorizontal: 20,
          marginVertical: 20,
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',

            marginVertical: 20,
          }}>
          <TouchableOpacity
            onPress={showGroup}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',

              width: '100%',
              backgroundColor: gris,
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
            <Text style={{ color: jaune, fontSize: RFValue(12), fontWeight: '400' }}>{group}</Text>
            <Ionicons name={'ios-arrow-down'} color={jaune} size={RFValue(20)} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { user, token, conferences, conference, groups, usersgroup } = state.user
  const { bets, weekBets, groupBets, currentYear, currentWeek, myParlay, groupParlay, statusGame, players } = state.game
  return {
    user,
    token,
    players,
    conferences,
    conference,
    bets,
    groups,
    usersgroup,
    weekBets,
    groupBets,
    currentYear,
    currentWeek,
    myParlay,
    groupParlay,
    statusGame,
  }
}
export default connect(mapStateToProps, {
  setGameStatus,
  getWeekBets,
  getUsersGroup,
  getGroupBets,
  groupParlays,
  setHerInfoUser,
  getHerParlays,
})(standings)
