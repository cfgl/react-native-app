import React, { Component } from "react";
import { View, Text } from "react-native";
export default class Header extends Component {
  render() {
    const { title } = this.props;
    return (
      <View
        style={{
          height: 31,
          backgroundColor: "#edd798",
          justifyContent: "center",
          paddingHorizontal: 10,
          marginTop: 20,
        }}>
        <Text
          style={{
            color: "#191919",
            fontFamily: "Monda",
            fontSize: 11,
            fontWeight: "700",
          }}>
          {title.toUpperCase()}
        </Text>
      </View>
    );
  }
}
