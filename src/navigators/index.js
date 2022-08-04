import * as React from "react";
import {
  ImageBackground,
  Text,
  StatusBar,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Profile } from "../screens";
import { Ionicons, FontAwesome5 } from "react-native-vector-icons";
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/user";
import { jaune, noir, gris } from "../styles/colors";
import { SafeAreaView } from "react-navigation";
import App from "./index_";
import {
  Logout,
  Notification,
  Signin,
  Signup,
  ForgetPassword,
  Onboarding,
  Splash
} from "../screens";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "rgba(255, 255, 255,0.2)",
    background: gris,
  },
};

const Stack = createStackNavigator();

function MyProfile({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../images/cfglheader.png")}
        style={{
          height: 50,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        resizeMode={"cover"}>
        <Text
          style={{
            marginLeft: 60,
            color: jaune,
            fontFamily: "Monda",
            fontSize: 15,
            fontWeight: "700",
            lineHeight: 22,
          }}>
          PROFILE SETTINGS
        </Text>
        <Ionicons
          style={{
            position: "absolute",
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
        <FontAwesome5
          style={{ position: "absolute", right: 0, padding: 15 }}
          name="cog"
          size={24}
          color={jaune}
          onPress={() => navigation.openDrawer()}
        />
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
  );
}

function MyNotification({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../images/cfglheader.png")}
        style={{
          height: 50,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        resizeMode={"cover"}>
        <Text
          style={{
            marginLeft: 60,
            color: jaune,
            fontFamily: "Monda",
            fontSize: 15,
            fontWeight: "700",
            lineHeight: 22,
          }}>
          NOTIFICATIONS
        </Text>
        <Ionicons
          style={{
            position: "absolute",
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
        <FontAwesome5
          style={{ position: "absolute", right: 0, padding: 15 }}
          name="cog"
          size={24}
          color={jaune}
          onPress={() => navigation.openDrawer()}
        />
        {/* <Ionicons
          style={{
            position: "absolute",
            right: 0,
            paddingRight: 20,
            paddingLeft: 3,
          }}
          name="ios-log-out"
          size={30}
          color={jaune}
          onPress={() => this.props.logoutUser()}
        /> */}
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
  );
}

const Drawer = createDrawerNavigator();
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView>
      <DrawerItemList {...props} />
      <DrawerItem
        label="LOGOUT"
        labelStyle={{
          color: jaune,
          fontSize: 14,
          fontWeight: "700",
          lineHeight: 22,
        }}
        onPress={() => console.log(props)}
      />
    </DrawerContentScrollView>
  );
}


// function MyDrawer(props) {

//   return (
//     <NavigationContainer theme={MyTheme}>

//       <Stack.Navigator>
//         <Stack.Screen
//           name="Splash"
//           component={Splash}
//           options={{
//             headerShown: false,
//             headerMode: "none",
//           }}
//         />

//       </Stack.Navigator>
//     </NavigationContainer>
//   )
// }
function MyDrawer(props) {

  return (
    <NavigationContainer theme={MyTheme}>
      {props.logged == false ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerShown: false,
              headerMode: "none",
            }}
          />
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={
              {
                headerShown: false,
                headerMode: "none",
                gestureEnabled: false,
              }
            }
          />

          <Stack.Screen
            name="Signin"
            component={Signin}
            options={{
              headerShown: false,
              headerMode: "none",
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
                borderBottomColor: "transparent",
                borderBottomWidth: 7,
              },
            })}
          />
        </Stack.Navigator>
      )
        :

        (
          <Drawer.Navigator
            drawerContent={(props_) => (
              <DrawerContentScrollView>
                <DrawerItemList {...props_} />
                <DrawerItem
                  label="LOGOUT"
                  labelStyle={{
                    color: jaune,
                    fontSize: 14,
                    fontWeight: "700",
                    lineHeight: 22,
                  }}
                  onPress={() => props.logoutUser()}
                />
              </DrawerContentScrollView>
            )}
            drawerStyle={{
              backgroundColor: "#950338",
              width: 300,
            }}
            labelStyle={{ color: "red" }}
            hideStatusBar={false}
            drawerPosition="right"
            drawerContentOptions={{
              activeTintColor: "#fff",
              inactiveTintColor: jaune,
              activeBackgroundColor: "transparent",
              itemStyle: {},
              labelStyle: {
                fontSize: 14,
                fontWeight: "700",
                fontFamily: "monda",
                lineHeight: 22,
              },
            }}>




            <Drawer.Screen
              screenOptions={{
                show: false,
              }}
              labelStyle={{ fontSize: 40 }}
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

          </Drawer.Navigator>
        )
      }

    </NavigationContainer >
  );
}

const mapStateToProps = (state) => {
  const { user, logged, hasBoarded } = state.user;
  return { user, logged, hasBoarded };
};

export default connect(mapStateToProps, { logoutUser })(MyDrawer);
