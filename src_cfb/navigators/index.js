import * as React from 'react'
import { ImageBackground, Text, View, Image, TouchableOpacity } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { Profile } from '../screens'
import { Ionicons, FontAwesome5 } from 'react-native-vector-icons'
import { connect } from 'react-redux'
import { logoutUser } from '../redux/actions/user'
import { jaune, noir, gris } from '../styles/colors'
import { SafeAreaView } from 'react-navigation'
import App from './naveBase'
import { Notification, Signin, Signup, ForgetPassword, Onboarding, Splash, UsersConditions, About } from '../screens'
import { SCREEN_WIDTH } from '../utils/variables'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgba(255, 255, 255,0.2)',
    background: gris,
  },
}

const Stack = createStackNavigator()

function MyProfile({ navigation }) {
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
            {'PROFILE SETTINGS'}
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
          component={Profile}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

function MyNotification({ navigation }) {
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
            {'NOTIFICATIONS'}
          </Text>
        </View>

        <View style={{ width: 60, alignItems: 'flex-end', marginRight: 5 }}>
          <FontAwesome5
            style={{}}
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
          component={Notification}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

function MyAbout({ navigation }) {
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
            {'ABOUT'}
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
          name="About"
          component={About}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const Drawer = createDrawerNavigator()

function MyDrawer(props) {
  return (
    <NavigationContainer theme={MyTheme}>
      {props.logged === false ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerShown: false,
              headerMode: 'none',
            }}
          />
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{
              headerShown: false,
              headerMode: 'none',
              gestureEnabled: false,
            }}
          />

          <Stack.Screen
            name="Signin"
            component={Signin}
            options={{
              headerShown: false,
              headerMode: 'none',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPassword}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={({ navigation, route }) => ({
              gestureEnabled: false,
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
            name="usersConditions"
            component={UsersConditions}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Drawer.Navigator
          drawerContent={props_ => (
            <DrawerContentScrollView>
              <DrawerItemList {...props_} />

              <DrawerItem
                label="LOGOUT"
                labelStyle={{
                  color: jaune,
                  fontSize: RFValue(12),
                  fontWeight: '700',
                }}
                onPress={() => props.logoutUser()}
              />
            </DrawerContentScrollView>
          )}
          drawerStyle={{
            backgroundColor: '#950338',
            width: RFValue(250),
          }}
          hideStatusBar={false}
          drawerPosition="right"
          drawerContentOptions={{
            activeTintColor: '#fff',
            inactiveTintColor: jaune,
            activeBackgroundColor: 'transparent',
            itemStyle: {},
            labelStyle: {
              fontSize: RFValue(12),
              fontWeight: '700',
              fontFamily: 'monda',
            },
          }}>
          <Drawer.Screen
            screenOptions={{
              show: false,
            }}
            labelStyle={{}}
            name="HOME"
            component={App}
            options={{
              headerShown: false,
            }}
          />

          <Drawer.Screen
            name="PROFILE SETTINGS"
            component={MyProfile}
            options={{
              headerShown: false,
            }}
          />

          <Drawer.Screen
            name="NOTIFICATIONS SETTINGS"
            component={MyNotification}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="ABOUT CFGL"
            component={MyAbout}
            options={{
              headerShown: false,
            }}
          />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  )
}

const mapStateToProps = state => {
  const { user, logged, hasBoarded } = state.user
  return { user, logged, hasBoarded }
}

export default connect(mapStateToProps, { logoutUser })(MyDrawer)
