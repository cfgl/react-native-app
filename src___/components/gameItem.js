import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { noir, gris, jaune } from "../styles/colors";
import { Ionicons } from "react-native-vector-icons";
import { connect } from "react-redux";
import { gameString } from '../utils/functions'
import _ from "lodash";
class GameItem extends Component {
  constructor(props) {
    super(props);
    this.state = { hasStar: this.props.stared };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.favorites !== this.props.user.favorites) {
      this.setState({
        hasStar:
          JSON.stringify(this.props.user.favorites).indexOf(
            this.props.game.GlobalGameID
          ) > -1
            ? true
            : false,
      });
    }
  }

  render() {
    const { color, index, onSelected, game, clickable } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          //if (clickable == true) {
          onSelected(index);
          //}
        }}
        style={{
          height: 43,
          backgroundColor: color == 1 ? noir : gris,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 15,
        }}>
        <Text
          style={{
            width: "60%",
            color: jaune,
            fontFamily: "Arial",
            fontSize: 12,
            fontWeight: "600",
          }}>
          {gameString(game)}
        </Text>
        <Text
          style={{
            color: jaune,
            color: "#edd798",
            fontFamily: "Arial",
            fontSize: 14,
            fontWeight: "600",
          }}>
          {game.DateTime.split("T")[0].substring(0, 10) + `  ` + game.DateTime.split("T")[1].substring(0, 5)}
        </Text>

        <View
          style={{ paddingHorizontal: 10 }}
          onPress={() => {
            // this.setState({hasStar: !this.state.hasStar}, () => {
            //   this.props.onStared(this.state.hasStar);
            // });
          }}>
          {this.state.hasStar == true ? (
            <Ionicons
              size={26}
              name={"ios-star"}
              style={{}}
              color={this.state.hasStar === true ? jaune : "rgb(127,10,57)"}
            />
          ) : (
              <View style={{ width: 20 }} />
            )}
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state) => {
  const { conference, user } = state.user;
  return { conference, user };
};
export default connect(mapStateToProps, {})(GameItem);
