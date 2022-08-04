import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import _ from 'lodash'
import { jaune, gris } from '../styles/colors'
import { Ionicons } from 'react-native-vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { setHerInfoUser, getHerParlays } from '../redux/actions/otherUser'
import ProfileStats from './profileStats'
//import BackgroundFetch from "react-native-background-fetch";
import { conferenceGroup } from '../datas/conference'

//import {Appearance} from "react-native-appearance";
import {
  getConferences,
  setUserConference,
  getGroups,
  updateUserInfo,
  logoutUser,
  setBowlSeason,
} from '../redux/actions/user'

import {
  setGameStatus,
  getPlayers,
  getPlayersByWeek,
  getWeekBets,
  getBets,
  setCurrentSeasonWeek,
  getCurrentWeekGame,
  setWeekDate,
} from '../redux/actions/game'

import ActionSheet from 'react-native-actionsheet'

class feeds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      conferenceCFB: this.props.user.conferenceCFB ? this.props.user.conferenceCFB : '',
      isBowlSeason: this.props.bowlSeason,
      refreshing: false,
    }

    this.props.setCurrentSeasonWeek()
    this.props.setWeekDate()
  }

  componentDidMount() {
    this._retrieveData()
  }

  componentDidUpdate(prevProps) {}

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if (value !== null) {
        // We have data!!
        // console.log(value)
        if (this.props.user && (!this.props.user.pushUserId || this.props.user.pushUserId === '')) {
          this.props.updateUserInfo({ pushUserId: value }, this.props.user.id, this.props.token)
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  _showModal = () => this.setState({ visible: true })

  _hideModal = () => this.setState({ visible: false })

  onRefresh = () => {
    this.props.setCurrentSeasonWeek()
    this.props.setWeekDate()
    this.setState({ refreshing: true })
    this.props.getPlayers(null, this.props.token)
    let prevWeek = this.props.currentWeek - 1
    this.props.getPlayersByWeek(prevWeek, this.props.token)

    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 2000)
  }

  render() {
    const { popular, popularPick, visible } = this.state
    return (
      <View style={{ flex: 1 }}>
        {/* ////////////////////////////////////////////////////////////////////////////// */}
        <StatusBar backgroundColor={gris} barStyle="light-content" />
        <View
          style={{
            height: 73,

            width: '100%',
            backgroundColor: '#edd798',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              color: '#191919',
              fontFamily: 'monda',
              fontSize: 12,
              fontWeight: '700',
              lineHeight: 24,
            }}>
            {` WEEK 1 WILL START IN ${parseInt(
              (new Date(`${this.props.weekstartdate[this.props.currentWeek - 1].date}.000Z`).getTime() -
                new Date().getTime()) /
                (24 * 3600 * 1000),
            )} DAY(S)`}
          </Text>
        </View>
        <ScrollView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          style={{ flex: 1, marginTop: 0, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}>
          <View>
            <Text
              style={{
                width: 217,
                height: 116,
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: 30,
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}>
              SEASON {this.props.currentYear} PREPARING
            </Text>
          </View>

          {this.props.user && (this.props.user.conferenceCFB || this.props.user.conferenceCFB === '') ? (
            <View
              style={{
                backgroundColor: '#191919',
                paddingVertical: 47,
                paddingHorizontal: 20,
                width: '95%',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 35,
                  fontWeight: '400',
                }}>
                {'It’s Game Time.'}
              </Text>

              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 16,
                  fontWeight: '700',
                  lineHeight: 28,
                  marginTop: 10,
                }}>
                {'PICK YOUR POWER CONFERENCE'}
              </Text>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Monda',
                  fontSize: 14,
                  fontWeight: '400',
                  lineHeight: 24,
                  lineHeight: 30,
                  marginTop: 10,
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                {
                  'The regular season is starting soon. That means it’s time for you to select your Power Conference. This selection cannot be changed once done Pick Wisely.'
                }
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.selectedConference.show()
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: 50,
                  width: '100%',
                  backgroundColor: gris,
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    color: jaune,
                    fontSize: 15,
                    // fontFamily: "monda",
                    fontWeight: '400',
                    width: '90%',
                  }}>
                  {this.state.conferenceCFB && this.state.conferenceCFB
                    ? this.state.conferenceCFB
                    : 'Select your Power Division'}
                </Text>
                <Ionicons name={'ios-arrow-down'} color={jaune} size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.updateUserInfo(
                    { conferenceCFB: this.state.conferenceCFB },
                    this.props.user.id,
                    this.props.token,
                  )
                }}
                style={{
                  height: 50,
                  width: '50%',
                  backgroundColor: jaune,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    color: '#191919',
                    fontFamily: 'monda',
                    fontSize: 19,
                    fontWeight: '700',
                  }}>
                  {'SUBMIT'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={{
              backgroundColor: '#191919',

              width: '95%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 50,
              paddingHorizontal: 10,
              marginVertical: 20,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: '#edd798',
                // fontFamily: "Monda",
                fontSize: 39,
                fontWeight: '400',
                lineHeight: 40,
                textAlign: 'center',
              }}>
              {'You’ve been drafted.'}
            </Text>

            <Text
              style={{
                width: 250,
                color: '#edd798',
                // fontFamily: "Monda",
                fontSize: 16,
                lineHeight: 30,
                marginTop: 10,
                textAlign: 'center',
              }}>
              {`YOU ARE NOW PART OF “${
                this.props.user && this.props.user.group && this.props.user.group.name ? this.props.user.group.name : ''
              }”`}
            </Text>
            <Image
              source={
                this.props.user && this.props.user.group && this.props.user.group.image
                  ? { uri: this.props.user.group.image.url }
                  : require('../images/groupima.png')
              }
              style={{ width: '80%', height: 200, resizeMode: 'contain' }}
            />
            <TouchableOpacity
              onPress={() => {
                this.props.props.navigation.navigate('Conference')
              }}
              style={{
                height: 50,
                width: '90%',
                backgroundColor: jaune,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Monda',
                  fontSize: 13,
                  fontWeight: '700',
                }}>
                {'VIEW YOUR CFGL CONFERENCE'}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: '#191919',
              height: 500,
              width: '95%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 20,
              paddingHorizontal: 10,
              marginVertical: 20,
              alignSelf: 'center',
            }}>
            <Image
              source={require('../images/launch.png')}
              style={{
                width: 150,
                height: 150,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: 30,
                fontWeight: '400',
                lineHeight: 35,
                textAlign: 'center',
                marginTop: 20,
              }}>
              {'Championship Week'}
            </Text>

            <Text
              style={{
                width: 280,
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: 14,
                fontWeight: '400',
                lineHeight: 24,
                lineHeight: 30,
                marginTop: 10,
                textAlign: 'center',
                marginTop: 20,
              }}>
              {'The time to select 5 of the 10 conference championship games and assign them a point value.'}
            </Text>

            {/* <TouchableOpacity
              onPress={() => {}}
              style={{
                height: 50,
                width: '50%',
                backgroundColor: jaune,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                marginTop: 30,
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Monda',
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                {'CONTINUE'}
              </Text>
            </TouchableOpacity> */}
          </View>

          <View
            style={{
              backgroundColor: '#191919',
              height: 400,
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
                fontSize: 30,
                fontWeight: '400',
                lineHeight: 35,
                textAlign: 'center',
                marginTop: 20,
              }}>
              {'How Championship Works'}
            </Text>

            <Text
              style={{
                width: 300,
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: 14,
                fontWeight: '400',
                lineHeight: 24,
                lineHeight: 30,
                marginTop: 10,
                textAlign: 'center',
                marginTop: 20,
              }}>
              {
                'Each game has a set amount of points ranging from 5 to 25 pts. You can always re-assign those points value later on by  going to the Picks tab in the Pick Center. Note: Once a game has started, you can no longer change its point value.'
              }
            </Text>

            {/* <TouchableOpacity
              onPress={() => {}}
              style={{
                height: 50,
                width: '50%',
                backgroundColor: jaune,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                marginTop: 50,
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Monda',
                  fontSize: 15,
                  fontWeight: '700',
                }}>
                {'UNDERTOOD'}
              </Text>
            </TouchableOpacity> */}
          </View>

          <View
            style={{
              backgroundColor: '#191919',
              height: 450,
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
                lineHeight: 35,
              }}>
              {'Bowl Games'}
            </Text>

            <Text
              style={{
                color: '#edd798',
                // fontFamily: 'Monda',
                fontSize: 16,
                fontWeight: '700',
                lineHeight: 28,
                marginTop: 10,
              }}>
              {' How it Works?'}
            </Text>
            <Text
              style={{
                color: '#edd798',
                fontFamily: 'Monda',
                fontSize: 14,
                fontWeight: '400',
                lineHeight: 24,
                lineHeight: 30,
                marginTop: 10,
                textAlign: 'center',
                marginTop: 20,
              }}>
              {
                'There are 38 Bowl Games. You must pick all 38 games and then assign them a point value from 1 through 38. Your 38 game is worth 38 points and your 1 game is worth 1 point. Your 15 game is worth 15 points, and so on and so forth. You can only have one game of each value. You may pick the spread or the over/under. Yes, you can pick $lines but NO parlays or stacking.'
              }
            </Text>

            {/* <TouchableOpacity
              onPress={() => {}}
              style={{
                height: 50,
                width: '50%',
                backgroundColor: jaune,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                marginTop: 30,
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Monda',
                  fontSize: 19,
                  fontWeight: '700',
                }}>
                {'SUBMIT'}
              </Text>
            </TouchableOpacity> */}
          </View>

          <ActionSheet
            ref={o => (this.selectedConference = o)}
            title={'PICK YOUR POWER DIVISION'}
            options={conferenceGroup().map(i => i.ConferenceName)}
            cancelButtonIndex={conferenceGroup().length - 1}
            // destructiveButtonIndex={1}
            onPress={index => {
              if (index !== conferenceGroup().length - 1)
                this.setState({
                  conferenceCFB: conferenceGroup()[index].ConferenceName,
                })
            }}
          />
        </ScrollView>

        {/* )} */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={visible}
          onDismiss={this._hideModal}
          style={{ backgroundColor: 'transparent', paddingTop: 0 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={gris} barStyle={'dark-content'} />
            <View
              style={{
                width: '100%',
                flex: 1,
                backgroundColor: gris,
              }}>
              <ImageBackground
                source={require('../images/cfglheader.png')}
                style={{
                  height: 65,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                resizeMode={'contain'}>
                <Text
                  style={{
                    marginLeft: 60,
                    color: jaune,

                    fontFamily: 'Monda',
                    fontSize: 15,
                    fontWeight: '700',
                    lineHeight: 22,
                  }}></Text>
                <Ionicons
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 25,
                    paddingRight: 50,
                    paddingLeft: 3,
                  }}
                  name="ios-arrow-back"
                  size={24}
                  color={jaune}
                  onPress={() => this._hideModal()}
                />
              </ImageBackground>
              <ProfileStats />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const {
    user,
    conferences,
    conference,
    groups,
    bowlSeason,

    token,
  } = state.user
  const { statusGame, weekBets, players, playersByWeek, currentYear, currentWeek, seasonStatus, weekstartdate } =
    state.game
  return {
    user,
    token,
    conferences,
    weekBets,
    conference,
    statusGame,
    currentYear,
    currentWeek,
    groups,
    players,
    playersByWeek,
    bowlSeason,
    weekstartdate,
    seasonStatus,
  }
}

export default connect(mapStateToProps, {
  getCurrentWeekGame,
  getConferences,
  setUserConference,
  getGroups,
  getWeekBets,
  updateUserInfo,
  logoutUser,
  setGameStatus,
  getPlayers,
  getPlayersByWeek,
  setBowlSeason,
  getBets,
  setCurrentSeasonWeek,
  getHerParlays,
  setHerInfoUser,
  setWeekDate,
})(feeds)
