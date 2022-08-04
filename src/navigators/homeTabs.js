import React from "react";
import {createAppContainer} from "react-navigation";
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from "react-navigation-tabs";
import {createStackNavigator} from "react-navigation-stack";
import {Dimensions, Image, View} from "react-native";
import {FontAwesome5} from "react-native-vector-icons";
import {Search, Pick, Profile} from "../screens";
import {jaune, noir, gris} from "../styles/colors";

const Toptab = createMaterialTopTabNavigator(
  {
    Pick: {
      screen: Pick,
    },
    Shortlist: {
      screen: Search,
    },
    Games: {
      screen: Search,
    },
    PickSheet: {
      screen: Search,
    },
  },
  {
    tabBarOptions: {
      scrollEnabled: true,
      labelStyle: {
        fontSize: 12,
      },
      tabStyle: {
        width: Dimensions.get("window").width / 4,
      },
      style: {
        backgroundColor: noir,
      },
      indicatorStyle: {
        backgroundColor: jaune,
        height: 5,
      },
    },
  },
  {
    initialRouteName: "Tab1",
  }
);

const HomeTabs = createBottomTabNavigator(
  {
    Feeds: {
      screen: Toptab,
      navigationOptions: () => ({
        tabBarIcon: ({focused}) => {
          return (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      paddingHorizontal: 20,
                      paddingVertical: 7,
                    }
                  : {}
              }
              name="newspaper"
              size={25}
              color={jaune}
              //{focused ? "rgb(237,214,156)" : "rgb(237,214,156)"}
            />
          );
        },
      }),
    },

    Picks: {
      screen: Toptab,
      navigationOptions: () => ({
        tabBarIcon: ({focused}) => {
          return (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      paddingHorizontal: 20,
                      paddingVertical: 7,
                    }
                  : {}
              }
              name="edit"
              size={25}
              color={jaune}
            />
          );
        },
      }),
    },
    Search: {
      screen: Search,
      navigationOptions: () => ({
        tabBarIcon: ({focused}) => {
          return (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      paddingHorizontal: 20,
                      paddingVertical: 7,
                    }
                  : {}
              }
              name="users"
              size={25}
              color={jaune}
            />
          );
        },
      }),
    },
    Profile: {
      screen: Profile,
      navigationOptions: () => ({
        tabBarIcon: ({focused}) => {
          return (
            <FontAwesome5
              style={
                focused
                  ? {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      paddingHorizontal: 20,
                      paddingVertical: 7,
                    }
                  : {}
              }
              name="info"
              size={25}
              color={jaune}
            />
          );
        },
      }),
    },
  },
  {
    lazy: true,
    tabBarPosition: "bottom",
    initialRouteName: "Feeds",
    animationEnabled: true,
    //
    useNativeAnimations: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      showIndicator: false,
      position: "absolute",
      bottom: 0,
      left: 0,
      titleStyle: {
        justifyContent: "center",
        alignItems: "center",
      },
      style: {
        borderWidth: 0,
        paddingTop: 10,
        height: 60,
        backgroundColor: noir,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        shadowColor: "#000000",
        shadowOpacity: 0.6,
        elevation: 9,
        shadowRadius: 5,
        shadowOffset: {
          height: 4,
          width: 0,
        },
        borderTopColor: "transparent",
      },
      activeBackgroundColor: "transparent",
      inactiveBackgroundColor: "#fff",

      labelStyle: {
        fontFamily: "Monda",
      },
      iconStyle: {},
      tabStyle: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      },
    },
  }
);

export default createAppContainer(HomeTabs);
