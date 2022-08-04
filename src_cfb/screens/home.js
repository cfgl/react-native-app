import React, {Component} from "react";
import {Text, View} from "react-native";
import {SafeAreaView} from "react-navigation";
export default class home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Text> home test </Text>
      </View>
    );
  }
}
