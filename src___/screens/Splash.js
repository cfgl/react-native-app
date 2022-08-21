import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image, ActivityIndicator
} from "react-native";

import { jaune, noir } from "../styles/colors";
import { connect } from "react-redux";
import { setWeekDate } from "../redux/actions/game";
class Splash extends Component {
  constructor(props) {
    super(props);

    setTimeout(() => {
      if (this.props.logged && this.props.hasBoarded) {
        this.props.navigation.navigate("HOME");
      } else if (!this.props.hasBoarded) {
        this.props.navigation.navigate("Onboarding");
      } else {
        this.props.navigation.navigate("Signin");

      }

    }, 2000);
  }

  componentDidMount() {
    this.props.setWeekDate();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: noir,
        }}>
        {/* <Text style={styles.FASTKASH}>FASTKASH</Text> */}
        {/* <Image
          source={require("../images/fastkashimg.png")}
          style={{ width: 100, height: 100, resizeMode: "contain" }}
        />
        <Image
          source={require("../images/fastkashlogo.png")}
          style={{ width: 250, height: 100, resizeMode: "contain" }}
        /> */}


        <ActivityIndicator color={"#fff"} style={{ color: "#fff" }} />
      </View>
    );
  }
}


const mapStateToProps = (state) => ({
  logged: state.user.logged,
  hasBoarded: state.user.hasBoarded,
  user: state.user.user,
});

const mapDispatchToProps = { setWeekDate };

export default connect(mapStateToProps, mapDispatchToProps)(Splash);



const styles = StyleSheet.create({
  FASTKASH: {
    backgroundColor: "transparent",
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
  },
});
