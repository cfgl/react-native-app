import React, {Component} from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Text,
  StatusBar,
  StyleSheet,
} from "react-native";
import {Switch, Checkbox} from "react-native-paper";
import _ from "lodash";
import {Ionicons} from "react-native-vector-icons";
import {MyPicks, MyGames} from "../components";
import {connect} from "react-redux";
import {logoutUser} from "../redux/actions/user";
import {Popover, PopoverController} from "react-native-modal-popover";
import {
  getCurrentWeekGame,
  saveBet,
  updateBet,
  saveParlay,
  deleteParlay,
} from "../redux/actions/game";
import {data} from "../datas/games";
import {jaune, noir, gris} from "../styles/colors";
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
class Pick extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
          value: "game 1",
          label: "Game 1 | 25 points",
          point: 25,
        },
        {
          value: "game 2",
          label: "Game 2 | 20 points",
          point: 20,
        },
        {
          value: "game 3",
          label: "Game 3 | 15 points",
          point: 55,
        },
        {
          value: "game 4",
          label: "Game 4 | 10 points",
          point: 10,
        },
        {
          value: "game 5",
          label: "Game 5 | 5 points",
          point: 5,
        },
      ],
      championshipGame: [],
    };
  }

  componentDidMount() {
    this.props.getCurrentWeekGame(
      this.props.currentYear,
      this.props.currentWeek
    );
    //alert(data.length);
  }

  saved = (bets, week, year, type) => {
    let bet = bets.filter(
      (i) => i.week == week && i.season == year && i.type.value == type
    );
    if (bet.length > 0) {
      return bet[0];
    } else {
      return {
        game: {},
        method: {},
        locked: false,
        quickpick: false,
        saved: true,
      };
    }
  };
  onRefresh = () => {
    this.setState({refreshing: true});
    this.props.getCurrentWeekGame(
      this.props.currentYear,
      this.props.currentWeek
    );
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 2000);
  };
  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        <StatusBar backgroundColor={gris} barStyle="light-content" />
        <View
          style={{
            backgroundColor: gris,

            width: "95%",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 20,
            paddingHorizontal: 10,
            marginVertical: 20,
            alignSelf: "center",
          }}>
          <Text
            style={{
              color: "#edd798",
              fontFamily: "Monda",
              fontSize: 35,
              fontWeight: "400",
              lineHeight: 40,
              textAlign: "center",
              marginTop: 20,
            }}>
            {"Select 5 \nChampionship Games"}
          </Text>

          <Text
            style={{
              width: "84%",
              color: "#edd798",
              fontFamily: "Monda",
              fontSize: 14,
              lineHeight: 24,
              marginTop: 10,
              textAlign: "center",
              marginTop: 20,
            }}>
            {
              "Each game has a set amount of points ranging \nfrom 5 to 25 pts. You can always re-  assign those \npoints value later on."
            }
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            paddingTop: 20,
          }}>
          {this.state.types.map((item, index) => {
            let save = this.saved(
              this.props.bets,
              this.props.currentWeek + "",
              this.props.currentYear + "",
              item.value
            );

            return (
              <View>
                <MyPicks
                  key={index}
                  index={index}
                  name={item.label}
                  favorites={
                    this.props.user && this.props.user.favorites
                      ? this.props.user.favorites.filter(
                          (i) => i.Week === this.props.currentWeek
                        )
                      : []
                  }
                  savedValue={this.saved(
                    this.props.bets,
                    this.props.currentWeek,
                    this.props.currentYear,
                    item.value
                  )}
                  data={this.props.games}
                  onChoose={(data) => {
                    data.game = {
                      AwayTeamName: data.game.AwayTeamName,
                      HomeTeam: data.game.HomeTeam,
                      DateTime: data.game.DateTime,
                      Stadium: data.game.Stadium.Name,
                    };
                    data.type = item;
                    data.season = `${this.props.currentYear}`;
                    data.quickpick = data.quick;
                    data.user = this.props.user._id;

                    let count = _.findIndex(
                      this.state.championshipGame,
                      (f) => f.type.value === data.type.value
                    );

                    console.log(count);
                    if (count === -1) {
                      this.state.championshipGame.push(data);
                      this.setState({...this.state.championshipGame}, () => {
                        console.log(
                          JSON.stringify(this.state.championshipGame, null, 2)
                        );
                      });
                    } else {
                      this.state.championshipGame[count] = data;
                      this.setState({...this.state.championshipGame}, () => {
                        console.log(
                          JSON.stringify(this.state.championshipGame, null, 2)
                        );
                      });
                    }

                    //alert(JSON.stringify(data));
                  }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const {user, token, logged} = state.user;
  const {games, bets, currentYear, currentWeek, myParlay} = state.game;
  return {user, token, logged, games, bets, currentYear, currentWeek, myParlay};
};
export default connect(mapStateToProps, {
  logoutUser,
  getCurrentWeekGame,
  saveBet,
  updateBet,
  saveParlay,
  deleteParlay,
})(Pick);
