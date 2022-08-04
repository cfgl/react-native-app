import React, { Component } from 'react'
import { Text, View, FlatList, Image, Modal, ImageBackground, SafeAreaView, StatusBar } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { jaune, noir, gris } from '../styles/colors'
import { connect } from 'react-redux'
import { getSearchUsers } from '../redux/actions/user'
import { setHerInfoUser, getHerParlays } from '../redux/actions/otherUser'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ProfileStats from './profileStats'
import { Ionicons } from 'react-native-vector-icons'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { getPlayers } from '../services/players'
class searchplayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstQuery: '',
      visible: false,
      selectedUser: {},
      users: [],
    }
    // this.props.getSearchUsers(this.props.token)
  }
  _showModal = () => this.setState({ visible: true })
  _hideModal = () => this.setState({ visible: false })

  render() {
    const { firstQuery, visible } = this.state
    return (
      <View style={{ flex: 1 }}>
        <Searchbar
          placeholder="Search"
          placeholderTextColor={jaune}
          fontSize={RFValue(14)}
          style={{
            backgroundColor: gris,
            borderBottomColor: jaune,
            borderBottomWidth: 2,
          }}
          onChangeText={async query => {
            this.setState({ firstQuery: query }, async () => {
              if (query !== '') {
                const respGetPlayers = await getPlayers(query, this.props.token)
                if (respGetPlayers && respGetPlayers.data) {
                  console.log('respGetPlayers', respGetPlayers.data.length)
                  this.setState({ users: respGetPlayers.data })
                }
              } else {
                const respGetPlayers = await getPlayers('_____', this.props.token)
                if (respGetPlayers && respGetPlayers.data) {
                  console.log('respGetPlayers', respGetPlayers.data.length)
                  this.setState({ users: respGetPlayers.data })
                }
              }
            })
          }}
          value={firstQuery}
        />
        <FlatList
          data={this.state.users}
          style={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                this.props.setHerInfoUser({
                  _id: item._id,
                })
                this.props.navigation.navigate('ProfileStatistics')
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}>
              <Image
                source={
                  item.avatar && item.avatar.secure_url
                    ? { uri: item.avatar.secure_url }
                    : {
                        uri: 'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
                      }
                }
                style={{
                  width: RFValue(30),
                  height: RFValue(30),
                  borderRadius: RFValue(15),
                  backgroundColor: '#fff',
                }}
              />
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Arial',
                  fontSize: RFValue(14),
                  fontWeight: '400',

                  marginLeft: 10,
                }}>
                {item.fullname ? item.fullname : item.username}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />

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
              <ProfileStats herInfoUser={this.state.selectedUser} />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { users, token } = state.user
  return { users, token }
}
export default connect(mapStateToProps, {
  getSearchUsers,
  setHerInfoUser,
  getHerParlays,
})(searchplayer)
