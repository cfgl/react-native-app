import React, { Component } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-navigation";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/variables";
import { jaune, noir, gris } from "../styles/colors";
import { Checkbox, Switch, Portal, Button, Provider } from "react-native-paper";
import { Ionicons } from "react-native-vector-icons";

export default class search extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView
        style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ScrollView>
          <Text></Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
