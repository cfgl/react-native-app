import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

import ActionSheet from "react-native-actionsheet";
import { SCREEN_WIDTH } from "../utils/variables";
import { jaune, noir, gris } from "../styles/colors";
import { Ionicons } from "react-native-vector-icons";
import { connect } from "react-redux";
import { getWeekGames } from "../redux/actions/game";
import { getConferencesTeams } from "../redux/actions/user";
import { updateUserInfo } from "../redux/actions/user";
import { gameString } from '../utils/functions'
import _ from "lodash";
const weekList = [
  "Week 1",
  "Week 2",
  "Week 3",
  "Week 4",
  "Week 5",
  "Week 6",
  "Week 7",
  "Week 8",
  "Week 9",
  "Week 10",
  "Week 11",
  "Week 12",
  "Week 13",
  "Week 14",
  "Week 15",
  "Week 16",
  "Week 17",
  "Cancel",
];
const confrenceList = [
  "Conf 1",
  "Conf 2",
  "Conf 3",
  "Conf 4",
  "Conf 5",
  "Conf 6",
  "Cancel",
];
class Spreads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      conference: "ALL",
      week: "Week " + (this.props.seasonStatus && this.props.seasonStatus === "STARTED" ? this.props.currentWeek : 1),
      bets: [],
      refreshing: false,
      favorites: this.props.user.favorites ? this.props.user.favorites : [],
      weekSelected: this.props.currentWeek
    };
    this.props.getWeekGames(this.props.currentYear, this.props.currentWeek);

  }
  componentDidMount() {

    if (this.props.user.conference) {
      this.props.getConferencesTeams(
        "ALL",
        this.props.token
      );
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.favorites !== this.props.user.favorites) {
      this.setState({ favorites: this.props.user.favorites });
    }
  }

  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });

  showWeek = () => {
    this.ActionSheet.show();
  };
  showConference = () => {
    this.conference.show();
  };

  bestGroupBy(bets, conference) {
    //alert(JSON.stringify(conference.Teams));
    let data = (this.state.conference !== "ALL" ? bets.filter(f => f.HomeTeamInfo.Division === this.state.conference || f.AwayTeamInfo.Division === this.state.conference) : bets).sort(function (a, b) {
      return new Date(b.DateTime) - new Date(a.DateTime);
    });

    // this gives an object with dates as keys
    const groups = data.reduce((groups, game) => {
      const date = game.DateTime.split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(game);

      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        games: groups[date],
      };
    });

    //console.log(JSON.stringify(groupArrays, null, 2));
    console.log("===================");

    return groupArrays;
  }


  onRefresh = () => {
    this.setState({ refreshing: true });

    this.props.getWeekGames(this.props.currentYear, this.state.weekSelected);
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 2000);
  };
  render() {
    const { visible, week, conference } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <MyPicks
          name="SELECT A WEEK AND A CONFERENCE"
          week={week}
          conference={this.state.conference}
          showWeek={() => this.showWeek()}
          showConf={() => this.showConference()}
        />
        {this.props.seasonStatus === "STARTED" ?
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              >
                <Text style={{ alignSelf: "center", color: "#fff", fontSize: 17, marginBottom: 3 }}>{this.state.week + " refreshing..."}</Text>
              </RefreshControl>
            }>
            {this.bestGroupBy(
              this.props.weekGames,
              this.props.conferenceTeams
            ).map((item, index) => (
              <View key={index}>
                <View
                  style={{
                    height: 31,
                    backgroundColor: "#edd798",
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{
                      color: "#191919",
                      fontSize: 11,
                      fontWeight: "700",
                    }}>
                    {new Date(item.games[0].DateTime).toDateString()}
                  </Text>
                </View>
                {item.games.filter(i => i.Status === "Scheduled").map((item2, index2) => {
                  return (
                    <TouchableOpacity
                      key={index2}
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
                        {gameString(item2)}
                      </Text>
                      <Text
                        style={{
                          color: jaune,
                          color: "#edd798",
                          fontFamily: "Arial",
                          fontSize: 14,
                          fontWeight: "600",
                        }}>
                        {item2.DateTime.split("T")[1].substring(0, 5)}
                      </Text>

                      <TouchableOpacity
                        style={{ paddingHorizontal: 10 }}
                        onPress={() => {

                          if (
                            this.props.user &&
                            this.props.user.conference &&
                            this.props.user.conference.conferenceID
                          ) {
                            if (
                              this.state.favorites.filter(
                                (a) => a.GlobalGameID === item2.GlobalGameID
                              ).length == 0
                            ) {
                              if (
                                this.props.user.conference.name ===
                                this.props.conferenceTeams.Conference
                              ) {
                                item2.power = true;
                              } else {
                                item2.power = false;
                              }
                              if (item2.AwayTeamMoneyLine !== null && item2.HomeTeamMoneyLine !== null)
                                this.state.favorites.push(item2);
                              else
                                alert("You can't push this game on favorite yet. No prediction found.")
                            } else {
                              _.remove(this.state.favorites, (n) => {
                                return n.GlobalGameID === item2.GlobalGameID;
                              });
                            }
                            this.setState(
                              { favorites: this.state.favorites },
                              () => {
                                this.props.updateUserInfo(
                                  {
                                    favorites: this.state.favorites,
                                  },
                                  this.props.user.id,
                                  this.props.token
                                );
                              }
                            );
                          } else {
                            alert("Please select your conference in the feeds");
                          }
                        }}>
                        <Ionicons
                          size={26}
                          name={"ios-star"}
                          style={{}}
                          color={
                            this.state.favorites.filter(
                              (a) => a.GlobalGameID === item2.GlobalGameID
                            ).length > 0
                              ? jaune
                              : "rgb(127,10,57)"
                          }
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
          : <Text
            style={{
              marginTop: 20,
              color: jaune,
              textAlign: "center",
              fontSize: 16
            }}>
            SEASON IS NOT START YET
              </Text>

        }
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={"Select the week"}
          options={weekList}
          cancelButtonIndex={17}
          // destructiveButtonIndex={1}
          onPress={(index) => {
            if (index !== 17)
              if (index + 1 >= this.props.currentWeek) {
                this.setState({ week: weekList[index], weekSelected: index + 1 }, () => {
                  this.props.getWeekGames(this.props.currentYear, index + 1);
                });
              } else {
                alert("You can only select the current week or the next");
              }
          }}
        />

        <ActionSheet
          ref={(o) => (this.conference = o)}
          title={"Select the conference."}
          options={[
            {
              conference: "All",
            },
            {
              conference: "West",
            },
            {
              conference: "South",
            },
            {
              conference: "North",
            },
            {
              conference: "East",
            },
          ]
            // .concat(_.uniqBy(this.props.conferences, "conferenceName"))
            // .concat([
            //   {
            //     name: "None",
            //     conferenceName: "Cancel",
            //     conferenceID: -1,
            //     divisionName: "",
            //   },
            // ])
            .map((i) => i.conference)}
          //tintColor={noir}
          cancelButtonIndex={12}
          //destructiveButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              this.setState(
                {
                  conference: "ALL",
                },
                () => {
                  this.props.getConferencesTeams("ALL", this.props.token);
                }
              );
            } else if (index > 0 && index < 5) {
              this.setState(
                {
                  conference: ["ALL", "West", "South", "North", "East"][index],
                  // _.uniqBy(
                  //   this.props.conferences,
                  //   "conferenceName"
                  // )[index - 1],
                },
                () => {
                  this.props.getConferencesTeams(
                    ["ALL", "West", "South", "North", "East"][index], //this.state.conference.conferenceName,
                    this.props.token
                  );
                }
              );
            }
          }}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={visible}
          onDismiss={this._hideModal}
          style={{ backgroundColor: "red" }}>
          <View
            style={{
              width: SCREEN_WIDTH - 100,
              flex: 1,
              backgroundColor: noir,
              paddingTop: 30,
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: jaune,
                borderBottomWidth: 1,
                height: 40,
              }}>
              <Text style={{ color: jaune, fontSize: 15, fontWeight: "bold" }}>
                {"Modal"}
              </Text>
              <Text
                style={{
                  marginBottom: 20,
                  color: jaune,
                }}
                onPress={this._hideModal}>
                Close
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

class MyPicks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      isSwitchOn: false,
    };
  }
  render() {
    const { checked, isSwitchOn } = this.state;
    const { name, week, conference, showWeek, showConf } = this.props;
    return (
      <View
        style={{
          width: SCREEN_WIDTH - 40,
          backgroundColor: noir,
          paddingVertical: 20,
          paddingHorizontal: 20,
          marginVertical: 20,
          alignSelf: "center",
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",

            marginVertical: 20,
          }}>
          <TouchableOpacity
            onPress={showWeek}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 50,
              width: "49%",
              backgroundColor: gris,
              alignItems: "center",
              paddingHorizontal: 20,
            }}>
            <Text style={{ color: jaune, fontSize: 12, fontWeight: "400" }}>
              {week}
            </Text>
            <Ionicons name={"ios-arrow-down"} color={jaune} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showConf}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 50,
              width: "49%",
              backgroundColor: gris,
              alignItems: "center",
              paddingHorizontal: 20,
            }}>
            <Text style={{ color: jaune, fontSize: 12, fontWeight: "400" }}>
              {conference ? conference : ""}
            </Text>
            <Ionicons name={"ios-arrow-down"} color={jaune} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, conferenceTeams, conferences, token } = state.user;
  const { bets, weekGames, currentYear, currentWeek,
    weekstartdate,
    seasonStatus } = state.game;
  return {
    user,
    bets,
    weekGames,
    conferenceTeams,
    conferences,
    currentYear,
    currentWeek,
    token,

    weekstartdate,
    seasonStatus
  };
};
export default connect(mapStateToProps, {
  getWeekGames,
  getConferencesTeams,
  updateUserInfo,
})(Spreads);
