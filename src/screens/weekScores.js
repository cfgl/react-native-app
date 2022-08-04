import React, { Component } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Text,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Switch, Checkbox } from "react-native-paper";
import { Ionicons } from "react-native-vector-icons";
import { MyPicks, MyGames } from "../components";
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/user";
import { Popover, PopoverController } from "react-native-modal-popover";
import Championship from "./championship";
import {
  getCurrentWeekGame,
  saveBet,
  updateBet,
  saveParlay,
  deleteParlay,
  myParlays,
} from "../redux/actions/game";
import { data } from "../datas/games";
import { jaune, noir, gris } from "../styles/colors";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/variables";

import { GroupByGroup, gameString } from "../utils/functions";
const styles = StyleSheet.create({
  app: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c2ffd2",
  },
  content: {
    padding: 16,
    backgroundColor: jaune,
    borderRadius: 8,
  },
  arrow: {
    borderTopColor: jaune,
  },
  background: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
});


let day = new Date().getDay();

class Pick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      off: false,
      isSwitchOn:
        this.props.myParlay &&
          this.props.myParlay.filter((i) => i.week === this.props.currentWeek)
            .length == 1
          ? true
          : false,
      checked: false,
      visible: false,
      refreshing: false,
      types: [
        {
          value: "power game",
          label: "Power conference",
          point: 10,
        },
        {
          value: "binding game",
          label: "Binding conference",
          point: 10,
        },
        { value: "pick1", label: "Free pick #1", point: 7 },
        { value: "pick2", label: "Free pick #2", point: 7 },
        { value: "pick3", label: "Free pick #3", point: 7 },
        { value: "dog game", label: "dog game", point: 0 },
      ],
    };
  }

  componentDidMount() {
    if (day === 0 || day === 1 || day === 4 || day === 5 || day === 6) {
      setInterval(() => {
        this.props.getCurrentWeekGame(this.props.currentYear, this.props.currentWeek);
      }, 60000);
    }

    console.log(JSON.stringify(this.props.route, null, 2));

    this.props.getCurrentWeekGame(
      this.props.currentYear,
      this.props.currentWeek
    );





  }


  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.getCurrentWeekGame(
      this.props.currentYear,
      this.props.currentWeek
    );

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 2000);
  };

  componentDidUpdate(prevProps) {
    if (this.props.route.name !== prevProps.route.name)
      console.log(JSON.stringify(this.props.route, null, 2));

  }

  render() {

    return (
      <ScrollView
        style={{
          flex: 1,
          paddingVertical: 20,

        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        <StatusBar backgroundColor={gris} barStyle="light-content" />
        <Text style={{ color: "#fff", marginHorizontal: 20, marginBottom: 10 }}>Last update: {this.props.lastUpdate.toLocaleString()}</Text>
        {this.props.games.map(game => <View>
          <View
            style={{
              width: SCREEN_WIDTH - 40,

              backgroundColor: jaune,
              paddingVertical: 20,
              paddingHorizontal: 20,
              marginBottom: 20,
              alignSelf: "center"
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#950338",
                height: 30,
                alignItems: "center",
                paddingHorizontal: 10,
              }}>
              <View
                style={{
                  flexDirection: "row",
                }}>
                <Text style={{ color: jaune, fontSize: 15, fontWeight: "bold" }}>
                  {new Date(game.Date).toLocaleString()}
                </Text>

              </View>
              <Text
                style={{
                  color: jaune,
                }}>
                {game.Status.toUpperCase()}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#191919",
                  fontWeight: "900",
                  lineHeight: 22,
                }}>
                <Text style={{ color: jaune, fontSize: 15 }}>
                  {game.HomeTeamMoneyLine < game.AwayTeamMoneyLine ? game.HomeTeam : game.AwayTeam}
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 0,
                  flex: 1,
                }}>
                {game && game.GameKey ? (
                  <Text
                    style={{
                      color: noir,
                      fontSize: 30,
                      fontFamily: "Monda",
                      fontWeight: "bold",
                    }}>
                    {game.HomeTeamMoneyLine < game.AwayTeamMoneyLine ? game.HomeScore : game.AwayScore}
                    {" -  "}
                    {game.AwayTeamMoneyLine > game.HomeTeamMoneyLine ? game.AwayScore : game.HomeScore}
                  </Text>
                ) : (
                    <Text
                      style={{
                        color: noir,
                        fontSize: 30,
                        fontFamily: "Monda",
                        fontWeight: "bold",
                      }}>
                      {"0 -  0"}
                    </Text>
                  )}

              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#191919",
                }}>
                <Text style={{ color: jaune, fontSize: 15 }}>
                  {game.AwayTeamMoneyLine > game.HomeTeamMoneyLine ? game.AwayTeam : game.HomeTeam}
                </Text>
              </View>
            </View>


          </View>
        </View>
        )}



        <View style={{ height: 20 }} />
      </ScrollView>
    );

  }
}

const mapStateToProps = (state) => {
  const { user, token, logged, bowlSeason } = state.user;
  const { weekGames, bets, currentYear, currentWeek, myParlay, games, lastUpdate } = state.game;
  return {
    user,
    bowlSeason,
    token,
    logged,
    weekGames,
    bets,
    currentYear,
    currentWeek,
    myParlay,
    games,
    lastUpdate
  };
};
export default connect(mapStateToProps, {
  logoutUser,
  getCurrentWeekGame,
  saveBet,
  updateBet,
  saveParlay,
  deleteParlay,

  myParlays,
})(Pick);
