import * as React from 'react'
import { ImageBackground, TouchableOpacity, View, Text, Dimensions, Image } from 'react-native'
import { DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { SCREEN_WIDTH } from '../utils/variables'

import {
  Feeds,
  Pick,
  Signin,
  Signup,
  ForgetPassword,
  Onboarding,
  ShortList,
  Games,
  PickSheets,
  Rules,
  Faqs,
  ProfileTab,
  ProfileStats,
  Standings,
  Searchplayer,
  Conference,
  Bowlseason,
  WeekScores,
  UsersConditions,
} from '../screens'
import { FontAwesome5, Ionicons } from 'react-native-vector-icons'
import { connect } from 'react-redux'
import { jaune, noir, gris } from '../styles/colors'
import { SafeAreaView } from 'react-navigation'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgba(255, 255, 255,0.2)',
    background: gris,
  },
}

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const TopTab = createMaterialTopTabNavigator()

function MyPicks({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gris }}>
      <ImageBackground
        source={require('../images/cfgl2.jpg')}
        style={{
          height: RFValue(60),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
        resizeMode={'cover'}>
        <View style={{ width: 50, marginLeft: 5 }}>
          <Image source={require('../images/cfgltext.png')} style={{ resizeMode: 'contain', width: RFValue(50) }} />
        </View>
        <View style={{}}>
          <Text
            style={{
              color: jaune,
              fontFamily: 'Monda',
              fontSize: RFValue(15),
              fontWeight: '700',
            }}>
            {'PICK CENTER'}
          </Text>
        </View>

        <View style={{ width: 50, alignItems: 'flex-end', marginRight: 5 }}>
          <FontAwesome5
            style={{ padding: 10 }}
            name="cog"
            size={RFValue(24)}
            color={jaune}
            onPress={() => navigation.openDrawer()}
          />
        </View>
      </ImageBackground>

      <TopTab.Navigator
        tabPress={() => {}}
        tabBarOptions={{
          scrollEnabled: true,
          labelStyle: {
            fontSize: 10,
            color: jaune,
            fontFamily: 'Monda',
          },
          tabStyle: {
            width: Dimensions.get('window').width / 4,
          },
          style: {
            backgroundColor: noir,
          },
          indicatorStyle: {
            backgroundColor: jaune,
            height: 5,
          },
        }}>
        <TopTab.Screen name="Picks" component={Pick} />
        <TopTab.Screen name="Shortlist" component={ShortList} />
        <TopTab.Screen name="Spreads" component={Games} />
        <TopTab.Screen name="PickSheet" component={PickSheets} />
      </TopTab.Navigator>
    </SafeAreaView>
  )
}

function MyHelp({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gris }}>
      <ImageBackground
        source={require('../images/cfgl2.jpg')}
        style={{
          height: RFValue(60),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
        resizeMode={'cover'}>
        <View style={{ width: 50, marginLeft: 5 }}>
          <Image source={require('../images/cfgltext.png')} style={{ resizeMode: 'contain', width: RFValue(50) }} />
        </View>
        <View style={{}}>
          <Text
            style={{
              color: jaune,
              fontFamily: 'Monda',
              fontSize: RFValue(15),
              fontWeight: '700',
            }}>
            {'INFO'}
          </Text>
        </View>

        <View style={{ width: 50, alignItems: 'flex-end', marginRight: 5 }}>
          <FontAwesome5
            style={{ padding: 10 }}
            name="cog"
            size={RFValue(24)}
            color={jaune}
            onPress={() => navigation.openDrawer()}
          />
        </View>
      </ImageBackground>

      <Rules />
      {/* <TopTab.Navigator
        tabBarOptions={{
          scrollEnabled: true,
          labelStyle: {
            fontSize: 12,
            color: jaune,
            fontWeight: '800',
          },
          tabStyle: {
            width: Dimensions.get('window').width / 2,
          },
          style: {
            backgroundColor: noir,
            height: 50,
          },
          indicatorStyle: {
            backgroundColor: jaune,
            height: 5,
          },
        }}>
        <TopTab.Screen name="Rules" component={Rules} />
        <TopTab.Screen name="FAQ'S" component={Faqs} />
      </TopTab.Navigator>
   */}
    </SafeAreaView>
  )
}

function MyGroup({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gris }}>
      <ImageBackground
        source={require('../images/cfgl2.jpg')}
        style={{
          height: RFValue(60),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
        resizeMode={'cover'}>
        <View style={{ width: 50, marginLeft: 5 }}>
          <Image source={require('../images/cfgltext.png')} style={{ resizeMode: 'contain', width: RFValue(50) }} />
        </View>
        <View style={{}}>
          <Text
            style={{
              color: jaune,
              fontFamily: 'Monda',
              fontSize: RFValue(15),
              fontWeight: '700',
            }}>
            {'LEAGUE HUB'}
          </Text>
        </View>

        <View style={{ width: 50, alignItems: 'flex-end', marginRight: 5 }}>
          <FontAwesome5
            style={{ padding: 10 }}
            name="cog"
            size={RFValue(24)}
            color={jaune}
            onPress={() => navigation.openDrawer()}
          />
        </View>
      </ImageBackground>

      <TopTab.Navigator
        tabBarOptions={{
          scrollEnabled: true,
          labelStyle: {
            fontSize: 10,
            color: jaune,
          },
          tabStyle: {
            width: Dimensions.get('window').width / 3,
          },
          style: {
            backgroundColor: noir,
          },
          indicatorStyle: {
            backgroundColor: jaune,
            height: 2,
          },
        }}>
        <TopTab.Screen name="PROFILE" component={ProfileTab} />
        <TopTab.Screen name="STANDINGS" component={Standings} />
        <TopTab.Screen name="SEARCH PLAYER" component={Searchplayer} />
      </TopTab.Navigator>
    </SafeAreaView>
  )
}

function MyFeeds({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/cfgl2.jpg')}
        style={{
          height: RFValue(60),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
        resizeMode={'cover'}>
        <View style={{ width: 50, marginLeft: 5 }}>
          <Image source={require('../images/cfgltext.png')} style={{ resizeMode: 'contain', width: RFValue(50) }} />
        </View>
        <View style={{}}>
          <Text
            style={{
              color: jaune,
              fontFamily: 'Monda',
              fontSize: RFValue(15),
              fontWeight: '700',
            }}>
            {'NEWSFEED'}
          </Text>
        </View>

        <View style={{ width: 50, alignItems: 'flex-end', marginRight: 5 }}>
          <FontAwesome5
            style={{ padding: 10 }}
            name="cog"
            size={RFValue(24)}
            color={jaune}
            onPress={() => navigation.openDrawer()}
          />
        </View>
      </ImageBackground>

      <Stack.Navigator>
        <Stack.Screen
          name="Feed"
          component={Feeds}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

function MyBowl({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            color: jaune,
            fontFamily: 'Monda',
            fontSize: 15,
            fontWeight: '700',
            lineHeight: 22,
          }}>
          BOWL SEASON SETTINGS
        </Text>

        <FontAwesome5
          style={{ position: 'absolute', right: 0, padding: 15 }}
          name="cog"
          size={24}
          color={jaune}
          onPress={() => navigation.openDrawer()}
        />
      </ImageBackground>

      <Stack.Navigator>
        <Stack.Screen
          name="Feed"
          component={Bowlseason}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

function ProfileStatistics({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/cfgl2.jpg')}
        style={{
          height: RFValue(60),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
        resizeMode={'cover'}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 60, marginLeft: 5 }}>
          <Image
            source={require('../images/cfgltextback.png')}
            style={{ alignSelf: 'flex-start', resizeMode: 'contain', width: RFValue(60) }}
          />
        </TouchableOpacity>
        <View style={{}}>
          <Text
            style={{
              color: jaune,
              fontFamily: 'Monda',
              fontSize: RFValue(13),
              fontWeight: '700',
            }}>
            {'PROFILE STATS'}
          </Text>
        </View>

        <View style={{ width: 60, alignItems: 'flex-end', marginRight: 5 }}>
          <FontAwesome5
            style={{ padding: 10 }}
            name="cog"
            size={RFValue(24)}
            color={jaune}
            onPress={() => navigation.openDrawer()}
          />
        </View>
      </ImageBackground>

      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={ProfileStats}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

function Conference_({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/cfgl2.jpg')}
        style={{
          height: RFValue(60),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
        resizeMode={'cover'}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 60, marginLeft: 5 }}>
          <Image
            source={require('../images/cfgltextback.png')}
            style={{ alignSelf: 'flex-start', resizeMode: 'contain', width: RFValue(60) }}
          />
        </TouchableOpacity>
        <View style={{}}>
          <Text
            style={{
              color: jaune,
              fontFamily: 'Monda',
              fontSize: RFValue(13),
              fontWeight: '700',
            }}>
            {'CFGL CONFERENCE'}
          </Text>
        </View>

        <View style={{ width: 60, alignItems: 'flex-end', marginRight: 5 }}>
          <FontAwesome5
            style={{ padding: 10 }}
            name="cog"
            size={RFValue(24)}
            color={jaune}
            onPress={() => navigation.openDrawer()}
          />
        </View>
      </ImageBackground>

      <Stack.Navigator>
        <Stack.Screen
          name="Conference"
          component={Conference}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

function Scores_({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../images/cfgl2.jpg')}
        style={{
          height: RFValue(60),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
        resizeMode={'cover'}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 60, marginLeft: 5 }}>
          <Image
            source={require('../images/cfgltextback.png')}
            style={{ alignSelf: 'flex-start', resizeMode: 'contain', width: RFValue(60) }}
          />
        </TouchableOpacity>
        <View style={{}}>
          <Text
            style={{
              color: jaune,
              fontFamily: 'Monda',
              fontSize: RFValue(13),
              fontWeight: '700',
            }}>
            {'SCORES'}
          </Text>
        </View>
        <View style={{ width: 60, alignItems: 'flex-end', marginRight: 5 }}>
          <FontAwesome5
            style={{ padding: 10 }}
            name="cog"
            size={RFValue(24)}
            color={jaune}
            onPress={() => navigation.openDrawer()}
          />
        </View>
      </ImageBackground>
      <Stack.Navigator>
        <Stack.Screen
          name="Scores"
          component={WeekScores}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

function MyHomeTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
        showIndicator: false,

        titleStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        style: {
          borderWidth: 0,
          backgroundColor: noir,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          shadowColor: '#000000',
          shadowOpacity: 0.6,
          elevation: 9,
          shadowRadius: 5,
          shadowOffset: {
            height: 4,
            width: 0,
          },
          borderTopColor: 'transparent',
          height: RFValue(70),
        },
        activeBackgroundColor: 'transparent',
        inactiveBackgroundColor: '#fff',

        labelStyle: {},
        iconStyle: {},
        tabStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: noir,
        },
      }}>
      <Tab.Screen
        name="Feeds"
        component={MyFeeds}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: color,

                      width: RFValue(45),
                      height: RFValue(40),
                      padding: RFValue(10),
                    }
                  : {
                      width: RFValue(45),
                      height: RFValue(40),
                      padding: RFValue(10),
                    }
              }
              name="newspaper"
              size={RFValue(20)}
              color={jaune}
              //{focused ? "rgb(237,214,156)" : "rgb(237,214,156)"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Picks"
        component={MyPicks}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: color,

                      width: RFValue(45),
                      height: RFValue(40),
                      padding: RFValue(10),
                    }
                  : {
                      width: RFValue(45),
                      height: RFValue(40),
                      padding: RFValue(10),
                    }
              }
              name="edit"
              size={RFValue(20)}
              color={jaune}
              //{focused ? "rgb(237,214,156)" : "rgb(237,214,156)"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Group"
        component={MyGroup}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: color,

                      width: RFValue(45),
                      height: RFValue(40),
                      padding: RFValue(10),
                    }
                  : {
                      width: RFValue(45),
                      height: RFValue(40),
                      padding: RFValue(10),
                    }
              }
              name="users"
              size={RFValue(20)}
              color={jaune}
              //{focused ? "rgb(237,214,156)" : "rgb(237,214,156)"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Help"
        component={MyHelp}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: color,

                      width: RFValue(45),
                      height: RFValue(40),
                      paddingLeft: RFValue(20),
                      paddingTop: RFValue(10),
                    }
                  : {
                      width: RFValue(45),
                      height: RFValue(40),
                      paddingLeft: RFValue(20),
                      paddingTop: RFValue(10),
                    }
              }
              name="info"
              size={RFValue(20)}
              color={jaune}
              //{focused ? "rgb(237,214,156)" : "rgb(237,214,156)"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

function MyHomeTabsBowl() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
        showIndicator: false,

        titleStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        style: {
          borderWidth: 0,
          backgroundColor: noir,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          shadowColor: '#000000',
          shadowOpacity: 0.6,
          elevation: 9,
          shadowRadius: 5,
          shadowOffset: {
            height: 4,
            width: 0,
          },
          borderTopColor: 'transparent',
        },
        activeBackgroundColor: 'transparent',
        inactiveBackgroundColor: '#fff',

        labelStyle: { fontFamily: 'Monda' },
        iconStyle: {},
        tabStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: noir,
        },
      }}>
      <Tab.Screen
        name="Feeds"
        component={MyBowl}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: color,
                      paddingHorizontal: 20,
                      paddingVertical: 7,
                    }
                  : {}
              }
              name="newspaper"
              size={size}
              color={jaune}
              //{focused ? "rgb(237,214,156)" : "rgb(237,214,156)"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Picks"
        component={MyPicks}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: color,
                      paddingHorizontal: 20,
                      paddingVertical: 7,
                    }
                  : {}
              }
              name="edit"
              size={size}
              color={jaune}
              //{focused ? "rgb(237,214,156)" : "rgb(237,214,156)"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Group"
        component={MyGroup}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: color,
                      paddingHorizontal: 20,
                      paddingVertical: 7,
                    }
                  : {}
              }
              name="users"
              size={size}
              color={jaune}
              //{focused ? "rgb(237,214,156)" : "rgb(237,214,156)"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Help"
        component={MyHelp}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: color,
                      paddingHorizontal: 20,
                      paddingVertical: 7,
                    }
                  : {}
              }
              name="info"
              size={size}
              color={jaune}
              //{focused ? "rgb(237,214,156)" : "rgb(237,214,156)"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

function App(props) {
  return (
    <Stack.Navigator>
      {props.logged == false ? (
        <>
          {props.hasBoarded === false ? (
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{
                headerShown: false,
                headerMode: 'none',
              }}
            />
          ) : null}

          <Stack.Screen
            name="Signin"
            component={Signin}
            options={{
              headerShown: false,
              headerMode: 'none',
            }}
          />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPassword}
            options={{
              headerShown: false,
              headerMode: 'none',
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={({}) => ({
              headerShown: false,
              headerMode: 'none',
            })}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="MyHomeTabs"
            component={MyHomeTabs}
            options={{
              headerShown: false,
              headerMode: 'none',
            }}
          />

          <Stack.Screen
            name="Conference"
            component={Conference_}
            options={{
              headerShown: false,
              headerMode: 'none',
            }}
          />
          <Stack.Screen
            name="Scores"
            component={Scores_}
            options={{
              headerShown: false,
              headerMode: 'none',
            }}
          />
          <Stack.Screen
            name="UsersConditions"
            component={UsersConditions}
            options={{
              headerShown: false,
              headerMode: 'none',
            }}
          />

          <Stack.Screen
            name="ProfileStatistics"
            component={ProfileStatistics}
            options={({ navigation, route }) => ({
              headerShown: false,
              headerMode: 'none',
            })}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

const mapStateToProps = state => {
  const { user, logged, hasBoarded } = state.user
  return { user, logged, hasBoarded }
}

export default connect(mapStateToProps, {})(App)
