import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import { Signin, Signup } from "../screens";

const Stack = createStackNavigator(
  {
    Signin: {
      screen: Signin,
      navigationOptions: () => ({
        headerShown: false
      })
    },
    Signup: {
      screen: Signup,
      navigationOptions: () => ({
        headerShown: false
      })
    }
  },
  {
    initialRouteName: "Signin"
  }
);

export default createAppContainer(Stack);
