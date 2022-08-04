import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import _ from "lodash";
import { Ionicons } from "react-native-vector-icons";
import { connect } from "react-redux";
import { jaune, gris } from "../styles/colors";
import { Header } from "../components";
import { updateUserInfo } from "../redux/actions/user";
import { gameString } from '../utils/functions'
class Shortlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      list: [
        {
          value: "power game",
          label: "POWER CONFERENCE GAMES (AAC)",
        },
        {
          value: "binding game",
          label: "BINDING CONFERENCE GAMES",
        },
        { value: "pick", label: "FREE GAMES" },
      ],
      favorites:
        this.props.user && this.props.user.favorites
          ? this.props.user.favorites
          : [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.favorites !== this.props.user.favorites) {
      this.setState({ favorites: this.props.user.favorites });
    }
  }

  betList = (bets, type) => {
    let bet = bets.filter((i) => i.type.value.includes(type));
    if (bet.length > 0) {
      return bet;
    } else {
      return [];
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    //alert("ll");

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 2000);
  };
  render() {

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        <Header
          title={`POWER CONFERENCE GAMES (${this.props.user && this.props.user.conference
            ? this.props.user.conference.conferenceName
            : ""
            } -   NFC) `}
        />
        {/* item.AwayTeamInfo.Division === this.props.user.conference.name || */}
        {this.state.favorites.map((item, index) => {
          if ((item.HomeTeamInfo.Division === this.props.user.conference.name || item.AwayTeamInfo.Division === this.props.user.conference.name) && item.HomeTeamInfo.Conference === "NFC") {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  height: 43,
                  backgroundColor: gris,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 15,
                }}>
                <Text
                  style={{
                    width: "60%",
                    color: jaune,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 12,
                    fontWeight: "600",
                  }}>
                  {gameString(item)}
                </Text>
                <Text
                  style={{
                    color: jaune,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 14,
                    fontWeight: "600",
                  }}>
                  {item.DateTime.split("T")[1].substring(0, 5)}
                </Text>

                <TouchableOpacity
                  style={{ paddingHorizontal: 10 }}
                  onPress={() => {
                    _.remove(this.state.favorites, (n) => {
                      return n.GlobalGameID === item.GlobalGameID;
                    });

                    this.setState({ favorites: this.state.favorites }, () => {
                      this.props.updateUserInfo(
                        {
                          favorites: this.state.favorites,
                        },
                        this.props.user.id,
                        this.props.token
                      );
                    });
                  }}>
                  <Ionicons
                    size={26}
                    name={"ios-star"}
                    style={{}}
                    color={
                      this.state.favorites.filter(
                        (a) => a.GlobalGameID === item.GlobalGameID
                      ).length > 0
                        ? jaune
                        : "rgb(127,10,57)"
                    }
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }
        })}
        <Header title={`BINDING CONFERENCE GAMES (${this.props.user && this.props.user.conference
          ? this.props.user.conference.conferenceName
          : ""
          } -   AFC) `} />
        {this.state.favorites.map((item, index) => {
          if (item.HomeTeamInfo.Conference === "AFC") {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  height: 43,
                  backgroundColor: gris,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 15,
                }}>
                <Text
                  style={{
                    width: "60%",
                    color: jaune,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 12,
                    fontWeight: "600",
                  }}>
                  {gameString(item)}
                </Text>
                <Text
                  style={{
                    color: jaune,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 14,
                    fontWeight: "600",
                  }}>
                  {item.DateTime.split("T")[1].substring(0, 5)}
                </Text>

                <TouchableOpacity
                  style={{ paddingHorizontal: 10 }}
                  onPress={() => {
                    _.remove(this.state.favorites, (n) => {
                      return n.GlobalGameID === item.GlobalGameID;
                    });

                    this.setState({ favorites: this.state.favorites }, () => {
                      this.props.updateUserInfo(
                        {
                          favorites: this.state.favorites,
                        },
                        this.props.user.id,
                        this.props.token
                      );
                    });
                  }}>
                  <Ionicons
                    size={26}
                    name={"ios-star"}
                    style={{}}
                    color={
                      this.state.favorites.filter(
                        (a) => a.GlobalGameID === item.GlobalGameID
                      ).length > 0
                        ? jaune
                        : "rgb(127,10,57)"
                    }
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }

        })}
        <Header title={"FREE GAMES"} />
        {this.state.favorites.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              height: 43,
              backgroundColor: gris,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 15,
            }}>
            <Text
              style={{
                width: "60%",
                color: jaune,
                color: "#edd798",
                fontFamily: "Arial",
                fontSize: 12,
                fontWeight: "600",
              }}>
              {gameString(item)}
            </Text>
            <Text
              style={{
                color: jaune,
                color: "#edd798",
                fontFamily: "Arial",
                fontSize: 14,
                fontWeight: "600",
              }}>
              {item.DateTime.split("T")[1].substring(0, 5)}
            </Text>

            <TouchableOpacity
              style={{ paddingHorizontal: 10 }}
              onPress={() => {
                _.remove(this.state.favorites, (n) => {
                  return n.GlobalGameID === item.GlobalGameID;
                });

                this.setState({ favorites: this.state.favorites }, () => {
                  this.props.updateUserInfo(
                    {
                      favorites: this.state.favorites,
                    },
                    this.props.user.id,
                    this.props.token
                  );
                });
              }}>
              <Ionicons
                size={26}
                name={"ios-star"}
                style={{}}
                color={
                  this.state.favorites.filter(
                    (a) => a.GlobalGameID === item.GlobalGameID
                  ).length > 0
                    ? jaune
                    : "rgb(127,10,57)"
                }
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, token } = state.user;
  const { bets } = state.game;
  return { user, bets, token };
};
export default connect(mapStateToProps, { updateUserInfo })(Shortlist);
