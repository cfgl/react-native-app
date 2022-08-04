import * as React from 'react'
import { View, Image, ImageBackground, Text, Dimensions, StatusBar, TouchableOpacity } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import {
  Feeds,
  Groups,
  Pick,
  Signin,
  Signup,
  ForgetPassword,
  Profile,
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

function MyAuth(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={({ navigation, route }) => ({
          headerShown: false,
          headerTintColor: noir,
          headerStyle: {
            backgroundColor: noir,
            borderBottomColor: 'transparent',
            borderBottomWidth: 7,
          },
        })}
      />
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

function MyPicks({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gris }}>
      <ImageBackground
        source={require('../images/cfglheader.png')}
        style={{
          height: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode={'cover'}>
        <Text
          style={{
            color: jaune,
            fontFamily: 'Monda',
            fontSize: 15,
            fontWeight: '700',
            lineHeight: 22,
          }}>
          PICK CENTER
        </Text>

        <FontAwesome5
          style={{ position: 'absolute', right: 0, padding: 15 }}
          name="cog"
          size={24}
          color={jaune}
          onPress={() => navigation.openDrawer()}
        />
      </ImageBackground>

      <TopTab.Navigator
        tabPress={() => {
          alert('kk')
        }}
        tabBarOptions={{
          scrollEnabled: true,
          labelStyle: {
            fontSize: 11,
            color: jaune,
            fontFamily: 'Monda',
          },
          tabStyle: {
            width: Dimensions.get('window').width / 4,
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
        source={require('../images/cfglheader.png')}
        style={{
          height: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode={'cover'}>
        <Text
          style={{
            color: jaune,
            fontFamily: 'Monda',
            fontSize: 15,
            fontWeight: '700',
            lineHeight: 22,
          }}>
          INFO
        </Text>

        <FontAwesome5
          style={{ position: 'absolute', right: 0, padding: 15 }}
          name="cog"
          size={24}
          color={jaune}
          onPress={() => navigation.openDrawer()}
        />
      </ImageBackground>

      <TopTab.Navigator
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
    </SafeAreaView>
  )
}

function MyGroup({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gris }}>
      <ImageBackground
        source={require('../images/cfglheader.png')}
        style={{
          height: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode={'cover'}>
        <Text
          style={{
            color: jaune,
            fontFamily: 'Monda',
            fontSize: 15,
            fontWeight: '700',
            lineHeight: 22,
          }}>
          LEAGUE HUB
        </Text>

        <FontAwesome5
          style={{ position: 'absolute', right: 0, padding: 15 }}
          name="cog"
          size={24}
          color={jaune}
          onPress={() => navigation.openDrawer()}
        />
      </ImageBackground>

      <TopTab.Navigator
        tabBarOptions={{
          scrollEnabled: true,
          labelStyle: {
            fontSize: 11,
            color: jaune,
            fontWeight: '800',
          },
          tabStyle: {
            width: Dimensions.get('window').width / 3,
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
        source={require('../images/cfglheader.png')}
        style={{
          height: 50,

          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode={'cover'}>
        <Text
          style={{
            color: jaune,
            fontFamily: 'Monda',
            fontSize: 15,
            fontWeight: '700',
            lineHeight: 22,
            alignSelf: 'center',
          }}>
          NEWSFEEDS
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
        source={require('../images/cfglheader.png')}
        style={{
          height: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode={'cover'}>
        <Text
          style={{
            color: jaune,
            fontFamily: 'Monda',
            fontSize: 15,
            fontWeight: '700',
            lineHeight: 22,
          }}>
          PROFILE SETTINGS
        </Text>
        <Ionicons
          style={{
            position: 'absolute',
            left: 0,
            top: 18,
            paddingRight: 50,
            paddingLeft: 3,
          }}
          name="ios-arrow-back"
          size={24}
          color={jaune}
          onPress={() => navigation.goBack()}
        />
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
        source={require('../images/cfglheader.png')}
        style={{
          height: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode={'cover'}>
        <Text
          style={{
            color: jaune,
            fontFamily: 'Monda',
            fontSize: 15,
            fontWeight: '700',
            lineHeight: 22,
          }}>
          CFGL CONFERENCE
        </Text>
        <Ionicons
          style={{
            position: 'absolute',
            left: 0,
            top: 18,
            paddingRight: 50,
            paddingLeft: 3,
          }}
          name="ios-arrow-back"
          size={24}
          color={jaune}
          onPress={() => navigation.goBack()}
        />
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
        source={require('../images/cfglheader.png')}
        style={{
          height: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode={'cover'}>
        <Text
          style={{
            color: jaune,
            fontFamily: 'Monda',
            fontSize: 15,
            fontWeight: '700',
            lineHeight: 22,
          }}>
          NFL WEEK SCORES
        </Text>
        <Ionicons
          style={{
            position: 'absolute',
            left: 0,
            top: 18,
            paddingRight: 50,
            paddingLeft: 3,
          }}
          name="ios-arrow-back"
          size={24}
          color={jaune}
          onPress={() => navigation.goBack()}
        />
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
          {props.hasBoarded == false ? (
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
            options={({ navigation, route }) => ({
              headerShown: false,
              headerMode: 'none',
            })}
          />
        </>
      ) : (
        <>
          {props.bowlSeason == true ? (
            <>
              <Stack.Screen
                name="MyHomeTabsBowl"
                component={MyHomeTabsBowl}
                options={{
                  headerShown: false,
                  headerMode: 'none',
                }}
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
            </>
          )}

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
  const { user, logged, hasBoarded, bowlSeason } = state.user
  return { user, logged, hasBoarded }
}

export default connect(mapStateToProps, {})(App)
